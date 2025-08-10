import { ElysiaApp } from '$src/app';
import { checkAuth } from '$src/lib/middleware/auth';
import { Game, GameSchema, getFeaturedGames } from '@minemaker/db';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.use(checkAuth).get(
		'/',
		async ({ user }) => {
			const playlog: Game[] = [];
			const featured = await getFeaturedGames();

			return {
				playlog,
				featured
			};
		},
		{
			detail: {
				summary: 'Gets games for the homepage',
				operationId: 'GetHomepage'
			},
			response: {
				200: t.Object({
					playlog: t.Array(GameSchema),
					featured: t.Array(GameSchema)
				})
			},
			parse: 'application/json'
		}
	);
