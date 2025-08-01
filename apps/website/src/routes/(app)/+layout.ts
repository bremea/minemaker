import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, data }) => {
	await parent();

	return data;
};
