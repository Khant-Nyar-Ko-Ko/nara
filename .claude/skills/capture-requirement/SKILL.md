---
name: capture-requirement
description: >
  Use whenever the user hands over raw interview notes, pain points, user
  complaints, or feature ideas gathered during the DISCOVER phase and wants
  them turned into a formal requirement spec plus a backlog update. Trigger
  on requests like "here are notes from interview #3, write it up", "turn
  these pains into requirements", "write the spec for the <topic>
  interview", "add P4/P5 to the backlog", or any raw pain-point/feature
  dump that needs F#/NFR#/LR# requirements derived from it.
---

This skill is the user-facing entry point for turning raw notes into a
requirement spec. It does not draft the spec itself — it hands the work to
the `requirement-writer` subagent (`.claude/agents/requirement-writer.md`),
which holds the full drafting logic (global P#/F#/NFR#/LR# numbering, the
five-section spec template, the backlog update, and the daily log line).

## What to do

1. Pass the user's raw notes to the `requirement-writer` agent (via the
   Agent tool) verbatim — don't paraphrase or pre-summarize the pains
   yourself before handing them off, and don't strip out anything that
   looks like a source attribution (or its absence).
2. If the agent stops to ask a clarifying question (missing source,
   ambiguous priority, ambiguous scope, etc.) and it has no
   `AskUserQuestion` tool available in its own run, relay that question to
   the user yourself via `AskUserQuestion`, then send the answer back to
   the agent to resume it.
3. Relay the agent's end-of-run report back to the user as-is: the spec
   file path, the new `P#`/`F#`/`NFR#`/`LR#` IDs, which `F#`s form the core
   workflow, the backlog rows added, and the log line appended.
4. Do not write or edit any file under `.docs/01-requirements/` yourself,
   and do not duplicate the drafting logic here — if
   `requirement-writer.md` is missing or looks out of date, say so rather
   than drafting the spec inline.
