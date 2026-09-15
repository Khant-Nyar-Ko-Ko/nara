// F1: fetch headlines from each source in lib/sources.ts and normalize to
// one shape. Not yet summarized — that's F2 (lib/summarize.ts), consumed
// via /api/digest.

import { createHash } from "node:crypto";
import { XMLParser } from "fast-xml-parser";
import type { NewsSource } from "@/lib/sources";
import { NEWS_SOURCES } from "@/lib/sources";
import { withAccessLog } from "@/lib/logging";

export interface FetchedHeadline {
  id: string;
  source: string;
  title: string;
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
        url,
        publishedAt: toIso(item.pubDate),
      };
    })
    .filter((headline): headline is FetchedHeadline => headline !== null);
}

export const GET = withAccessLog(async function GET() {
  const results = await Promise.allSettled(NEWS_SOURCES.map(fetchSource));

  const headlines = results.flatMap((result, i) => {
    if (result.status === "fulfilled") return result.value;
    console.error(`headlines: ${NEWS_SOURCES[i].id} failed`, result.reason);
    return [];
  });

  headlines.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

  return Response.json({ headlines });
});
