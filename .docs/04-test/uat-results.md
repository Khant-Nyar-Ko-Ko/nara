# UAT results — before / after and questionnaires (round 1, n = 4)

Data: [uat-sessions.md](uat-sessions.md) (U02–U05). Targets: [Test Plan](test-plan.pdf) §5. Medians skip times that were not recorded.

## Before / after for the MUST tasks

| Task (MUST) | Before: usual news sites (median) | After: NaraNews (median) | Change | Target | Result |
|---|---|---|---|---|---|
| T1 find the 3 biggest stories today (F1, F2) | 48.8 s (58.5, 64, 39, 37.5) | 18 s (19, 29, 17, 4.6) | −63% | ≥ 30% faster | **Pass** |
| T2 open the full article (F2) | 60.5 s (74, 78, 47, 7.7) | 26 s (28, 38, 24, 16.3) | −57% | ≥ 30% faster | **Pass** |
| T1 tabs opened | 7, 6, 3 (U03 not counted) | 1, 1 (U03, U04 not counted) | — | popup + ≤ 1 article tab | Pass where counted |
| T3 set up email delivery (F3, LR3, LR4) | no equivalent | 95 s (95, 115, 72; U05 not timed) | — | ≤ 120 s | **Pass** |
| T4 catch up on the phone (F3) | no equivalent | email arrived in 105 s (112, 98, 85, 142) | — | ≤ 180 s | **Pass** |
| T5 turn off email (LR1) | no equivalent | 21 s, 5.7 s (U04, U05) | — | — | success 2/2 recorded |

Per participant, T1 was faster with NaraNews for all 4. T2 was faster for 3 of 4 (U05: 7.7 s old way vs 16.3 s).

## Task success and errors

| Task | Succeeded without help | Target |
|---|---|---|
| T1 (NaraNews) | 4 / 4 | ≥ 80% → **Pass** |
| T2 (NaraNews) | 4 / 4 | **Pass** |
| T3 | 4 / 4 | **Pass** |
| T4 | 4 / 4 | **Pass** |
| T5 | 2 / 2 recorded (not marked for U02, U03) | **Pass** on recorded |
| Errors per user, NaraNews T1–T5 | U02 1, U03 1, U04 0, U05 0 → median 0.5 | ≤ 1 → **Pass** |

## SUS (System Usability Scale)

| | U02 | U03 | U04 | U05 | Mean | SD | Target |
|---|---|---|---|---|---|---|---|
| SUS score | 85.0 | 75.0 | 90.0 | 97.5 | **86.9** | 9.4 | ≥ 68 → **Pass** (≥ 80.8 = grade A, Sauro & Lewis) |

## UTAUT2 (mean of each person's 3-item average, 1–5)

| Construct | U02 | U03 | U04 | U05 | Mean | Target | Result |
|---|---|---|---|---|---|---|---|
| Performance expectancy (PE) | 3.33 | 4.67 | 5.00 | 5.00 | **4.50** | ≥ 4.0 | Pass |
| Effort expectancy (EE) | 2.33 | 4.00 | 4.33 | 5.00 | **3.92** | ≥ 4.0 | **Miss** |
| Social influence (SI) | 3.33 | 4.00 | 4.33 | 4.33 | 4.00 | reported only | — |
| Facilitating conditions (FC) | 3.67 | 4.33 | 4.67 | 5.00 | 4.42 | reported only | — |
| Hedonic motivation (HM) | 4.33 | 4.00 | 4.67 | 5.00 | 4.50 | reported only | — |
| Behavioural intention (BI) | 3.67 | 4.00 | 4.33 | 5.00 | **4.25** | ≥ 4.0 | Pass |

Lowest construct: **effort expectancy**, pulled down by U02 (EE1 = 1). It links to the issue seen in the tasks: Thai-only headlines are hard for non-native readers, and 3 of 4 participants asked for an English/Burmese toggle ([issue-log.md](issue-log.md) UX-1).

## Limits (stated honestly)

- **n = 4, one round.** The Test Plan aimed for 12 users in two rounds. With n = 4 the Wilcoxon signed-rank test cannot reach p < 0.05 (smallest possible two-sided p = 0.125), so these are early signals, not statistical proof.
- **All 4 participants read news mainly in English**; the Test Plan asked for at least 3 mainly-Thai readers.
- Some values were not recorded in the session (T5 success for U02/U03, T3/T4 times for U05, some tab counts). They are left blank, not filled in.
- U04's success marks were added after the session on the moderator's confirmation; U05's SUS item 2 was corrected from the original answer sheet. Both are noted in [uat-sessions.md](uat-sessions.md).
- Test cases TC01–TC20 from the Test Plan §3 were not recorded as a results sheet in the repo; the automated checks that exist are the unit tests in `web/tests/` and `crawler/tests/`, run by CI on every PR (`.github/workflows/ci.yml`).
