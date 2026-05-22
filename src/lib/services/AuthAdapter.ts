import { v4 as uuidv4 } from 'uuid';

import type { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from '@auth/core/adapters';
import type { IDatabase, DbUser, DbSession, DbVerificationToken } from './Database/IDatabase.js';

function toAdapterUser(user: DbUser): AdapterUser {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		emailVerified: user.email_verified,
		image: user.image
	};
}

function toAdapterSession(session: DbSession): AdapterSession {
	return {
		sessionToken: session.session_token,
		userId: session.user_id,
		expires: session.expires
	};
}

function toVerificationToken(token: DbVerificationToken): VerificationToken {
	return {
		identifier: token.identifier,
		token: token.token,
		expires: token.expires
	};
}

export function AuthAdapter(db: IDatabase): Adapter {
	return {
		async createUser(data) {
			const user = await db.createUser({
				id: uuidv4(),
				email: data.email,
				name: data.name ?? null,
				email_verified: data.emailVerified,
				image: data.image ?? null
			});
			return toAdapterUser(user);
		},

		async getUser(id) {
			const user = await db.getUser(id);
			return user ? toAdapterUser(user) : null;
		},

		async getUserByEmail(email) {
			const user = await db.getUserByEmail(email);
			return user ? toAdapterUser(user) : null;
		},

		async getUserByAccount({ provider, providerAccountId }) {
			const user = await db.getUserByAccount(provider, providerAccountId);
			return user ? toAdapterUser(user) : null;
		},

		async updateUser(data) {
			const user = await db.updateUser({
				id: data.id,
				email: data.email,
				name: data.name ?? undefined,
				email_verified: data.emailVerified ?? undefined,
				image: data.image ?? undefined
			});
			return toAdapterUser(user);
		},

		async deleteUser(userId) {
			await db.deleteUser(userId);
		},

		async linkAccount(account: AdapterAccount) {
			await db.linkAccount({
				id: uuidv4(),
				user_id: account.userId,
				type: account.type,
				provider: account.provider,
				provider_account_id: account.providerAccountId,
				refresh_token: account.refresh_token ?? null,
				access_token: account.access_token ?? null,
				expires_at: account.expires_at ?? null,
				token_type: account.token_type ?? null,
				scope: account.scope ?? null,
				id_token: account.id_token ?? null,
				session_state: (account.session_state as string | null) ?? null
			});
		},

		async unlinkAccount({ provider, providerAccountId }) {
			await db.unlinkAccount(provider, providerAccountId);
		},

		async createSession(data) {
			const session = await db.createSession({
				id: uuidv4(),
				user_id: data.userId,
				session_token: data.sessionToken,
				expires: data.expires
			});
			return toAdapterSession(session);
		},

		async getSessionAndUser(sessionToken) {
			const result = await db.getSessionAndUser(sessionToken);
			if (!result) return null;
			return {
				session: toAdapterSession(result.session),
				user: toAdapterUser(result.user)
			};
		},

		async updateSession(data) {
			const session = await db.updateSession({
				session_token: data.sessionToken,
				user_id: data.userId,
				expires: data.expires
			});
			return session ? toAdapterSession(session) : null;
		},

		async deleteSession(sessionToken) {
			await db.deleteSession(sessionToken);
		},

		async createVerificationToken(data) {
			const token = await db.createVerificationToken({
				identifier: data.identifier,
				token: data.token,
				expires: data.expires
			});
			return toVerificationToken(token);
		},

		async useVerificationToken({ identifier, token }) {
			const result = await db.useVerificationToken(identifier, token);
			return result ? toVerificationToken(result) : null;
		}
	};
}
