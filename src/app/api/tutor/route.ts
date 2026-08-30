// Live tutor route (ADR-005, bridge era).
// Backend resolution order per request:
//   1. the learner's BRIDGE — their own machine answering through their own
//      Claude Code / ChatGPT Codex logins (no API keys anywhere)
//   2. the learner's own linked API key (Claude or ChatGPT) — optional
//   3. the local Claude Code CLI (when the app itself runs on the learner's PC)
//   4. a deployment-wide ANTHROPIC_API_KEY (optional; session + daily budget)
// GET reports which backend would serve; POST accepts a model override from
// the allowlist of whatever backend is active.

import { randomUUID } from "node:crypto";
import { NODE_MAP } from "@/content/nodes";
import { getRedis, rateLimit, requireSession } from "@/lib/server/auth";
import { loadAIKeys, pickProvider } from "@/lib/server/ai-keys";
import { bridgeOnline, bumpShareCount, enqueueJob, enqueueSharedJob, sharedBridgeFor, streamJobOutput } from "@/lib/server/bridge";
import {
  buildGrounding, buildSystemPrompt, streamClaude, streamOpenAI,
  TUTOR_DAILY_LIMIT, tutorKeySet, type StreamResult, type TutorMessage,
} from "@/lib/server/tutor";
import { claudeCliAvailable, streamClaudeCli } from "@/lib/server/tutor-cli";
import type { TutorMode } from "@/lib/tutor";

export const maxDuration = 120;

const DEV = process.env.NODE_ENV === "development";

const MODES = new Set<TutorMode>(["teach", "diagnose", "socratic", "practice", "debug", "examine", "defense", "critic"]);

const MODEL_ALLOW: Record<string, string[]> = {
  "bridge-claude": ["sonnet", "opus", "haiku"],
  "bridge-codex": ["gpt-5.6", "gpt-5.6-terra", "gpt-5.6-sol", "gpt-5.6-luna"],
  "your-claude": ["claude-sonnet-5", "claude-opus-5", "claude-haiku-4-5"],
  "your-chatgpt": ["gpt-5.6-terra", "gpt-5.6-sol", "gpt-5.6-luna"],
  "cli": ["sonnet", "opus", "haiku"],
};

type Resolved =
  | { kind: "bridge"; engine: "claude" | "codex"; username: string }
  | { kind: "shared"; username: string }
  | { kind: "user"; provider: "anthropic" | "openai"; key: string; username: string }
  | { kind: "cli" }
  | { kind: "env"; username: string | null };

async function resolveBackend(req: Request): Promise<Resolved | { kind: "none"; reason: string }> {
  const redis = getRedis();
  if (redis) {
    const ctx = await requireSession(req);
    if (!(ctx instanceof Response)) {
      const keys = await loadAIKeys(redis, ctx.user.username);
      if (await bridgeOnline(redis, ctx.user.username)) {
        return { kind: "bridge", engine: keys.bridge ?? "claude", username: ctx.user.username };
      }
      const pick = pickProvider(keys);
      if (pick) return { kind: "user", provider: pick.provider, key: pick.key, username: ctx.user.username };
      // an admin can lend their bridge to allowlisted users (safe tutor mode only)
      if ((await sharedBridgeFor(redis, ctx.user.username)).ok) return { kind: "shared", username: ctx.user.username };
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

const backendName = (r: Resolved): string =>
  r.kind === "bridge" ? `bridge-${r.engine}`
  : r.kind === "shared" ? "shared"
  : r.kind === "user" ? (r.provider === "anthropic" ? "your-claude" : "your-chatgpt")
  : r.kind === "cli" ? "cli"
  : "deployment";

export async function GET(req: Request) {
  const r = await resolveBackend(req);
  if (r.kind === "none") return Response.json({ available: false, reason: r.reason });
  const backend = backendName(r);
  return Response.json({ available: true, backend, models: MODEL_ALLOW[backend] ?? [] });
}

export async function POST(req: Request) {
  const r = await resolveBackend(req);
  if (r.kind === "none") {
    const friendly: Record<string, string> = {
      "connect": "Nothing connected yet — start your bridge (Settings → connections) or link an API key.",
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
      return Response.json({ error: "Daily tutor budget reached — resets within 24h. Start your bridge or link a key in Settings to lift this." }, { status: 429 });
    }
  }

  let body: { nodeId?: string; mode?: string; context?: string; model?: string; messages?: TutorMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const nodeId = typeof body.nodeId === "string" ? body.nodeId : "";
  if (!NODE_MAP.has(nodeId)) return Response.json({ error: `unknown node: ${nodeId}` }, { status: 400 });
  const mode: TutorMode = MODES.has(body.mode as TutorMode) ? (body.mode as TutorMode) : "teach";
  const context = typeof body.context === "string" ? body.context.slice(0, 8_000) : "";
  const allowed = MODEL_ALLOW[backendName(r)] ?? [];
  const model = typeof body.model === "string" && allowed.includes(body.model) ? body.model : undefined;
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

  if (r.kind === "bridge") {
    const redis = getRedis()!;
    const id = randomUUID();
    await enqueueJob(redis, r.username, {
      id, provider: r.engine, model,
      system, messages: messages.slice(-20),
    });
    return new Response(streamJobOutput(redis, id), { headers });
  }

  if (r.kind === "shared") {
    const redis = getRedis()!;
    const id = randomUUID();
    // shared jobs run on the admin's bridge in SAFE tutor mode (raw:false enforced
    // when the owner's bridge pops them); count against the per-user daily cap
    await enqueueSharedJob(redis, { id, provider: "claude", system, messages: messages.slice(-20) });
    await bumpShareCount(redis, r.username);
    return new Response(streamJobOutput(redis, id, 120_000), { headers });
  }

  if (r.kind === "cli") {
    return new Response(streamClaudeCli(system, messages, model), { headers });
  }

  let result: StreamResult;
  if (r.kind === "user" && r.provider === "openai") {
    result = await streamOpenAI(system, messages, r.key, model);
  } else {
    const key = r.kind === "user" ? r.key : process.env.ANTHROPIC_API_KEY!;
    result = await streamClaude(system, messages, key, model);
  }
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
  return new Response(result.stream, { headers });
}
