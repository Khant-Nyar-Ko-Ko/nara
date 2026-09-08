// Template only — no implementation yet.
// TODO(F5, Should — not part of the Must-only core workflow): signal the
//   extension's background service worker to fire a Chrome system
//   notification when the reader has Chrome open but idle.
// TODO(LR5): only for readers whose stored delivery-channel preference is
//   "notification" — that preference field has its own purpose-limitation
//   requirement (LR5), separate from LR1's email-address rule.
// TODO(LR2): log this HTTP entry point per rule.md CCA §26.

export async function POST() {
  return Response.json({ error: "not implemented" }, { status: 501 });
}
