# AI logic — Where, How, Prove, Measure

NaraNews uses AI in two places: **(1) inside the product**, Groq writes the one-line headlines; **(2) in how we built it**, Claude Code helped write specs, diagrams, code and tests under rules the team set.

## 1. WHERE

| AI | Where in the system | What it does | Code |
|---|---|---|---|
| **Groq**, model `openai/gpt-oss-20b` | Crawler, step 2 of the pipeline (Apify posts → **Groq** → Supabase `news`) | For each new Facebook post from 5 Thai outlets: one headline in English, one in Thai, one in Burmese, plus one topic category from a fixed list | [crawler/src/groqHeadlines.ts](../../crawler/src/groqHeadlines.ts) |
| **Claude Code** (Anthropic) | Development only, never at runtime | Drafted requirement specs and backlog, design diagrams, code, tests, the Test Plan and this documentation; every change reviewed by the team | [CLAUDE.md](../../CLAUDE.md), [.claude/agents/](../../.claude/agents/), [.claude/skills/](../../.claude/skills/), [.docs/05-log/](../05-log/) |

Data that reaches Groq: only the public text of a news outlet's Facebook post. No user data, account identifiers or tokens are ever sent to an AI service (rule.md: "strip account identifiers").

## 2. HOW (pipeline and controls)

1. **Input:** Apify `facebook-posts-scraper` returns the latest 3 posts per outlet (`crawler/src/sources.ts`). Posts are de-duplicated by normalised URL and skipped if the URL is already in the database (`dedupe.ts`, `supabaseNews.ts`).
2. **Prompt:** a fixed system + user prompt asks for "professional, natural, straightforward" headlines in EN/TH/Burmese, a category from `Politics, Economy, Bangkok, Weather, Society, Travel, Health, Sport, Other`, no commentary, and **a Thai headline of at most 40 characters** so it fits one popup line.
3. **Structured output:** Groq must return JSON matching a strict schema (`headline_en`, `headline_th`, `headline_mm`, `category`, all required, nothing else). Empty or missing fields throw and the post is skipped, not stored half-done.
4. **Validation after the model:**
   - Category: anything outside the list becomes `Other` (`categoryValue`).
   - Thai length: if the Thai headline is over 45 characters, Groq is asked once more, more strictly, and the shorter answer is kept.
   - Rate limits: posts are sent one at a time; on HTTP 429 the crawler waits the time Groq asks for (up to 3 times).
5. **Failure handling:** a post that still fails is logged and left out; it is retried on the next crawl because its URL was never saved. If a whole source fails, the GitHub Actions run turns red (`manualCrawl.ts`).
6. **Output:** rows in Supabase `news`, read by the popup, website and email digest.

## 3. PROVE (test set, baseline, eval script, logs)

| What we check | Test set | Baseline | Method / script | Evidence |
|---|---|---|---|---|
| Thai headline fits one popup line (F2, P3) | 50 live headlines before the fix; 16 headlines saved after it | 6 of 50 fit (12%) | Render each at the popup's real width and font, count lines — [measure-headline-lines.html](../04-test/scripts/measure-headline-lines.html) | [headlines-before.csv](../04-test/data/headlines-before.csv), [headlines-after.csv](../04-test/data/headlines-after.csv), [nfr-results.md](../04-test/nfr-results.md) |
| All 3 languages present | 50 live headlines | — | Count non-empty EN/TH/Burmese headlines from `GET /api/headlines` | 50 of 50 had all three, 17 Nov 15:18 — [headlines-languages-2026-11-17.csv](../04-test/data/headlines-languages-2026-11-17.csv) |
| Prompt + validation rules behave | 7 unit tests with a mocked Groq API (no real calls, synthetic data) | — | `npm test --workspace crawler` — [groqHeadlines.test.ts](../../crawler/tests/groqHeadlines.test.ts); also run by CI | short Thai kept, long Thai retried once, shorter kept, 429 waited, unknown category → Other |
| Pipeline failures | GitHub Actions run logs | 17 Nov run 1: 7 of 15 posts lost to HTTP 429, 1 post rejected every run (category) | `gh run view <id> --log` | Runs 44029305608 → 44029557889 → 44029731786: 0 rate-limit losses, the rejected post saved ([issue-log.md](../04-test/issue-log.md) B09, B10) |
| Real readers find the headlines useful | 8 real users (U02–U09) | old way: their usual news sites | Timed tasks T1/T2 + SUS + UTAUT2 | T1 −72% (p = 0.016), T2 −18% (missed 30% target), SUS 86.3, PE 4.50 ([uat-results.md](../04-test/uat-results.md)) |

**Claude Code (development) is proved by its records, not by a score:** every AI-assisted change is a line in [.docs/05-log/](../05-log/) and a git commit marked `Co-Authored-By: Claude`; three project agents (`requirement-writer`, `backlog-auditor`, `diagram-checker`) and two skills are in `.claude/`. The `diagram-checker` agent found 11 mismatches between the diagrams and the spec, fixed in 2 passes (log 2026-10-01).

## 4. MEASURE (results)

| Metric | Before | After | Evidence |
|---|---|---|---|
| Thai headlines on one popup line | 6 / 50 (12%) | 16 / 16 (100%) | nfr-results.md |
| Headlines with all 3 languages | — | 50 / 50 | live API, 17 Nov |
| Posts lost per crawl to AI errors (429 + schema) | 8 of 15 (first run after the length change: 7 × 429, 1 × category) | 1 of 9 after the 429 fix (category only); 0 of 1 after the category fix | Actions logs, issue-log.md |
| Reader time to find 3 top stories (T1) | 61.3 s | 17.4 s (−72%) | uat-results.md |

## Limits and what is NOT proved

- **Accuracy is not measured.** We have not checked, on a labelled sample, whether each headline is faithful to its post (no hallucinated facts) or whether the category is correct. Plan: sample 20 posts per week, two team members rate each headline correct / partly / wrong and the category right / wrong, report agreement. Until then, every headline links to the original post so readers can check.
- **Shorter Thai headlines carry less detail**, and some read vaguely (e.g. row 12 of headlines-after.csv). One small Thai spelling slip was seen in 16 (row 9, "แันดับ").
- **Bias:** sources are 5 large outlets chosen by the team; topics and viewpoints follow what those pages post. Category labels come from the model and are unchecked.
- **Language:** 7 of 8 test users read news mainly in English (1 in Burmese) and 4 asked for English/Burmese headlines; the English and Burmese headlines are generated and stored but not yet shown as a choice in the popup.
- **When the AI fails:** the post is skipped and retried next run; the user sees fewer new headlines, never a broken or empty one.
