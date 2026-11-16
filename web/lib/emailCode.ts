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

// Email clients drop <style> blocks and flexbox, so this is table layout with
// inline styles only. Colours are the site's --red / --ink / --muted / --line.
export function signInCodeEmail(code: string): { subject: string; html: string } {
  const subject = `Your NaraNews sign-in code: ${code}`;
  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f8f9fb;">
<div style="display:none;max-height:0;overflow:hidden;">Your code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fb;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #d9e0eb;border-radius:12px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans Thai',Arial,sans-serif;color:#14213d;">
<tr><td style="background:#c7272e;padding:18px 28px;font-size:18px;font-weight:700;color:#ffffff;">NaraNews</td></tr>
<tr><td style="padding:28px 28px 8px;">
<h1 style="margin:0 0 8px;font-size:20px;font-weight:700;">Your sign-in code</h1>
<p style="margin:0;font-size:15px;line-height:1.5;color:#52627b;">Enter this code in NaraNews to finish signing in.</p>
</td></tr>
<tr><td style="padding:16px 28px;">
<div style="background:#f8f9fb;border:1px solid #d9e0eb;border-radius:10px;padding:18px 18px 18px 28px;text-align:center;font-family:'SFMono-Regular',Menlo,Consolas,monospace;font-size:32px;font-weight:700;letter-spacing:10px;color:#14213d;">${code}</div>
<p style="margin:12px 0 0;font-size:14px;color:#52627b;">It expires in ${CODE_TTL_MINUTES} minutes.</p>
</td></tr>
<tr><td style="padding:8px 28px 28px;">
<p style="margin:0;font-size:14px;line-height:1.5;color:#52627b;">Didn't ask for this? You can ignore this email; nothing changes on your account.</p>
</td></tr>
<tr><td style="border-top:1px solid #d9e0eb;padding:16px 28px;font-size:12px;color:#52627b;">NaraNews &middot; Thailand news, without the tab overload</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
  return { subject, html };
}

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
