"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { todaysMission } from "@/lib/engine/scheduler";
import { reviewQueue } from "@/lib/engine/review";
import { dayOfProgram, currentPhase } from "@/lib/engine/pacing";
import { NODE_MAP } from "@/content/nodes";
import { TUTOR_PROMPTS } from "@/content/templates";
import { Panel, SectionTitle, EmptyState } from "@/components/ui";
import type { Block, Independence } from "@/lib/types";

const BLOCK_COLORS: Record<string, string> = {
  math: "#e8b34d", implementation: "#4dd6e8", specialization: "#a78bfa",
  project: "#52d68a", review: "#f2934d", papers: "#a78bfa", research: "#e86ea4",
};

export default function TodayPage() {
  const store = useStore();
  const data = store.exportData();
  const mission = todaysMission(data);
  const day = dayOfProgram(data.settings);
  const phase = day ? currentPhase(day) : null;
  const reviews = reviewQueue(data.nodes);
  const today = new Date().toISOString().slice(0, 10);
  const todayLogs = data.logs.filter((l) => l.date === today);
  const loggedMin = todayLogs.reduce((s, l) => s + l.minutes, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <div className="mono-label">{mission.researchMode ? "research loop" : "today's mission"}</div>
        <h1 className="mt-1 font-mono text-2xl font-bold">
          {day ? `DAY ${Math.min(day, 210)}` : "DAY 0"}
          <span className="ml-3 text-sm font-normal text-dim">{new Date().toDateString()}</span>
        </h1>
        {phase && <div className="mt-1 text-sm text-dim">{phase.title} — <span className="text-faint">{phase.deliverable}</span></div>}
      </div>

      {mission.blockers.length > 0 && (
        <Panel accent="#e8b34d">
          <SectionTitle>blockers</SectionTitle>
          {mission.blockers.map((b, i) => (
            <div key={i} className="text-sm text-acc-math">⚠ {b}</div>
          ))}
        </Panel>
      )}

      {/* the sequence */}
      <div className="space-y-3">
        {mission.slots.map((slot, i) => (
          <Panel key={i} className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-[3px]" style={{ background: BLOCK_COLORS[slot.block] ?? "#4dd6e8" }} />
            <div className="flex flex-wrap items-start justify-between gap-3 pl-2">
              <div className="min-w-0 flex-1">
                <div className="mono-label" style={{ color: BLOCK_COLORS[slot.block] }}>
                  {String(i + 1).padStart(2, "0")} · {slot.label} · ~{slot.minutes} min
                </div>
                {slot.node ? (
                  <div className="mt-1">
                    <Link href={`/node/${slot.node.id}`} className="text-[15px] font-medium text-ink hover:text-acc">
                      {slot.node.title}
                    </Link>
                    <div className="mt-0.5 text-xs text-dim">{slot.node.why}</div>
                    {slot.node.primary && (
                      <div className="mt-1.5 text-xs text-faint">
                        ▸ {slot.node.primary.sections}
                      </div>
                    )}
                  </div>
                ) : slot.projectTitle ? (
                  <div className="mt-1">
                    <Link href="/projects" className="text-[15px] font-medium text-ink hover:text-acc">{slot.projectTitle}</Link>
                    {slot.projectStep && <div className="mt-0.5 text-xs text-dim">next: {slot.projectStep}</div>}
                  </div>
                ) : slot.reviewCount != null ? (
                  <div className="mt-1">
                    <Link href="/review" className="text-[15px] font-medium text-ink hover:text-acc">
                      {slot.reviewCount === 0 ? "Queue clear — free recall: yesterday's key result, closed book" : `${slot.reviewCount} retrieval items due`}
                    </Link>
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-faint">{slot.note ?? slot.hint}</div>
                )}
              </div>
              <QuickLog block={slot.block as Block} nodeId={slot.node?.id} defaultMin={slot.minutes} />
            </div>
          </Panel>
        ))}
      </div>

      {/* mastery check + ship */}
      {mission.masteryCheck && (
        <Panel accent="#52d68a">
          <SectionTitle>test yourself — today&apos;s mastery check</SectionTitle>
          <div className="text-sm font-medium text-ink">{mission.masteryCheck.title}</div>
          <p className="mt-1 text-sm text-dim">{mission.masteryCheck.test}</p>
          <div className="mt-2 flex gap-2">
            <Link href={`/node/${mission.masteryCheck.nodeId}`} className="btn">Open node & claim tier</Link>
          </div>
        </Panel>
      )}

      <ShipBox />

      {/* footer stats + tutor prompt of the day */}
      <div className="grid gap-4 md:grid-cols-2">
        <Panel>
          <SectionTitle>logged today</SectionTitle>
          {todayLogs.length === 0 ? (
            <EmptyState title="Nothing logged yet" hint="Use ✓ log on each block as you finish it" />
          ) : (
            <div className="space-y-1">
              {todayLogs.map((l) => (
                <div key={l.id} className="flex items-center justify-between text-xs">
                  <span className="text-dim">
                    <span className="font-mono" style={{ color: BLOCK_COLORS[l.block] }}>{l.block}</span>
                    {l.nodeId && <span className="ml-2 text-faint">{NODE_MAP.get(l.nodeId)?.title}</span>}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-faint">
                    {l.minutes}m {l.independence && <span title="independence">· {l.independence.replace("_", " ")}</span>}
                    <button onClick={() => store.deleteLog(l.id)} className="text-faint hover:text-acc-frontier">×</button>
                  </span>
                </div>
              ))}
              <div className="mt-2 border-t border-line pt-2 text-right font-mono text-xs text-acc">
                {(loggedMin / 60).toFixed(1)} h focused
              </div>
            </div>
          )}
        </Panel>
        <Panel>
          <SectionTitle>tutor protocol of the day</SectionTitle>
          {(() => {
            const p = TUTOR_PROMPTS[(day ?? 1) % TUTOR_PROMPTS.length];
            return (
              <div>
                <div className="text-sm font-medium">{p.title}</div>
                <div className="mt-0.5 text-xs text-faint">{p.when}</div>
                <p className="mt-2 rounded-md border border-line bg-panel2 p-2.5 font-mono text-[11.5px] leading-relaxed text-dim">{p.prompt}</p>
                <button className="btn mt-2" onClick={() => navigator.clipboard?.writeText(p.prompt)}>Copy</button>
              </div>
            );
          })()}
        </Panel>
      </div>
      {reviews.length > 0 && (
        <div className="text-center text-xs text-faint">
          {reviews.length} retrieval item{reviews.length === 1 ? "" : "s"} waiting in <Link className="text-acc" href="/review">Review</Link> — do them closed-book first.
        </div>
      )}
    </div>
  );
}

function QuickLog({ block, nodeId, defaultMin }: { block: Block; nodeId?: string; defaultMin: number }) {
  const addLog = useStore((s) => s.addLog);
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(defaultMin);
  const [indep, setIndep] = useState<Independence>("independent");

  if (!open)
    return (
      <button className="btn shrink-0" onClick={() => setOpen(true)}>✓ log</button>
    );
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
  return (
    <Panel accent="#4dd6e8">
      <SectionTitle>ship — what exists now that didn&apos;t this morning?</SectionTitle>
      <div className="flex gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. 'IK benchmark green at 96% — committed pandakin@4f2a1'"
        />
        <button
          className="btn btn-acc shrink-0"
          disabled={!note.trim()}
          onClick={() => {
            store.addLog({ date: new Date().toISOString().slice(0, 10), minutes: 0, block: "project", note: `SHIP: ${note.trim()}` });
            setNote("");
          }}
        >
          Ship it
        </button>
      </div>
      <div className="mt-2 space-y-0.5">
        {store.logs.filter((l) => l.date === new Date().toISOString().slice(0, 10) && l.note?.startsWith("SHIP:")).map((l) => (
          <div key={l.id} className="text-xs text-acc-robot">▸ {l.note?.slice(6)}</div>
        ))}
      </div>
    </Panel>
  );
}
