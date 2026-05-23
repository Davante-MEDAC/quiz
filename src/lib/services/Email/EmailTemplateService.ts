import { MagicLinkEmailTemplate } from './templates/MagicLinkEmailTemplate';

export interface RenderedEmail {
	subject: string;
	html: string;
}

export class EmailTemplateService {
	magicLink(link: string): RenderedEmail {
		const template = new MagicLinkEmailTemplate({ link });

		return {
			subject: template.subject,
			html: template.render()
		};
	}
}
