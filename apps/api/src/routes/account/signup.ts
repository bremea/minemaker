import { ElysiaApp } from '$src/app';
import { InternalServerError, t } from 'elysia';
import bcrypt from 'bcrypt';
import { AccountSchema, createAccount, createEmailVerificationRequest, createSession, InternalApiError, trustIp } from '@minemaker/db';
import * as disposableEmail from 'disposable-email-domains-js';
import { randomUUID } from 'crypto';
import { sendEmailConfirmation } from '$src/lib/email/signup';
import { TokenSchema } from '$src/lib/types';

export default (app: ElysiaApp) =>
	app.post(
		'/',
		async ({ jwt, headers, body, snowflake, ip }) => {
			if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip === '') {
				ip = '127.0.0.1';
			}

			const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					secret: process.env.CF_TURNSTILE_SECRET,
					response: body.turnstileToken
				})
			});

			const data = await res.json();

			if (!data.success) {
				throw new InternalApiError(400, 'CF turnstile failed');
			}

			// check if email is disposable
			if (disposableEmail.isDisposableEmail(body.email)) {
				throw new InternalApiError(400, 'Invalid email');
			}

			const hash = await bcrypt.hash(body.password, 10);
			const id = snowflake.nextId().toString();

			const account = await createAccount(id, body.email, hash, new Date(body.birthday));

			await trustIp(id, ip);

			const emailCode = randomUUID();
			const emailConfUrl = `https://minemaker.net/auth/verify?code=${emailCode}`;

			await createEmailVerificationRequest(body.email, emailCode);

			//	await sendEmailConfirmation(body.email, emailConfUrl);

			const sessionId = snowflake.nextId().toString();
			const userAgent = headers['User-Agent'] ?? 'Unknown';

			await createSession(sessionId, id, ip, userAgent);

			const refresh = await jwt.sign({
				id: sessionId,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // expires in 30 days
			});

			const access = await jwt.sign({
				id,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 // expires in 1 hour
			});

			return {
				account,
				tokens: { refresh, access }
			};
		},
		{
			detail: {
				summary: 'Create an account',
				operationId: 'Signup'
			},
			body: t.Object({
				email: t.String({
					format: 'email',
					maxLength: 255,
					error: 'Invalid email'
				}),
				password: t.String({
					maxLength: 255,
					minLength: 8,
					error: 'Invalid password',
					pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,200}$'
				}),
				birthday: t.String({
					error: 'Invalid birthday',
					format: 'date'
				}),
				turnstileToken: t.String({ error: 'Missing turnstile' })
			}),
			response: {
				200: t.Object({
					account: AccountSchema,
					tokens: TokenSchema
				})
			},
			parse: 'application/json'
		}
	);
