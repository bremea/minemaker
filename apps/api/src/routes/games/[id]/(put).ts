import { ElysiaApp } from '$src/app';
import {
	GameSchema,
	getGameById,
	InternalApiError,
	UnauthorizedApiError,
	updateGame
} from '@minemaker/db';
import { requireAccountAndPlayer } from '$src/lib/middleware/auth';
import { t } from 'elysia';

const ResponseSchema = t.Composite([GameSchema, t.Object({ oldThumbnail: t.String() })]);

export default (app: ElysiaApp) =>
	app
		.use(requireAccountAndPlayer)
		.onAfterResponse(async ({ response, cf }) => {
			const oldThumbnail = (response as typeof ResponseSchema.static).oldThumbnail;
			await cf.images.v1.delete(oldThumbnail, { account_id: process.env.CF_ACCOUNT_ID! });
		})
		.put(
			'',
			async ({ user, params, body, cf }) => {
				const game = await getGameById(params.id);
				if (game.owner?.account?.id !== user.account?.id) {
					throw UnauthorizedApiError;
				}

				if (body.thumbnail) {
					try {
						const img = await cf.images.v1.create({
							account_id: process.env.CF_ACCOUNT_ID!,
							file: body.thumbnail
						});

						return {
							oldThumbnail: game.thumbnail ?? '',
							...(await updateGame(params.id, body.name, body.description, img.id))
						};
					} catch (e) {
						throw new InternalApiError(500, 'Thumbnail failed to upload');
					}
				} else {
					return {
						oldThumbnail: game.thumbnail ?? '',
						...(await updateGame(params.id, body.name, body.description))
					};
				}
			},
			{
				detail: {
					summary: 'Update a game',
					operationId: 'UpdateGame'
				},
				params: t.Object({
					id: t.String({ error: 'Invalid game id' })
				}),
				body: t.Object({
					name: t.Optional(
						t.String({
							description: 'New name for the game',
							error: 'Invalid name',
							maxLength: 50
						})
					),
					description: t.Optional(
						t.String({
							description: 'New description for the game',
							error: 'Invalid description',
							maxLength: 1000
						})
					),
					thumbnail: t.Optional(
						t.File({
							description: 'Data URI encoded image',
							maxSize: '5m',
							type: 'image/*'
						})
					)
				}),
				response: {
					200: ResponseSchema
				},
				parse: 'multipart/form-data'
			}
		);
