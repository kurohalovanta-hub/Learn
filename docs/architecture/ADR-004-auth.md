# ADR-004 — Accounts, Approval & Per-User Progress

**Status:** accepted · 2026-08-21 · supersedes the `SYNC_SECRET` mechanism in ADR-002 §3
(ADR-002's layered local-first model is unchanged; only the identity layer is replaced).

## Requirements (user-stated)

1. Username + password login to track progress.
2. **The first registered user becomes admin** (auto-approved).
3. Subsequent registrations are **pending until an admin approves** them; unapproved users
   cannot log in or use the app.
4. The repo must remain **instantly deployable on Vercel** — importing the repo must build
   and run with zero manual configuration.

## Decision

**Upstash-Redis-backed credential auth with stateless HMAC session cookies; the app runs in
"local mode" (no accounts, browser-only progress) whenever the Redis integration is absent.**

- **Storage** (same Marketplace Upstash instance as ADR-002):
  - `user:{username}` → `{ username, hash, salt, role: "admin"|"user", approved, sv, createdAt }`
  - `users` → set of usernames · `auth:secret` → 32-byte signing secret, **auto-generated on
    first use and stored in Redis** (this is what keeps deployment zero-env: no AUTH_SECRET
    to configure).
  - `progress:{username}` → that user's ProgressData JSON.
- **Passwords:** `scrypt` (node:crypto, N=2^14, r=8, p=1) with 16-byte per-user salt;
  `timingSafeEqual` comparison. Username normalized (trim/lowercase, `[a-z0-9_-]{3,24}`).
- **Sessions:** signed token `base64url(payload).base64url(hmacSHA256(payload, secret))`,
  payload `{u, sv, exp}` (30 days). Set as `httpOnly; SameSite=Lax; Secure; Path=/` cookie.
  `sv` (session version) is bumped on password change / user deletion → instant revocation.
- **First-user rule:** registration executes under a short Redis lock (`SET NX` on
  `auth:bootstrap`); if `users` is empty the account is created `role=admin, approved=true`,
  otherwise `role=user, approved=false`.
- **Approval:** `/admin` page (admins only) lists users with approve / reject(delete) /
  promote / demote / reset actions via `/api/admin/users`. Login of an unapproved user fails
  with an explicit "awaiting approval" message.
- **Endpoints** (Node runtime route handlers): `POST /api/auth/register|login|logout`,
  `GET /api/auth/me`, `GET|PUT /api/progress`, `GET|POST /api/admin/users`. Light rate
  limiting on register/login (Redis `INCR`+`EXPIRE` per IP+username, 20/10 min).
- **Client:** the shell asks `/api/auth/me` once. `configured=false` → local mode (banner in
  Settings explains the 3-minute Upstash setup; everything else works, progress stays in the
  browser + export/import). `configured=true` and no session → full-screen **login gate**
  (serious, minimal: sign in / request access). Authenticated → per-user progress pulls and
  merge-pushes exactly as the old sync did (per-entity LWW), keyed by the session cookie.
  Local cache carries an `owner` stamp; switching users on one browser resets the local copy
  before pulling.

## Security posture (proportionate to a personal learning system)

Protects: progress data, account list, admin actions — all server-verified per request.
Static curriculum pages remain public CDN assets by design (the content is public research
material; the *product* gate is the client login wall). Not in scope: email flows, password
reset without admin, MFA, CSRF tokens beyond SameSite=Lax (state-changing endpoints are
JSON-only + same-origin fetches). Documented residual risk: anyone can *view* curriculum
HTML without an account; no personal data lives there.

## Rejected alternatives

- **NextAuth/Auth.js + OAuth:** heavier dependency surface, external provider setup breaks
  "instant deploy", and username/password with approval is the explicit requirement.
- **AUTH_SECRET env var:** one more manual step per deploy; Redis-stored secret achieves the
  same with zero config (rotating it logs everyone out — acceptable and documented).
- **Middleware (proxy.ts) gating of all routes:** requires per-request Redis reads or edge
  secret distribution; adds latency and breaks static caching for no real confidentiality
  gain (content is public research material). Client gate + authenticated data APIs give the
  required UX with honest server-side protection where it matters.
