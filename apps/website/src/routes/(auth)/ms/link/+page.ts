import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	if (!browser) return;

	if (!url.searchParams.has('code')) {
		redirect(303, '/link');
	}

	return {
		code: url.searchParams.get('code')
	};
};
