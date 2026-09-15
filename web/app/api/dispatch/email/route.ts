// LR3: dispatch the F3 email digest to the caller's own address only, and
// only if that session is authenticated, its email is verified, and F3's
// consent (LR4) is currently granted. No target-user parameter — this is
// always self-dispatch, never an admin/bulk send.

import type { NextRequest } from "next/server";
import { withAccessLog } from "@/lib/logging";
import { resolveSession, isEmailVerified, hasActiveConsent, EMAIL_FALLBACK_CONSENT_PURPOSE } from "@/lib/auth";
import { query } from "@/lib/db";
import { fetchAllHeadlines } from "@/lib/headlines";
import { summarize } from "@/lib/summarize";

const RESEND_API_URL = "https://api.resend.com/emails";

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  const from = process.env.EMAIL_FROM_ADDRESS;
  if (!apiKey || !from) throw new Error("EMAIL_PROVIDER_API_KEY / EMAIL_FROM_ADDRESS not set");

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend dispatch failed: HTTP ${res.status}`);
}

function escapeHtml(input: string): string {
  const escapes: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return input.replace(/[&<>"']/g, (c) => escapes[c]);
}

function renderDigestHtml(items: { summary: string; url: string; source: string }[]): string {
  const rows = items
    .map((item) => `<li><a href="${item.url}">${escapeHtml(item.summary)}</a> — <small>${escapeHtml(item.source)}</small></li>`)
    .join("");
  return `<h1>Your NaraNews digest</h1><ul>${rows}</ul>`;
}

export const POST = withAccessLog(async function POST(req: NextRequest) {
  const session = resolveSession(req);
  if (!session) {
    return Response.json({ error: "authentication required" }, { status: 401 });
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

  const headlines = await fetchAllHeadlines();
  const items = headlines.map((h) => ({ summary: summarize(h), url: h.url, source: h.source }));

  try {
    await sendEmail(contact.email, "Your NaraNews digest", renderDigestHtml(items));
  } catch (err) {
    console.error("email dispatch failed", err instanceof Error ? err.message : err);
    return Response.json({ error: "dispatch failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
});
