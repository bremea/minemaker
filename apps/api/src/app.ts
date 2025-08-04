import { Elysia } from 'elysia';
import { autoload } from 'elysia-autoload';
import { jwt } from '@elysiajs/jwt';
import { Snowyflake } from 'snowyflake';
import { ip } from 'elysia-ip';
import { cors } from '@elysiajs/cors';
import Cloudflare from 'cloudflare';
import { InternalApiError } from '@minemaker/db';
import { S3Client } from '@aws-sdk/client-s3';
import node from '@elysiajs/node';
import { swagger } from '@elysiajs/swagger';
import 'dotenv/config';

const app = new Elysia({ adapter: node() })
	.error({ InternalApiError })
	.onError(({ code, error, set, status }) => {
		if (process.env.NODE_ENV == 'dev') {
			console.log(error);
		}

		switch (code) {
			case 'InternalApiError': {
				set.status = error.status;
				return { error: true, code: error.status, message: error.toString() };
			}
			case 'VALIDATION': {
				return { error: true, code: 422, message: error.message };
			}
			case 'NOT_FOUND': {
				return { error: true, code: 404, message: code };
			}
			default: {
				return { error: true, code: status, message: code };
			}
		}
	})
	.use(swagger())
	.use(cors({ origin: '*' }))
	.use(ip())
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.decorate(
		'snowflake',
		new Snowyflake({
			workerId: BigInt(process.env.WORKER_ID!),
			epoch: BigInt(1588651200000)
		})
	)
	.decorate(
		'r2',
		new S3Client({
			region: 'auto',
			endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
			credentials: {
				accessKeyId: process.env.R2_ACCESS_KEY_ID!,
				secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
			}
		})
	)
	.decorate('cf', new Cloudflare({ apiToken: process.env.CF_TOKEN! }))
	.use(
		await autoload({
			prefix: '/api',
			schema: ({ url }) => {
				const tag = url.split('/').at(1)!;

				return {
					detail: {
						tags: [tag]
					}
				};
			}
		})
	)
	.listen(3000);

export type ElysiaApp = typeof app;

console.log('API running :3');
