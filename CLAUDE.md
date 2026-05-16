# Agent Instructions & Project Context

## 1. Project Context
We are building **ScholarMatch**, a mobile-first PWA that matches African students to scholarships they genuinely qualify for.
- **Goal:** Eliminate the pain of discovering long-tail, university-specific scholarships using an AI-powered eligibility matching engine and automated deadline trackers.
- **Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase (PostgreSQL), Clerk Auth, and Anthropic Claude API.
- **Design Ethos:** "High Trust, Low Friction". Optimize for mobile-first, potentially low-bandwidth environments. Primary color: `#1D4ED8` (Blue), Success color: `#10B981` (Green), Background: `#F8FAFC` (Off-White).
- **Core Feature:** A two-stage matching engine: Stage 1 (Supabase hard filter to eliminate ineligible grants) + Stage 2 (Claude AI soft filter for precise scoring and explanation).

## 2. Strict Execution Rules
1. **One Step at a Time:** You will be fed specific prompt build steps (e.g., `[STEP 01]`, `[STEP 02]`). You must execute ONLY the current step requested. Do not hallucinate future steps or write code for upcoming features.
2. **UI Standards:** Always prioritize mobile-first responsiveness. Use `shadcn/ui` components and Tailwind CSS exactly as requested. Do not use inline styles.
3. **No Assumptions on Errors:** If a build or logic error occurs, do not guess the fix. Run `/investigate` first.

## 3. gstack Skills
gstack is installed at `.agents/skills/gstack`. Use the slash commands below at the appropriate stage of the build. Always check the `SKILL.md` files inside `.agents/skills/gstack/` if you need a reminder of how a skill works.

**Browsing Rule**
Use `/browse` from gstack for all web browsing tasks. Never use `mcp__claude-in-chrome__*` tools.

**Available Skills & When to Use Them**
- `/review` — Run after every feature is built. Acts as a staff engineer reviewing the code for bugs, edge cases, and completeness gaps before any commit.
- `/office-hours` — Run when challenging or refining product ideas. Pushes back on framing and proposes alternatives.
- `/plan-eng-review` — Run to validate database schema, data flow, and architectural decisions.
- `/investigate` — Run when something is broken and the root cause is unclear. Do not attempt fixes without investigation first.
- `/qa` — Run after a major feature is complete. Opens a real browser and tests the app end-to-end.
- `/cso` — Run before any production deployment. Audits the codebase for security issues relevant to student profile data, PII, and Clerk authentication security (OWASP Top 10 + STRIDE).
- `/ship` — Run when code is reviewed, QA-passed, and ready to commit. Runs tests, pushes to git, and opens a PR.
- `/land-and-deploy` — Run after a PR is approved. Merges, waits for CI, and verifies production health.
- `/design-review` — Reserved for the post-MVP UI revamp phase.

## 4. Skill Invocation Order (Standard Sprint)
`Build` → `/review` → `/qa` (on major features) → `/cso` (pre-deploy) → `/ship` → `/land-and-deploy`