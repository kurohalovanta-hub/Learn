"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Katex } from "../ui";

/* ── layout ───────────────────────────────────────────────────────── */

/** Canvas + controls; stacks on mobile, splits on wide screens. */
export function WidgetShell({
  canvas, controls, wide,
}: {
  canvas: ReactNode;
  controls?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 ${wide ? "" : "md:flex-row"}`}>
      <div className={`min-w-0 ${wide ? "" : "md:flex-[1.6]"}`}>{canvas}</div>
      {controls && <div className={`min-w-0 space-y-2.5 ${wide ? "" : "md:flex-1"}`}>{controls}</div>}
    </div>
  );
}

export function Slider({
  label, value, min, max, step = 0.01, onChange, fmt, color = "#4dd6e8", tex,
}: {
  label?: string;
  tex?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  fmt?: (v: number) => string;
  color?: string;
}) {
  return (
    <label className="block">
      <div className="mb-0.5 flex items-baseline justify-between">
        <span className="font-mono text-[11px] text-dim">
          {tex ? <Katex tex={tex} /> : label}
        </span>
        <span className="font-mono text-[11.5px]" style={{ color }}>
          {fmt ? fmt(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        aria-label={label ?? tex}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: color }}
      />
    </label>
  );
}

export function Readout({ items }: { items: { label: string; value: ReactNode; color?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it, i) => (
        <span
          key={i}
          className="inline-flex items-baseline gap-1.5 rounded-md border border-line bg-panel2/80 px-2 py-1 font-mono text-[11px]"
        >
          <span className="text-faint">{it.label}</span>
          <span style={{ color: it.color ?? "var(--color-ink)" }}>{it.value}</span>
        </span>
      ))}
    </div>
  );
}

export function WBtn({ children, onClick, active, color = "#4dd6e8", disabled }: {
  children: ReactNode; onClick: () => void; active?: boolean; color?: string; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border px-2.5 py-1.5 font-mono text-[11.5px] transition-colors disabled:opacity-35"
      style={{
        borderColor: active ? `${color}88` : "var(--color-line2)",
        background: active ? `${color}16` : "var(--color-panel2)",
        color: active ? color : "var(--color-dim)",
      }}
    >
      {children}
    </button>
  );
}

/* ── world↔screen mapping for SVG scenes ─────────────────────────── */

export interface View {
  w: number; // viewBox width px
  h: number;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

export class Mapper {
  constructor(public v: View) {}
  sx = (x: number) => ((x - this.v.xmin) / (this.v.xmax - this.v.xmin)) * this.v.w;
  sy = (y: number) => this.v.h - ((y - this.v.ymin) / (this.v.ymax - this.v.ymin)) * this.v.h;
  wx = (px: number) => this.v.xmin + (px / this.v.w) * (this.v.xmax - this.v.xmin);
  wy = (py: number) => this.v.ymin + ((this.v.h - py) / this.v.h) * (this.v.ymax - this.v.ymin);
  /** scale for x-lengths (px per world unit) */
  kx = () => this.v.w / (this.v.xmax - this.v.xmin);
}

/** Converts a pointer event into world coords for an <svg> with a viewBox. */
export function eventWorld(e: { clientX: number; clientY: number }, svg: SVGSVGElement, m: Mapper) {
  const r = svg.getBoundingClientRect();
  const px = ((e.clientX - r.left) / r.width) * m.v.w;
  const py = ((e.clientY - r.top) / r.height) * m.v.h;
  return { x: m.wx(px), y: m.wy(py) };
}

/** Grid + axes for math scenes. */
export function Axes({ m, step = 1, labels = true }: { m: Mapper; step?: number; labels?: boolean }) {
  const lines: ReactNode[] = [];
  const { xmin, xmax, ymin, ymax } = m.v;
  for (let x = Math.ceil(xmin / step) * step; x <= xmax; x += step) {
    lines.push(
      <line key={`vx${x}`} x1={m.sx(x)} y1={0} x2={m.sx(x)} y2={m.v.h}
        stroke={Math.abs(x) < 1e-9 ? "#31415566" : "#1b263422"} strokeWidth={Math.abs(x) < 1e-9 ? 1.4 : 1} />,
    );
  }
  for (let y = Math.ceil(ymin / step) * step; y <= ymax; y += step) {
    lines.push(
      <line key={`hy${y}`} x1={0} y1={m.sy(y)} x2={m.v.w} y2={m.sy(y)}
        stroke={Math.abs(y) < 1e-9 ? "#31415566" : "#1b263422"} strokeWidth={Math.abs(y) < 1e-9 ? 1.4 : 1} />,
    );
  }
  return (
    <g>
      {lines}
      {labels && (
        <>
          <text x={m.sx(xmax) - 12} y={m.sy(0) - 6} fill="#3d4a5c" fontSize={10} fontFamily="var(--font-mono)">x</text>
          <text x={m.sx(0) + 6} y={12} fill="#3d4a5c" fontSize={10} fontFamily="var(--font-mono)">y</text>
        </>
      )}
    </g>
  );
}

/** Arrow with head, world coords. */
export function Arrow({
  m, from, to, color, width = 2.2, label, dash,
}: {
  m: Mapper;
  from: [number, number];
  to: [number, number];
  color: string;
  width?: number;
  label?: string;
  dash?: string;
}) {
  const x1 = m.sx(from[0]); const y1 = m.sy(from[1]);
  const x2 = m.sx(to[0]); const y2 = m.sy(to[1]);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hl = 9;
  const hx = x2 - hl * Math.cos(ang);
  const hy = y2 - hl * Math.sin(ang);
  return (
    <g>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={width} strokeDasharray={dash} />
      <polygon
        points={`${x2},${y2} ${x2 - hl * Math.cos(ang - 0.42)},${y2 - hl * Math.sin(ang - 0.42)} ${x2 - hl * Math.cos(ang + 0.42)},${y2 - hl * Math.sin(ang + 0.42)}`}
        fill={color}
      />
      {label && (
        <text
          x={x2 + 10 * Math.cos(ang)} y={y2 + 10 * Math.sin(ang)}
          fill={color} fontSize={12.5} fontFamily="var(--font-mono)" fontWeight={700}
          textAnchor="middle" dominantBaseline="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

/** Draggable handle (pointer events, touch-friendly hit area). */
export function Handle({
  m, at, color, onDrag, svgRef, r = 7,
}: {
  m: Mapper;
  at: [number, number];
  color: string;
  onDrag: (x: number, y: number) => void;
  svgRef: RefObject<SVGSVGElement | null>;
  r?: number;
}) {
  const dragging = useRef(false);
  return (
    <g
      style={{ cursor: "grab", touchAction: "none" }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging.current || !svgRef.current) return;
        const p = eventWorld(e, svgRef.current, m);
        onDrag(p.x, p.y);
      }}
      onPointerUp={() => (dragging.current = false)}
    >
      <circle cx={m.sx(at[0])} cy={m.sy(at[1])} r={16} fill="transparent" />
      <circle cx={m.sx(at[0])} cy={m.sy(at[1])} r={r} fill={color} stroke="#0a0e14" strokeWidth={2} />
    </g>
  );
}

/* ── animation ────────────────────────────────────────────────────── */
export function useRaf(cb: (dt: number) => void, running: boolean) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });
  useEffect(() => {
    if (!running) return;
    let id = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      cbRef.current(dt);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [running]);
}

export function usePlayback(initial = false) {
  const [playing, setPlaying] = useState(initial);
  const toggle = useCallback(() => setPlaying((p) => !p), []);
  return { playing, setPlaying, toggle };
}

export const fmt2 = (v: number) => v.toFixed(2);
export const fmt1 = (v: number) => v.toFixed(1);
export const fmt0 = (v: number) => v.toFixed(0);
export const fmtDeg = (v: number) => `${((v * 180) / Math.PI).toFixed(0)}°`;
