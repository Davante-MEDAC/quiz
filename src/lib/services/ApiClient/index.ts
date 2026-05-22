import { AuthClient } from './AuthClient';

import type { HttpClientConfig } from './HttpClient';

export class ApiClient {
	readonly auth: AuthClient;

	constructor(config: HttpClientConfig) {
		this.auth = new AuthClient(config);
	}
}
