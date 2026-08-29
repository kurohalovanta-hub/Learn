# HANDOVER — HALO (PROJECT : VANTA HALO), RDP era
**Resume-here document, 2026-08-29.** Supersedes `HANDOVER.md` (2026-08-21) wherever they disagree.

- **Live site:** https://www.milanhalo.me (Vercel project `learn`, team `vantahalo`)
- **Repo:** https://github.com/kurohalovanta-hub/Learn · branch `claude/embodied-intelligence-research-s48jrg` (main is stale)
- **On the RDP:** project at `C:\halo\Learn`, bridge at `C:\halo\bridge` (installed by `rdp-setup/INSTALL.bat`)

## 1. What HALO is now

The EMBODIED // OS learning system, rebranded **HALO**, with a live AI layer:

- **Resident tutor** on `/today` and every node — streams grounded replies, tap-option chips
  (typing optional), model picker, in-browser Python code lab (Pyodide), session-end evidence
  logging through the existing honesty engine (AI help still caps at Silver).
- **Accounts are LIVE** — Upstash Redis `upstash-kv-crimson-river` attached; first admin is
  `milan`. Progress, tutor chat logs, and AI connections all sync per account.
- **Per-user AI connections** (Settings → connections):
  1. **The bridge (headline path):** a script on the learner's own machine answers through
     their Claude Code / ChatGPT Codex logins. No API keys. Outbound-only — no ports/tunnel.
  2. Advanced fallback: user-linked Anthropic/OpenAI API keys (validated, stored in Redis).
  3. Local CLI (dev) and optional deployment-wide `ANTHROPIC_API_KEY` (budgeted) below that.
- **Per-user GitHub memory** (Settings → memory): each account links a PRIVATE repo; the app
  commits an AI-readable digest (progress + weaknesses + recent tutor chats, with a
  "FOR ANY AI" preamble) so Claude/ChatGPT can swap mid-relationship. Auto-syncs after
  logged tutor sessions. Public repos are refused.

## 2. The architecture (decided after research + debate)

**Vercel = face, RDP = brain.**
- Vercel serves the site (uptime, HTTPS, domain) and Upstash holds accounts/state.
- The RDP runs the **bridge** (`C:\halo\bridge\bridge.mjs`, auto-start logon task
  "HALO Bridge"): polls `/api/bridge` outbound, runs `claude -p` (streaming, web tools
  WebSearch/WebFetch allowed, `HALO_NO_WEB=1` to disable) or `codex exec` (read-only
  sandbox), pushes chunks back through Redis. Engine + model chosen in the site UI.
- Verified 2026-08-29: no provider lets a hosted site bill a chat subscription
  ("Sign in with ChatGPT" is identity-only beta; Anthropic forbids third-party claude.ai
  login/intermediation). The bridge keeps subscriptions on the learner's own machine —
  the compliant way to get subscription-powered tutoring on a hosted site.

## 3. Key code (all new files this era)

| Path | Role |
|---|---|
| `src/app/api/tutor/route.ts` | backend resolution: bridge → user key → local CLI → env key; model allowlists |
| `src/lib/server/bridge.ts` + `src/app/api/bridge/*` | job queue, chunk relay, bridge tokens (hashed) |
| `public/bridge.mjs` | the bridge script (mac/linux/windows; served by the site) |
| `src/lib/server/tutor.ts` / `tutor-cli.ts` | system prompt (grounding/brevity/adaptation), Anthropic + OpenAI(Responses)/CLI streamers |
| `src/components/tutor/LiveTutor.tsx` | teacher UI: streaming, chips, model picker, code lab, chat-log persistence |
| `src/components/tutor/AIConnect.tsx` / `TutorStatusCard.tsx` | connections UI (bridge-first), status |
| `src/components/MemorySync.tsx` + `src/app/api/memory/route.ts` | per-user private GitHub memory |
| `src/lib/memory-digest.ts` | the AI-handoff digest (includes tutor chats) |
| `src/lib/tutor.ts` | copy-paste bridge (fallback) + summary→evidence ingestion (unchanged engine) |
| `rdp-setup/` | Windows one-shot installer (INSTALL.bat + ps1 + bridge copy) |

Store: `tutorChats` in ProgressData (capped 30 msgs × 12 nodes, LWW-per-node sync).
ADR-005 (`docs/architecture/`) records the server-side-AI decision.

## 4. Daily operations (RDP)

- **Site tutor stops answering?** Check Settings → connections ("bridge online"?). On the RDP:
  `type C:\halo\bridge\bridge.log`. Restart: `schtasks /Run /TN "HALO Bridge"`.
- **Update the site:** `cd C:\halo\Learn` → `git pull` → `npm run build` (must be green) →
  `vercel deploy` (preview) → `vercel promote <url> --yes` (production).
- **Verification gate before any push:** `npm run validate` · `npm run build` ·
  `npx eslint src scripts`. Push only green builds to the working branch.
- **New bridge key** (rotates old one): Settings → connections → create a fresh bridge key,
  then update the `HALO_TOKEN` user env var on the RDP and restart the task.

## 5. Open items

1. **Production promote** pending after each deploy — CLI promote is permission-gated for
   agents; the human runs `vercel promote <preview-url> --yes`.
2. **Packet tranche 2** — 42/149 nodes have curated packets; prose de-slop pass done for
   `l2-algebra` + rendering layer (SmartText link chips); remaining 41 packets still carry
   the old prose style.
3. **"Start here" linear ramp** for the first levels — designed, not yet built.
4. **Bridge as full agent** (future): a second job type letting the tutor edit content /
   produce files through Claude Code on the RDP — deliberate ADR first.
5. Production smoke test §5.6 of old HANDOVER — partially done (register/login/sync
   exercised); concurrent-merge and approval-flow steps still unrun.

## 6. Hard rules (unchanged)

Mastery derives from evidence only; no dopamine mechanics; public repo gets no secrets or
learner state; content is code (`npm run validate` green); the product test: *"what can the
learner now do independently that they couldn't 30 days ago?"*
