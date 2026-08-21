"use client";

import katex from "katex";
import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import type { NodeState, Tier } from "@/lib/types";

export function Panel({ children, className = "", accent }: { children: ReactNode; className?: string; accent?: string }) {
  return (
    <div
      className={`panel p-4 ${className}`}
      style={accent ? { borderTop: `2px solid ${accent}` } : undefined}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <div className="mono-label">{children}</div>
      {right}
    </div>
  );
}

export function Stat({ label, value, sub, accent }: { label: string; value: ReactNode; sub?: string; accent?: string }) {
  return (
    <div className="panel px-4 py-3">
      <div className="mono-label">{label}</div>
      <div className="mt-1 font-mono text-2xl font-semibold" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-dim">{sub}</div>}
    </div>
  );
}

export const TIER_COLORS: Record<Tier, string> = {
  none: "#5a6675",
  bronze: "#c98d5a",
  silver: "#aeb9c6",
  gold: "#e8b34d",
  platinum: "#8fd4e8",
  research: "#e86ea4",
};

export function TierBadge({ tier, size = "sm" }: { tier: Tier; size?: "sm" | "md" }) {
  const c = TIER_COLORS[tier];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-mono uppercase tracking-wider ${size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"}`}
      style={{ color: c, background: `${c}1a`, border: `1px solid ${c}44` }}
    >
      {tier}
    </span>
  );
}

export const STATE_META: Record<NodeState, { label: string; color: string }> = {
  locked: { label: "locked", color: "#5a6675" },
  available: { label: "available", color: "#4dd6e8" },
  learning: { label: "learning", color: "#e8b34d" },
  "review-due": { label: "review due", color: "#f2934d" },
  mastered: { label: "mastered", color: "#52d68a" },
  "research-level": { label: "research", color: "#e86ea4" },
};

export function StateBadge({ state }: { state: NodeState }) {
  const m = STATE_META[state];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
      style={{ color: m.color, background: `${m.color}14`, border: `1px solid ${m.color}40` }}
    >
      <span className={`inline-block size-1.5 rounded-full ${state === "learning" || state === "review-due" ? "pulse-dot" : ""}`} style={{ background: m.color }} />
      {m.label}
    </span>
  );
}

export function Bar({ value, color = "#4dd6e8", height = 6 }: { value: number; color?: string; height?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-full" style={{ background: "#1a2431", height }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%`, background: color }}
      />
    </div>
  );
}

export function Katex({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, { throwOnError: false, displayMode: block });
    } catch {
      return tex;
    }
  }, [tex, block]);
  return <span className={block ? "block overflow-x-auto py-1" : ""} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="panel flex flex-col items-center justify-center gap-1 border-dashed px-6 py-10 text-center">
      <div className="text-sm text-dim">{title}</div>
      {hint && <div className="text-xs text-faint">{hint}</div>}
    </div>
  );
}

export function NodePill({ id, title, state }: { id: string; title: string; state: NodeState }) {
  const m = STATE_META[state];
  return (
    <Link
      href={`/node/${id}`}
      className="hover-raise inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-1 text-xs"
      style={{ borderColor: `${m.color}40`, color: "var(--color-ink)", background: "var(--color-panel)" }}
    >
      <span className="inline-block size-1.5 shrink-0 rounded-full" style={{ background: m.color }} />
      <span className="truncate">{title}</span>
    </Link>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-line2 bg-panel2 px-1.5 py-0.5 font-mono text-[10px] text-dim">
      {children}
    </kbd>
  );
}
