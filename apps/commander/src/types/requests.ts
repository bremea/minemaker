import { GameInstanceType } from '@minemaker/db';

export interface CreateInstanceRequest {
	game: string;
	type: GameInstanceType;
	player: string;
}
