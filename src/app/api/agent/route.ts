// Raw agent terminal (session-authed): pipes the owner's messages straight to
// their bridge as a `raw` job — full-permission Claude Code working in the
// project folder on their own machine. No tutor rules, no grounding.
// The bridge refuses raw jobs unless FULL CONTROL is enabled there, and jobs
// only ever reach the account owner's own bridge.

import { randomUUID } from "node:crypto";
import { requireSession } from "@/lib/server/auth";
import { bridgeOnline, enqueueJob, streamJobOutput } from "@/lib/server/bridge";

export const maxDuration = 300;

const AGENT_MODELS = ["sonnet", "opus", "haiku"];

export async function GET(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  const online = await bridgeOnline(ctx.redis, ctx.user.username);
  return Response.json({ available: online, models: AGENT_MODELS });
}

export async function POST(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  if (!(await bridgeOnline(ctx.redis, ctx.user.username))) {
    return Response.json({ error: "Your bridge is offline — start it on your machine first." }, { status: 503 });
  }

  let body: { messages?: { role: "user" | "assistant"; content: string }[]; model?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  const messages = Array.isArray(body.messages)
    ? body.messages
        .filter((m): m is { role: "user" | "assistant"; content: string } =>
          !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.length > 0)
        .slice(-16)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 30_000) }))
    : [];
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "last message must be from you" }, { status: 400 });
  }
  const model = typeof body.model === "string" && AGENT_MODELS.includes(body.model) ? body.model : undefined;

  const id = randomUUID();
  await enqueueJob(ctx.redis, ctx.user.username, {
    id, provider: "claude", raw: true, model,
    system: "", // raw mode: the bridge runs Claude Code with its own defaults
    messages,
  });
  return new Response(streamJobOutput(ctx.redis, id, 280_000), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
    },
  });
}
