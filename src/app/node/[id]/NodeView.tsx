"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { NODE_MAP } from "@/content/nodes";
import { resourceById } from "@/content/resources";
import { paperById } from "@/content/papers";
import { projectById } from "@/content/projects";
import { bossById } from "@/content/bosses";
import { levelById } from "@/content/levels";
import { hasLesson, lessonMeta } from "@/content/lessons/manifest";
import { useStore } from "@/lib/store";
import { nodeState, missingPrereqs, unlocks, DEFAULT_EDGE_TIER } from "@/lib/engine/graph";
import { Katex, NodePill, Panel, SectionTitle, StateBadge, TierBadge, TIER_COLORS } from "@/components/ui";
import { assessWithMoment } from "@/components/MasteryMoment";
import { AssessmentBox } from "@/components/AssessmentBox";
import { independenceFromChoice } from "@/lib/engine/competency";
import { tierAtLeast, type ResourceBinding } from "@/lib/types";

export function NodeView({ id }: { id: string }) {
  const node = NODE_MAP.get(id);
  const store = useStore();
  if (!node) notFound();
  const level = levelById(node.level);
  const progress = store.nodes;
  const state = nodeState(id, progress);
  const p = progress[id];
  const missing = missingPrereqs(node, progress);
  const boss = bossById(id);
  const dependents = unlocks(id);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mono-label">
            <Link href={`/levels/${node.level}`} className="hover:text-acc" style={{ color: level.accent }}>
              L{node.level} · {level.title}
            </Link>
            <span className="ml-2">{node.track}</span>
            {node.optional && <span className="ml-2 text-acc-math">stretch</span>}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{node.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StateBadge state={state} />
            {p && p.tier !== "none" && <TierBadge tier={p.tier} />}
            {p?.verified && <span className="rounded bg-acc-robot/15 px-1.5 py-0.5 font-mono text-[10px] text-acc-robot">✓ verified</span>}
            {p?.provisional && (
              <span className="rounded bg-acc-math/15 px-1.5 py-0.5 font-mono text-[10px] text-acc-math">
                {p.legacy ? "legacy claim — unverified" : "claimed — not yet verified"}
              </span>
            )}
            <span className="font-mono text-xs text-faint">{node.hours}h est</span>
            <span className="font-mono text-xs text-faint">gate: {node.masteryGate}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasLesson(id) && (
            <Link href={`/learn/${id}`} className="btn btn-acc" onClick={() => store.startNode(id)}>
              ⚡ {store.lessons[id]?.completedAt ? "Reopen lesson" : store.lessons[id] ? "Continue lesson" : "Open lesson"}
              <span className="font-mono text-[10px] opacity-70">{lessonMeta(id)?.minutes}m</span>
            </Link>
          )}
          {state !== "locked" && p?.status !== "mastered" && (
            <button className={`btn ${hasLesson(id) ? "" : "btn-acc"}`} onClick={() => store.startNode(id)}>
              {p?.status === "learning" ? "In progress" : "▶ Start"}
            </button>
          )}
        </div>
      </div>

      {/* why */}
      <Panel accent={level.accent}>
        <SectionTitle>why this exists</SectionTitle>
        <p className="text-[14px] leading-relaxed text-ink">{node.why}</p>
        {node.intuition && <p className="mt-2 text-sm text-dim">{node.intuition}</p>}
      </Panel>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* objectives */}
          <Panel>
            <SectionTitle>learning objectives</SectionTitle>
            <ul className="space-y-1.5">
              {node.objectives.map((o, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink">
                  <span className="text-acc">▸</span>
                  {o}
                </li>
              ))}
            </ul>
            {node.skip && node.skip.length > 0 && (
              <div className="mt-3 border-t border-line pt-2">
                <div className="mono-label mb-1">explicitly skip</div>
                {node.skip.map((s, i) => (
                  <div key={i} className="text-xs text-faint">⊘ {s}</div>
                ))}
              </div>
            )}
          </Panel>

          {/* equations */}
          {node.equations && node.equations.length > 0 && (
            <Panel>
              <SectionTitle>equations to own</SectionTitle>
              <div className="space-y-2 rounded-md bg-panel2 p-3">
                {node.equations.map((eq, i) => (
                  <Katex key={i} tex={eq} block />
                ))}
              </div>
            </Panel>
          )}

          {/* resources */}
          <Panel>
            <SectionTitle>resources — exactly what to consume</SectionTitle>
            <div className="space-y-3">
              {node.primary && <ResourceRow binding={node.primary} role="primary" />}
              {node.backup && <ResourceRow binding={node.backup} role="backup" />}
              {node.references?.map((r, i) => <ResourceRow key={i} binding={r} role="reference" />)}
              {!node.primary && !node.backup && (
                <div className="text-sm text-faint">Self-contained — the work below IS the material.</div>
              )}
            </div>
          </Panel>

          {/* work */}
          {(node.derivation || node.implementation || node.exercises.length > 0) && (
            <Panel>
              <SectionTitle>the work</SectionTitle>
              {node.derivation && (
                <div className="mb-3">
                  <div className="mono-label mb-1 text-acc-math">derive</div>
                  <p className="text-sm text-ink">{node.derivation}</p>
                </div>
              )}
              {node.implementation && (
                <div className="mb-3">
                  <div className="mono-label mb-1 text-acc">implement</div>
                  <p className="text-sm text-ink">{node.implementation}</p>
                </div>
              )}
              {node.exercises.length > 0 && (
                <div>
                  <div className="mono-label mb-1 text-acc-robot">exercises</div>
                  <ol className="list-decimal space-y-1.5 pl-5">
                    {node.exercises.map((e, i) => (
                      <li key={i} className="text-sm text-ink">{e}</li>
                    ))}
                  </ol>
                </div>
              )}
            </Panel>
          )}

          {/* misconceptions */}
          {node.misconceptions && node.misconceptions.length > 0 && (
            <Panel>
              <SectionTitle>common misconceptions</SectionTitle>
              {node.misconceptions.map((m, i) => (
                <div key={i} className="text-sm text-dim">✗ {m}</div>
              ))}
            </Panel>
          )}

          {/* boss extras */}
          {boss && (
            <Panel accent="#f4586e">
              <SectionTitle>boss scenario</SectionTitle>
              <p className="text-sm text-ink">{boss.scenario}</p>
              <div className="mono-label mt-3 mb-1">pass criteria</div>
              <ul className="space-y-1">
                {boss.passCriteria.map((c, i) => (
                  <li key={i} className="text-sm text-dim">□ {c}</li>
                ))}
              </ul>
              <div className="mono-label mt-3 mb-1">on failure → remediation quests</div>
              <div className="space-y-1.5">
                {boss.remediation.map((r, i) => (
                  <div key={i} className="text-xs">
                    <span className="text-acc-math">{r.weakness}:</span>{" "}
                    {r.nodeIds.map((nid) => (
                      <Link key={nid} href={`/node/${nid}`} className="mr-2 text-acc hover:underline">
                        {NODE_MAP.get(nid)?.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              <BossAttemptBox bossId={id} />
            </Panel>
          )}

          {/* mastery */}
          <MasteryPanel id={id} locked={state === "locked"} />
        </div>

        {/* sidebar */}
        <div className="space-y-5">
          <Panel>
            <SectionTitle>prerequisites</SectionTitle>
            {node.prereqs.length === 0 ? (
              <div className="text-sm text-faint">None — a root node.</div>
            ) : (
              <div className="space-y-1.5">
                {node.prereqs.map((pr) => {
                  const pn = NODE_MAP.get(pr.id)!;
                  const ok = !missing.some((m) => m.id === pr.id);
                  return (
                    <div key={pr.id} className="flex items-center gap-2">
                      <span className={ok ? "text-acc-robot" : "text-faint"}>{ok ? "✓" : "○"}</span>
                      <Link href={`/node/${pr.id}`} className="min-w-0 flex-1 truncate text-sm text-ink hover:text-acc">
                        {pn.title}
                      </Link>
                      <span className="font-mono text-[10px]" style={{ color: TIER_COLORS[pr.tier ?? DEFAULT_EDGE_TIER] }}>
                        ≥{pr.tier ?? DEFAULT_EDGE_TIER}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel>
            <SectionTitle>unlocks</SectionTitle>
            {dependents.length === 0 ? (
              <div className="text-sm text-faint">Terminal node.</div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {dependents.map((d) => (
                  <NodePill key={d.id} id={d.id} title={d.title} state={nodeState(d.id, progress)} />
                ))}
              </div>
            )}
          </Panel>

          {(node.projectIds?.length || node.paperIds?.length) && (
            <Panel>
              <SectionTitle>connections</SectionTitle>
              {node.projectIds?.map((pid) => {
                const proj = projectById(pid);
                return proj ? (
                  <Link key={pid} href="/projects" className="block text-sm text-acc-robot hover:underline">
                    ⚒ P{proj.num} · {proj.title}
                  </Link>
                ) : null;
              })}
              {node.paperIds?.map((pid) => {
                const paper = paperById(pid);
                return paper ? (
                  <Link key={pid} href={`/papers?focus=${pid}`} className="block text-sm text-acc-ml hover:underline">
                    ¶ {paper.title}
                  </Link>
                ) : null;
              })}
            </Panel>
          )}

          {node.computeNote && (
            <Panel>
              <SectionTitle>compute</SectionTitle>
              <p className="text-xs text-dim">{node.computeNote}</p>
            </Panel>
          )}

          <Panel>
            <details>
              <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-widest text-dim hover:text-acc">
                already know this? test out
              </summary>
              <p className="mt-2 text-sm text-dim">{node.diagnostic}</p>
              <p className="mt-1 text-[11px] text-faint">
                Prove it cold below — passing skips this node now (never wait on the calendar). A quick
                review lands in ~2 days to make sure it was real.
              </p>
              <AssessmentBox id={id} diagnostic />
            </details>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function ResourceRow({ binding, role }: { binding: ResourceBinding; role: string }) {
  const r = resourceById(binding.resourceId);
  if (!r) return null;
  const roleColor = role === "primary" ? "#4dd6e8" : role === "backup" ? "#e8b34d" : "#8b97a7";
  return (
    <div className="rounded-md border border-line bg-panel2 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: roleColor, background: `${roleColor}14` }}>
          {role}
        </span>
        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-ink hover:text-acc">
          {r.title} ↗
        </a>
        <span className="text-xs text-faint">{r.authors}{r.hours ? ` · ~${r.hours}h` : ""}{r.cost !== "free" ? ` · ${r.cost}` : ""}</span>
      </div>
      <div className="mt-1.5 text-[13px] text-dim">
        <span className="font-mono text-[10px] uppercase tracking-wider text-acc-robot">study → </span>
        {binding.sections}
      </div>
      {r.skipParts && <div className="mt-1 text-xs text-faint">⊘ skip: {r.skipParts}</div>}
      {binding.note && <div className="mt-1 text-xs text-faint">{binding.note}</div>}
    </div>
  );
}

function MasteryPanel({ id, locked }: { id: string; locked: boolean }) {
  const store = useStore();
  const node = NODE_MAP.get(id)!;
  const p = store.nodes[id];
  const unverifiedPrereqs = node.prereqs
    .map((pr) => ({ pr, prog: store.nodes[pr.id] }))
    .filter((x) => x.prog && tierAtLeast(x.prog.tier, x.pr.tier ?? DEFAULT_EDGE_TIER) && !x.prog.verified)
    .map((x) => NODE_MAP.get(x.pr.id)?.title ?? x.pr.id);

  return (
    <Panel accent="#52d68a">
      <SectionTitle>mastery gate — prove it, then it verifies</SectionTitle>
      <p className="mb-1 text-sm text-dim">
        <span className="font-mono text-[10px] uppercase tracking-wider text-acc-robot">the bar → </span>
        {node.masteryTest}
      </p>
      {p?.verified && (
        <div className="mb-2 text-xs text-acc-robot">✓ Independently verified — an assessment plus a later review both held.</div>
      )}
      {p?.provisional && (
        <div className="mb-2 text-xs text-acc-math">
          {p.legacy
            ? "This tier rests on a legacy claim from before the evidence system. Re-prove it below to verify."
            : "Claimed — not yet verified. A review lands in ~2 days; passing it verifies this node."}
        </div>
      )}
      {unverifiedPrereqs.length > 0 && (
        <div className="mb-2 text-[11px] text-faint">
          built on unverified: {unverifiedPrereqs.slice(0, 3).join(" · ")}
          {unverifiedPrereqs.length > 3 ? ` +${unverifiedPrereqs.length - 3}` : ""}
        </div>
      )}
      {locked ? (
        <div className="text-xs text-faint">Locked — pass the prerequisite gates first (or prove them via their test-outs).</div>
      ) : (
        <AssessmentBox id={id} />
      )}
    </Panel>
  );
}

function BossAttemptBox({ bossId }: { bossId: string }) {
  const store = useStore();
  const boss = bossById(bossId);
  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [choice, setChoice] = useState<"myself" | "hints" | "ai" | null>(null);
  const attempts = store.bossAttempts.filter((a) => a.bossId === bossId);
  const criteria = boss?.passCriteria ?? [];
  const allChecked = criteria.length > 0 && checked.size === criteria.length;
  const canPass = allChecked && notes.trim().length >= 30 && !!choice;

  const toggle = (i: number) =>
    setChecked((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i); else n.add(i);
      return n;
    });

  return (
    <div className="mt-4 border-t border-line pt-3">
      <div className="mono-label mb-1.5">attempts</div>
      {attempts.map((a) => (
        <div key={a.id} className="mb-1 text-xs">
          <span className={a.passed ? "text-acc-robot" : "text-acc-frontier"}>{a.passed ? "✓ PASSED" : "✗ failed"}</span>
          <span className="ml-2 font-mono text-faint">{a.date}</span>
          {a.notes && <span className="ml-2 text-dim">{a.notes}</span>}
        </div>
      ))}
      <div className="mono-label mb-1 mt-3">pass criteria — check each only when it is actually true</div>
      <div className="space-y-1">
        {criteria.map((c, i) => (
          <label key={i} className="flex cursor-pointer items-start gap-2 text-[13px] text-dim">
            <input type="checkbox" checked={checked.has(i)} onChange={() => toggle(i)} className="mt-0.5 !w-auto" />
            <span>{c}</span>
          </label>
        ))}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="mt-2 w-full text-[13px]"
        placeholder="What you built / where the run lives / weaknesses found (min 30 chars)…"
      />
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {([["myself", "did it myself"], ["hints", "with hints"], ["ai", "AI-heavy"]] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setChoice(k)}
            className="rounded-md border px-2 py-1 text-[11px]"
            style={{
              borderColor: choice === k ? "#4dd6e888" : "var(--color-line2)",
              color: choice === k ? "#4dd6e8" : "var(--color-dim)",
            }}
          >
            {label}
          </button>
        ))}
        <span className="mx-1 border-l border-line" />
        <button
          className="btn !py-1.5 text-xs"
          onClick={() => {
            store.recordBossAttempt({ bossId, date: new Date().toISOString().slice(0, 10), passed: false, notes });
            store.recordEvidence({ nodeId: bossId, kind: "assessment", outcome: "fail", attempt: notes, note: "boss attempt" });
            setNotes(""); setChecked(new Set()); setChoice(null);
          }}
        >
          Log fail
        </button>
        <button
          className="btn btn-acc !py-1.5 text-xs disabled:opacity-35"
          disabled={!canPass}
          title={!canPass ? "All criteria checked + notes + honesty declaration required" : undefined}
          onClick={() => {
            if (!choice) return;
            store.recordBossAttempt({ bossId, date: new Date().toISOString().slice(0, 10), passed: true, notes });
            assessWithMoment(bossId, {
              attempt: `criteria: ${criteria.map((_, i) => (checked.has(i) ? "✓" : "✗")).join("")} · ${notes}`,
              passed: true,
              independence: independenceFromChoice(choice),
              note: "boss",
            });
            setNotes(""); setChecked(new Set()); setChoice(null);
          }}
        >
          ✓ Passed
        </button>
      </div>
    </div>
  );
}
