# NaraNews Crawler

TypeScript Apify crawler for Facebook news sources.

## Setup

```bash
cp crawler/.env.example crawler/.env
```

Set these values in `crawler/.env`:

- `APIFY_TOKEN`
- `GROQ_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_NEWS_TABLE` defaults to `news`

The manual news crawl uses `APIFY_FACEBOOK_POSTS_ACTOR_ID=apify/facebook-posts-scraper`, which extracts posts from Facebook page/profile URLs. Put the target page/profile links in `src/sources.ts`.

`apify/facebook-pages-scraper` returns page profile metadata such as followers, intro, website, and profile images, so it is listed separately as `APIFY_FACEBOOK_PAGES_ACTOR_ID`.

## Manual Crawl

```bash
npm run crawl:manual --workspace crawler
```

Before the first crawl, run [`sql/001_news_url_category.sql`](sql/001_news_url_category.sql) once in the Supabase SQL editor. It adds `url` (unique) and `category` to `news`.

One manual run crawls one latest post from each source in `src/sources.ts`, dedupes posts by normalized URL, skips any URL already in `news`, asks Groq for headlines plus a category for each remaining post, inserts the result into Supabase table `news`, and prints a JSON array with `source`, `sources`, `content`, `url`, `created_at`, `headline_en`, `headline_th`, `headline_mm`, and `category`.

## Scheduled Crawl

`.github/workflows/crawl.yml` runs the same crawl every 3 hours (UTC) on GitHub Actions, and can also be started by hand from the repo's **Actions** tab ("Crawl news" → **Run workflow**). It needs these repository secrets (Settings → Secrets and variables → Actions): `APIFY_TOKEN`, `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. The other variables use their defaults.

If Groq fails for a post, only that post is skipped; it isn't stored, so the next run retries it.

Supabase insert mapping for the `news` schema:

- `headline_en` -> `headline_en`
- `headline_th` -> `headline_th`
- `headline_mm` -> `headline_mm`
- `category` -> `category` (one of `NEWS_CATEGORIES` in `src/types.ts`, matching the popup's topic list)
- `content` -> `content`
- normalized post `url` -> `url` (unique; duplicates are ignored)
- post `created_at` -> `date`
- `source` -> `source`
- table `created_at` is left to its default `now()`
