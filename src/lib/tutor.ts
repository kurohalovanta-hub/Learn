// Provider-neutral AI-tutor bridge (HANDOVERFINAL §21–23, §39, §51).
// V1 is copy-based: the app assembles a compact packet; the learner pastes it
// into Claude or ChatGPT; the tutor returns a structured session summary the
// app ingests as evidence. Neither provider owns learner state.

import { NODE_MAP } from "@/content/nodes";
import { resourceById } from "@/content/resources";
import { effortDay } from "@/lib/engine/pacing";
import type { EvidenceRecord, ProgressData, Settings } from "@/lib/types";
import type { NewEvidence } from "@/lib/store";

export type TutorMode =
  | "teach" | "diagnose" | "socratic" | "practice"
  | "debug" | "examine" | "defense" | "critic";

export const TUTOR_MODE_LABELS: Record<TutorMode, string> = {
  teach: "Teach me",
  diagnose: "Diagnose me",
  socratic: "Socratic",
  practice: "Practice",
  debug: "Debug with me",
  examine: "Examine me",
  defense: "Paper defense",
  critic: "Research critic",
};

const MODE_CONTRACTS: Record<TutorMode, string> = {
  teach: "Explain the smallest useful piece, then make me use it immediately. No lecture dumps.",
  diagnose: "Do not teach yet. Ask me one question at a time until you find the exact prerequisite I am missing, then name it.",
  socratic: "Never state the answer. Lead with questions; give the smallest next hint only after I attempt each step.",
  practice: "Generate one problem at a time at the edge of my level. I answer; you grade tersely, then escalate difficulty.",
  debug: "Review my code/derivation for conceptual errors. Point at lines and ask what I expected; do NOT rewrite it unless I explicitly ask for the solution.",
  examine: "Closed-book oral exam. Ask me to derive/explain/apply; push follow-up 'why' questions; keep score honestly.",
  defense: "Quiz me on this material as if I am defending it to its authors. Attack assumptions and weaknesses.",
  critic: "Act as a skeptical research reviewer of my idea/experiment: assumptions, baselines, confounds, what result would falsify it.",
};

/**
 * Compact learner-state context for one node — shared by the copy-paste packet
 * and the live tutor route (which injects it into the system prompt).
 */
export function buildLearnerContext(
  nodeId: string,
  data: Pick<ProgressData, "nodes" | "events" | "logs"> & { settings?: Settings },
  bottleneck?: string,
): string {
  const node = NODE_MAP.get(nodeId);
  if (!node) return "";
  const effort = data.settings ? effortDay(data.logs, data.settings) : null;
  const nodeMinutes = data.events.filter((e) => e.nodeId === nodeId).reduce((s, e) => s + (e.minutes ?? 0), 0);
  const p = data.nodes[nodeId];
  const ev = data.events.filter((e) => e.nodeId === nodeId);
  const failed = ev.filter((e) => e.outcome === "fail").slice(-4);
  const recent = ev.slice(-6);
  const aiHeavy = ev.filter((e) => e.independence === "full_solution_seen" || e.independence === "partial_solution").length;
  const prereqState = node.prereqs
    .map((pr) => {
      const pp = data.nodes[pr.id];
      const t = pp?.tier ?? "none";
      return `${NODE_MAP.get(pr.id)?.title ?? pr.id}: ${t}${pp?.verified ? " (verified)" : pp?.provisional ? " (claimed, unverified)" : ""}`;
    })
    .join("; ") || "none";
  const primary = node.primary ? resourceById(node.primary.resourceId) : undefined;

  return `OVERALL GOAL: independent embodied-intelligence/robot-learning research capability (currently working the skill graph toward that).
PACE — judge by EFFORT, never the calendar: the learner studies in irregular bursts (may vanish for days, then finish a lot in one sitting). ${effort != null ? `They have logged ~${effort} full study-days of actual work so far` : "Effort not tracked yet"}; ~${Math.round(nodeMinutes)} minutes on THIS node. Meet them where their effort and evidence put them, not where a schedule says they "should" be. Never scold absence; pace to the work in front of you.
CURRENT NODE: ${node.title} (${node.id}, level ${node.level})
NODE OBJECTIVES: ${node.objectives.join(" · ")}
CURRENT BOTTLENECK: ${bottleneck ?? (failed.length ? `recent failures on: ${failed.map((f) => f.kind + (f.note ? ` (${f.note})` : "")).join("; ")}` : "first contact with this material")}
VERIFIED PREREQUISITES: ${prereqState}
MY STATE ON THIS NODE: ${p ? `${p.semantic ?? p.status}, tier ${p.tier}${p.verified ? ", verified" : p.provisional ? ", claimed-unverified" : ""}` : "not started"}
RECENT EVIDENCE (last ${recent.length}): ${recent.map((e) => `${e.kind}:${e.outcome}${e.independence ? `/${e.independence}` : ""}`).join(", ") || "none"}
AI-ASSISTANCE HISTORY: ${aiHeavy} of ${ev.length || 0} evidence items involved seeing solutions — track my independence honestly.
PRIMARY RESOURCE: ${primary ? `${primary.title} — study: ${node.primary?.sections}` : "self-contained node"}
REQUIRED MASTERY (the bar): ${node.masteryTest}
TEST-OUT DIAGNOSTIC: ${node.diagnostic}`;
}

export function modeContract(mode: TutorMode): string {
  return `${TUTOR_MODE_LABELS[mode].toUpperCase()} — ${MODE_CONTRACTS[mode]}`;
}

/** Compact tutor packet — everything a fresh tutor session needs (§21). */
export function buildTutorPacket(
  mode: TutorMode,
  nodeId: string,
  data: Pick<ProgressData, "nodes" | "events" | "logs">,
  bottleneck?: string,
): string {
  const node = NODE_MAP.get(nodeId);
  if (!node) return "";

  return `TUTOR SESSION PACKET — HALO (paste this whole block, then start)

${buildLearnerContext(nodeId, data, bottleneck)}

TUTOR MODE: ${modeContract(mode)}

RULES (non-negotiable):
1. Never solve the REQUIRED MASTERY task above for me, even if I ask — say you are refusing and why.
2. Default to questions and minimal hints; full solutions only on my explicit request, and flag them.
3. Do not praise without evidence. Do not mark anything "mastered" — that happens elsewhere, on my own typed attempt.
4. At session end, output ONLY this JSON (no prose around it):
{"node_id":"${node.id}","mode":"${mode}","concepts_worked":[],"verified_strengths":[],"remaining_weaknesses":[],"misconceptions":[],"independent_successes":[],"hint_assisted_successes":[],"full_solution_exposures":[],"recommended_mastery_candidate":null,"recommended_remediation":[],"recommended_next_task":"","confidence":0.0}`;
}

// ── session-summary ingestion (§23 → evidence) ─────────────────────

export interface TutorSummary {
  node_id: string;
  mode: string;
  concepts_worked: string[];
  verified_strengths: string[];
  remaining_weaknesses: string[];
  misconceptions: string[];
  independent_successes: string[];
  hint_assisted_successes: string[];
  full_solution_exposures: string[];
  recommended_mastery_candidate: string | null;
  recommended_remediation: string[];
  recommended_next_task: string;
  confidence: number;
}

const strArr = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");

export function parseTutorSummary(raw: string): { ok: true; summary: TutorSummary } | { ok: false; error: string } {
  let obj: unknown;
  try {
    // tolerate the JSON being embedded in surrounding prose/code fences
    const m = raw.match(/\{[\s\S]*\}/);
    obj = JSON.parse(m ? m[0] : raw);
  } catch {
    return { ok: false, error: "Not valid JSON — paste the session-summary block the tutor produced." };
  }
  const s = obj as Record<string, unknown>;
  if (typeof s.node_id !== "string" || !NODE_MAP.has(s.node_id))
    return { ok: false, error: `node_id missing or unknown (${String(s.node_id)})` };
  for (const k of ["concepts_worked", "verified_strengths", "remaining_weaknesses", "misconceptions", "independent_successes", "hint_assisted_successes", "full_solution_exposures", "recommended_remediation"] as const) {
    if (s[k] == null) s[k] = [];
    if (!strArr(s[k])) return { ok: false, error: `${k} must be a string array` };
  }
  if (typeof s.mode !== "string") s.mode = "teach";
  if (typeof s.confidence !== "number") s.confidence = 0;
  if (typeof s.recommended_next_task !== "string") s.recommended_next_task = "";
  if (s.recommended_mastery_candidate != null && typeof s.recommended_mastery_candidate !== "string") s.recommended_mastery_candidate = null;
  return { ok: true, summary: s as unknown as TutorSummary };
}

/**
 * Convert a tutor summary into evidence (Δ11 weighting):
 * - the session itself → `tutor` info event; score>0 marks full-solution exposure (raises aiDependence)
 * - problems solved in-session → `problem` evidence at the honest independence level
 *   (practice signal only — verification still requires the typed prove-it + retention)
 */
export function summaryToEvidence(s: TutorSummary): NewEvidence[] {
  const out: NewEvidence[] = [];
  out.push({
    nodeId: s.node_id,
    kind: "tutor",
    outcome: "info",
    score: s.full_solution_exposures.length > 0 ? 1 : 0,
    note: `${s.mode} session · worked: ${s.concepts_worked.slice(0, 3).join(", ") || "—"} · weak: ${s.remaining_weaknesses.slice(0, 3).join(", ") || "—"} · conf ${s.confidence}`,
    minutes: 20,
  });
  for (const item of s.independent_successes.slice(0, 6)) {
    out.push({ nodeId: s.node_id, kind: "problem", outcome: "pass", independence: "socratic", note: `tutor: ${item.slice(0, 120)}`, minutes: 6 });
  }
  for (const item of s.hint_assisted_successes.slice(0, 6)) {
    out.push({ nodeId: s.node_id, kind: "problem", outcome: "pass", independence: "minor_hints", note: `tutor: ${item.slice(0, 120)}`, minutes: 6 });
  }
  for (const item of s.full_solution_exposures.slice(0, 6)) {
    out.push({ nodeId: s.node_id, kind: "problem", outcome: "partial", independence: "full_solution_seen", note: `solution seen: ${item.slice(0, 120)}`, minutes: 4 });
  }
  for (const w of [...s.remaining_weaknesses, ...s.misconceptions].slice(0, 4)) {
    out.push({ nodeId: s.node_id, kind: "retrieval", outcome: "fail", note: `tutor-flagged: ${w.slice(0, 140)}` });
  }
  return out;
}

/** Node-agnostic default for surfaces without a node context. */
export function nodeForTutor(events: EvidenceRecord[], fallback: string): string {
  const last = [...events].reverse().find((e) => e.kind !== "manual-override");
  return last?.nodeId ?? fallback;
}
