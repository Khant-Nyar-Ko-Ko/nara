# Role statement — Thaung Than Han (6631503091), AI Lead

> **DRAFT — prepared with Claude Code from the repo on 17 Nov 2026. Thaung to review and edit into their own words before 08:00, 18 Nov. Fill in the AI disclosure.**

I was the AI Lead and owned the news pipeline and the team's AI tooling. I built the first crawler that collects the latest Facebook posts from Thai news outlets with Apify, and the Groq summarisation step that turns each post into one headline in English, Thai and Burmese with a topic category, returned as structured JSON. I set up the Claude Code agents and skills the team uses — requirement-writer, backlog-auditor and diagram-checker — so that AI-written requirements and diagrams are checked against our spec and logged. The Test Plan named me UAT moderator, with the SUS and UTAUT2 questionnaires on Google Forms. In the final presentation I explain where AI is used, how it is controlled, and how we prove and measure it.

Evidence: commit [c863fb9](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/c863fb9) (crawler), [crawler/src/](../../../crawler/src/), [.claude/agents/](../../../.claude/agents/), [.claude/skills/](../../../.claude/skills/), [ai-logic.md](../ai-logic.md), Test Plan §6 roles.

**AI disclosure:** I used ChatGPT to help write the crawler code, design the Groq headline prompt and its JSON schema, and draft the Claude Code agent and skill definitions. Groq itself is part of the product, not a tool I used to write it. I checked the output by running the crawler on real news pages and comparing the saved headlines with the original posts, and by trying each agent on our real spec before the team used it. A first draft of this statement was prepared with Claude Code from the repo and edited by me.
