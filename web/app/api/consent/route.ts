// LR4: record consent to enable F3 (email fallback) when the reader clicks
// "I agree" — not a bare `accepted=true`. Also carries LR1: the email
// address, if provided, is stored only for this stated purpose. Requires
// an authenticated session (rule.md CCA §26: no anonymous guest writes);
// this always 401s until a login flow exists to issue that session.
//
// Same endpoint handles withdrawal (`granted: false`) so it stays on the
// same screen as opt-in (rule.md PDPA).

import type { NextRequest } from "next/server";
import { withAccessLog, requestIp } from "@/lib/logging";
import { resolveSession, EMAIL_FALLBACK_CONSENT_PURPOSE } from "@/lib/auth";
import { query } from "@/lib/db";

interface ConsentBody {
  email: string | null;
  documentVersionHash: string;
  buttonText: string;
  granted: boolean;
}

function parseBody(body: unknown): ConsentBody | null {
  if (!body || typeof body !== "object") return null;
  const { email, documentVersionHash, buttonText, granted } = body as Record<string, unknown>;

  if (typeof documentVersionHash !== "string" || !documentVersionHash) return null;
  if (typeof buttonText !== "string" || !buttonText) return null;
  if (typeof granted !== "boolean") return null;
  if (granted && (typeof email !== "string" || !email)) return null;
  if (email !== undefined && email !== null && typeof email !== "string") return null;

  return { email: typeof email === "string" ? email : null, documentVersionHash, buttonText, granted };
}

export const POST = withAccessLog(async function POST(req: NextRequest) {
  const session = resolveSession(req);
  if (!session) {
    return Response.json({ error: "authentication required" }, { status: 401 });
  }

  const parsed = parseBody(await req.json().catch(() => null));
  if (!parsed) {
    return Response.json(
      { error: "documentVersionHash, buttonText, and granted are required; email is required when granted is true" },
      { status: 400 },
    );
  }

  await query(
    `INSERT INTO consent_log (user_id, purpose, document_version_hash, button_text, granted, ip)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [session.userId, EMAIL_FALLBACK_CONSENT_PURPOSE, parsed.documentVersionHash, parsed.buttonText, parsed.granted, requestIp(req)],
  );

  if (parsed.granted && parsed.email) {
    // Changing the email resets verification (LR3) — a new address hasn't
    // been verified yet, even if the old one was.
    await query(
      `INSERT INTO user_contacts (user_id, email)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE
       SET email = EXCLUDED.email,
           email_verified_at = CASE
             WHEN user_contacts.email IS NOT DISTINCT FROM EXCLUDED.email THEN user_contacts.email_verified_at
             ELSE NULL
           END`,
      [session.userId, parsed.email],
    );
  }

  return Response.json({ ok: true }, { status: 201 });
});
