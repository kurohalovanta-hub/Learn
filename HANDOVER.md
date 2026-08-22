# HANDOVER — EMBODIED // OS
**Resume-here document.** Everything needed to pick this project up on a local machine.

- **Repo:** `https://github.com/kurohalovanta-hub/Learn`
- **Working branch:** `claude/embodied-intelligence-research-s48jrg` (ALL work lives here; `main` is stale)
- **HEAD at handover:** `ec285e2`
- **Written:** 2026-08-21 · by the remote session that built the recalibration

---

## 1. What this project is

A **210-day, zero → embodied-intelligence-researcher learning operating system**: a Next.js
app whose content is a mastery-gated skill dependency graph. Built for one learner
(PC-first, phone first-class).

- 149 skill nodes across 17 levels · 92 verified resources · 63-paper ladder · 22 projects · 8 bosses
- 16 in-app interactive lessons · 15 hand-rolled SVG instruments (real equations, never faked)
- 42 hand-curated **learning packets**; the other 107 nodes get the same flow generated from their bindings

**The product commitment:** *it must make learning easier to start, and must not make
mastery easier to fake.* Progress is derived from an append-only evidence log — there is
no button anywhere that sets a mastery tier.

---

## 2. Status at a glance

| Area | State |
|---|---|
| App build | ✅ Green — `npm run build` produces 334 pages |
| Content validator | ✅ Green — 149 nodes / 16 lessons / 42 packets |
| Lint | ✅ Clean — `npx eslint src scripts` |
| Evidence-based mastery engine | ✅ Shipped |
| Learning packets (42) | ✅ Shipped |
| Packet runner / academy UI | ✅ Shipped |
| AI-tutor bridge | ✅ Shipped |
| Auth system (code) | ✅ Complete and correct — **never run against a real Redis** |
| **Accounts working live** | ❌ **BLOCKED — no Redis attached to the deployment** |
| Vercel project existence | ❓ **UNVERIFIED** — see §6 |
| Packet coverage tranche 2 | ⬜ Backlog (L3–L9 depth, L13–L16) |

---

## 3. Resume locally

### 3.1 Prerequisites
- **Node ≥ 20.9** (24.x recommended) · npm
- **git**
- Claude Code CLI (for the MCP steps in §4)

### 3.2 Clone and run

```bash
mkdir -p ~/Desktop/embodied-os && cd ~/Desktop/embodied-os
git clone https://github.com/kurohalovanta-hub/Learn.git .
git checkout claude/embodied-intelligence-research-s48jrg
npm install
npm run dev          # http://localhost:3000
```

Windows PowerShell equivalent for the first line:
```powershell
New-Item -ItemType Directory -Force "$HOME\Desktop\embodied-os"; Set-Location "$HOME\Desktop\embodied-os"
```

### 3.3 The four commands that matter

```bash
npm run dev        # dev server
npm run validate   # content + lesson + packet integrity (also runs in prebuild)
npm run build      # full production build — must be green before any push
npx eslint src scripts   # NOT `next lint` (removed in Next 16)
```

**Zero environment variables are required.** With no Redis the app runs in full local
mode: everything works, progress lives in the browser, and there are no accounts.

---

## 4. MCP servers to add locally

Run these in the project directory. Add `--scope user` to any of them if you want the
server available in every project rather than just this one.

### 4.1 GitHub
Verified against the official Claude Code docs. Uses a fine-grained personal access
token, **not** OAuth. Create one at https://github.com/settings/personal-access-tokens
with access to the `kurohalovanta-hub/Learn` repo.

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer YOUR_GITHUB_PAT"
```

> `claude mcp add` saves the config **without validating credentials** — a bad token
> only shows up later as a `failed` server in `/mcp` with a 401.

### 4.2 Vercel
OAuth — the first connection opens a browser to sign in.

```bash
claude mcp add --transport http vercel https://mcp.vercel.com
```

Project-scoped form, once the project slug is known (team slug is `vantahalo`):
```bash
claude mcp add --transport http vercel-embodied https://mcp.vercel.com/vantahalo/<project-slug>
```

### 4.3 Higgsfield
```bash
claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp
```

### 4.4 Authenticate and verify

```bash
claude mcp list          # health per server: ✔ Connected / ! Needs authentication / ✘ Failed
claude mcp get vercel    # detail for one server
```
Then inside Claude Code, run **`/mcp`** and complete the OAuth sign-in for Vercel (and
Higgsfield if it asks). `/mcp` is also where you re-authenticate when a token expires.

**Confidence note:** the GitHub command is quoted verbatim from the official Claude Code
documentation. The Vercel and Higgsfield endpoints come from web search — `vercel.com`
and `higgsfield.ai` are both blocked by the remote sandbox's egress policy, so they could
not be fetched from the vendor directly. Verify with `claude mcp list` after adding; if an
endpoint 404s, check the vendor's own MCP docs page.

### 4.5 Known limitation that matters
**The Vercel MCP has no tools for environment variables and none for storage or
integrations.** Its surface is projects, deployments, logs, runtime errors, domains,
deploys, analytics. This is from the loaded tool schemas, so it holds regardless of auth
state. **Creating the Upstash database and setting the KV env vars cannot be automated
through it** — that is a dashboard action (or a direct Vercel REST API call with a token).

---

## 5. THE IMMEDIATE TASK — make accounts work

### 5.1 The diagnosis (this is the whole blocker)

The auth system is **finished, correct, and shipped**. Nothing in the code needs fixing.
The deployment simply has no Redis attached:

```
src/lib/server/auth.ts:8
export function getRedis(): Redis | null {
  const url   = process.env.KV_REST_API_URL   ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;   // ← no Redis ⇒ no accounts, silently
```

Chain of consequences:
`getRedis()` returns null → `GET /api/auth/me` returns `{configured:false}` →
`src/lib/auth-client.ts` sets status `"local"` → `AppShell.tsx:108` never reaches
`if (auth.status === "signedout") return <LoginGate />` → **the sign-in screen never
mounts.** That is why there is no signup page on the live site.

Attach Redis and the login/registration screen appears on its own. No code change.

### 5.2 The one-line diagnostic

Open in a browser (or curl from an unrestricted machine):
```
https://milanhalo.me/api/auth/me
```

| Response | Meaning | Action |
|---|---|---|
| `{"configured":false}` | Site live, **Redis not attached** | Do §5.3 |
| `{"configured":true,"bootstrapped":false,...}` | Redis attached, **no account exists** | **Register immediately** — you get admin |
| `{"configured":true,"bootstrapped":true,...}` | Accounts already exist | If none are yours, someone claimed admin — see §5.5 |
| Vercel 404 / DEPLOYMENT_NOT_FOUND | Nothing deployed | Create the project + deploy |

### 5.3 Attach Upstash Redis (dashboard, ~2 minutes)

1. Vercel → the project → **Storage → Create Database → Upstash for Redis** (free tier is
   plenty) → **link it to the project**.
2. Confirm it injected these into **Production**:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

   Fallback names `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` also work. Do
   **not** rename them and do **not** use `Redis.fromEnv()` — `getRedis()` reads exactly
   those four names.
3. **Redeploy.** Env vars only apply to a new deployment. A redeploy never touches Redis data.
4. Re-run the §5.2 check — it should now say `configured:true, bootstrapped:false`.
5. **Open the site and register immediately.** You'll get a "first boot — Commission this
   system" screen stating the first account becomes the administrator.

### 5.4 ⚠️ The admin slot is a land-grab

Registration is open and **whoever registers first becomes admin** (auto-approved). On a
public domain, anyone who loads the site between step 3 and your registration can take it.

- Do steps 3 and 5 back-to-back.
- Confirm the slot is closed afterwards: the check in §5.2 should read `"bootstrapped":true`.
- **Never commit the password** — to a file, a commit message, a PR body, or a comment.
  This repo is public. (A previous session was offered the password and correctly refused
  to hardcode it. Keep that rule.)

### 5.5 If someone else got the admin slot
Delete the stray user from Redis (remove its `user:<name>` key and drop it from the
`users` set), then register again. Then consider the `ADMIN_SETUP_TOKEN` hardening in §9.

### 5.6 Production smoke test — NEVER RUN, do this first

The auth code has been read and type-checked but **has never executed against a live
Redis**, because no session ever had one. Recorded as deferred in
`docs/recalibration/08-post-implementation-review.md` (pass P9). Run all of it:

1. Register first account → assert `role:"admin"`, `approved:true`, auto-signed-in.
2. Reload → session persists (cookie survives).
3. Register a second account in a private window → expect "awaiting administrator
   approval"; login must be refused with 403 `pending:true`.
4. As admin → `/admin` → approve the second account → it can now sign in.
5. Claim a node → confirm `GET /api/progress` returns the evidence events.
6. Sign in on a second browser → confirm state arrives.
7. **Concurrent merge:** claim different nodes in two browsers, sync both, confirm no
   events are lost (the server unions evidence by event id).
8. Sign out / sign in → progress still there.

**Optional local test without touching production:** the app uses only
`GET, SET (NX/EX), DEL, INCR, EXPIRE, SADD, SREM, SMEMBERS, SCARD`. `@upstash/redis` is
v1.38.2: it POSTs a JSON command array to the base URL (arrays-of-arrays to `/pipeline`),
and when the request carries `Upstash-Encoding: base64` the string values in the response
must be base64-encoded. A ~90-line in-memory shim covers it; point `KV_REST_API_URL` at
`http://127.0.0.1:<port>` and any non-empty `KV_REST_API_TOKEN`. (A draft existed in the
remote session's scratch space and was **not** committed — rewrite if wanted.)

---

## 6. The Vercel project question — UNRESOLVED, read before acting

An earlier session recorded: project `embodied-os`, team VANTA, id
`prj_QnDvGDlAKcpnivJLmLienartVk4q`, production domain `milanhalo.me`.

A later attempt to confirm this produced **contradictory and untrustworthy results**:
- `list_teams` returned exactly one team: **VANTA** (`vantahalo`, `team_iGcLHep8pmzIB6YwEDMFEnRm`).
- `list_projects` on that team returned an **empty list**; `get_project` 404'd for the
  recorded id, for `embodied-os`, and for `learn`.
- **Then the Vercel MCP reported its token had expired, and the server disconnected entirely.**

Because the token was already failing during those calls, **the empty result proves
nothing** — an expiring token can produce empty lists and 404s rather than a clean 401.
Do not treat "there is no project" as established fact.

Also blocked from the remote sandbox: `milanhalo.me`, `embodied-os.vercel.app`, and
`vercel.com` are all refused by the egress policy, so the live site could not be reached
by any means.

**First thing to do locally:** with Vercel MCP authenticated, run `list_projects` for team
`vantahalo` and settle it. Possible outcomes: the project exists (proceed to §5.3); it
lives under a **personal** Vercel scope (personal scope does not appear in `list_teams`);
it's under a different Vercel login; or it genuinely doesn't exist, in which case create
it (`create_git_project` / `deploy_to_vercel`, or the dashboard) linked to
`kurohalovanta-hub/Learn` on branch `claude/embodied-intelligence-research-s48jrg`.

---

## 7. What we discussed and did — the full arc

### 7.1 Phases 1–3: the original build
Built the whole system from a live-verified research pass over the August-2026
robot-learning frontier: 149-node dependency graph, 92 resources, 63 papers, 22 projects,
16 lessons, 15 widgets, auth with first-user-admin + approval, and the surfaces
(today/tree/papers/defense/guide/labs/weekly). All pushed to the working branch.

### 7.2 The critique that changed everything
Asked what specialty the curriculum served (answer: **manipulation-centric embodied
intelligence / VLA robot learning**), then challenged the product itself: *"the user is a
dopamine addict, and you have given him the exact source for a 2 day sprint. A field where
mastery is needed is not possible by summarizing each thing in simple words."*

A 5-critic adversarial review **confirmed the criticism with executed evidence**:
- All 149 nodes were claimable at max tier in ~40 minutes (15,240 XP, Rank 10, readiness 100)
- One-click boss fights
- Reset → re-claim produced infinite celebration loops
- Fake mastery was permanent — nothing ever demoted
- The product went static after roughly day 95

### 7.3 The recalibration (HANDOVERFINAL spec)
A full spec rewrite: *"personalized Khan Academy + mastery engine + AI tutor + research
OS."* Its mandated sequence was followed in order: **audit → live curation research →
design → ten-pass adversarial critique → only then implement.**

Persisted as `docs/recalibration/00`–`08` and 72 per-node research records in
`docs/curation/`. The ten-pass critique produced 12 amendments (Δ1–Δ12), all implemented.

### 7.4 What was built (commits R2–R6)
- **R2 — evidence engine.** Append-only `EvidenceRecord` log is the source of truth;
  `NodeProgress` is a derived cache. Tier ladder derived from retrieval/practice/
  implementation/assessment evidence. AI-assisted work **caps at Silver**. A claim is
  *provisional* until a later retention pass holds. Reset is a boundary event — history is
  never erased. v2→v3 migration turns old self-claimed tiers into flagged
  `legacy-*` override events (honestly demoted to unverified, not deleted).
- **R3 — 42 learning packets** from the curation records, plus the packet model, manifest,
  registry, and a validator rubric (whyNow ≥40 chars, ≥1 practice, implement-or-derive,
  prove criteria, deepen when hours ≥8, recall 2–6, media checks, researchRecord must exist).
- **R4 — the academy UI.** `PacketRunner` (watch → recall → read → work → build → prove,
  every completion an evidence event), video cards with exact segments, the tutor bridge
  (8 mode contracts, copyable session packets, pasted-summary ingestion), rebuilt node page.
- **R5 — calm surfaces.** Today shows ONE bottleneck with a capability target; dashboard
  leads with verified capability; field manual teaches prove → verify.
- **R6 — durability.** Sync caps (4 MB, 500 events/PUT, 20k total), server-side event-id
  union merge, `ADMIN_RESET_TOKEN` recovery endpoint, Export Everything, disaster runbook.

### 7.5 Post-implementation verification
The production build was served locally and the **exact abuse paths the critics used were
re-executed in a real browser**. All five original failures are dead:
- No control sets a tier anywhere; a claim requires a typed closed-book attempt + an
  honesty declaration, and yields "claimed — not yet verified"
- Zero celebration on claim (the one overlay fires only on *becameVerified*, and is
  suppressed during binges)
- Boss passes require per-criterion checkboxes + ≥30-char notes + honesty declaration
- Assessment passes schedule a ~2-day retention audit; failures demote
- 20 page renders across desktop (1600px) and mobile (390px) produced **zero console errors**

One dopamine leak was caught by the walkthrough that code review had missed — the sidebar
still rendered `0 XP`. Fixed (now shows verified-capability count).

Full record: `docs/recalibration/08-post-implementation-review.md`.

### 7.6 The account investigation (this session)
Established that auth is complete and Redis is the only blocker; found that the Vercel MCP
cannot set env vars; hit an expired-then-disconnected Vercel MCP and a hard egress block,
leaving §6 unresolved. That is where the work stopped.

---

## 8. Architecture map

### Authority chain (read in this order)
1. `docs/spec/HANDOVER.md` — original product/curriculum spec, **superseded where it
   conflicts** by `docs/recalibration/`
2. `docs/recalibration/00`–`08` + `RECOVERY.md` — audits, evidence-model design, auth
   decision, rebuild plan, ten-pass critique, post-implementation review, disaster runbook
3. `docs/curation/` — 72 per-node research records (packets cite these via `researchRecord`)
4. `docs/research/` — frontier map, resource selections, graph design, compute strategy,
   paper ladder, feasibility, 10 verified domain reports
5. `docs/architecture/` — ADR-001 stack, ADR-002 persistence, ADR-003 content model,
   ADR-004 auth, LEARNING-SYSTEM.md
6. `CLAUDE.md` — the hard rules; **read this before changing anything**

### Key source files
| Path | Role |
|---|---|
| `src/lib/types.ts` | `EvidenceRecord`, `NodeProgress`, `SemanticState` |
| `src/lib/engine/competency.ts` | `deriveNode()` — all tier/verified/semantic derivation |
| `src/lib/store.ts` | Zustand store, schema v3, migration, event union merge |
| `src/lib/packet-types.ts` / `packet-fallback.ts` | Packet model; fallback for uncurated nodes |
| `src/content/packets/` | 42 packets + `manifest.ts` + `registry.ts` |
| `src/components/PacketRunner.tsx` | The academy flow |
| `src/components/AssessmentBox.tsx` | Prove-it: commit → honesty → verdict |
| `src/lib/tutor.ts` + `src/components/TutorBridge.tsx` | Provider-neutral tutor bridge |
| `src/lib/server/auth.ts` | scrypt, HMAC sessions, users, rate limits |
| `src/app/api/auth/*` · `api/admin/users` · `api/progress` | All server routes |
| `src/components/LoginGate.tsx` | The sign-in / first-boot screen |
| `scripts/validate-content.ts` | Content + lesson + packet rubrics |

### How auth works (don't "fix" what isn't broken)
- **First user:** `userCount()` is `SCARD users`; the atomic name reservation writes
  `user:<name>` but **not** the `users` set, so the count is genuinely 0 for the first
  registrant → `role:"admin", approved:true`.
- **Later users:** `approved:false` → login 403 `{pending:true}` → admin approves at `/admin`.
- **Passwords:** scrypt, random 16-byte salt, 64-byte key, `timingSafeEqual`. Min 8 chars.
  Username lowercased, must match `/^[a-z0-9_-]{3,24}$/`.
- **Sessions:** HMAC-SHA256 token in an httpOnly `eios_session` cookie, SameSite=Lax,
  Secure outside dev, 30 days. Signing secret auto-generated into Redis with `SET NX` —
  **zero auth env vars**.
- **Revocation:** per-user `sv` (session version); bumping it kills every existing cookie.
- **Rate limits:** register 10/IP/10min; login 20/IP+username/10min.
- **Admin actions:** approve, revoke, delete, promote, demote, reset-password. Self-revoke,
  self-delete and self-demote are blocked.
- **Lockout recovery:** set `ADMIN_RESET_TOKEN` → `POST /api/auth/recover` → **unset it**.
  The endpoint 404s whenever the var is absent. Runbook: `docs/recalibration/RECOVERY.md`.

---

## 9. Backlog

1. **Packet tranche 2** — remaining core L3–L9 depth and the L13–L16 research spine.
   Process: write `docs/curation/<node-id>.md` first (real URLs actually visited,
   `[unverified]` flags where not), then the typed packet citing it via `researchRecord`,
   then manifest + registry. The validator enforces the rubric.
2. **Local-mode silence (the real UX gap).** When Redis is absent the app says *nothing* —
   it silently drops to local mode with no banner, so accounts look broken/unbuilt. Add a
   dismissible banner when `/api/auth/me` returns `configured:false`. Keep local mode fully
   functional; this is about visibility, not gating.
3. **`ADMIN_SETUP_TOKEN` hardening** — optional env var that the *first* registration must
   supply, closing the admin land-grab window. Small change to the register route.
4. **scrypt cost** — currently library defaults (N=16384). N=32768 is a cheap upgrade, but
   params are **not stored per user**, so changing the cost invalidates every existing hash.
   Either keep defaults or add a params field with a migration path. Do not silently change it.
5. **Supabase** — deliberately deferred. Triggers that would justify migrating are in
   `docs/recalibration/05-auth-decision.md`. *Do not migrate for fashion.*
6. **No off-app reminders** — no email infra by design; the Review queue is in-app only.
   Adding notifications is a new decision (write an ADR).

---

## 10. Hard rules

- **Mastery is derived from evidence — no user action may set a tier.** No XP surfaces, no
  streak mechanics, no confetti, no celebration loops. The one overlay fires only on
  *becameVerified*. Today shows ONE bottleneck.
- **Public repo:** never commit password hashes, emails, API keys, tokens, or learner
  state. Learner exports are downloads the user holds privately.
- **Content is code:** `src/content/` is the single source of truth. `npm run validate`
  must stay green (it also runs in `prebuild`).
- **Branch discipline:** push only green builds to
  `claude/embodied-intelligence-research-s48jrg`. Don't open a PR unless asked.
- **2026 gotchas:** `proxy.ts` not `middleware.ts`; `await params`/`cookies()`; no
  `next lint`; no `tailwind.config.js`; react-hooks compiler rules are **errors** (no ref
  reads during render, no sync `setState` in effects); JSX attribute strings do NOT process
  backslash escapes (`tex="\alpha"` in JSX, `"\\alpha"` in TS data).
- **The test for any change:** *"What can he now do independently that he could not do 30
  days ago?"*

---

## 11. Prompt to paste into local Claude Code

```text
Read HANDOVER.md in this repo, then CLAUDE.md. They are the authority for this project.

Set up my tooling first:
1. Add these MCP servers (I will do the browser logins myself):
   claude mcp add --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer <MY_GITHUB_PAT>"
   claude mcp add --transport http vercel https://mcp.vercel.com
   claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp
2. Run `claude mcp list` and tell me which need authentication, then stop and let me
   complete the OAuth sign-ins via /mcp before continuing.

Then the actual task — get accounts working on the live site:
3. With Vercel MCP authenticated, list the projects in team `vantahalo` and find the one
   serving milanhalo.me. HANDOVER.md §6 explains why its existence is currently unverified
   and must not be assumed either way. Report what you actually find.
4. Fetch https://milanhalo.me/api/auth/me and tell me exactly what it returns. HANDOVER.md
   §5.2 has the decision table for every possible response.
5. If it says {"configured":false}, walk me through attaching Upstash Redis in the Vercel
   dashboard (§5.3) — you cannot do it via MCP, that server has no env-var or storage
   tools. Then have me redeploy, re-check, and register my admin account IMMEDIATELY;
   §5.4 explains the land-grab risk.
6. Once I'm in, run the full production smoke test in §5.6 with me. It has never been run.

Rules: never commit my password or any secret to this public repo. Work only on branch
claude/embodied-intelligence-research-s48jrg. Verify with `npm run validate`,
`npm run build` and `npx eslint src scripts` before any push.
```
