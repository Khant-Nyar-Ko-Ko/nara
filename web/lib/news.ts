// F1/F2: read crawler-produced headlines (crawler/ → Supabase `news`) for the digest.

import { createHash } from "node:crypto";
import { query } from "./db";

export const DIGEST_LANGS = ["th", "en", "mm"] as const;
export type DigestLang = (typeof DIGEST_LANGS)[number];

// Whitelisted column per lang — the only way lang reaches the SQL text.
const HEADLINE_COLUMN: Record<DigestLang, string> = {
  th: "headline_th",
  en: "headline_en",
  mm: "headline_mm",
};

const DIGEST_LIMIT = 50;

export interface DigestItem {
  id: string;
  source: string;
  category: string | null;
  summary: string;
  url: string;
  fetchedAt: string;
}

interface NewsRow {
  source: string;
  category: string | null;
  summary: string;
  url: string;
  published_at: Date;
}

export function parseLang(value: string | null): DigestLang | null {
  if (value === null) return "th";
  return DIGEST_LANGS.find((lang) => lang === value) ?? null;
}

export async function readDigest(lang: DigestLang): Promise<DigestItem[]> {
  const column = HEADLINE_COLUMN[lang];
  const rows = await query<NewsRow>(
    `SELECT source, category, ${column} AS summary, url, COALESCE(date::timestamptz, created_at) AS published_at
     FROM news
     WHERE url IS NOT NULL AND ${column} IS NOT NULL
     ORDER BY published_at DESC
     LIMIT $1`,
    [DIGEST_LIMIT],
  );

  return rows.map((row) => ({
    id: createHash("sha1").update(row.url).digest("hex"),
    source: row.source,
    category: row.category,
    summary: row.summary,
    url: row.url,
    fetchedAt: row.published_at.toISOString(),
  }));
}
