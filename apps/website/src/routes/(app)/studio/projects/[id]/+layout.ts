import { getGame, getGameReleaseEligibility } from '$lib/api-client';
import type { Game } from '@minemaker/db';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, params }) => {
	const data = await parent();

	const awaitGetProject = async () => {
		const game = await getGame(params.id);

		if (game.status != 200) {
			throw game.data;
		}

		return game.data as Game;
	};

	const awaitGetEligibility = async () => {
		const game = await getGameReleaseEligibility(params.id);

		if (game.status != 200) {
			throw game.data;
		}

		return game.data;
	};

	return {
		project: { eligibility: await awaitGetEligibility(), ...(await awaitGetProject()) },
		...data
	};
};
