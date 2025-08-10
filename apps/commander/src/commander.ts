import { GameInstanceType, getBuildById, getGameById } from '@minemaker/db';
import { Handler, valkey } from '@minemaker/valkey';
import Docker from 'dockerode';
import { Instance } from './instance';
import { Proxy } from './proxy';
import { CommanderOptions, GameInstanceOptions } from './types/instances';
import { CreateInstanceRequest } from './types/requests';
import { calcServerScore, generateInstanceId, getContainerIPv6 } from './utils';

export default class Commander {
	public id: number;
	public name: string;
	public baseIp: string;
	public proxy: Proxy;
	public docker: Docker;
	public network: Docker.Network;
	public region: { name: string; id: number };
	public maxInstances: number;
	public instances: { [key: string]: Instance };
	public handler: Handler;

	constructor(options: CommanderOptions) {
		this.id = options.id;
		this.name = options.name;
		this.baseIp = options.baseIp;
		this.region = options.region;
		this.maxInstances = options.maxInstances ?? 64;
		this.instances = {};
		this.docker = options.docker;
		this.network = options.network;
		this.proxy = new Proxy(this.docker, this.network);

		this.handler = new Handler().handle(`request:${this.name}:instance-create`, this.createInstance.bind(this)).start();

		this.updateServerScore();
		this.proxy.init();

		console.log('Commander started');
	}

	private async updateServerScore() {
		const instances = Object.keys(this.instances).length;
		if (instances >= this.maxInstances) {
			await valkey.zrem(`matchmaking:${this.region.name}:servers`, this.name);
		} else {
			await valkey.zadd(`matchmaking:${this.region.name}:servers`, calcServerScore(Object.keys(this.instances).length, this.maxInstances), this.name);
		}
	}

	private async createInstance(data: CreateInstanceRequest): Promise<string> {
		if (Object.keys(this.instances).length + 1 >= this.maxInstances) throw new Error('Max instances reached for this server');

		const game = await getGameById(data.game);
		if (!game.currentBuild) throw new Error('No current build?');
		const build = await getBuildById(game.currentBuild.id);

		const id = 1;
		const name = generateInstanceId(this.name, id);
		const max = 25;

		const instanceOptions: GameInstanceOptions = {
			name,
			build,
			docker: this.docker,
			type: data.type,
			region: this.region,
			network: this.network.id,
			ip: getContainerIPv6(this.baseIp, this.region.id, this.id, id),
			max
		};

		if (data.type != GameInstanceType.Public) {
			instanceOptions.owner = data.player;
		}

		const instance = new Instance(id, instanceOptions);
		this.instances[id] = instance;

		await instance.init(data.player);
		await this.updateServerScore();

		return name;
	}
}
