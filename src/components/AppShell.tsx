"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { startSync } from "@/lib/sync";
import { researchModeActive } from "@/lib/engine/scheduler";
import { dayOfProgram } from "@/lib/engine/pacing";
import { currentRank, totalXp } from "@/lib/engine/mastery";
import { SearchPalette } from "./SearchPalette";

const NAV: { href: string; label: string; icon: string; section?: string }[] = [
  { href: "/", label: "Dashboard", icon: "◉" },
  { href: "/today", label: "Today", icon: "▶" },
  { href: "/tree", label: "Skill Tree", icon: "⬡" },
  { href: "/levels", label: "Levels", icon: "☰" },
  { href: "/projects", label: "Projects", icon: "⚒" },
  { href: "/bosses", label: "Boss Fights", icon: "◆" },
  { href: "/papers", label: "Paper Room", icon: "¶", section: "research" },
  { href: "/experiments", label: "Experiments", icon: "Σ" },
  { href: "/ideas", label: "Idea Inbox", icon: "✦" },
  { href: "/frontier", label: "Frontier", icon: "⇗" },
  { href: "/labs", label: "Labs", icon: "⊞", section: "system" },
  { href: "/review", label: "Review", icon: "↻" },
  { href: "/weekly", label: "Weekly", icon: "⑦" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hydrated = useStore((s) => s.hydrated);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);
  useEffect(() => {
    if (hydrated) startSync();
  }, [hydrated]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar pathname={pathname} onSearch={() => setPaletteOpen(true)} />
      <main className="min-w-0 flex-1 px-6 py-6 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          {hydrated ? children : <BootScreen />}
        </div>
      </main>
      {paletteOpen && <SearchPalette onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}

function BootScreen() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="font-mono text-sm tracking-[0.3em] text-dim">EMBODIED // OS</div>
        <div className="mt-2 font-mono text-xs text-faint">loading progress…</div>
      </div>
    </div>
  );
}

function Sidebar({ pathname, onSearch }: { pathname: string; onSearch: () => void }) {
  const store = useStore();
  const data = store.exportData();
  const day = store.hydrated ? dayOfProgram(data.settings) : null;
  const research = store.hydrated && researchModeActive(data);
  const rank = store.hydrated ? currentRank(data.nodes) : null;
  const xp = store.hydrated ? totalXp(data.nodes) : 0;

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-panel/60 backdrop-blur md:flex">
      <div className="border-b border-line px-5 py-5">
        <Link href="/" className="block">
          <div className="font-mono text-[13px] font-bold tracking-[0.25em] text-ink">
            EMBODIED<span className="text-acc">{" // "}</span>OS
          </div>
          <div className="mt-1 text-[11px] text-faint">zero → researcher · 210 days</div>
        </Link>
        <div className="mt-3 flex items-center gap-2 font-mono text-[11px]">
          <span className={`rounded px-1.5 py-0.5 ${research ? "bg-acc-frontier/15 text-acc-frontier" : "bg-acc/10 text-acc"}`}>
            {research ? "RESEARCH MODE" : day ? `DAY ${Math.min(day, 210)}/210` : "DAY 0"}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <div key={item.href}>
              {item.section && <div className="mono-label mt-4 mb-1 px-2">{item.section}</div>}
              <Link
                href={item.href}
                className={`mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                  active ? "bg-acc/10 text-acc" : "text-dim hover:bg-panel2 hover:text-ink"
                }`}
              >
                <span className="w-4 text-center font-mono text-xs opacity-80">{item.icon}</span>
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-line px-5 py-4">
        <button onClick={onSearch} className="mb-3 flex w-full items-center justify-between rounded-md border border-line bg-panel2 px-2.5 py-1.5 text-xs text-faint hover:border-line2">
          <span>Search…</span>
          <kbd className="rounded border border-line2 px-1 font-mono text-[10px]">/</kbd>
        </button>
        {rank && (
          <div>
            <div className="mono-label">rank {rank.index}</div>
            <div className="text-[13px] font-medium text-ink">{rank.title}</div>
            <div className="mt-1 font-mono text-[11px] text-acc-math">{xp.toLocaleString()} XP</div>
          </div>
        )}
      </div>
    </aside>
  );
}
