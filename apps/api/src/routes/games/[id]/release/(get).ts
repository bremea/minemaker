import { ElysiaApp } from '$src/app';
import { getGameById, getGameReleaseEligibility, UnauthorizedApiError } from '@minemaker/db';
import { requireAccountAndPlayer } from '$src/lib/middleware/auth';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.use(requireAccountAndPlayer).get(
		'/',
		async ({ user, params }) => {
			const game = await getGameById(params.id);

			if (game.owner?.account?.id !== user.account?.id) {
				throw UnauthorizedApiError;
			}

			return await getGameReleaseEligibility(game);
		},
		{
			detail: {
				summary: "Get's a game's release eligibility",
				operationId: 'GetGameReleaseEligibility'
			},
			params: t.Object({
				id: t.String({ error: 'Invalid game id' })
			}),
			response: {
				200: t.Object({
					eligible: t.Boolean(),
					requirements: t.Object({
						thumbnailUploaded: t.Boolean(),
						liveBuild: t.Boolean()
					}),
					restrictions: t.Optional(t.Array(t.String()))
				})
			},
			parse: 'application/json'
		}
	);
