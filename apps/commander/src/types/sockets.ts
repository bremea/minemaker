export enum SocketMessageType {
	Request = 'REQUEST',
	PlayerJoin = 'PLAYER_JOIN',
	PlayerLeave = 'PLAYER_LEAVE',
	TransferPlayer = 'TRANSFER_PLAYER',
	KickPlayer = 'KICK_PLAYER'
}

export interface SocketMessage {
	t: SocketMessageType;
	d: any;
}

export interface PlayerJoinMessage extends SocketMessage {
	t: SocketMessageType.PlayerJoin;
	d: {
		uuid: string;
		username: string;
	};
}

export interface PlayerLeaveMessage extends SocketMessage {
	t: SocketMessageType.PlayerLeave;
	d: {
		uuid: string;
		username: string;
	};
}
