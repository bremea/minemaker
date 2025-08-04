import { t } from 'elysia';
import { GameSchema, getGameById } from './game';
import { GameInstanceStatus, GameInstanceType } from '../enums';
import { getPlayerByUUID, Player, PlayerSchema } from './user';
import { HashDataType } from '@valkey/valkey-glide';
import { valkey } from '../connection';
import { InternalApiError } from '../utils';

export const GameInstancePropertiesSchema = t.Object({
	game: GameSchema,
	build: t.String(),
	type: t.Enum(GameInstanceType),
	status: t.Enum(GameInstanceStatus),
	started: t.Date(),
	maxPlayers: t.Number(),
	region: t.String()
});

export const GameInstanceSchema = t.Object({
	id: t.String(),
	online: t.Array(PlayerSchema),
	properties: GameInstancePropertiesSchema
});

export type GameInstance = typeof GameInstanceSchema.static;
export type GameInstanceProperties = typeof GameInstancePropertiesSchema.static;

export async function parseGameInstanceProperties(
	data: HashDataType
): Promise<GameInstanceProperties> {
	const properties: { [key: string]: string } = {};

	for (const entry of data) {
		properties[entry.field.toString()] = entry.value.toString();
	}

	return {
		game: await getGameById(properties['game']),
		build: properties['build'],
		type: properties['type'] as GameInstanceType,
		status: properties['status'] as GameInstanceStatus,
		started: new Date(parseInt(properties['started'])),
		maxPlayers: parseInt(properties['max']),
		region: properties['region']
	};
}

export async function getInstanceById(id: string): Promise<GameInstance> {
	const properties = await valkey.hgetall(`instance:${id}`);
	const players = await valkey.smembers(`instance:${id}:online`);

	if (properties.length == 0) {
		throw new InternalApiError(404, `No instance exists with id ${id}`);
	}

	const online: Player[] = [];
	for (const player of players) {
		online.push(await getPlayerByUUID(player.toString()));
	}

	return { id, online, properties: await parseGameInstanceProperties(properties) };
}
