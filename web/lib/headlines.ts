// F1: fetch + normalize headlines from every source in sources.ts. Shared
// by /api/headlines (raw) and /api/digest (F2 summarizes on top of this).

import { createHash } from "node:crypto";
import { XMLParser } from "fast-xml-parser";
import { NEWS_SOURCES, type NewsSource } from "./sources";

export interface FetchedHeadline {
  id: string;
  source: string;
  title: string;
  description: string | null;
  url: string;
  publishedAt: string | null;
}

const parser = new XMLParser({ ignoreAttributes: false, htmlEntities: true });

function textOf(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "#text" in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>)["#text"]);
  }
  return null;
}

function toIso(pubDate: unknown): string | null {
  const raw = textOf(pubDate);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function fetchSource(source: NewsSource): Promise<FetchedHeadline[]> {
  const res = await fetch(source.feedUrl, {
    headers: {
      "User-Agent": "NaraNewsBot/1.0",
      Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${source.id}: HTTP ${res.status}`);

  const xml = await res.text();
  const items = parser.parse(xml)?.rss?.channel?.item ?? [];
  const list = Array.isArray(items) ? items : [items];

  return list
    .map((item): FetchedHeadline | null => {
      const title = textOf(item.title);
      const url = textOf(item.link);
      if (!title || !url) return null;
      return {
        id: createHash("sha1").update(`${source.id}:${url}`).digest("hex"),
        source: source.id,
        title,
        description: textOf(item.description),
        url,
        publishedAt: toIso(item.pubDate),
      };
    })
    .filter((headline): headline is FetchedHeadline => headline !== null);
}

export async function fetchAllHeadlines(): Promise<FetchedHeadline[]> {
  const results = await Promise.allSettled(NEWS_SOURCES.map(fetchSource));

  const headlines = results.flatMap((result, i) => {
    if (result.status === "fulfilled") return result.value;
    console.error(`headlines: ${NEWS_SOURCES[i].id} failed`, result.reason);
    return [];
  });

  headlines.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  return headlines;
}
