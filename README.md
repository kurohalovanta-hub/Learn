# EMBODIED // OS

**A 210-day, mastery-gated learning operating system: zero → embodied-intelligence researcher.**

Built from a live-verified research pass over the August-2026 robot-learning frontier
(see [`docs/research/`](docs/research/)), then encoded as a dependency graph of
**149 skill nodes** across 17 levels, **92 verified resources** with exact sections,
a **63-paper ladder**, **22 cumulative projects**, and **8 boss fights** — served as a
dark, PC-first mission-control web app that answers one question from every screen:

> **WHAT DO I DO NEXT?**

## What's inside

| Surface | What it does |
|---|---|
| **Dashboard** | Day X/210, rank/XP, streak, research-readiness radar, warnings (tutorial-hell, AI-dependence, pacing drift…), next unlocks |
| **Today** | The daily operating sequence (math ∥ implementation ∥ specialization ∥ project ∥ review) scheduled from the *unlock frontier* of the graph — mastery-gated, never calendar-gated; flips to the research loop in Month 7 |
| **Skill Tree** | The full dependency graph as an interactive pan/zoom map; Gold-edges enforce "no framework before first principles" |
| **Node pages** | Why → objectives → equations (KaTeX) → exact resource sections → derivation/implementation/exercises → mastery gate with evidence + independence tracking → diagnostic skip-test |
| **Papers** | The 63-paper ladder (ladder + kanban views) with per-paper questions, reproduction plans and prereq gating |
| **Projects / Bosses** | The cumulative project ladder (P1 physics toy → P22 original research) and the 8 synthesis gates with remediation maps |
| **Experiments / Ideas / Frontier** | Pre-registered experiment tracker (§19 templates), scored research-idea inbox (§16 rubric), and the Aug-2026 frontier watchlist with roadmap verdicts |
| **Review / Weekly** | Spaced retrieval queue (SM-2-style, prompts not flashcards) and the seventh-day ritual with hours/AI-dependence audits |

Progress is **local-first** (browser storage + one-click JSON export/import) with optional
**cross-device sync** — no accounts.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # content integrity (also runs in prebuild)
npm run build      # full production build (184 static pages)
```

Node ≥ 20.9 (24.x recommended). Zero environment variables required.

## Deploy (GitHub → Vercel)

1. Push this repo to GitHub and **Import** it at [vercel.com/new](https://vercel.com/new) — zero config, the build just runs.
2. *(Optional but recommended — cross-device sync, ~3 minutes)*
   1. In the Vercel project: **Storage → Create Database → Upstash for Redis** (free tier: 256 MB, 500K commands/mo — a solo learner uses ~1%). Link it to the project; it injects `KV_REST_API_URL` / `KV_REST_API_TOKEN`.
   2. **Settings → Environment Variables**: add `SYNC_SECRET` = any long random string (e.g. output of `openssl rand -hex 24`).
   3. Redeploy. In the app: **Settings → cross-device sync** → paste the same secret on each device. Done — progress merges across devices (last-write-wins per record, append-safe logs).

Without step 2 the app still works fully — use **Settings → Export/Import** to move progress between devices.

## Project context (for future sessions)

- [`CLAUDE.md`](CLAUDE.md) — authority chain + hard rules.
- [`docs/spec/HANDOVER.md`](docs/spec/HANDOVER.md) — the authoritative product/curriculum spec.
- [`docs/research/`](docs/research/) — the 2026-08-21 research phase: frontier map, resource audit, dependency-graph design, curriculum audit, compute strategy, paper ladder, feasibility math, plus ten raw verified domain reports in `reports/`.
- [`docs/architecture/`](docs/architecture/) — ADRs (stack, persistence, content model) + implementation plan.
- **Content is code:** the curriculum lives in [`src/content/`](src/content/), type-checked and integrity-validated (`scripts/validate-content.ts`) on every build. Frontier developments land in `frontier.ts` with a "does the roadmap change?" verdict before any node edits.
