# ADR-003 — Content Model: Typed Data Modules as Single Source of Truth

**Status:** accepted · 2026-08-21

## Decision

All curriculum content (levels, skill nodes, resources, papers, projects, boss fights,
frontier entries, templates) ships as **typed TypeScript data modules** under `src/content/`,
validated by the types in `src/lib/types.ts`. No CMS, no database of content, no markdown
soup. User *progress* is the only mutable state and lives entirely client-side
(see ADR-002).

## Why

1. **The curriculum is the product.** It must be reviewable in diffs, editable in one place,
   and type-checked (a typo'd prerequisite id must fail the build, not silently break the
   unlock engine).
2. **Static content → static site.** Everything renders from imported data; Vercel serves it
   from the edge; the app works offline after first load.
3. **The graph is validated at build time.** A content integrity test walks every node:
   prerequisite ids exist, no cycles, every resource id referenced exists, hour sums match
   level budgets, every core node has a mastery test. Broken content cannot deploy.

## Schemas (canonical — mirrors HANDOVER §27–29)

- `SkillNode`: id, level, title, why, prereqs `{id, tier}[]`, hours, objectives[],
  intuition, equations[] (KaTeX strings), primary/backup/reference resource bindings with
  `sections` (exact chapters/videos), skip[], derivation, implementation, exercises[],
  masteryTest (per-tier criteria + skip-diagnostic), projectIds[], paperIds[],
  misconceptions[], unlocks (computed), tags (track, lab).
- `Resource`: id, title, authors, institution, year, type, url, difficulty, sections
  (study/skim/skip), hours, tier (primary/backup/reference), cost, lastVerified, notes.
- `Paper`: full card per HANDOVER §29 incl. reproduction plan, compute, status hooks.
- `Project` (P1–P22): purpose, prereq nodes, minimum/stretch spec, metrics, failure modes,
  research connection, portfolio artifact.
- `Boss`: level gate, scenario spec, pass criteria, remediation map (weakness → node ids).
- `FrontierEntry`: dated snapshot cards + "does the roadmap change?" verdict.

## Progress model (client state)

`NodeProgress { status, tier (bronze…research), confidence, startedAt, masteredAt,
reviewState (SM-2: interval/ease/due), independence (self-reported AI-assist level),
evidence (free-text link/notes) }` keyed by node id — plus session logs
`{date, minutes, block (math/impl/spec/project/review), nodeId?, independence}`,
experiment records, paper statuses, idea inbox, boss attempts. All timestamped for
merge (last-write-wins per entity) during device sync.

## Consequences

- Content updates = git commits (the Frontier Tracker's "roadmap change" workflow is a PR).
- The app can compute everything (unlocks, today's mission, readiness score, warnings)
  from `content + progress` pure functions in `src/lib/engine/` — trivially testable.
- Export/backup is one JSON blob of the progress store; content never needs export.
