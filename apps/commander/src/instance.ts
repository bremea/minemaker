import { Build, GameInstanceProperties, GameInstanceStatus } from '@minemaker/db';
import { valkey } from '@minemaker/valkey';
import Docker from 'dockerode';
import { Socket } from './socket';
import { GameInstanceOptions, Region } from './types/instances';
import { calcInstanceScore } from './utils';

export class Instance {
	public id: number;
	public name: string;
	public network: string;
	public build: Build;
	public socket: Socket;
	public docker: Docker;
	public properties: GameInstanceProperties;
	public online: string[];
	public standby: string[];
	public region: Region;
	public container: Docker.Container | undefined;

	constructor(id: number, options: GameInstanceOptions) {
		this.id = id;
		this.name = options.name;
		this.network = options.network;
		this.build = options.build;
		this.region = options.region;
		this.docker = options.docker;
		this.socket = new Socket(`/tmp/${this.name}.sock`);
		this.online = [];
		this.standby = [];

		this.properties = {
			game: options.build.game,
			build: options.build.id,
			type: options.type,
			status: GameInstanceStatus.Starting,
			started: Math.floor(Date.now() / 1000),
			region: options.region.name,
			max: options.max,
			ip: options.ip,
			owner: options.owner
		};
	}

	public async init(player?: string) {
		try {
			await this.updateValkeyProperties();
			await this.updateMatchmakingScore();
			if (player) await this.pushPlayerStandby(player);

			this.socket.start();

			this.container = await this.docker.createContainer({
				name: this.name,
				Image: `registry.digitalocean.com/minemaker/server:1.21.8`,
				HostConfig: {
					NetworkMode: this.network
				},
				NetworkingConfig: {
					EndpointsConfig: {
						[this.network]: {
							IPAMConfig: {
								IPv6Address: this.properties.ip
							}
						}
					}
				}
			});
			this.container.start();
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	private async pushPlayerStandby(player: string) {
		this.standby.push(player);
		await valkey.sadd(`instance:${this.name}:standby`, [player]);
	}

	private async updateMatchmakingScore() {
		await valkey.zadd(`matchmaking:${this.build.game.id}:${this.build.id}:${this.properties.region}:instances`, calcInstanceScore(1, this.properties.max), this.name);
	}

	private async updateValkeyProperties(properties?: GameInstanceProperties) {
		if (properties) this.properties = properties;
		await valkey.hset(`instance:${this.name}`, { ...this.properties, game: this.properties.game.id });
	}
}
