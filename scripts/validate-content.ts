/**
 * Content integrity validator — runs in `prebuild`.
 * Broken curriculum content must fail the build, not ship.
 */
import { NODES, NODE_MAP } from "../src/content/nodes";
import { RESOURCES } from "../src/content/resources";
import { PAPERS } from "../src/content/papers";
import { PROJECTS } from "../src/content/projects";
import { BOSSES } from "../src/content/bosses";
import { LEVELS } from "../src/content/levels";
import { RANKS } from "../src/content/ranks";

const errors: string[] = [];
const warn: string[] = [];

const resourceIds = new Set(RESOURCES.map((r) => r.id));
const paperIds = new Set(PAPERS.map((p) => p.id));
const projectIds = new Set(PROJECTS.map((p) => p.id));
const nodeIds = new Set(NODES.map((n) => n.id));

// unique ids
for (const [name, arr] of [
  ["node", NODES.map((n) => n.id)],
  ["resource", RESOURCES.map((r) => r.id)],
  ["paper", PAPERS.map((p) => p.id)],
  ["project", PROJECTS.map((p) => p.id)],
  ["boss", BOSSES.map((b) => b.id)],
] as const) {
  const seen = new Set<string>();
  for (const id of arr) {
    if (seen.has(id)) errors.push(`duplicate ${name} id: ${id}`);
    seen.add(id);
  }
}

// node-level checks
for (const n of NODES) {
  if (n.level < 0 || n.level > 16) errors.push(`${n.id}: bad level ${n.level}`);
  for (const p of n.prereqs) {
    if (!nodeIds.has(p.id)) errors.push(`${n.id}: unknown prereq ${p.id}`);
  }
  for (const b of [n.primary, n.backup, ...(n.references ?? [])]) {
    if (b && !resourceIds.has(b.resourceId)) errors.push(`${n.id}: unknown resource ${b.resourceId}`);
  }
  for (const pid of n.paperIds ?? []) {
    if (!paperIds.has(pid)) errors.push(`${n.id}: unknown paper ${pid}`);
  }
  for (const pid of n.projectIds ?? []) {
    if (!projectIds.has(pid)) errors.push(`${n.id}: unknown project ${pid}`);
  }
  if (!n.masteryTest) errors.push(`${n.id}: missing mastery test`);
  if (!n.diagnostic) errors.push(`${n.id}: missing diagnostic`);
  if (n.hours <= 0 || n.hours > 60) errors.push(`${n.id}: implausible hours ${n.hours}`);
  if (!n.optional && !n.primary && n.track !== "project" && n.track !== "research" && !n.id.startsWith("boss-")) {
    warn.push(`${n.id}: core non-project node without a primary resource`);
  }
}

// cycle detection (DFS)
const state = new Map<string, 0 | 1 | 2>();
const visit = (id: string, stack: string[]): void => {
  const s = state.get(id) ?? 0;
  if (s === 1) {
    errors.push(`cycle: ${[...stack, id].join(" → ")}`);
    return;
  }
  if (s === 2) return;
  state.set(id, 1);
  for (const p of NODE_MAP.get(id)!.prereqs) {
    if (NODE_MAP.has(p.id)) visit(p.id, [...stack, id]);
  }
  state.set(id, 2);
};
for (const n of NODES) visit(n.id, []);

// papers reference valid nodes
for (const p of PAPERS) {
  for (const nid of p.prereqNodeIds) {
    if (!nodeIds.has(nid)) errors.push(`paper ${p.id}: unknown prereq node ${nid}`);
  }
}
// projects reference valid nodes
for (const p of PROJECTS) {
  for (const nid of p.prereqNodeIds) {
    if (!nodeIds.has(nid)) errors.push(`project ${p.id}: unknown prereq node ${nid}`);
  }
}
// bosses: exist as nodes, remediation targets exist
for (const b of BOSSES) {
  if (!nodeIds.has(b.id)) errors.push(`boss ${b.id} has no matching gate node`);
  for (const r of b.remediation) {
    for (const nid of r.nodeIds) {
      if (!nodeIds.has(nid)) errors.push(`boss ${b.id}: unknown remediation node ${nid}`);
    }
  }
}
// levels: boss links valid; every level has nodes
for (const l of LEVELS) {
  if (l.bossId && !nodeIds.has(l.bossId)) errors.push(`level ${l.id}: unknown boss ${l.bossId}`);
  if (!NODES.some((n) => n.level === l.id)) errors.push(`level ${l.id}: no nodes`);
}
// ranks reference valid bosses
for (const r of RANKS) {
  for (const b of r.bossIds ?? []) {
    if (!nodeIds.has(b)) errors.push(`rank ${r.index}: unknown boss ${b}`);
  }
}

// ── lessons ────────────────────────────────────────────────────────
import { LESSON_META } from "../src/content/lessons/manifest";
import { LESSON_REGISTRY } from "../src/content/lessons/registry";
import { WIDGET_IDS } from "../src/components/widgets/ids";
import type { Lesson, LessonBlock } from "../src/lib/lesson-types";

const widgetIdSet = new Set<string>(WIDGET_IDS);

async function validateLessons() {
  const seenMeta = new Set<string>();
  for (const meta of LESSON_META) {
    if (seenMeta.has(meta.nodeId)) errors.push(`lesson manifest: duplicate ${meta.nodeId}`);
    seenMeta.add(meta.nodeId);
    if (!nodeIds.has(meta.nodeId)) errors.push(`lesson ${meta.nodeId}: no such node`);
    const load = LESSON_REGISTRY[meta.nodeId];
    if (!load) {
      errors.push(`lesson ${meta.nodeId}: missing registry entry`);
      continue;
    }
    let lesson: Lesson;
    try {
      lesson = (await load()).lesson;
    } catch (e) {
      errors.push(`lesson ${meta.nodeId}: failed to load (${(e as Error).message})`);
      continue;
    }
    if (lesson.nodeId !== meta.nodeId) errors.push(`lesson ${meta.nodeId}: nodeId mismatch (${lesson.nodeId})`);
    if (lesson.sections.length !== meta.sections)
      errors.push(`lesson ${meta.nodeId}: manifest says ${meta.sections} sections, found ${lesson.sections.length}`);
    if (lesson.minutes <= 0) errors.push(`lesson ${meta.nodeId}: minutes must be positive`);

    const sectionIds = new Set<string>();
    const usedWidgets = new Set<string>();
    let masteryBlocks = 0;
    let interactions = 0;

    const checkBlock = (b: LessonBlock, where: string) => {
      switch (b.kind) {
        case "widget":
          usedWidgets.add(b.id);
          interactions++;
          if (!widgetIdSet.has(b.id)) errors.push(`${where}: unknown widget "${b.id}"`);
          break;
        case "quiz":
          interactions++;
          if (b.items.length === 0) errors.push(`${where}: empty quiz`);
          for (const [qi, item] of b.items.entries()) {
            if (item.options) {
              if (item.answerIndex == null || item.answerIndex < 0 || item.answerIndex >= item.options.length)
                errors.push(`${where} q${qi}: bad answerIndex`);
            }
            if (!item.a) errors.push(`${where} q${qi}: missing canonical answer`);
          }
          break;
        case "code":
          if (b.mode !== "read") interactions++;
          if (b.options && (b.answerIndex == null || b.answerIndex < 0 || b.answerIndex >= b.options.length))
            errors.push(`${where}: code options need a valid answerIndex`);
          if (b.masked) {
            const lines = b.source.split("\n").length;
            for (const ln of b.masked) if (ln < 1 || ln > lines) errors.push(`${where}: masked line ${ln} out of range`);
          }
          if (b.mode === "missing" && !b.masked?.length) errors.push(`${where}: missing-mode code needs masked lines`);
          if (b.mode === "trace" && !b.trace?.length) errors.push(`${where}: trace-mode code needs a trace table`);
          if (b.mode === "write" && !b.checks?.length) errors.push(`${where}: write-mode code needs acceptance checks`);
          break;
        case "exercise":
          interactions++;
          break;
        case "derivation":
          interactions++;
          if (b.steps.length < 2) errors.push(`${where}: derivation needs ≥2 steps`);
          break;
        case "connection":
          for (const id of b.nodeIds ?? []) if (!nodeIds.has(id)) errors.push(`${where}: unknown node ${id}`);
          for (const id of b.paperIds ?? []) if (!paperIds.has(id)) errors.push(`${where}: unknown paper ${id}`);
          for (const id of b.projectIds ?? []) if (!projectIds.has(id)) errors.push(`${where}: unknown project ${id}`);
          break;
        case "mastery":
          masteryBlocks++;
          break;
      }
    };

    for (const s of lesson.sections) {
      if (sectionIds.has(s.id)) errors.push(`lesson ${meta.nodeId}: duplicate section id ${s.id}`);
      sectionIds.add(s.id);
      if (s.blocks.length === 0) errors.push(`lesson ${meta.nodeId}/${s.id}: empty section`);
      for (const [bi, b] of s.blocks.entries()) checkBlock(b, `lesson ${meta.nodeId}/${s.id}[${bi}]`);
    }

    if (masteryBlocks !== 1) errors.push(`lesson ${meta.nodeId}: needs exactly one mastery block (found ${masteryBlocks})`);
    if (interactions < 4) errors.push(`lesson ${meta.nodeId}: rubric violation — fewer than 4 active interactions`);
    const metaWidgets = new Set(meta.widgets);
    if (metaWidgets.size !== usedWidgets.size || [...usedWidgets].some((w) => !metaWidgets.has(w)))
      errors.push(`lesson ${meta.nodeId}: manifest widgets [${meta.widgets}] ≠ used [${[...usedWidgets]}]`);
  }
  // registry entries without manifest rows
  for (const id of Object.keys(LESSON_REGISTRY)) {
    if (!LESSON_META.some((m) => m.nodeId === id)) errors.push(`lesson registry: ${id} missing from manifest`);
  }
}

// ── learning packets (HANDOVERFINAL §8; rubric per recalibration Δ9) ──
import { PACKET_META } from "../src/content/packets/manifest";
import { PACKET_REGISTRY } from "../src/content/packets/registry";
import { existsSync } from "node:fs";
import { join } from "node:path";

async function validatePackets() {
  const seen = new Set<string>();
  for (const meta of PACKET_META) {
    if (seen.has(meta.nodeId)) errors.push(`packet manifest: duplicate ${meta.nodeId}`);
    seen.add(meta.nodeId);
    if (!nodeIds.has(meta.nodeId)) errors.push(`packet ${meta.nodeId}: no such node`);
    const load = PACKET_REGISTRY[meta.nodeId];
    if (!load) {
      errors.push(`packet ${meta.nodeId}: missing registry entry`);
      continue;
    }
    let p;
    try {
      p = (await load()).packet;
    } catch (e) {
      errors.push(`packet ${meta.nodeId}: failed to load (${(e as Error).message})`);
      continue;
    }
    const where = `packet ${meta.nodeId}`;
    if (p.nodeId !== meta.nodeId) errors.push(`${where}: nodeId mismatch (${p.nodeId})`);
    if (p.minutes !== meta.minutes) errors.push(`${where}: manifest minutes ${meta.minutes} ≠ packet ${p.minutes}`);
    if (!p.whyNow || p.whyNow.length < 40) errors.push(`${where}: whyNow missing/too thin`);
    // Δ9: every packet must demand production, not just consumption
    if (!p.practice || p.practice.length < 1) errors.push(`${where}: rubric — needs ≥1 practice item`);
    if (!p.implement && !p.derive) errors.push(`${where}: rubric — needs implement or derive`);
    if (!p.prove || p.prove.criteria.length < 1) errors.push(`${where}: rubric — prove-it with ≥1 criterion required`);
    const node = NODE_MAP.get(meta.nodeId);
    if (node && node.hours >= 8 && (!p.deepen || p.deepen.length === 0))
      errors.push(`${where}: depth-flagged (${node.hours}h) — DEEPEN entry required (Δ9)`);
    if (p.recall && (p.recall.length < 2 || p.recall.length > 6))
      errors.push(`${where}: recall should be 2–6 items (found ${p.recall.length})`);
    for (const [i, r] of (p.recall ?? []).entries()) if (!r.a) errors.push(`${where} recall[${i}]: missing answer`);
    for (const w of p.interactiveIds ?? []) if (!widgetIdSet.has(w)) errors.push(`${where}: unknown widget "${w}"`);
    if (p.lessonId && !LESSON_META.some((l) => l.nodeId === p.lessonId)) errors.push(`${where}: unknown lesson ${p.lessonId}`);
    for (const m of [...(p.coreWatch ?? []), ...(p.orient ? [p.orient] : [])]) {
      if (m.minutes <= 0 || m.minutes > 180) errors.push(`${where}: media "${m.title}" implausible minutes ${m.minutes}`);
      if (!/^https?:\/\//.test(m.url)) errors.push(`${where}: media "${m.title}" bad url`);
    }
    for (const r of [...(p.coreRead ?? []), ...(p.deepen ?? [])]) {
      if (r.resourceId && !resourceIds.has(r.resourceId)) errors.push(`${where}: unknown resource ${r.resourceId}`);
    }
    if (!existsSync(join(process.cwd(), p.researchRecord)))
      errors.push(`${where}: research record ${p.researchRecord} not found`);
  }
  for (const id of Object.keys(PACKET_REGISTRY)) {
    if (!PACKET_META.some((m) => m.nodeId === id)) errors.push(`packet registry: ${id} missing from manifest`);
  }
}

// report
const levelHours = new Map<number, number>();
for (const n of NODES) {
  if (!n.optional) levelHours.set(n.level, (levelHours.get(n.level) ?? 0) + n.hours);
}
const totalCore = [...levelHours.values()].reduce((a, b) => a + b, 0);

(async () => {
  await validateLessons();
  await validatePackets();
  console.log(`content: ${NODES.length} nodes · ${RESOURCES.length} resources · ${PAPERS.length} papers · ${PROJECTS.length} projects · ${BOSSES.length} bosses · ${LESSON_META.length} lessons · ${PACKET_META.length} packets`);
  console.log(`core hours by level: ${[...levelHours.entries()].sort((a, b) => a[0] - b[0]).map(([l, h]) => `L${l}:${h}`).join(" ")}`);
  console.log(`total core hours: ${totalCore}`);
  for (const w of warn) console.warn(`⚠ ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`✗ ${e}`);
    process.exit(1);
  }
  console.log("✓ content integrity OK");
})();
