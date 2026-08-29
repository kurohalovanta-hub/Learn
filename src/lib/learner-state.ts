import { NODES, NODE_MAP } from "@/content/nodes";
import { PAPERS } from "@/content/papers";
import { PROJECTS } from "@/content/projects";
import { currentRank, readinessScore } from "@/lib/engine/mastery";
import { dashboardStats } from "@/lib/engine/metrics";
import type { ProgressData } from "@/lib/types";

// Provider-neutral learner-state artifacts (HANDOVERFINAL §37): a brand-new
// tutor session must be able to resume from these. Generated on demand from
// Settings as DOWNLOADS — never auto-committed to the public repo (§64–65).

export function buildLearnerStateJson(data: ProgressData) {
  const nodes = Object.entries(data.nodes)
    .filter(([, p]) => p.tier !== "none" || p.status !== "not_started")
    .map(([id, p]) => ({
      id,
      title: NODE_MAP.get(id)?.title,
      tier: p.tier,
      status: p.status,
      verified: !!p.verified,
      provisional: !!p.provisional,
      legacy: !!p.legacy,
      semantic: p.semantic,
    }));
  return {
    generatedAt: new Date().toISOString(),
    schema: data.schema,
    goal: "independent embodied-intelligence / robot-learning research capability (~210 days)",
    stats: dashboardStats(data),
    rank: currentRank(data.nodes).title,
    readiness: readinessScore(data.nodes),
    nodes,
    papers: Object.entries(data.papers).map(([id, p]) => ({ id, status: p.status, defense: p.defense ?? null })),
    projects: Object.entries(data.projects).map(([id, p]) => ({ id, status: p.status })),
    recentEvidence: data.events.slice(-60).map((e) => ({
      nodeId: e.nodeId, kind: e.kind, outcome: e.outcome, independence: e.independence ?? null, at: new Date(e.at).toISOString().slice(0, 10),
    })),
  };
}

export function buildLearnerStateMarkdown(data: ProgressData): string {
  const s = dashboardStats(data);
  const rank = currentRank(data.nodes);
  const verified = Object.entries(data.nodes).filter(([, p]) => p.verified);
  const provisional = Object.entries(data.nodes).filter(([, p]) => p.provisional);
  const learning = Object.entries(data.nodes).filter(([, p]) => p.status === "learning");
  const weak = Object.entries(data.nodes).filter(([, p]) => p.semantic === "weak" || p.semantic === "retention-risk");
  const papersActive = Object.entries(data.papers).filter(([, p]) => !["queue", "triaged"].includes(p.status));
  const line = ([id]: [string, unknown]) => `- ${NODE_MAP.get(id)?.title ?? id} (${id})`;

  return `# CURRENT STATE — HALO learner
Generated ${new Date().toISOString().slice(0, 10)} · rank: ${rank.title} · readiness ${readinessScore(data.nodes)}/100 (verified-weighted)

GOAL: independent embodied-intelligence / robot-learning research capability in ~210 days.

## What I can actually do (independently verified: assessment + later retention held)
${verified.map(line).join("\n") || "- nothing verified yet"}

## Claimed but not yet verified (treat as unconfirmed)
${provisional.map(line).join("\n") || "- none"}

## In progress
${learning.filter(([, p]) => !p.provisional).map(line).join("\n") || "- none"}

## Known weak / needs review
${weak.map(line).join("\n") || "- none flagged"}

## Papers in flight
${papersActive.map(([id, p]) => `- ${PAPERS.find((x) => x.id === id)?.title ?? id}: ${p.status}${p.defense ? ` (defense ${p.defense.verdict} ${p.defense.score}/${p.defense.total})` : ""}`).join("\n") || "- none"}

## Projects
${Object.entries(data.projects).map(([id, p]) => `- ${PROJECTS.find((x) => x.id === id)?.title ?? id}: ${p.status}`).join("\n") || "- none started"}

## Working profile
- ${s.focusedHoursTotal}h focused total · ${s.focusedHours7d}h last 7 days · independence ${s.independence ?? "—"}%
- Honesty contract: all mastery is self-assessed against stated bars, then verified by delayed retention; tutors must not solve mastery tasks (see tutor/CLAUDE_TUTOR_HANDOFF.md).

## For a fresh tutor
Curriculum truth lives in the repo (src/content/, docs/curation/). Ask me to copy a
session packet from the node I'm working on — it carries the mode contract and my live
evidence for that node.
`;
}

export function buildHandoffMarkdown(data: ProgressData): string {
  const learning = Object.entries(data.nodes).filter(([, p]) => p.status === "learning" && !p.provisional);
  const next = NODES.find((n) => learning.some(([id]) => id === n.id));
  return `# HANDOFF — resume protocol
1. Read CURRENT_STATE.md (same export batch) for verified vs claimed capability.
2. Current focus: ${next ? `${next.title} (${next.id})` : "let the app's Today page pick the bottleneck"}.
3. Open the app → Today → the bottleneck card is the single source of "what now".
4. For tutoring: use the app's per-node packet buttons; contract in tutor/*.md.
5. Restore data if needed: Settings → Import (JSON export from the same batch).
`;
}
