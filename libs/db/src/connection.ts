import { Pool } from 'pg';

export const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT as number | undefined,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	maxLifetimeSeconds: 60
});
