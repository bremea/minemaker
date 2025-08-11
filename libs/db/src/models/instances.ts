import { valkey } from '@minemaker/valkey';
import { t } from 'elysia';
import { GameInstanceStatus, GameInstanceType } from '../types/enums';
import { GameSchema, getGameById } from './game';
import { getPlayerByUUID, Player, PlayerSchema } from './user';

export const GameInstancePropertiesSchema = t.Object({
	game: GameSchema,
	build: t.String(),
	type: t.Enum(GameInstanceType),
	status: t.Enum(GameInstanceStatus),
	started: t.Number(),
	max: t.Number(),
	region: t.String(),
	ip: t.String(),
	owner: t.Optional(t.String())
});

export const GameInstanceSchema = t.Object({
	id: t.String(),
	online: t.Array(PlayerSchema),
	standby: t.Array(PlayerSchema),
	properties: GameInstancePropertiesSchema
});

export type GameInstance = typeof GameInstanceSchema.static;
export type GameInstanceProperties = typeof GameInstancePropertiesSchema.static;

export async function parseGameInstanceProperties(properties: Record<string, string>): Promise<GameInstanceProperties> {
	return {
		game: await getGameById(properties['game']),
		build: properties['build'],
		type: properties['type'] as GameInstanceType,
		status: properties['status'] as GameInstanceStatus,
		started: parseInt(properties['started']),
		max: parseInt(properties['max']),
		region: properties['region'],
		ip: properties['ip']
	};
}

export async function getInstanceById(id: string): Promise<GameInstance> {
	const properties = await valkey.hgetall(`instance:${id}`);
	const onlinePlayers = await valkey.smembers(`instance:${id}:online`);
	const standbyPlayers = await valkey.smembers(`instance:${id}:standby`);

	const online: Player[] = [];
	for (const player of onlinePlayers) {
		try {
			online.push(await getPlayerByUUID(player.toString()));
		} catch {
			continue;
		}
	}

	const standby: Player[] = [];
	for (const player of standbyPlayers) {
		try {
			standby.push(await getPlayerByUUID(player.toString()));
		} catch {
			continue;
		}
	}

	return { id, online, standby, properties: await parseGameInstanceProperties(properties) };
}
