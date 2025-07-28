export interface EmailOptions {
	to: string;
	subject: string;
	body: string;
	subscribed?: boolean;
	name?: string;
	from?: string;
	reply?: string;
	headers?: any;
	attachments?: any;
}

export async function sendEmail(email: EmailOptions): Promise<{ success: boolean }> {
	const url = 'https://api.useplunk.com/v1/send';
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.PLUNK_TOKEN}`
		},
		body: JSON.stringify(email)
	};

	const response = await fetch(url, options);
	return await response.json();
}
