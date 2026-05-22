import { SvelteKitAuth } from '@auth/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';

import {
	AUTHJS_TOKEN,
	AUTH_SECRET,
	DATABASE_URL,
	DOMAIN,
	TURSO_API_TOKEN
} from '$env/static/private';

import type {
	EmailProviderSendVerificationRequestParams,
	EmailUserConfig,
	Provider
} from '@auth/sveltekit/providers';

import { AuthAdapter } from '$lib/services/AuthAdapter';
import { ApiClient } from '$lib/services/ApiClient';
import { Database } from '$lib/services/Database';

function MagicLink(options: EmailUserConfig = {}): Provider {
	return {
		id: 'magiclink',
		name: 'Magic Link',
		type: 'email',
		maxAge: 1000,
		options,
		async sendVerificationRequest(
			params: EmailProviderSendVerificationRequestParams
		): Promise<void> {
			try {
				const client = new ApiClient({ authjsToken: AUTHJS_TOKEN, baseUrl: new URL(DOMAIN) });
				const magicLink = new URL(params.url);
				const welcomeLink = new URL(magicLink.origin);

				welcomeLink.pathname = 'magiclink/welcome';
				welcomeLink.searchParams.set('loginUrl', magicLink.toString());

				await client.auth.sendMagicLink({
					email: params.identifier,
					link: welcomeLink.toString()
				});
				return;
			} catch (error) {
				console.error('Error sending magic link request', error);
			}
		}
	};
}

// https://github.com/nextauthjs/next-auth/issues/9886
const { handle: authjsHandle } = SvelteKitAuth({
	adapter: AuthAdapter(new Database(DATABASE_URL, TURSO_API_TOKEN)),
	pages: {
		signIn: '/login',
		signOut: '/logout',
		verifyRequest: '/magiclink',
		error: '/error'
	},
	callbacks: {
		async session({ session }) {
			return { ...session };
		}
	},
	providers: [MagicLink()],
	secret: AUTH_SECRET,
	trustHost: true,
	useSecureCookies: false
});

export const handle = sequence(authjsHandle);
