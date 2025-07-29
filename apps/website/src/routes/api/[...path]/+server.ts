import { API_URL } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';

const reqHandler: RequestHandler = async ({ request, params, url, cookies }) => {
	const accessToken = cookies.get('access');
	const refreshToken = cookies.get('refresh');

	const path = params.path ?? '';
	const apiUrl = new URL(`${API_URL}/api/${path}`);

	const makeRequest = async (access: string | undefined) => {
		url.searchParams.forEach((value, key) => {
			apiUrl.searchParams.set(key, value);
		});

		const headers = new Headers(request.headers);
		if (access) {
			headers.set('Authorization', `Bearer ${access}`);
		}
		headers.delete('host');

		const hasBody = !['GET', 'HEAD'].includes(request.method);

		return await fetch(apiUrl.toString(), {
			method: request.method,
			headers,
			body: hasBody ? request.body : undefined,
			...(hasBody && { duplex: 'half' })
		});
	};

	const res = await makeRequest(accessToken);

	const contentType = res.headers.get('Content-Type') ?? '';
	const responseHeaders = new Headers();

	res.headers.forEach((header, key) => {
		responseHeaders.set(key, header);
	});
	const clone = res.clone();

	if (
		(path === 'account/signup' || path === 'account/login' || path === 'account/link/login') &&
		contentType.includes('application/json') &&
		res.ok
	) {
		try {
			const json = await clone.json();

			if (json?.tokens?.access) {
				cookies.set('access', json.tokens.access, {
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					path: '/'
				});
			}

			if (json?.tokens?.refresh) {
				cookies.set('refresh', json.tokens.refresh, {
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					path: '/'
				});
			}
		} catch {
			// ...
		}
	}

	if (!res.ok && contentType.includes('application/json') && res.status == 401) {
		const refreshReqHeaders = new Headers();
		refreshReqHeaders.set('Authorization', `Bearer ${refreshToken}`);

		const refreshReq = await fetch(new URL(`${API_URL}/api/auth/refresh`), {
			method: 'GET',
			headers: refreshReqHeaders
		});

		const refreshReqContentType = res.headers.get('Content-Type') ?? '';

		const json = await refreshReq.json();
		if (!refreshReq.ok || !refreshReqContentType.includes('application/json')) {
			return new Response(res.body, {
				status: res.status,
				statusText: res.statusText,
				headers: responseHeaders
			});
		}

		if (json?.access) {
			cookies.set('access', json.access, {
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				path: '/'
			});
		}

		if (json?.refresh) {
			cookies.set('refresh', json.refresh, {
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				path: '/'
			});
		}

		const retry = await makeRequest(json?.access);

		const retryHeaders = new Headers();
		retry.headers.forEach((header, key) => {
			retryHeaders.set(key, header);
		});

		return new Response(retry.body, {
			status: retry.status,
			statusText: retry.statusText,
			headers: retryHeaders
		});
	}

	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers: responseHeaders
	});
};

export const GET = reqHandler;
export const HEAD = reqHandler;
export const PUT = reqHandler;
export const POST = reqHandler;
export const PATCH = reqHandler;
export const DELETE = reqHandler;
export const OPTIONS = reqHandler;
