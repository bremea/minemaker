import { ElysiaApp } from '$src/app';
import { t } from 'elysia';
import { GameSchema, getUserGamesByCreationDate } from '@minemaker/db';
import { requireAccountAndPlayer } from '$src/lib/middleware/auth';

export default (app: ElysiaApp) =>
	app.use(requireAccountAndPlayer).get(
		'/',
		async ({ user, query }) => {
			const games = await getUserGamesByCreationDate(user.account.id, query.start, query.limit);
			return games;
		},
		{
			detail: {
				summary: 'Get games of current user',
				operationId: 'GetMyGames'
			},
			query: t.Object({
				limit: t.Optional(t.Number({ maximum: 100, minimum: 1, error: 'Invalid limit' })),
				start: t.Optional(t.Number({ minimum: 0, error: 'Invalid start position' }))
			}),
			response: {
				200: t.Array(t.Omit(GameSchema, ['owner']))
			},
			parse: 'application/json'
		}
	);
