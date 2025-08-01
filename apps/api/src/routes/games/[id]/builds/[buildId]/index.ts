import { ElysiaApp } from '$src/app';
import { t } from 'elysia';
import { BuildSchema, getBuildById, UnauthorizedApiError } from '@minemaker/db';
import { requireAccountAndPlayer } from '$src/lib/middleware/auth';

export default (app: ElysiaApp) =>
	app.use(requireAccountAndPlayer).get(
		'/',
		async ({ user, params }) => {
			const build = await getBuildById(params.buildId);

			if (build.game.owner.account?.id != user.account.id) {
				throw UnauthorizedApiError;
			}

			return build;
		},
		{
			detail: {
				summary: 'Gets a game build by its id',
				operationId: 'GetBuild'
			},
			params: t.Object({
				buildId: t.String({ error: 'Invalid build id' }),
				id: t.String({ error: 'Invalid game id' }),
			}),
			response: {
				200: BuildSchema
			},
			parse: 'application/json'
		}
	);
