import { me, refreshAccess } from '$lib/api-client.js';
import type { User } from '@minemaker/db';

export const load = async ({ cookies }) => {
	if (cookies.get('access') == undefined || cookies.get('refresh') == undefined) {
		return {
			user: {} as User
		};
	}

	const access = cookies.get('access')!;
	const refresh = cookies.get('refresh')!;

	const onRefresh = (access: string, refresh: string) => {
		cookies.set('access', access, {
			httpOnly: true,
			secure: !process.env.DEVELOPMENT_MODE,
			path: '/',
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
		});
		cookies.set('refresh', refresh, {
			httpOnly: true,
			secure: !process.env.DEVELOPMENT_MODE,
			path: '/',
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
		});
	};

	try {
		const res = await me({ headers: { Authorization: `Bearer ${access}` } });

		if (res.status != 200) {
			if (res.status == 401) {
				const refreshRes = await refreshAccess({ headers: { Authorization: `Bearer ${refresh}` } });

				if (refreshRes.status != 200) throw refreshRes.data;

				onRefresh(refreshRes.data.access, refreshRes.data.refresh);

				const retry = await me({ headers: { Authorization: `Bearer ${refreshRes.data.access}` } });

				if (retry.status != 200) throw retry.data;

				return {
					user: retry.data as User
				};
			} else {
				throw res.data;
			}
		}

		return {
			user: res.data as User
		};
	} catch {
		return { user: {} };
	}
};
