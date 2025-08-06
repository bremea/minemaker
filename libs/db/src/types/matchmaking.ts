import { GameInstanceStatus } from './enums';

export enum MatchmakingStatus {
	Waiting = 'WAITING',
	Started = 'STARTED',
	Finished = 'FINISHED',
	Standby = 'STANDBY',
	Error = 'ERROR'
}

export interface MatchmakingRequestWaiting {
	status: MatchmakingStatus.Waiting;
}

export interface MatchmakingRequestStarted {
	status: MatchmakingStatus.Started;
}

export interface MatchmakingRequestFinished {
	status: MatchmakingStatus.Finished;
	instance: string;
}

export interface MatchmakingRequestNewInstance {
	status: MatchmakingStatus.Standby;
	instance: string;
	instanceStatus: GameInstanceStatus.Starting;
}

export interface MatchmakingRequestStandby {
	status: MatchmakingStatus.Standby;
	instance: string;
	instanceStatus: GameInstanceStatus.Ready;
}

export interface MatchmakingRequestError {
	status: MatchmakingStatus.Error;
	message: string;
}
