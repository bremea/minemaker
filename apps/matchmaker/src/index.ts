import { GameInstanceType, getMatchmakingRequest, sendMatchmakingError, sendMatchmakingNewInstance, sendMatchmakingStandby, sendMatchmakingStart } from '@minemaker/db';
import { request, valkey } from '@minemaker/valkey';
import 'dotenv/config';

async function main() {
	if (!process.env.REGION) throw new Error('Missing region env!');
	const region = process.env.REGION;

	console.log('Matchmaker Started');

	while (true) {
		const request = await valkey.blpop([`matchmaking:${region}:queue`], 0);
		if (!request) continue;
		const player = request[1].toString();

		try {
			const data = await getMatchmakingRequest(player);
			await sendMatchmakingStart(data.player);

			const result = (await valkey.matchmaker(`matchmaking:${data.game}:${region}:instances`, data.player)) as string | null;

			if (result == null) {
				const instance = await createInstance(data.game, data.player, region);
				await sendMatchmakingNewInstance(data.player, instance);
			} else {
				await sendMatchmakingStandby(data.player, result);
			}
		} catch (e) {
			await sendMatchmakingError(player, String(e));
		}
	}
}

async function createInstance(game: string, player: string, region: string): Promise<string> {
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

main();
