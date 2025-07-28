import { t, TSchema } from 'elysia';

export class InternalApiError extends Error {
	public status: number;

	constructor(
		status: number,
		public override message: string
	) {
		super(message);
		this.status = status;
	}
}

export function generateBitfieldValues(max: number) {
	return t.Union(Array.from({ length: max + 1 }, (_, i) => t.Literal(i)) as TSchema[]);
}
