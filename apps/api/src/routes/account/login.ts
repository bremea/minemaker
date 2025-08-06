import { ElysiaApp } from '$src/app';
import { t } from 'elysia';
import { checkAccountPassword, checkIpTrusted, createSession, getUserByAccountEmail, InternalApiError, updateTrustedIpLastLogin, UserSchema } from '@minemaker/db';
import { TokenSchema } from '$src/lib/types';

export default (app: ElysiaApp) =>
	app.post(
		'/',
		async ({ jwt, headers, body, snowflake, ip }) => {
			if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip === '') {
				ip = '127.0.0.1';
			}

			if (!(await checkAccountPassword(body.email, body.password))) {
				throw new InternalApiError(400, 'Invalid email or password');
			}

			const user = await getUserByAccountEmail(body.email);

			if (!user.account) {
				throw new InternalApiError(400, 'Invalid email or password');
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
				summary: 'Login to an account',
				operationId: 'Login'
			},
			body: t.Object({
				email: t.String({
					format: 'email',
					maxLength: 255,
					error: 'Invalid email'
				}),
				password: t.String({
					maxLength: 255,
					error: 'Invalid password'
				})
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
