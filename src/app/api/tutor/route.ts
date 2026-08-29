// Live tutor route (ADR-005, revised for per-user connections).
// Backend resolution order per request:
//   1. the signed-in user's OWN linked key (Claude or ChatGPT, their choice)
//   2. the local Claude Code CLI (dev machines — subscription, no key)
//   3. a deployment-wide ANTHROPIC_API_KEY (optional; session + daily budget)
// GET reports which backend would serve, so the UI can say something honest.

import { NODE_MAP } from "@/content/nodes";
import { getRedis, rateLimit, requireSession } from "@/lib/server/auth";
import { loadAIKeys, pickProvider } from "@/lib/server/ai-keys";
import {
  buildGrounding, buildSystemPrompt, streamClaude, streamOpenAI,
  TUTOR_DAILY_LIMIT, tutorKeySet, type StreamResult, type TutorMessage,
} from "@/lib/server/tutor";
import { claudeCliAvailable, streamClaudeCli } from "@/lib/server/tutor-cli";
import type { TutorMode } from "@/lib/tutor";

export const maxDuration = 60;

const DEV = process.env.NODE_ENV === "development";

const MODES = new Set<TutorMode>(["teach", "diagnose", "socratic", "practice", "debug", "examine", "defense", "critic"]);

type Resolved =
  | { kind: "user"; provider: "anthropic" | "openai"; key: string; username: string }
  | { kind: "cli" }
  | { kind: "env"; username: string | null };

/** Figure out which backend serves this request. Returns a reason string when none can. */
async function resolveBackend(req: Request): Promise<Resolved | { kind: "none"; reason: string }> {
  const redis = getRedis();
  if (redis) {
    const ctx = await requireSession(req);
    if (!(ctx instanceof Response)) {
      const pick = pickProvider(await loadAIKeys(redis, ctx.user.username));
      if (pick) return { kind: "user", provider: pick.provider, key: pick.key, username: ctx.user.username };
      if (claudeCliAvailable()) return { kind: "cli" };
      if (tutorKeySet()) return { kind: "env", username: ctx.user.username };
      return { kind: "none", reason: "connect" };
    }
    if (claudeCliAvailable()) return { kind: "cli" };
    return { kind: "none", reason: "sign-in" };
  }
  if (claudeCliAvailable()) return { kind: "cli" };
  if (tutorKeySet()) {
    if (DEV) return { kind: "env", username: null };
    return { kind: "none", reason: "needs-accounts" };
  }
  return { kind: "none", reason: "no-key" };
}

export async function GET(req: Request) {
  const r = await resolveBackend(req);
  if (r.kind === "none") return Response.json({ available: false, reason: r.reason });
  const backend =
    r.kind === "user" ? (r.provider === "anthropic" ? "your-claude" : "your-chatgpt")
    : r.kind === "cli" ? "cli"
    : "deployment";
  return Response.json({ available: true, backend });
}

export async function POST(req: Request) {
  const r = await resolveBackend(req);
  if (r.kind === "none") {
    const friendly: Record<string, string> = {
      "connect": "No AI connected yet — link your Claude or ChatGPT in Settings → connections.",
      "sign-in": "Sign in first — the tutor runs on your own AI connection.",
      "needs-accounts": "This deployment needs accounts (Redis) before the tutor can serve.",
      "no-key": "No AI available on this deployment.",
    };
    return Response.json({ error: friendly[r.reason] ?? r.reason }, { status: r.reason === "sign-in" ? 401 : 501 });
  }

  // the deployment-wide key is a shared resource — budget it per user
  if (r.kind === "env" && r.username) {
    const redis = getRedis();
    if (redis && !(await rateLimit(redis, `tutor:${r.username}`, TUTOR_DAILY_LIMIT(), 86_400))) {
      return Response.json({ error: "Daily tutor budget reached — resets within 24h. Link your own AI in Settings to lift this." }, { status: 429 });
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

  if (r.kind === "cli") {
    return new Response(streamClaudeCli(system, messages), { headers });
  }

  let result: StreamResult;
  if (r.kind === "user" && r.provider === "openai") {
    result = await streamOpenAI(system, messages, r.key);
  } else {
    const key = r.kind === "user" ? r.key : process.env.ANTHROPIC_API_KEY!;
    result = await streamClaude(system, messages, key);
  }
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
  return new Response(result.stream, { headers });
}
