"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { todaysMission } from "@/lib/engine/scheduler";
import { reviewQueue } from "@/lib/engine/review";
import { dayOfProgram, currentPhase } from "@/lib/engine/pacing";
import { NODE_MAP } from "@/content/nodes";
import { PACKET_REGISTRY } from "@/content/packets/registry";
import { hasLesson } from "@/content/lessons/manifest";
import { unlocks } from "@/lib/engine/graph";
import { fallbackPacket } from "@/lib/packet-fallback";
import type { LearningPacket } from "@/lib/packet-types";
import type { Block, Independence, SkillNode } from "@/lib/types";
import { TutorBridge } from "@/components/TutorBridge";
import { Panel } from "@/components/ui";

// ONE objective (HANDOVERFINAL §30): the current bottleneck, its capability
// target, the next few packet steps — and nothing else above the fold.

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

  // the bottleneck: most recently worked incomplete node, else the scheduler's pick
  const bottleneck: SkillNode | null = useMemo(() => {
    const recent = [...store.events].reverse().find((e) => {
      const n = NODE_MAP.get(e.nodeId);
      const p = store.nodes[e.nodeId];
      return !!n && e.kind !== "manual-override" && (!p || p.status !== "mastered");
    });
    if (recent) return NODE_MAP.get(recent.nodeId) ?? null;
    const slot = mission.slots.find((s) => s.node)?.node;
    return slot ?? (mission.masteryCheck ? NODE_MAP.get(mission.masteryCheck.nodeId) ?? null : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.events, store.nodes]);

  // curated packets load async; the loaded state is keyed by node id so a stale
  // packet never renders for a new bottleneck (and no sync setState in the effect)
  const [loaded, setLoaded] = useState<{ id: string; packet: LearningPacket } | null>(null);
  useEffect(() => {
    if (!bottleneck || !PACKET_REGISTRY[bottleneck.id]) return;
    let alive = true;
    PACKET_REGISTRY[bottleneck.id]().then((m) => {
      if (alive) setLoaded({ id: bottleneck.id, packet: m.packet });
    });
    return () => { alive = false; };
  }, [bottleneck]);
  const packet = useMemo<LearningPacket | null>(() => {
    if (!bottleneck) return null;
    if (loaded?.id === bottleneck.id) return loaded.packet;
    return PACKET_REGISTRY[bottleneck.id] ? null : fallbackPacket(bottleneck);
  }, [bottleneck, loaded]);

  const ev = useMemo(
    () => (bottleneck ? store.events.filter((e) => e.nodeId === bottleneck.id) : []),
    [store.events, bottleneck],
  );
  const stepStates = useMemo(() => {
    if (!packet) return [];
    const has = (pred: (e: (typeof ev)[number]) => boolean) => ev.some(pred);
    const allWatch = [...(packet.orient ? [packet.orient] : []), ...(packet.coreWatch ?? [])];
    const out: { label: string; done: boolean }[] = [];
    if (allWatch.length)
      out.push({ label: `WATCH — ${allWatch.reduce((s, m) => s + m.minutes, 0)} min`, done: allWatch.every((m) => has((e) => e.kind === "exposure" && e.note === `watched:${m.url}`)) });
    if (packet.recall?.length)
      out.push({ label: `RECALL — ${packet.recall.length} questions`, done: packet.recall.every((_, i) => has((e) => e.kind === "retrieval" && e.note === `recall:${i}`)) });
    if (packet.coreRead?.length)
      out.push({ label: "READ — the exact sections", done: packet.coreRead.every((r) => has((e) => e.kind === "exposure" && e.note === `read:${r.title}`)) });
    if (packet.practice.length)
      out.push({ label: `WORK — ${packet.practice.length} practice blocks`, done: packet.practice.every((_, i) => has((e) => e.kind === "problem" && e.note === `practice:${i}`)) });
    if (packet.implement || packet.derive)
      out.push({
        label: "BUILD / DERIVE",
        done: (!packet.implement || has((e) => e.kind === "implementation" && e.note === "packet-build" && e.outcome === "pass")) &&
              (!packet.derive || has((e) => e.kind === "derivation" && e.note === "packet-build" && e.outcome === "pass")),
      });
    out.push({ label: "PROVE IT — closed book", done: has((e) => e.kind === "assessment" && e.outcome === "pass") });
    return out;
  }, [packet, ev]);

  const firstOpen = stepStates.findIndex((s) => !s.done);
  const nextUnlock = bottleneck ? unlocks(bottleneck.id).find((d) => store.nodes[d.id]?.status !== "mastered") : null;

  if (mission.researchMode) return <ResearchToday />;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* header — quiet */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="mono-label">
          day {day ? Math.min(day, 210) : 0}{phase ? ` · ${phase.title.toLowerCase()}` : ""}
        </div>
        <span className="font-mono text-[11px] text-faint">
          {loggedMin > 0 ? `${(loggedMin / 60).toFixed(1)}h logged` : new Date().toDateString()}
        </span>
      </div>

      {mission.blockers.length > 0 && (
        <div className="space-y-1">
          {mission.blockers.map((b, i) => (
            <div key={i} className="rounded-md border border-acc-math/30 bg-acc-math/[0.06] px-3 py-2 text-xs text-acc-math">⚠ {b}</div>
          ))}
        </div>
      )}

      {bottleneck ? (
        <Panel accent="#4dd6e8" className="!p-5">
          <div className="mono-label text-acc">current bottleneck</div>
          <h1 className="mt-1 text-xl font-bold tracking-tight">
            <Link href={`/node/${bottleneck.id}`} className="hover:text-acc">{bottleneck.title}</Link>
          </h1>
          <div className="mt-3">
            <div className="mono-label">today&apos;s capability target</div>
            <p className="mt-0.5 text-[14px] leading-relaxed text-ink">{packet?.prove.task ?? bottleneck.masteryTest}</p>
          </div>
          <div className="mt-3">
            <div className="mono-label">why now</div>
            <p className="mt-0.5 text-[13px] leading-relaxed text-dim">
              {bottleneck.why}{" "}
              {nextUnlock && <span className="text-faint">Blocks: {nextUnlock.title}.</span>}
            </p>
          </div>

          {/* the steps — live from the packet runner's evidence */}
          {stepStates.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {stepStates.map((s, i) => (
                <Link
                  key={s.label}
                  href={`/node/${bottleneck.id}`}
                  className="flex items-center gap-2.5 rounded-md border px-3 py-2 transition-colors"
                  style={{
                    borderColor: i === firstOpen ? "#4dd6e855" : "var(--color-line)",
                    opacity: s.done ? 0.55 : i === firstOpen ? 1 : 0.75,
                    background: i === firstOpen ? "#4dd6e80a" : "transparent",
                  }}
                >
                  <span className="font-mono text-[11px]" style={{ color: s.done ? "#52d68a" : "#4dd6e8" }}>
                    {s.done ? "✓" : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`font-mono text-[12px] tracking-wide ${s.done ? "text-faint line-through" : "text-ink"}`}>
                    {s.label}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/node/${bottleneck.id}`} className="btn btn-acc">▶ Work the path</Link>
            {hasLesson(bottleneck.id) && (
              <Link href={`/learn/${bottleneck.id}`} className="btn">⚡ Lesson</Link>
            )}
          </div>

          <div className="mt-4 border-t border-line/60 pt-3">
            <div className="mono-label mb-1.5">stuck?</div>
            <TutorBridge nodeId={bottleneck.id} compact />
          </div>

          {nextUnlock && (
            <div className="mt-3 text-[11.5px] text-faint">
              next unlock → <Link href={`/node/${nextUnlock.id}`} className="text-acc hover:underline">{nextUnlock.title}</Link>
            </div>
          )}
        </Panel>
      ) : (
        <Panel accent="#4dd6e8" className="!p-5">
          <div className="mono-label text-acc">boot</div>
          <p className="mt-1 text-sm text-dim">
            Set your start date in <Link href="/settings" className="text-acc hover:underline">Settings</Link>,
            then open the first node — the system sequences everything from there.
          </p>
          <Link href="/tree" className="btn btn-acc mt-3">Open the tree</Link>
        </Panel>
      )}

      {/* secondary — collapsed rows, never competing with the bottleneck */}
      <div className="space-y-2">
        <SecondaryRow
          href="/review"
          label={reviews.length > 0 ? `retrieval — ${reviews.length} due` : "retrieval — queue clear"}
          hot={reviews.length > 0}
          detail={reviews.length > 0 ? "Closed book first. Passing reviews is what verifies claims." : "Free recall: yesterday's key result."}
        />
        {mission.slots.find((s) => s.projectTitle) && (
          <SecondaryRow
            href="/projects"
            label={`project — ${mission.slots.find((s) => s.projectTitle)?.projectTitle}`}
            detail={mission.slots.find((s) => s.projectTitle)?.projectStep ?? ""}
          />
        )}
        {mission.slots
          .filter((s) => s.node && s.node.id !== bottleneck?.id)
          .slice(0, 1)
          .map((s) => (
            <SecondaryRow
              key={s.node!.id}
              href={`/node/${s.node!.id}`}
              label={`parallel track — ${s.node!.title}`}
              detail="Only after the bottleneck moved. Low cognitive interference by design."
            />
          ))}
      </div>

      <ShipLine />

      {todayLogs.length > 0 && (
        <div className="space-y-1 px-1">
          {todayLogs.map((l) => (
            <div key={l.id} className="flex items-center justify-between text-[11.5px] text-faint">
              <span>
                {l.block}{l.nodeId ? ` · ${NODE_MAP.get(l.nodeId)?.title}` : ""}{l.note ? ` · ${l.note}` : ""}
              </span>
              <span className="flex items-center gap-2 font-mono">
                {l.minutes > 0 && `${l.minutes}m`}
                <button onClick={() => store.deleteLog(l.id)} className="hover:text-acc-frontier">×</button>
              </span>
            </div>
          ))}
        </div>
      )}
      <QuickLogRow nodeId={bottleneck?.id} />
    </div>
  );
}

function SecondaryRow({ href, label, detail, hot }: { href: string; label: string; detail: string; hot?: boolean }) {
  return (
    <Link
      href={href}
      className="block rounded-md border px-3.5 py-2.5 transition-colors hover:border-acc/40"
      style={{ borderColor: hot ? "#f2934d44" : "var(--color-line)", opacity: hot ? 1 : 0.8 }}
    >
      <div className={`font-mono text-[12px] ${hot ? "text-acc-review" : "text-dim"}`} style={hot ? { color: "#f2934d" } : undefined}>
        {label}
      </div>
      {detail && <div className="mt-0.5 text-[11.5px] text-faint">{detail}</div>}
    </Link>
  );
}

function ResearchToday() {
  const store = useStore();
  const data = store.exportData();
  const day = dayOfProgram(data.settings);
  const open = data.experiments.find((e) => e.status === "running") ?? data.experiments.find((e) => e.status === "planned");
  const paper = Object.entries(data.papers).find(([, p]) => ["reading", "deriving", "reproducing"].includes(p.status));
  const reviews = reviewQueue(data.nodes);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="mono-label">day {day ?? "—"} · research loop</div>
      <Panel accent="#e86ea4" className="!p-5">
        <div className="mono-label text-acc-frontier">the loop — hypothesize → run → measure → write</div>
        {open ? (
          <div className="mt-2">
            <div className="text-[15px] font-semibold text-ink">{open.title || "(untitled experiment)"}</div>
            <p className="mt-1 text-[13px] text-dim">{open.hypothesis || "No hypothesis written — that is today's first task."}</p>
            <Link href="/experiments" className="btn btn-acc mt-3">Open experiment</Link>
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-sm text-acc-math">No planned or running experiment. Pre-register the next one before anything else — the log entry is the deliverable.</p>
            <Link href="/experiments" className="btn btn-acc mt-3">Pre-register</Link>
          </div>
        )}
        <div className="mt-4 space-y-1.5 border-t border-line/60 pt-3 text-[12.5px] text-dim">
          <div>▸ <b className="text-ink">Read/think 45m</b>{paper ? <> — continue <Link className="text-acc hover:underline" href={`/papers/${paper[0]}`}>{paper[0]}</Link></> : " — pick from the ladder"}</div>
          <div>▸ <b className="text-ink">Write</b> — the report grows a little every day; claims tied to evidence.</div>
          <div>▸ <b className="text-ink">Review {reviews.length > 0 ? `(${reviews.length} due)` : ""}</b> — <Link className="text-acc hover:underline" href="/review">keep the foundations warm</Link>.</div>
        </div>
      </Panel>
      <ShipLine />
    </div>
  );
}

function QuickLogRow({ nodeId }: { nodeId?: string }) {
  const addLog = useStore((s) => s.addLog);
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(60);
  const [block, setBlock] = useState<Block>("math");
  const [indep, setIndep] = useState<Independence>("independent");
  if (!open)
    return (
      <button className="btn w-full justify-center !py-2 text-xs" onClick={() => setOpen(true)}>
        ✓ log focused time
      </button>
    );
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-line p-2.5">
      <input type="number" value={min} min={5} step={5} onChange={(e) => setMin(Number(e.target.value))} className="!w-20 !py-1 text-center font-mono text-xs" />
      <select value={block} onChange={(e) => setBlock(e.target.value as Block)} className="!w-auto !py-1 text-xs">
        {["math", "implementation", "specialization", "project", "review", "papers", "research"].map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
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

function ShipLine() {
  const store = useStore();
  const [note, setNote] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const ships = store.logs.filter((l) => l.date === today && l.note?.startsWith("SHIP:"));
  const ship = () => {
    if (!note.trim()) return;
    store.addLog({ date: today, minutes: 0, block: "project", note: `SHIP: ${note.trim()}` });
    setNote("");
  };
  return (
    <div className="rounded-md border border-line p-3">
      <div className="mono-label mb-1.5">ship — what exists now that didn&apos;t this morning?</div>
      <div className="flex gap-2">
        <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ship()} placeholder="a commit, a passing check, a derivation page…" />
        <button className="btn shrink-0 !py-1.5 text-xs" disabled={!note.trim()} onClick={ship}>Ship</button>
      </div>
      {ships.map((l) => (
        <div key={l.id} className="mt-1 text-xs text-acc-robot">▸ {l.note?.slice(6)}</div>
      ))}
    </div>
  );
}
