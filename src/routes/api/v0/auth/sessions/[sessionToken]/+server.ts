import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Database } from '$lib/services/Database/index.js';
import { unauthorized, verifyBearer, toApiSession, toApiUser } from '../../_helpers.js';
import type { RequestHandler } from './$types.js';

const db = new Database(env.DATABASE_URL || undefined);

export const GET: RequestHandler = async ({ request, params }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	const result = await db.getSessionAndUser(params.sessionToken);

	return json({
		session: result ? toApiSession(result.session) : null,
		user: result ? toApiUser(result.user) : null
	});
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	const body: App.Api.UpdateSessionInput = await request.json();

	const session = await db.updateSession({
		session_token: params.sessionToken,
		user_id: body.userId,
		expires: body.expires ? new Date(body.expires) : undefined
	});

	return json(session ? toApiSession(session) : null);
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	if (!verifyBearer(request, env.AUTH_SECRET)) return unauthorized();

	await db.deleteSession(params.sessionToken);
	return new Response(null, { status: 204 });
};
