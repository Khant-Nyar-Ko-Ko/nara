// Template only — no implementation yet.
// TODO(F3): send the digest by email when the reader isn't active in Chrome.
// TODO(LR1): email address may be used only for this stated purpose — never
//   marketing/other use without separate opt-in consent.
// TODO(LR3): only dispatch to a verified identity (email verified at
//   sign-up) — never from an unverified/anonymous session.
// TODO(LR4): F3 requires the reader to have completed the recorded-consent
//   flow (user_id, document_version_hash, timestamp, IP, exact button text)
//   before this route may fire for them.
// TODO(LR2): log this HTTP entry point per rule.md CCA §26.

export async function POST() {
  return Response.json({ error: "not implemented" }, { status: 501 });
}
