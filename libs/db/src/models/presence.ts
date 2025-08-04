import { valkey } from '../connection';
import { GameInstanceSchema, getInstanceById } from './instances';

export const PresenceSchema = GameInstanceSchema;

export type Presence = typeof PresenceSchema.static;

export async function getPlayerPresence(uuid: string): Promise<Presence | undefined> {
	const instance = (await valkey.get(`presence:${uuid}:instance`))?.toString();

	if (!instance) return undefined;

	return await getInstanceById(instance);
}
