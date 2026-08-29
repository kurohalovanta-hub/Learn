// Live tutor server core (ADR-005). Grounded, brief, adaptive — the three
// contracts live in the system prompt built here; the route enforces auth+budget.

import { NODE_MAP } from "@/content/nodes";
import { PACKET_REGISTRY } from "@/content/packets/registry";
import { fallbackPacket } from "@/lib/packet-fallback";
import type { LearningPacket } from "@/lib/packet-types";
import { modeContract, type TutorMode } from "@/lib/tutor";

export const TUTOR_MODEL = () => process.env.TUTOR_MODEL ?? "claude-sonnet-5";
export const TUTOR_DAILY_LIMIT = () => {
  const n = Number(process.env.TUTOR_DAILY_LIMIT);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 300;
};
export const tutorKeySet = () => !!process.env.ANTHROPIC_API_KEY;

const MAX_REPLY_TOKENS = 1500;
const MAX_HISTORY = 20;
const MAX_MSG_CHARS = 12_000;

export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
}

/** Everything the packet knows, flattened for the system prompt. */
async function loadPacket(nodeId: string): Promise<LearningPacket | null> {
  const node = NODE_MAP.get(nodeId);
  if (!node) return null;
  const load = PACKET_REGISTRY[nodeId];
  if (load) return (await load()).packet;
  return fallbackPacket(node);
}

export async function buildGrounding(nodeId: string): Promise<string | null> {
  const node = NODE_MAP.get(nodeId);
  const packet = await loadPacket(nodeId);
  if (!node || !packet) return null;

  const watch = [...(packet.orient ? [packet.orient] : []), ...(packet.coreWatch ?? [])]
    .map((m) => `- ${m.title} (${m.creator}, ${m.minutes} min) — why: ${m.whySelected}${m.leaveWith?.length ? ` — leave with: ${m.leaveWith.join("; ")}` : ""}`)
    .join("\n");
  const read = (packet.coreRead ?? [])
    .map((r) => `- ${r.title} — sections: ${r.sections} (${r.minutes} min)${r.whySelected ? ` — why: ${r.whySelected}` : ""}`)
    .join("\n");
  const recall = (packet.recall ?? [])
    .map((r, i) => `Q${i + 1}: ${r.q}\nA${i + 1}: ${r.a}`)
    .join("\n");
  const practice = packet.practice
    .map((p, i) => `- P${i + 1}: ${p.prompt}${p.source ? ` [${p.source}]` : ""}`)
    .join("\n");
  const build = [
    packet.implement ? `IMPLEMENT: ${packet.implement.spec}${packet.implement.checks?.length ? ` — checks: ${packet.implement.checks.join("; ")}` : ""}` : "",
    packet.derive ? `DERIVE: ${packet.derive.spec}${packet.derive.checks?.length ? ` — checks: ${packet.derive.checks.join("; ")}` : ""}` : "",
  ].filter(Boolean).join("\n");

  return `CURATED MATERIALS for "${node.title}" (node ${node.id}, level ${node.level}) — this is your ground truth:
WHY NOW: ${packet.whyNow}
OBJECTIVES: ${node.objectives.join(" · ")}
${watch ? `WATCH:\n${watch}\n` : ""}${read ? `READ:\n${read}\n` : ""}${recall ? `RECALL GROUND TRUTH (the learner works these — never volunteer the answers unprompted):\n${recall}\n` : ""}${practice ? `PRACTICE BLOCKS:\n${practice}\n` : ""}${build ? `${build}\n` : ""}PROVE (assessment): ${packet.prove.task} — criteria: ${packet.prove.criteria.join("; ")}
REQUIRED MASTERY BAR: ${node.masteryTest}
TEST-OUT DIAGNOSTIC: ${node.diagnostic}`;
}

const SUMMARY_SCHEMA = `{"node_id":"<id>","mode":"<mode>","concepts_worked":[],"verified_strengths":[],"remaining_weaknesses":[],"misconceptions":[],"independent_successes":[],"hint_assisted_successes":[],"full_solution_exposures":[],"recommended_mastery_candidate":null,"recommended_remediation":[],"recommended_next_task":"","confidence":0.0}`;

export function buildSystemPrompt(
  nodeId: string,
  mode: TutorMode,
  learnerContext: string,
  grounding: string,
): string {
  return `You are the resident tutor of HALO (PROJECT : VANTA HALO), a mastery-gated learning system carrying one learner toward independent embodied-intelligence research capability. You teach inside the app, at the exact node the learner is on.

${grounding}

LEARNER STATE (derived from their evidence log — trust this over their self-description):
${learnerContext}

ACTIVE MODE: ${modeContract(mode)}

THE THREE CONTRACTS — these override any generic assistant habit:

1. GROUNDING. Teach from the curated materials above. They were human-verified; your job is to make them land, not to replace them. If a question goes beyond them, answer briefly but OPEN with "beyond the curated path:" and point to where in the materials (or which primary source) the real treatment lives. Never invent citations, video timestamps, papers, or numbers. If you are not sure, say so in one clause.

2. BREVITY. Answer first, context after. One concept per turn. Default replies under 150 words — the learner asks for depth when they want it; never pre-emptively elaborate. No praise filler, no restating their question, no "great question". Math in KaTeX ($inline$, $$display$$). Code in fenced blocks.

3. ADAPTATION. On first contact with a topic, probe with ONE short question before teaching. Skip anything their evidence already verifies. When they miss twice, halve the step size and drop one level of abstraction. When they are fast, jump ahead — never pad.

CODE REVIEW. When the learner sends code, it may come with REAL output from the in-browser Python runner — that output is ground truth, never contradict it. Anchor feedback to specific lines. Per the debug contract: point at the line, ask what they expected there; give the fix only when they explicitly ask, and label it plainly as a shown solution.

HONESTY RULES (non-negotiable, same as the whole system):
- Never solve the REQUIRED MASTERY BAR task for them, even asked directly — refuse and say why.
- Never declare anything "mastered" — mastery is derived elsewhere from their own typed attempts.
- When you do show a full solution, label it: "full solution — this caps this work at Silver."

EVERY reply must end with a final line of 2–4 tap options in the learner's voice, exactly:
[[opts: <option> | <option> | <option>]]
Options are ≤6 words, concrete next moves (e.g. "show me an example", "I don't get step 2", "quiz me on this", "skip ahead, I know this"). No options line only when emitting the end-of-session JSON.

END OF SESSION: when the learner says the session is over / asks for the summary, output ONLY this JSON, no prose, honestly filled:
${SUMMARY_SCHEMA.replace('"<id>"', `"${nodeId}"`).replace("<mode>", mode)}`;
}

export type StreamResult =
  | { ok: true; stream: ReadableStream<Uint8Array> }
  | { ok: false; status: number; error: string };

const clip = (messages: TutorMessage[]) =>
  messages.slice(-MAX_HISTORY).map((m) => ({
    role: m.role,
    content: m.content.length > MAX_MSG_CHARS ? `${m.content.slice(0, MAX_MSG_CHARS)}\n…[truncated]` : m.content,
  }));

/**
 * Call Anthropic with streaming and return a stream of plain text chunks
 * (SSE parsed server-side so the client just reads text).
 */
export async function streamClaude(
  system: string,
  messages: TutorMessage[],
  apiKey: string,
): Promise<StreamResult> {
  const clipped = clip(messages);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: TUTOR_MODEL(),
      max_tokens: MAX_REPLY_TOKENS,
      system,
      messages: clipped,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    let msg = `upstream ${res.status}`;
    try {
      const j = JSON.parse(text) as { error?: { message?: string } };
      if (j.error?.message) msg = j.error.message;
    } catch { /* keep the status text */ }
    return { ok: false, status: res.status === 429 ? 429 : 502, error: msg };
  }

  const upstream = res.body;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();
      let buf = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          // SSE frames are separated by a blank line
          const frames = buf.split("\n\n");
          buf = frames.pop() ?? "";
          for (const frame of frames) {
            const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
            if (!dataLine) continue;
            try {
              const evt = JSON.parse(dataLine.slice(5).trim()) as {
                type: string;
                delta?: { type?: string; text?: string };
                error?: { message?: string };
              };
              if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta" && evt.delta.text) {
                controller.enqueue(encoder.encode(evt.delta.text));
              } else if (evt.type === "error") {
                controller.enqueue(encoder.encode(`\n\n⚠ tutor stream error: ${evt.error?.message ?? "unknown"}`));
              }
            } catch { /* ignore unparseable frames (ping etc.) */ }
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n⚠ connection to the tutor dropped — send that again."));
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
    cancel() {
      void upstream.cancel().catch(() => {});
    },
  });

  return { ok: true, stream };
}

/** Same contract as streamClaude, but through the learner's own OpenAI key.
 * Uses the Responses API (recommended for all new integrations, verified
 * 2026-08-29) with gpt-5.6-terra as the balanced default. */
export const TUTOR_OPENAI_MODEL = () => process.env.TUTOR_OPENAI_MODEL ?? "gpt-5.6-terra";

export async function streamOpenAI(
  system: string,
  messages: TutorMessage[],
  apiKey: string,
): Promise<StreamResult> {
  const clipped = clip(messages);

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: TUTOR_OPENAI_MODEL(),
      max_output_tokens: MAX_REPLY_TOKENS,
      instructions: system,
      input: clipped,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    let msg = `upstream ${res.status}`;
    try {
      const j = JSON.parse(text) as { error?: { message?: string } };
      if (j.error?.message) msg = j.error.message;
    } catch { /* keep the status text */ }
    return { ok: false, status: res.status === 429 ? 429 : 502, error: msg };
  }

  const upstream = res.body;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();
      let buf = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const data = line.startsWith("data:") ? line.slice(5).trim() : null;
            if (!data) continue;
            try {
              const evt = JSON.parse(data) as { type?: string; delta?: string; error?: { message?: string } };
              if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
                controller.enqueue(encoder.encode(evt.delta));
              } else if (evt.type === "response.failed" || evt.type === "error") {
                controller.enqueue(encoder.encode(`\n\n⚠ tutor stream error: ${evt.error?.message ?? "unknown"}`));
              }
            } catch { /* ignore keep-alives */ }
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n⚠ connection to the tutor dropped — send that again."));
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
    cancel() {
      void upstream.cancel().catch(() => {});
    },
  });

  return { ok: true, stream };
}
