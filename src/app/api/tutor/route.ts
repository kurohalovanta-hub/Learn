// Live tutor route (ADR-005). GET = availability probe; POST = streamed reply.
// Production requires an approved session (Redis) — a keyed but accountless
// public deployment must not expose someone's API credit to the internet.

import { NODE_MAP } from "@/content/nodes";
import { getRedis, rateLimit, requireSession } from "@/lib/server/auth";
import {
  buildGrounding, buildSystemPrompt, streamClaude,
  TUTOR_DAILY_LIMIT, tutorKeySet, type TutorMessage,
} from "@/lib/server/tutor";
import type { TutorMode } from "@/lib/tutor";

export const maxDuration = 60;

const DEV = process.env.NODE_ENV === "development";

const MODES = new Set<TutorMode>(["teach", "diagnose", "socratic", "practice", "debug", "examine", "defense", "critic"]);

export async function GET() {
  if (!tutorKeySet()) {
    return Response.json({ available: false, reason: "no-key" });
  }
  if (!getRedis() && !DEV) {
    return Response.json({ available: false, reason: "needs-accounts" });
  }
  return Response.json({ available: true });
}

export async function POST(req: Request) {
  if (!tutorKeySet()) {
    return Response.json({ error: "Tutor not configured (ANTHROPIC_API_KEY missing)." }, { status: 501 });
  }

  let username = "dev";
  const redis = getRedis();
  if (redis) {
    const ctx = await requireSession(req);
    if (ctx instanceof Response) return ctx;
    username = ctx.user.username;
    if (!(await rateLimit(redis, `tutor:${username}`, TUTOR_DAILY_LIMIT(), 86_400))) {
      return Response.json({ error: "Daily tutor budget reached — resets within 24h." }, { status: 429 });
    }
  } else if (!DEV) {
    return Response.json({ error: "Tutor requires accounts in production — attach Redis first." }, { status: 501 });
  }

  let body: { nodeId?: string; mode?: string; context?: string; messages?: TutorMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const nodeId = typeof body.nodeId === "string" ? body.nodeId : "";
  if (!NODE_MAP.has(nodeId)) return Response.json({ error: `unknown node: ${nodeId}` }, { status: 400 });
  const mode: TutorMode = MODES.has(body.mode as TutorMode) ? (body.mode as TutorMode) : "teach";
  const context = typeof body.context === "string" ? body.context.slice(0, 8_000) : "";
  const messages = Array.isArray(body.messages)
    ? body.messages.filter(
        (m): m is TutorMessage =>
          !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.length > 0,
      )
    : [];
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "last message must be from the learner" }, { status: 400 });
  }

  const grounding = await buildGrounding(nodeId);
  if (!grounding) return Response.json({ error: "could not load node materials" }, { status: 500 });

  const result = await streamClaude(buildSystemPrompt(nodeId, mode, context, grounding), messages);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });

  return new Response(result.stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
    },
  });
}
