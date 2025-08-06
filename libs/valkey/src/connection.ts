import Redis, { Callback, Result } from 'ioredis';
import { getMatchmakerScript } from './scripts';

export const valkey = new Redis({
	host: process.env.VALKEY_HOST ?? '127.0.0.1',
	port: process.env.VALKEY_PORT ? parseInt(process.env.VALKEY_PORT) : 6379,
	scripts: {
		matchmaker: {
			lua: await getMatchmakerScript(),
			numberOfKeys: 1
		}
	}
});

export const subscriber = new Redis({
	host: process.env.VALKEY_HOST ?? '127.0.0.1',
	port: process.env.VALKEY_PORT ? parseInt(process.env.VALKEY_PORT) : 6379
});

declare module 'ioredis' {
	interface RedisCommander<Context> {
		matchmaker(instancesKey: string, player: string, callback?: Callback<string>): Result<string, Context>;
	}
}
