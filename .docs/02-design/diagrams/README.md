# NaraNews — Design Diagrams (D1–D4)

Four views of the same product, month-2 scope only (F1, F2, F3 + LR1–LR4; F4/F5/LR5 cut — see [feature-list.md](../feature-list.md)).
Tools: **Mermaid** for D1, D3 and D4 (source is in the `.md`) and **PlantUML** for D2 (the `.puml` is the source and the `.png` is rendered from it). Attach the source files in the appendix. Each diagram has its own legend.

| # | Diagram | Source | Image | Must show → where |
|---|---------|--------|-------|-------------------|
| D1 | System Context | [D1-system-context.md](D1-system-context.md) (Mermaid) | renders in the .md | NaraNews as one box · one box + 3 actors (Thai news reader, Thai news websites, Email service) + stored data (Supabase, dashed) · in/out scope listed under the diagram |
| D2 | Use Case | [D2-use-case.puml](D2-use-case.puml) (notes in [D2-use-case.md](D2-use-case.md)) | [png](D2-use-case.png) | 3 actors (Thai news reader, Email service, Thai news websites), each linked to its use cases · 7 use cases · core ★ at the top · 2 «include» (sign-in, consent) + 1 «extend» (open article) |
| D3 | Architecture | [D3-architecture.md](D3-architecture.md) (Mermaid) | renders in the .md | 3 layers (client · server · database) + outside services · arrows = who calls whom · `access_log` + `consent_log` shown (rule.md) |
| D4 | Activity | [D4-activity.md](D4-activity.md) (Mermaid) | renders in the .md | One scenario = [user-journey.md](../user-journey.md) in the same order · ● start → actions → ◆ decision [yes]/[no — away] → ◆ merge → ◉ end |

## Tech stack (what D3 must match)

Taken from the code on branch `knkk`, 2026-10-01.

| Layer | Technology | Where |
|-------|-----------|-------|
| Client | Chrome extension, Manifest V3, Vite + React. Popup, Options page, service worker (`chrome.alarms` polls every 15 min, `chrome.idle` triggers the email) | `extension/` |
| Backend | Next.js API routes: `/api/digest`, `/api/auth/request-code`, `/api/auth/verify-code`, `/api/consent`, `/api/dispatch/email`; every route is wrapped by the access log (LR2) | `web/` |
| Ingestion | Crawler on GitHub Actions every 3 h. Apify `facebook-posts-scraper` reads Thai outlets' Facebook pages (Bangkok Post, Khaosod English), and Groq writes the one-line headline + category | `crawler/` |
| Data | Supabase Postgres, Seoul (ap-northeast-2), temporary. Tables: `news`, `users`, `user_contacts`, `email_codes`, `consent_log`, `access_log` | `web/sql/`, `crawler/sql/` |
| Email | Resend, used for the sign-in code (LR3) and the digest (F3) | `web/lib/email.ts` |

## Checks against the rubric
- **D1:** NaraNews is named, it has 3 external actors (at least 2 required) using the spec's names, the system is a single box, and in/out of scope is drawn.
- **D2:** every actor is linked to its use cases. The core use case is first and highlighted. Each «include» or «extend» comes from real code behavior (see D2-use-case.md).
- **D3:** labels and arrows come from the code above; nothing is invented.
- **D4:** uses UML activity nodes (● start, ◆ decision with [guards], ◆ merge, ◉ end; no "Start"/"End" boxes). Steps follow user-journey.md and match F2/F3.
