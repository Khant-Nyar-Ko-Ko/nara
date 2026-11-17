# UAT results — before / after and questionnaires (round 1, n = 8)

Data: [uat-sessions.md](uat-sessions.md) (U02–U09, all 17 Nov 2026). Targets: [Test Plan](test-plan.pdf) §5. Medians skip values that were not recorded. Paired tests are exact two-sided Wilcoxon signed-rank tests on each participant's before − after difference.

## Before / after for the MUST tasks

| Task (MUST) | Before: usual news sites (median) | After: NaraNews (median) | Change (medians) | Per participant | Target | Result |
|---|---|---|---|---|---|---|
| T1 find the 3 biggest stories today (F1, F2) | **61.3 s** (58.5, 64, 39, 37.5, 35.2, 67.4, 64.2, 80.5) | **17.4 s** (19, 29, 17, 4.6, 4.5, 2.9, 64.3, 17.8) | **−72%** | 7 of 8 faster; median change −34.0 s; Wilcoxon **p = 0.016** | ≥ 30% faster | **Pass** |
| T2 open the full article (F2) | **31.1 s** (74, 78, 47, 7.7, 15.2, 10, 1.8, 47.2) | **25.7 s** (28, 38, 24, 16.3, 4.4, 3.9, 27.3, 33.6) | **−18%** | 6 of 8 faster; median change −12.2 s; Wilcoxon p = 0.20 | ≥ 30% faster | **Miss** (faster, but below target) |
| T1 tabs opened | 7, 6, 3, 3, 3, 3, 3 (U03 not counted) | 1, 1, 0, 3, 1 (U03, U04, U06 not counted) | — | U08 opened 3 tabs with NaraNews | popup + ≤ 1 article tab | 4 of 5 counted met it |
| T3 set up email delivery (F3, LR3, LR4) | no equivalent | **72 s** (95, 115, 72, 10.8, 13, 85.2, 39.6; U05 not timed) | — | — | ≤ 120 s | **Pass** |
| T4 catch up on the phone (F3) | no equivalent | email arrived in **105 s** median (112, 98, 85, 142, 15, 15.1, 818.5, 139.3) | — | U08 waited 818.5 s | ≤ 180 s | **Pass** on the median; U08 missed |
| T5 turn off email (LR1) | no equivalent | 21, 5.7, 4.5, 9.5, 818.9, 8.6 s | — | — | — | 6 of 6 recorded succeeded |

**Why T2 misses:** several participants' "old way" T2 times were very short (7.7, 15.2, 10, 1.8 s) — on their usual site the article was one click away from where T1 ended. NaraNews is faster by median (−18%) and 6 of 8 people were faster, but that is below the 30% target and not significant (p = 0.20), so T2 is reported as a **miss**. T1 is the strongest result: 7 of 8 faster and significant at α = 0.05 (p = 0.016) even with n = 8.

## Task success and errors

| Task | Succeeded without help | Target |
|---|---|---|
| T1 (NaraNews) | 8 / 8 | ≥ 80% → **Pass** |
| T2 (NaraNews) | 7 / 8 (88%; U08 failed) | **Pass** |
| T3 | 8 / 8 | **Pass** |
| T4 | 8 / 8 | **Pass** |
| T5 | 6 / 6 recorded (not marked for U02, U03) | **Pass** on recorded |
| Errors per user, NaraNews T1–T5 | U02 1, U03 1, U04 0, U05 0, U06 0, U07 0, U08 1, U09 0 → median 0 | ≤ 1 → **Pass** |

## SUS (System Usability Scale)

| | U02 | U03 | U04 | U05 | U06 | U07 | U08 | U09 | Mean | SD | Target |
|---|---|---|---|---|---|---|---|---|---|---|---|
| SUS score | 85.0 | 75.0 | 90.0 | 97.5 | 92.5* | 87.5* | 62.5 | 100.0 | **86.3** | 12.3 | ≥ 68 → **Pass** (≥ 80.8 = grade A, Sauro & Lewis) |

\* U05, U06 and U07 had answers corrected after the participant (U06, U07) or the original answer sheet (U05) confirmed a mistake — see [uat-sessions.md](uat-sessions.md). As first recorded, U06 was 42.5 and U07 57.5, which would give a mean of 76.3 (still ≥ 68). U09 answered every item at the positive end (straight-line pattern), kept as recorded.

## UTAUT2 (mean of each person's 3-item average, 1–5)

| Construct | U02 | U03 | U04 | U05 | U06 | U07 | U08 | U09 | Mean | Target | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Performance expectancy (PE) | 3.33 | 4.67 | 5.00 | 5.00 | 4.67 | 4.00 | 4.33 | 5.00 | **4.50** | ≥ 4.0 | Pass |
| Effort expectancy (EE) | 2.33 | 4.00 | 4.33 | 5.00 | 5.00 | 4.33 | 5.00 | 5.00 | **4.38** | ≥ 4.0 | Pass |
| Social influence (SI) | 3.33 | 4.00 | 4.33 | 4.33 | 4.67 | 4.33 | 2.00 | 5.00 | 4.00 | reported only | — |
| Facilitating conditions (FC) | 3.67 | 4.33 | 4.67 | 5.00 | 4.67 | 4.67 | 3.67 | 5.00 | 4.46 | reported only | — |
| Hedonic motivation (HM) | 4.33 | 4.00 | 4.67 | 5.00 | 5.00 | 4.33 | 4.00 | 5.00 | 4.54 | reported only | — |
| Behavioural intention (BI) | 3.67 | 4.00 | 4.33 | 5.00 | 4.67 | 4.67 | 4.00 | 5.00 | **4.42** | ≥ 4.0 | Pass |

Lowest construct: **social influence** (4.00, reported only), pulled down by U08 (2.00) — matching U08's comment that NaraNews needs more marketing. Among the targeted constructs, effort expectancy is lowest (4.38) and links to the language issue seen in the tasks: 4 of 8 participants could not read the Thai headlines easily and asked for English (and Burmese) ([issue-log.md](issue-log.md) UX-1).

## Limits (stated honestly)

- **n = 8, one round.** The Test Plan aimed for 12 users in two rounds. T1's improvement is significant (p = 0.016); T2's is not.
- **Language:** 7 of 8 read news mainly in English and 1 in Burmese; the Test Plan asked for at least 3 mainly-Thai readers. The headline language problem may be smaller for Thai readers.
- Some values were not recorded in the session (T5 success for U02/U03, T3/T4 times for U05, some tab counts). They are left blank, not filled in.
- Corrections after the session, each confirmed and dated in [uat-sessions.md](uat-sessions.md): U04 success marks (moderator), U05 SUS item 2 (original answer sheet), U06 and U07 SUS negative items (the participants), U07 T5 success (testers). U08's unusual times (~819 s, 1.8 s) were re-checked by the testers and kept as recorded.
- Test cases TC01–TC20 from the Test Plan §3 were not recorded as a results sheet in the repo; the automated checks that exist are the unit tests in `web/tests/` and `crawler/tests/`, run by CI on every PR (`.github/workflows/ci.yml`).
