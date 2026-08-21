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
   (`/api/sync`) backed by Upstash Redis provisioned through the Vercel Marketplace
   (free tier: 256 MB / 500K commands/mo — a solo learner uses ~1–2%). Identity = a
   **`SYNC_SECRET`** environment variable the user sets once in Vercel (any long random
   string) and pastes into the app's Settings on each device; the route rejects requests
   whose `x-sync-secret` header doesn't match. No accounts, no email, no OAuth.
   - Push: debounced (~4 s after mutation) `SET progress:v1` with the serialized store +
     monotonic `rev` + per-entity `updatedAt`.
   - Pull: on load/focus/interval; conflict resolution = per-entity last-write-wins merge
     (node progress, paper statuses, settings: LWW by `updatedAt`; session logs,
     experiments, ideas: append-only union by id).
   - If env vars are absent the route returns 501 and the UI shows Layer 2 guidance —
     the app never breaks without the integration.

## Why not the alternatives

- **Supabase magic-link auth:** real auth for one user is ceremony; another dashboard,
  another failure mode, and email deliverability issues for zero benefit here.
- **GitHub-repo-as-database (commit progress JSON):** requires a PAT in the browser or an
  OAuth app; write latency and merge conflicts; rejected.
- **Vercel Postgres/Neon:** schema + migrations for one JSON blob; overkill.
- **localStorage only:** fails the cross-device requirement.

Threat model note: the secret gates a single JSON blob of personal learning progress on a
free KV tier — a shared-secret header is proportionate. It travels only in a header over
HTTPS, never in URLs, and is rotatable (change the env var, redeploy, re-paste).

## §4 Provider binding (verified 2026-08-21)

Upstash Redis via Vercel Marketplace (Storage tab → Create Database → Upstash for Redis →
link project → redeploy). Vercel injects `KV_REST_API_URL` / `KV_REST_API_TOKEN` (plus
`KV_URL`, read-only token). **Gotcha (verified): `Redis.fromEnv()` looks for
`UPSTASH_REDIS_REST_*` and silently fails with the Marketplace names** — the route
initializes explicitly and accepts both naming conventions to survive renames. Client:
`@upstash/redis@1`. Setup steps live in `README.md` §Deploy.
