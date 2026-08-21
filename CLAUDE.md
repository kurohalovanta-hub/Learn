# EMBODIED // OS — project context

A 210-day zero→embodied-intelligence-researcher learning operating system: a Next.js web
app whose content is a mastery-gated skill dependency graph, built for one fast learner.

## Authority chain (read in this order)

1. `docs/spec/HANDOVER.md` — the authoritative product + curriculum specification.
2. `docs/research/` — the 2026-08-21 research phase: frontier map (00), resource
   selections (01), dependency-graph design (02), curriculum audit (03), compute
   strategy (04), paper ladder (05), feasibility (06), and `reports/` (ten verified
   domain reports). **Curriculum decisions trace here; do not re-litigate them from
   memory — the field moves fast and these were live-verified.**
3. `docs/architecture/` — ADR-001 (stack), ADR-002 (persistence/sync), ADR-003
   (content model), IMPLEMENTATION_PLAN.md.

## Hard rules

- **Content single source of truth = `src/content/`** (typed TS). Docs explain *why*;
  content defines *what*. Progress is client-state only (Zustand persist + optional
  Upstash sync via `SYNC_SECRET`). No CMS, no content DB.
- **Mastery-gated, never calendar-gated.** The 210-day calendar is a pacing overlay.
  Tiers: Bronze→Silver→Gold→Platinum→Research; core nodes gate at Gold.
- Stack: Next 16 App Router + React 19 + Tailwind v4 CSS-first (dark-only, tokens in
  `globals.css` `@theme`) + Zustand 5 + KaTeX **pinned ^0.16**. No component libraries,
  no graph libraries (hand-rolled SVG tree). Node 24.
- 2026 gotchas: `proxy.ts` not `middleware.ts`; `await params/cookies()`; no `next lint`
  (run eslint directly); no `tailwind.config.js`; Upstash env vars are
  `KV_REST_API_URL`/`KV_REST_API_TOKEN` (never `Redis.fromEnv()`).
- Content edits must keep `scripts/validate-content.ts` green (`npm run validate`,
  also runs in `prebuild`): stable node ids, no dangling refs, no cycles.
- Deploy target: GitHub → Vercel zero-config, PC-first UI, works with zero env vars
  (sync degrades gracefully to export/import).

## Working agreements

- Curriculum changes = update `src/content/` + (if decision-level) a dated note in the
  relevant docs/research file. Frontier developments land as `frontier.ts` entries with
  a "roadmap change?" verdict before any node edits.
- Resource URLs live in content records with `lastVerified` dates — never buried in prose.
- Commands: `npm run dev` · `npm run build` · `npm run validate` · `npx eslint src`.
