import { pool } from '../connection';
import { t } from 'elysia';
import { InternalApiError } from '../utils';

export const LinkRequestSchema = t.Object({
	code: t.String(),
	accountId: t.String(),
	playerUUID: t.String(),
	expires: t.Date()
});

export type LinkRequest = typeof LinkRequestSchema.static;

function parseLinkRequest(data: any): LinkRequest {
	return {
		code: data.code,
		accountId: data.account_id,
		playerUUID: data.player_uuid,
		expires: data.expires
	};
}

export async function createLinkRequest(code: string, accountId: string, playerUUID: string): Promise<LinkRequest> {
	const res = await pool.query({
		text: `INSERT INTO link_requests (code, account_id, player_uuid) VALUES($1, $2, $3) RETURNING *`,
		values: [code, accountId, playerUUID]
	});

	return parseLinkRequest(res.rows[0]);
}

export async function getLinkRequest(code: string): Promise<LinkRequest> {
	const res = await pool.query({
		text: `SELECT * FROM link_requests WHERE code = $1 AND expires > now()`,
		values: [code]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(404, `No link request exists with code ${code}`);
	}

	return parseLinkRequest(res.rows[0]);
}
