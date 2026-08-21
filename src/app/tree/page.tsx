"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { NODES } from "@/content/nodes";
import { LEVELS } from "@/content/levels";
import { graphLayout, nodeState } from "@/lib/engine/graph";
import { useStore } from "@/lib/store";
import { STATE_META } from "@/components/ui";
import type { NodeState } from "@/lib/types";

const NODE_W = 200;
const NODE_H = 64;

export default function TreePage() {
  const nodes = useStore((s) => s.nodes);
  const router = useRouter();
  const layout = graphLayout();
  const [view, setView] = useState({ x: -20, y: 0, k: 0.85 });
  const [hover, setHover] = useState<string | null>(null);
  const dragging = useRef<{ px: number; py: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const states = useMemo(() => {
    const m = new Map<string, NodeState>();
    for (const n of NODES) m.set(n.id, nodeState(n.id, nodes));
    return m;
  }, [nodes]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of states.values()) c[s] = (c[s] ?? 0) + 1;
    return c;
  }, [states]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    setView((v) => {
      const k = Math.min(2.2, Math.max(0.3, v.k * factor));
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return { ...v, k };
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      // zoom toward cursor
      const wx = (mx - v.x) / v.k;
      const wy = (my - v.y) / v.k;
      return { k, x: mx - wx * k, y: my - wy * k };
    });
  }, []);

  const edges = useMemo(() => {
    const out: { from: string; to: string; gold: boolean }[] = [];
    for (const n of NODES) {
      for (const p of n.prereqs) out.push({ from: p.id, to: n.id, gold: p.tier === "gold" });
    }
    return out;
  }, []);

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mono-label">dependency graph</div>
          <h1 className="font-mono text-xl font-bold">SKILL TREE</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {(Object.keys(STATE_META) as NodeState[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-[11px] text-dim">
              <span className="size-2 rounded-full" style={{ background: STATE_META[s].color }} />
              {STATE_META[s].label} <span className="font-mono text-faint">{counts[s] ?? 0}</span>
            </span>
          ))}
          <span className="text-[11px] text-faint">scroll = zoom · drag = pan</span>
        </div>
      </div>

      <div className="grid-backdrop panel relative flex-1 overflow-hidden !bg-bg">
        <svg
          ref={svgRef}
          className="h-full w-full cursor-grab active:cursor-grabbing"
          onWheel={onWheel}
          onPointerDown={(e) => {
            dragging.current = { px: e.clientX, py: e.clientY };
            (e.target as Element).setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            const dx = e.clientX - dragging.current.px;
            const dy = e.clientY - dragging.current.py;
            dragging.current = { px: e.clientX, py: e.clientY };
            setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
          }}
          onPointerUp={() => (dragging.current = null)}
          onPointerLeave={() => (dragging.current = null)}
        >
          <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            {/* level bands */}
            {LEVELS.map((l) => (
              <g key={l.id}>
                <rect x={l.id * 240 + 44} y={8} width={232} height={layout.height} fill={l.id % 2 ? "#ffffff03" : "transparent"} />
                <text x={l.id * 240 + 60} y={40} fill={l.accent} fontSize={13} fontFamily="var(--font-mono)" fontWeight={700}>
                  L{l.id}
                </text>
                <text x={l.id * 240 + 92} y={40} fill="#5a6675" fontSize={10.5} fontFamily="var(--font-mono)">
                  {l.codename}
                </text>
              </g>
            ))}

            {/* edges */}
            {edges.map((e, i) => {
              const a = layout.nodes.get(e.from);
              const b = layout.nodes.get(e.to);
              if (!a || !b) return null;
              const x1 = a.x + NODE_W;
              const y1 = a.y + NODE_H / 2;
              const x2 = b.x;
              const y2 = b.y + NODE_H / 2;
              const mid = (x1 + x2) / 2;
              const related = hover === e.from || hover === e.to;
              const done = states.get(e.from) === "mastered" || states.get(e.from) === "research-level";
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={related ? "#4dd6e8" : done ? "#52d68a55" : e.gold ? "#e8b34d33" : "#2a364677"}
                  strokeWidth={related ? 2 : 1.2}
                  strokeDasharray={e.gold && !related ? "5 3" : undefined}
                />
              );
            })}

            {/* nodes */}
            {NODES.map((n) => {
              const pos = layout.nodes.get(n.id)!;
              const st = states.get(n.id)!;
              const c = STATE_META[st].color;
              const isHover = hover === n.id;
              const locked = st === "locked";
              return (
                <g
                  key={n.id}
                  transform={`translate(${pos.x},${pos.y})`}
                  className="cursor-pointer"
                  onPointerEnter={() => setHover(n.id)}
                  onPointerLeave={() => setHover(null)}
                  onClick={() => router.push(`/node/${n.id}`)}
                  opacity={locked && !isHover ? 0.55 : 1}
                >
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx={8}
                    fill={isHover ? "#131a24" : "#0f141c"}
                    stroke={isHover ? "#4dd6e8" : `${c}66`}
                    strokeWidth={isHover ? 1.6 : 1}
                  />
                  <rect width={3} height={NODE_H} rx={1.5} fill={c} />
                  <circle cx={NODE_W - 14} cy={14} r={4} fill={c} />
                  <text x={12} y={22} fill="#d7dfe9" fontSize={11.5} fontWeight={600} fontFamily="var(--font-sans)">
                    {n.title.length > 28 ? n.title.slice(0, 27) + "…" : n.title}
                  </text>
                  <text x={12} y={40} fill="#5a6675" fontSize={9.5} fontFamily="var(--font-mono)">
                    {n.track.toUpperCase()} · {n.hours}h {n.optional ? "· STRETCH" : ""}
                  </text>
                  <text x={12} y={54} fill="#46536e" fontSize={9} fontFamily="var(--font-mono)">
                    gate: {n.masteryGate}{n.id.startsWith("boss-") ? " · BOSS" : ""}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
