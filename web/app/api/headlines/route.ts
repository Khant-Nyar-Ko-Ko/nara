// Template only — no implementation yet.
// TODO(F1): fetch headlines from multiple Thai news websites (see
//   lib/sources.ts), normalize, and hand off to lib/summarize.ts (F2).
// TODO(LR2): this is an HTTP entry point — must log timestamp (UTC), source
//   IP, route/method, status, bytes, user_id/session_id, user-agent, kept
//   >=90 days. See middleware.ts.

export async function GET() {
  return Response.json({ error: "not implemented" }, { status: 501 });
}
