# ADR-001 — Web Stack

**Status:** accepted · 2026-08-21 · versions verified against npm/official docs (see `../research/reports/web-stack.md`)

## Decision

| Concern | Choice | Version | Notes |
|---|---|---|---|
| Framework | **Next.js App Router** | 16.x | Turbopack default for dev+build; Vercel zero-config; `proxy.ts` not `middleware.ts`; no `next lint` |
| UI | **React** | 19.x | |
| Language | TypeScript | 5.x | strict |
| Styling | **Tailwind CSS** | 4.x | CSS-first (`@import "tailwindcss"` + `@theme`); **dark-only design** (mission-control aesthetic — no theme toggle to maintain); `@tailwindcss/postcss` plugin; typography plugin via `@plugin` |
| State | **Zustand + persist** | 5.x | localStorage JSON storage, `skipHydration` + explicit rehydrate to avoid SSR mismatch; versioned `migrate` |
| Math | **KaTeX pinned `^0.16`** | 0.16.x | 0.18 broke CSS class names vs ecosystem; memoized `renderToString` component |
| Markdown | react-markdown 10 + remark-gfm 4 + remark-math 6 + rehype-katex 7 | — | wrap in `prose prose-invert` div (no className prop) |
| Skill tree | **Hand-rolled SVG** + build-time layered layout (own topological-layer algorithm; no dagre dependency needed at runtime) + pointer/wheel pan-zoom | — | ~170 nodes is trivial for SVG; full styling freedom; avoids @xyflow's 1.2 MB + bundled zustand v4 |
| Fonts | next/font/google: Inter (sans) + JetBrains Mono (mono) | — | variable fonts, self-hosted at build (offline-friendly), mapped via `@theme` |
| Cloud sync | Upstash Redis (Vercel Marketplace) + `@upstash/redis@1` | — | see ADR-002; explicit env init (`KV_REST_API_URL`/`KV_REST_API_TOKEN`), `SYNC_SECRET` header |
| Node | 24.x | — | Vercel default; `engines` pinned |
| Lint | ESLint 9 flat config (next config) | — | run directly (`next lint` removed in 16) |

## Key rationale

1. **Next.js over Vite SPA**: the sync API needs a serverless route; Vercel treats Next as
   first-class zero-config; App Router static rendering keeps every content page
   pre-rendered and fast. All curriculum pages are static; only `/api/sync` is dynamic.
2. **Dark-only**: the design language is a research command center; a single deliberate
   palette (defined as `@theme` tokens) is cheaper to keep excellent than two.
3. **Hand-rolled SVG graph**: the dependency graph is static content — layout computed at
   build/import time from the typed graph, rendered as styled SVG with a ~100-line
   pan/zoom. No graph library earns its bundle weight here.
4. **No component library**: the aesthetic is bespoke; Tailwind tokens + a small set of
   shared primitives (Card, Badge, ProgressRing, Kbd) keep it coherent.
5. **Content as code** (ADR-003) means no data fetching anywhere — pages import typed
   modules; the client bundle contains the curriculum, which also makes the app work
   offline after first load.

## 2025→2026 gotchas honored in this repo

Awaited `params`/`searchParams`; no `middleware.ts`; Turbopack-compatible config only;
Tailwind v4 CSS-first (no `tailwind.config.js`, no `darkMode` key); KaTeX pinned;
`@xyflow`/`dagre` not used; Node 24 engines; ESLint invoked directly.
