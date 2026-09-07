# NaraNews — Feature List (W5 Design Draft)

Derived from [backlog.md](../01-requirements/backlog.md) / [01-spec/20260902-01-news-digest.md](../01-requirements/01-spec/20260902-01-news-digest.md).
Cupping-log track (former F5–F7) removed from scope 2026-09-06 — see [05-log/20260906-log.md](../05-log/20260906-log.md).

## In scope this phase (Must)

| ID | Feature | Traces to |
|----|---------|-----------|
| F1 | Aggregate headlines from multiple Thai news websites into one feed | P2 |
| F2 | One-line summary per headline, clickable + scrollable list, click jumps to source article | P3 |
| F3 | Email digest fallback when the user is not currently active in Chrome | P1 |

## In scope this phase (Should)

| ID | Feature | Traces to |
|----|---------|-----------|
| F5 | Chrome system notification delivery when Chrome is open but idle | P4 |

## Out of scope this phase (Won't)

| ID | Feature | Reason |
|----|---------|--------|
| F4 | Follow-up on specific breaking news the reader is tracking | Product owner: "future plan, optional" — not committed for DISCOVER phase |

## Legal/compliance features baked into the above (not separate UI features)

| ID | Requirement | Attaches to |
|----|-------------|-------------|
| LR1 | Purpose-limited use of email address | F3 |
| LR2 | ≥90-day traffic/access logging on backend | F1, F3, F5 |
| LR3 | Verified identity required before email dispatch | F3 |
| LR4 | Recorded consent (not a bare boolean) before enabling F3 | F3 |
| LR5 | Purpose-limited storage of delivery-channel preference | F5 |

## Resolved gap
CLAUDE.md's project description also names a "Chrome system notification" delivery state (Chrome open but idle),
sitting between the popup (F2) and email (F3) states. This is now F5 above — sourced to a 7-respondent survey
(P4: 3/7 want Chrome notification, 3/7 want email, 1/7 want neither when idle), Should priority, survey-supported
but not yet interview-validated. See [00-proposal.md](../00-proposal.md) and the spec's F5 note for detail.
