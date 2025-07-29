import { pool } from '../connection';
import { t } from 'elysia';

export const TrustedIpSchema = t.Object({
	accountId: t.String(),
	ip: t.String(),
	lastLogin: t.Date()
});

export const TrustedIpRequestSchema = t.Object({
	code: t.String(),
	accountId: t.String(),
	ip: t.String(),
	expires: t.Date()
});

export type TrustedIp = typeof TrustedIpSchema.static;
export type TrustedIpRequest = typeof TrustedIpRequestSchema.static;

function parseTrustedIp(data: any): TrustedIp {
	return {
		accountId: data.account_id,
		ip: data.ip,
		lastLogin: data.last_login
	};
}

export async function trustIp(accountId: string, ip: string): Promise<TrustedIp> {
	const res = await pool.query({
		text: `INSERT INTO trusted_ips (account_id, ip) VALUES($1, $2) RETURNING *`,
		values: [accountId, ip]
	});

	return parseTrustedIp(res.rows[0]);
}

export async function checkIpTrusted(accountId: string, ip: string): Promise<boolean> {
	const res = await pool.query({
		text: `SELECT 1 FROM trusted_ips WHERE account_id = $1 AND ip = $2`,
		values: [accountId, ip]
	});

	return res.rows.length > 0;
}

export async function updateTrustedIpLastLogin(accountId: string, ip: string): Promise<TrustedIp> {
	const res = await pool.query({
		text: `UPDATE trusted_ips SET last_login = now() WHERE account_id = $1 AND ip = $2 RETURNING *`,
		values: [accountId, ip]
	});

	return parseTrustedIp(res.rows[0]);
}
