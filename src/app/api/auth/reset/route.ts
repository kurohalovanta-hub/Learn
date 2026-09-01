import {
  clientIp, getRedis, getUser, hashPassword, normalizeUsername, putUser, rateLimit,
  verifyRecoveryCode,
} from "@/lib/server/auth";

// Reset a forgotten password with a recovery code (no email infra by design).
// Unauthenticated, so it is deliberately strict: hard rate limits, a single
// generic failure message (no account enumeration), and the code is consumed on
// success. Break-glass alternative for a lost code: ADMIN_RESET_TOKEN + /api/auth/recover.
const FAILED = { error: "That username and recovery code do not match." };

export async function POST(req: Request) {
  const redis = getRedis();
  if (!redis) {
    return Response.json({ error: "Accounts are not configured on this deployment." }, { status: 501 });
  }
  // per-IP budget first: throttles guessing even across usernames
  if (!(await rateLimit(redis, `reset:${clientIp(req)}`, 5, 3600))) {
    return Response.json({ error: "Too many attempts — try again later." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as
    | { username?: string; code?: string; newPassword?: string }
    | null;
  const username = normalizeUsername(body?.username ?? "");
  const code = body?.code ?? "";
  const next = body?.newPassword ?? "";

  if (!username || !code) return Response.json(FAILED, { status: 403 });
  if (next.length < 8) {
    return Response.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }
  if (!(await rateLimit(redis, `reset:u:${username}`, 5, 3600))) {
    return Response.json({ error: "Too many attempts — try again later." }, { status: 429 });
  }

  const user = await getUser(redis, username);
  if (!user || typeof user !== "object" || !("hash" in user)) {
    return Response.json(FAILED, { status: 403 });
  }
  if (!(await verifyRecoveryCode(code, user))) {
    return Response.json(FAILED, { status: 403 });
  }

  const { hash, salt } = await hashPassword(next);
  await putUser(redis, {
    ...user,
    hash,
    salt,
    sv: user.sv + 1, // revoke every existing session
    recoveryHash: undefined,
    recoverySalt: undefined,
    recoveryCreatedAt: undefined,
  });

  return Response.json({
    ok: true,
    note: "Password reset and the code used up. Sign in, then generate a new recovery code in Settings.",
  });
}
