// Template only — no implementation yet.
// TODO(LR2): every HTTP entry point must log timestamp (UTC), source IP,
//   route/method, status code, bytes, user_id/session_id (if authenticated),
//   and user-agent, retained >=90 days, append-only (no delete permission
//   on the log store), tamper-evident (rule.md CCA §26).

export function middleware() {
  // no-op — see TODO above
}

export const config = {
  matcher: "/api/:path*",
};
