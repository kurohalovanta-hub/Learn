// Local database backup for the bridge owner (token-authed). The bridge
// pulls this periodically and keeps dated JSON copies on the learner's own
// machine — progress, evidence log, and tutor chats included.

import { getRedis } from "@/lib/server/auth";
import { resolveBridgeToken } from "@/lib/server/bridge";

export const maxDuration = 15;

export async function GET(req: Request) {
  const redis = getRedis();
  if (!redis) return new Response("no database", { status: 501 });
  const token = req.headers.get("x-bridge-token") ?? "";
  const username = token ? await resolveBridgeToken(redis, token) : null;
  if (!username) return new Response("unauthorized", { status: 401 });

  const progress = await redis.get(`progress:${username}`);
  return Response.json({ username, savedAt: Date.now(), progress: progress ?? null });
}
