import { t } from 'elysia';
import { getInstanceById } from './instances';
import { GameSchema } from './game';
import { GameInstanceType } from '../types';
import { valkey } from '@minemaker/valkey';

export const PresenceSchema = t.Object({
	game: GameSchema,
	instance: t.Object({
		id: t.String(),
		region: t.String(),
		since: t.Optional(t.Date()),
		type: t.Enum(GameInstanceType),
		online: t.Number(),
		max: t.Number()
	})
});

export type Presence = typeof PresenceSchema.static;

export async function getPlayerPresence(uuid: string): Promise<Presence | undefined> {
	const id = (await valkey.get(`presence:${uuid}:instance`))?.toString();

	if (!id) return undefined;

	const instance = await getInstanceById(id);

	return {
		game: instance.properties.game,
		instance: {
			id,
			region: instance.properties.region,
			type: instance.properties.type,
			online: instance.online.length + instance.standby.length,
			max: instance.properties.maxPlayers
		}
	};
}
