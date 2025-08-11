import { GameInstanceStatus, updatePlayerPresence } from '@minemaker/db';
import { getGameInstance, valkey } from '@minemaker/valkey';
import Docker from 'dockerode';
import { Socket } from './socket';
import { PlayerJoinMessage, PlayerLeaveMessage, SocketMessage, SocketMessageType, TransferCompleteMessage } from './types/sockets';

export class Proxy {
	public docker: Docker;
	public online: Record<string, string | null>;
	public container: Docker.Container | undefined;
	public network: Docker.Network;
	public socket: Socket;
	public ip: string;

	constructor(docker: Docker, network: Docker.Network) {
		this.docker = docker;
		this.network = network;
		this.online = {};
		this.socket = new Socket(`/tmp/velocity.sock`);
		this.ip = '';
	}

	public async init() {
		this.socket.start();

		this.container = await this.docker.createContainer({
			name: 'proxy',
			Image: 'velocity-proxy',
			Env: ['SOCKET_PATH=/server/bridge.sock'],
			HostConfig: {
				NetworkMode: this.network.id,
				PortBindings: {
					'25565/tcp': [{ HostPort: '25565' }],
					'25565/udp': [{ HostPort: '25565' }]
				},
				Binds: ['/tmp/velocity.sock:/server/bridge.sock']
			},
			NetworkingConfig: {
				EndpointsConfig: {
					[this.network.id]: {
						IPAMConfig: {
							IPv6Address: this.ip
						}
					}
				}
			},
			ExposedPorts: {
				'25565/tcp': {},
				'25565/udp': {}
			}
		});

		this.container.start();

		this.socket.on('message', (msg: SocketMessage) => {
			switch (msg.t) {
				case SocketMessageType.PlayerJoin: {
					this.playerJoin(msg as PlayerJoinMessage);
					break;
				}
				case SocketMessageType.PlayerLeave: {
					this.playerLeave(msg as PlayerLeaveMessage);
					break;
				}
				case SocketMessageType.TransferComplete: {
					this.transferComplete(msg as TransferCompleteMessage);
					break;
				}
			}
		});
	}

	private async playerJoin(msg: PlayerJoinMessage) {
		this.online[msg.d.uuid] = null;

		const lobbyInstance = await getGameInstance({
			player: msg.d.uuid,
			game: '693970005007663104', // lobby game id
			region: process.env.REGION!
		});

		if (lobbyInstance.properties.status != GameInstanceStatus.Ready) {
			this.socket.send(SocketMessageType.KickPlayer, { player: msg.d.uuid, reason: 'No lobby instances available!' });
		}

		this.socket.send(SocketMessageType.TransferPlayer, { player: msg.d.uuid, id: lobbyInstance.id, ...{ ...lobbyInstance.properties, game: lobbyInstance.properties.game.id } });
	}

	private async transferComplete(msg: TransferCompleteMessage) {
		this.online[msg.d.player] = msg.d.instance;
		await valkey.transfer(`instance:${msg.d.instance}:standby`, `instance:${msg.d.instance}:online`, msg.d.player);
		await updatePlayerPresence(msg.d.player, msg.d.instance);
	}

	private async playerLeave(msg: PlayerLeaveMessage) {
		const instance = this.online[msg.d.uuid];
		if (instance != null) {
			await valkey.srem(`instance:${instance}:standby`, msg.d.uuid);
			await valkey.srem(`instance:${instance}:online`, msg.d.uuid);
		}
		delete this.online[msg.d.uuid];
		await updatePlayerPresence(msg.d.uuid, null);
	}
}
