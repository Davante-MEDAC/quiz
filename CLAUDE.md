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
bash ./bin/migrate-local   # apply pending migrations to database.local.sqlite
```

## Environment variables

Copy `.env.example` to `.env` and fill in values.

| Variable                  | Required | Description                                          |
| ------------------------- | -------- | ---------------------------------------------------- |
| `AUTH_SECRET`             | Yes      | Auth.js signing secret                               |
| `AUTHJS_TOKEN`            | Yes      | Bearer token for `/api/v0/auth/magic-link`           |
| `DOMAIN`                  | Yes      | Base URL used to build magic link URLs               |
| `DATABASE_URL`            | No       | libSQL URL; defaults to `file:database.local.sqlite` |
| `TURSO_API_TOKEN`         | No       | Turso auth token; omit for local file DB             |
| `MAILTRAP_API_TOKEN`      | No       | If unset, emails are skipped (link logged in dev)    |
| `TURNSTILE_SECRET_KEY`    | No       | If unset, Turnstile verification is bypassed         |
| `PUBLIC_TURNSTILE_SITE_KEY` | No     | If unset, Turnstile widget is hidden on login page   |

## Architecture

SvelteKit app targeting **Cloudflare Pages**. Uses Svelte 5 runes mode project-wide (enforced in `svelte.config.js`).

### Auth flow

Auth.js (`@auth/sveltekit`) is configured in `src/auth.ts` and mounted via `hooks.server.ts`. The only provider is a custom `MagicLink` email provider. Auth.js is wired to the database through `AuthAdapter` (`src/lib/services/AuthAdapter.ts`), which implements the Auth.js `Adapter` interface against `IDatabase`.

```
Auth.js → AuthAdapter → IDatabase → Database (@libsql/client)
```

`sendVerificationRequest` in `src/auth.ts` verifies the Cloudflare Turnstile token (skipped when `TURNSTILE_SECRET_KEY` is unset), then calls `POST /api/v0/auth/magic-link` via `ApiClient`. That endpoint validates the `Authorization: Bearer ${AUTHJS_TOKEN}` header, checks the email domain against an allowlist (`alu.medac.es`), enforces IP-based rate limiting via `RateLimiter`, then sends via `MailtrapTransport` (or logs the link locally when `MAILTRAP_API_TOKEN` is unset).

### Route groups

- `(auth)/` — unauthenticated pages (login, magiclink). Layout redirects to `/app` when session exists.
- `(app)/` — protected pages. Layout redirects to `/login` when no session.

### Services (`src/lib/services/`)

| Service | Purpose |
| ------- | ------- |
| `Database/` | `IDatabase` interface + `@libsql/client` implementation |
| `AuthAdapter.ts` | Maps Auth.js adapter interface to `IDatabase` |
| `ApiClient/` | `HttpClient` base + `AuthClient` for internal API calls |
| `Email/` | `EmailService` (uses `IEmailTransport`), `EmailTemplateService`, `MagicLinkEmailTemplate`, `MailtrapTransport` |
| `RateLimiter/` | Fixed-window rate limiter backed by the `rate_limits` DB table |

### Database layer

`src/lib/services/Database/IDatabase.ts` defines the `IDatabase` interface. Types (`DbUser`, `DbAccount`, `DbSession`, `DbVerificationToken`) use `snake_case` matching the SQL schema.

SQL schema lives in `migrations/`. `bin/migrate-local` applies unapplied migrations to `database.local.sqlite`, tracking state in a `_migrations` table. A pre-seeded dev database is at `dev/database.sqlite`.

### Email

`EmailService` instantiates `EmailTemplateService` internally. Templates live in `Email/templates/` and expose a `subject` getter and `render()` method returning HTML. New transports implement `IEmailTransport` (single `send(options)` method).

### API routes

`src/routes/api/v0/auth/` contains only the magic-link delivery endpoint. All other Auth.js operations go directly through `Database` via `AuthAdapter` — no HTTP hop. Shared response helpers (`unauthorized`, `tooManyRequests`, etc.) live in `_helpers.ts`.
