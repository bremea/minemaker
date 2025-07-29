import type { ElysiaApp } from '$src/app';
import { requireAccountOrPlayer } from '$src/lib/middleware/auth';
import { UserSchema } from '@minemaker/db';

export default (app: ElysiaApp) =>
	app.use(requireAccountOrPlayer).get(
		'/',
		async ({ user }) => {
			return user;
		},
		{
			detail: {
				summary: 'Get current account info',
				operationId: 'Me'
			},
			response: {
				200: UserSchema
			},
			parse: 'application/json'
		}
	);
