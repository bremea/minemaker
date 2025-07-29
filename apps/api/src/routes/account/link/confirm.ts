import type { ElysiaApp } from '$src/app';
import { requireAccountOrPlayer } from '$src/lib/middleware/auth';
import {
	getLinkRequest,
	InternalApiError,
	linkPlayerToAccount,
	UnauthorizedApiError,
	UserSchema
} from '@minemaker/db';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.use(requireAccountOrPlayer).post(
		'/',
		async ({ body, user }) => {
			if (!user.account) {
				throw UnauthorizedApiError;
			}

			if (!body.code) {
				throw new InternalApiError(400, 'Missing link request code');
			}

			const linkRequest = await getLinkRequest(body.code);
			const newUser = await linkPlayerToAccount(linkRequest.playerUUID, user.account.id);

			return newUser;
		},
		{
			detail: {
				summary: 'Confirm linking Minecraft & Minemaker accounts',
				operationId: 'ConfirmLink'
			},
			body: t.Object({
				code: t.String()
			}),
			response: {
				200: UserSchema
			},
			parse: 'application/json'
		}
	);
