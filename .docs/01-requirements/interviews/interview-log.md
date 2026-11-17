# NaraNews — Interview Log

Guide: [interview-guide.md](interview-guide.md). Target: ≥5 by the gate, ≥15 overall.
IDs only (R1, R2, …) — no names, emails, phone numbers or LINE IDs here (PDPA, rule.md).

Progress: **7 / 5** — all 7 are **post-test interviews** (17 Nov 2026), not DISCOVER problem interviews (target 15)

> **Status (17 Nov 2026): no one-to-one problem interviews were held during DISCOVER.** The guide above was prepared but not run before building. The pains P1–P4 come from (a) a **real-user survey** of 7 readers in Thailand — [../survey-results.md](../survey-results.md) — and (b) **SECONDARY** evidence: 5 Pantip threads and 8 Google Play reviews with links, dates and screenshots — [../research/path-b-user-research.md](../research/path-b-user-research.md).
>
> The 4 rows below are the **real** short interviews held at the end of each user-test session (Test Plan §4 step 5: "What did you like? Where did you get stuck? Would you keep using it?"). They are logged here because they are the only one-to-one conversations with real users, but they are weaker evidence for the problem than discovery interviews: they happened **after** people had used NaraNews, so answers lean towards the product. Quotes are copied from the session records, shortened with "…" where identifying details were removed; full records: [../../04-test/uat-sessions.md](../../04-test/uat-sessions.md). No row was invented.

| ID | Date | Interviewer | Mode | Length | Pain quote (verbatim; participants answered in English) | Pain # | Past-behaviour evidence | Contradicts? |
|----|------|-------------|------|--------|---------------------------------------------------------|--------|-------------------------|--------------|
| R1 = U02 | 2026-11-17 | UAT moderator (team) | End of test session (mode not recorded) | not recorded | "Usually when I check Thai news on Facebook or news websites, there are so many ads and distracting videos. With NaraNews, all the headlines are in one neat list right inside Chrome, and getting the email digest on my phone … is super convenient" | P2, P4 | Checks Thai news on Facebook and news websites; in the old-way task opened 7 tabs to find 3 stories | No. New need: "a one-click English or Burmese translate toggle" |
| R2 = U03 | 2026-11-17 | UAT moderator (team) | End of test session (mode not recorded) | not recorded | "Regular Thai news websites have so many pop-ups and flashing ads … Having the headlines in one simple list and getting an email digest on my phone … is genuinely practical." · "It saves me time every morning …" | P2, P3, P4 | Checks local news every morning on regular Thai news websites | No. New needs: larger popup font; English/Burmese translation button |
| R3 = U04 | 2026-11-17 | UAT moderator (team) | End of test session (mode not recorded) | not recorded | "NaraNews puts all the Thai headlines in one clean spot without distracting ads, and the email digest is great when I'm commuting on the train or bus" · "helps me stay updated … in under a minute" | P2, P3, P4 | Keeps up with current events for class discussions; in the old-way task opened 6 tabs | No. New need: "a built-in English or Burmese translate button" |
| R4 = U05 | 2026-11-17 | QA (La Yaung Chit) | Zoom, recorded (see uat-sessions.md, U05) | not recorded | "I see myself using it for the foreseen future because of how easy it is to get the lastest news." | P1 (weak) | Not stated | Partly: on the "open the full article" task this participant was faster on their usual sites (7.7 s) than with NaraNews (16.3 s) |
| R5 = U06 | 2026-11-17 | UAT moderator (team) | End of test session (mode not recorded) | not recorded | Liked: "Fast and Update" · Keep using: "Yes because fast" | P3 | Not stated (reads news mainly in Burmese) | No. Stuck on "Installation" |
| R6 = U07 | 2026-11-17 | UAT moderator (team) | End of test session (mode not recorded) | not recorded | "I really like to look quicky." · "I want to keep using cuz it's so easy to find new news." | P3, P1 | Reads news rarely | No. Couldn't read the Thai headlines, wanted English |
| R7 = U08 | 2026-11-17 | UAT moderator (team) | End of test session (mode not recorded) | not recorded | "It is easy but it would be better if you guys do more marketing and putting instructions in the marketing." | — | Reads news daily | Partly: T2 failed with NaraNews and T1 was no faster than the old way; wants a search bar in topic selection |

## Summary per pain (7 post-test interviews + survey + SECONDARY)

| Pain | Supported by (interviews) | Contradicted by | Verdict |
|------|---------------------------|-----------------|---------|
| P1 falling behind | R4, R6 (weak: value getting new/latest news easily) | — | **Weak** in interviews; rests on the survey (6 of 7 sometimes miss news) and SECONDARY B1, B3 |
| P2 scattered sources | R1, R2, R3 (ads and clutter across sites vs "one neat list") | — | **Supported** (also survey: 4 of 7 check 2+ sites; SECONDARY: 6 sources) |
| P3 effort to get through the news | R2 ("saves me time every morning"), R3 ("under a minute"), R5 ("fast"), R6 ("look quickly") | R4, R7 partly (T2 faster the old way; R7's T1 no faster) | **Supported** (also survey and SECONDARY: 6 sources) |
| P4 news when away from Chrome | R1, R2, R3 (value the email digest on the phone when away) | — | **Supported for the email channel** (F3); Chrome notifications (F5) not tested |
| New: language | R1, R2, R3, R6 ask for English (and Burmese) headlines | — | New need, not in the backlog yet — [issue-log.md](../../04-test/issue-log.md) UX-1 |
