import { getHomepage } from '$lib/api-client';
import type { Game } from '@minemaker/db';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './[...path]/$types';

export const load: PageLoad = async ({ parent }) => {
	const data = await parent();

	try {
		const res = await getHomepage();
		console.log(res.data);
		if (res.status != 200) {
			throw res.data;
		}

		return { ...data, featured: res.data.featured as Game[], playlog: res.data.playlog as Game[] };
	} catch {
		return error(500);
	}
};
