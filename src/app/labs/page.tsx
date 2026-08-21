"use client";

import Link from "next/link";
import { useState } from "react";
import { NODES } from "@/content/nodes";
import { useStore } from "@/lib/store";
import { nodeState } from "@/lib/engine/graph";
import { Bar, Panel, StateBadge, TierBadge } from "@/components/ui";
import type { Lab } from "@/lib/types";
import { tierAtLeast } from "@/lib/types";

// The five lab lenses (HANDOVER §20) — views over the same graph.
const LABS: { key: Lab; title: string; color: string; blurb: string }[] = [
  { key: "math", title: "Math Lab", color: "#e8b34d", blurb: "Intuition → derivation → implementation → application: every mathematical idea earns rent." },
  { key: "code", title: "Code Lab", color: "#4dd6e8", blurb: "Python → NumPy → PyTorch → C++ literacy → ROS: the tooling spine." },
  { key: "robotics", title: "Robotics Lab", color: "#52d68a", blurb: "Geometry → kinematics → control → estimation → perception → planning." },
  { key: "ml", title: "ML Lab", color: "#a78bfa", blurb: "First principles → deep learning → transformers → vision → RL → generative action models." },
  { key: "embodied", title: "Embodied Intelligence Lab", color: "#f4586e", blurb: "Imitation → VLA → world models → sim-to-real → the frontier." },
];

export default function LabsPage() {
  const store = useStore();
  const [active, setActive] = useState<Lab>("embodied");
  const lab = LABS.find((l) => l.key === active)!;
  const nodes = NODES.filter((n) => n.labs.includes(active));
  const mastered = nodes.filter((n) => tierAtLeast(store.nodes[n.id]?.tier ?? "none", n.masteryGate)).length;

  return (
    <div className="space-y-5">
      <div>
        <div className="mono-label">five lenses over one graph</div>
        <h1 className="font-mono text-2xl font-bold">LABS</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {LABS.map((l) => (
          <button
            key={l.key}
            onClick={() => setActive(l.key)}
            className="btn"
            style={active === l.key ? { borderColor: l.color, color: l.color, background: `${l.color}14` } : undefined}
          >
            {l.title}
          </button>
        ))}
      </div>

      <Panel accent={lab.color}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold" style={{ color: lab.color }}>{lab.title}</div>
            <p className="text-sm text-dim">{lab.blurb}</p>
          </div>
          <div className="w-56">
            <div className="mb-1 flex justify-between font-mono text-[11px] text-faint">
              <span>{mastered}/{nodes.length} mastered</span>
              <span>{Math.round((100 * mastered) / Math.max(1, nodes.length))}%</span>
            </div>
            <Bar value={mastered / Math.max(1, nodes.length)} color={lab.color} />
          </div>
        </div>
      </Panel>

      <div className="grid gap-2 md:grid-cols-2">
        {nodes.map((n) => {
          const st = nodeState(n.id, store.nodes);
          const p = store.nodes[n.id];
          return (
            <Link key={n.id} href={`/node/${n.id}`}>
              <Panel className="hover-raise !py-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-8 shrink-0 font-mono text-[10px] text-faint">L{n.level}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px]">{n.title}</span>
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
