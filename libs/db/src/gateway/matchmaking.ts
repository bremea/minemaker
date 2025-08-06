import { t } from 'elysia';
import {
	GameInstanceStatus,
	MatchmakingRequestError,
	MatchmakingRequestNewInstance,
	MatchmakingRequestStandby,
	MatchmakingRequestStarted,
	MatchmakingRequestWaiting,
	MatchmakingStatus
} from '../types';
import { InternalApiError } from '../utils';
import { valkey } from '@minemaker/valkey';

export const MatchmakingRequestSchema = t.Object({
	player: t.String(),
	game: t.String(),
	submitted: t.Date(),
	region: t.String(),
	status: t.Enum(MatchmakingStatus),
	message: t.Optional(t.String()),
	instance: t.Optional(t.String()),
	standby: t.Optional(t.Boolean())
});

export type MatchmakingRequest = typeof MatchmakingRequestSchema.static;

function parseMatchmakingRequest(data: Record<string, string>): MatchmakingRequest {
	return {
		player: data['player'],
		game: data['game'],
		submitted: new Date(parseInt(data['time'])),
		region: data['region'],
		instance: data['instance'],
		message: data['message'],
		status: data['status'] as MatchmakingStatus,
		standby: (data['standby'] ?? '0') == '1'
	};
}

export async function getMatchmakingRequest(player: string): Promise<MatchmakingRequest> {
	const request = await valkey.hgetall(`matchmaking:requests:${player}`);

	if (Object.keys(request).length == 0) {
		throw new InternalApiError(404, `No request exists for player ${player}`);
	}

	return parseMatchmakingRequest(request);
}

export async function createMatchmakingRequest(player: string, game: string, region: string, standby?: boolean): Promise<MatchmakingRequest> {
	const now = Date.now();

	const rawRequest = {
		player,
		game,
		region,
		status: MatchmakingStatus.Waiting,
		submitted: Math.floor(now / 1000).toString(),
		standby: (standby ?? false) ? '1' : '0'
	};

	await valkey.hset(`matchmaking:requests:${player}`, rawRequest);
	await valkey.rpush(`matchmaking:${region}:queue`, player);
	await sendMatchmakingWaiting(player);

	return { ...rawRequest, submitted: new Date(now), standby: standby ?? false };
}

export async function sendMatchmakingWaiting(player: string): Promise<void> {
	await valkey.publish(JSON.stringify({ status: MatchmakingStatus.Waiting } as MatchmakingRequestWaiting), `gateway:match:${player}`);
	await valkey.hset(`matchmaking:requests:${player}`, { status: MatchmakingStatus.Waiting });
}

export async function sendMatchmakingStart(player: string): Promise<void> {
	await valkey.publish(JSON.stringify({ status: MatchmakingStatus.Started } as MatchmakingRequestStarted), `gateway:${player}:match`);
	await valkey.hset(`matchmaking:requests:${player}`, { status: MatchmakingStatus.Started });
}

export async function sendMatchmakingError(player: string, message: string): Promise<void> {
	await valkey.publish(JSON.stringify({ status: MatchmakingStatus.Error, message } as MatchmakingRequestError), `gateway:${player}:match`);
	await valkey.hset(`matchmaking:requests:${player}`, {
		status: MatchmakingStatus.Error,
		message
	});
}

export async function sendMatchmakingNewInstance(player: string, instance: string): Promise<void> {
	await valkey.publish(
		JSON.stringify({
			status: MatchmakingStatus.Standby,
			instance,
			instanceStatus: GameInstanceStatus.Starting
		} as MatchmakingRequestNewInstance),
		`gateway:${player}:match`
	);
	await valkey.hset(`matchmaking:requests:${player}`, {
		status: MatchmakingStatus.Standby,
		instance,
		instanceStatus: GameInstanceStatus.Starting
	});
}

export async function sendMatchmakingStandby(player: string, instance: string): Promise<void> {
	await valkey.publish(
		JSON.stringify({
			status: MatchmakingStatus.Standby,
			instance,
			instanceStatus: GameInstanceStatus.Ready
		} as MatchmakingRequestStandby),
		`gateway:${player}:match`
	);
	await valkey.hset(`matchmaking:requests:${player}`, {
		status: MatchmakingStatus.Standby,
		instance,
		instanceStatus: GameInstanceStatus.Ready
	});
}
