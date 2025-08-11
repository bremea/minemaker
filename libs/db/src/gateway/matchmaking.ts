import { t } from 'elysia';

export const MatchmakingRequestSchema = t.Object({
	player: t.String(),
	game: t.String(),
	build: t.Optional(t.String()),
	region: t.String()
});

export type MatchmakingRequest = typeof MatchmakingRequestSchema.static;
