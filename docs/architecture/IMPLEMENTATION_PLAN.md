# Implementation Plan — "EMBODIED // OS"

**2026-08-21 · executes after the research phase (docs/research/) · stack per ADR-001/002/003.**

## 1. Product shape

A PC-first, dark, mission-control web app that answers **"WHAT DO I DO NEXT?"** from any
screen in one glance. All curriculum content static + typed; all progress client-side with
optional keyed sync. Deploy: GitHub → Vercel, zero config; optional Upstash integration.

## 2. Repository layout

```
src/
  app/                      # Next 16 App Router
    layout.tsx  page.tsx    # shell + Dashboard
    today/  tree/  levels/ (+ levels/[id])  node/[id]/
    projects/  papers/  labs/  experiments/  frontier/
    ideas/  review/  weekly/  bosses/  settings/
    api/sync/route.ts       # Upstash keyed sync (501 without env)
  content/                  # SINGLE SOURCE OF TRUTH (typed data)
    levels.ts  nodes/L0..L16.ts (index in nodes/index.ts)
    resources.ts  papers.ts  projects.ts  bosses.ts
    frontier.ts  templates.ts  tutorPrompts.ts  schedule.ts (phase bands)
  lib/
    types.ts                # all schemas (HANDOVER §27–29 mirrored)
    engine/
      graph.ts              # adjacency, cycle check, unlock evaluation, layout
      mastery.ts            # tiers, gate logic, XP, ranks, readiness score
      scheduler.ts          # today's mission from graph frontier + day template
      review.ts             # SM-2 style spaced repetition queue
      metrics.ts            # streaks, hours, independence %, failure-mode warnings
      pacing.ts             # day-of-program vs expected-band overlay
    store.ts                # Zustand store (progress, logs, settings) + persist + merge
    sync.ts                 # debounced push/pull client for /api/sync
  components/               # ui/ primitives + feature components (SkillTree, NodeCard, …)
scripts/validate-content.ts # graph integrity checks, run in build ("prebuild")
```

## 3. Engine contracts (pure functions over content + progress)

- `nodeState(id): locked | available | learning | review_due | mastered(tier)` — prereq
  edges carry min tiers; Gold edges enforce the "no framework before first principles" rule.
- `todaysMission()`: picks per-track candidates (math/code/spec) from the unlocked
  frontier, ordered by (phase-band fit, critical-path membership, started-first), plus
  active project step, due reviews, and the day's mastery check. Deterministic given state.
- `readinessScore()`: weighted mastery over the 23 capstone criteria (HANDOVER §31 mapped
  to node clusters), shown 0–100 with per-cluster radar.
- `rank()`: 0–10 ladder (§21), each rank = explicit evidence requirements (nodes at
  tier + bosses passed + projects shipped), never hours watched.
- `warnings()`: failure-mode detectors (§26) computed from logs — consumption:creation
  ratio, AI-independence trend, review debt, frontier-obsession (papers opened above
  unlocked level), stalled project days, pacing drift.
- `reviewQueue()`: SM-2 intervals on mastered nodes' retrieval prompts; boss failures
  spawn remediation quests (nodes reset to review with linked weaknesses).

## 4. Content inventory (authored in this order)

1. `levels.ts` — 17 levels: goal, exit criteria, boss link, phase window.
2. `nodes/` — ~166 nodes exactly as designed in docs/research/02 (ids stable), each with
   full §28 schema; resource bindings from docs/research/01; equations in KaTeX.
3. `resources.ts` — ~90 entries (§27 fields, lastVerified=2026-08-21).
4. `papers.ts` — the 62-paper ladder (docs/research/05) with §29 cards.
5. `projects.ts` — P1–P22 ladder (§12) incl. PandaKin spec, PushT comparison, capstone.
6. `bosses.ts` — 8 boss fights (§22) with pass criteria + remediation maps.
7. `frontier.ts` — ~18 seeded entries from docs/research/00 §4.
8. `templates.ts` — §19 research templates; `tutorPrompts.ts` — §11 prompts.
9. `schedule.ts` — month/phase bands mapping day-of-program → expected level window
   (pacing overlay only; never a lock).

## 5. Pages (PC-first; usable ≥1024px, responsive down to tablet)

- **Dashboard `/`**: Day X/210 + phase, rank + XP, streak, focused hours, readiness
  score + radar, current project/paper, today's mission summary, warnings, next unlocks.
- **Today `/today`**: the §20 sequence (objective → why → prereqs → learn → derive → code
  → build → test → review → ship) rendered as a checklist with per-block time budgets;
  session logger (minutes, block, independence level); mastery check; "ship" note.
- **Skill Tree `/tree`**: SVG graph, pan/zoom, level bands, status colors, edge tiers;
  click → node panel.
- **Node `/node/[id]`**: full card — why, objectives, equations, resources with exact
  sections, derivation, implementation, exercises, mastery test with tier claim +
  evidence + independence, skip-diagnostic, misconceptions, unlocks.
- **Levels `/levels`**: syllabus browser with per-level progress and boss status.
- **Projects, Papers (kanban), Experiments (§19 log), Frontier, Ideas, Review (retrieval
  queue), Weekly (§23 ritual with generated prompts), Bosses, Labs** (five lab lenses
  filtering the same graph: math/code/robotics/ml/embodied), **Settings** (sync, export/
  import, danger zone).
- Global: command-palette-style quick search (client-side index over nodes/papers/
  resources/projects); keyboard `/` focus.

## 6. Build order

1. Scaffold (create-next-app 16, Tailwind 4, fonts, theme tokens, lint) → deployable hello.
2. `types.ts` + content skeleton (levels + a few nodes) + validation script.
3. Engine (graph/mastery/scheduler/review/metrics) with unit-testable pure functions.
4. Store + sync route + export/import.
5. Pages in order: Dashboard → Today → Tree → Node → Levels → Papers → Projects →
   Bosses → Experiments → Review → Weekly → Frontier → Ideas → Labs → Settings.
6. Full content authoring pass (the long pole — nodes L0→L16, papers, projects).
7. Validation + `npm run build` green + README deploy guide → push.

## 7. Definition of done

- `npm run build` succeeds clean (Turbopack), no ESLint errors.
- Content validator passes: no dangling prereq/resource/paper ids, no cycles, hour sums
  within level budgets, every node has mastery test + primary resource, every boss's
  remediation ids exist.
- Fresh clone → `npm i && npm run dev` works with zero env vars.
- Vercel import → deploys with zero config; adding Upstash + `SYNC_SECRET` enables sync.
- Progress export/import round-trips; sync merge honors per-entity LWW + append unions.
- The dashboard answers "what do I do next?" with a concrete node/task at every state of
  progress (empty, mid-program, gate-blocked, review-due, Month-7 research mode).
- Month-7 switch: when research mode activates (Day ≥180 or VLA Boss passed), Dashboard
  and Today re-skin to the research loop (§30) with experiment log requirement.
