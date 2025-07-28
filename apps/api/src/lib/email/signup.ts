import { EmailOptions, sendEmail } from '.';

export async function sendEmailConfirmation(dest: string, url: string, subscribed: boolean = true) {
	const opts: EmailOptions = {
		to: dest,
		subject: 'Confirm your email - Minemaker',
		body: url,
		subscribed
	};

	return await sendEmail(opts);
}
