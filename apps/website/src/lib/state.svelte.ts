import type { User } from '@minemaker/db';

let user: User = $state({});

export function getUser() {
	return user;
}

export function setUser(newUser: User) {
	user = newUser;
}
