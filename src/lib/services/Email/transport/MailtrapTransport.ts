import { EMAIL_SENDER_ADDRESS, EmailTransportError } from '../EmailService';

import type { IEmailTransport, SendEmailOptions } from '../EmailService';

export class MailtrapTransport implements IEmailTransport {
	private readonly apiToken: string;

	constructor(apiToken: string) {
		this.apiToken = apiToken;
	}

	async send({ to, subject, html }: SendEmailOptions): Promise<void> {
		const url = 'https://send.api.mailtrap.io/api/send';
		const payload = {
			from: { email: EMAIL_SENDER_ADDRESS },
			to: [{ email: to }],
			subject,
			html
		};

		const res = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.apiToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			const text = await res.text().catch(() => '');
			console.error(
				`Failed to send email via Mailtrap API — status: ${res.status}, response: ${text}`
			);

			throw new EmailTransportError(`Unknown error: ${res.status} ${text}`);
		}
	}
}
