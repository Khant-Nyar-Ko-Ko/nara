import assert from "node:assert/strict";
import { test } from "node:test";
import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import { createSessionToken, resolveSession } from "../lib/auth";
import { WEB_SESSION_COOKIE } from "../lib/web-session";

process.env.SESSION_SECRET = "synthetic-test-secret-not-for-deployment";
const origin = "https://nara.example";
const { token } = createSessionToken("synthetic-user");
function cookieRequest(method = "GET", requestOrigin?: string) {
  const headers: Record<string, string> = { cookie: `${WEB_SESSION_COOKIE}=${token}` };
  if (requestOrigin) headers.origin = requestOrigin;
  return new NextRequest(`${origin}/api/consent`, { method, headers });
}
test("extension bearer sessions remain supported", () => {
  const request = new NextRequest(`${origin}/api/consent`, { method: "POST", headers: { authorization: `Bearer ${token}` } });
  assert.equal(resolveSession(request)?.userId, "synthetic-user");
});
test("website cookie permits reads and same-origin writes", () => {
  assert.equal(resolveSession(cookieRequest())?.userId, "synthetic-user");
  assert.equal(resolveSession(cookieRequest("POST", origin))?.userId, "synthetic-user");
});
test("cookie writes without the website origin are rejected", () => {
  assert.equal(resolveSession(cookieRequest("POST")), null);
  assert.equal(resolveSession(cookieRequest("POST", "https://other.example")), null);
});
test("tampered, expired and malformed tokens are rejected", () => {
  const expiredPayload = "synthetic-user.1";
  const expired = `${expiredPayload}.${createHmac("sha256", process.env.SESSION_SECRET!).update(expiredPayload).digest("base64url")}`;
  for (const invalid of [`${token}extra`, `${token}.extra`, expired, "bad"]) {
    const request = new NextRequest(`${origin}/api/auth/session`, { headers: { authorization: `Bearer ${invalid}` } });
    assert.equal(resolveSession(request), null);
  }
});
