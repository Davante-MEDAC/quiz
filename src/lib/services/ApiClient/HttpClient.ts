export interface HttpClientConfig {
	baseUrl: URL;
	authjsToken: string;
}

export class HttpClient {
	private readonly baseUrl: URL;
	private readonly headers: Record<string, string>;

	constructor({ baseUrl, authjsToken }: HttpClientConfig) {
		this.baseUrl = baseUrl;
		this.headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${authjsToken}`
		};
	}

	private url(path: string) {
		return `${this.baseUrl}${path}`;
	}

	private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
		const response = await fetch(this.url(path), {
			...init,
			headers: { ...this.headers, ...(init.headers ?? {}) }
		});

		if (!response.ok) {
			const body = await response.text().catch(() => '');
			throw new Error(`HTTP ${response.status} ${response.statusText}: ${body}`);
		}

		// 204 No Content
		if (response.status === 204) return undefined as T;

		return response.json() as Promise<T>;
	}

	protected get<T>(path: string) {
		return this.request<T>(path, { method: 'GET' });
	}

	protected post<T>(path: string, body: unknown) {
		return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
	}

	protected patch<T>(path: string, body: unknown) {
		return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
	}

	protected delete<T>(path: string) {
		return this.request<T>(path, { method: 'DELETE' });
	}
}
