import { ElysiaApp } from '$src/app';
import {
	GameSchemaWithOwner,
	GameWithOwner,
	getGameById,
	UnauthorizedApiError
} from '@minemaker/db';
import { checkAuth } from '$src/lib/middleware/auth';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.use(checkAuth).get(
		'/',
		async ({ user, params }) => {
			const game = (await getGameById(params.id, true)) as GameWithOwner;

			if (!game.discoverable && game.owner.account?.id !== user.account?.id) {
				throw UnauthorizedApiError;
			}

			return game;
		},
		{
			detail: {
				summary: 'Get a game by ID',
				operationId: 'GetGame'
			},
			params: t.Object({
				id: t.String()
			}),
			response: {
				200: GameSchemaWithOwner
			},
			parse: 'application/json'
		}
	);
