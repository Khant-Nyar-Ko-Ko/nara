import { ApifyClient } from "apify-client";
import { getApifyCrawlerConfig, type ApifyCrawlerConfig } from "./config.js";
import { FACEBOOK_NEWS_SOURCES, type FacebookNewsSource } from "./sources.js";
import type { CrawledPost } from "./types.js";

type ApifyDatasetItem = Record<string, unknown>;

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function firstString(item: ApifyDatasetItem, keys: string[]): string | null {
  for (const key of keys) {
    const value = stringValue(item[key]);
    if (value) return value;
  }

  return null;
}

function dateValue(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const milliseconds = value < 1_000_000_000_000 ? value * 1000 : value;
    return new Date(milliseconds).toISOString();
  }

  const raw = stringValue(value);
  if (!raw) return null;

  const numeric = Number(raw);
  if (Number.isFinite(numeric)) {
    const milliseconds = numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
    return new Date(milliseconds).toISOString();
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? raw : date.toISOString();
}

function normalizeApifyItem(source: FacebookNewsSource, item: ApifyDatasetItem): CrawledPost | null {
  const content = firstString(item, ["text", "message", "description", "caption"]);
  const url = firstString(item, ["url", "postUrl", "facebookUrl", "link"]);
  const created_at = dateValue(
    item.time ??
      item.timestamp ??
      item.timeCreated ??
      item.timestampCreated ??
      item.createdAt ??
      item.creationTime ??
      item.created_time ??
      item.creation_time ??
      item.date,
  );

  if (!content || !url) return null;

  return {
    source: source.name,
    content,
    url,
    created_at,
  };
}

function buildFacebookActorInput(source: FacebookNewsSource, resultsLimit: number): Record<string, unknown> {
  return {
    startUrls: [{ url: source.facebookUrl }],
    resultsLimit,
    proxyConfiguration: {
      useApifyProxy: true,
    },
  };
}

export async function crawlOneNewsFromSource(
  source: FacebookNewsSource,
  config: ApifyCrawlerConfig = getApifyCrawlerConfig(),
): Promise<CrawledPost | null> {
  const client = new ApifyClient({ token: config.token });
  const run = await client.actor(config.facebookPostsActorId).call(buildFacebookActorInput(source, config.resultsLimit));

  const dataset = await client.dataset(run.defaultDatasetId).listItems({ limit: config.resultsLimit });
  const items = dataset.items as ApifyDatasetItem[];

  for (const item of items) {
    const normalized = normalizeApifyItem(source, item);
    if (normalized) return normalized;
  }

  return null;
}

export async function crawlOneNewsPerSource(
  sources: FacebookNewsSource[] = FACEBOOK_NEWS_SOURCES,
  config: ApifyCrawlerConfig = getApifyCrawlerConfig(),
): Promise<CrawledPost[]> {
  const results = await Promise.allSettled(
    sources.map((source) => crawlOneNewsFromSource(source, config)),
  );

  return results.flatMap((result, index) => {
    if (result.status === "fulfilled") {
      return result.value ? [result.value] : [];
    }

    console.error(`crawler: ${sources[index].id} failed`, result.reason);
    return [];
  });
}
