import EventEmitter from 'events';
import fs from 'fs';
import net, { Socket as NetSocket, Server } from 'net';
import { SocketMessage, SocketMessageType } from './types/sockets';

export class Socket extends EventEmitter {
	public path: string;
	private server?: Server;
	private clients: Set<NetSocket> = new Set();

	constructor(path: string) {
		super();
		this.path = path;
	}

	start() {
		if (fs.existsSync(this.path)) {
			fs.unlinkSync(this.path);
		}

		this.server = net.createServer((conn) => {
			this.clients.add(conn);
			this.emit('connect', conn);

			let buffer = '';

			conn.on('data', (chunk) => {
				buffer += chunk.toString();

				let index;
				while ((index = buffer.indexOf('\n')) >= 0) {
					const line = buffer.slice(0, index);
					buffer = buffer.slice(index + 1);

					if (!line.trim()) continue;

					try {
						const msg: SocketMessage = JSON.parse(line);
						this.emit('message', msg, conn);
					} catch (e) {
						this.emit('error', new Error(`parse error: ${line}`));
					}
				}
			});

			conn.on('end', () => {
				console.log('client disconnected!');
				this.clients.delete(conn);
				this.emit('disconnect', conn);
			});

			conn.on('error', (err) => {
				this.clients.delete(conn);
				this.emit('error', err);
			});
		});

		this.server.listen(this.path, () => {
			this.emit('listening', this.path);
		});
	}

	send(type: SocketMessageType, data?: any, target?: NetSocket) {
		const msg: SocketMessage = { t: type, d: data };
		const serialized = JSON.stringify(msg) + '\n';

		if (target) {
			target.write(serialized);
		} else {
			for (const client of this.clients) {
				client.write(serialized);
			}
		}
	}

	close() {
		for (const client of this.clients) {
			client.end();
		}
		this.clients.clear();
		this.server?.close();
	}
}
