import { ElysiaApp } from '$src/app';
import { t } from 'elysia';
import bcrypt from 'bcrypt';
import { createAccount, InternalApiError } from '@minemaker/db';
import * as disposableEmail from 'disposable-email-domains-js'

export default (app: ElysiaApp) =>
	app.post(
		'/',
		async ({ body, snowflake, ip }) => {
			if (ip === '::1' || ip === '::ffff:127.0.0.1') {
				ip = '127.0.0.1';
			}

			// check if email is disposable
			if (disposableEmail.isDisposableEmail(body.email)) {
				throw new InternalApiError(400, 'Invalid email')
			}

			const hash = await bcrypt.hash(body.password, 10);
			const id = snowflake.nextId().toString();

			const account = await createAccount(id, body.email, hash);

			return account;
		},
		{
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
				})
			})
		}
	);
