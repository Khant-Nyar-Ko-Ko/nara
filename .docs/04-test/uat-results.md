# UAT results — before / after and questionnaires (round 1, n = 7)

Data: [uat-sessions.md](uat-sessions.md) (U02–U08, all 17 Nov 2026). Targets: [Test Plan](test-plan.pdf) §5. Medians skip values that were not recorded. Paired tests are exact two-sided Wilcoxon signed-rank tests on each participant's before − after difference.

## Before / after for the MUST tasks

| Task (MUST) | Before: usual news sites (median) | After: NaraNews (median) | Change (medians) | Per participant | Target | Result |
|---|---|---|---|---|---|---|
| T1 find the 3 biggest stories today (F1, F2) | **58.5 s** (58.5, 64, 39, 37.5, 35.2, 67.4, 64.2) | **17 s** (19, 29, 17, 4.6, 4.5, 2.9, 64.3) | **−71%** | 6 of 7 faster; median change −32.9 s; Wilcoxon **p = 0.031** | ≥ 30% faster | **Pass** |
| T2 open the full article (F2) | **15.2 s** (74, 78, 47, 7.7, 15.2, 10, 1.8) | **24 s** (28, 38, 24, 16.3, 4.4, 3.9, 27.3) | **+58% (slower)** | 5 of 7 faster; median change −10.8 s; Wilcoxon p = 0.30 | ≥ 30% faster | **Miss** |
| T1 tabs opened | 7, 6, 3, 3, 3, 3 (U03 not counted) | 1, 1, 0, 3 (U03, U04, U06 not counted) | — | U08 opened 3 tabs with NaraNews | popup + ≤ 1 article tab | 3 of 4 counted met it |
| T3 set up email delivery (F3, LR3, LR4) | no equivalent | **78.6 s** (95, 115, 72, 10.8, 13, 85.2; U05 not timed) | — | — | ≤ 120 s | **Pass** |
| T4 catch up on the phone (F3) | no equivalent | email arrived in **98 s** median (112, 98, 85, 142, 15, 15.1, 818.5) | — | U08 waited 818.5 s | ≤ 180 s | **Pass** on the median; U08 missed |
| T5 turn off email (LR1) | no equivalent | 21, 5.7, 4.5, 9.5, 818.9 s | — | — | — | 5 of 5 recorded succeeded |

**Why T2 flips:** the "old way" T2 times of the last four participants were very short (7.7, 15.2, 10, 1.8 s) — on their usual site the article was one click away from where T1 ended. Comparing the two medians, NaraNews is slower; comparing each person with themselves, 5 of 7 were faster, but the difference is not significant (p = 0.30). We report T2 as a **miss** against the Test Plan's median target. T1 is the strongest result: 6 of 7 faster and significant at α = 0.05 even with n = 7.

## Task success and errors

| Task | Succeeded without help | Target |
|---|---|---|
| T1 (NaraNews) | 7 / 7 | ≥ 80% → **Pass** |
| T2 (NaraNews) | 6 / 7 (86%; U08 failed) | **Pass** |
| T3 | 7 / 7 | **Pass** |
| T4 | 7 / 7 | **Pass** |
| T5 | 5 / 5 recorded (not marked for U02, U03) | **Pass** on recorded |
| Errors per user, NaraNews T1–T5 | U02 1, U03 1, U04 0, U05 0, U06 0, U07 0, U08 1 → median 0 | ≤ 1 → **Pass** |

## SUS (System Usability Scale)

| | U02 | U03 | U04 | U05 | U06 | U07 | U08 | Mean | SD | Target |
|---|---|---|---|---|---|---|---|---|---|---|
| SUS score | 85.0 | 75.0 | 90.0 | 97.5 | 92.5* | 87.5* | 62.5 | **84.3** | 11.9 | ≥ 68 → **Pass** (≥ 80.8 = grade A, Sauro & Lewis) |

\* U05, U06 and U07 had answers corrected after the participant (U06, U07) or the original answer sheet (U05) confirmed a mistake — see [uat-sessions.md](uat-sessions.md). As first recorded, U06 was 42.5 and U07 57.5, which would give a mean of 72.9 (still ≥ 68).

## UTAUT2 (mean of each person's 3-item average, 1–5)

| Construct | U02 | U03 | U04 | U05 | U06 | U07 | U08 | Mean | Target | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| Performance expectancy (PE) | 3.33 | 4.67 | 5.00 | 5.00 | 4.67 | 4.00 | 4.33 | **4.43** | ≥ 4.0 | Pass |
| Effort expectancy (EE) | 2.33 | 4.00 | 4.33 | 5.00 | 5.00 | 4.33 | 5.00 | **4.28** | ≥ 4.0 | Pass |
| Social influence (SI) | 3.33 | 4.00 | 4.33 | 4.33 | 4.67 | 4.33 | 2.00 | 3.86 | reported only | — |
| Facilitating conditions (FC) | 3.67 | 4.33 | 4.67 | 5.00 | 4.67 | 4.67 | 3.67 | 4.38 | reported only | — |
| Hedonic motivation (HM) | 4.33 | 4.00 | 4.67 | 5.00 | 5.00 | 4.33 | 4.00 | 4.48 | reported only | — |
| Behavioural intention (BI) | 3.67 | 4.00 | 4.33 | 5.00 | 4.67 | 4.67 | 4.00 | **4.33** | ≥ 4.0 | Pass |

Lowest construct: **social influence** (3.86, reported only), pulled down by U08 (2.00) — matching U08's comment that NaraNews needs more marketing. Among the targeted constructs, effort expectancy is lowest (4.28) and links to the language issue seen in the tasks: 4 of 7 participants could not read the Thai headlines easily and asked for English (and Burmese) ([issue-log.md](issue-log.md) UX-1).

## Limits (stated honestly)

- **n = 7, one round.** The Test Plan aimed for 12 users in two rounds. T1's improvement is significant (p = 0.031); T2's is not.
- **Language:** 6 of 7 read news mainly in English and 1 in Burmese; the Test Plan asked for at least 3 mainly-Thai readers. The headline language problem may be smaller for Thai readers.
- Some values were not recorded in the session (T5 success for U02/U03, T3/T4 times for U05, some tab counts). They are left blank, not filled in.
- Corrections after the session, each confirmed and dated in [uat-sessions.md](uat-sessions.md): U04 success marks (moderator), U05 SUS item 2 (original answer sheet), U06 and U07 SUS negative items (the participants), U07 T5 success (testers). U08's unusual times (~819 s, 1.8 s) were re-checked by the testers and kept as recorded.
- Test cases TC01–TC20 from the Test Plan §3 were not recorded as a results sheet in the repo; the automated checks that exist are the unit tests in `web/tests/` and `crawler/tests/`, run by CI on every PR (`.github/workflows/ci.yml`).
