# D5 — Sequence: email digest when the reader is away (F3, LR1–LR4)

Drawn from the code as built on `main` (17 Nov 2026): `extension/src/background/index.ts`, `web/app/api/dispatch/email/route.ts`, `web/lib/logging.ts`, `web/lib/digestEmail.ts`, `web/lib/email.ts`. Before this, the reader has signed in with an emailed code (LR3) and turned on the email digest on the Settings page (LR4 consent recorded).

```mermaid
sequenceDiagram
    autonumber
    actor Reader
    participant Chrome as Chrome (idle API)
    participant BG as Extension<br/>background worker
    participant API as REST API<br/>POST /api/dispatch/email
    participant DB as Supabase Postgres<br/>(Seoul)
    participant Gmail as Gmail SMTP
    participant Phone as Reader's inbox (phone)

    Reader->>Chrome: Leaves the computer / locks the screen
    Chrome->>BG: onStateChanged("idle" after 60 s, or "locked")
    BG->>BG: readSession() — no session? stop
    BG->>API: POST with Bearer session token
    API->>API: resolveSession(token) — invalid/expired → 401
    API->>DB: Digest sent in the last 10 min? (access_log)
    alt sent recently
        API-->>BG: 429 cooldown
    else not sent recently
        API->>DB: Email verified? (user_contacts) — no → 403
        API->>DB: Email consent granted? (consent_log, latest row) — no → 403
        API->>DB: Read recipient email + latest Thai headlines (news)
        API->>API: digestEmail(): 10 headlines, "See all" button,<br/>footer with "Turn off email digest" (LR1/LR4)
        API->>Gmail: sendMail(to = reader's own address only)
        Gmail-->>Phone: "Today's Thai news: N headlines"
        API-->>BG: 200 { ok: true }
    end
    API->>DB: withAccessLog: append 1 hash-chained access_log row<br/>(ts, IP, route, status, bytes, user id — no content) (LR2)
    Reader->>Phone: Opens the email, taps a headline → source article
```

**Legend.** Solid arrow = call; dashed arrow = response. `alt` = the cooldown branch. Every request — success or error — writes exactly one `access_log` row (rule.md CCA §26). The API only ever emails the caller's own verified address; there is no admin or bulk send.
