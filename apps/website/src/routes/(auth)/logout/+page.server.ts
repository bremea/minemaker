import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete('access', { path: '/' });
	cookies.delete('refresh', { path: '/' });

	return;
};
