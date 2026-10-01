// LR3: dispatch the F3 email digest to the caller's own address only, and
// only if that session is authenticated, its email is verified, and F3's
// consent (LR4) is currently granted. No target-user parameter — this is
// always self-dispatch, never an admin/bulk send.

import type { NextRequest } from "next/server";
import { withAccessLog } from "@/lib/logging";
import { resolveSession, isEmailVerified, hasActiveConsent, EMAIL_FALLBACK_CONSENT_PURPOSE } from "@/lib/auth";
import { query } from "@/lib/db";
import { readDigest } from "@/lib/news";
import { escapeHtml, sendEmail } from "@/lib/email";

function renderDigestHtml(items: { summary: string; url: string; source: string }[]): string {
  const rows = items
    .map((item) => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.summary)}</a> — <small>${escapeHtml(item.source)}</small></li>`)
    .join("");
  return `<h1>Your NaraNews digest</h1><ul>${rows}</ul>`;
}

const DISPATCH_COOLDOWN_MINUTES = 10;

// The extension calls this on every idle transition; one digest per cooldown is enough.
async function sentRecently(userId: string): Promise<boolean> {
  const [row] = await query<{ n: number }>(
    `SELECT count(*)::int AS n FROM access_log
     WHERE user_id = $1 AND route = '/api/dispatch/email' AND status = 200
       AND ts > now() - ($2 || ' minutes')::interval`,
    [userId, DISPATCH_COOLDOWN_MINUTES],
  );
  return row.n > 0;
}

export const POST = withAccessLog(async function POST(req: NextRequest) {
  const session = resolveSession(req);
  if (!session) {
    return Response.json({ error: "authentication required" }, { status: 401 });
  }
  if (await sentRecently(session.userId)) {
    return Response.json({ error: `a digest was sent in the last ${DISPATCH_COOLDOWN_MINUTES} minutes` }, { status: 429 });
  }
  if (!(await isEmailVerified(session.userId))) {
    return Response.json({ error: "email not verified" }, { status: 403 });
  }
  if (!(await hasActiveConsent(session.userId, EMAIL_FALLBACK_CONSENT_PURPOSE))) {
    return Response.json({ error: "consent not granted" }, { status: 403 });
  }

  const [contact] = await query<{ email: string }>("SELECT email FROM user_contacts WHERE user_id = $1", [session.userId]);
  if (!contact?.email) {
    return Response.json({ error: "no email on file" }, { status: 409 });
  }

  // No stored language preference yet, so the email uses the digest default (th).
  const items = await readDigest("th");

  try {
    await sendEmail(contact.email, "Your NaraNews digest", renderDigestHtml(items));
  } catch (err) {
    console.error("email dispatch failed", err instanceof Error ? err.message : err);
    return Response.json({ error: "dispatch failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
});
