import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  generateHeadlines,
  headlineLength,
  THAI_HEADLINE_MAX_CHARS,
} from "../src/groqHeadlines.js";
import type { DedupedPost } from "../src/types.js";

// Synthetic post and key only: no real Groq calls or production data.
const config = { apiKey: "synthetic-test-key", model: "test-model" };
const post: DedupedPost = {
  source: "test-source",
  content: "Synthetic post body.",
  url: "https://example.com/post/1",
  created_at: null,
  sources: ["test-source"],
};

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function mockGroq(thaiHeadlines: string[]) {
  const bodies: Array<{ messages: Array<{ role: string; content: string }> }> = [];
  globalThis.fetch = (async (_url: unknown, init?: { body?: string }) => {
    bodies.push(JSON.parse(init?.body ?? "{}"));
    const headline_th = thaiHeadlines[bodies.length - 1];
    const content = JSON.stringify({ headline_en: "EN", headline_th, headline_mm: "MM", category: "Society" });
    return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
  }) as typeof fetch;
  return bodies;
}

test("counts Thai vowel and tone marks as characters", () => {
  assert.equal(headlineLength("ข่าว"), 4);
});

test("keeps a short Thai headline without a retry", async () => {
  const bodies = mockGroq(["ก".repeat(40)]);
  const result = await generateHeadlines(post, config);
  assert.equal(bodies.length, 1);
  assert.equal(headlineLength(result.headline_th), 40);
  assert.match(bodies[0].messages[1].content, /at most 40 characters/);
});

test("retries once when the Thai headline is too long and uses the shorter one", async () => {
  const bodies = mockGroq(["ก".repeat(70), "ก".repeat(38)]);
  const result = await generateHeadlines(post, config);
  assert.equal(bodies.length, 2);
  assert.equal(headlineLength(result.headline_th), 38);
  assert.match(bodies[1].messages.at(-1)?.content ?? "", /has 70 characters/);
});

test("stops after one retry and keeps the shorter headline", async () => {
  const bodies = mockGroq(["ก".repeat(70), "ก".repeat(60)]);
  const result = await generateHeadlines(post, config);
  assert.equal(bodies.length, 2);
  assert.equal(headlineLength(result.headline_th), 60);
  assert.ok(headlineLength(result.headline_th) > THAI_HEADLINE_MAX_CHARS);
});
