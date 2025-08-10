import { GameInstanceStatus } from '@minemaker/db';
import { getGameInstance } from '@minemaker/valkey';
import Docker from 'dockerode';
import { Socket } from './socket';
import { PlayerJoinMessage, PlayerLeaveMessage, SocketMessage, SocketMessageType } from './types/sockets';

export class Proxy {
	public docker: Docker;
	public online: string[];
	public container: Docker.Container | undefined;
	public network: Docker.Network;
	public socket: Socket;
	public ip: string;

	constructor(docker: Docker, network: Docker.Network) {
		this.docker = docker;
		this.network = network;
		this.online = [];
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
			}
		});
	}

	private async playerJoin(msg: PlayerJoinMessage) {
		this.online.push(msg.d.uuid);

		const lobbyInstance = await getGameInstance({
			player: msg.d.uuid,
			game: '693970005007663104', // lobby game id
			region: process.env.REGION!
		});

		if (lobbyInstance.properties.status != GameInstanceStatus.Ready) {
			this.socket.send(SocketMessageType.KickPlayer, { player: msg.d.uuid, reason: 'No lobby instances available!' });
		}

		this.socket.send(SocketMessageType.TransferPlayer, { player: msg.d.uuid, ...lobbyInstance.properties });
	}

	private playerLeave(msg: PlayerLeaveMessage) {
		this.online.filter((e) => e != msg.d.uuid);
	}
}
