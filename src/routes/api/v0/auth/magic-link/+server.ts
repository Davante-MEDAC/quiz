import { createClient } from '@libsql/client';

import { env } from '$env/dynamic/private';
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
import { dev } from '$app/environment';
import { log } from '$lib/utils/log.js';

import type { RequestHandler } from './$types.js';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!verifyBearer(request, env.AUTHJS_TOKEN)) {
			console.warn('Request not authorized');
			return unauthorized();
		}

		const body: App.Api.SendMagicLinkInput = await request.json();

		if (!isEmailAllowed(body.email)) {
			console.warn('Email is not allowed');
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
			console.warn('Rate limit exceeded for IP');
			return tooManyRequests();
		}

		// We only want to send the magic link on production or when this
		// API Token is set, otherwise we can just skip sending the email.
		if (MAILTRAP_API_TOKEN) {
			const mailtrapTransport = new MailtrapTransport(MAILTRAP_API_TOKEN);
			const emailService = new EmailService(mailtrapTransport);
			await emailService.sendMagicLink(body.email, body.link);
		}

		// Print the magic link to the console in development for testing purposes.
		if (dev) {
			log.info(`Magic link for ${body.email}: ${body.link}`);
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Error in magic link handler', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
