import { NODES, NODE_MAP } from "@/content/nodes";
import type { NodeProgress, NodeState, SkillNode, Tier } from "@/lib/types";
import { tierAtLeast } from "@/lib/types";

export const DEFAULT_EDGE_TIER: Tier = "silver";

export interface GraphIndexes {
  dependents: Map<string, string[]>; // id -> nodes that require it
}

let _indexes: GraphIndexes | null = null;
export function graphIndexes(): GraphIndexes {
  if (_indexes) return _indexes;
  const dependents = new Map<string, string[]>();
  for (const n of NODES) {
    for (const p of n.prereqs) {
      const arr = dependents.get(p.id) ?? [];
      arr.push(n.id);
      dependents.set(p.id, arr);
    }
  }
  _indexes = { dependents };
  return _indexes;
}

export function progressTier(progress: Record<string, NodeProgress>, id: string): Tier {
  return progress[id]?.tier ?? "none";
}

export function isNodeComplete(node: SkillNode, progress: Record<string, NodeProgress>): boolean {
  return tierAtLeast(progressTier(progress, node.id), node.masteryGate);
}

export function prereqsSatisfied(node: SkillNode, progress: Record<string, NodeProgress>): boolean {
  return node.prereqs.every((p) =>
    tierAtLeast(progressTier(progress, p.id), p.tier ?? DEFAULT_EDGE_TIER),
  );
}

export function missingPrereqs(node: SkillNode, progress: Record<string, NodeProgress>) {
  return node.prereqs.filter(
    (p) => !tierAtLeast(progressTier(progress, p.id), p.tier ?? DEFAULT_EDGE_TIER),
  );
}

export function nodeState(
  id: string,
  progress: Record<string, NodeProgress>,
  now: number = Date.now(),
): NodeState {
  const node = NODE_MAP.get(id);
  if (!node) return "locked";
  const p = progress[id];
  if (p && isNodeComplete(node, progress)) {
    if (p.tier === "research") return "research-level";
    if (p.review && p.review.due <= now) return "review-due";
    return "mastered";
  }
  if (p?.status === "learning") return "learning";
  return prereqsSatisfied(node, progress) ? "available" : "locked";
}

/** Nodes ready to start or in progress (the unlock frontier). */
export function frontier(progress: Record<string, NodeProgress>, now = Date.now()): SkillNode[] {
  return NODES.filter((n) => {
    const s = nodeState(n.id, progress, now);
    return s === "available" || s === "learning";
  });
}

/** What a node unlocks (direct dependents). */
export function unlocks(id: string): SkillNode[] {
  return (graphIndexes().dependents.get(id) ?? []).map((d) => NODE_MAP.get(d)!).filter(Boolean);
}

/** Dependents that would become available if `id` reached its gate now. */
export function wouldUnlock(id: string, progress: Record<string, NodeProgress>): SkillNode[] {
  const node = NODE_MAP.get(id);
  if (!node) return [];
  const simulated: Record<string, NodeProgress> = {
    ...progress,
    [id]: { status: "mastered", tier: node.masteryGate, updatedAt: 0 },
  };
  return unlocks(id).filter(
    (d) => !prereqsSatisfied(d, progress) && prereqsSatisfied(d, simulated),
  );
}

// ── Layout (computed once; deterministic; pure content function) ───
export interface LayoutNode {
  id: string;
  x: number;
  y: number;
}

const COL_W = 240;
const ROW_H = 96;
const TRACK_ORDER: Record<string, number> = { math: 0, core: 1, code: 2, project: 3, research: 4 };

let _layout: { nodes: Map<string, LayoutNode>; width: number; height: number } | null = null;
export function graphLayout() {
  if (_layout) return _layout;
  const nodes = new Map<string, LayoutNode>();
  let maxRows = 0;
  for (let level = 0; level <= 16; level++) {
    const ns = NODES.filter((n) => n.level === level).sort(
      (a, b) => (TRACK_ORDER[a.track] ?? 9) - (TRACK_ORDER[b.track] ?? 9),
    );
    ns.forEach((n, i) => {
      nodes.set(n.id, { id: n.id, x: level * COL_W + 60, y: i * ROW_H + 80 });
    });
    maxRows = Math.max(maxRows, ns.length);
  }
  _layout = { nodes, width: 17 * COL_W + 120, height: maxRows * ROW_H + 160 };
  return _layout;
}
