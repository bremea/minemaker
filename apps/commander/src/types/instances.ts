import { GameInstanceProperties } from '@minemaker/db';

export type Instances = { [key: string]: Instance };

export interface Instance {
	properties: GameInstanceProperties;
}
