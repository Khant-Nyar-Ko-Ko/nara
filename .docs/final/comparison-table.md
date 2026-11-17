# Comparison table — before and after NaraNews

Every row has a source file. "Before" for user tasks = the participant's usual news sites; for system rows = the version before the fix. n = 7 real users (U02–U08) unless stated.

| Item | Before | After | Change | Measured with | Evidence |
|---|---|---|---|---|---|
| T1: find the 3 biggest stories today (MUST F1, F2) | 58.5 s median | 17 s median | −71% (target ≥ 30%); 6 of 7 faster, Wilcoxon p = 0.031 | stopwatch, Test Plan §5 | [uat-results.md](../04-test/uat-results.md), [uat-sessions.md](../04-test/uat-sessions.md) |
| T2: open the full article (MUST F2) | 15.2 s median | 24 s median | **+58% (slower) — target missed**; per person 5 of 7 faster, p = 0.30 | stopwatch | same |
| T1 succeeded without help | 6 of 7 (usual sites) | 7 of 7 | +1 user | observation | same |
| Tabs opened for T1 | 7, 6, 3, 3, 3, 3 | 1, 1, 0, 3 | 3 of 4 counted: popup + ≤ 1 article | note-taker tally | same |
| Sites/apps checked to stay informed | 2 or more for 4 of 7 readers | 1 popup | — | DISCOVER survey (n = 7) | [survey-results.md](../01-requirements/survey-results.md) |
| T3: set up the email digest (MUST F3, LR3, LR4) | no equivalent | 78.6 s median, 7 of 7 succeeded | target ≤ 120 s met | stopwatch | uat-results.md |
| T4: catch up on the phone (MUST F3) | no equivalent | email in 98 s median, 7 of 7 (U08: 818.5 s) | median target ≤ 180 s met; U08 missed | stopwatch | uat-results.md |
| T5: turn email off (LR1) | no equivalent | 5 of 5 recorded succeeded | — | observation | uat-results.md |
| Usability (SUS) | — | 84.3 mean (85, 75, 90, 97.5, 92.5, 87.5, 62.5) | target ≥ 68 met; grade A | SUS questionnaire | uat-results.md |
| Intention to use (UTAUT2 BI) | — | 4.33 / 5 | target ≥ 4.0 met | UTAUT2 questionnaire | uat-results.md |
| Ease of use (UTAUT2 EE) | — | 4.28 / 5 | target ≥ 4.0 met | UTAUT2 questionnaire | uat-results.md |
| **AI: Thai headline fits one popup line** | 6 of 50 (12%) | 16 of 16 (100%) | +88 points | render at popup width, count lines | [nfr-results.md](../04-test/nfr-results.md), [ai-logic.md](ai-logic.md) |
| **AI: headlines in all 3 languages** | — | 50 of 50 | — | count of live API | [headlines-languages-2026-11-17.csv](../04-test/data/headlines-languages-2026-11-17.csv) |
| **AI: posts lost per crawl to model errors** | 8 of 15 | 0 of 1 (after both fixes) | fixed | GitHub Actions logs | [issue-log.md](../04-test/issue-log.md) B09–B10 |
| Popup opens with digest | — | 1.78 s | target < 2 s met | timed in Chrome | nfr-results.md |
| Digest freshness (hours between crawls, 07:00–21:00) | 7.67 h average (41 runs) | timer every 2 h; first gap 1.45 h, more measured tonight | target ≤ 3 h — re-measuring | GitHub Actions history, [crawl-gaps.py](../04-test/scripts/crawl-gaps.py) | nfr-results.md |
| Silent crawl failures | 13 runs "success" with nothing saved (12–16 Nov) | a failed source turns the run red | fixed | Actions logs | issue-log.md B06 |
| Bugs | 10 found | 10 fixed, 0 open | — | git log | issue-log.md |
| Real users of the store listing | — | 6 installs with a browser language, all in Thailand (302 total; 272 from one region with no browser language excluded) | — | Chrome Web Store export | [store-installs CSV](../04-test/data/store-installs-2026-11-03_14.csv) |
