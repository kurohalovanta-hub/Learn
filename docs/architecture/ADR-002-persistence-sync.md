# ADR-002 — Progress Persistence: Local-First with Optional Keyed Cloud Sync

**Status:** accepted · 2026-08-21 · (exact provider bindings verified in §4)

## Requirements

- Deploy path is GitHub → Vercel (hobby tier), single user, PC-first.
- Progress must survive: browser restarts, device switches, and the user's own mistakes
  (export/backup per HANDOVER §32.25).
- A beginner must be able to deploy without building an auth system. Zero mandatory
  third-party accounts beyond GitHub/Vercel.

## Decision: three layers, graceful degradation

1. **Layer 1 — Local-first (always on).** The entire progress store persists to
   `localStorage` via Zustand `persist` middleware (progress JSON is small — tens of KB;
   IndexedDB complexity is not justified). The app is fully functional with no backend.
2. **Layer 2 — File export/import (always on).** One-click download/restore of the full
   store as versioned JSON (`ei-progress-YYYY-MM-DD.json`), with schema-version migration
   on import. This is the guaranteed cross-device path even with zero configuration.
3. **Layer 3 — Keyed cloud sync (optional, recommended).** A serverless route
   (`/api/sync`) backed by a Redis KV store provisioned through the Vercel Marketplace
   (Upstash free tier). Identity = a generated high-entropy **sync key** (displayed once,
   stored locally; the user pastes it on a second device). No accounts, no email, no OAuth.
   - Push: debounced (~4 s after mutation) `SET sync:{key}` with the serialized store +
     monotonic `rev` + per-entity `updatedAt`.
   - Pull: on app focus/interval; conflict resolution = per-entity last-write-wins merge
     (entities: node progress records, session logs (append-only union), experiments,
     papers, ideas, settings). Append-only collections union by id; scalar maps LWW.
   - If env vars are absent the route returns 501 and the UI shows Layer 2 guidance —
     the app never breaks without the integration.

## Why not the alternatives

- **Supabase magic-link auth:** real auth for one user is ceremony; another dashboard,
  another failure mode, and email deliverability issues for zero benefit here.
- **GitHub-repo-as-database (commit progress JSON):** requires a PAT in the browser or an
  OAuth app; write latency and merge conflicts; rejected.
- **Vercel Postgres/Neon:** schema + migrations for one JSON blob; overkill.
- **localStorage only:** fails the cross-device requirement.

Threat model note: the sync key gates a single JSON blob of personal learning progress on a
free KV tier — passphrase-keyed storage is proportionate. The key is ≥128-bit random,
never in URLs (POST body/header only), and rotatable (re-key + re-push, old blob expires
via TTL refresh on write; blobs carry a 90-day sliding TTL).

## §4 Provider binding (verified 2026-08-21)

Upstash Redis via Vercel Marketplace. Exact env vars and setup steps are recorded in
`README.md` §Deploy and consumed by `src/app/api/sync/route.ts`; both REST-variable naming
conventions (`KV_REST_API_URL`/`KV_REST_API_TOKEN` and `UPSTASH_REDIS_REST_URL`/
`UPSTASH_REDIS_REST_TOKEN`) are accepted by the route to survive marketplace renames.
