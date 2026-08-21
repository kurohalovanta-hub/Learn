import { NODES, NODE_MAP } from "@/content/nodes";
import { RANKS } from "@/content/ranks";
import type { NodeProgress, RankDef, Tier } from "@/lib/types";
import { tierAtLeast, tierRank } from "@/lib/types";
import { isNodeComplete } from "./graph";

const TIER_XP: Record<Tier, number> = {
  none: 0,
  bronze: 0.25,
  silver: 0.5,
  gold: 1,
  platinum: 1.25,
  research: 1.5,
};

/** XP = node hours × tier multiplier × 10. Bosses pay double. */
export function nodeXp(id: string, progress: Record<string, NodeProgress>): number {
  const node = NODE_MAP.get(id);
  const p = progress[id];
  if (!node || !p) return 0;
  const base = node.hours * TIER_XP[p.tier] * 10;
  return Math.round(id.startsWith("boss-") ? base * 2 : base);
}

export function totalXp(progress: Record<string, NodeProgress>): number {
  return Object.keys(progress).reduce((sum, id) => sum + nodeXp(id, progress), 0);
}

export function levelCompletion(level: number, progress: Record<string, NodeProgress>): number {
  const core = NODES.filter((n) => n.level === level && !n.optional);
  if (core.length === 0) return 0;
  const done = core.filter((n) => isNodeComplete(n, progress)).length;
  return done / core.length;
}

export function bossPassed(bossId: string, progress: Record<string, NodeProgress>): boolean {
  const node = NODE_MAP.get(bossId);
  if (!node) return false;
  return tierAtLeast(progress[bossId]?.tier ?? "none", node.masteryGate);
}

export function rankAchieved(r: RankDef, progress: Record<string, NodeProgress>): boolean {
  for (const b of r.bossIds ?? []) if (!bossPassed(b, progress)) return false;
  for (const [level, frac] of r.levelCompletion ?? []) {
    if (levelCompletion(level, progress) < frac) return false;
  }
  return true;
}

export function currentRank(progress: Record<string, NodeProgress>): RankDef {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (rankAchieved(r, progress)) current = r;
    else break;
  }
  return current;
}

export function nextRank(progress: Record<string, NodeProgress>): RankDef | null {
  const cur = currentRank(progress);
  return RANKS.find((r) => r.index === cur.index + 1) ?? null;
}

// ── Research-readiness score (HANDOVER §31 clusters) ───────────────
export interface ClusterScore {
  key: string;
  label: string;
  weight: number;
  score: number; // 0..1
}

const CLUSTERS: { key: string; label: string; levels: number[]; weight: number }[] = [
  { key: "programming", label: "Programming", levels: [0, 1], weight: 0.05 },
  { key: "mathematics", label: "Mathematics", levels: [2], weight: 0.1 },
  { key: "ml_dl", label: "ML / Deep Learning", levels: [3, 4], weight: 0.15 },
  { key: "robotics", label: "Robotics", levels: [5, 6, 7, 8, 9], weight: 0.15 },
  { key: "robot_learning", label: "Robot Learning", levels: [10, 11], weight: 0.15 },
  { key: "embodied", label: "Embodied Intelligence", levels: [12, 13, 14], weight: 0.2 },
  { key: "research", label: "Research Practice", levels: [15, 16], weight: 0.2 },
];

export function clusterScores(progress: Record<string, NodeProgress>): ClusterScore[] {
  return CLUSTERS.map((c) => {
    const nodes = NODES.filter((n) => c.levels.includes(n.level) && !n.optional);
    let acc = 0;
    for (const n of nodes) {
      const t = progress[n.id]?.tier ?? "none";
      if (tierAtLeast(t, n.masteryGate)) acc += 1;
      else if (tierRank(t) > 0) acc += 0.4 * (tierRank(t) / tierRank(n.masteryGate || "gold"));
    }
    return { key: c.key, label: c.label, weight: c.weight, score: nodes.length ? acc / nodes.length : 0 };
  });
}

/** 0–100: weighted mastery over the capstone clusters. */
export function readinessScore(progress: Record<string, NodeProgress>): number {
  const cs = clusterScores(progress);
  const s = cs.reduce((sum, c) => sum + c.weight * c.score, 0);
  return Math.round(s * 100);
}
