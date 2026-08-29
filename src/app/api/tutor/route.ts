// Live tutor route (ADR-005). GET = availability probe; POST = streamed reply.
// Two backends, local CLI preferred:
//  - "cli": the learner's own Claude Code CLI (subscription-powered, local runs
//    only — dev or TUTOR_USE_CLAUDE_CLI=1; never exists on Vercel)
//  - "api": ANTHROPIC_API_KEY; in production it requires an approved session
//    (Redis) so a keyed public deployment never exposes someone's credit.

import { NODE_MAP } from "@/content/nodes";
import { getRedis, rateLimit, requireSession } from "@/lib/server/auth";
import {
  buildGrounding, buildSystemPrompt, streamClaude,
  TUTOR_DAILY_LIMIT, tutorKeySet, type TutorMessage,
} from "@/lib/server/tutor";
import { claudeCliAvailable, streamClaudeCli } from "@/lib/server/tutor-cli";
import type { TutorMode } from "@/lib/tutor";

export const maxDuration = 60;

const DEV = process.env.NODE_ENV === "development";

const MODES = new Set<TutorMode>(["teach", "diagnose", "socratic", "practice", "debug", "examine", "defense", "critic"]);

export async function GET() {
  if (claudeCliAvailable()) {
    return Response.json({ available: true, backend: "cli" });
  }
  if (!tutorKeySet()) {
    return Response.json({ available: false, reason: "no-key" });
  }
  if (!getRedis() && !DEV) {
    return Response.json({ available: false, reason: "needs-accounts" });
  }
  return Response.json({ available: true, backend: "api" });
}

export async function POST(req: Request) {
  const useCli = claudeCliAvailable();

  if (!useCli) {
    if (!tutorKeySet()) {
      return Response.json({ error: "Tutor not configured — run the app locally with Claude Code installed, or set ANTHROPIC_API_KEY." }, { status: 501 });
    }
    const redis = getRedis();
    if (redis) {
      const ctx = await requireSession(req);
      if (ctx instanceof Response) return ctx;
      if (!(await rateLimit(redis, `tutor:${ctx.user.username}`, TUTOR_DAILY_LIMIT(), 86_400))) {
        return Response.json({ error: "Daily tutor budget reached — resets within 24h." }, { status: 429 });
      }
    } else if (!DEV) {
      return Response.json({ error: "Tutor requires accounts in production — attach Redis first." }, { status: 501 });
    }
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
  const system = buildSystemPrompt(nodeId, mode, context, grounding);

  const headers = {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
    "x-accel-buffering": "no",
  };

  if (useCli) {
    return new Response(streamClaudeCli(system, messages), { headers });
  }
  const result = await streamClaude(system, messages);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
  return new Response(result.stream, { headers });
}
