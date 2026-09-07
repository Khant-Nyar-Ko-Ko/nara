# NaraNews — User Journey (W5 Design Draft)

Three journeys for the same reader, branching on Chrome state. All start from the same backend fetch cycle (F1)
and share the same summarized digest content (F2); only the delivery channel differs.

## Journey A — Reader is actively using Chrome

```mermaid
flowchart TD
    A[Reader opens Chrome, browsing as usual] --> B[Backend has fetched + summarized\nnew headlines - F1]
    B --> C[Extension icon shows an unread digest]
    C --> D[Reader clicks the NaraNews icon]
    D --> E[Popup shows scrollable one-line\nheadline list - F2]
    E --> F{Headline looks\nrelevant?}
    F -->|Yes| G[Click headline -> jumps to\nfull source article]
    F -->|No, keep scanning| E
```

## Journey B — Reader is not currently in Chrome

```mermaid
flowchart TD
    A2[Backend has fetched + summarized\nnew headlines - F1] --> B2{Is the reader\nactive in Chrome?}
    B2 -->|No| C2[Digest dispatched by email - F3]
    C2 --> D2[LR3: dispatch only to a\nverified identity]
    D2 --> E2[Reader opens email later]
    E2 --> F2[Reader clicks a headline in\nthe email -> jumps to source article]
```

## Journey C — Reader has Chrome open but is idle [F5, Should]

```mermaid
flowchart TD
    A3[Backend has fetched + summarized\nnew headlines - F1] --> B3{Reader active\nin Chrome?}
    B3 -->|Open, idle - no interaction\nfor N min| C3[Chrome system notification\nfired - F5]
    C3 --> D3[LR5: only if reader has set\na notification preference on file]
    D3 --> E3[Reader clicks notification]
    E3 --> F3[Popup opens directly to that\nheadline -> jumps to source article]
```

## Notes
- All three journeys converge at "click headline -> source article" — the actual reading experience is identical,
  only the notice mechanism differs.
- LR1/LR4 (purpose-limited use + recorded consent for the email address) gate whether Journey B is even reachable
  for a given reader: no verified, consented email on file → that reader can only ever experience Journey A (and,
  once built, Journey C).
- Journey C is sourced to survey data (P4: 3/7 want Chrome notification when idle, 3/7 want email, 1/7 want
  neither) — see [00-proposal.md](../00-proposal.md). It's Should, not Must, and survey-supported rather than
  interview-validated — treat this journey as provisional until the required live interviews confirm it.
