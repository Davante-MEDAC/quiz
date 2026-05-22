# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # start dev server
bun run build        # production build
bun run check        # TypeScript + Svelte type-check
bun run lint         # Prettier + ESLint
bun run format       # auto-format
```

Local database setup:

```bash
cp ./dev/database.sqlite ./database.local.sqlite
```

## Environment variables

| Variable       | Required | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `AUTH_SECRET`  | Yes      | Auth.js signing secret                               |
| `AUTHJS_TOKEN` | Yes      | Bearer token for `/api/v0/auth/magic-link`           |
| `DOMAIN`       | Yes      | Base URL used to build magic link URLs               |
| `DATABASE_URL` | No       | libSQL URL; defaults to `file:database.local.sqlite` |

## Architecture

SvelteKit app targeting **Cloudflare Pages**. Uses Svelte 5 runes mode project-wide (enforced in `svelte.config.js`).

### Auth flow

Auth.js (`@auth/sveltekit`) is configured in `src/auth.ts` and mounted via `hooks.server.ts`. The only provider is a custom `MagicLink` email provider. Auth.js is wired to the database through `AuthAdapter` (`src/lib/services/AuthAdapter.ts`), which implements the Auth.js `Adapter` interface against `IDatabase`.

```
Auth.js → AuthAdapter → IDatabase → Database (@libsql/client)
```

The `MagicLink` provider calls `POST /api/v0/auth/magic-link` (via `ApiClient`) to deliver the link. That route validates requests with `Authorization: Bearer ${AUTHJS_TOKEN}`.

### Route groups

- `(auth)/` — unauthenticated pages (login, magiclink). Layout redirects to `/app` when a session exists.
- `(app)/` — protected pages. Layout redirects to `/login` when no session.

### Database layer

`src/lib/services/Database/IDatabase.ts` defines the `IDatabase` interface (and `DbUser`, `DbAccount`, `DbSession`, `DbVerificationToken` types in `snake_case` matching the SQL schema).

`src/lib/services/Database/index.ts` exports `Database`, the `@libsql/client` implementation. Locally it connects to `file:database.local.sqlite`; in production it receives a Turso URL via `DATABASE_URL`.

SQL schema lives in `migrations/`. A pre-seeded dev database is at `dev/database.sqlite`.

### API routes

`src/routes/api/v0/auth/` contains only the magic-link delivery endpoint. All other Auth.js operations (users, sessions, verification tokens) go directly through `Database` via `AuthAdapter` — no HTTP hop.
