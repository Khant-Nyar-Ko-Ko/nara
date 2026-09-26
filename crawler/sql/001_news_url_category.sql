-- Run once in the Supabase SQL editor before the next crawl.
-- url: F2 click-through target, and the dedupe key (replaces .crawl-state.json).
-- category: matches NEWS_CATEGORIES in src/types.ts.
ALTER TABLE news ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE news DROP CONSTRAINT IF EXISTS news_url_key;
ALTER TABLE news ADD CONSTRAINT news_url_key UNIQUE (url);
