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

One manual run crawls one latest post from each source in `src/sources.ts`, filters out posts at or before the last crawled time, dedupes posts by normalized URL, asks Groq to summarize each remaining post, inserts the result into Supabase table `news`, and prints a JSON array with `source`, `sources`, `content`, `url`, `created_at`, `headline_en`, `headline_th`, and `headline_mm`.

Supabase insert mapping for the current `news` schema:

- `headline_en` -> `headline_en`
- `headline_th` -> `headline_th`
- `headline_mm` -> `headline_mm`
- `content` -> `content`
- post `created_at` -> `date`
- `source` -> `source`
- table `created_at` is left to its default `now()`

The newest returned `created_at` is stored in `crawler/.crawl-state.json` by default. Set `CRAWLER_STATE_FILE` to override that path.
