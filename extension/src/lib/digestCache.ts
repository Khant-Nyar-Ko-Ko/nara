// Shared chrome.storage access for the cached digest — used by both
// background/service-worker.ts (writer) and popup/Popup.tsx (reader), kept
// separate from each so neither has to import the other's module.

import type { Headline } from "../types";

const DIGEST_STORAGE_KEY = "naranews.digest";

export interface CachedDigest {
  headlines: Headline[];
  fetchedAt: string;
}

export async function readCachedDigest(): Promise<CachedDigest | null> {
  const result = await chrome.storage.local.get(DIGEST_STORAGE_KEY);
  return (result[DIGEST_STORAGE_KEY] as CachedDigest | undefined) ?? null;
}

export async function writeCachedDigest(headlines: Headline[]): Promise<void> {
  const cached: CachedDigest = { headlines, fetchedAt: new Date().toISOString() };
  await chrome.storage.local.set({ [DIGEST_STORAGE_KEY]: cached });
}
