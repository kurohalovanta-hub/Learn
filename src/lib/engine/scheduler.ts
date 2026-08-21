import { NODE_MAP } from "@/content/nodes";
import { PROJECTS } from "@/content/projects";
import { DAY_TEMPLATE, RESEARCH_DAY_TEMPLATE } from "@/content/schedule";
import type { ProgressData, SkillNode, Track } from "@/lib/types";
import { frontier, missingPrereqs, prereqsSatisfied } from "./graph";
import { bossPassed } from "./mastery";
import { dayOfProgram, expectedLevels } from "./pacing";
import { reviewQueue } from "./review";

export interface MissionSlot {
  block: string;
  label: string;
  minutes: number;
  hint: string;
  node?: SkillNode;
  projectId?: string;
  projectTitle?: string;
  projectStep?: string;
  reviewCount?: number;
  note?: string;
}

export interface TodayMission {
  researchMode: boolean;
  slots: MissionSlot[];
  masteryCheck?: { nodeId: string; title: string; test: string };
  blockers: string[];
}

const TRACK_FOR_BLOCK: Record<string, Track[]> = {
  math: ["math"],
  implementation: ["code"],
  specialization: ["core"],
};

function pickForTracks(
  candidates: SkillNode[],
  tracks: Track[],
  expected: number[] | null,
  taken: Set<string>,
  learning: Set<string>,
): SkillNode | undefined {
  const pool = candidates.filter((n) => tracks.includes(n.track) && !taken.has(n.id));
  if (pool.length === 0) return undefined;
  const score = (n: SkillNode) => {
    let s = 0;
    if (learning.has(n.id)) s -= 1000; // finish what's started
    if (expected && expected.includes(n.level)) s -= 100; // phase-band fit
    s += n.level * 10; // lower levels first (unblock the graph)
    s += n.hours; // momentum: shorter first within a level
    if (n.optional) s += 500; // stretch content only when nothing else remains
    return s;
  };
  return [...pool].sort((a, b) => score(a) - score(b))[0];
}

export function researchModeActive(data: ProgressData, now = Date.now()): boolean {
  if (data.settings.researchModeOverride != null) return data.settings.researchModeOverride;
  const day = dayOfProgram(data.settings, now);
  return (day != null && day >= 181) || bossPassed("boss-vla", data.nodes);
}

export function activeProject(data: ProgressData) {
  const explicit = PROJECTS.find((p) => data.projects[p.id]?.status === "active");
  if (explicit) return explicit;
  // first not-done project whose prerequisite nodes are all at least unlocked-and-touched
  return PROJECTS.find(
    (p) =>
      data.projects[p.id]?.status !== "done" &&
      p.prereqNodeIds.every((id) => {
        const n = NODE_MAP.get(id);
        return n ? prereqsSatisfied(n, data.nodes) : true;
      }),
  );
}

export function todaysMission(data: ProgressData, now = Date.now()): TodayMission {
  const research = researchModeActive(data, now);
  const reviews = reviewQueue(data.nodes, now);
  const blockers: string[] = [];

  if (research) {
    const slots: MissionSlot[] = RESEARCH_DAY_TEMPLATE.map((t) => ({
      block: t.block,
      label: t.label,
      minutes: scaleMinutes(t.minutes, data.settings.dailyHoursTarget, 5.8),
      hint: t.hint,
    }));
    if (reviews.length) slots[slots.length - 1].reviewCount = reviews.length;
    const open = data.experiments.filter((e) => e.status === "running" || e.status === "planned");
    if (open.length === 0)
      blockers.push("No planned/running experiment — pre-register the next one in the Experiment Tracker before anything else.");
    return { researchMode: true, slots, blockers };
  }

  const front = frontier(data.nodes, now);
  const learning = new Set(
    front.filter((n) => data.nodes[n.id]?.status === "learning").map((n) => n.id),
  );
  const day = dayOfProgram(data.settings, now);
  const expected = day != null ? expectedLevels(day) : null;
  const taken = new Set<string>();

  const slots: MissionSlot[] = [];
  for (const t of DAY_TEMPLATE) {
    const minutes = scaleMinutes(t.minutes, data.settings.dailyHoursTarget, 6.4);
    if (t.block === "project") {
      const proj = activeProject(data);
      slots.push({
        block: t.block, label: t.label, minutes, hint: t.hint,
        projectId: proj?.id,
        projectTitle: proj ? `P${proj.num} · ${proj.title}` : undefined,
        projectStep: proj?.minimum[0],
        note: proj ? undefined : "No project unlocked yet — the ladder opens with Level 1 basics.",
      });
      continue;
    }
    if (t.block === "review") {
      slots.push({ block: t.block, label: t.label, minutes, hint: t.hint, reviewCount: reviews.length });
      continue;
    }
    const node = pickForTracks(front, TRACK_FOR_BLOCK[t.block] ?? ["core"], expected, taken, learning);
    if (node) taken.add(node.id);
    slots.push({
      block: t.block, label: t.label, minutes, hint: t.hint, node,
      note: node ? undefined : "This track's frontier is empty — pull extra time into another block today.",
    });
  }

  const mcNode =
    front.find((n) => learning.has(n.id)) ?? slots.find((s) => s.node)?.node;
  const masteryCheck = mcNode
    ? { nodeId: mcNode.id, title: mcNode.title, test: mcNode.masteryTest }
    : undefined;

  // near-unlock gates worth surfacing
  for (const id of ["l4-pytorch-tensors", "l10-tabular", "l12-smolvla-finetune"]) {
    const n = NODE_MAP.get(id);
    if (!n || prereqsSatisfied(n, data.nodes)) continue;
    const missing = missingPrereqs(n, data.nodes);
    const touchedAny = n.prereqs.some((p) => data.nodes[p.id]);
    if (missing.length <= 2 && touchedAny) {
      blockers.push(
        `“${n.title}” is ${missing.length} gate(s) away: ${missing
          .map((p) => `${NODE_MAP.get(p.id)?.title ?? p.id} → ${(p.tier ?? "silver").toUpperCase()}`)
          .join(", ")}`,
      );
    }
  }
  if (reviews.length > 10)
    blockers.push(`Review debt: ${reviews.length} items due — clear it before adding new material.`);

  return { researchMode: false, slots, masteryCheck, blockers };
}

function scaleMinutes(base: number, targetHours: number, templateHours: number): number {
  const scaled = (base * (targetHours || templateHours)) / templateHours;
  return Math.round(scaled / 5) * 5;
}
