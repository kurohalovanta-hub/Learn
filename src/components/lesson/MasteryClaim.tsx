"use client";

import Link from "next/link";
import { useState } from "react";
import type { Independence, SkillNode, Tier } from "@/lib/types";
import { TIERS, tierAtLeast } from "@/lib/types";
import { useStore } from "@/lib/store";
import { nodeState } from "@/lib/engine/graph";
import { TIER_COLORS } from "../ui";
import { claimWithMoment } from "../MasteryMoment";

/** The gate, embedded at the end of a lesson (and reused on the node page). */
export function MasteryClaim({ node }: { node: SkillNode }) {
  const store = useStore();
  const p = store.nodes[node.id];
  const state = nodeState(node.id, store.nodes);
  const locked = state === "locked";
  const [evidence, setEvidence] = useState(p?.evidence ?? "");
  const [indep, setIndep] = useState<Independence>(p?.independence ?? "independent");
  const claimable: Tier[] = TIERS.filter((t) => t !== "none");
  const heavyAssist = indep === "heavy_ai" || indep === "copied";

  return (
    <div className="overflow-hidden rounded-lg border border-acc-robot/30">
      <div className="border-b border-acc-robot/20 bg-acc-robot/[0.06] px-4 py-2.5">
        <div className="mono-label text-acc-robot">the mastery gate — claim with evidence</div>
      </div>
      <div className="space-y-3 p-4">
        <p className="text-[13.5px] leading-relaxed text-ink">
          <span className="mono-label mr-2 text-acc-robot">gold test →</span>
          {node.masteryTest}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Evidence: repo link, derivation page, video…"
          />
          <select value={indep} onChange={(e) => setIndep(e.target.value as Independence)}>
            <option value="independent">fully independent</option>
            <option value="hints">hint-assisted</option>
            <option value="heavy_ai">heavily AI-assisted</option>
            <option value="copied">copied a solution</option>
          </select>
        </div>
        {heavyAssist && (
          <div className="text-xs text-acc-math">
            ⚠ Heavy assistance caps honest claims at Silver. Redo it independently for Gold.
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {claimable.map((t) => {
            const isGate = t === node.masteryGate;
            const current = p?.tier === t;
            const blocked = heavyAssist && tierAtLeast(t, "gold");
            return (
              <button
                key={t}
                disabled={locked || blocked}
                onClick={() => claimWithMoment(node.id, t, evidence || undefined, indep)}
                className="btn disabled:cursor-not-allowed disabled:opacity-35"
                style={
                  current
                    ? { borderColor: TIER_COLORS[t], color: TIER_COLORS[t] }
                    : isGate
                      ? { borderColor: `${TIER_COLORS[t]}88` }
                      : undefined
                }
                title={isGate ? "The gate tier for this node" : undefined}
              >
                {current ? "● " : ""}{t}{isGate ? " ▲" : ""}
              </button>
            );
          })}
        </div>
        {locked && (
          <div className="text-xs text-faint">
            Locked — clear the prerequisite gates first (or prove them via their diagnostics on the{" "}
            <Link href={`/node/${node.id}`} className="text-acc hover:underline">node page</Link>).
          </div>
        )}
      </div>
    </div>
  );
}
