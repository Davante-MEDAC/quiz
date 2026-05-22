// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		namespace Api {
			namespace Auth {
				interface ApiUser {
					id: string;
					email: string;
					name: string;
					emailVerified: string | null;
					image?: string | null;
				}

				interface ApiSession {
					sessionToken: string;
					userId: string;
					expires: string;
				}

				interface ApiVerificationToken {
					identifier: string;
					token: string;
					expires: string;
				}
			}

			interface CreateUserInput {
				email: string;
				name: string;
			}

			interface UpdateUserInput {
				id: string;
				email?: string;
				name?: string;
			}

			interface CreateSessionInput {
				userId: string;
				expires: string;
				sessionToken: string;
			}

			interface UpdateSessionInput {
				sessionToken: string;
				userId?: string;
				expires?: string;
			}

			interface CreateVerificationTokenInput {
				identifier: string;
				token: string;
				expires: string;
			}

			interface UseVerificationTokenInput {
				identifier: string;
				token: string;
			}

			interface SendMagicLinkInput {
				email: string;
				link: string;
			}
		}
	}
}

export {};
