# Nara — CLAUDE.md

## Project
Nara is <one sentence: who the users are and what problem it solves>.
Web/mobile app with user accounts, user-generated content (uploads, messages), and paid features. Hosted in Thailand / SEA cloud region.
Course: 1305493 SE Case Studies, 1/2569 (Dr. Prasara Jakkaew, ADT MFU).
Phase: DISCOVER (W1–W5). No production code until BUILD (month 2).

## Team
- Khant Nyar Ko Ko (6631503061)
- La Yaung Chit (6631503064)
- Lin Htet Aung (6631503065)
- Thaung Than Han (6631503091)
- Moe Mya Myintzu (6631503128)

## Folder layout
.claude/agents/                         — subagents (requirement-writer, backlog-auditor)
.claude/skills/<name>/SKILL.md          — skills, invoked with /<name>
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
- After any change under .claude/ or .docs/, append a line to