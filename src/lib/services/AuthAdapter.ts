import { ApiClient } from './ApiClient';

import type { Adapter, AdapterSession, AdapterUser, VerificationToken } from '@auth/core/adapters';

function toAdapterUser(user: App.Api.Auth.ApiUser): AdapterUser {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
		image: user.image ?? null
	};
}

function toAdapterSession(session: App.Api.Auth.ApiSession): AdapterSession {
	return {
		sessionToken: session.sessionToken,
		userId: session.userId,
		expires: new Date(session.expires)
	};
}

function toVerificationToken(token: App.Api.Auth.ApiVerificationToken): VerificationToken {
	return {
		identifier: token.identifier,
		token: token.token,
		expires: new Date(token.expires)
	};
}

export function AuthAdapter(client: ApiClient): Adapter {
	return {
		async createUser(data) {
			const user = await client.auth.createUser({
				email: data.email,
				name: data.name as string
			});

			if (user) return toAdapterUser(user);
			throw new Error('Failed to create user');
		},

		async getUser(id) {
			const { user } = await client.auth.getUserById(id);
			return user ? toAdapterUser(user) : null;
		},

		async getUserByEmail(email) {
			try {
				const { user } = await client.auth.getUserByEmail(email);
				return user ? toAdapterUser(user) : null;
			} catch (error) {
				console.error('Error fetching user by email:', error);
				return null;
			}
		},

		async getUserByAccount() {
			throw new Error('getUserByAccount is not implemented in AuthAdapter');
		},

		async updateUser(data) {
			const user = await client.auth.updateUser({
				id: data.id,
				email: data.email,
				name: data.name as string
			});

			if (user) return toAdapterUser(user);
			throw new Error('Failed to update user');
		},

		async deleteUser() {
			throw new Error('deleteUser is not implemented in AuthAdapter');
		},

		async linkAccount() {
			throw new Error('linkAccount is not implemented in AuthAdapter');
		},

		async unlinkAccount() {
			throw new Error('unlinkAccount is not implemented in AuthAdapter');
		},

		async createSession(data) {
			const session = await client.auth.createSession({
				userId: data.userId,
				expires: data.expires.toISOString(),
				sessionToken: data.sessionToken
			});

			if (!session) throw new Error('Failed to create session');
			return toAdapterSession(session);
		},

		async getSessionAndUser(sessionToken) {
			const { session, user } = await client.auth.getSessionAndUser(sessionToken);
			if (!session || !user) return null;

			return {
				session: toAdapterSession(session),
				user: toAdapterUser(user)
			};
		},

		async updateSession(data) {
			const session = await client.auth.updateSession({
				sessionToken: data.sessionToken,
				userId: data.userId,
				expires: data.expires?.toISOString()
			});

			if (!session) throw new Error('Failed to update session');
			return toAdapterSession(session);
		},

		async deleteSession(sessionToken) {
			await client.auth.deleteSession(sessionToken);
		},

		async createVerificationToken(data) {
			const token = await client.auth.createVerificationToken({
				identifier: data.identifier,
				token: data.token,
				expires: data.expires.toISOString()
			});

			return toVerificationToken(token);
		},

		async useVerificationToken(params) {
			const token = await client.auth.verifyVerificationToken({
				identifier: params.identifier,
				token: params.token
			});

			return token ? toVerificationToken(token) : null;
		}
	};
}
