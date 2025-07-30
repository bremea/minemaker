import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const parentData = await parent();

	if (!parentData.user.account) {
		redirect(303, '/login');
	}
	if (!parentData.user.player) {
		redirect(303, '/link');
	}

	return parentData;
};

export const ssr = false;