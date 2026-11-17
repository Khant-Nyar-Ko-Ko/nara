# Non-functional requirements — targets and measurements

The DISCOVER spec set no numeric NFRs, so QA set measurable targets in BUILD (slide 8) and measured each one. Every number below links to its data or method.

| NFR (BUILD target) | Target | Measured | Result | Evidence |
|---|---|---|---|---|
| Popup opens with the digest | < 2 s | 1.78 s (timed by the team in Chrome, 17 Nov 2026). API alone: median 1.18 s over 5 requests | **Pass** | [API timings](#api-response-time) |
| Summary length (Thai headline fits one popup line) | one line; pass mark ≥ 90% of headlines | Before fix: 6 of 50. After fix: **16 of 16** | **Pass** (after fix) | [Summary length](#summary-length) |
| Digest freshness (time between crawls, 07:00–21:00) | ≤ 3 h | Before fix: average 7.7 h, 0 of 40 gaps ≤ 3 h. After fix (17 Nov): **4 of 4 gaps ≤ 3 h**, average 1.86 h, longest 2.00 h | **Pass** (after fix) | [Freshness](#digest-freshness) |
| Auth: expired / forged / malformed token rejected | always | 4 of 4 unit tests pass (`web/tests/auth.test.ts`, run by CI on every PR) | **Pass** | `npm test --workspace web` |

## API response time

`GET /api/headlines` on the live site, 5 requests with `curl -w %{time_total}`, 17 Nov 2026: 0.57, 1.01, 1.18, 1.18, 3.08 s → median **1.18 s**.

## Summary length

Method: [scripts/measure-headline-lines.html](scripts/measure-headline-lines.html) renders each Thai headline at the popup's text width (328 px) in the popup's headline font (700 15px/1.2 Arial, from `extension/src/popup/Popup.css`) and counts the lines.

| | Data | Fit one line | 2 lines | 3 lines | Characters |
|---|---|---|---|---|---|
| Before (50 live headlines, 17 Nov, from `/api/digest`) | [data/headlines-before.csv](data/headlines-before.csv) | **6 (12%)** | 42 | 2 | fit: 36–47; wrap: 49–110 |
| After (every headline saved by 3 crawl runs after commit 957e0fb) | [data/headlines-after.csv](data/headlines-after.csv) | **16 (100%)** | 0 | 0 | 15–38 |

Fix: `crawler/src/groqHeadlines.ts` asks Groq for a Thai headline of at most 40 characters; if one is over 45 it retries once and keeps the shorter answer. The pass mark (≥ 90%) was set before re-measuring. Limits: 16 headlines from one afternoon; shorter headlines carry less detail.

## Digest freshness

Method: [scripts/crawl-gaps.py](scripts/crawl-gaps.py) reads the GitHub Actions history of `crawl.yml` and prints the hours between successful runs.

**Before** (GitHub's own `schedule:` trigger, 3–16 Nov 2026, [data/crawl-runs-2026-11-03_16.csv](data/crawl-runs-2026-11-03_16.csv)):
- 41 scheduled runs; average gap **7.67 h**; longest 11.03 h; 0 of 40 gaps at 3 h or less. GitHub skipped about 2 of every 3 scheduled runs and started the rest late.
- 13 of the 41 runs (12–16 Nov) showed "success" while Apify rejected the token and nothing was saved (issue B06).

**Fix** (17 Nov): `crawler/sql/002_crawl_timer.sql` — a Supabase `pg_cron` job calls GitHub's `workflow_dispatch` API every 2 h, 07:00–21:00 Thailand time; `crawl.yml` no longer uses GitHub's scheduler. Each trigger is logged to the hash-chained `access_log` (rule.md CCA §26).

**After** (from 17 Nov, re-run `python3 .docs/04-test/scripts/crawl-gaps.py 2026-11-17T06:30:00Z`):

| Run started (Thai time) | Started by | Gap since previous success |
|---|---|---|
| Tue 17 Nov 13:33 | timer (manual test of the SQL) | — |
| Tue 17 Nov 15:00 | timer (scheduled) | 1.45 h |
| Tue 17 Nov 17:00 | timer (scheduled) | 2.00 h |
| Tue 17 Nov 19:00 | timer (scheduled) | 2.00 h |
| Tue 17 Nov 21:00 | timer (scheduled) | 2.00 h |

Result (measured 21:55, 17 Nov): **4 of 4 gaps at 3 h or less**; average 1.86 h; longest 2.00 h; every run succeeded and started on the minute. Night hours (21:00–07:00) are excluded on purpose: there are no night runs (team decision, 16 Nov). Limits: one evening; tomorrow morning's 07:00 and 09:00 runs can be added with the same command.

## Chrome Web Store installs

[data/store-installs-2026-11-03_14.csv](data/store-installs-2026-11-03_14.csv) (developer dashboard export, 3–14 Nov 2026): 302 installs in total. 272 (90%) came from Romania — exactly 24 a day for 11 days, OS "Other", no browser language — and are excluded as not real users. Installs with a browser language, all in Thailand: **6**.
