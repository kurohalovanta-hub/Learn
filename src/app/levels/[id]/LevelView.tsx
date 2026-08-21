"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVELS } from "@/content/levels";
import { nodesForLevel } from "@/content/nodes";
import { useStore } from "@/lib/store";
import { nodeState } from "@/lib/engine/graph";
import { levelCompletion } from "@/lib/engine/mastery";
import { Bar, Panel, SectionTitle, StateBadge, TierBadge } from "@/components/ui";

export function LevelView({ id }: { id: string }) {
  const level = LEVELS.find((l) => l.id === Number(id));
  const store = useStore();
  if (!level) notFound();
  const nodes = nodesForLevel(level.id);
  const completion = levelCompletion(level.id, store.nodes);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <div className="mono-label" style={{ color: level.accent }}>
          level {level.id} · {level.codename} · expected days {level.phase.startDay}–{level.phase.endDay}
        </div>
        <h1 className="mt-1 text-2xl font-bold">{level.title}</h1>
        <p className="mt-1 text-sm text-dim">{level.goal}</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="w-64"><Bar value={completion} color={level.accent} /></div>
          <span className="font-mono text-xs text-faint">{Math.round(completion * 100)}%</span>
        </div>
      </div>

      <Panel accent={level.accent}>
        <SectionTitle>exit criteria</SectionTitle>
        <ul className="space-y-1">
          {level.exitCriteria.map((c, i) => (
            <li key={i} className="text-sm text-ink">□ {c}</li>
          ))}
        </ul>
      </Panel>

      <div className="space-y-2">
        {nodes.map((n) => {
          const st = nodeState(n.id, store.nodes);
          const p = store.nodes[n.id];
          return (
            <Link key={n.id} href={`/node/${n.id}`}>
              <Panel className="hover-raise mb-2 !py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-medium">{n.title}</span>
                      {n.id.startsWith("boss-") && <span className="rounded bg-acc-frontier/15 px-1.5 py-0.5 font-mono text-[10px] text-acc-frontier">BOSS</span>}
                      {n.optional && <span className="rounded bg-panel2 px-1.5 py-0.5 font-mono text-[10px] text-faint">STRETCH</span>}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-faint">{n.why}</div>
                  </div>
                  <span className="font-mono text-[11px] text-faint">{n.hours}h</span>
                  {p && p.tier !== "none" && <TierBadge tier={p.tier} />}
                  <StateBadge state={st} />
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
