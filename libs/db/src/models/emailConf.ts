import { pool } from '../connection';
import { t } from 'elysia';

export const EmailVerificationRequestSchema = t.Object({
	code: t.String(),
	email: t.String(),
	expires: t.Date()
});

export type EmailVerificationRequest = typeof EmailVerificationRequestSchema.static;

function parseEmailVerificationRequest(data: any): EmailVerificationRequest {
	return {
		code: data.code,
		email: data.email,
		expires: data.expires
	};
}

export async function createEmailVerificationRequest(email: string, code: string): Promise<EmailVerificationRequest> {
	const res = await pool.query({
		text: `INSERT INTO email_verification_requests (code, email) VALUES($1, $2) RETURNING *`,
		values: [code, email]
	});

	return parseEmailVerificationRequest(res.rows[0]);
}
