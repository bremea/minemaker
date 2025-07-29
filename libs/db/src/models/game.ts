import { pool } from '../connection';
import { InternalApiError } from '../utils';
import { t } from 'elysia';
import { AccountSchema, getUserByAccountId, User, UserSchema } from './user';

export enum GameFlags {
	None = 0,
	Staff = 1 << 0, // 001
	Partner = 1 << 1, // 010
	Reserved = 1 << 2, // 100
	All = ~(~0 << 3) // 111
}

export const GameSchemaWithOwner = t.Object({
	id: t.String(),
	owner: UserSchema,
	name: t.String(),
	thumbnail: t.Optional(t.String()),
	description: t.String(),
	currentBuildId: t.Optional(t.String()),
	discoverable: t.Boolean(),
	lastUpdated: t.Date(),
	flags: t.Number({ minimum: GameFlags.None, maximum: GameFlags.All }),
	tags: t.ArrayString(),
	online: t.Number()
});

export const GameSchemaWithoutOwner = t.Object({
	id: t.String(),
	owner: t.String(),
	name: t.String(),
	thumbnail: t.Optional(t.String()),
	description: t.String(),
	currentBuildId: t.Optional(t.String()),
	discoverable: t.Boolean(),
	lastUpdated: t.Date(),
	flags: t.Number({ minimum: GameFlags.None, maximum: GameFlags.All }),
	tags: t.ArrayString(),
	online: t.Number()
});

export type GameWithOwner = typeof GameSchemaWithOwner.static;
export type GameWithoutOwner = typeof GameSchemaWithoutOwner.static;
export type Game = GameWithoutOwner | GameWithOwner;

function parseDatabaseGame(data: any, owner: User | undefined = undefined): Game {
	return {
		id: data.id,
		owner: owner ?? data.owner,
		name: data.name,
		thumbnail: data.thumbnail ?? 'e2300692-29ef-4ad4-c815-a759c59a8c00', // default thumbnail image id
		description: data.description,
		currentBuildId: data.current_build,
		discoverable: data.discoverable,
		lastUpdated: data.last_updated,
		flags: data.flags,
		tags: data.tags,
		online: data.online ?? 0
	};
}

export async function getGameById(id: string, resolveOwner: boolean = true): Promise<Game> {
	const res = await pool.query({
		text: `SELECT * FROM games WHERE id = $1`,
		values: [id]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(400, `No game exists with id ${id}`);
	}

	if (resolveOwner) {
		return parseDatabaseGame(res.rows[0], await getUserByAccountId(res.rows[0].owner));
	} else {
		return parseDatabaseGame(res.rows[0]);
	}
}

export async function createGame(
	id: string,
	owner: string,
	name: string
): Promise<GameWithoutOwner> {
	const res = await pool.query({
		text: `INSERT INTO games (id, owner, name) VALUES($1, $2, $3) RETURNING *`,
		values: [id, owner, name]
	});

	return parseDatabaseGame(res.rows[0]) as GameWithoutOwner;
}
