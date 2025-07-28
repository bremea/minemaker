import { Pool } from 'pg';
import 'dotenv/config';

export const pool = new Pool({
	host: process.env.DB_HOST!,
	port: parseInt(process.env.DB_PORT!),
	user: process.env.DB_USER!,
	password: process.env.DB_PASSWORD!,
	database: process.env.DB_NAME!,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	maxLifetimeSeconds: 60
});