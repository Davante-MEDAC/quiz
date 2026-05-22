export interface DbUser {
	id: string;
	email: string;
	email_verified: Date | null;
	name: string | null;
	image: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface DbAccount {
	id: string;
	user_id: string;
	type: string;
	provider: string;
	provider_account_id: string;
	refresh_token: string | null;
	access_token: string | null;
	expires_at: number | null;
	token_type: string | null;
	scope: string | null;
	id_token: string | null;
	session_state: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface DbSession {
	id: string;
	user_id: string;
	session_token: string;
	expires: Date;
	created_at: Date;
	updated_at: Date;
}

export interface DbVerificationToken {
	identifier: string;
	token: string;
	expires: Date;
}

export interface IDatabase {
	createUser(user: Omit<DbUser, 'created_at' | 'updated_at'>): Promise<DbUser>;
	getUser(id: string): Promise<DbUser | null>;
	getUserByEmail(email: string): Promise<DbUser | null>;
	getUserByAccount(provider: string, providerAccountId: string): Promise<DbUser | null>;
	updateUser(user: Partial<DbUser> & Pick<DbUser, 'id'>): Promise<DbUser>;
	deleteUser(userId: string): Promise<void>;

	linkAccount(account: Omit<DbAccount, 'created_at' | 'updated_at'>): Promise<DbAccount>;
	unlinkAccount(provider: string, providerAccountId: string): Promise<void>;
	getAccount(providerAccountId: string, provider: string): Promise<DbAccount | null>;

	createSession(session: Omit<DbSession, 'created_at' | 'updated_at'>): Promise<DbSession>;
	getSessionAndUser(sessionToken: string): Promise<{ session: DbSession; user: DbUser } | null>;
	updateSession(
		session: Partial<DbSession> & Pick<DbSession, 'session_token'>
	): Promise<DbSession | null>;
	deleteSession(sessionToken: string): Promise<void>;

	createVerificationToken(token: DbVerificationToken): Promise<DbVerificationToken>;
	useVerificationToken(identifier: string, token: string): Promise<DbVerificationToken | null>;
}
