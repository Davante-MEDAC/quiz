import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Database } from '$lib/services/Database/index.js';
import { unauthorized, verifyBearer, toApiUser } from '../../../_helpers.js';
import type { RequestHandler } from './$types.js';

const db = new Database(env.DATABASE_URL || undefined);

export const GET: RequestHandler = async ({ request, params }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	const user = await db.getUserByEmail(decodeURIComponent(params.email));
	return json({ user: user ? toApiUser(user) : null });
};
