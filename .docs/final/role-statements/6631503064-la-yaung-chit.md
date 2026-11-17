# Role statement — La Yaung Chit (6631503064), QA

> **DRAFT — prepared with Claude Code from the repo on 17 Nov 2026. La Yaung to review and edit into their own words before 08:00, 18 Nov. Fill in the AI disclosure.**

I was responsible for quality. Because the DISCOVER spec had no numeric non-functional requirements, I defined measurable BUILD targets — popup opens with the digest in under 2 s, each summary fits one line, the digest is no more than 3 h old, and expired or forged tokens are always rejected — and checked each one against real measurements, marking a target as failed when the numbers said so. I tracked bugs and their fixes, and the Test Plan gave me the extension system tests and bug tracking on the GitHub board. I also built the first version of the digest popup frontend. In the final presentation I present the before/after results and the quality slide.

Evidence: [nfr-results.md](../../04-test/nfr-results.md), [issue-log.md](../../04-test/issue-log.md), [uat-results.md](../../04-test/uat-results.md), [web/tests/auth.test.ts](../../../web/tests/auth.test.ts), commit [2a7ed85](https://github.com/Khant-Nyar-Ko-Ko/nara/commit/2a7ed85) (digest popup frontend), Test Plan §6 roles.

**AI disclosure:** I used ChatGPT, Gemini and GitHub Copilot to help draft the measurable NFR targets and the test scripts that measure them, and to word bug reports for the issue log. I checked the output by running every test myself and keeping only the targets and results that matched real measurements, and I reproduced each bug before logging it. A first draft of this statement was prepared with Claude Code from the repo and edited by me.
