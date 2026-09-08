// Template only — no implementation yet.
// TODO(LR2): structured, append-only access-log writer backing middleware.ts
//   — timestamp (UTC), source IP, route/method, status, bytes,
//   user_id/session_id, user-agent; >=90-day retention; no delete
//   permission on the log store; periodic hashes or object-lock for
//   tamper-evidence (rule.md CCA §26).

export {};
