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

// report
const levelHours = new Map<number, number>();
for (const n of NODES) {
  if (!n.optional) levelHours.set(n.level, (levelHours.get(n.level) ?? 0) + n.hours);
}
const totalCore = [...levelHours.values()].reduce((a, b) => a + b, 0);

console.log(`content: ${NODES.length} nodes · ${RESOURCES.length} resources · ${PAPERS.length} papers · ${PROJECTS.length} projects · ${BOSSES.length} bosses`);
console.log(`core hours by level: ${[...levelHours.entries()].sort((a, b) => a[0] - b[0]).map(([l, h]) => `L${l}:${h}`).join(" ")}`);
console.log(`total core hours: ${totalCore}`);
for (const w of warn) console.warn(`⚠ ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log("✓ content integrity OK");
