# Disaster Recovery Runbook
Scope: HANDOVERFINAL §36–38, §67. Three independent stores by design — GitHub (code +
content), Upstash Redis (accounts + progress), user-held exports (Settings → Export
everything). Losing any one is recoverable from the other two.

## 1. Locked-out admin (no email infra by design)
1. Vercel → Project → Settings → Environment Variables: set `ADMIN_RESET_TOKEN` to a long
   random string (`openssl rand -hex 24`). Redeploy.
2. `curl -X POST https://<domain>/api/auth/recover -H 'content-type: application/json' \
   -d '{"username":"<admin>","newPassword":"<new strong pw>","token":"<the token>"}'`
   → `{ok: true}`; all sessions for that account are revoked.
3. Sign in with the new password. **Unset `ADMIN_RESET_TOKEN` and redeploy.** The endpoint
   404s whenever the variable is absent.

## 2. Redis lost / corrupted
1. Provision a fresh Upstash database (Vercel → Storage), link, redeploy — the auth
   signing secret regenerates automatically (`SET NX`).
2. First registration on the fresh store becomes admin again — register immediately.
3. Restore progress: Settings → Import with your latest JSON export; the next sync PUT
   repopulates `progress:{username}`. (Without an export, progress on other still-signed-in
   devices re-syncs on their next push.)

## 3. Vercel project lost
Re-import the GitHub repo (zero-config), re-link Upstash. No application state lives in
Vercel; nothing else to do.

## 4. Repo lost
GitHub is the only code/content store — keep the standard fork/clone hygiene. Progress is
unaffected (Redis + exports).

## 5. Redeploys and migrations
- A redeploy never touches Redis: users, roles, progress, evidence, tutor history,
  paper/project state all persist (§67 verified by architecture — state lives outside the app).
- Schema migrations are forward-safe in code (`store.ts migrate()`, versioned): older
  documents are upgraded on load (v2 tiers → flagged legacy override events); the server
  never rewrites stored documents except by union-merging evidence on PUT.
- There are no production reset scripts; the only destructive action is the signed-in
  user's own typed-confirmation reset, scoped to their account.

## 6. Weekly habit (the actual insurance)
Settings → **Export everything** → store the 4 files somewhere private (they contain your
learning history — do not commit them to the public repo). The export includes the
tutor-readable CURRENT_STATE.md, so a total-loss recovery also restores tutor continuity.
