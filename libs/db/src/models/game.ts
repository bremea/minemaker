import { pool } from '../connection';
import { InternalApiError, Nullable } from '../utils';
import { t } from 'elysia';
import { getUserByAccountId, parseProfileFromUser, Profile, ProfileSchema } from './user';
import { BuildSchema } from './build';

export enum GameFlags {
	None = 0,
	Staff = 1 << 0, // 001
	Partner = 1 << 1, // 010
	Reserved = 1 << 2, // 100
	All = ~(~0 << 3) // 111
}

export const GameSchema = t.Object({
	id: t.String(),
	owner: ProfileSchema,
	name: t.String(),
	thumbnail: Nullable(t.String()),
	description: t.String(),
	currentBuild: Nullable(t.Object({ id: t.String() })),
	discoverable: t.Boolean(),
	lastUpdated: t.Date(),
	flags: t.Enum(GameFlags),
	tags: t.Array(t.String()),
	online: t.Number()
});

export type Game = typeof GameSchema.static;

export function parseDatabaseGame(data: any): Game {
	return {
		...parseDatabaseGameExcludeOwner(data),
		owner: parseProfileFromUser(data.owner)
	};
}

export function parseDatabaseGameExcludeOwner(data: any): Omit<Game, 'owner'> {
	return {
		id: data.id.toString(),
		name: data['name'],
		thumbnail: data['thumbnail'] ?? 'e2300692-29ef-4ad4-c815-a759c59a8c00', // default thumbnail image id
		description: data['description'],
		currentBuild: data['current_build'] ? { id: data['current_build'] } : null,
		discoverable: data['discoverable'],
		lastUpdated:
			typeof data['last_updated'] == 'string'
				? new Date(data['last_updated'])
				: data['last_updated'],
		flags: parseInt(data['flags']),
		tags: data['tags'] ?? [],
		online: data['online'] ?? 0
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

	return res.rows.map((e) => parseDatabaseGameExcludeOwner(e));
}

export async function checkGameOwner(gameId: string, accountId: string): Promise<boolean> {
		const res = await pool.query({
		text: `SELECT 1 FROM games WHERE id = $1 AND owner = $2 LIMIT 1`,
		values: [gameId, accountId]
	});

	return res.rows.length > 0;
}