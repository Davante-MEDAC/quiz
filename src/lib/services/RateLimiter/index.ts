import type { Client } from '@libsql/client';

export interface RateLimiterConfig {
	maxRequests: number;
	windowSeconds: number;
}

export class RateLimiter {
	constructor(
		private readonly client: Client,
		private readonly config: RateLimiterConfig
	) {}

	private currentWindowStart(): number {
		return Math.floor(Date.now() / 1000 / this.config.windowSeconds) * this.config.windowSeconds;
	}

	async check(key: string): Promise<boolean> {
		const windowStart = this.currentWindowStart();

		const result = await this.client.execute({
			sql: `INSERT INTO rate_limits (key, window_start, count)
            VALUES (?, ?, 1)
            ON CONFLICT (key, window_start) DO UPDATE SET count = count + 1
            RETURNING count`,
			args: [key, windowStart]
		});

		const count = result.rows[0]['count'] as number;

		if (Math.random() < 0.05) {
			this.client
				.execute({
					sql: `DELETE FROM rate_limits WHERE key = ? AND window_start < ?`,
					args: [key, windowStart]
				})
				.catch(() => {});
		}

		return count <= this.config.maxRequests;
	}
}
