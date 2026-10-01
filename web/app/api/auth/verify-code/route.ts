// F3 sign-in step 2: check the code, create or sign in the user with a
// verified email (LR3), and return a session token for the extension.

import type { NextRequest } from "next/server";
import { withAccessLog } from "@/lib/logging";
import { normalizeEmail, verifyCodeAndSignIn } from "@/lib/emailCode";
import { createSessionToken } from "@/lib/auth";

export const POST = withAccessLog(async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { email?: unknown; code?: unknown } | null;
  const email = normalizeEmail(body?.email);
  const code = typeof body?.code === "string" ? body.code.trim() : null;
  if (!email || !code) {
    return Response.json({ error: "email and code are required" }, { status: 400 });
  }

  const userId = await verifyCodeAndSignIn(email, code);
  if (!userId) {
    return Response.json({ error: "invalid or expired code" }, { status: 401 });
  }

  const { token, expiresAt } = createSessionToken(userId);
  return Response.json({ token, expiresAt, email });
});
