import { Redis } from "@upstash/redis";

// Keyed cloud sync (ADR-002). Works with Vercel Marketplace (Upstash) env names
// AND Upstash-native names; degrades to 501 when unconfigured.
// NOTE: Redis.fromEnv() only reads UPSTASH_REDIS_REST_* — the Marketplace injects
// KV_REST_API_* — so we initialize explicitly (verified gotcha, 2026-08-21).

const KEY = "progress:v1";

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function authorized(req: Request): boolean {
  const secret = process.env.SYNC_SECRET;
  if (!secret) return false;
  return req.headers.get("x-sync-secret") === secret;
}

function unconfigured() {
  return Response.json(
    { error: "Sync not configured: set up Upstash Redis (Vercel → Storage) and a SYNC_SECRET env var. See README → Deploy." },
    { status: 501 },
  );
}

export async function GET(req: Request) {
  const redis = getRedis();
  if (!redis || !process.env.SYNC_SECRET) return unconfigured();
  if (!authorized(req)) return new Response("unauthorized", { status: 401 });
  const data = await redis.get(KEY);
  if (data == null) return new Response(null, { status: 204 });
  return Response.json(data);
}

export async function PUT(req: Request) {
  const redis = getRedis();
  if (!redis || !process.env.SYNC_SECRET) return unconfigured();
  if (!authorized(req)) return new Response("unauthorized", { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !("nodes" in body)) {
    return new Response("bad payload", { status: 400 });
  }
  await redis.set(KEY, body);
  return Response.json({ ok: true, at: Date.now() });
}
