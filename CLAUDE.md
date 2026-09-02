# NaraNews — CLAUDE.md

## Project
NaraNews is a Chrome extension that helps people in Thailand keep up with the news without reading full articles: it pulls headlines from Thai news websites, summarizes each into one line, and shows them as a clickable list (click → jumps to the source article). Delivery adapts to context: a popup while Chrome is open and in use, otherwise a Chrome system notification or an email digest.
Chrome extension + a lightweight backend (fetch/summarize/dispatch). Hosted in Thailand / SEA cloud region.
Course: 1305493 SE Case Studies, 1/2569 (Dr. Prasara Jakkaew, ADT MFU).
Phase: DISCOVER (W1–W5). No production code until BUILD (month 2).

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
.docs/01-requirements/01-spec/{YYYYMMDD}-{no}-{topic}.md — requirement specs
.docs/01-requirements/backlog.md        — product backlog
.docs/05-log/{YYYYMMDD}-log.md          — daily log of agent/human changes
rule.md                                 — legal & compliance rules (PDPA, CCA §26, ETA §9/26/28)

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
