import { GameInstance, GameInstanceType, getGameById, getInstanceById, MatchmakingRequest } from '@minemaker/db';
import { request, valkey } from '@minemaker/valkey';
import 'dotenv/config';

export async function getGameInstance(data: MatchmakingRequest): Promise<GameInstance> {
	let build = data.build;
	if (!build) {
		const game = await getGameById(data.game);
		if (!game.currentBuild) throw new Error(`No build available for game ${game.id}`);
		build = game.currentBuild.id;
	}

	const result = (await valkey.matchmaker(`matchmaking:${data.game}:${build}:${data.region}:instances`, data.player)) as string | null;

	if (result != null) {
		return await getInstanceById(result);
	}

	try {
		const instance = await createInstance(data.game, data.player, data.region);
		return await getInstanceById(instance);
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export async function createInstance(game: string, player: string, region: string): Promise<string> {
	const servers = await valkey.zrange(`matchmaking:${region}:servers`, 0, 0);

	if (servers.length == 0) {
		throw new Error('No servers available');
	}

	const server = servers[0];
	const id = await request<string>(`request:${server}:instance-create`, { game: game, type: GameInstanceType.Public, player: player });

	if (id.e) {
		throw new Error(id.d);
	}

	return id.d;
}
