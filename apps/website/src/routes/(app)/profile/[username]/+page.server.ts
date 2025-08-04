import { getProfile } from '$lib/api-client';
import type { Game, Presence, Profile } from '@minemaker/db';
import { error } from '@sveltejs/kit';

export const load = async ({ parent, params }) => {
	const data = await parent();

	try {
		const res = await getProfile(params.username);

		if (res.status != 200) {
			throw res.data;
		}

		console.log(res.data)

		return {
			profile: res.data as unknown as Profile & {
				creations: Omit<Game, 'owner'>[];
				presence: Presence | undefined;
			},
			...data
		};
	} catch {
		throw error(404);
	}
};
