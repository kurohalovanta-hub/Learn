"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { NODES } from "@/content/nodes";
import { PAPERS } from "@/content/papers";
import { PROJECTS } from "@/content/projects";
import { RESOURCES } from "@/content/resources";

interface Hit {
  kind: "node" | "paper" | "project" | "resource";
  id: string;
  title: string;
  sub: string;
  href: string;
}

const INDEX: Hit[] = [
  ...NODES.map((n) => ({ kind: "node" as const, id: n.id, title: n.title, sub: `L${n.level} · ${n.track}`, href: `/node/${n.id}` })),
  ...PAPERS.map((p) => ({ kind: "paper" as const, id: p.id, title: p.title, sub: `${p.year} · ${p.verdict}`, href: `/papers?focus=${p.id}` })),
  ...PROJECTS.map((p) => ({ kind: "project" as const, id: p.id, title: `P${p.num} · ${p.title}`, sub: "project", href: `/projects?focus=${p.id}` })),
  ...RESOURCES.map((r) => ({ kind: "resource" as const, id: r.id, title: r.title, sub: `${r.role} · ${r.authors}`, href: r.url })),
];

const KIND_COLOR: Record<Hit["kind"], string> = {
  node: "#4dd6e8",
  paper: "#a78bfa",
  project: "#52d68a",
  resource: "#e8b34d",
};

export function SearchPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const hits = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return INDEX.slice(0, 12);
    return INDEX.filter((h) => {
      const hay = `${h.title} ${h.sub} ${h.id}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    }).slice(0, 12);
  }, [q]);

  const go = (h: Hit) => {
    onClose();
    if (h.kind === "resource") window.open(h.href, "_blank", "noopener");
    else router.push(h.href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div className="panel w-full max-w-xl overflow-hidden p-0" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter" && hits[sel]) go(hits[sel]);
          }}
          placeholder="Search nodes, papers, projects, resources…"
          className="!rounded-none !border-0 !border-b !border-line !bg-panel px-4 py-3.5 text-sm"
        />
        <div className="max-h-[50vh] overflow-y-auto p-1.5">
          {hits.map((h, i) => (
            <button
              key={`${h.kind}-${h.id}`}
              onMouseEnter={() => setSel(i)}
              onClick={() => go(h)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left ${i === sel ? "bg-panel2" : ""}`}
            >
              <span className="w-16 shrink-0 rounded px-1 py-0.5 text-center font-mono text-[9.5px] uppercase tracking-wider"
                style={{ color: KIND_COLOR[h.kind], background: `${KIND_COLOR[h.kind]}14` }}>
                {h.kind}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] text-ink">{h.title}</span>
                <span className="block truncate text-[11px] text-faint">{h.sub}</span>
              </span>
            </button>
          ))}
          {hits.length === 0 && <div className="px-3 py-6 text-center text-sm text-faint">No matches.</div>}
        </div>
      </div>
    </div>
  );
}
