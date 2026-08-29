// Per-user AI connections: link/unlink Claude and ChatGPT keys, set preference.
// Keys are validated against the provider before saving and never echoed back.

import { requireSession } from "@/lib/server/auth";
import { loadAIKeys, saveAIKeys, validateKey, type AIProvider } from "@/lib/server/ai-keys";

export const maxDuration = 30;

const isProvider = (p: unknown): p is AIProvider => p === "anthropic" || p === "openai";

export async function GET(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  const keys = await loadAIKeys(ctx.redis, ctx.user.username);
  return Response.json({
    anthropic: !!keys.anthropic,
    openai: !!keys.openai,
    prefer: keys.prefer ?? "anthropic",
  });
}

export async function PUT(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  let body: { provider?: string; key?: string; prefer?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const keys = await loadAIKeys(ctx.redis, ctx.user.username);

  if (body.prefer !== undefined) {
    if (!isProvider(body.prefer)) return Response.json({ error: "prefer must be anthropic or openai" }, { status: 400 });
    await saveAIKeys(ctx.redis, ctx.user.username, { ...keys, prefer: body.prefer });
    return Response.json({ ok: true });
  }

  if (!isProvider(body.provider)) return Response.json({ error: "provider must be anthropic or openai" }, { status: 400 });
  const key = typeof body.key === "string" ? body.key.trim() : "";
  if (key.length < 20 || key.length > 400) return Response.json({ error: "that doesn't look like an API key" }, { status: 400 });

  const problem = await validateKey(body.provider, key);
  if (problem) return Response.json({ error: problem }, { status: 400 });

  await saveAIKeys(ctx.redis, ctx.user.username, { ...keys, [body.provider]: key });
  return Response.json({ ok: true, provider: body.provider });
}

export async function DELETE(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  let body: { provider?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!isProvider(body.provider)) return Response.json({ error: "provider must be anthropic or openai" }, { status: 400 });
  const keys = await loadAIKeys(ctx.redis, ctx.user.username);
  delete keys[body.provider];
  await saveAIKeys(ctx.redis, ctx.user.username, keys);
  return Response.json({ ok: true });
}
