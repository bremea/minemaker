import { pool } from '../connection';
import { InternalApiError } from '../utils';
import { t } from 'elysia';

export const SessionSchema = t.Object({
	id: t.String(),
	account: t.String(),
	lastIp: t.String(),
	userAgent: t.Optional(t.String()),
	expires: t.Date()
});

export type Session = typeof SessionSchema.static;

function parseDatabaseSession(data: any): Session {
	return {
		id: data.id,
		account: data.account_id,
		lastIp: data.last_ip,
		userAgent: data.user_agent,
		expires: data.expires
	};
}

export async function getSessionById(id: string): Promise<Session> {
	const res = await pool.query({
		text: `SELECT * FROM sessions WHERE id = $1`,
		values: [id]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(404, `No session exists with id ${id}`);
	}

	return parseDatabaseSession(res.rows[0]);
}

export async function createSession(id: string, accountId: string, lastIp: string, userAgent: string): Promise<Session> {
	const res = await pool.query({
		text: `INSERT INTO sessions (id, account_id, last_ip, user_agent) VALUES($1, $2, $3, $4) RETURNING *`,
		values: [id, accountId, lastIp, userAgent]
	});

	return parseDatabaseSession(res.rows[0]);
}

export async function invalidateSession(id: string): Promise<void> {
	await pool.query({
		text: `DELETE FROM sessions WHERE id = $1`,
		values: [id]
	});
}
