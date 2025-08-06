import { Build, GameInstanceProperties, GameInstanceStatus } from '@minemaker/db';
import { valkey } from '@minemaker/valkey';
import Docker from 'dockerode';
import { GameInstanceOptions, Region } from './types/instance';
import { calcInstanceScore } from './utils';

export class Instance {
	public id: number;
	public name: string;
	public network: string;
	public build: Build;
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
		this.online = [];
		this.standby = [];

		this.properties = {
			game: options.build.game,
			build: options.build.id,
			type: options.type,
			status: GameInstanceStatus.Starting,
			started: Math.floor(Date.now() / 1000),
			region: options.region.name,
			maxPlayers: options.max,
			ip: options.ip,
			owner: options.owner
		};
	}

	public async init(player?: string) {
		await this.updateValkeyProperties();
		await this.updateMatchmakingScore();
		if (player) await this.pushPlayerStandby(player);

		this.container = await this.docker.createContainer({
			name: this.name,
			Image: `registry.digitalocean.com/minemaker/server:1.21.7`,
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
	}

	private async pushPlayerStandby(player: string) {
		this.standby.push(player);
		await valkey.sadd(`instances:${this.name}:standby`, [player]);
	}

	private async updateMatchmakingScore() {
		await valkey.zadd(`matchmaking:${this.build.game.id}:${this.properties.region}:instances`, calcInstanceScore(1, this.properties.maxPlayers), this.name);
	}

	private async updateValkeyProperties(properties?: GameInstanceProperties) {
		if (properties) this.properties = properties;
		await valkey.hset(`instances:${this.name}`, this.properties);
	}
}
