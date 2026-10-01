// F1: poll the backend digest on a schedule and cache it, so the popup can
// render instantly instead of always waiting on a live fetch.
// F3: when the reader is away (idle or screen locked), ask the backend to
// email the digest. The server decides whether it may (signed in, verified
// email, consent on record, cooldown), so this only needs a saved session.
// Still out of scope here: F5 (Chrome system notifications) and LR5.

import { dispatchEmailDigest, fetchDigest, readSession } from "../lib/api";
import { writeCachedDigest } from "../lib/digestCache";

const ALARM_NAME = "naranews-digest-poll";
// No NFR sets a concrete refresh interval yet (spec §3 — none was
// supplied by interview/survey data). Placeholder default, not a
// validated requirement; revisit once one is set.
const POLL_INTERVAL_MINUTES = 15;
// Short for the Alpha demo (Chrome's minimum is 15s). No NFR sets "away" yet.
const IDLE_THRESHOLD_SECONDS = 60;

async function refreshDigest(): Promise<void> {
  try {
    const headlines = await fetchDigest();
    await writeCachedDigest(headlines);
  } catch (err) {
    console.error("naranews: digest refresh failed", err);
  }
}

async function emailDigestWhileAway(): Promise<void> {
  const session = await readSession();
  if (!session) return;
  try {
    await dispatchEmailDigest(session);
  } catch (err) {
    // Expected when consent isn't given or the cooldown applies; nothing to retry.
    console.info("naranews: email digest not sent", err instanceof Error ? err.message : err);
  }
}

// chrome.idle's interval isn't persisted, so set it every time the worker starts.
chrome.idle.setDetectionInterval(IDLE_THRESHOLD_SECONDS);

chrome.idle.onStateChanged.addListener((state) => {
  if (state === "idle" || state === "locked") void emailDigestWhileAway();
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: POLL_INTERVAL_MINUTES });
  void refreshDigest();
});

chrome.runtime.onStartup.addListener(() => void refreshDigest());

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) void refreshDigest();
});
