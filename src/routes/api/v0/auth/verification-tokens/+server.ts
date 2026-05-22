import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Database } from '$lib/services/Database/index.js';
import { unauthorized, verifyBearer, toApiVerificationToken } from '../_helpers.js';
import type { RequestHandler } from './$types.js';

const db = new Database(env.DATABASE_URL || undefined);

export const POST: RequestHandler = async ({ request }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	const body: App.Api.CreateVerificationTokenInput = await request.json();

	const token = await db.createVerificationToken({
		identifier: body.identifier,
		token: body.token,
		expires: new Date(body.expires)
	});

	return json(toApiVerificationToken(token), { status: 201 });
};
