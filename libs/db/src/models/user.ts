import { pool } from '../connection';
import { InternalApiError } from '../utils';

export interface User {
	account?: Account;
	player?: Player;
}

export interface Account {
	id: string;
	email: string;
	emailVerified: boolean;
	lastLogin: string;
}

export interface Player {
	uuid: string;
	username: string;
	flags: PlayerFlags;
	permissions: PlayerPermissions;
	firstLogin: string;
	lastSeen: string;
}

enum PlayerFlags {
	None = 0,
	Staff = 1 << 0, // 001
	Partner = 1 << 1, // 010
	Reserved = 1 << 2, // 100
	All = ~(~0 << 3) // 111
}

enum PlayerPermissions {
	None = 0,
	Warn = 1 << 0, // 000001
	Mute = 1 << 1, // 000010
	Kick = 1 << 2, // 000100
	Ban = 1 << 3, // 001000
	IpBan = 1 << 4, // 010000
	StudioBan = 1 << 5, // 100000
	All = ~(~0 << 6) // 111111
}

function parseDatabasePlayer(data: any): Player {
	return {
		uuid: data.uuid ?? data.mc_uuid,
		username: data.username,
		flags: data.flags,
		permissions: data.permissions,
		firstLogin: data.first_login,
		lastSeen: data.last_seen
	};
}

function parseDatabaseAccount(data: any): Account {
	return {
		id: data.id,
		email: data.email,
		emailVerified: data.email_verified,
		lastLogin: data.last_login
	};
}

export async function getAccountById(id: string): Promise<Account> {
	const res = await pool.query({
		text: `SELECT * FROM accounts WHERE id = $1`,
		values: [id]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(400, `No account exists with id ${id}`);
	}

	return parseDatabaseAccount(res.rows[0]);
}

export async function getPlayerByUUID(uuid: string): Promise<Player> {
	const res = await pool.query({
		text: `SELECT * FROM players WHERE uuid = $1`,
		values: [uuid]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(400, `No player exists with uuid ${uuid}`);
	}

	return parseDatabasePlayer(res.rows[0]);
}

export async function getUserByAccountId(id: string): Promise<User> {
	const res = await pool.query({
		text: `SELECT 
					u.*,
					p.*
				FROM accounts a
				LEFT JOIN players p ON a.mc_uuid = p.uuid
				WHERE a.id = $1`,
		values: [id]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(400, `No account exists with id ${id}`);
	}

	const data = res.rows[0];

	const user: User = {
		account: parseDatabaseAccount(data)
	};

	if (res.rows[0].mc_uuid) {
		user.player = parseDatabasePlayer(data);
	}

	return user;
}

export async function getUserByAccountEmail(email: string): Promise<User> {
	const res = await pool.query({
		text: `SELECT 
					u.*,
					p.*
				FROM accounts a
				LEFT JOIN players p ON a.mc_uuid = p.uuid
				WHERE a.email = $1`,
		values: [email]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(400, `No account exists with email ${email}`);
	}

	const data = res.rows[0];

	const user: User = {
		account: parseDatabaseAccount(data)
	};

	if (res.rows[0].mc_uuid) {
		user.player = parseDatabasePlayer(data);
	}

	return user;
}

export async function getUserByPlayerUUID(uuid: string): Promise<User> {
	const res = await pool.query({
		text: `SELECT 
					p.*,
					u.*
				FROM players p
				LEFT JOIN accounts a ON p.uuid = a.mc_uuid
				WHERE p.uuid = $1`,
		values: [uuid]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(400, `No player exists with uuid ${uuid}`);
	}

	const data = res.rows[0];

	const user: User = {
		player: parseDatabasePlayer(data)
	};

	if (res.rows[0].mc_uuid) {
		user.account = parseDatabaseAccount(data);
	}

	return user;
}

export async function createAccount(id: string, email: string, password: string): Promise<Account> {
	const res = await pool.query({
		text: `INSERT INTO accounts (id, email, password) VALUES($1, $2, $3) RETURNING *`,
		values: [id, email, password]
	});

	return parseDatabaseAccount(res.rows[0]);
}
