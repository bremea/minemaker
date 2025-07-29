import { browser } from '$app/environment';

const getBody = <T>(c: Response | Request): Promise<T> => {
	const contentType = c.headers.get('content-type');

	if (contentType && contentType.includes('application/json')) {
		return c.json();
	}

	if (contentType && contentType.includes('application/pdf')) {
		return c.blob() as Promise<T>;
	}

	return c.text() as Promise<T>;
};

const getUrl = (url: string): string => {
	if (browser) return url;

	const baseUrl = process.env.API_URL;
	const requestUrl = new URL(`${baseUrl}${url}`);

	return requestUrl.toString();
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
	const requestUrl = getUrl(url);
	const requestInit: RequestInit = {
		...options
	};

	const request = new Request(requestUrl, requestInit);
	const response = await fetch(request);
	const data = await getBody<T>(response);

	return { status: response.status, data } as T;
};
