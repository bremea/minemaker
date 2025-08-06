import { randomUUID } from 'node:crypto';
import { subscriber, valkey } from '../connection';

export class Handler {
	private endpoints: { [key: string]: (data: any) => Promise<string | object> | string | object };

	constructor() {
		this.endpoints = {};
	}

	public handle(channel: string, callback: (data: any) => Promise<string | object> | string | object): Handler {
		this.endpoints[channel] = callback;
		return this;
	}

	public start(): Handler {
		for (const channel of Object.keys(this.endpoints)) {
			subscriber.subscribe(channel, async (err) => {
				if (err) throw err;
			});
		}

		subscriber.on('message', async (channel, data) => {
			if (!Object.keys(this.endpoints).includes(channel)) return;

			try {
				const msg = JSON.parse(data);
				try {
					const reply = await this.endpoints[channel](msg['d']);
					await valkey.publish(msg['r'], JSON.stringify({ e: false, d: reply }));
				} catch (e) {
					await valkey.publish(msg['r'], JSON.stringify({ e: true, d: String(e) }));
				}
			} catch (e) {
				console.error(e);
			}
		});

		return this;
	}
}

export async function request<T>(channel: string, data: any, timeout: number = 5000): Promise<{ e: boolean; d: T }> {
	const id = randomUUID();
	const responseChannel = `response:${id}`;

	const message = JSON.stringify({ r: responseChannel, d: data });

	return new Promise<{ e: boolean; d: T }>(async (resolve, reject) => {
		await subscriber.subscribe(responseChannel, async (err) => {
			if (err) throw err;
		});

		subscriber.on('message', async (channel, data) => {
			if (channel != responseChannel) return;

			try {
				const msg = JSON.parse(data);
				await subscriber.unsubscribe(responseChannel);

				if (msg.e) {
					reject(msg);
				} else {
					resolve(msg);
				}
			} catch (e) {
				reject({ e: true, d: String(e) });
			}
		});

		await valkey.publish(channel, message);

		setTimeout(() => reject({ e: true, d: 'Timed out' }), timeout);
	});
}
