# Issue log — bugs, fixes and retests

Severity uses the Test Plan's Nielsen scale: 0 not a problem · 1 cosmetic · 2 minor · 3 major · 4 catastrophe. Bug severities were rated when this log was compiled (17 Nov 2026) from what each bug did; UX issues use the moderator's rating from the session. "Fix" links the commit on `main`. "Retest" says how the fix was checked; where no retest was recorded at the time, it says so.

## Bugs (10 found, 10 fixed, 0 open)

| ID | Found | Bug | Sev | Fix | Retest |
|---|---|---|---|---|---|
| B01 | 26 Sep | Supabase's public API could read the app tables (users, contacts, consent) — Row Level Security was off | 4 | [4a784b6](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/4a784b6) enable RLS | Not recorded at the time |
| B02 | 26 Sep | Email fallback was on by default in the popup — email sent without opt-in (LR4) | 3 | [73e4a23](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/73e4a23) opt-in by default; mock headlines dev-only | Not recorded at the time; on 17 Nov all 4 UAT participants turned email on themselves through the consent step (T3) |
| B03 | 26 Sep | Crawler kept state in a local file, so URLs and categories were not stored and duplicates came back | 2 | [321b1b8](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/321b1b8) store url + category, dedupe against the DB | `crawler/src/dedupe.ts` + `supabaseNews.ts filterUnseenPosts`; later runs skip saved URLs |
| B04 | 6 Oct | Crawl scheduler did not run as intended | 2 | [033ecb1](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/033ecb1) | Scheduled runs appear in Actions from 3 Nov ([nfr-results.md](nfr-results.md)) |
| B05 | 6 Oct | Crawler kept only the first new post per source | 2 | [9d7c0ee](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/9d7c0ee) keep every new post | Runs on 17 Nov saved 3 posts per source ([data/headlines-after.csv](data/headlines-after.csv)) |
| B06 | 12 Nov | Apify rejected the crawler's token; 13 runs saved nothing but GitHub showed "success" | 3 | New token in the `nara-keys` environment (no code change) + [cb13ad4](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/cb13ad4) a failed source now turns the run red | Runs 44029305608–44029731786 on 17 Nov saved posts from all 5 sources |
| B07 | 17 Nov | Bangkok Post was refused: 5 Apify runs × 4 GB went over the 16 GB free cap | 3 | [cb13ad4](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/cb13ad4) 1 GB per run | Same runs: Bangkok Post posts saved |
| B08 | 16 Nov | Popup showed "50h ago" instead of days for old headlines | 1 | [886cf7d](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/886cf7d) days after 24 h | Not recorded at the time (same rule also in `web/app/live-headlines.ts`) |
| B09 | 17 Nov | Groq rate limit (HTTP 429) dropped 7 of 15 posts when all were sent at once with the new Thai-length retry | 3 | [7d928ef](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/7d928ef) one post at a time, wait out 429s | Unit test "waits and retries when Groq rate-limits"; next run 44029557889: 0 rate-limit failures |
| B10 | 17 Nov | A category outside the list ("Technology") made Groq reject the answer, so that post failed on every run | 2 | [74902a4](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/74902a4) unknown category → Other | Unit test "maps an unknown category to Other"; run 44029731786 saved the post |

Sources: `git log`, GitHub Actions run logs (`gh run view <id> --log`).

## UX issues from user testing (round 1)

| ID | Seen in | Issue | Sev (moderator) | Status |
|---|---|---|---|---|
| UX-1 | U02, U03, U04, U07 (interview) | No English/Burmese toggle in the popup; non-native readers could not read the Thai headlines easily (U07: "couldn't read the Thai headlines, wanted English") and used Chrome translate | 1 | Open — next feature; the crawler already stores EN, TH and Burmese headlines |
| UX-2 | U03 | Popup font is small for older eyes; browser zoom does not enlarge the popup | 1 | Open |
| UX-3 | U02 | Paused ~8 s in T2 looking for a language switch | 1 | Open (same fix as UX-1) |
| UX-4 | U06 | Got stuck on "Installation" (loading the extension) — no detail recorded | 2 (team rating; no moderator note) | Open — README and Web Store listing give the install steps; needs a check of where it went wrong |
| UX-5 | U08 | Wants a search bar in topic selection; asks for clearer instructions | 1 (team rating) | Open |
| UX-6 | U08 | T2 failed with NaraNews; T1 took as long as the old way (64.3 s vs 64.2 s, 3 tabs) | 2 (team rating) | Open — no moderator note on why; to review with the session recording |
| UX-7 | U08 | Digest email arrived after 818.5 s (target ≤ 180 s); other 6 users 15–142 s | 2 (team rating) | Open — cause not yet known (possible causes: the 10-minute send cooldown after an earlier test email, or mail delay); check `access_log` for the 429/200 rows of that session |

No severity 3–4 UX issue was seen (moderator ratings for U02–U05; team ratings for U06–U08, which have no moderator notes), so the Test Plan's round-2 entry rule ("every severity 3–4 issue fixed and retested") had nothing to fix.

## Quality targets that failed and were fixed

| NFR | Was | Fix | Now | Evidence |
|---|---|---|---|---|
| Summary length: one line in the popup | 6 of 50 Thai headlines fit one line | [957e0fb](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/957e0fb) Groq asked for ≤ 40 Thai characters, one retry over 45 | 16 of 16 new headlines fit one line | [nfr-results.md](nfr-results.md) |
| Digest freshness: ≤ 3 h between crawls | average 7.7 h (41 runs, 3–16 Nov) | [a0857e7](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/a0857e7) Supabase pg_cron timer every 2 h, 07:00–21:00 | being measured from 17 Nov | [nfr-results.md](nfr-results.md) |
