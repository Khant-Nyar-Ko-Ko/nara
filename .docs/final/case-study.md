# NaraNews — Case Study

**Live:** https://nara-news.vercel.app · **Repo:** https://github.com/Khant-Nyar-Ko-Ko/nara · 1305493 SE Case Studies, 1/2569, ADT MFU
**Team:** Khant Nyar Ko Ko (Tech Lead) · La Yaung Chit (QA) · Lin Htet Aung (Product Owner) · Thaung Than Han (AI Lead) · Moe Mya Myintzu (Designer)

## 1. Problem

News readers in Thailand follow the news by visiting several news websites one after another. The news is scattered, readers fall behind, and full articles take more time than they want to spend.

Evidence:
- **Real-user survey, 7 readers in Thailand** ([survey-results.md](../01-requirements/survey-results.md)): 6 of 7 sometimes miss important news (P1); 4 of 7 check 2 or more sites and all 7 rate the annoyance 3/5 or higher (P2); 4 of 7 read news only 5–15 minutes a day and 4 of 7 would use a one-line-summary extension (P3).
- **SECONDARY evidence** ([path-b-user-research.md](../01-requirements/research/path-b-user-research.md)): 5 Pantip threads (2015–2022) and 8 Google Play reviews with links, dates and screenshots — e.g. a poster "too lazy to visit every news outlet's website". It shows the pain is long-standing and common; it does not show how many readers have it.
- No one-to-one problem interviews were held (see [interview-log.md](../01-requirements/interviews/interview-log.md)).

**Users:** Thai news readers living in Thailand who use Chrome, including MFU-area students.

## 2. Process

| Phase | What we did | Output |
|---|---|---|
| DISCOVER (W1–W5) | Survey, Pantip/app-review research, pains P1–P4, requirements as user stories with MoSCoW, legal requirements from Thai law | [proposal](../00-proposal.md), [spec](../01-requirements/01-spec/20260902-01-news-digest.md), [backlog](../01-requirements/backlog.md) (MUST: F1, F2, F3 + LR1–LR4), [rule.md](../../rule.md) |
| DESIGN | Design system, 3-screen prototype, 6 diagrams checked against the spec by an AI checker agent | [design-system.md](../02-design/design-system.md), [prototype/](../02-design/prototype/), [diagrams D1–D6](../02-design/diagrams/README.md) |
| BUILD | Chrome extension (MV3), Next.js REST API on Vercel, Supabase Postgres (Seoul), crawler (Apify → Groq) on GitHub Actions, Gmail SMTP; compliance built in: hash-chained access log (CCA §26), verified email sign-in, recorded consent (ETA), purpose-limited email (PDPA) | [README.md](../../README.md), source in `extension/`, `web/`, `crawler/` |
| TEST | Test Plan; QA-defined NFR targets; unit tests in CI; UAT with 4 real users (tasks T1–T5, SUS, UTAUT2, interview) | [test-plan.pdf](../04-test/test-plan.pdf), [uat-results.md](../04-test/uat-results.md), [nfr-results.md](../04-test/nfr-results.md), [issue-log.md](../04-test/issue-log.md) |
| DELIVER | Published on the Chrome Web Store and Vercel; fixed the two failed NFRs before the final | this folder |

## 3. Outcome

- **Faster catch-up:** finding the 3 biggest stories took 18 s with NaraNews vs 48.8 s on the usual sites (−63%); opening the full article 26 s vs 60.5 s (−57%). Both beat the 30% target. All 4 users completed T1–T4 without help.
- **Usable and wanted:** SUS 86.9 (target 68); UTAUT2 performance 4.50 and intention 4.25 met the 4.0 target; ease of use 3.92 just missed it.
- **Quality:** popup opens in 1.78 s (< 2 s); Thai headlines now fit one popup line 16 of 16 (was 6 of 50) after we changed the AI prompt; crawls were moved from GitHub's unreliable scheduler to a database timer (was 7.7 h between crawls on average; re-measuring, target ≤ 3 h); 10 bugs found and fixed, 0 open.
- **Compliance:** every API request logged in a tamper-evident chain kept ≥ 90 days; email digest only after verified sign-in and recorded consent; email used for nothing else.

Full numbers with sources: [comparison-table.md](comparison-table.md). AI details: [ai-logic.md](ai-logic.md).

## 4. Limits and next steps

- 4 real users in one round (plan: 12 in two rounds); all read news mainly in English. Next: a second round with mainly-Thai readers.
- 3 of 4 users asked for an English/Burmese toggle — the headlines already exist in all 3 languages; the toggle is the next feature.
- Headline accuracy is not yet measured on a labelled sample ([ai-logic.md](ai-logic.md) limits).
- Pre-launch gaps: users cannot yet export or delete their own data; the log-retention job exists but is not scheduled; the extension's consent text does not yet name Supabase (Seoul) and Gmail (the website's notice does).
