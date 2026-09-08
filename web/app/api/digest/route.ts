// Template only — no implementation yet.
// TODO(F2): serve the current one-line-summarized digest to the extension
//   popup (GET) — this is what extension/src/lib/api.ts calls.
// TODO(LR2): log this HTTP entry point per rule.md CCA §26 (see headlines/route.ts note).

export async function GET() {
  return Response.json({ error: "not implemented" }, { status: 501 });
}
