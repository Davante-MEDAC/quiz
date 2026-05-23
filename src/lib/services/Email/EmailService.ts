import { EmailTemplateService } from './EmailTemplateService';

export interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
}

export interface IEmailTransport {
	send(options: SendEmailOptions): Promise<void>;
}

export const EMAIL_SENDER_ADDRESS = 'no-reply@dmdda.com';

export class EmailTransportError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'EmailTransportError';
	}
}

export class EmailService {
	private readonly transport: IEmailTransport;
	private readonly templates: EmailTemplateService;

	constructor(transport: IEmailTransport) {
		this.transport = transport;
		this.templates = new EmailTemplateService();
	}

	async sendMagicLink(to: string, link: string): Promise<void> {
		const { subject, html } = this.templates.magicLink(link);
		await this.transport.send({ to, subject, html });
	}
}
