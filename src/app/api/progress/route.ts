import { requireSession } from "@/lib/server/auth";

// Per-user progress document. v3 hardening (recalibration Δ12):
// - value size cap (4 MB) with a clear error, so a runaway client can't wedge the account
// - the append-only evidence log merges by id-union server-side, capped per PUT —
//   concurrent devices can no longer clobber each other's history via last-write-wins

const MAX_BYTES = 4 * 1024 * 1024;
const MAX_NEW_EVENTS_PER_PUT = 500;
const MAX_EVENTS_TOTAL = 20_000;

interface Ev { id: string; at: number }

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
  const raw = await req.text();
  if (raw.length > MAX_BYTES) {
    return new Response("progress document exceeds 4MB — export a backup from Settings and contact the admin", { status: 413 });
  }
  let body: Record<string, unknown> | null = null;
  try {
    body = JSON.parse(raw);
  } catch {
    body = null;
  }
  if (!body || typeof body !== "object" || !("nodes" in body)) {
    return new Response("bad payload", { status: 400 });
  }

  const key = `progress:${ctx.user.username}`;
  const incoming = Array.isArray(body.events) ? (body.events as Ev[]) : [];

  // union incoming events with what the server already holds (append-only history)
  const existing = (await ctx.redis.get<Record<string, unknown>>(key)) ?? null;
  const existingEvents: Ev[] = existing && Array.isArray(existing.events) ? (existing.events as Ev[]) : [];
  const known = new Set(existingEvents.map((e) => e?.id).filter(Boolean));
  const fresh = incoming.filter((e) => e && typeof e.id === "string" && !known.has(e.id));
  if (fresh.length > MAX_NEW_EVENTS_PER_PUT) {
    return new Response(`too many new events in one sync (${fresh.length} > ${MAX_NEW_EVENTS_PER_PUT})`, { status: 429 });
  }
  let events = [...existingEvents, ...fresh].sort((a, b) => (a.at ?? 0) - (b.at ?? 0));
  if (events.length > MAX_EVENTS_TOTAL) events = events.slice(events.length - MAX_EVENTS_TOTAL);

  await ctx.redis.set(key, { ...body, events });
  return Response.json({ ok: true, at: Date.now(), events: events.length });
}
