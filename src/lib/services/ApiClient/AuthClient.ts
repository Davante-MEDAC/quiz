import { HttpClient } from './HttpClient';

import type { HttpClientConfig } from './HttpClient';

export class AuthClient extends HttpClient {
	constructor(config: HttpClientConfig) {
		super(config);
	}

	sendMagicLink(data: App.Api.SendMagicLinkInput) {
		return this.post<void>('/api/v0/auth/magic-link', data);
	}
}
