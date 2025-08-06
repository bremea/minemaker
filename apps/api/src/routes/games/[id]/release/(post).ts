import { ElysiaApp } from '$src/app';
import { getGameById, getGameReleaseEligibility, InternalApiError, makeGameDiscoverable, UnauthorizedApiError } from '@minemaker/db';
import { requireAccountAndPlayer } from '$src/lib/middleware/auth';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.use(requireAccountAndPlayer).post(
		'/',
		async ({ user, params }) => {
			const game = await getGameById(params.id);

			if (game.owner?.account?.id !== user.account?.id) {
				throw UnauthorizedApiError;
			}

			const eligibility = await getGameReleaseEligibility(game);

			if (!eligibility.eligible) {
				throw new InternalApiError(403, 'This game is not eligible for release');
			}

			return await makeGameDiscoverable(game.id);
		},
		{
			detail: {
				summary: 'Releases a game',
				operationId: 'ReleaseGame'
			},
			params: t.Object({
				id: t.String({ error: 'Invalid game id' })
			}),
			response: {
				200: t.Boolean()
			},
			parse: 'application/json'
		}
	);
