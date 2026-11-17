# Role statement — Khant Nyar Ko Ko (6631503061), Tech Lead

> **DRAFT — prepared with Claude Code from the repo on 17 Nov 2026. Khant to review and edit into their own words before 08:00, 18 Nov.**

I was the Tech Lead and owned the system's code path from the browser to the database. I built the Chrome extension's background worker and options page, the Next.js REST API, and the Supabase schema, and I designed the compliance layer from rule.md into the code: the SHA-256 hash-chained access log kept at least 90 days (CCA §26), sign-in by emailed code so every session maps to a verified email, and the consent record with notice hash, time, IP and exact button text (ETA). I was the Test Plan's test lead for backend tests, added CI that typechecks and tests every pull request, and in the last week fixed the crawler's silent failures, made Thai headlines fit one popup line, moved crawls to a database timer, and redesigned the digest email.

Evidence: [web/lib/logging.ts](../../../web/lib/logging.ts), [web/lib/auth.ts](../../../web/lib/auth.ts), [web/lib/emailCode.ts](../../../web/lib/emailCode.ts), [ci.yml](../../../.github/workflows/ci.yml), [crawler timer](../../../crawler/sql/002_crawl_timer.sql), PRs #25–#27, [issue-log.md](../../04-test/issue-log.md).

**AI disclosure:** I used Claude Code throughout BUILD and TEST for code, tests, SQL, documentation and slide text. I reviewed every change, ran the tests and checked results against real data before committing; AI-assisted commits carry a `Co-Authored-By: Claude` line and are logged in `.docs/05-log/`.
