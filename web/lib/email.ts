// Resend client shared by the F3 digest and the sign-in code email.

const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
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

export function escapeHtml(input: string): string {
  const escapes: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return input.replace(/[&<>"']/g, (c) => escapes[c]);
}
