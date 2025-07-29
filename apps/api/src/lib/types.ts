import { t } from 'elysia';

export const TokenSchema = t.Object({
	refresh: t.String(),
	access: t.String()
});
