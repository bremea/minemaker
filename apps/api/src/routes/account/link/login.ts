import type { ElysiaApp } from '$src/app';
import { TokenSchema } from '$src/lib/types';
import { checkIpTrusted, createSession, getUserByPlayerUUID, InternalApiError, updateTrustedIpLastLogin, UserSchema } from '@minemaker/db';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.get(
		'/',
		async ({ query, ip, jwt, snowflake, headers }) => {
			if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip === '') {
				ip = '127.0.0.1';
			}

			if (!query.code) {
				throw new InternalApiError(400, 'Missing oauth code');
			}

			const accessTokenRequest = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: `client_id=${process.env.MICROSOFT_CLIENT_ID}&scope=XboxLive.signin%20XboxLive.offline_access&code=${query.code}&redirect_uri=${process.env.MICROSOFT_CLIENT_LOGIN_REDIRECT_URI}&grant_type=authorization_code&client_secret=${process.env.MICROSOFT_CLIENT_SECRET}`
			});

			try {
				var accessTokenResponse = await accessTokenRequest.json();
			} catch (e) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			if (accessTokenResponse['error'] != undefined) {
				console.log(accessTokenResponse);
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			/* Fetch UUID & username from minecraft API */

			const xboxAuth = await fetch('https://user.auth.xboxlive.com/user/authenticate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					Properties: {
						AuthMethod: 'RPS',
						SiteName: 'user.auth.xboxlive.com',
						RpsTicket: `d=${accessTokenResponse.access_token}`
					},
					RelyingParty: 'http://auth.xboxlive.com',
					TokenType: 'JWT'
				})
			});

			if (!xboxAuth.ok) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			try {
				var xboxAuthResponse = await xboxAuth.json();
			} catch (e) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			const xblToken = xboxAuthResponse['Token'];
			const userHash = xboxAuthResponse['DisplayClaims']['xui'][0]['uhs'];

			const xtsTokenRequest = await fetch('https://xsts.auth.xboxlive.com/xsts/authorize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					Properties: {
						SandboxId: 'RETAIL',
						UserTokens: [xblToken]
					},
					RelyingParty: 'rp://api.minecraftservices.com/',
					TokenType: 'JWT'
				})
			});

			if (!xtsTokenRequest.ok) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			try {
				var xtsTokenResponse = await xtsTokenRequest.json();
			} catch (e) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			const xtsToken = xtsTokenResponse['Token'];

			const minecraftAuthRequest = await fetch('https://api.minecraftservices.com/authentication/login_with_xbox', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					identityToken: `XBL3.0 x=${userHash};${xtsToken}`
				})
			});

			if (!minecraftAuthRequest.ok) {
				throw new InternalApiError(500, 'Minecraft API returned an error');
			}

			try {
				var minecraftAuthResponse = await minecraftAuthRequest.json();
			} catch (e) {
				throw new InternalApiError(500, 'Minecraft API returned an error');
			}

			const minecraftAccessToken = minecraftAuthResponse['access_token'];

			const minecraftProfileRequest = await fetch('https://api.minecraftservices.com/minecraft/profile', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${minecraftAccessToken}`
				}
			});

			if (!minecraftProfileRequest.ok) {
				throw new InternalApiError(500, 'Minecraft API returned an error');
			}

			try {
				var minecraftProfile = await minecraftProfileRequest.json();
			} catch (e) {
				throw new InternalApiError(500, 'Minecraft API returned an error');
			}

			if (minecraftProfile['error'] !== undefined) {
				throw new InternalApiError(500, 'Minecraft API returned an error');
			}

			const uuid = minecraftProfile['id'];

			const user = await getUserByPlayerUUID(uuid);

			if (!user.account || !user.player) {
				throw new InternalApiError(400, 'Invalid account');
			}

			const ipTrusted = await checkIpTrusted(user.account.id, ip);

			if (!ipTrusted) {
				throw new InternalApiError(400, 'Login from new IP detected - check your email');
			}

			await updateTrustedIpLastLogin(user.account.id, ip);

			const sessionId = snowflake.nextId().toString();
			const userAgent = headers['User-Agent'] ?? 'Unknown';

			await createSession(sessionId, user.account.id, ip, userAgent);

			const accessClaims: any = {
				exp: Math.floor(Date.now() / 1000) + 60 * 60 // expires in 1 hour
			};

			if (user.account) {
				accessClaims.id = user.account.id;
			}

			if (user.player) {
				accessClaims.uuid = user.player.uuid;
			}

			const access = await jwt.sign(accessClaims);

			const refresh = await jwt.sign({
				id: sessionId,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // expires in 30 days
			});

			return {
				user,
				tokens: { refresh, access }
			};
		},
		{
			detail: {
				summary: 'Login using Microsoft OAuth',
				operationId: 'LoginWithMicrosoft'
			},
			query: t.Object({
				code: t.String({ error: 'Missing or invalid code' })
			}),
			response: {
				200: t.Object({
					user: UserSchema,
					tokens: TokenSchema
				})
			},
			parse: 'application/json'
		}
	);
