# NaraNews

Every Thai headline, one clean list. A Chrome extension that gathers Thai news into one digest of one-line headlines — a popup while you're browsing, an email when you're away.

- **Live site:** https://nara-news.vercel.app
- **Course:** 1305493 SE Case Studies, 1/2569 (ADT, MFU) · Team: Khant Nyar Ko Ko, La Yaung Chit, Lin Htet Aung, Thaung Than Han, Moe Mya Myintzu
- **Project index for grading (Discover → Deliver):** [.docs/final/README.md](.docs/final/README.md)

## What's in the repo

| Folder | What | Stack |
|---|---|---|
| `extension/` | Chrome extension (Manifest V3): popup digest, options/sign-in, background worker that emails the digest when you're away | Vite + React + TypeScript |
| `web/` | Website + REST API: digest, sign-in by emailed code, consent, email dispatch, access log | Next.js 14 on Vercel |
| `crawler/` | Collects Facebook posts from 5 Thai outlets (Apify) and writes EN/TH/Burmese headlines (Groq) into Supabase | Node + TypeScript, run by GitHub Actions |
| `.docs/` | Requirements, design, tests, logs, final deliverables | Markdown |

How they connect: [D3 architecture](.docs/02-design/diagrams/D3-architecture.md). Legal rules the code follows: [rule.md](rule.md). How the team uses AI: [CLAUDE.md](CLAUDE.md).

## Run it locally

Needs Node 20+ and npm. One `npm ci` at the root installs all three workspaces.

```bash
npm ci
```

### 1. Backend + website (`web/`)

```bash
cp web/.env.example web/.env.local
```

Fill in `web/.env.local` (every variable is explained in the file):
- `DATABASE_URL`, `DATABASE_CA_CERT`, `RETENTION_DATABASE_URL` — a Supabase Postgres project. Create the tables once with `ensureSchema()` from `web/lib/db.ts` (idempotent; run it with the `postgres` login, e.g. `cd web && DATABASE_URL="$RETENTION_DATABASE_URL" npx tsx -e "import('./lib/db').then(m => m.ensureSchema())"`), then run `web/sql/001_app_role.sql` and `web/sql/002_email_codes_grants.sql` in the Supabase SQL editor.
- `SMTP_USER`, `SMTP_APP_PASSWORD` — a Gmail address and an app password, used to send sign-in codes and digests.
- `SESSION_SECRET` — any long random string (`openssl rand -hex 32`).

```bash
npm run dev --workspace web        # http://localhost:3000
```

### 2. Chrome extension (`extension/`)

```bash
cp extension/.env.example extension/.env.local    # VITE_API_BASE_URL=http://localhost:3000
npm run build --workspace extension
```

Then open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked** and choose `extension/dist`. Pin NaraNews to the toolbar.

To use the live backend instead of your local one, set `VITE_API_BASE_URL=https://nara-news.vercel.app` before building.

### 3. Crawler (`crawler/`, optional)

```bash
cp crawler/.env.example crawler/.env    # APIFY_TOKEN, GROQ_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
npm run crawl:manual --workspace crawler
```

Run `crawler/sql/001_news_url_category.sql` once first. In production the crawl runs on GitHub Actions (`.github/workflows/crawl.yml`), started every 2 hours (07:00–21:00 Thailand time) by a Supabase timer (`crawler/sql/002_crawl_timer.sql`). See [crawler/README.md](crawler/README.md).

### Tests

```bash
npm run typecheck --workspaces
npm test --workspace web          # auth + digest email
npm test --workspace crawler      # Groq headline rules: Thai length, retries, categories
```

CI runs the same on every pull request (`.github/workflows/ci.yml`).

## Test account

There are no shared passwords: you sign in with a 6-digit code sent to your email.

1. Install the extension (above) or open https://nara-news.vercel.app/settings.
2. Enter **any email address you can read** and press **Send sign-in code**. Enter the 6-digit code from your inbox and press **Verify and open settings**.
3. To try the email digest, tick the consent on Settings ("I agree — turn on email digest"), then leave Chrome idle for 60 seconds or lock the screen. At most one digest is sent per 10 minutes.

Your address is used only for sign-in codes and the digest (rule.md, PDPA). Turn it off any time on the Settings page.

## Secrets

No keys, passwords or `.env` files are committed: `.env` and `.env.local` are git-ignored, and only `.env.example` files with blank or placeholder values are in the repo. Production secrets live in Vercel, the GitHub `nara-keys` environment and Supabase Vault. The full git history was scanned for API keys, tokens and database passwords on 17 Nov 2026; none were found.
