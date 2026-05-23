import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { MailtrapTransport } from '$lib/services/Email/transport/MailtrapTransport.js';
import { MAILTRAP_API_TOKEN, DATABASE_URL, TURSO_API_TOKEN } from '$env/static/private';

import {
	unauthorized,
	tooManyRequests,
	verifyBearer,
	getClientIp,
	isEmailAllowed
} from '../_helpers.js';

import { EmailService } from '$lib/services/Email/EmailService.js';
import { RateLimiter } from '$lib/services/RateLimiter/index.js';

import type { RequestHandler } from './$types.js';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;

export const POST: RequestHandler = async ({ request }) => {
	if (!verifyBearer(request, env.AUTHJS_TOKEN)) {
		return unauthorized();
	}

	const body: App.Api.SendMagicLinkInput = await request.json();

	if (!isEmailAllowed(body.email)) {
		return unauthorized();
	}

	const db = createClient({ url: DATABASE_URL, authToken: TURSO_API_TOKEN });
	const rateLimiter = new RateLimiter(db, {
		maxRequests: RATE_LIMIT_MAX,
		windowSeconds: RATE_LIMIT_WINDOW_SECONDS
	});

	const ip = getClientIp(request);
	const allowed = await rateLimiter.check(`magic-link:${ip}`);

	if (!allowed) {
		return tooManyRequests();
	}

	const mailtrapTransport = new MailtrapTransport(MAILTRAP_API_TOKEN);
	const emailService = new EmailService(mailtrapTransport);

	emailService.sendMagicLink(body.email, body.link);

	return new Response(null, { status: 204 });
};
