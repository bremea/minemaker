import { getGame } from '$lib/api-client';
import type { Game } from '@minemaker/db';
import { error } from '@sveltejs/kit';

export const load = async ({ parent, params }) => {
	const data = await parent();

	try {
		const res = await getGame(params.id);

		if (res.status != 200) {
			throw res.data;
		}

		return {
			game: res.data as Game,
			...data
		};
	} catch {
		throw error(404);
	}
};
