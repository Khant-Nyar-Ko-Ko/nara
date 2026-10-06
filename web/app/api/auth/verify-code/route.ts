// F3 sign-in step 2: check the code, create or sign in the user with a
// verified email (LR3), and return a session token for the extension.

import { NextResponse, type NextRequest } from "next/server";
import { WEB_SESSION_COOKIE, webSessionCookieOptions } from "@/lib/web-session";
import { withAccessLog } from "@/lib/logging";
import { normalizeEmail, verifyCodeAndSignIn } from "@/lib/emailCode";
import { createSessionToken } from "@/lib/auth";

export const POST = withAccessLog(async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { email?: unknown; code?: unknown; webSession?: unknown } | null;
  if (body?.webSession === true && req.headers.get("origin") !== req.nextUrl.origin) {
    return Response.json({ error: "same-origin request required" }, { status: 403 });
  }
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
  if (body?.webSession === true) {
    const response = NextResponse.json({ email, expiresAt }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(WEB_SESSION_COOKIE, token, { ...webSessionCookieOptions, expires: new Date(expiresAt) });
    return response;
  }
  return Response.json({ token, expiresAt, email }, { headers: { "Cache-Control": "no-store" } });
});
