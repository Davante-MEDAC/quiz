import { env } from '$env/dynamic/private';
import { MailtrapTransport } from '$lib/services/Email/transport/MailtrapTransport.js';
import { MAILTRAP_API_TOKEN } from '$env/static/private';

import { unauthorized, verifyBearer } from '../_helpers.js';

import type { RequestHandler } from './$types.js';
import { EmailService } from '$lib/services/Email/EmailService.js';

export const POST: RequestHandler = async ({ request }) => {
	if (!verifyBearer(request, env.AUTHJS_TOKEN)) return unauthorized();

	const body: App.Api.SendMagicLinkInput = await request.json();
	const mailtrapTransport = new MailtrapTransport(MAILTRAP_API_TOKEN);
	const emailService = new EmailService(mailtrapTransport);

	emailService.sendMagicLink(body.email, body.link);

	return new Response(null, { status: 204 });
};
