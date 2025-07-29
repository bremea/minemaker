import type { PageServerLoad } from './$types';
import { MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_LINK_REDIRECT_URI } from '$env/static/private';

export const load: PageServerLoad = async () => {
	return {
		authLink: `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${MICROSOFT_CLIENT_LINK_REDIRECT_URI}&response_mode=query&scope=XboxLive.signin%20XboxLive.offline_access`
	};
};
