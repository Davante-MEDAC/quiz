import { HttpClient } from './HttpClient';

import type { HttpClientConfig } from './HttpClient';

export class AuthClient extends HttpClient {
	constructor(config: HttpClientConfig) {
		super(config);
	}

	createUser(data: App.Api.CreateUserInput) {
		return this.post<App.Api.Auth.ApiUser>('/users', data);
	}

	getUserById(id: string) {
		return this.get<{ user: App.Api.Auth.ApiUser | null }>(`/users/${encodeURIComponent(id)}`);
	}

	getUserByEmail(email: string) {
		return this.get<{ user: App.Api.Auth.ApiUser | null }>(
			`/users/by-email/${encodeURIComponent(email)}`
		);
	}

	updateUser(data: App.Api.UpdateUserInput) {
		return this.patch<App.Api.Auth.ApiUser>(`/users/${encodeURIComponent(data.id)}`, data);
	}

	createSession(data: App.Api.CreateSessionInput) {
		return this.post<App.Api.Auth.ApiSession>('/sessions', data);
	}

	getSessionAndUser(sessionToken: string) {
		return this.get<{ session: App.Api.Auth.ApiSession | null; user: App.Api.Auth.ApiUser | null }>(
			`/sessions/${encodeURIComponent(sessionToken)}`
		);
	}

	updateSession(data: App.Api.UpdateSessionInput) {
		return this.patch<App.Api.Auth.ApiSession>(
			`/sessions/${encodeURIComponent(data.sessionToken)}`,
			data
		);
	}

	deleteSession(sessionToken: string) {
		return this.delete<void>(`/sessions/${encodeURIComponent(sessionToken)}`);
	}

	createVerificationToken(data: App.Api.CreateVerificationTokenInput) {
		return this.post<App.Api.Auth.ApiVerificationToken>('/verification-tokens', data);
	}

	verifyVerificationToken(data: App.Api.UseVerificationTokenInput) {
		return this.post<App.Api.Auth.ApiVerificationToken | null>('/verification-tokens/use', data);
	}

	sendMagicLink(data: App.Api.SendMagicLinkInput) {
		return this.post<void>('/magic-link', data);
	}
}
