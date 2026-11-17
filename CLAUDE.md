# NaraNews — CLAUDE.md

## Project
NaraNews is a Chrome extension that helps people in Thailand keep up with the news without reading full articles: it pulls headlines from Thai news websites, summarizes each into one line, and shows them as a clickable list (click → jumps to the source article). Delivery adapts to context: a popup while Chrome is open and in use, otherwise a Chrome system notification or an email digest.
Chrome extension + a lightweight backend (fetch/summarize/dispatch). Hosted on Supabase, Seoul (ap-northeast-2) — temporary, decided 2026-09-26. Personal data processed there must be listed in the privacy notice (rule.md PDPA cross-border). Revisit before any real user data is stored.
Course: 1305493 SE Case Studies, 1/2569 (Dr. Prasara Jakkaew, ADT MFU).
Phase: BUILD (month 2+). DISCOVER (W1–W5) is complete; requirement specs and backlog remain the source of truth for what to build.

## Team
- Khant Nyar Ko Ko (6631503061)
- La Yaung Chit (6631503064)
- Lin Htet Aung (6631503065)
- Thaung Than Han (6631503091)
- Moe Mya Myintzu (6631503128)

## Folder layout
.claude/agents/requirement-writer.md    — drafts specs/backlog from raw pain notes (heavy lifting)
.claude/agents/backlog-auditor.md       — read-only backlog/spec traceability audit (heavy lifting)
.claude/skills/capture-requirement/     — /capture-requirement, thin entry point -> requirement-writer
.claude/skills/audit-backlog/           — /audit-backlog, thin entry point -> backlog-auditor
.docs/00-charter.md                     — company charter (members, roles, team rules)
.docs/00-proposal.md                    — updated proposal (problem statement + target users)
.docs/01-requirements/01-spec/{YYYYMMDD}-{no}-{topic}.md — requirement specs
.docs/01-requirements/backlog.md        — product backlog
.docs/02-design/                        — design draft: feature-list, user-journey, prototype, diagrams/ (6 diagrams: D1 context, D2 use case, D3 architecture, D4 activity, D5 sequence, D6 ER)
.docs/04-test/                          — Test Plan, UAT session logs (codes only), results, issue log, NFR data + scripts
.docs/final/                            — final deliverables + README index for grading (case study, AI logic, comparison table, role statements)
.docs/05-log/{YYYYMMDD}-log.md          — daily log of agent/human changes
rule.md                                 — legal & compliance rules (PDPA, CCA §26, ETA §9/26/28)
extension/                              — Chrome extension (Manifest V3, Vite+React): popup digest, options/sign-in, background worker (email when away). Published on the Chrome Web Store.
web/                                    — Next.js website + REST API on Vercel: digest, emailed-code sign-in, consent, email dispatch, hash-chained access log.
crawler/                                — Apify + Groq crawler, run by GitHub Actions and started every 2 h by a Supabase timer.

## Rules that always apply
- Read rule.md before touching anything involving personal data, logs, consent, or signatures. Never disable or "temporarily skip" a rule in it.
- Every requirement traces to a real interview pain (P1, P2, …). Never invent a requirement without a source.
- Functional requirements are user stories: "As a <user>, I want <X>, so that <Y>" with a MoSCoW priority (Must/Should/Could/Won't).
- Non-functional requirements must be measurable (seconds, counts, %). "Fast" or "secure" alone is not a requirement.
- Legal requirements are numbered LR1, LR2, … inside the spec, each citing the rule.md section it comes from.
- Every backlog row lists "Traces to: F#, P#" (or LR#).
- If anything is unclear, ask and offer at least 3 options. Never guess.
- When a task matches a skill, call the skill instead of editing files directly.
- After any change under .claude/ or .docs/, append a line to .docs/05-log/{YYYYMMDD}-log.md (create it if it doesn't exist).
