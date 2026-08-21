# 00 — Existing Product Audit
Date: 2026-08-21 · Auditor: adversarial five-critic pass over repo + production build (commit `ce75ebc`)
Authority: HANDOVERFINAL.md §1–2. This document records the state of the product **before** the recalibration.

## Scope and method

- Full static audit of `src/` (store, engine, lesson system, widgets, pages, auth).
- Dynamic verification: the mastery engine was **executed** against simulated states (`npx tsx`)
  to measure what the reward system actually pays for.
- Production crawl: `milanhalo.me` is egress-blocked from this sandbox; the crawl was performed
  against a local production build (`next start`) of the same commit the production branch serves,
  at 1600 px and 390 px viewports, across all primary routes (dashboard, today, tree, node, learn,
  labs, papers, paper detail, defend, guide, review, settings, admin, login gate). Screenshots
  were reviewed for both breakpoints. Constraint noted per §1.13.
- Five independent adversarial lenses: behavioral exploitation, pedagogy, spec alignment,
  210-day durability, recalibration design.

## Inventory (what exists and is worth preserving)

| Asset | State | Verdict |
|---|---|---|
| Dependency graph: 149 nodes / 17 levels, cycle-checked, tier-gated edges | `src/content/nodes/` + validator | **Preserve** — genuinely researched, live-verified Aug 2026 |
| 92 resources, 63-paper ladder, 22 projects, 8 bosses | `src/content/` | **Preserve**, re-granularize (see 02) |
| 16 interactive lessons (intuition→derivation→implementation bands) | `src/content/lessons/` | **Preserve** — instruction-shaped, not summaries; integrate into packets |
| 15 SVG instruments implementing real equations | `src/components/widgets/` | **Preserve** — the strongest artifact in the repo |
| Lesson runner, tree visualization, paper views, defense runner, experiment tracker | `src/components/`, `src/app/` | **Preserve** infrastructure; recalibrate the mechanics they gate |
| Content validator in prebuild (ids, cycles, lesson rubric) | `scripts/validate-content.ts` | **Preserve and extend** to packets |
| Auth: scrypt + HMAC cookie + Redis, first-user-admin, approval queue | `src/lib/server/auth.ts`, `/api/*` | **Preserve short-term** (see 05) |
| SM-2 review queue, warnings engine, pacing overlay | `src/lib/engine/` | **Preserve**, rewire inputs to evidence |

## Headline defects (full evidence in 01/03)

1. **Mastery is a one-click self-award.** `claimTier` (`src/lib/store.ts:102–126`) validates
   nothing — not evidence, not prerequisites, not time. All locking is cosmetic UI `disabled=`.
2. **The entire reward inventory is exhaustible in under an hour.** Executed result: claiming all
   149 nodes at "research" tier (level order defeats every gate; only 2 root nodes) = 15,240 XP,
   Rank 10 "Independent Researcher", readiness 100/100, ~149 full-screen celebrations. Bosses
   pass by one button; papers reach DEFENDED in ~12 clicks each; projects "ship" by checkbox.
3. **XP pays for inflation.** Research-tier multiplier (1.5×) is claimable on day 1; the schedule
   pays 50% more for the maximal lie. This directly violates the constraint that capability
   evidence must dominate (HANDOVERFINAL §2.4).
4. **Interactive depth covers ~2.3% of the curriculum.** 16/149 nodes have lessons (~22 h of
   guided material against 947 node-hours); zero lessons in L0, L7–L9, L13–L16. Elsewhere a node
   is a why-paragraph + external link + claim button.
5. **The product goes static exactly when the material gets hardest.** `/today` serves
   byte-identical step copy daily; the final 30-day research phase renders a fixed 4-line
   checklist; the last lesson appears ~day 148.
6. **Anti-illusion machinery is partly dead code.** Missed lesson checks are stored and read by
   nothing; review "failed" only decrements a cosmetic confidence value — a claimed tier is
   permanent regardless of demonstrated forgetting.
7. **Honesty defaults are backwards.** The independence dropdown defaults to "independent";
   the reset button sits beside the claim buttons enabling an infinite claim→reset→celebrate loop.

## What the audit is obliged to concede

- The celebration only fires on a genuine gate crossing (`engine/delta.ts`) — correct design,
  defeated by adjacent reset.
- MCQ answers auto-grade; revealing a code answer without committing is auto-recorded as a miss;
  the lessons repeatedly instruct blank-page reproduction. The *intent* was honest; the
  *enforcement* was prose.
- The warnings engine (tutorial-hell, AI-dependence, pacing drift) is real and well-designed —
  but consumes only self-reported inputs, and has no detector for the actual persona's failure
  mode (many claims, few hours).

## Production/deployment state

- Vercel project `embodied-os` exists, git-linked to `kurohalovanta-hub/Learn`; production domain
  `milanhalo.me`; deploys follow pushes to the working branch. 333 static pages; build, lint and
  content validation green at audit time.
- Zero-env local mode works; Upstash Redis enables accounts + per-user progress blob
  (`progress:{username}`, cookie-authed API).

## Conclusion

The curriculum spine, instruments, and infrastructure are worth keeping. The truth layer is not:
every gate in the system is currently a door painted on a wall. The recalibration replaces
self-awarded tiers with evidence-derived state (03, 06), re-granularizes resources into
shortest-sufficient packets (02, `docs/curation/`), and rebuilds the daily surface around one
bottleneck (06). Nothing in this audit justifies discarding the existing research or interactive
work — HANDOVERFINAL §57 is respected throughout.
