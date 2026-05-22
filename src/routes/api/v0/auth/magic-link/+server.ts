import { env } from '$env/dynamic/private';
import { unauthorized, verifyBearer } from '../_helpers.js';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	const body: App.Api.SendMagicLinkInput = await request.json();

	// TODO: integrate email provider
	console.log(`Magic link for ${body.email}: ${body.link}`);

	return new Response(null, { status: 204 });
};
