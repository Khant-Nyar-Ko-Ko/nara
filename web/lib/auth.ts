// Minimal session primitive: a stateless, HMAC-signed cookie mapping a
// request to a user_id. No login/signup flow exists yet (not in scope
// here) — `createSessionCookie` is the pair a future one would call;
// until then `resolveSession` correctly returns null for every request,
// which is the right default per rule.md CCA §26 ("no anonymous guest
// write access") rather than a bypass.

import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { query } from "./db";

export const SESSION_COOKIE = "nara_session";

// consent_log purpose for F3's ToS/Privacy-Policy consent (LR4), shared by
// /api/consent (writer) and /api/dispatch/email (reader, via hasActiveConsent).
export const EMAIL_FALLBACK_CONSENT_PURPOSE = "email_fallback_tos";

function sign(userId: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return createHmac("sha256", secret).update(userId).digest("base64url");
}

export function createSessionCookie(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

export interface AuthedSession {
  userId: string;
  sessionId: string;
}

export function resolveSession(req: NextRequest): AuthedSession | null {
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const [userId, signature] = raw.split(".");
  if (!userId || !signature) return null;

  const expected = Buffer.from(sign(userId));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  return { userId, sessionId: raw };
}

// LR3: the email-fallback channel may only dispatch to a verified address.
export async function isEmailVerified(userId: string): Promise<boolean> {
  const [row] = await query<{ email_verified_at: string | null }>(
    "SELECT email_verified_at FROM user_contacts WHERE user_id = $1",
    [userId],
  );
  return Boolean(row?.email_verified_at);
}

// LR4: latest recorded consent for a purpose — withdrawal is a new
// (granted = false) row, never an edit, so "latest" is always current.
export async function hasActiveConsent(userId: string, purpose: string): Promise<boolean> {
  const [row] = await query<{ granted: boolean }>(
    "SELECT granted FROM consent_log WHERE user_id = $1 AND purpose = $2 ORDER BY ts DESC LIMIT 1",
    [userId, purpose],
  );
  return Boolean(row?.granted);
}
