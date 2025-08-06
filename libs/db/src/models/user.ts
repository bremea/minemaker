import { pool } from '../connection';
import { InternalApiError } from '../utils';
import { t } from 'elysia';
import bcrypt from 'bcrypt';
import { PlayerFlags, PlayerPermissions } from '../types/enums';

export const AccountSchema = t.Object({
	id: t.String(),
	email: t.String(),
	emailVerified: t.Boolean(),
	lastLogin: t.Date(),
	gems: t.Number()
});

export const PlayerSchema = t.Object({
	uuid: t.String(),
	username: t.String(),
	flags: t.Number({ maximum: PlayerFlags.All }),
	permissions: t.Number({ maximum: PlayerPermissions.All }),
	firstLogin: t.Date(),
	lastSeen: t.Date()
});

export const ProfileSchema = t.Object({
	uuid: t.String(),
	username: t.String(),
	flags: t.Number({ maximum: PlayerFlags.All }),
	firstLogin: t.Date(),
	lastSeen: t.Date(),
	account: t.Optional(t.Object({ id: t.String() }))
});

export const UserSchema = t.Object({
	account: t.Optional(AccountSchema),
	player: t.Optional(PlayerSchema)
});

export type User = typeof UserSchema.static;
export type Account = typeof AccountSchema.static;
export type Player = typeof PlayerSchema.static;
export type Profile = typeof ProfileSchema.static;

function parseDatabasePlayer(data: any): Player {
	return {
		uuid: data.uuid ?? data.mc_uuid,
		username: data.username,
		flags: parseInt(data.flags, 2) as PlayerFlags,
		permissions: parseInt(data.permissions, 2) as PlayerPermissions,
		firstLogin: typeof data['first_login'] == 'string' ? new Date(data['first_login']) : data['first_login'],
		lastSeen: typeof data['last_seen'] == 'string' ? new Date(data['last_seen']) : data['last_seen']
	};
}

function parseDatabaseAccount(data: any): Account {
	return {
		id: data.id.toString(),
		email: data.email,
		emailVerified: data.email_verified,
		lastLogin: typeof data['last_login'] == 'string' ? new Date(data['last_login']) : data['last_login'],
		gems: data.gems
	};
}

export function parseDatabaseUser(data: any): User {
	const user: User = {};

	if (data.account) user.account = parseDatabaseAccount(data.account);
	if (data.player) user.player = parseDatabasePlayer(data.player);

	return user;
}

export function parseProfileFromUser(user: any): Profile {
	if (!user.player) throw new InternalApiError(500, 'Tried to get profile of a non-player');

	return {
		uuid: user.player.uuid,
		username: user.player.username,
		flags: parseInt(user.player.flags, 2) as PlayerFlags,
		firstLogin: typeof user.player['first_login'] == 'string' ? new Date(user.player['first_login']) : user.player['first_login'],
		lastSeen: typeof user.player['last_seen'] == 'string' ? new Date(user.player['last_seen']) : user.player['last_seen'],
		account: user.account ? { id: user.account.id.toString() } : undefined
	};
}

export async function getAccountById(id: string): Promise<Account> {
	const res = await pool.query({
		text: `SELECT * FROM accounts WHERE id = $1`,
		values: [id]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(404, `No account exists with id ${id}`);
	}

	return parseDatabaseAccount(res.rows[0]);
}

export async function getPlayerByUUID(uuid: string): Promise<Player> {
	const res = await pool.query({
		text: `SELECT * FROM players WHERE uuid = $1`,
		values: [uuid]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(404, `No player exists with uuid ${uuid}`);
	}

	return parseDatabasePlayer(res.rows[0]);
}

export async function getUserByAccountId(id: string): Promise<User> {
	const res = await pool.query({
		text: `SELECT jsonb_build_object( 'account', to_jsonb(a), 'player', to_jsonb(p) ) as user
				FROM accounts a
				LEFT JOIN players p ON a.mc_uuid = p.uuid
				WHERE a.id = $1`,
		values: [id]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(404, `No account exists with id ${id}`);
	}

	return parseDatabaseUser(res.rows[0].user);
}

export async function getUserByAccountEmail(email: string): Promise<User> {
	const res = await pool.query({
		text: `SELECT jsonb_build_object( 'account', to_jsonb(a), 'player', to_jsonb(p) ) as user
				FROM accounts a
				LEFT JOIN players p ON a.mc_uuid = p.uuid
				WHERE a.email = $1`,
		values: [email]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(404, `No account exists with email ${email}`);
	}

	return parseDatabaseUser(res.rows[0].user);
}

export async function getUserByPlayerUsername(username: string): Promise<User> {
	const res = await pool.query({
		text: `SELECT jsonb_build_object( 'account', to_jsonb(a), 'player', to_jsonb(p) ) as user
				FROM players p
				LEFT JOIN accounts a ON p.uuid = a.mc_uuid
				WHERE p.username = $1`,
		values: [username]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(404, `No player exists with username ${username}`);
	}

	return parseDatabaseUser(res.rows[0].user);
}

export async function getProfileByPlayerUsername(username: string): Promise<Profile> {
	const res = await pool.query({
		text: `SELECT jsonb_build_object( 'account', to_jsonb(a), 'player', to_jsonb(p) ) as user
				FROM players p
				LEFT JOIN accounts a ON p.uuid = a.mc_uuid
				WHERE p.username = $1`,
		values: [username]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(404, `No player exists with username ${username}`);
	}

	return parseProfileFromUser(res.rows[0].user);
}

export async function getUserByPlayerUUID(uuid: string): Promise<User> {
	const res = await pool.query({
		text: `SELECT jsonb_build_object( 'account', to_jsonb(a), 'player', to_jsonb(p) ) as user
				FROM players p
				LEFT JOIN accounts a ON p.uuid = a.mc_uuid
				WHERE p.uuid = $1`,
		values: [uuid]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(404, `No player exists with uuid ${uuid}`);
	}

	return parseDatabaseUser(res.rows[0].user);
}

export async function createAccount(id: string, email: string, password: string, birthday: Date): Promise<Account> {
	const res = await pool.query({
		text: `INSERT INTO accounts (id, email, password, birthday) VALUES($1, $2, $3, $4) RETURNING *`,
		values: [id, email, password, birthday]
	});

	return parseDatabaseAccount(res.rows[0]);
}

export async function createPlayer(uuid: string, username: string): Promise<Player> {
	const res = await pool.query({
		text: `INSERT INTO players (uuid, username) VALUES($1, $2) RETURNING *`,
		values: [uuid, username]
	});

	return parseDatabasePlayer(res.rows[0]);
}

export async function createOrUpdatePlayer(uuid: string, username: string): Promise<Player> {
	const res = await pool.query({
		text: `INSERT INTO players (uuid, username) VALUES ($1, $2) ON CONFLICT (uuid) DO UPDATE SET username = $2 WHERE players.uuid = $1 RETURNING *`,
		values: [uuid, username]
	});

	return parseDatabasePlayer(res.rows[0]);
}

export async function checkAccountPassword(email: string, password: string): Promise<boolean> {
	const res = await pool.query({
		text: `SELECT * FROM accounts WHERE email = $1`,
		values: [email]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(400, `Invalid email or password`);
	}

	return await bcrypt.compare(password, res.rows[0].password);
}

export async function linkPlayerToAccount(playerUUID: string, accountId: string): Promise<User> {
	await pool.query({
		text: `UPDATE accounts SET mc_uuid = $1 WHERE id = $2`,
		values: [playerUUID, accountId]
	});

	return await getUserByPlayerUUID(playerUUID);
}
