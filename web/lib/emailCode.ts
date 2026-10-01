// F3 sign-in by emailed 6-digit code. Verifying the code is what verifies the
// email (LR3 / rule.md CCA §26: identity verified at sign-up), so a
// successful verify creates the user with email_verified_at already set.

import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { query, withTransaction } from "./db";
import { sessionSecret } from "./auth";

const CODE_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const RATE_WINDOW_MINUTES = 15;
const MAX_CODES_PER_EMAIL = 3;
const MAX_REQUESTS_PER_IP = 10;
export const REQUEST_CODE_ROUTE = "/api/auth/request-code";

export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const email = input.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function hashCode(email: string, code: string): string {
  return createHmac("sha256", sessionSecret()).update(`${email}:${code}`).digest("hex");
}

export async function isRateLimited(email: string, ip: string): Promise<boolean> {
  const [byEmail] = await query<{ n: number }>(
    `SELECT count(*)::int AS n FROM email_codes
     WHERE email = $1 AND created_at > now() - ($2 || ' minutes')::interval`,
    [email, RATE_WINDOW_MINUTES],
  );
  // The current request's own access_log row is written after the handler, so it isn't counted here.
  const [byIp] = await query<{ n: number }>(
    `SELECT count(*)::int AS n FROM access_log
     WHERE ip = $1 AND route = $2 AND ts > now() - ($3 || ' minutes')::interval`,
    [ip, REQUEST_CODE_ROUTE, RATE_WINDOW_MINUTES],
  );
  return byEmail.n >= MAX_CODES_PER_EMAIL || byIp.n >= MAX_REQUESTS_PER_IP;
}

export async function issueCode(email: string): Promise<string> {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await query(
    `INSERT INTO email_codes (email, code_hash, expires_at)
     VALUES ($1, $2, now() + ($3 || ' minutes')::interval)`,
    [email, hashCode(email, code), CODE_TTL_MINUTES],
  );
  return code;
}

// Returns the signed-in user's id, or null if the code is wrong, expired, used, or out of attempts.
export async function verifyCodeAndSignIn(email: string, code: string): Promise<string | null> {
  if (!/^\d{6}$/.test(code)) return null;

  return withTransaction(async (client) => {
    const { rows } = await client.query<{ id: string; code_hash: string; attempts: number }>(
      `SELECT id, code_hash, attempts FROM email_codes
       WHERE email = $1 AND consumed_at IS NULL AND expires_at > now()
       ORDER BY id DESC LIMIT 1
       FOR UPDATE`,
      [email],
    );
    const pending = rows[0];
    if (!pending || pending.attempts >= MAX_ATTEMPTS) return null;

    await client.query("UPDATE email_codes SET attempts = attempts + 1 WHERE id = $1", [pending.id]);

    const expected = Buffer.from(pending.code_hash);
    const actual = Buffer.from(hashCode(email, code));
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

    await client.query("UPDATE email_codes SET consumed_at = now() WHERE id = $1", [pending.id]);

    const existing = await client.query<{ user_id: string }>(
      "SELECT user_id FROM user_contacts WHERE email = $1 AND email_verified_at IS NOT NULL",
      [email],
    );
    if (existing.rows[0]) {
      const userId = existing.rows[0].user_id;
      await client.query("UPDATE users SET last_login_at = now() WHERE id = $1", [userId]);
      return userId;
    }

    const created = await client.query<{ id: string }>(
      "INSERT INTO users (last_login_at) VALUES (now()) RETURNING id",
    );
    const userId = created.rows[0].id;
    await client.query(
      "INSERT INTO user_contacts (user_id, email, email_verified_at) VALUES ($1, $2, now())",
      [userId, email],
    );
    return userId;
  });
}
