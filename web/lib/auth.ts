// Stateless session tokens: `<userId>.<expiresAtSeconds>.<hmac>`, sent by the
// extension as `Authorization: Bearer <token>`. Issued only by
// /api/auth/verify-code after the email is verified (rule.md CCA §26 / LR3:
// every session maps to a verified identity). No token → null session, which
// the gated routes treat as "authentication required".

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { query } from "./db";

// consent_log purpose for F3's ToS/Privacy-Policy consent (LR4), shared by
// /api/consent (writer) and /api/dispatch/email (reader, via hasActiveConsent).
export const EMAIL_FALLBACK_CONSENT_PURPOSE = "email_fallback_tos";

const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

export function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(userId: string): { token: string; expiresAt: string } {
  const expiresAtSeconds = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${userId}.${expiresAtSeconds}`;
  return {
    token: `${payload}.${sign(payload)}`,
    expiresAt: new Date(expiresAtSeconds * 1000).toISOString(),
  };
}

export interface AuthedSession {
  userId: string;
  // Hash of the token, safe to log (rule.md CCA §26: never log tokens).
  sessionId: string;
}

function bearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  const match = header?.match(/^Bearer\s+(\S+)$/i);
  return match?.[1] ?? null;
}

export function resolveSession(req: NextRequest): AuthedSession | null {
  const token = bearerToken(req);
  if (!token) return null;

  const [userId, expiresAtSeconds, signature] = token.split(".");
  if (!userId || !expiresAtSeconds || !signature) return null;

  const expected = Buffer.from(sign(`${userId}.${expiresAtSeconds}`));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  if (Number(expiresAtSeconds) * 1000 <= Date.now()) return null;

  return { userId, sessionId: createHash("sha256").update(token).digest("hex").slice(0, 32) };
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
