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

export const UnauthorizedApiError = new InternalApiError(403, 'Unauthorized');

export const Nullable = <T extends TSchema>(schema: T) =>
	t.Union([t.Undefined(), t.Null(), schema]);
