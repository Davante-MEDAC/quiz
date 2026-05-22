import { json } from '@sveltejs/kit';
import type { DbUser, DbSession, DbVerificationToken } from '$lib/services/Database/IDatabase.js';

export function unauthorized() {
	return json({ error: 'Unauthorized' }, { status: 401 });
}

export function notFound() {
	return json({ error: 'Not Found' }, { status: 404 });
}

export function verifyBearer(request: Request, secret: string): boolean {
	return request.headers.get('Authorization') === `Bearer ${secret}`;
}

export function toApiUser(user: DbUser): App.Api.Auth.ApiUser {
	return {
		id: user.id,
		email: user.email,
		name: user.name ?? '',
		emailVerified: user.email_verified?.toISOString() ?? null,
		image: user.image
	};
}

export function toApiSession(session: DbSession): App.Api.Auth.ApiSession {
	return {
		sessionToken: session.session_token,
		userId: session.user_id,
		expires: session.expires.toISOString()
	};
}

export function toApiVerificationToken(
	token: DbVerificationToken
): App.Api.Auth.ApiVerificationToken {
	return {
		identifier: token.identifier,
		token: token.token,
		expires: token.expires.toISOString()
	};
}
