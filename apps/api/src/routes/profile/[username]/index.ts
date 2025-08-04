import { ElysiaApp } from '$src/app';
import {
	Game,
	GameSchema,
	getPlayerPresence,
	getProfileByPlayerUsername,
	getUserDiscoverableGamesByCreationDate,
	PresenceSchema,
	ProfileSchema
} from '@minemaker/db';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.get(
		'/',
		async ({ params }) => {
			const player = await getProfileByPlayerUsername(params.username);

			const profile = {
				...player,
				creations: [] as Array<Omit<Game, 'owner'>>,
				presence: await getPlayerPresence(player.uuid)
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
						presence: t.Optional(PresenceSchema)
					})
				])
			},
			parse: 'application/json'
		}
	);
