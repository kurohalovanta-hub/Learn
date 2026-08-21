# Research Report — Web Stack Verification (2026-08-21)

> Produced by a dedicated research agent; versions checked against npm registry, official docs source repos, and multiple current sources on 2026-08-21.

## Verified versions & choices

1. **Next.js 16.3.1** (npm latest). Node ≥20.9, TS 5.1+, React **19.2.8**. App Router default; **Turbopack default for dev AND build** (custom webpack config fails the build unless `--webpack`). Breaking 15→16 relevant here: `await params/searchParams/cookies()`; **`middleware.ts` → `proxy.ts`**; **`next lint` removed** (run ESLint directly); `next/image` defaults changed. Vercel zero-config unchanged.
2. **Tailwind CSS 4.3.3** + `@tailwindcss/postcss` 4.3.3 (PostCSS plugin, NOT the Vite plugin, for Next). CSS-first config: `@import "tailwindcss";` + `@theme {...}`; no tailwind.config.js, no `@tailwind` directives, no `darkMode:` key. Dark-mode manual toggle via `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` — or design **dark-only** for a mission-control UI (simplest). Typography plugin 0.5.20 via `@plugin "@tailwindcss/typography";` (`prose prose-invert`).
3. **Zustand 5.0.15** — still the lightweight standard; `persist` middleware built in (`createJSONStorage`, `partialize`, `version`/`migrate`, `skipHydration`, `onRehydrateStorage`). Next SSR note: `skipHydration: true` + rehydrate in `useEffect` (or gate on hasHydrated) to avoid hydration mismatch.
4. **Persistence on Vercel Hobby (verified Aug 2026):**
   - **Vercel KV is GONE** (deprecated; migrated to Upstash Dec 2024; `@vercel/kv@3` carries deprecation notice). **Vercel Postgres GONE** (→ Neon marketplace).
   - **Pick: Upstash Redis via Vercel Marketplace** (Storage tab → Create Database → Upstash for Redis → link → redeploy). Free tier: **256 MB, 500K commands/mo**, 10 GB bandwidth, 10 MB max request. Env vars injected: `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`. **`Redis.fromEnv()` will NOT find these** (it wants `UPSTASH_REDIS_REST_*`) — initialize explicitly with `KV_REST_API_URL`/`KV_REST_API_TOKEN`. Client: `@upstash/redis@1.38.2`.
   - Auth for single user: a **`SYNC_SECRET`** env var checked against a request header — no auth system needed. One user syncing every few minutes ≈ 1–2% of free-tier commands.
   - Supabase viable but free projects **pause after 7 days of DB inactivity** — wrong for a sometimes-idle personal app. Neon free: 0.5 GB. Vercel Blob Hobby: 1 GB.
5. **KaTeX: pin `katex@^0.16`** — npm latest is 0.18.4 but **0.18 renamed internal CSS classes** (`katex-` prefix, no compat flag; ecosystem reverted) and `rehype-katex@7.0.1` still pins ^0.16. Mixing versions renders broken math. CSS: `import "katex/dist/katex.min.css"` in root layout. For standalone formulas: memoized `katex.renderToString(expr, {throwOnError:false})` + `dangerouslySetInnerHTML`; skip `react-katex`.
6. **Markdown:** `react-markdown@10.1.0` + `remark-gfm@4.0.1` + `remark-math@6.0.0` + `rehype-katex@7.0.1` — stable unified-v11 set. No `className` prop since v9 — wrap in own `<div className="prose prose-invert">`.
7. **Graph (~200 nodes):** hand-rolled SVG + **build-time layout** is the pragmatic pick — run `@dagrejs/dagre@3.1.1` (maintained fork; original `dagre` abandoned) or elkjs in a Node script, ship x/y in content data; render plain React SVG (full styling freedom; 200 nodes trivial); pan/zoom via `d3-zoom`+`d3-selection` modular imports or ~100-line pointer/wheel handler. `@xyflow/react@12.11.3` only if wanting minimap/drag out of the box (1.21 MB unpacked, DOM-over-SVG model, bundles its own zustand v4 — fights custom aesthetics).
8. **Fonts:** `next/font/google` unchanged in 16. Inter + JetBrains Mono are variable fonts; map into Tailwind via `@theme { --font-sans: var(--font-inter); --font-mono: var(--font-jbmono); }`. Self-hosted at build → offline-friendly.
9. **Vercel Hobby limits:** 1M function invocations/mo, 100 GB transfer, 1M edge requests — a two-endpoint sync API is a rounding error. Limits pause (not bill). Non-commercial only. Serverless body limit ~4.5 MB.
10. **Node:** Active LTS = **24** (Vercel default 24.x; 20.x discontinued on Vercel 2026-10-01). Use `"engines": {"node": "24.x"}`.
11. **localStorage vs IndexedDB:** localStorage fine for hot few-KB–hundreds-KB state via Zustand persist (~5 MiB/origin quota). MB-scale → `idb-keyval@6.3.0` as async persist storage. Safari: `navigator.storage.persist()` supported since 15.2 — call once after a user gesture; Safari can still evict after ~7 days without visits (ITP) — which is why the server copy is the durable source of truth and browser storage is a cache.

## Gotchas a 2025-trained developer gets wrong

1. `middleware.ts` is now `proxy.ts`.
2. No sync `params`/`searchParams`/`cookies()` — everything awaited.
3. Turbopack builds by default; `next lint` no longer exists.
4. Tailwind: no config file, no `darkMode: 'class'`, no `@tailwind` directives — `@import "tailwindcss"`, `@theme`, `@custom-variant`, `@plugin`.
5. Vercel KV/Postgres don't exist — Marketplace Upstash/Neon; `@vercel/kv` deprecated.
6. `Redis.fromEnv()` silently fails with the Vercel Marketplace env names — pass `KV_REST_API_URL`/`KV_REST_API_TOKEN` explicitly.
7. Don't `npm i katex@latest` — pin `^0.16` to match rehype-katex.
8. Upstash free tier is 500K commands/**month** (not 10K/day).
9. Package names: `@xyflow/react` (not `reactflow`), `@dagrejs/dagre` (not `dagre`).
10. Set Node 24.x from day one.
11. Hobby pauses at limits; non-commercial only.
12. Supabase free pauses after 7 idle days — prefer Upstash for sometimes-idle personal apps.
