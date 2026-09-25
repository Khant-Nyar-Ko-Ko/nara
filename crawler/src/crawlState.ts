import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { getCrawlStateConfig, type CrawlStateConfig } from "./config.js";
import type { CrawledPost } from "./types.js";

interface CrawlState {
  last_crawled_at: string | null;
}

const EMPTY_STATE: CrawlState = {
  last_crawled_at: null,
};

function toTimestamp(value: string | null): number | null {
  if (!value) return null;

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

export async function readCrawlState(
  config: CrawlStateConfig = getCrawlStateConfig(),
): Promise<CrawlState> {
  try {
    return JSON.parse(await readFile(config.stateFile, "utf8")) as CrawlState;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return EMPTY_STATE;
    }

    throw error;
  }
}

export function filterPostsAfterCutoff(posts: CrawledPost[], lastCrawledAt: string | null): CrawledPost[] {
  const cutoff = toTimestamp(lastCrawledAt);
  if (cutoff === null) return posts;

  return posts.filter((post) => {
    const createdAt = toTimestamp(post.created_at);
    return createdAt !== null && createdAt > cutoff;
  });
}

export function newestCreatedAt(posts: CrawledPost[]): string | null {
  let newest: string | null = null;
  let newestTimestamp = Number.NEGATIVE_INFINITY;

  for (const post of posts) {
    const timestamp = toTimestamp(post.created_at);
    if (timestamp !== null && timestamp > newestTimestamp) {
      newest = new Date(timestamp).toISOString();
      newestTimestamp = timestamp;
    }
  }

  return newest;
}

export async function writeCrawlState(
  lastCrawledAt: string,
  config: CrawlStateConfig = getCrawlStateConfig(),
): Promise<void> {
  await mkdir(dirname(config.stateFile), { recursive: true });
  await writeFile(
    config.stateFile,
    `${JSON.stringify({ last_crawled_at: lastCrawledAt }, null, 2)}\n`,
    "utf8",
  );
}
