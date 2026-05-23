import { json } from '@sveltejs/kit';
import type { DbUser, DbSession, DbVerificationToken } from '$lib/services/Database/IDatabase.js';

export function unauthorized() {
	return json({ error: 'Unauthorized' }, { status: 401 });
}

export function notFound() {
	return json({ error: 'Not Found' }, { status: 404 });
}

export function tooManyRequests() {
	return json({ error: 'Too Many Requests' }, { status: 429 });
}

export function getClientIp(request: Request): string {
	return (
		request.headers.get('CF-Connecting-IP') ??
		request.headers.get('X-Forwarded-For')?.split(',')[0].trim() ??
		'unknown'
	);
}

export function isEmailAllowed(email: string): boolean {
	const allowedDomains = ['alu.medac.es'];
	const domain = email.toLowerCase().split('@');

	if (domain.length !== 2) {
		return false;
	}

	const emailDomain = domain[1];

	return allowedDomains.includes(emailDomain);
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
