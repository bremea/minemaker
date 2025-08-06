import { Build, GameInstanceType } from '@minemaker/db';
import Docker from 'dockerode';

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
