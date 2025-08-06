import { Pool } from 'pg';
import 'dotenv/config';
import types from 'pg-types';
import JSONbig from 'json-bigint';

const JSON_OID = 114;
const JSONB_OID = 3802;

types.setTypeParser(JSON_OID, (val) => jsonParse(val));
types.setTypeParser(JSONB_OID, (val) => jsonParse(val));

function jsonParse(input: string): any {
	return JSONbig.parse(input);
}

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
