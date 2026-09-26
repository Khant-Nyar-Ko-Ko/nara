import type { CrawledPost, DedupedPost } from "./types.js";

const TRACKING_PARAMS = new Set([
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
  "ref",
  "spm",
]);

function normalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();

    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("utm_") || TRACKING_PARAMS.has(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }

    url.searchParams.sort();

    if (url.pathname.length > 1) {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }

    return url.toString();
  } catch {
    return rawUrl.trim();
  }
}

function addSource(sources: string[], source: string): string[] {
  return sources.includes(source) ? sources : [...sources, source];
}

export function dedupePostsByUrl(posts: CrawledPost[]): DedupedPost[] {
  const byUrl = new Map<string, DedupedPost>();

  for (const post of posts) {
    const key = normalizeUrl(post.url);
    const existing = byUrl.get(key);

    if (!existing) {
      byUrl.set(key, {
        ...post,
        url: key,
        sources: [post.source],
      });
      continue;
    }

    existing.sources = addSource(existing.sources, post.source);

    if (!existing.created_at && post.created_at) {
      existing.created_at = post.created_at;
    }
  }

  return [...byUrl.values()];
}
