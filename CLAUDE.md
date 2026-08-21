# EMBODIED // OS — project context

A 210-day zero→embodied-intelligence-researcher learning operating system: a Next.js web
app whose content is a mastery-gated skill dependency graph with full in-app interactive
lessons, built for one fast learner (PC-first, phone first-class).

## Authority chain (read in this order)

1. `docs/spec/HANDOVER.md` — the authoritative product + curriculum specification.
2. `docs/research/` — the 2026-08-21 research phase: frontier map (00), resource
   selections (01), dependency-graph design (02), curriculum audit (03), compute
   strategy (04), paper ladder (05), feasibility (06), and `reports/` (ten verified
   domain reports). **Curriculum decisions trace here; do not re-litigate them from
   memory — the field moves fast and these were live-verified.**
3. `docs/architecture/` — ADR-001 (stack), ADR-002 (persistence/sync), ADR-003
   (content model), ADR-004 (accounts/auth), LEARNING-SYSTEM.md (lesson design system,
   widget catalog, quality rubric), IMPLEMENTATION_PLAN.md.

## Hard rules

- **Content single source of truth = `src/content/`** (typed TS). Docs explain *why*;
  content defines *what*. Lessons are typed data in `src/content/lessons/` (manifest =
  light metadata, registry = dynamic imports; both must stay in sync — the validator
  enforces it). No CMS, no content DB.
- **Mastery-gated, never calendar-gated.** The 210-day calendar is a pacing overlay.
  Tiers: Bronze→Silver→Gold→Platinum→Research; core nodes gate at Gold. Progress =
  capability, never time; all claims are self-graded honestly and heavy-AI-assisted
  claims cap below Gold.
- **Auth (ADR-004):** first registered user is admin; later users need approval.
  scrypt passwords, HMAC session cookies, secret auto-generated into Redis (`SET NX`)
  — zero env vars. Upstash env names `KV_REST_API_URL`/`KV_REST_API_TOKEN` (never
  `Redis.fromEnv()`). No Redis ⇒ graceful local mode. Per-user progress at
  `progress:{username}` via cookie-authed `/api/progress`.
- Stack: Next 16 App Router + React 19 + Tailwind v4 CSS-first (dark-only, tokens in
  `globals.css` `@theme`) + Zustand 5 + KaTeX **pinned ^0.16** + react-markdown/remark-math.
  No component libraries, no graph libraries — tree, widgets and all visualizations are
  hand-rolled SVG (`src/components/widgets/`, toolkit.tsx primitives).
- Widgets implement the **real equations** (real eigensolves, real DLS iterations, real
  240 Hz plant integration) — simplified in scope, never faked in dynamics. New widget =
  component + `widgets/ids.ts` + `widgets/registry.ts` (ssr:false dynamic import).
- 2026 gotchas: `proxy.ts` not `middleware.ts`; `await params/cookies()`; no `next lint`
  (run eslint directly — react-hooks compiler rules are errors: no ref reads during
  render); no `tailwind.config.js`; JSX attribute strings do NOT process backslash
  escapes (write `tex="\alpha"` in JSX, `"\\alpha"` in TS data).
- Content edits must keep `scripts/validate-content.ts` green (`npm run validate`, also
  in `prebuild`): stable ids, no dangling refs, no cycles, and the lesson rubric
  (manifest↔module cross-checks, valid widget ids, ≥4 active interactions, exactly one
  mastery block per lesson).
- Deploy target: GitHub → Vercel zero-config; works with zero env vars (local mode);
  Upstash Marketplace Redis enables accounts + sync.

## Working agreements

- Curriculum changes = update `src/content/` + (if decision-level) a dated note in the
  relevant docs/research file. Frontier developments land as `frontier.ts` entries with
  a "roadmap change?" verdict before any node edits.
- New lessons follow the LEARNING-SYSTEM.md §2 schema and §5 rubric: intuition →
  formalism → derivation → implementation → application → research connection; honest
  derivations; commit-before-reveal checks; exact robotics connections; no filler.
- Resource URLs live in content records with `lastVerified` dates — never buried in prose.
- Commands: `npm run dev` · `npm run build` · `npm run validate` · `npx eslint src`.
