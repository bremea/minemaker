import { Build, GameInstanceProperties, GameInstanceType } from '@minemaker/db';
import Docker from 'dockerode';

export type Instances = { [key: string]: Instance };

export interface Instance {
	properties: GameInstanceProperties;
}

export interface GameInstanceOptions {
	name: string;
	build: Build;
	type: GameInstanceType;
	network: string;
	ip: string;
	region: Region;
	max: number;
	docker: Docker;
	player?: string;
	owner?: string;
}

export interface CommanderOptions {
	region: Region;
	id: number;
	name: string;
	baseIp: string;
	docker: Docker;
	network: Docker.Network;
	maxInstances?: number;
}

export interface Region {
	name: string;
	id: number;
}
