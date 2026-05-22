import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '$lib/services/Database/index.js';
import { unauthorized, verifyBearer, toApiUser } from '../_helpers.js';
import type { RequestHandler } from './$types.js';

const db = new Database(env.DATABASE_URL || undefined);

export const POST: RequestHandler = async ({ request }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	const body: App.Api.CreateUserInput = await request.json();

	const user = await db.createUser({
		id: uuidv4(),
		email: body.email,
		name: body.name ?? null,
		email_verified: null,
		image: null
	});

	return json(toApiUser(user), { status: 201 });
};
