# D6 — Entity-Relationship: the Supabase database

Drawn from the table definitions as built: `web/lib/db.ts` (app tables) and the crawler's `news` table (`crawler/src/supabaseNews.ts`, `crawler/sql/001_news_url_category.sql`). All tables live in one Supabase Postgres database in Seoul (ap-northeast-2). Row Level Security is on for the app tables (commit 4a784b6).

```mermaid
erDiagram
    users ||--o| user_contacts : "has (0..1)"
    users ||--o{ consent_log : "gives / withdraws"
    users |o--o{ access_log : "makes requests (user_id null if anonymous)"

    users {
        uuid id PK
        text delivery_channel "popup | notification | email"
        jsonb followed_sources
        timestamptz created_at
        timestamptz last_login_at
    }
    user_contacts {
        uuid user_id PK, FK
        text email "personal data — used only for codes + digest (LR1)"
        timestamptz email_verified_at "set when the emailed code is verified (LR3)"
    }
    consent_log {
        bigint id PK
        uuid user_id FK
        text purpose
        text document_version_hash "SHA-256 of the notice shown"
        text button_text "exact words clicked"
        boolean granted "withdrawal = new row, never an edit"
        text ip
        timestamptz ts
    }
    access_log {
        bigint id PK
        timestamptz ts
        text ip
        text route
        text method
        integer status
        integer bytes
        uuid user_id "nullable"
        text session_id
        text user_agent
        text prev_hash
        text hash "SHA-256 chain, tamper-evident (LR2)"
    }
    email_codes {
        bigint id PK
        text email
        text code_hash "HMAC, the code itself is never stored"
        timestamptz expires_at "10 min"
        integer attempts "max 5"
        timestamptz consumed_at
        timestamptz created_at
    }
    news {
        text source
        text category
        text headline_en
        text headline_th
        text headline_mm
        text content
        text url UK "dedupe key"
        timestamptz date
        timestamptz created_at
    }
```

**Notes.** `email_codes` is keyed by email, not by user, because a code is sent before the user exists. `news` has no link to users: everyone gets the same digest. `access_log` and `consent_log` are append-only (the app's database role has INSERT/SELECT only, `web/sql/001_app_role.sql`); `access_log` is kept ≥ 90 days. The `news` table was created in the Supabase dashboard, so only the columns the code reads or writes are shown; `url` is its unique key (`news_url_key`).
