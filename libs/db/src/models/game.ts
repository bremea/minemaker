import { pool, valkey } from '../connection';
import { InternalApiError, Nullable } from '../utils';
import { t } from 'elysia';
import { parseProfileFromUser, ProfileSchema } from './user';
import { GameFlags } from '../enums';

export const GameSchema = t.Object({
	id: t.String(),
	owner: ProfileSchema,
	name: t.String(),
	thumbnail: t.String(),
	description: t.String(),
	currentBuild: Nullable(t.Object({ id: t.String() })),
	discoverable: t.Boolean(),
	lastUpdated: t.Date(),
	flags: t.Number({ maximum: GameFlags.All }),
	tags: t.Array(t.String()),
	online: t.Number()
});

export type Game = typeof GameSchema.static;

export async function parseDatabaseGame(data: any): Promise<Game> {
	return {
		...(await parseDatabaseGameExcludeOwner(data)),
		owner: parseProfileFromUser(data.owner)
	};
}

export async function parseDatabaseGameExcludeOwner(data: any): Promise<Omit<Game, 'owner'>> {
	let online = 0;
	const instances = await valkey.smembers(`game:${data.id.toString()}:instances`);

	for (const instance of instances) {
		online += await valkey.scard(`instances:${instance.toString()}:online`);
	}

	return {
		id: data.id.toString(),
		name: data['name'],
		thumbnail: data['thumbnail'] ?? 'e2300692-29ef-4ad4-c815-a759c59a8c00', // default project thumbnail
		description: data['description'],
		currentBuild: data['current_build'] ? { id: data['current_build'] } : null,
		discoverable: data['discoverable'],
		lastUpdated:
			typeof data['last_updated'] == 'string'
				? new Date(data['last_updated'])
				: data['last_updated'],
		flags: parseInt(data['flags'], 2) as GameFlags,
		tags: data['tags'] ?? [],
		online
	};
}

export async function getGameById(id: string): Promise<Game> {
	const res = await pool.query({
		text: `SELECT g.*, jsonb_build_object( 'account', to_jsonb(a), 'player', to_jsonb(p) ) AS owner FROM games g JOIN accounts a ON a.id = g.owner LEFT JOIN players p ON p.uuid = a.mc_uuid WHERE g.id = $1`,
		values: [id]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(400, `No game exists with id ${id}`);
	}

	return parseDatabaseGame(res.rows[0]);
}

export async function updateGame(
	id: string,
	name?: string,
	description?: string,
	thumbnail?: string
): Promise<Game> {
	const res = await pool.query({
		text: `WITH game AS 
					(UPDATE games SET name = COALESCE($2, name), description = COALESCE($3, description), thumbnail = COALESCE($4, thumbnail) WHERE id = $1 RETURNING *)
				SELECT g.*, 
					jsonb_build_object( 'account', to_jsonb(a), 'player', to_jsonb(p) ) AS owner 
					FROM game g JOIN accounts a ON a.id = g.owner LEFT JOIN players p ON p.uuid = a.mc_uuid`,
		values: [id, name, description, thumbnail]
	});

	return parseDatabaseGame(res.rows[0]);
}

export async function createGame(
	id: string,
	owner: string,
	name: string
): Promise<Omit<Game, 'owner'>> {
	const res = await pool.query({
		text: `INSERT INTO games (id, owner, name) VALUES($1, $2, $3) RETURNING *`,
		values: [id, owner, name]
	});

	return parseDatabaseGameExcludeOwner(res.rows[0]);
}

export async function getUserGamesByCreationDate(
	id: string,
	start?: number,
	limit?: number
): Promise<Omit<Game, 'owner'>[]> {
	const res = await pool.query({
		text: `SELECT * FROM games WHERE owner = $1 ORDER BY last_updated DESC LIMIT $2 OFFSET $3`,
		values: [id, limit ?? 25, start ?? 0]
	});

	return await Promise.all(res.rows.map(async (e) => await parseDatabaseGameExcludeOwner(e)));
}

export async function checkGameOwner(gameId: string, accountId: string): Promise<boolean> {
	const res = await pool.query({
		text: `SELECT 1 FROM games WHERE id = $1 AND owner = $2 LIMIT 1`,
		values: [gameId, accountId]
	});

	return res.rows.length > 0;
}

export async function getGameReleaseEligibility(game: Game) {
	const res = await pool.query({
		text: `SELECT 1 FROM games WHERE id = $1 AND thumbnail IS NOT NULL LIMIT 1`,
		values: [game.id]
	});

	const thumbnailUploaded = res.rows.length > 0;
	const liveBuild = typeof game.currentBuild == 'string';

	return {
		eligible: thumbnailUploaded && liveBuild,
		requirements: { thumbnailUploaded, liveBuild }
	};
}

export async function makeGameDiscoverable(id: string): Promise<boolean> {
	const res = await pool.query({
		text: `UPDATE games SET discoverable = true WHERE id = $1 RETURNING discoverable`,
		values: [id]
	});

	return res.rows[0].discoverable;
}

export async function getUserDiscoverableGamesByCreationDate(
	id: string,
	start?: number,
	limit?: number
): Promise<Omit<Game, 'owner'>[]> {
	const res = await pool.query({
		text: `SELECT * FROM games WHERE owner = $1 AND discoverable = true ORDER BY last_updated DESC LIMIT $2 OFFSET $3`,
		values: [id, limit ?? 25, start ?? 0]
	});

	return await Promise.all(res.rows.map((e) => parseDatabaseGameExcludeOwner(e)));
}
