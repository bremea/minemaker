import { ElysiaApp } from '$src/app';
import {
	Game,
	GameSchema,
	getProfileByPlayerUsername,
	getUserDiscoverableGamesByCreationDate,
	ProfileSchema
} from '@minemaker/db';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.get(
		'/',
		async ({ params }) => {
			const profile = {
				...(await getProfileByPlayerUsername(params.username)),
				creations: [] as Array<Omit<Game, 'owner'>>,
				presence: undefined
			};

			if (profile.account) {
				profile.creations = await getUserDiscoverableGamesByCreationDate(
					profile.account.id
				);
			}

			return profile;
		},
		{
			detail: {
				summary: "Get's a user's profile by their username",
				operationId: 'GetProfile'
			},
			params: t.Object({
				username: t.String({ error: 'Invalid username' })
			}),
			response: {
				200: t.Composite([
					ProfileSchema,
					t.Object({
						creations: t.Array(t.Omit(GameSchema, ['owner'])),
						presence: t.Any()
					})
				])
			},
			parse: 'application/json'
		}
	);
