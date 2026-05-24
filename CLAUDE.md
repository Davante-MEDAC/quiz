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

| Variable                    | Required | Description                                          |
| --------------------------- | -------- | ---------------------------------------------------- |
| `AUTH_SECRET`               | Yes      | Auth.js signing secret                               |
| `AUTHJS_TOKEN`              | Yes      | Bearer token for `/api/v0/auth/magic-link`           |
| `DOMAIN`                    | Yes      | Base URL used to build magic link URLs               |
| `DATABASE_URL`              | No       | libSQL URL; defaults to `file:database.local.sqlite` |
| `TURSO_API_TOKEN`           | No       | Turso auth token; omit for local file DB             |
| `MAILTRAP_API_TOKEN`        | No       | If unset, emails are skipped (link logged in dev)    |
| `TURNSTILE_SECRET_KEY`      | No       | If unset, Turnstile verification is bypassed         |
| `PUBLIC_TURNSTILE_SITE_KEY` | No       | If unset, Turnstile widget is hidden on login page   |

## Architecture

SvelteKit app targeting **Cloudflare Pages**. Uses Svelte 5 runes mode project-wide (enforced in `svelte.config.js`). Tailwind v4 (CSS-first config, no `tailwind.config.*` file).

### Route groups

- `(auth)/` — unauthenticated pages (login, magiclink). Layout redirects to `/app` when session exists.
- `(app)/` — protected pages. Layout redirects to `/login` when no session. Session injected via layout server load.

### Quiz content

Course data lives in `static/db.json` and is typed as `QuizFileV1` (declared globally in `src/app.d.ts`). Shape: `{ V1: Record<courseId, Subject> }`. Each `Subject` has `items: Item[]` where each item is either a `lesson` or a `quiz`, both containing `questions: Question[]`.

Page loads fetch `/db.json` via SvelteKit's `fetch` (works on server and client). The quiz routes are:

```
/app                        → course grid (all subjects)
/app/[course]               → item list for a subject (item index = URL segment)
/app/[course]/[lesson]      → interactive quiz (lesson index into course.items[])
```

### Quiz UI — Atomic Design (`src/lib/components/`)

```
atoms/       CloseButton, ProgressBar, CountdownTimer, AnswerOption, PrimaryButton
molecules/   QuizProgress, QuestionCard, AnswerFeedback, ExplanationCard
organisms/   QuizQuestion  ← manages all quiz state (current Q, selection, navigation)
templates/   LessonTemplate
```

`QuizQuestion` is the stateful core: tracks `currentIndex` and `selected`, derives `answered`/`isLast`, reveals correct/incorrect states on selection, shows `AnswerFeedback` (fixed bottom sheet with explanation + next button) after each answer. `{#key currentIndex}` on `QuestionCard` resets the countdown timer per question. On the last question "Finalizar" calls `goto(backHref)`.

`AnswerOption` states: `idle` → `correct` (blue, checkmark) / `incorrect` (red, ✕). Unselected non-correct options stay `idle` after reveal.

### Auth flow

Auth.js (`@auth/sveltekit`) configured in `src/auth.ts`, mounted via `hooks.server.ts`. Only provider: custom `MagicLink`. Wired to DB through `AuthAdapter` (`src/lib/services/AuthAdapter.ts`).

```
Auth.js → AuthAdapter → IDatabase → Database (@libsql/client)
```

`sendVerificationRequest` verifies Cloudflare Turnstile (skipped when key unset), then calls `POST /api/v0/auth/magic-link` via `ApiClient`. That endpoint validates `Authorization: Bearer ${AUTHJS_TOKEN}`, checks email domain against allowlist (`alu.medac.es`), enforces IP rate limiting via `RateLimiter`, sends via `MailtrapTransport` (or logs link locally when `MAILTRAP_API_TOKEN` unset).

### Services (`src/lib/services/`)

| Service          | Purpose                                                     |
| ---------------- | ----------------------------------------------------------- |
| `Database/`      | `IDatabase` interface + `@libsql/client` implementation     |
| `AuthAdapter.ts` | Maps Auth.js adapter interface to `IDatabase`               |
| `ApiClient/`     | `HttpClient` base + `AuthClient` for internal API calls     |
| `Email/`         | `EmailService`, `EmailTemplateService`, `MailtrapTransport` |
| `RateLimiter/`   | Fixed-window rate limiter backed by `rate_limits` DB table  |

### Database layer

`IDatabase.ts` defines the interface. All types (`DbUser`, `DbAccount`, etc.) use `snake_case` matching SQL schema. Migrations live in `migrations/`; `bin/migrate-local` tracks state in a `_migrations` table.

### Global types (`src/app.d.ts`)

- `App.Api.*` — request/response shapes for the internal API
- `QuizFileV1` / `QuizFileV1.*` — quiz content types (globally available, no import needed)
