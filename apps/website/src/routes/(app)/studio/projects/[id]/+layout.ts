import { browser } from '$app/environment';
import { getGame } from '$lib/api-client';
import type { Game } from '@minemaker/db';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, params }) => {
	const data = await parent();

	const awaitGetProject = async () => {
		if (!browser) return;

		const game = await getGame(params.id);

		if (game.status != 200) {
			throw game.data
		}

		return game.data as Game;
	};

	return { project: awaitGetProject(), ...data };
};
