// F1: poll the backend digest on a schedule and cache it, so the popup can
// render instantly instead of always waiting on a live fetch.
// Deliberately out of scope here: F5 (chrome.idle-gated notifications) and
// LR5 (routing by stored channel preference) — this worker only refreshes
// the cache, it never fires a notification.

import { fetchDigest } from "../lib/api";
import { writeCachedDigest } from "../lib/digestCache";

const ALARM_NAME = "naranews-digest-poll";
// No NFR sets a concrete refresh interval yet (spec §3 — none was
// supplied by interview/survey data). Placeholder default, not a
// validated requirement; revisit once one is set.
const POLL_INTERVAL_MINUTES = 15;

async function refreshDigest(): Promise<void> {
  try {
    const headlines = await fetchDigest();
    await writeCachedDigest(headlines);
  } catch (err) {
    console.error("naranews: digest refresh failed", err);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: POLL_INTERVAL_MINUTES });
  void refreshDigest();
});

chrome.runtime.onStartup.addListener(() => void refreshDigest());

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) void refreshDigest();
});
