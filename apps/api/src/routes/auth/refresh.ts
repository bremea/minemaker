import { ElysiaApp } from '$src/app';
import { TokenSchema } from '$src/lib/types';
import bearer from '@elysiajs/bearer';
import { createSession, getSessionById, getUserByAccountId, InternalApiError, invalidateSession, updateTrustedIpLastLogin } from '@minemaker/db';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.use(bearer()).get(
		'/',
		async ({ bearer, headers, ip, jwt, snowflake }) => {
			if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip === '') {
				ip = '127.0.0.1';
			}

			if (!bearer) {
				throw new InternalApiError(400, 'Missing refresh token');
			}

			const refreshData = await jwt.verify(bearer);

			if (!refreshData || typeof refreshData.id != 'string') {
				throw new InternalApiError(401, 'Invalid refresh token');
			}

			const sessionData = await getSessionById(refreshData.id);

			if (new Date(sessionData.expires) < new Date()) {
				console.log('expired?');
				throw new InternalApiError(401, 'Invalid refresh token');
			}

			const newSessionId = snowflake.nextId().toString();
			const userAgent = headers['User-Agent'] ?? 'Unknown';

			await invalidateSession(sessionData.id);
			await createSession(newSessionId, sessionData.account, ip, userAgent);
			await updateTrustedIpLastLogin(sessionData.account, ip);

			const user = await getUserByAccountId(sessionData.account);

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
				id: newSessionId,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // expires in 30 days
			});

			return {
				access,
				refresh
			};
		},
		{
			detail: {
				summary: 'Get a new access token',
				description: 'Get a new access token if your current one expired. Use your refresh token instead of the expired access token for the Authorization header.',
				operationId: 'RefreshAccess'
			},
			headers: t.Any(),
			response: {
				200: TokenSchema
			},
			parse: 'application/json'
		}
	);
