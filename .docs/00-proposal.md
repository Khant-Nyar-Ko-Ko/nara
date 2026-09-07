# NaraNews — Updated Proposal (W5)

## Problem Statement
General news readers in Thailand currently follow the news by visiting multiple news websites directly in a
browser. Doing so means: content is scattered across many separate sites, staying current requires actively
re-checking those sites (so readers fall behind), and reading full articles just to find out what's relevant costs
more time than most readers want to spend. NaraNews is a Chrome extension that fetches headlines from multiple Thai
news websites, summarizes each into one clickable line, and delivers that list to the reader through whichever
channel fits their current context — a popup while Chrome is open and in use, otherwise a Chrome system
notification or an email digest — so they can stay current without visiting each site or reading full articles
up front.

## Target Users
Primary: general news readers in Thailand who read Thai-language news regularly (including MFU-area students), who
currently rely on visiting multiple Thai news sites directly in a browser.
Not yet segmented further (age, occupation, device, reading habit) — that segmentation is one of the things this
round of real interviews should surface.

## Validation Status
As of 2026-09-07, this proposal is survey-supported, not yet interview-validated. A 7-respondent Google Form survey
("Nara News — News Habits & Preferences Survey," 2026-09-02 – 2026-09-06) has replaced the original pure-hypothesis
sourcing with real (if moderate) evidence:
- P1 — "Occasionally falls behind on the news" — real but moderate, not chronic (softened from the original
  hypothesis based on survey data)
- P2 — "Scattered news sources are a real, consistent annoyance" — the most consistently supported of the pains
- P3 — "Getting through the news takes more effort than readers want" — real but the most mixed/weakest-supported
- P4 (new, surfaced by the survey) — "No dedicated way to be notified when Chrome is idle" — readers split evenly
  3/7 vs 3/7 between a Chrome system notification and the existing email fallback

Full detail and exact survey citations: [01-spec/20260902-01-news-digest.md](01-requirements/01-spec/20260902-01-news-digest.md).

This still isn't the W5 gate's required ≥5 real users **interviewed** — a survey response isn't a live interview.
4 of the 7 respondents opted in as leads for that still-required round (target ≥5 by 2026-09-08, ≥15 by end of
month). Treat every P#/F# here as provisional until those live interviews land; wording or priorities may still
shift.

## Resolved — Chrome system notification gap
The project description (CLAUDE.md) names three delivery states — popup (Chrome open + in use), Chrome system
notification (Chrome open, idle), or email (not in Chrome). The middle state previously had no F#; the survey's P4
finding (above) is now its source, and it's a properly cited requirement: F5 "Chrome system notification delivery
when Chrome is idle" [Should] — in scope this phase, but not part of the Must-only core workflow. See the spec for
the full requirement and LR5 (its PDPA companion) for the purpose-limitation rule on the new preference field it
needs.
