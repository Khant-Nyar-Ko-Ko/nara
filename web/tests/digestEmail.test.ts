import assert from "node:assert/strict";
import { test } from "node:test";
import { digestEmail, EMAIL_HEADLINE_COUNT, ageLabel } from "../lib/digestEmail";
import type { DigestItem } from "../lib/news";

// Synthetic items and address only (rule.md: no production data in tests).
const now = new Date("2026-11-17T08:00:00Z");
function item(i: number, overrides: Partial<DigestItem> = {}): DigestItem {
  return {
    id: `id${i}`,
    source: "Test Source",
    category: "Society",
    summary: `ข่าวทดสอบ ${i}`,
    url: `https://example.com/news/${i}`,
    fetchedAt: new Date(now.getTime() - (i + 1) * 60_000).toISOString(),
    ...overrides,
  };
}
const recipient = "reader@example.com";

test("shows at most 10 headlines and a See all button", () => {
  const items = Array.from({ length: 25 }, (_, i) => item(i));
  const { subject, html } = digestEmail(items, recipient, now);
  assert.equal(EMAIL_HEADLINE_COUNT, 10);
  assert.equal(subject, "Today's Thai news: 10 headlines");
  assert.match(html, /ข่าวทดสอบ 9</);
  assert.doesNotMatch(html, /ข่าวทดสอบ 10</);
  assert.match(html, /See all headlines/);
});

test("footer says where it went, why, and how to turn it off (LR1/LR4)", () => {
  const { html } = digestEmail([item(0)], recipient, now);
  assert.match(html, /Sent to reader@example\.com because you turned on the email digest/);
  assert.match(html, /href="[^"]*\/settings"[^>]*>Turn off email digest/);
});

test("escapes headline text and drops non-http links", () => {
  const { html } = digestEmail(
    [item(0, { summary: "<script>alert(1)</script>", url: "javascript:alert(1)" })],
    recipient,
    now,
  );
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /javascript:/);
});

test("hides the catch-all Other category", () => {
  const { html } = digestEmail([item(0, { category: "Other", source: "Bangkok Post" })], recipient, now);
  assert.match(html, />Bangkok Post</);
  assert.doesNotMatch(html, /· Other/);
});

test("handles an empty digest", () => {
  const { subject, html } = digestEmail([], recipient, now);
  assert.equal(subject, "Today's Thai news");
  assert.match(html, /No new headlines right now/);
});

test("age labels", () => {
  assert.equal(ageLabel(new Date(now.getTime() - 5 * 60_000).toISOString(), now), "5 min ago");
  assert.equal(ageLabel(new Date(now.getTime() - 3 * 3_600_000).toISOString(), now), "3 h ago");
  assert.equal(ageLabel(new Date(now.getTime() - 50 * 3_600_000).toISOString(), now), "2 d ago");
});
