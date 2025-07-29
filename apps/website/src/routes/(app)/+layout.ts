import { setUser } from '$lib/state.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	setUser(data.user);
	return data;
};
