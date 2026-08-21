import { getRedis, getUser, hashPassword, putUser } from "@/lib/server/auth";

// Emergency admin recovery (recalibration 05; runbook: docs/recalibration/RECOVERY.md).
// Disabled unless ADMIN_RESET_TOKEN is set in the environment — set it, use it once,
// unset it. Resets the password of an EXISTING account and revokes its sessions.

export async function POST(req: Request) {
  const envToken = process.env.ADMIN_RESET_TOKEN;
  if (!envToken || envToken.length < 16) {
    return new Response("recovery disabled", { status: 404 });
  }
  const redis = getRedis();
  if (!redis) return new Response("no store configured", { status: 503 });

  const body = (await req.json().catch(() => null)) as
    | { username?: string; newPassword?: string; token?: string }
    | null;
  if (!body?.username || !body.newPassword || !body.token) {
    return new Response("username, newPassword, token required", { status: 400 });
  }
  if (body.token !== envToken) {
    // constant response shape; no user enumeration on bad token
    return new Response("forbidden", { status: 403 });
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
