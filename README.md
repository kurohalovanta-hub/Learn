# EMBODIED // OS

**A 210-day, mastery-gated learning operating system: zero → embodied-intelligence researcher.**

Built from a live-verified research pass over the August-2026 robot-learning frontier
(see [`docs/research/`](docs/research/)), then encoded as a dependency graph of
**149 skill nodes** across 17 levels, **92 verified resources** with exact sections,
a **63-paper ladder**, **22 cumulative projects**, and **8 boss fights** — served as a
dark, mission-control web app (PC-first, phone-first-class) that teaches **in-app**
and answers one question from every screen:

> **WHAT DO I DO NEXT?**

Its core design commitment (see [`docs/recalibration/`](docs/recalibration/)):
**it makes learning easier to start, and mastery impossible to fake.** Progress is
derived from an append-only evidence log — there is no button that sets a tier.

## What's inside

| Surface | What it does |
|---|---|
| **Today** | ONE current bottleneck: the capability you're buying today, the next few steps of its learning packet, a stuck-path with AI-tutor handoffs. Review/project rows stay collapsed below. Flips to the research loop in Month 7 |
| **Learning packets** | 42 nodes (the full L0→L2 foundation plus the deep-learning/robotics/RL spine) carry live-researched *shortest-sufficient* packets — exact video segments, exact reading sections, retrieval questions, graded practice, a build/derive artifact, and a closed-book prove-it with stated criteria. Sourced from [`docs/curation/`](docs/curation/) (72 per-node research records); every other node gets the same flow generated from its curated bindings |
| **Evidence-based mastery** | Every meaningful action (retrieval answer, practice outcome, built artifact, closed-book assessment, delayed review, transfer task) appends an evidence event. Tiers, semantic states, and "verified" are **derived** from that log: claims unlock next work immediately, but only *held retention ~2 days later* verifies them. AI-assisted work caps at Silver. Forgetting demotes — honestly, in both directions |
| **Lessons** (`/learn/*`) | 16 flagship interactive lessons (Python basics → vectors/matrices/eigen → backprop → attention → SO(3)/SE(3)/Jacobians → PID/Kalman → MDPs → BC/DAgger → VLA anatomy): intuition → formalism → honest derivations → predict/trace/missing/debug/write code exercises → misconceptions → retrieval → embedded mastery gate. Full-screen focus runner with keyboard + swipe |
| **Widgets** | 15 hand-rolled SVG instruments implementing the real equations — draggable vectors, matrix machines with eigenvectors, gradient-descent landscapes, backprop graph, attention heatmap, quaternion SO(3) with gimbal lock, planar arm FK/IK-DLS/Jacobian ellipse, live PID plant, Kalman heartbeat, value iteration, BC covariate-shift drift, π0-class VLA dataflow. All playable in **Labs** |
| **AI-tutor bridge** | Per-node session packets (goal, mastery bar, live evidence, mode contract — teach/diagnose/socratic/practice/debug/examine/defense/critic) you paste into Claude or ChatGPT; the tutor's structured summary pastes back in as evidence. Provider-neutral by design; contracts in [`tutor/`](tutor/) forbid the tutor from solving your mastery tasks |
| **Skill Tree** | Pan/zoom/pinch dependency graph; tap any node → "you are N prerequisite gates away" with the mastery path highlighted and hour totals |
| **Papers** | 63-paper ladder; every paper is a study page (readiness vs your live mastery, key equations, lineage, reproduction path) with **Defense Mode** — a closed-book interrogation that records defended/partial/undefended |
| **Dashboard / Field Manual** | Verified-capability count (claimed-but-unverified shown honestly beside it), verified-weighted readiness, warnings (including a binge detector that pauses celebrations), next unlocks — plus `/guide`, a 5-minute manual |
| **Projects / Bosses / Review / Weekly / Experiments / Ideas / Frontier** | Cumulative project ladder, boss criteria with per-criterion honesty gates, SM-2 retrieval queue (typed sketch before you may grade yourself), weekly ritual, pre-registered experiments, scored idea inbox, Aug-2026 frontier watchlist |

## Accounts & progress

- **First registered account becomes admin** (auto-approved). Every later account
  needs admin approval before it can sign in — approve from `/admin`.
- Per-user progress syncs continuously to Redis when signed in; phone and PC stay
  in step. The server union-merges evidence events by id, so concurrent devices
  can't clobber each other. Signed out (or no Redis configured) the app runs fully
  in local mode with JSON export/import from Settings.
- Sessions are HMAC-signed httpOnly cookies; passwords are scrypt-hashed; the
  signing secret is auto-generated and stored in Redis — **no auth env vars needed**.
  Details: [`docs/architecture/ADR-004-auth.md`](docs/architecture/ADR-004-auth.md).
- **Locked out / disaster recovery:** [`docs/recalibration/RECOVERY.md`](docs/recalibration/RECOVERY.md)
  — includes the `ADMIN_RESET_TOKEN` set→use→unset runbook (endpoint 404s while unset).
- **Settings → Export everything** produces your full backup plus a tutor-readable
  `CURRENT_STATE.md` — downloads you hold privately, never committed to this repo.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # content + lesson + packet integrity (also runs in prebuild)
npm run build      # full production build (334 static pages)
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
- [`docs/spec/HANDOVER.md`](docs/spec/HANDOVER.md) — the original product/curriculum spec, recalibrated by the documents below.
- [`docs/recalibration/`](docs/recalibration/) — the 2026-08-21 recalibration: production/repo audits, dopamine-loop failure analysis, evidence-model design, auth decision (Redis kept; Supabase triggers recorded), rebuild plan, ten-pass adversarial critique, recovery runbook.
- [`docs/curation/`](docs/curation/) — 72 per-node live-research records: the shortest sufficient path through free, legal resources, with exact segments and verification dates. Packets in `src/content/packets/` cite these.
- [`docs/research/`](docs/research/) — the 2026-08-21 research phase: frontier map, resource audit, dependency-graph design, curriculum audit, compute strategy, paper ladder, feasibility math, plus ten raw verified domain reports in `reports/`.
- [`docs/architecture/`](docs/architecture/) — ADRs (stack, persistence, content model, auth) + [`LEARNING-SYSTEM.md`](docs/architecture/LEARNING-SYSTEM.md) (lesson design system, widget catalog, quality rubric) + implementation plan.
- **Content is code:** the curriculum lives in [`src/content/`](src/content/) (lessons in `src/content/lessons/`, learning packets in `src/content/packets/`), type-checked and integrity-validated (`scripts/validate-content.ts`) on every build — lesson rubric and packet rubric included. Frontier developments land in `frontier.ts` with a "does the roadmap change?" verdict before any node edits.
