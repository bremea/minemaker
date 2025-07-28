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
