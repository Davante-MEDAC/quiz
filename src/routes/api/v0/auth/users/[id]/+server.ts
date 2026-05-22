import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Database } from '$lib/services/Database/index.js';
import { unauthorized, verifyBearer, toApiUser } from '../../_helpers.js';
import type { RequestHandler } from './$types.js';

const db = new Database(env.DATABASE_URL || undefined);

export const GET: RequestHandler = async ({ request, params }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	const user = await db.getUser(params.id);
	return json({ user: user ? toApiUser(user) : null });
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	const body: App.Api.UpdateUserInput = await request.json();

	const user = await db.updateUser({
		id: params.id,
		email: body.email,
		name: body.name ?? undefined
	});

	return json(toApiUser(user));
};
