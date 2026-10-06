// Gmail SMTP client shared by the F3 digest and the sign-in code email.
// Sends as SMTP_USER via a Google App Password — no custom domain needed.

import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function smtpUser(): string {
  const user = process.env.SMTP_USER;
  if (!user || !process.env.SMTP_APP_PASSWORD) throw new Error("SMTP_USER / SMTP_APP_PASSWORD not set");
  return user;
}

function getTransporter(): Transporter {
  transporter ??= nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: smtpUser(), pass: process.env.SMTP_APP_PASSWORD },
  });
  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const from = { name: "NaraNews", address: smtpUser() };
  try {
    await getTransporter().sendMail({ from, to, subject, html });
  } catch (err) {
    // Never include the recipient or message in the error (rule.md: no personal data in logs).
    const code = err && typeof err === "object" && "code" in err ? String(err.code) : "unknown";
    throw new Error(`SMTP dispatch failed: ${code}`);
  }
}

export function escapeHtml(input: string): string {
  const escapes: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return input.replace(/[&<>"']/g, (c) => escapes[c]);
}
