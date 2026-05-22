import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '$lib/services/Database/index.js';
import { unauthorized, verifyBearer, toApiSession } from '../_helpers.js';
import type { RequestHandler } from './$types.js';

const db = new Database(env.DATABASE_URL || undefined);

export const POST: RequestHandler = async ({ request }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	const body: App.Api.CreateSessionInput = await request.json();

	const session = await db.createSession({
		id: uuidv4(),
		user_id: body.userId,
		session_token: body.sessionToken,
		expires: new Date(body.expires)
	});

	return json(toApiSession(session), { status: 201 });
};
