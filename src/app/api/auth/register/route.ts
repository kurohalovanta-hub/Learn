import {
  clientIp, getRedis, hashPassword, normalizeUsername, putUser, rateLimit, userCount,
} from "@/lib/server/auth";

export async function POST(req: Request) {
  const redis = getRedis();
  if (!redis) {
    return Response.json({ error: "Accounts are not configured on this deployment (see README → Deploy)." }, { status: 501 });
  }
  if (!(await rateLimit(redis, `reg:${clientIp(req)}`, 10, 600))) {
    return Response.json({ error: "Too many attempts — try again later." }, { status: 429 });
  }
  const body = (await req.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = normalizeUsername(body?.username ?? "");
  const password = body?.password ?? "";
  if (!username) {
    return Response.json({ error: "Username must be 3–24 chars: a–z, 0–9, _ or -." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  // reserve the name atomically
  const reserved = await redis.set(`user:${username}`, "pending", { nx: true, ex: 30 });
  if (reserved !== "OK") {
    return Response.json({ error: "That username is taken." }, { status: 409 });
  }

  const isFirst = (await userCount(redis)) === 0;
  const { hash, salt } = await hashPassword(password);
  await putUser(redis, {
    username, hash, salt,
    role: isFirst ? "admin" : "user",
    approved: isFirst,
    sv: 1,
    createdAt: Date.now(),
  });

  return Response.json({
    ok: true,
    approved: isFirst,
    role: isFirst ? "admin" : "user",
    message: isFirst
      ? "Admin account created — you can sign in."
      : "Account created. An administrator must approve it before you can sign in.",
  });
}
