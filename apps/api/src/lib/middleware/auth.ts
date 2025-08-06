import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { Account, getUserByAccountId, getUserByPlayerUUID, InternalApiError, Player, UnauthorizedApiError, User } from '@minemaker/db';
import bearer from '@elysiajs/bearer';

export const checkAuth = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.use(bearer())
	.resolve({ as: 'global' }, async ({ bearer, jwt }): Promise<{ validAuth: boolean; user: User }> => {
		if (bearer) {
			return await checkToken(bearer, jwt);
		} else {
			return {
				validAuth: false,
				user: {}
			};
		}
	});

export const requireAccountOrPlayer = new Elysia().use(checkAuth).resolve({ as: 'scoped' }, async ({ user, validAuth }) => {
	if (!validAuth) {
		throw new InternalApiError(401, 'Invalid authorization');
	}

	if (user.account || user.player) {
		return { user };
	} else {
		throw UnauthorizedApiError;
	}
});

export const requireAccountAndPlayer = new Elysia().use(checkAuth).resolve({ as: 'scoped' }, async ({ user, validAuth }) => {
	if (!validAuth) {
		throw new InternalApiError(401, 'Invalid authorization');
	}

	if (user.account && user.player) {
		return { user } as { user: { account: Account; player: Player } };
	} else {
		throw UnauthorizedApiError;
	}
});

export const RequireAccount = new Elysia().use(checkAuth).resolve({ as: 'scoped' }, async ({ user, validAuth }) => {
	if (!validAuth) {
		throw new InternalApiError(401, 'Invalid authorization');
	}

	if (user.account) {
		return { user } as { user: { account: Account; player: Player | undefined } };
	} else {
		throw UnauthorizedApiError;
	}
});

export const RequirePlayer = new Elysia().use(checkAuth).resolve({ as: 'scoped' }, async ({ user, validAuth }) => {
	if (!validAuth) {
		throw new InternalApiError(401, 'Invalid authorization');
	}

	if (user.player) {
		return { user } as { user: { account: Account | undefined; player: Player } };
	} else {
		throw UnauthorizedApiError;
	}
});

const checkToken = async (
	token: string,
	jwt: {
		verify: any;
	}
): Promise<{ validAuth: boolean; user: User }> => {
	const userData = await jwt.verify(token);

	if (!userData) {
		return { validAuth: false, user: {} };
	}

	if (userData.id) {
		return { validAuth: true, user: await getUserByAccountId(userData.id) };
	} else if (userData.uuid) {
		return { validAuth: true, user: await getUserByPlayerUUID(userData.uuid) };
	} else {
		return { validAuth: false, user: {} };
	}
};
