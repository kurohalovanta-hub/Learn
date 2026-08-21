import { NODE_MAP } from "@/content/nodes";
import type { EvidenceRecord, NodeProgress, SemanticState, Tier } from "@/lib/types";
import { tierAtLeast, tierRank, TIERS } from "@/lib/types";

/**
 * Competency derivation (HANDOVERFINAL §24–26): the ONLY producer of tier /
 * status / verification flags. Pure function of the node's evidence log.
 *
 * Rules of the model:
 * - Exposure never advances mastery past "exposed".
 * - A tier at/above the gate requires a passed assessment (typed prove-it or
 *   diagnostic). Assessments taken with partial/full solution exposure cap at
 *   silver (HANDOVER §11: dependence on generated solutions is penalized).
 * - "Verified" additionally requires a LATER retention pass or a transfer pass,
 *   with no newer failed retention. Verification gates celebration and badges,
 *   never unlocks (honest speed is never delayed — §41).
 * - A manual-override event can raise the displayed tier (legacy/admin) but the
 *   result is flagged `legacy` and can never be `verified` by itself.
 * - An override with tier "none" is a reset boundary: earlier events are ignored.
 * - Retention failures demote verification/semantic state and confidence; they
 *   never erase history (§27).
 */

export interface DerivedNode {
  tier: Tier;
  status: NodeProgress["status"];
  verified: boolean;
  provisional: boolean;
  legacy: boolean;
  semantic: SemanticState;
  confidence: 1 | 2 | 3 | 4 | 5;
  masteredAt?: number;
  startedAt?: number;
  /** Highest-signal independence seen on the deciding assessment. */
  independenceCapped: boolean;
}

const CAPPED = new Set(["partial_solution", "full_solution_seen"]);

export function deriveNode(nodeId: string, allEvents: EvidenceRecord[]): DerivedNode {
  const node = NODE_MAP.get(nodeId);
  const gate: Tier = node?.masteryGate ?? "gold";

  let events = allEvents
    .filter((e) => e.nodeId === nodeId)
    .sort((a, b) => a.at - b.at);

  // reset boundary
  const lastReset = [...events].reverse().find((e) => e.kind === "manual-override" && e.tier === "none");
  if (lastReset) events = events.filter((e) => e.at > lastReset.at);

  const empty: DerivedNode = {
    tier: "none", status: "not_started", verified: false, provisional: false,
    legacy: false, semantic: "unknown", confidence: 3, independenceCapped: false,
  };
  if (events.length === 0) return empty;

  const of = (kinds: EvidenceRecord["kind"][], outcome?: EvidenceRecord["outcome"]) =>
    events.filter((e) => kinds.includes(e.kind) && (outcome == null || e.outcome === outcome));

  const exposure = of(["exposure"]).length;
  const retrievalPass = of(["retrieval"], "pass").length;
  const practiceAll = of(["problem", "derivation", "debugging"]);
  const practicePass = practiceAll.filter((e) => e.outcome === "pass").length;
  const implementPass = of(["implementation"], "pass").length;
  const transferPass = of(["transfer"], "pass").length;
  const integration = of(["project", "paper"], "pass").length;
  const researchEv = of(["research"], "pass").length;

  // deciding assessment = latest passed assessment
  const assessments = of(["assessment"]).filter((e) => e.outcome === "pass");
  const lastAssess = assessments[assessments.length - 1];
  const capped = !!lastAssess?.independence && CAPPED.has(lastAssess.independence);

  // retention relative to the deciding assessment
  const retention = of(["retention"]);
  const retAfter = lastAssess ? retention.filter((e) => e.at > lastAssess.at) : [];
  const retPassAfter = retAfter.filter((e) => e.outcome === "pass").length;
  const latestRet = retention[retention.length - 1];
  const latestRetFail = latestRet?.outcome === "fail";

  // ── tier from evidence ─────────────────────────────────────────────
  let tier: Tier = "none";
  if (retrievalPass >= 1 || (exposure >= 1 && practiceAll.length >= 1)) tier = "bronze";
  if (practicePass >= 2 || (practicePass >= 1 && implementPass >= 1)) tier = "silver";
  if (lastAssess) tier = capped ? "silver" : "gold";
  if (tier === "gold" && integration >= 1) tier = "platinum";
  if (tier === "platinum" && researchEv >= 1) tier = "research";

  // manual override can raise the DISPLAY tier, flagged legacy
  const override = [...events].reverse().find((e) => e.kind === "manual-override" && e.tier && e.tier !== "none");
  let legacy = false;
  if (override?.tier && tierRank(override.tier) > tierRank(tier)) {
    tier = override.tier;
    legacy = true;
  }

  const complete = node ? tierAtLeast(tier, gate) : tier !== "none";
  const verified =
    !!lastAssess && !capped && !legacyOnly(tier, gate, lastAssess, legacy) &&
    (retPassAfter >= 1 || transferPass >= 1) && !latestRetFail && complete;
  const provisional = complete && !verified;

  // ── semantic state ─────────────────────────────────────────────────
  let semantic: SemanticState = "unknown";
  if (exposure >= 1 || retrievalPass >= 1) semantic = "exposed";
  if (practiceAll.length >= 1) semantic = "practicing";
  const recentFails = practiceAll.slice(-3).filter((e) => e.outcome === "fail").length;
  if (!complete && recentFails >= 2) semantic = "weak";
  if (!complete && practicePass >= 1 && semantic !== "weak") semantic = "assessment-ready";
  if (complete) semantic = "claimed-provisional";
  if (verified) semantic = "independently-verified";
  if (complete && latestRetFail) semantic = "retention-risk";
  if (verified && integration >= 1) semantic = "integrated";
  if (verified && tier === "research") semantic = "research-level";

  // confidence walks with retention outcomes
  let confidence = 3;
  for (const r of retention) {
    if (r.outcome === "pass") confidence = Math.min(5, confidence + 1);
    else if (r.outcome === "fail") confidence = Math.max(1, confidence - 1);
  }

  return {
    tier,
    status: complete ? "mastered" : "learning",
    verified,
    provisional,
    legacy,
    semantic,
    confidence: confidence as 1 | 2 | 3 | 4 | 5,
    masteredAt: complete ? (lastAssess?.at ?? override?.at) : undefined,
    startedAt: events[0]?.at,
    independenceCapped: capped,
  };
}

/** legacy-only completeness: gate reached only via override, no real assessment at gate level */
function legacyOnly(tier: Tier, gate: Tier, lastAssess: EvidenceRecord | undefined, legacy: boolean): boolean {
  if (!legacy) return false;
  // if the assessment alone already yields the gate, the override isn't load-bearing
  return !(lastAssess && tierAtLeast("gold", gate));
}

/** Rich dimensions for the weekly/diagnostic surfaces (0..1 each). */
export interface CompetencyDims {
  exposure: number;
  retrieval: number;
  practice: number;
  implementation: number;
  transfer: number;
  retention: number;
  integration: number;
  aiDependence: number; // higher = more dependent
}

export function deriveDims(nodeId: string, allEvents: EvidenceRecord[]): CompetencyDims {
  const ev = allEvents.filter((e) => e.nodeId === nodeId);
  const frac = (kinds: EvidenceRecord["kind"][]) => {
    const xs = ev.filter((e) => kinds.includes(e.kind) && e.outcome !== "info");
    if (!xs.length) return 0;
    return xs.filter((e) => e.outcome === "pass").length / xs.length;
  };
  const cap01 = (n: number, k: number) => Math.min(1, n / k);
  const exposed = ev.filter((e) => e.kind === "exposure").length;
  const solutionSeen = ev.filter(
    (e) => e.independence && CAPPED.has(e.independence),
  ).length;
  const tutorFull = ev.filter((e) => e.kind === "tutor" && (e.score ?? 0) > 0).length;
  const attempts = ev.filter((e) => e.outcome !== "info").length || 1;
  return {
    exposure: cap01(exposed, 3),
    retrieval: frac(["retrieval"]),
    practice: frac(["problem", "derivation", "debugging"]),
    implementation: frac(["implementation"]),
    transfer: frac(["transfer"]),
    retention: frac(["retention"]),
    integration: cap01(ev.filter((e) => ["project", "paper"].includes(e.kind) && e.outcome === "pass").length, 2),
    aiDependence: Math.min(1, (solutionSeen + tutorFull) / attempts),
  };
}

/** Binge signal (Δ6): gate assessments in the last window vs. supporting work. */
export function bingeSignal(events: EvidenceRecord[], now = Date.now()) {
  const DAY = 24 * 3600 * 1000;
  const recent = events.filter((e) => now - e.at < DAY);
  const gateAssessments = recent.filter((e) => e.kind === "assessment" && e.outcome === "pass");
  const nodes = [...new Set(gateAssessments.map((e) => e.nodeId))];
  const declaredHours = nodes.reduce((s, id) => s + (NODE_MAP.get(id)?.hours ?? 0), 0);
  const workMinutes = recent
    .filter((e) => e.kind !== "assessment" && e.kind !== "manual-override")
    .reduce((s, e) => s + (e.minutes ?? (e.outcome === "info" ? 5 : 8)), 0);
  const active = nodes.length >= 3 && workMinutes < declaredHours * 60 * 0.3;
  return { active, nodesClaimed24h: nodes.length, workMinutes24h: Math.round(workMinutes), declaredHours };
}

/** Map the 3-way UI honesty choice onto the 5-level internal scale (Δ2). */
export function independenceFromChoice(c: "myself" | "hints" | "ai"): import("@/lib/types").IndependenceLevel {
  return c === "myself" ? "independent" : c === "hints" ? "minor_hints" : "full_solution_seen";
}

export const TIER_ORDER = TIERS;
