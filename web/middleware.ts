// Tags each API request with a correlation id, for matching this app's
// access_log rows (lib/logging.ts) with any CDN/proxy logs in front of it.
// The access_log write itself happens in withAccessLog, not here — Next.js
// middleware never sees a route handler's final response/status.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const headers = new Headers(req.headers);
  headers.set("x-nara-request-id", requestId);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: "/api/:path*",
};
