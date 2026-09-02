---
name: audit-backlog
description: >
  Audit .docs/01-requirements/backlog.md against the spec files in
  .docs/01-requirements/01-spec/ for missing Must-priority requirements,
  orphaned backlog rows, and duplicate/near-duplicate items. Use when asked
  to "audit the backlog", "check backlog traceability", "find
  missing/orphaned requirements", "is the backlog in sync with the specs",
  or before closing out a requirements review.
---

This skill is the user-facing entry point for a backlog audit. It does not
do the audit itself — it hands the work to the `backlog-auditor` subagent
(`.claude/agents/backlog-auditor.md`), which holds the full read-only audit
logic (missing/orphaned/duplicate checks, the report format, and the daily
log line).

## What to do

1. Invoke the `backlog-auditor` agent (via the Agent tool) with whatever
   scope the user asked for (a full audit, or a narrower check they
   specified).
2. Relay the agent's report back to the user as-is — the three finding
   lists (Missing / Orphaned / Duplicate-needs-review), or "none found" —
   plus any duplicate-check questions it resolved via `AskUserQuestion` and
   the log line it appended.
3. Do not edit any file under `.docs/01-requirements/` yourself, and do not
   duplicate the audit logic here — if `backlog-auditor.md` is missing or
   its logic looks out of date, say so rather than reimplementing the
   checks inline.
