# 05 — Auth, Data & Backup Audit
Date: 2026-08-21 · Authority: HANDOVERFINAL §35–38, §64–67. Per §35: "Do not migrate just for
fashion. Document the tradeoff and choose based on reliability/maintainability."

## Current architecture (verified in code)

- **Auth:** scrypt password hashing (16-byte salt, timingSafeEqual), HMAC-SHA256 session tokens in
  httpOnly SameSite=Lax Secure cookies (30d), session-version bump for global revocation, signing
  secret auto-generated into Redis via `SET NX` (atomic; also used for first-admin bootstrap and
  username reservation — race-safe), rate limiting via INCR+EXPIRE windows. First user = approved
  admin; later users pending; admin approve/revoke/delete/promote/reset-password with
  self-protection. Server-side authorization on every data API (`requireSession`/`requireAdmin`).
- **Data:** one JSON blob per user at `progress:{username}` behind cookie-authed
  `GET/PUT /api/progress`; client Zustand store with schema versioning + migration + per-entity
  LWW merge; owner-stamp reset on account switch; graceful zero-env local mode.
- **What's genuinely good:** zero-env deployability, atomic bootstrap, no plaintext secrets, no
  secrets in browser, real server-side authz on data. §66's required behavior already exists and
  is race-safe.

## §35 requirements scorecard

| Requirement | Redis (current) | Notes |
|---|---|---|
| email+password | username+password | email optional per spec ("optional username/display name" implies email primary; current is username-primary — acceptable for one learner, revisit if recovery-by-email is wanted) |
| first-account admin, atomic | ✅ `SET NX` | verified |
| pending/approval/revoke | ✅ | verified |
| secure reset/recovery | ⚠️ admin-set only | no self-serve email recovery (no email infra); admin reset exists; single-learner risk = admin forgets own password → runbook procedure below |
| server/database authorization | ✅ cookie-authed APIs | equivalent of RLS at the API layer; there is no direct DB exposure |
| row-level security | N/A (no SQL) | per-user keys + API authz achieve the same isolation property |
| separate per-user data | ✅ | `progress:{u}`, `user:{u}` |
| no plaintext passwords / secrets in browser | ✅ | scrypt; HMAC secret server-side only |

## The decision: harden Redis now; defer Supabase with a documented trigger list

**Chosen:** keep the Redis architecture for this recalibration, harden it, and isolate the data
layer behind a small repository interface so a later Supabase migration is a swap, not a rewrite.

**Why not migrate now (the honest tradeoff):**

1. **Scale truth:** this is a 1–5 user product. 210 days of evidence events for one learner is
   a few thousand small records — megabytes at most. Nothing here needs SQL to be reliable.
2. **Risk asymmetry:** a mid-recalibration auth migration risks the learner's existing progress
   and login continuity for zero user-visible benefit this month; the top product risks (mastery
   validity, curation, Today) are elsewhere. §68 Risk 1 explicitly warns against spending weeks
   on data architecture before Day 1 works.
3. **Deployability regression:** Supabase makes env vars mandatory and adds a second vendor;
   the current zero-env → one-click-Upstash path is a real asset for this deployment story.
4. **Durability facts:** Upstash Redis is disk-persisted (not cache-mode); the free tier does not
   evict; data survives Vercel redeploys trivially since app state lives outside the app (§67 ✅).
5. **What Supabase would actually buy today:** SQL queries over evidence (not needed at this
   volume — the client holds full state), email-based self-recovery (real but small for one
   admin-learner), managed backups (replicated below at app level).

**Triggers that flip the decision** (recorded so this isn't dogma): >~20 users; need for
cross-user queries/analytics; need for email self-serve recovery; evidence log outgrowing a
per-user blob (~5 MB); or any Upstash reliability incident. The rebuild plan keeps all evidence
I/O behind `src/lib/server/progress-repo.ts` so the swap surface is one file + migrations.

## Hardening + §36/§38 obligations in this recalibration

1. **Evidence-safe persistence:** schema v3 moves to `{snapshot, events[]}` per user with
   server-side append semantics for events (PUT carries new events + snapshot; server unions by
   event id — closes the multi-device LWW hole for the new append-only data).
2. **`.env.example`** documenting `KV_REST_API_URL` / `KV_REST_API_TOKEN` (+ fallbacks) and what
   happens with none set (local mode).
3. **Export Everything (§38):** one-click JSON (full state) + Markdown (human-readable capability
   record) from Settings; restore = import with schema migration; both tested.
4. **Recovery runbook (`docs/recalibration/RECOVERY.md` section below):** admin password reset via
   a one-off `ADMIN_RESET_TOKEN` env var path (set var → visit endpoint → reset → unset), covering
   the "only admin locked out" case without email infra.
5. **Public-repo privacy (§64–65):** learner-state exports are downloads by default, never
   auto-committed; tutor handoff files in-repo contain schema/instructions only, no personal data;
   this choice is documented in the README and Settings.
6. **No production reset paths:** no table/blob wipe endpoints exist; `resetAll` remains a
   client-local action requiring typed confirmation and never touches other users.

## Disaster recovery (summary; full steps ship in-repo)

- **Redis lost:** restore from latest JSON export (Settings → Import) → PUT re-syncs; accounts
  re-register (first user re-bootstraps admin atomically).
- **Vercel project lost:** re-import repo (zero-config), re-link Upstash, done — no app state
  lives in Vercel.
- **Repo lost:** GitHub is the source of truth for code/content; progress lives in Redis + user
  exports. All three stores are independent by design.
