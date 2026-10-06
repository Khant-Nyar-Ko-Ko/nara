import { NextResponse, type NextRequest } from "next/server";
import { resolveSession, hasActiveConsent, EMAIL_FALLBACK_CONSENT_PURPOSE } from "@/lib/auth";
import { query } from "@/lib/db";
import { withAccessLog } from "@/lib/logging";
import { WEB_SESSION_COOKIE, webSessionCookieOptions } from "@/lib/web-session";

export const dynamic = "force-dynamic";

export const GET = withAccessLog(async (req: NextRequest) => {
  const session = resolveSession(req);
  if (!session) return Response.json({ error: "Sign in to manage email delivery." }, { status: 401 });
  const [contact] = await query<{ email: string; email_verified_at: string | null }>(
    "SELECT email, email_verified_at FROM user_contacts WHERE user_id = $1", [session.userId],
  );
  if (!contact?.email_verified_at || !contact.email) {
    return Response.json({ error: "Please verify your email again." }, { status: 401 });
  }
  const granted = await hasActiveConsent(session.userId, EMAIL_FALLBACK_CONSENT_PURPOSE);
  return Response.json({ email: contact.email, granted }, { headers: { "Cache-Control": "no-store" } });
});

export const DELETE = withAccessLog(async (req: NextRequest) => {
  if (req.headers.get("origin") !== req.nextUrl.origin) {
    return Response.json({ error: "same-origin request required" }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(WEB_SESSION_COOKIE, "", { ...webSessionCookieOptions, maxAge: 0 });
  return response;
});
