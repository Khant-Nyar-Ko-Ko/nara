# NaraNews — Final project index (Discover → Deliver)

Repo: https://github.com/Khant-Nyar-Ko-Ko/nara · Branch: **`main`** (all items below) · Live: https://nara-news.vercel.app
Labels: **REAL** = data from real users · **SECONDARY** = published/online evidence, with what it does and does not prove.

## 1. DISCOVER

| Item | File |
|---|---|
| Company Charter (members, roles, team rules) | [../00-charter.md](../00-charter.md) |
| Real users — survey of 7 readers in Thailand (**REAL**, answer counts) | [../01-requirements/survey-results.md](../01-requirements/survey-results.md) |
| Interviews — guide prepared; **no one-to-one problem interviews held** (stated, not invented) | [../01-requirements/interviews/interview-log.md](../01-requirements/interviews/interview-log.md), [guide](../01-requirements/interviews/interview-guide.md) |
| Problem review — 5 Pantip threads + 8 Google Play reviews with links, dates, screenshots (**SECONDARY**) | [../01-requirements/research/path-b-user-research.md](../01-requirements/research/path-b-user-research.md) |
| Pains P1–P4, problem statement, target users | [../00-proposal.md](../00-proposal.md) |
| Requirements (user stories, NFRs, legal LR1–LR5) | [../01-requirements/01-spec/20260902-01-news-digest.md](../01-requirements/01-spec/20260902-01-news-digest.md) |
| Product Backlog (MoSCoW; MUST = F1, F2, F3 + LR1–LR4) | [../01-requirements/backlog.md](../01-requirements/backlog.md) |
| Lean Canvas (optional) | not made |
| PDPA and legal rules | [../../rule.md](../../rule.md) |
| How the team uses AI | [../../CLAUDE.md](../../CLAUDE.md), [../../.claude/](../../.claude/) |

## 2. BUILD

| Item | File |
|---|---|
| Diagrams: system context, use case, architecture, activity, **sequence**, **ER** | [../02-design/diagrams/README.md](../02-design/diagrams/README.md) (D1–D6) |
| Architecture (how the parts connect) | [../02-design/diagrams/D3-architecture.md](../02-design/diagrams/D3-architecture.md) |
| Design system, prototype, user journey | [../02-design/design-system.md](../02-design/design-system.md), [../02-design/prototype/](../02-design/prototype/), [../02-design/user-journey.md](../02-design/user-journey.md) |
| Source code | [../../extension/](../../extension/), [../../web/](../../web/), [../../crawler/](../../crawler/) |
| Our own tests (run by CI on every PR) | [../../web/tests/](../../web/tests/), [../../crawler/tests/](../../crawler/tests/), [../../.github/workflows/ci.yml](../../.github/workflows/ci.yml) |
| How to run: setup, `.env.example`, test account | [../../README.md](../../README.md) |
| No secrets: env files git-ignored, history scanned 17 Nov (none found) | [../../README.md#secrets](../../README.md#secrets), [../../.gitignore](../../.gitignore) |

## 3. TEST

| Item | File |
|---|---|
| Test Plan | [../04-test/test-plan.pdf](../04-test/test-plan.pdf) |
| Session logs of real users U02–U08 (**REAL**, codes only, identifying details removed) | [../04-test/uat-sessions.md](../04-test/uat-sessions.md) |
| Video recordings of user-test sessions (Zoom; one file per participant code, e.g. "Test with U05.mp4"; anyone with the link can view) | [UAT testing folder](https://drive.google.com/drive/folders/1XzGAdkjOFNaBSmLgpRmuuaqxw0jHqASo) on Google Drive, listed in [uat-sessions.md](../04-test/uat-sessions.md) |
| Before / After for every MUST task | [../04-test/uat-results.md](../04-test/uat-results.md) |
| SUS and UTAUT2 responses and results | [../04-test/uat-sessions.md](../04-test/uat-sessions.md#questionnaire-answers-15), [../04-test/uat-results.md](../04-test/uat-results.md) |
| Issue log (severity, fix commit, retest) | [../04-test/issue-log.md](../04-test/issue-log.md) |
| Non-functional measurements + raw data + scripts | [../04-test/nfr-results.md](../04-test/nfr-results.md), [../04-test/data/](../04-test/data/), [../04-test/scripts/](../04-test/scripts/) |

## 4. DELIVER

| Item | File |
|---|---|
| Case study (Problem, Process, Outcome, live URL) | [case-study.md](case-study.md) |
| AI logic (Where, How, Prove, Measure) | [ai-logic.md](ai-logic.md) |
| Comparison table (incl. AI rows) | [comparison-table.md](comparison-table.md) |
| Role statements (one per member) | [role-statements/](role-statements/) — [6631503061 Khant Nyar Ko Ko](role-statements/6631503061-khant-nyar-ko-ko.md) · [6631503064 La Yaung Chit](role-statements/6631503064-la-yaung-chit.md) · [6631503065 Lin Htet Aung](role-statements/6631503065-lin-htet-aung.md) · [6631503091 Thaung Than Han](role-statements/6631503091-thaung-than-han.md) · [6631503128 Moe Mya Myintzu](role-statements/6631503128-moe-mya-myintzu.md) |

## 5. Other supporting documents

| Item | File |
|---|---|
| AI in the system: data, prompt, model, pipeline, evaluation, limits, bias, failure handling | [ai-logic.md](ai-logic.md) |
| Data sources: 5 Thai outlets' public Facebook pages via Apify | [../../crawler/src/sources.ts](../../crawler/src/sources.ts), [../../crawler/README.md](../../crawler/README.md) |
| Deployment: Vercel (web/API), Supabase Seoul (DB), GitHub Actions + Supabase timer (crawler), Chrome Web Store (extension) | [../../README.md](../../README.md), [../../crawler/sql/002_crawl_timer.sql](../../crawler/sql/002_crawl_timer.sql) |
| Change log of every AI-assisted and human change | [../05-log/](../05-log/) |
