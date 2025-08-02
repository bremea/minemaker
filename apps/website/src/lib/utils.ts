export const MINEMAKER_EPOCH = 1588651200000n;

export function getRelativeTime(date: Date): string {
	const units = {
		year: 24 * 60 * 60 * 1000 * 365,
		month: (24 * 60 * 60 * 1000 * 365) / 12,
		day: 24 * 60 * 60 * 1000,
		hour: 60 * 60 * 1000,
		minute: 60 * 1000,
		second: 1000
	} as Record<Intl.RelativeTimeFormatUnit, number>;

	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	const elapsed = date.valueOf() - new Date(Date.now()).valueOf();

	for (const u of Object.keys(units) as Intl.RelativeTimeFormatUnit[]) {
		if (Math.abs(elapsed) > units[u] || u == 'second') {
			return rtf.format(Math.round(elapsed / units[u]), u);
		}
	}

	return '';
}

export function getTimeFromSnowflake(snowflake: string): Date {
	return new Date(Number((BigInt(snowflake) >> 22n) + MINEMAKER_EPOCH));
}
