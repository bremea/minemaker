import { t } from 'elysia';

export const MatchmakingRequestSchema = t.Object({
	player: t.String(),
	game: t.String(),
	region: t.String()
});

export type MatchmakingRequest = typeof MatchmakingRequestSchema.static;
