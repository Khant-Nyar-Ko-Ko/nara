# NaraNews — Company Charter

**Product:** NaraNews — a Chrome extension that gathers Thai news into one digest of one-line headlines (popup while browsing, email when away). Live: https://nara-news.vercel.app
**Course:** 1305493 SE Case Studies, 1/2569, ADT MFU (Dr. Prasara Jakkaew)
**Mission:** help people in Thailand keep up with the news without visiting many sites or reading full articles.

> **Source of this charter:** the team did not write a separate charter during the project. Members and roles come from the roles slide and the Test Plan; every team rule below is a practice already written down and in force in this repo, with its source. No rules were added that the team did not actually use. Compiled 17 Nov 2026.

## Members and roles

| Member | Student ID | Role | Owns | Testing duty (Test Plan §6) |
|---|---|---|---|---|
| Khant Nyar Ko Ko | 6631503061 | Tech Lead | Extension, REST API, database, compliance layer (access log, auth, consent) | Test lead; backend unit and integration tests |
| La Yaung Chit | 6631503064 | QA | BUILD-phase NFR targets, test runs, auth unit tests, bug tracking | Extension system tests; bug tracking on the GitHub board |
| Lin Htet Aung | 6631503065 | Product Owner | Survey and research evidence, proposal, backlog priorities | Recruitment, consent forms, session booking |
| Thaung Than Han | 6631503091 | AI Lead | Crawler (Apify), Groq summarisation pipeline, Claude Code agents and skills | UAT moderator; SUS/UTAUT2 on Google Forms |
| Moe Mya Myintzu | 6631503128 | Designer | Design system, prototype, popup and email UI | UAT observer and timekeeper; data analysis |

## Team rules

### Code and repository
1. **Every change to `main` goes through a pull request with at least 1 approving review.** No force-push to `main` and no deleting it. — GitHub ruleset "Protect main" (active; first set as branch protection on 16 Sep 2026, W6).
2. **CI must pass on every pull request:** typecheck all packages, run the tests, build the extension and the website. — [.github/workflows/ci.yml](../.github/workflows/ci.yml)
3. **No secrets in git.** `.env` files are git-ignored; only `.env.example` with blank or placeholder values is committed. Production keys live in Vercel, the GitHub `nara-keys` environment and Supabase Vault. — [.gitignore](../.gitignore), [README.md](../README.md#secrets)

### Planning and tracking
4. **Work is tracked as GitHub Issues** on the board "NaraNews — MUST workflow"; MUST features are labelled `must-have`, legal items `legal`. — Issues #3–#10, #15
5. **Scope follows MoSCoW.** Month-2 scope is the MUST workflow only (F1, F2, F3) plus the legal requirements; Won't items stay closed. — [backlog.md](01-requirements/backlog.md)

### Requirements and evidence
6. **Every requirement traces to a real pain (P1, P2, …); never invent one.** Functional requirements are user stories with a MoSCoW priority; non-functional requirements must be measurable; legal requirements are numbered LR1, LR2, … and cite rule.md. Every backlog row lists what it traces to. — [CLAUDE.md](../CLAUDE.md)
7. **Every number shown must have a source file.** — final presentation brief; [.docs/final/](final/README.md)
8. **If something is unclear, ask and offer at least 3 options; never guess.** — CLAUDE.md

### Legal and personal data
9. **Read rule.md before touching personal data, logs, consent or signatures, and never disable or "temporarily skip" a rule in it.** — [rule.md](../rule.md), CLAUDE.md
10. **Test participants are recorded by code only (U01, U02, …),** never by name; names stay on a paper sheet held by one member and are deleted after grading. — Test Plan §4

### AI use
11. **AI-assisted work is reviewed by a team member and logged.** When a task matches a project skill, use the skill; after any change under `.claude/` or `.docs/`, add a line to `.docs/05-log/<date>-log.md`. — CLAUDE.md, [.docs/05-log/](05-log/)
