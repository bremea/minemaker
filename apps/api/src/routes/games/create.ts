import { ElysiaApp } from '$src/app';
import { t } from 'elysia';
import { createGame, GameSchema, InternalApiError } from '@minemaker/db';
import { requireAccountAndPlayer } from '$src/lib/middleware/auth';

export default (app: ElysiaApp) =>
	app.use(requireAccountAndPlayer).post(
		'/',
		async ({ body, snowflake, ip, user }) => {
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

			const id = snowflake.nextId().toString();

			const newGame = await createGame(id, user.account.id, body.name);
			return newGame;
		},
		{
			detail: {
				summary: 'Create a new game',
				operationId: 'CreateGame'
			},
			body: t.Object({
				name: t.String({
					maxLength: 50,
					error: 'Invalid name'
				}),
				turnstileToken: t.String({ error: 'Missing turnstile' })
			}),
			response: {
				200: t.Omit(GameSchema, ['owner'])
			},
			parse: 'application/json'
		}
	);
