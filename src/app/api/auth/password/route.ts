import {
  clientIp, getSecret, hashPassword, putUser, rateLimit, requireSession,
  SESSION_DAYS, sessionCookie, signToken, verifyPassword,
} from "@/lib/server/auth";

// Change your own password. Requires the current one, so a borrowed session
// cannot lock you out of your own account. Bumps the session version (killing
// every other device) and re-issues a cookie for THIS session.
export async function POST(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  const { redis, user } = ctx;

  if (!(await rateLimit(redis, `pw:${clientIp(req)}:${user.username}`, 10, 600))) {
    return Response.json({ error: "Too many attempts — try again later." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as
    | { currentPassword?: string; newPassword?: string }
    | null;
  const current = body?.currentPassword ?? "";
  const next = body?.newPassword ?? "";

  if (!(await verifyPassword(current, user))) {
    return Response.json({ error: "Current password is incorrect." }, { status: 403 });
  }
  if (next.length < 8) {
    return Response.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }
  if (next === current) {
    return Response.json({ error: "That is your current password." }, { status: 400 });
  }

  const { hash, salt } = await hashPassword(next);
  const sv = user.sv + 1;
  await putUser(redis, { ...user, hash, salt, sv });

  // keep the caller signed in; every other session is now invalid
  const secret = await getSecret(redis);
  const maxAge = SESSION_DAYS * 86400;
  const token = signToken({ u: user.username, sv, exp: Math.floor(Date.now() / 1000) + maxAge }, secret);
  return Response.json(
    { ok: true, note: "Password changed. Other devices have been signed out." },
    { headers: { "set-cookie": sessionCookie(token, maxAge) } },
  );
}
