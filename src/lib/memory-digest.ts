// Progress-memory digest (ADR-005 companion): a compact, human- and
// tutor-readable markdown snapshot of the learner's trajectory, committed to a
// PRIVATE repo via /api/memory. Contains derived state only — never passwords,
// tokens, or emails.

import { NODE_MAP, NODES } from "@/content/nodes";
import type { ProgressData } from "@/lib/types";

/** Everything the learner has entered anywhere — compact, for AI context. */
export function buildLifeContext(
  data: Partial<Pick<ProgressData, "weeklies" | "ideas" | "experiments" | "papers">>,
): string {
  const parts: string[] = [];

  const weeklies = Object.values(data.weeklies ?? {}).sort((a, b) => b.week.localeCompare(a.week)).slice(0, 2);
  if (weeklies.length) {
    parts.push("WEEKLY REVIEWS (learner's own words, newest first):\n" + weeklies.map((w) =>
      `[${w.week}] ` + Object.entries(w.answers ?? {})
        .filter(([, v]) => v?.trim())
        .map(([k, v]) => `${k}: ${v.replace(/\s+/g, " ").slice(0, 220)}`)
        .join(" · ")).join("\n"));
  }

  const ideas = (data.ideas ?? []).filter((i) => i.status !== "dropped").slice(-8);
  if (ideas.length) {
    parts.push("IDEA INBOX (open): " + ideas.map((i) => `${i.title}${i.note ? ` — ${i.note.slice(0, 100)}` : ""} [${i.status}]`).join("; "));
  }

  const exps = (data.experiments ?? []).slice(-5);
  if (exps.length) {
    parts.push("EXPERIMENTS:\n" + exps.map((e) =>
      `- ${e.title}: hypothesis ${e.hypothesis?.slice(0, 140) || "—"}${e.baseline ? ` · baseline ${e.baseline.slice(0, 80)}` : ""}`).join("\n"));
  }

  const papers = Object.entries(data.papers ?? {}).filter(([, p]) => p.status !== "queue").slice(-8);
  if (papers.length) {
    parts.push("PAPERS: " + papers.map(([id, p]) => `${id} (${p.status})${p.notes ? ` — ${p.notes.replace(/\s+/g, " ").slice(0, 100)}` : ""}`).join("; "));
  }

  return parts.join("\n\n");
}

export function buildProgressDigest(
  data: Pick<ProgressData, "nodes" | "events" | "logs"> &
    Partial<Pick<ProgressData, "tutorChats" | "weeklies" | "ideas" | "experiments" | "papers">>,
): string {
  const now = new Date().toISOString();
  const entries = Object.entries(data.nodes);
  const verified = entries.filter(([, p]) => p.verified);
  const claimed = entries.filter(([, p]) => p.provisional && !p.verified);
  const learning = entries.filter(([, p]) => p.status === "learning" && !p.provisional && !p.verified);

  const byLevel = new Map<number, { verified: number; total: number }>();
  for (const n of NODES) {
    const row = byLevel.get(n.level) ?? { verified: 0, total: 0 };
    row.total += 1;
    if (data.nodes[n.id]?.verified) row.verified += 1;
    byLevel.set(n.level, row);
  }
  const levelTable = [...byLevel.entries()]
    .sort((a, b) => a[0] - b[0])
    .filter(([, r]) => r.verified > 0)
    .map(([lvl, r]) => `| L${lvl} | ${r.verified}/${r.total} |`)
    .join("\n");

  const title = (id: string) => NODE_MAP.get(id)?.title ?? id;
  const list = (rows: [string, ProgressData["nodes"][string]][]) =>
    rows.map(([id, p]) => `- ${title(id)} (${id}) — tier ${p.tier}${p.semantic ? `, ${p.semantic}` : ""}`).join("\n") || "- none yet";

  const recent = [...data.events].slice(-25).map((e) =>
    `- ${new Date(e.at).toISOString().slice(0, 10)} · ${title(e.nodeId)} · ${e.kind}:${e.outcome}${e.independence ? ` (${e.independence})` : ""}${e.note ? ` — ${e.note.slice(0, 90)}` : ""}`,
  ).join("\n") || "- none yet";

  const weaknesses = [...data.events]
    .filter((e) => e.outcome === "fail")
    .slice(-8)
    .map((e) => `- ${title(e.nodeId)}: ${e.note?.slice(0, 110) ?? e.kind}`)
    .join("\n") || "- none recorded";

  const minutes = data.logs.reduce((s, l) => s + l.minutes, 0);

  // recent tutor conversations — so ANY assistant picking this file up knows
  // what has already been explained, asked, and misunderstood
  const chats = Object.values(data.tutorChats ?? {})
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6)
    .map((c) => {
      const turns = c.messages.slice(-10)
        .map((m) => `> **${m.role === "user" ? "learner" : "tutor"}:** ${m.content.replace(/\s+/g, " ").slice(0, 300)}`)
        .join("\n");
      return `### ${title(c.nodeId)} (${new Date(c.updatedAt).toISOString().slice(0, 10)})\n${turns}`;
    })
    .join("\n\n");

  return `# HALO — progress memory
_Synced ${now} · derived from the evidence log · private_

## FOR ANY AI ASSISTANT — read this first
You are picking up an ongoing tutoring relationship. The learner is climbing
HALO (PROJECT : VANTA HALO): a mastery-gated path from zero to independent
embodied-intelligence / robot-learning research capability (149 skill nodes,
evidence-derived progress — nothing below is self-reported).
House rules: never solve their mastery assessments for them; default to
questions and minimal hints; flag any full solution you show; be brief —
answer first, one concept per turn; adapt to the verified state below, not to
what they claim. The "Tutor conversations" section shows what has already been
taught and where they struggled — do not re-teach what is verified, do re-probe
active weaknesses.

## Capability
- **Verified nodes: ${verified.length} / ${NODES.length}** · claimed-unverified: ${claimed.length} · in progress: ${learning.length}
- Evidence events: ${data.events.length} · logged study time: ${Math.round(minutes / 60)}h ${minutes % 60}m

${levelTable ? `| Level | Verified |\n|---|---|\n${levelTable}\n` : ""}
## Verified (retention-checked)
${list(verified)}

## Claimed — awaiting retention check
${list(claimed)}

## In progress
${list(learning)}

## Recent evidence (last ${Math.min(25, data.events.length)})
${recent}

## Active weaknesses (recent fails / tutor-flagged)
${weaknesses}

## Tutor conversations (most recent, trimmed)
${chats || "_none yet_"}

## Everything else the learner wrote (reviews, ideas, experiments, papers)
${buildLifeContext(data) || "_nothing yet_"}
`;
}
