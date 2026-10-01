// F3 sign-in step 1: email a 6-digit code. Same response whether or not an
// account exists, so this can't be used to discover who has signed up.

import type { NextRequest } from "next/server";
import { requestIp, withAccessLog } from "@/lib/logging";
import { isRateLimited, issueCode, normalizeEmail } from "@/lib/emailCode";
import { sendEmail } from "@/lib/email";

export const POST = withAccessLog(async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = normalizeEmail(body?.email);
  if (!email) {
    return Response.json({ error: "a valid email is required" }, { status: 400 });
  }

  if (await isRateLimited(email, requestIp(req))) {
    return Response.json({ error: "too many requests, try again in 15 minutes" }, { status: 429 });
  }

  const code = await issueCode(email);
  try {
    await sendEmail(
      email,
      `Your NaraNews sign-in code: ${code}`,
      `<p>Your NaraNews sign-in code is <strong>${code}</strong>.</p>` +
        `<p>It expires in 10 minutes. If you didn't ask for it, ignore this email.</p>`,
    );
  } catch (err) {
    console.error("sign-in code email failed", err instanceof Error ? err.message : err);
    return Response.json({ error: "couldn't send the code" }, { status: 502 });
  }

  return Response.json({ ok: true });
});
