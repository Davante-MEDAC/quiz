import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Database } from '$lib/services/Database/index.js';
import { unauthorized, verifyBearer, toApiVerificationToken } from '../../_helpers.js';
import type { RequestHandler } from './$types.js';

const db = new Database(env.DATABASE_URL || undefined);

export const POST: RequestHandler = async ({ request }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	const body: App.Api.UseVerificationTokenInput = await request.json();

	const token = await db.useVerificationToken(body.identifier, body.token);
	return json(token ? toApiVerificationToken(token) : null);
};
