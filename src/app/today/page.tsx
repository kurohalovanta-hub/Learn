"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { todaysMission } from "@/lib/engine/scheduler";
import { reviewQueue } from "@/lib/engine/review";
import { dayOfProgram, currentPhase } from "@/lib/engine/pacing";
import { NODE_MAP } from "@/content/nodes";
import { TUTOR_PROMPTS } from "@/content/templates";
import { hasLesson, lessonMeta } from "@/content/lessons/manifest";
import { Panel, SectionTitle } from "@/components/ui";
import type { Block, Independence, SkillNode } from "@/lib/types";

const BLOCK_COLORS: Record<string, string> = {
  math: "#e8b34d", implementation: "#4dd6e8", specialization: "#a78bfa",
  project: "#52d68a", review: "#f2934d", papers: "#a78bfa", research: "#e86ea4",
};

interface StepDef {
  id: string;
  code: string;
  title: string;
  color: string;
  minutes: number | null;
  summary: string;
  body: ReactNode;
}

export default function TodayPage() {
  const store = useStore();
  const data = store.exportData();
  const mission = todaysMission(data);
  const day = dayOfProgram(data.settings);
  const phase = day ? currentPhase(day) : null;
  const reviews = reviewQueue(data.nodes);
  const today = new Date().toISOString().slice(0, 10);
  const plan = store.dayPlans[today]?.steps ?? {};
  const todayLogs = data.logs.filter((l) => l.date === today);
  const loggedMin = todayLogs.reduce((s, l) => s + l.minutes, 0);

  const slotFor = (block: string) => mission.slots.find((s) => s.block === block);
  const mathSlot = slotFor("math");
  const implSlot = slotFor("implementation");
  const specSlot = slotFor("specialization");
  const projSlot = slotFor("project");
  const focus = mission.masteryCheck;

  const nodeLine = (node: SkillNode | undefined, logBlock: Block, minutes: number) =>
    node ? (
      <div>
        <Link href={`/node/${node.id}`} className="text-[15px] font-medium text-ink hover:text-acc">
          {node.title}
        </Link>
        <div className="mt-0.5 text-xs text-dim">{node.why}</div>
        {hasLesson(node.id) && (
          <Link href={`/learn/${node.id}`} className="btn btn-acc mt-2 !py-1.5 text-xs">
            ⚡ Open lesson · {lessonMeta(node.id)?.minutes} min
          </Link>
        )}
        {!hasLesson(node.id) && node.primary && (
          <div className="mt-1.5 text-xs text-faint">▸ {node.primary.sections}</div>
        )}
        <div className="mt-2"><QuickLog block={logBlock} nodeId={node.id} defaultMin={minutes} /></div>
      </div>
    ) : (
      <div className="text-sm text-faint">This track&apos;s frontier is empty today — pull the time into another step.</div>
    );

  const tutor = TUTOR_PROMPTS[(day ?? 1) % TUTOR_PROMPTS.length];

  const steps: StepDef[] = mission.researchMode
    ? researchSteps(mission.slots, reviews.length)
    : [
        {
          id: "s1", code: "01", title: "UNDERSTAND", color: "#e8b34d",
          minutes: Math.max(30, (mathSlot?.minutes ?? 105) - 25),
          summary: mathSlot?.node ? mathSlot.node.title : "today's theory frontier",
          body: (
            <div>
              <p className="mb-2 text-xs text-dim">
                New material first, while you&apos;re fresh. Work the lesson&apos;s intuition and formalism bands —
                or the listed source sections — actively: pen out, predictions before reveals.
              </p>
              {nodeLine(mathSlot?.node, "math", Math.max(30, (mathSlot?.minutes ?? 105) - 25))}
            </div>
          ),
        },
        {
          id: "s2", code: "02", title: "DERIVE", color: "#e8b34d", minutes: 25,
          summary: "close the source, reproduce the math",
          body: (
            <div className="text-sm text-dim">
              <p>
                Close everything. On paper, reproduce today&apos;s central derivation or definitions from memory —
                then reopen and diff. What you couldn&apos;t reproduce is what you haven&apos;t learned yet.
              </p>
              {mathSlot?.node && hasLesson(mathSlot.node.id) && (
                <Link href={`/learn/${mathSlot.node.id}`} className="btn mt-2 !py-1.5 text-xs">
                  Re-open the derivation band to check
                </Link>
              )}
            </div>
          ),
        },
        {
          id: "s3", code: "03", title: "IMPLEMENT", color: "#4dd6e8",
          minutes: implSlot?.minutes ?? 90,
          summary: implSlot?.node ? implSlot.node.title : "code the idea",
          body: (
            <div>
              <p className="mb-2 text-xs text-dim">
                Theory becomes capability only in an editor. Type it yourself; the acceptance checks are the contract.
              </p>
              {nodeLine(implSlot?.node, "implementation", implSlot?.minutes ?? 90)}
            </div>
          ),
        },
        {
          id: "s4", code: "04", title: "APPLY", color: "#a78bfa",
          minutes: (specSlot?.minutes ?? 90) + (projSlot?.minutes ?? 0),
          summary: specSlot?.node?.title ?? projSlot?.projectTitle ?? "specialization + project",
          body: (
            <div className="space-y-3">
              {specSlot?.node && nodeLine(specSlot.node, "specialization", specSlot.minutes)}
              <div className="border-t border-line/60 pt-3">
                {projSlot?.projectTitle ? (
                  <div>
                    <Link href="/projects" className="text-[15px] font-medium text-ink hover:text-acc">
                      {projSlot.projectTitle}
                    </Link>
                    {projSlot.projectStep && <div className="mt-0.5 text-xs text-dim">next: {projSlot.projectStep}</div>}
                    <div className="mt-2"><QuickLog block="project" defaultMin={projSlot.minutes} /></div>
                  </div>
                ) : (
                  <div className="text-sm text-faint">{projSlot?.note ?? "No project unlocked yet — the ladder opens with Level 1 basics."}</div>
                )}
              </div>
            </div>
          ),
        },
        {
          id: "s5", code: "05", title: "PROVE IT", color: "#52d68a", minutes: 30,
          summary: focus ? `mastery check: ${focus.title}` : "mastery check + retrieval",
          body: (
            <div className="space-y-3">
              {focus && (
                <div>
                  <div className="text-sm font-medium text-ink">{focus.title}</div>
                  <p className="mt-1 text-sm text-dim">{focus.test}</p>
                  <Link href={`/node/${focus.nodeId}`} className="btn btn-acc mt-2 !py-1.5 text-xs">
                    Open node & claim tier
                  </Link>
                </div>
              )}
              <div className="border-t border-line/60 pt-2 text-sm">
                <Link href="/review" className="text-acc hover:underline">
                  {reviews.length === 0 ? "Review queue clear — free recall: yesterday's key result, closed book" : `${reviews.length} retrieval items due — closed book first`}
                </Link>
                <div className="mt-2"><QuickLog block="review" defaultMin={25} /></div>
              </div>
            </div>
          ),
        },
        {
          id: "s6", code: "06", title: "CONNECT", color: "#f2934d", minutes: 10,
          summary: "place today inside the bigger map",
          body: (
            <div className="space-y-2 text-sm text-dim">
              <p>
                Three written sentences: where does today&apos;s concept reappear later in the graph, and in which
                paper? (The lesson&apos;s connection block has the answer — write yours first, then compare.)
              </p>
              <div className="rounded-md border border-line bg-panel2 p-2.5">
                <div className="text-xs font-medium text-ink">{tutor.title}</div>
                <div className="mt-0.5 text-[11px] text-faint">{tutor.when}</div>
                <p className="mt-1.5 font-mono text-[11px] leading-relaxed">{tutor.prompt}</p>
                <button className="btn mt-1.5 !py-1 text-[11px]" onClick={() => navigator.clipboard?.writeText(tutor.prompt)}>Copy prompt</button>
              </div>
            </div>
          ),
        },
        {
          id: "s7", code: "07", title: "SHIP", color: "#e86ea4", minutes: 5,
          summary: "what exists now that didn't this morning?",
          body: <ShipBox />,
        },
      ];

  const doneCount = steps.filter((s) => plan[s.id]).length;
  const firstOpen = steps.findIndex((s) => !plan[s.id]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* ── MISSION BRIEF ─────────────────────────────────────────── */}
      <Panel accent="#4dd6e8" className="relative overflow-hidden">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="mono-label text-acc">{mission.researchMode ? "research loop · mission brief" : "mission brief"}</div>
          <span className="font-mono text-[11px] text-faint">{new Date().toDateString()}</span>
        </div>
        <h1 className="mt-1 font-mono text-2xl font-bold">
          DAY {day ? Math.min(day, 210) : 0}
          {phase && <span className="ml-3 text-sm font-normal text-dim">{phase.title}</span>}
        </h1>
        {focus && !mission.researchMode && (
          <p className="mt-2 text-sm leading-relaxed text-dim">
            <span className="text-faint">By tonight you can: </span>
            <span className="text-ink">{focus.test}</span>
          </p>
        )}
        {mission.researchMode && (
          <p className="mt-2 text-sm text-dim">
            One loop: hypothesize → run → measure → write. The experiment log entry is the deliverable.
          </p>
        )}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel2">
            <div className="h-full rounded-full bg-acc transition-all duration-500" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
          </div>
          <span className="font-mono text-[11px] text-dim">{doneCount}/{steps.length} steps</span>
          {loggedMin > 0 && <span className="font-mono text-[11px] text-acc">{(loggedMin / 60).toFixed(1)}h logged</span>}
        </div>
        {mission.blockers.length > 0 && (
          <div className="mt-3 space-y-1 border-t border-line/60 pt-2.5">
            {mission.blockers.map((b, i) => (
              <div key={i} className="text-xs text-acc-math">⚠ {b}</div>
            ))}
          </div>
        )}
      </Panel>

      {/* ── THE SEQUENCE ──────────────────────────────────────────── */}
      <div className="space-y-2.5">
        {steps.map((s, i) => (
          <MissionStep
            key={s.id}
            step={s}
            state={plan[s.id] ? "done" : i === firstOpen ? "active" : "later"}
            onToggle={(done) => store.toggleMissionStep(today, s.id, done)}
          />
        ))}
      </div>

      {doneCount === steps.length && (
        <Panel accent="#52d68a" className="scale-in text-center">
          <div className="font-mono text-sm font-bold tracking-widest text-acc-robot">MISSION COMPLETE</div>
          <p className="mt-1 text-xs text-dim">
            {(loggedMin / 60).toFixed(1)}h logged · {todayLogs.filter((l) => l.note?.startsWith("SHIP:")).length} shipped.
            Tomorrow&apos;s frontier is already waiting on the tree.
          </p>
        </Panel>
      )}

      {/* logged today (compact) */}
      {todayLogs.length > 0 && (
        <Panel>
          <SectionTitle>logged today</SectionTitle>
          <div className="space-y-1">
            {todayLogs.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-xs">
                <span className="text-dim">
                  <span className="font-mono" style={{ color: BLOCK_COLORS[l.block] }}>{l.block}</span>
                  {l.nodeId && <span className="ml-2 text-faint">{NODE_MAP.get(l.nodeId)?.title}</span>}
                  {l.note && <span className="ml-2 text-acc-robot">{l.note}</span>}
                </span>
                <span className="flex items-center gap-2 font-mono text-faint">
                  {l.minutes > 0 && `${l.minutes}m`}
                  {l.independence && <span title="independence">· {l.independence.replace("_", " ")}</span>}
                  <button onClick={() => store.deleteLog(l.id)} className="text-faint hover:text-acc-frontier">×</button>
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

/* ── a single progressive step ─────────────────────────────────────── */
function MissionStep({
  step, state, onToggle,
}: {
  step: StepDef;
  state: "done" | "active" | "later";
  onToggle: (done: boolean) => void;
}) {
  const [forceOpen, setForceOpen] = useState(false);
  const open = state === "active" || forceOpen;

  return (
    <div
      className={`overflow-hidden rounded-lg border transition-colors ${
        state === "active" ? "border-line2 bg-panel" : "border-line bg-panel/60"
      }`}
      style={state === "active" ? { borderLeftColor: step.color, borderLeftWidth: 3 } : { opacity: state === "later" && !forceOpen ? 0.55 : 1 }}
    >
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        onClick={() => (state === "active" ? undefined : setForceOpen(!forceOpen))}
        aria-expanded={open}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] font-bold"
          style={{
            borderColor: state === "done" ? "#52d68a66" : `${step.color}55`,
            color: state === "done" ? "#52d68a" : step.color,
            background: state === "done" ? "#52d68a12" : "transparent",
          }}
        >
          {state === "done" ? "✓" : step.code}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`font-mono text-[12px] font-bold tracking-wider ${state === "done" ? "text-faint line-through" : "text-ink"}`}>
            {step.title}
          </span>
          <span className="ml-2 truncate text-xs text-dim">{step.summary}</span>
        </span>
        {step.minutes != null && (
          <span className="shrink-0 font-mono text-[10.5px] text-faint">~{step.minutes}m</span>
        )}
      </button>

      {open && (
        <div className="border-t border-line/60 px-4 py-3.5 pl-[52px] rise-in">
          {step.body}
          <div className="mt-3 border-t border-line/40 pt-2.5">
            <button
              className={state === "done" ? "btn !py-1.5 text-xs" : "btn btn-acc !py-1.5 text-xs"}
              onClick={() => onToggle(state !== "done")}
            >
              {state === "done" ? "↺ reopen step" : `✓ ${step.title} complete`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function researchSteps(
  slots: { block: string; label: string; minutes: number; hint: string; reviewCount?: number }[],
  reviewCount: number,
): StepDef[] {
  const codes = ["01", "02", "03", "04", "05"];
  const titles = ["READ", "EXPERIMENT", "WRITE", "REVIEW", "SHIP"];
  const defs: StepDef[] = slots.slice(0, 4).map((s, i) => ({
    id: `r${i + 1}`,
    code: codes[i],
    title: titles[i] ?? s.label.toUpperCase(),
    color: BLOCK_COLORS[s.block] ?? "#4dd6e8",
    minutes: s.minutes,
    summary: s.hint,
    body: (
      <div className="text-sm text-dim">
        <p>{s.hint}</p>
        {s.block === "review" && (
          <Link href="/review" className="btn mt-2 !py-1.5 text-xs">
            {reviewCount > 0 ? `${reviewCount} items due` : "Queue clear — free recall instead"}
          </Link>
        )}
        {s.block === "research" && (
          <Link href="/experiments" className="btn mt-2 !py-1.5 text-xs">Open experiment tracker</Link>
        )}
        {s.block === "papers" && (
          <Link href="/papers" className="btn mt-2 !py-1.5 text-xs">Open paper ladder</Link>
        )}
        <div className="mt-2"><QuickLog block={s.block as Block} defaultMin={s.minutes} /></div>
      </div>
    ),
  }));
  defs.push({
    id: "r5", code: "05", title: "SHIP", color: "#e86ea4", minutes: 5,
    summary: "the log entry is the deliverable",
    body: <ShipBox />,
  });
  return defs;
}

function QuickLog({ block, nodeId, defaultMin }: { block: Block; nodeId?: string; defaultMin: number }) {
  const addLog = useStore((s) => s.addLog);
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(defaultMin);
  const [indep, setIndep] = useState<Independence>("independent");

  if (!open)
    return <button className="btn shrink-0 !py-1 text-xs" onClick={() => setOpen(true)}>✓ log time</button>;
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
      <input type="number" value={min} min={5} step={5} onChange={(e) => setMin(Number(e.target.value))} className="!w-20 !py-1 text-center font-mono text-xs" />
      <select value={indep} onChange={(e) => setIndep(e.target.value as Independence)} className="!w-auto !py-1 text-xs">
        <option value="independent">independent</option>
        <option value="hints">hint-assisted</option>
        <option value="heavy_ai">heavy AI</option>
        <option value="copied">copied</option>
      </select>
      <button
        className="btn btn-acc !py-1"
        onClick={() => {
          addLog({ date: new Date().toISOString().slice(0, 10), minutes: min, block, nodeId, independence: indep });
          setOpen(false);
        }}
      >
        save
      </button>
      <button className="btn !py-1" onClick={() => setOpen(false)}>×</button>
    </div>
  );
}

function ShipBox() {
  const store = useStore();
  const [note, setNote] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div>
      <p className="mb-2 text-xs text-dim">
        Name one artifact that exists now and didn&apos;t this morning — a commit, a passing test, a derivation page, a paragraph.
        No artifact = the day isn&apos;t done yet.
      </p>
      <div className="flex gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && note.trim()) {
              store.addLog({ date: today, minutes: 0, block: "project", note: `SHIP: ${note.trim()}` });
              setNote("");
            }
          }}
          placeholder="e.g. 'IK benchmark green at 96% — committed pandakin@4f2a1'"
        />
        <button
          className="btn btn-acc shrink-0"
          disabled={!note.trim()}
          onClick={() => {
            store.addLog({ date: today, minutes: 0, block: "project", note: `SHIP: ${note.trim()}` });
            setNote("");
          }}
        >
          Ship it
        </button>
      </div>
      <div className="mt-2 space-y-0.5">
        {store.logs.filter((l) => l.date === today && l.note?.startsWith("SHIP:")).map((l) => (
          <div key={l.id} className="text-xs text-acc-robot">▸ {l.note?.slice(6)}</div>
        ))}
      </div>
    </div>
  );
}
