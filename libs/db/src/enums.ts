export enum PlayerFlags {
	None = 0,
	Staff = 1 << 2, // 100
	Partner = 1 << 1, // 010
	Contributor = 1 << 0, // 001
	All = ~(~0 << 3) // 111
}

export enum PlayerPermissions {
	None = 0,
	Warn = 1 << 0, // 000001
	Mute = 1 << 1, // 000010
	Kick = 1 << 2, // 000100
	Ban = 1 << 3, // 001000
	IpBan = 1 << 4, // 010000
	StudioBan = 1 << 5, // 100000
	All = ~(~0 << 6) // 111111
}

export enum GameFlags {
	None = 0,
	Staff = 1 << 0, // 001
	Partner = 1 << 1, // 010
	Reserved = 1 << 2, // 100
	All = ~(~0 << 3) // 111
}
