import { ElysiaApp } from '$src/app';
import { t } from 'elysia';
import {
	BuildSchema,
	checkGameOwner,
	getBuildsByGameId,
	UnauthorizedApiError
} from '@minemaker/db';
import { requireAccountAndPlayer } from '$src/lib/middleware/auth';

export default (app: ElysiaApp) =>
	app.use(requireAccountAndPlayer).get(
		'/',
		async ({ user, params }) => {
			if (!(await checkGameOwner(params.id, user.account.id))) {
				throw UnauthorizedApiError;
			}

			const builds = await getBuildsByGameId(params.id);
			return builds;
		},
		{
			detail: {
				summary: "Gets a game's builds",
				operationId: 'GetBuilds'
			},
			params: t.Object({
				id: t.String({ error: 'Invalid game id' })
			}),
			response: {
				200: t.Array(t.Omit(BuildSchema, ['game', 'artifacts', 'manifest']))
			},
			parse: 'application/json'
		}
	);
