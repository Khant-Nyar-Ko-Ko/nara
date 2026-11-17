// F3 email digest. Layout follows .docs/02-design/prototype/02-email-digest.html
// and design-system.md: one column, max 600px, every tappable row >= 44px,
// one primary button, and a footer that says where the email went, why, and
// how to stop it (LR1 / LR4). Email clients drop <style> blocks and flexbox,
// so this is table layout with inline styles only, like signInCodeEmail.

import { escapeHtml } from "./email";
import type { DigestItem } from "./news";
import { SITE_URL } from "./site";

export const EMAIL_HEADLINE_COUNT = 10;

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans Thai',Arial,sans-serif";

// Only http(s) links reach the email; anything else is shown as plain text.
function safeHref(raw: string): string | null {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

export function ageLabel(iso: string, now: Date): string {
  const minutes = Math.max(1, Math.round((now.getTime() - new Date(iso).getTime()) / 60000));
  if (Number.isNaN(minutes)) return "";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours} h ago` : `${Math.floor(hours / 24)} d ago`;
}

function thaiDate(now: Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Bangkok", weekday: "short", day: "numeric", month: "short" }).format(now);
}

function row(item: DigestItem, now: Date): string {
  // The crawler's catch-all category isn't worth showing as a label (same as the popup).
  const meta = [item.source, item.category && item.category !== "Other" ? item.category : null].filter(Boolean).join(" · ");
  const href = safeHref(item.url);
  const headline = escapeHtml(item.summary);
  const title = href
    ? `<a href="${escapeHtml(href)}" style="color:#17243a;text-decoration:none;">${headline}</a>`
    : headline;
  return `<tr><td style="padding:14px 28px;border-top:1px solid #d9e0eb;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-size:12px;color:#52627b;">${escapeHtml(meta)}</td>
<td align="right" style="font-size:12px;color:#52627b;white-space:nowrap;">${escapeHtml(ageLabel(item.fetchedAt, now))}</td>
</tr></table>
<div style="margin-top:4px;font-size:16px;line-height:1.4;font-weight:700;min-height:22px;">${title}</div>
</td></tr>`;
}

export function digestEmail(
  items: DigestItem[],
  recipient: string,
  now: Date = new Date(),
): { subject: string; html: string } {
  const shown = items.slice(0, EMAIL_HEADLINE_COUNT);
  const subject = shown.length > 0
    ? `Today's Thai news: ${shown.length} headline${shown.length === 1 ? "" : "s"}`
    : "Today's Thai news";
  const preheader = shown[0] ? escapeHtml(shown[0].summary) : "No new headlines right now.";
  const body = shown.length > 0
    ? shown.map((item) => row(item, now)).join("")
    : `<tr><td style="padding:20px 28px;border-top:1px solid #d9e0eb;font-size:15px;color:#52627b;">No new headlines right now. We'll include them in your next digest.</td></tr>`;

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f9fb;">
<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fb;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #d9e0eb;border-radius:12px;overflow:hidden;font-family:${FONT};color:#14213d;">
<tr><td style="background:#c7272e;padding:18px 28px;font-size:18px;font-weight:700;color:#ffffff;">NaraNews</td></tr>
<tr><td style="padding:24px 28px 16px;">
<h1 style="margin:0 0 4px;font-size:22px;font-weight:700;">Today's Thai news</h1>
<p style="margin:0;font-size:14px;color:#52627b;">${shown.length} headline${shown.length === 1 ? "" : "s"} &middot; ${escapeHtml(thaiDate(now))}</p>
</td></tr>
${body}
<tr><td align="center" style="padding:20px 28px 28px;border-top:1px solid #d9e0eb;">
<a href="${escapeHtml(`${SITE_URL}/digest`)}" style="display:inline-block;background:#c7272e;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:10px;line-height:18px;">See all headlines</a>
</td></tr>
<tr><td style="background:#f8f9fb;border-top:1px solid #d9e0eb;padding:18px 28px;font-size:13px;line-height:1.5;color:#52627b;">
Sent to ${escapeHtml(recipient)} because you turned on the email digest. We use this address for nothing else.<br>
<a href="${escapeHtml(`${SITE_URL}/settings`)}" style="display:inline-block;margin-top:8px;padding:6px 0;color:#c7272e;font-weight:700;">Turn off email digest</a>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
  return { subject, html };
}
