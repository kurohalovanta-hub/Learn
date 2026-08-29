// Bridge worker endpoints (token-authed — called by the learner's own
// halo-bridge script, from their PC or any box they run it on).
// GET: heartbeat + pop one queued tutor job. POST: push answer chunks.

import { getRedis } from "@/lib/server/auth";
import { markOnline, popJob, pushChunks, resolveBridgeToken, DONE_SENTINEL, ERR_SENTINEL } from "@/lib/server/bridge";

export const maxDuration = 15;

async function auth(req: Request) {
  const redis = getRedis();
  if (!redis) return null;
  const token = req.headers.get("x-bridge-token") ?? "";
  if (!token) return null;
  const username = await resolveBridgeToken(redis, token);
  return username ? { redis, username } : null;
}

export async function GET(req: Request) {
  const ctx = await auth(req);
  if (!ctx) return new Response("unauthorized", { status: 401 });
  await markOnline(ctx.redis, ctx.username);
  const job = await popJob(ctx.redis, ctx.username);
  return Response.json({ job });
}

export async function POST(req: Request) {
  const ctx = await auth(req);
  if (!ctx) return new Response("unauthorized", { status: 401 });
  let body: { jobId?: string; chunks?: string[]; done?: boolean; error?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  const jobId = typeof body.jobId === "string" && /^[\w-]{8,64}$/.test(body.jobId) ? body.jobId : null;
  if (!jobId) return Response.json({ error: "bad jobId" }, { status: 400 });

  const chunks = (Array.isArray(body.chunks) ? body.chunks : [])
    .filter((c): c is string => typeof c === "string" && c.length > 0)
    .map((c) => c.slice(0, 8_000))
    .slice(0, 200);
  if (typeof body.error === "string" && body.error) chunks.push(`${ERR_SENTINEL}${body.error.slice(0, 300)}`);
  else if (body.done) chunks.push(DONE_SENTINEL);

  await pushChunks(ctx.redis, jobId, chunks);
  return Response.json({ ok: true });
}
