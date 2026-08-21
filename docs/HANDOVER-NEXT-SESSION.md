# HANDOVER — enable accounts on the live deployment (Vercel + Upstash Redis)

**For:** a fresh Claude session that has the **Vercel MCP connected** and can reach the
internet (this session had neither — outbound HTTPS was blocked and no Vercel
credentials were present, which is the only reason the work below is not already done).

**Repo:** `kurohalovanta-hub/Learn` · **Branch:** `claude/embodied-intelligence-research-s48jrg`
(all work goes here — never push to another branch without asking)
**Repo state at handover:** `9986c2b` · clean tree · `npm run validate`, `npm run build`
(334 pages) and `npx eslint src scripts` all green.

---

## 0. TL;DR — the one thing blocking accounts

**The auth system is finished, correct, and shipped. Nothing in the code needs fixing to
create accounts.** The deployment simply has no Redis attached, so the app runs in
"local mode" where the sign-in screen never appears.

```
src/lib/server/auth.ts:8
export function getRedis(): Redis | null {
  const url   = process.env.KV_REST_API_URL   ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;   // ← no Redis ⇒ no accounts, silently
  ...
```

`GET /api/auth/me` → `{configured:false}` → the client sets status `"local"` →
`AppShell` renders the app directly and **never mounts `LoginGate`**. That is why there
is no signup screen on the live site. Attach Redis and the login/registration screen
appears on its own — no code change required.

**Do task 1 first. It is the whole ask.**

---

## 1. TASK 1 — attach Upstash Redis and claim the admin account

### Vercel target
- Project name: **`embodied-os`** (team **VANTA**)
- Project id: **`prj_QnDvGDlAKcpnivJLmLienartVk4q`**
- Production domain: **`milanhalo.me`**
- Git-linked: deploys follow pushes to `claude/embodied-intelligence-research-s48jrg`

> Verify these against the MCP before acting — they are from an earlier session. If
> `list_deployments` / `get_project` 403s, say so rather than guessing; the project
> definitely exists (creating it again previously returned 409).

### Steps
1. **Vercel → project `embodied-os` → Storage → Create Database → Upstash for Redis**
   (free tier is far more than enough), and **link it to this project**. Do this via the
   Vercel MCP if it exposes storage/integration calls; otherwise walk the user through
   the dashboard clicks and confirm when they're done.
2. Confirm the integration injected these env vars into **Production**:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   (Fallback names `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` also work.)
   **Do not** use `Redis.fromEnv()` and do not rename these — `getRedis()` reads exactly
   these four names.
3. **Redeploy.** Env vars are only picked up by a new deployment. A redeploy never
   touches Redis data.
4. **Verify before telling the user anything:**
   ```bash
   curl -s https://milanhalo.me/api/auth/me
   # BEFORE: {"configured":false}
   # AFTER : {"configured":true,"bootstrapped":false,"user":null}
   ```
   `configured:true` + `bootstrapped:false` = Redis is live and no account exists yet.
5. **Tell the user to open the site and register immediately.** They will land on a
   "first boot — Commission this system" screen with the copy *"No accounts exist yet.
   The first account becomes the administrator."* The username they want is
   **`milanhalo`**; they will type their own password.

### ⚠️ Security: the admin slot is a land-grab, and the site is public
Registration is open, and **whoever registers first becomes admin** (auto-approved).
Between step 3 and the user registering, anyone who loads `milanhalo.me` can take the
admin account. So:
- Do step 3 and step 5 **back-to-back**, ideally with the user present.
- Right after they register, confirm the slot is closed:
  `curl -s https://milanhalo.me/api/auth/me` → `"bootstrapped":true`.
- If someone else got there first, the fix is: delete the stray user from Redis (or
  flush the `users` set and `user:*` keys) and re-register. Then consider the hardening
  in §5.
- **Never put the user's password in a commit, a PR body, a comment, or any file in this
  public repo.** A previous session was offered the password and correctly refused to
  hardcode it. Keep that rule.

---

## 2. How the auth system already works (read before "fixing" anything)

| Concern | Implementation |
|---|---|
| First user | `POST /api/auth/register` → `userCount()` is `SCARD users`; the atomic name reservation writes `user:<name>` but **not** the `users` set, so the count is genuinely 0 for the first registrant → `role:"admin", approved:true`. Verified by reading; not yet run against real Redis. |
| Later users | Created with `approved:false` → login returns 403 `{pending:true}` → admin approves at `/admin`. |
| Passwords | scrypt, random 16-byte salt, 64-byte derived key, `timingSafeEqual` compare. Min 8 chars. Username normalized to lowercase, must match `/^[a-z0-9_-]{3,24}$/`. |
| Sessions | HMAC-SHA256 signed token in an httpOnly `eios_session` cookie; `SameSite=Lax`; `Secure` outside development; 30 days. Signing secret is auto-generated into Redis with `SET NX` — **zero auth env vars needed**. |
| Session revocation | Each user has `sv` (session version). Bumping it invalidates every existing cookie (used by revoke + password reset). |
| Rate limits | Register: 10 per IP / 10 min. Login: 20 per IP+username / 10 min. |
| Admin actions | `GET/POST /api/admin/users` — `approve`, `revoke`, `delete`, `promote`, `demote`, `reset-password`. Self-revoke/delete/demote are blocked. |
| Progress | `GET/PUT /api/progress` (cookie-authed), key `progress:<username>`, 4 MB cap, 500 new events/PUT, 20 k total, server-side union-merge of evidence events by id. |
| Lockout recovery | Set `ADMIN_RESET_TOKEN` env → `POST /api/auth/recover` → **unset it again**. The endpoint 404s whenever the var is absent. Full runbook: `docs/recalibration/RECOVERY.md`. |

**Relevant files:** `src/lib/server/auth.ts` (all primitives) · `src/app/api/auth/*` ·
`src/app/api/admin/users/route.ts` · `src/app/api/progress/route.ts` ·
`src/lib/auth-client.ts` (Zustand store) · `src/components/LoginGate.tsx` (the screen) ·
`src/components/AppShell.tsx:108` (`if (auth.status === "signedout") return <LoginGate />`).

---

## 3. What has NEVER been executed against a real Redis (test these)

Be honest with the user about this: the auth code has been read and type-checked, but
**no session has ever run it against a live Redis**, because this environment had none.
The previous review (`docs/recalibration/08`, pass P9) recorded this as deferred to
"first production smoke". That smoke test is now your job:

1. Register first account → assert `role:"admin"`, `approved:true`, auto-signed-in.
2. Reload → session persists (cookie survives).
3. Register a second account (incognito) → assert "awaiting administrator approval",
   and that login is refused with 403 `pending:true`.
4. As admin, `/admin` → approve the second account → it can now sign in.
5. Make progress in the app (claim a node) → confirm it syncs: `GET /api/progress`
   returns the evidence events; sign in on a second device/browser and confirm the
   state arrives.
6. Concurrent-device merge: claim different nodes in two browsers, sync both, confirm
   **no events are lost** (the server unions by event id).
7. Sign out / sign in again → progress still there.

If you want to test locally before touching production, the approach this session was
mid-way through (and did not finish) was a small in-memory Upstash-REST-compatible
server: the app only uses `GET, SET (NX/EX), DEL, INCR, EXPIRE, SADD, SREM, SMEMBERS,
SCARD`. `@upstash/redis` is v1.38.2; it POSTs a JSON command array to the base URL
(and arrays-of-arrays to `/pipeline`), and when the request carries
`Upstash-Encoding: base64` the string values in the response must be base64-encoded.
A working draft is *not* in the repo — rewrite it if useful, or just test in production.

---

## 4. The real UX gap worth fixing (the "what's missing" part of the ask)

**When Redis is absent the app says nothing.** It silently drops into local mode: no
sign-in screen, no banner, no hint that accounts exist as a feature. That silence is
exactly what made the user think account creation was broken or unbuilt. Settings has
one small paragraph about it, and that is the only mention anywhere in the product.

Recommended (do this *after* task 1, and only if the user wants it):
- When `/api/auth/me` returns `configured:false`, show a persistent, dismissible banner
  in `AppShell`: *"Accounts are off — progress is only in this browser. Enable
  cross-device sync in ~2 minutes →"* linking to a short setup explainer.
- Keep local mode fully functional (that is a deliberate design property — the app must
  work with zero env vars). This is about **visibility**, not about gating the app.
- Do not add a second auth backend. Supabase is deliberately deferred; the reasoning and
  the exact triggers that would justify migrating are in
  `docs/recalibration/05-auth-decision.md`. Do not migrate for fashion.

---

## 5. Optional hardening (only if the user asks)

- **Close the admin land-grab:** support an optional `ADMIN_SETUP_TOKEN` env var — when
  set, the *first* registration must supply it. Leaves normal operation unchanged and
  removes the race window. Small change to `src/app/api/auth/register/route.ts`.
- **Raise scrypt cost:** currently library defaults (N=16384, r=8, p=1). Fine, but
  N=32768 is a cheap upgrade. If you change it, existing hashes still verify only if the
  parameters are stored per-user — currently they are not, so **either keep the defaults
  or add a params field with a migration path.** Do not silently change the cost and lock
  the user out.
- Registration is open by design (approval-gated). If the user wants it fully closed
  after their account exists, add an admin toggle rather than removing the endpoint.

---

## 6. Everything else that is still outstanding

From `docs/recalibration/08-post-implementation-review.md` §P10 (all deliberate,
documented debts — not bugs):

1. **Packet coverage tranche 2** — 42 of 149 nodes have hand-curated learning packets
   (all of L0–L2 plus the L3–L6/L10–L12 spine). The remaining core L3–L9 depth and the
   L13–L16 research spine still fall back to `fallbackPacket()`, which produces the same
   flow from each node's curated bindings — thinner, but not broken. New packets require
   a `docs/curation/<node-id>.md` research record first (template in the recalibration
   spec §17), then the typed packet citing it via `researchRecord`, then manifest +
   registry. The validator enforces the rubric.
2. **Supabase** — deferred with recorded triggers (>~20 users, cross-user queries, email
   recovery, >5 MB blobs, an Upstash incident). See `docs/recalibration/05`.
3. **No off-app retention nudges** — no email infra by design; the Review queue is
   in-app only. If the user wants reminders, that is a new decision (and an ADR).
4. **Video `endSeconds`** is a YouTube player parameter — advisory, not enforced.
5. **Embedded videos in restricted networks** render as a dead frame; the card still
   carries its why-text and an "open original ↗" link.

---

## 7. Hard rules for whoever picks this up

- Read `CLAUDE.md` first — it is the authority chain and the non-negotiables.
- **Public repo:** never commit password hashes, emails, API keys, tokens, or learner
  state. Learner exports are downloads the user holds privately.
- **Mastery is derived from evidence — no user action may set a tier.** Do not add XP
  surfaces, streaks, confetti, or celebration loops. The one overlay fires only on
  *becameVerified*. Today shows ONE bottleneck.
- Content lives in `src/content/` (typed TS). `npm run validate` must stay green — it
  also runs in `prebuild`.
- Push only green builds to `claude/embodied-intelligence-research-s48jrg`; Vercel
  deploys from it. Do not open a PR unless the user asks.
- The product test for any change: *"What can he now do independently that he could not
  do 30 days ago?"* It must make learning easier to start, and must not make mastery
  easier to fake.

---

## 8. Suggested opening message to the user

> I've attached Upstash Redis to `embodied-os` and redeployed. `/api/auth/me` now
> reports `configured:true, bootstrapped:false`, which means accounts are live and no
> account exists yet. **Open https://milanhalo.me now and register — the first account
> becomes the administrator**, and until you claim it anyone who visits could. Tell me
> once you're in and I'll verify the admin role, then test approval and cross-device
> sync with you.
