export function calcInstanceScore(online: number, max: number): number {
	return online / max;
}

export function calcServerScore(instances: number, max: number): number {
	return instances / max;
}

export function getServerSubnet(base: string, region: number, id: number): string {
	const segment = ((region << 8) | id).toString(16);
	return `${base}:${segment}::/64`;
}

export function getServerGateway(base: string, region: number, id: number): string {
	const segment = ((region << 8) | id).toString(16);
	return `${base}:${segment}:1::`;
}

export function getContainerIPv6(base: string, region: number, server: number, id: number): string {
	const segment = ((region << 8) | server).toString(16);
	return `${base}:${segment}:${id}::`;
}

export function generateServerId(region: number, id: number): string {
	return ((region << 16) | id).toString(36);
}

export function generateInstanceId(server: string, id: number): string {
	return `${server}-${id.toString(36)}`;
}
