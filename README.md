# EMBODIED // OS

**A 210-day, mastery-gated learning operating system: zero → embodied-intelligence researcher.**

Built from a live-verified research pass over the August-2026 robot-learning frontier
(see [`docs/research/`](docs/research/)), then encoded as a dependency graph of
**149 skill nodes** across 17 levels, **92 verified resources** with exact sections,
a **63-paper ladder**, **22 cumulative projects**, and **8 boss fights** — served as a
dark, mission-control web app (PC-first, phone-first-class) that teaches **in-app**
and answers one question from every screen:

> **WHAT DO I DO NEXT?**

## What's inside

| Surface | What it does |
|---|---|
| **Today** | The day as a progressive 7-step mission — 01 UNDERSTAND → 02 DERIVE → 03 IMPLEMENT → 04 APPLY → 05 PROVE IT → 06 CONNECT → 07 SHIP — scheduled from the *unlock frontier*; mastery-gated, never calendar-gated; flips to the research loop in Month 7 |
| **Lessons** (`/learn/*`) | 16 flagship interactive lessons (Python basics → vectors/matrices/eigen → backprop → attention → SO(3)/SE(3)/Jacobians → PID/Kalman → MDPs → BC/DAgger → VLA anatomy): intuition → formalism → honest derivations → predict/trace/missing/debug/write code exercises → misconceptions → retrieval → embedded mastery gate. Full-screen focus runner with keyboard + swipe, position always saved |
| **Widgets** | 15 hand-rolled SVG instruments implementing the real equations — draggable vectors, matrix machines with eigenvectors, gradient-descent landscapes, backprop graph, attention heatmap, quaternion SO(3) with gimbal lock, planar arm FK/IK-DLS/Jacobian ellipse, live PID plant, Kalman heartbeat, value iteration, BC covariate-shift drift, π0-class VLA dataflow. All playable in **Labs → instrument bench** |
| **Skill Tree** | Pan/zoom/pinch dependency graph; tap any node → "you are N prerequisite gates away" with the mastery path highlighted and hour totals |
| **Papers** | 63-paper ladder; every paper is a study page (readiness vs your live mastery, key equations, lineage, reproduction path) with **Defense Mode** — a closed-book interrogation that records defended/partial/undefended |
| **Dashboard / Field Manual** | Rank/XP, readiness radar, warnings, next unlocks — plus `/guide`, a 5-minute plain-language manual of the whole system |
| **Projects / Bosses / Review / Weekly / Experiments / Ideas / Frontier** | Cumulative project ladder, synthesis gates with remediation, SM-2 retrieval queue, weekly ritual, pre-registered experiments, scored idea inbox, Aug-2026 frontier watchlist |

## Accounts & progress

- **First registered account becomes admin** (auto-approved). Every later account
  needs admin approval before it can sign in — approve from `/admin`.
- Per-user progress syncs continuously to Redis when signed in; phone and PC stay
  in step. Signed out (or no Redis configured) the app runs fully in local mode
  with JSON export/import from Settings.
- Sessions are HMAC-signed httpOnly cookies; passwords are scrypt-hashed; the
  signing secret is auto-generated and stored in Redis — **no auth env vars needed**.
  Details: [`docs/architecture/ADR-004-auth.md`](docs/architecture/ADR-004-auth.md).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # content + lesson integrity (also runs in prebuild)
npm run build      # full production build (333 static pages)
```

Node ≥ 20.9 (24.x recommended). Zero environment variables required.

## Deploy (GitHub → Vercel)

1. **Import** the repo at [vercel.com/new](https://vercel.com/new) — zero config, the build just runs.
2. *(Recommended — enables accounts + cross-device sync, ~2 minutes)*
   In the Vercel project: **Storage → Create Database → Upstash for Redis**
   (free tier is far more than enough) and link it. It injects
   `KV_REST_API_URL` / `KV_REST_API_TOKEN` automatically. Redeploy.
3. **Open the deployed app and register your account immediately** — the first
   account created is the admin. Pick your username and a strong password;
   everyone who registers later waits in your `/admin` approval queue.

Without step 2 the app still works fully in local mode.

## Project context (for future sessions)

- [`CLAUDE.md`](CLAUDE.md) — authority chain + hard rules.
- [`docs/spec/HANDOVER.md`](docs/spec/HANDOVER.md) — the authoritative product/curriculum spec.
- [`docs/research/`](docs/research/) — the 2026-08-21 research phase: frontier map, resource audit, dependency-graph design, curriculum audit, compute strategy, paper ladder, feasibility math, plus ten raw verified domain reports in `reports/`.
- [`docs/architecture/`](docs/architecture/) — ADRs (stack, persistence, content model, auth) + [`LEARNING-SYSTEM.md`](docs/architecture/LEARNING-SYSTEM.md) (lesson design system, widget catalog, quality rubric) + implementation plan.
- **Content is code:** the curriculum lives in [`src/content/`](src/content/) (lessons in `src/content/lessons/`), type-checked and integrity-validated (`scripts/validate-content.ts`) on every build — including the lesson rubric (≥4 active interactions, exactly one mastery gate, valid widget/connection references). Frontier developments land in `frontier.ts` with a "does the roadmap change?" verdict before any node edits.
