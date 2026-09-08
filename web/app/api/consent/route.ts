// Template only — no implementation yet.
// TODO(LR4): record consent when the reader clicks "I agree" to enable F3 —
//   store user_id, authenticated session, document_version_hash, timestamp,
//   IP, and the exact button text. A bare `accepted=true` is not enough.
// TODO(LR2): log this HTTP entry point per rule.md CCA §26.

export async function POST() {
  return Response.json({ error: "not implemented" }, { status: 501 });
}
