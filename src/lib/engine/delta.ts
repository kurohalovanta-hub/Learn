import { NODE_MAP } from "@/content/nodes";
import { PAPERS } from "@/content/papers";
import { PROJECTS } from "@/content/projects";
import type { NodeProgress, Paper, Project, SkillNode, Tier } from "@/lib/types";
import { isNodeComplete, prereqsSatisfied } from "./graph";
import { currentRank, nodeXp } from "./mastery";
import type { RankDef } from "@/lib/types";

export interface MasteryDelta {
  nodeId: string;
  title: string;
  tier: Tier;
  xpGained: number;
  unlockedNodes: SkillNode[];
  readyPapers: Paper[];
  readyProjects: Project[];
  rankBefore: RankDef;
  rankAfter: RankDef;
  crossedGate: boolean;
}

const paperReady = (p: Paper, progress: Record<string, NodeProgress>) =>
  p.prereqNodeIds.length > 0 &&
  p.prereqNodeIds.every((id) => {
    const n = NODE_MAP.get(id);
    return n ? isNodeComplete(n, progress) : true;
  });

const projectReady = (p: Project, progress: Record<string, NodeProgress>) =>
  p.prereqNodeIds.every((id) => {
    const n = NODE_MAP.get(id);
    return n ? isNodeComplete(n, progress) : true;
  });

/** Everything that truthfully changed when `nodeId`'s progress moved before→after. */
export function masteryDelta(
  nodeId: string,
  before: Record<string, NodeProgress>,
  after: Record<string, NodeProgress>,
): MasteryDelta | null {
  const node = NODE_MAP.get(nodeId);
  if (!node) return null;
  const wasComplete = isNodeComplete(node, before);
  const nowComplete = isNodeComplete(node, after);
  const crossedGate = !wasComplete && nowComplete;
  if (!crossedGate) return null;

  const unlockedNodes = [...NODE_MAP.values()].filter(
    (n) => n.id !== nodeId && !prereqsSatisfied(n, before) && prereqsSatisfied(n, after) && !isNodeComplete(n, after),
  );
  const readyPapers = PAPERS.filter((p) => !paperReady(p, before) && paperReady(p, after));
  const readyProjects = PROJECTS.filter((p) => !projectReady(p, before) && projectReady(p, after));

  return {
    nodeId,
    title: node.title,
    tier: after[nodeId]?.tier ?? node.masteryGate,
    xpGained: nodeXp(nodeId, after) - nodeXp(nodeId, before),
    unlockedNodes,
    readyPapers,
    readyProjects,
    rankBefore: currentRank(before),
    rankAfter: currentRank(after),
    crossedGate,
  };
}
