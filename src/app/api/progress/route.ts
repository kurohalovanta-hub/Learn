import { requireSession } from "@/lib/server/auth";

// Per-user progress document (replaces the old shared-secret /api/sync).
export async function GET(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  const data = await ctx.redis.get(`progress:${ctx.user.username}`);
  if (data == null) return new Response(null, { status: 204 });
  return Response.json(data);
}

export async function PUT(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !("nodes" in body)) {
    return new Response("bad payload", { status: 400 });
  }
  await ctx.redis.set(`progress:${ctx.user.username}`, body);
  return Response.json({ ok: true, at: Date.now() });
}
