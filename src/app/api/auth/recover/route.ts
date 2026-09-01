import { getRedis, getUser, hashPassword, putUser } from "@/lib/server/auth";

// Emergency break-glass (recalibration 05; runbook: docs/recalibration/RECOVERY.md).
// Disabled unless ADMIN_RESET_TOKEN is set in the environment — set it, use it once,
// unset it, redeploy. Two actions:
//   { token, username, newPassword }     reset one EXISTING account's password
//   { token, action: "wipe-users" }      delete EVERY account so the next
//                                        registration becomes admin again
//                                        (add wipeProgress: true to also drop progress)

export async function POST(req: Request) {
  const envToken = process.env.ADMIN_RESET_TOKEN;
  if (!envToken || envToken.length < 16) {
    return new Response("recovery disabled", { status: 404 });
  }
  const redis = getRedis();
  if (!redis) return new Response("no store configured", { status: 503 });

  const body = (await req.json().catch(() => null)) as
    | { token?: string; action?: string; username?: string; newPassword?: string; wipeProgress?: boolean }
    | null;
  if (!body?.token) return new Response("token required", { status: 400 });
  if (body.token !== envToken) {
    // constant response shape; no user enumeration on bad token
    return new Response("forbidden", { status: 403 });
  }

  // ── action: wipe every account ──────────────────────────────────
  if (body.action === "wipe-users") {
    const names = (await redis.smembers("users")) as string[];
    for (const n of names) {
      await redis.del(`user:${n}`);
      if (body.wipeProgress) await redis.del(`progress:${n}`);
    }
    await redis.del("users");
    return Response.json({
      ok: true,
      wiped: names.length,
      progressKept: !body.wipeProgress,
      note: "All accounts removed; every session is now invalid. The NEXT registration becomes admin — do it immediately, then UNSET ADMIN_RESET_TOKEN and redeploy.",
    });
  }

  // ── default action: reset one account's password ────────────────
  if (!body.username || !body.newPassword) {
    return new Response("username, newPassword required (or action: \"wipe-users\")", { status: 400 });
  }
  if (body.newPassword.length < 10) {
    return new Response("password too short (min 10)", { status: 400 });
  }
  const user = await getUser(redis, body.username.toLowerCase());
  if (!user) return new Response("no such account", { status: 404 });

  const { hash, salt } = await hashPassword(body.newPassword);
  await putUser(redis, { ...user, hash, salt, approved: true, sv: user.sv + 1 });
  return Response.json({ ok: true, username: user.username, note: "sessions revoked — sign in with the new password, then UNSET ADMIN_RESET_TOKEN and redeploy" });
}
