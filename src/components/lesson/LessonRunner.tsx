"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lesson } from "@/lib/lesson-types";
import { DEPTH_COLORS } from "@/lib/lesson-types";
import { NODE_MAP } from "@/content/nodes";
import { levelById } from "@/content/levels";
import { useStore } from "@/lib/store";
import { BlockRenderer } from "./blocks";

export function LessonRunner({ lesson }: { lesson: Lesson }) {
  const node = NODE_MAP.get(lesson.nodeId)!;
  const level = levelById(node.level);
  const router = useRouter();
  const store = useStore();
  const total = lesson.sections.length;

  const [idx, setIdx] = useState(() => {
    const saved = useStore.getState().lessons[lesson.nodeId]?.section ?? 0;
    return Math.min(saved, total - 1);
  });
  const [railOpen, setRailOpen] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const section = lesson.sections[idx];
  const masteryIdx = useMemo(
    () => lesson.sections.findIndex((s) => s.blocks.some((b) => b.kind === "mastery")),
    [lesson.sections],
  );
  const checks = store.lessons[lesson.nodeId]?.checks ?? {};
  const checksDone = Object.keys(checks).length;
  const exitHref = `/node/${lesson.nodeId}`;

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setIdx(clamped);
      useStore.getState().setLessonPosition(lesson.nodeId, clamped);
      if (clamped === total - 1) useStore.getState().completeLesson(lesson.nodeId);
      scrollRef.current?.scrollTo({ top: 0 });
    },
    [lesson.nodeId, total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if (e.key === "ArrowRight" || e.key === "j") go(idx + 1);
      else if (e.key === "ArrowLeft" || e.key === "k") go(idx - 1);
      else if (e.key === "Escape") router.push(exitHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, go, router, exitHref]);

  return (
    <div className="flex h-dvh flex-col bg-bg">
      {/* header */}
      <header className="flex items-center gap-2 border-b border-line bg-panel/70 px-3 py-2 backdrop-blur sm:px-4">
        <Link href={exitHref} aria-label="Exit lesson" className="btn btn-ghost !min-h-[40px] !px-3">
          ✕
        </Link>
        <button
          className="btn btn-ghost hidden !min-h-[40px] !px-3 font-mono text-xs lg:hidden"
          onClick={() => setRailOpen(true)}
        >
          ☰
        </button>
        <div className="min-w-0 flex-1">
          <div className="mono-label truncate" style={{ color: level.accent }}>
            L{node.level} · {node.title}
          </div>
          <div className="truncate text-[13px] font-semibold sm:text-sm">{lesson.title}</div>
        </div>
        {checksDone > 0 && (
          <span className="hidden font-mono text-[10.5px] text-faint sm:block">
            {Object.values(checks).filter((c) => c === "got").length}/{checksDone} checks ✓
          </span>
        )}
        {masteryIdx >= 0 && idx < masteryIdx && (
          <button className="btn !min-h-[36px] !py-1 text-[11.5px]" onClick={() => go(masteryIdx)}>
            Attempt mastery ⤓
          </button>
        )}
      </header>

      <div className="flex min-h-0 flex-1">
        {/* desktop rail */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-line bg-panel/40 px-3 py-4 lg:block">
          <SectionRail lesson={lesson} idx={idx} go={go} checks={checks} />
        </aside>

        {/* content */}
        <div
          ref={scrollRef}
          className="min-w-0 flex-1 overflow-y-auto"
          onTouchStart={(e) => {
            touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={(e) => {
            if (!touch.current) return;
            const dx = e.changedTouches[0].clientX - touch.current.x;
            const dy = e.changedTouches[0].clientY - touch.current.y;
            touch.current = null;
            if (Math.abs(dx) > 70 && Math.abs(dy) < 50) go(idx + (dx < 0 ? 1 : -1));
          }}
        >
          <div key={section.id} className="rise-in mx-auto max-w-2xl px-4 py-6 pb-28 sm:px-6 sm:py-8">
            <div className="mb-5">
              <div className="mono-label" style={{ color: DEPTH_COLORS[section.depth] }}>
                {String(idx + 1).padStart(2, "0")} · {section.depth}
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{section.title}</h2>
            </div>
            <div className="space-y-5">
              {section.blocks.map((b, i) => (
                <BlockRenderer key={i} block={b} node={node} sectionId={section.id} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* footer nav */}
      <footer className="safe-bottom border-t border-line bg-panel/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-2.5">
          <button
            className="btn !min-h-[42px] disabled:opacity-30"
            disabled={idx === 0}
            onClick={() => go(idx - 1)}
            aria-label="Previous section"
          >
            ← <span className="hidden sm:inline">Prev</span>
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex h-1.5 overflow-hidden rounded-full bg-[#1a2431]">
              {lesson.sections.map((s, i) => (
                <button
                  key={s.id}
                  aria-label={`Go to section ${i + 1}: ${s.title}`}
                  onClick={() => go(i)}
                  className="h-full flex-1 border-r border-bg/60 transition-colors last:border-0"
                  style={{ background: i <= idx ? DEPTH_COLORS[s.depth] : "transparent" }}
                />
              ))}
            </div>
            <div className="mt-1 truncate text-center font-mono text-[10px] text-faint">
              {idx + 1} / {total} · {section.title}
            </div>
          </div>
          {idx < total - 1 ? (
            <button className="btn btn-acc !min-h-[42px]" onClick={() => go(idx + 1)} aria-label="Next section">
              <span className="hidden sm:inline">Next</span> →
            </button>
          ) : (
            <Link href={exitHref} className="btn btn-acc !min-h-[42px]">
              Finish ✓
            </Link>
          )}
        </div>
      </footer>

      {/* mobile rail drawer */}
      {railOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal>
          <div className="fade-in absolute inset-0 bg-black/60" onClick={() => setRailOpen(false)} />
          <div className="rise-in absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto border-r border-line bg-panel px-3 py-4">
            <SectionRail lesson={lesson} idx={idx} go={(i) => { go(i); setRailOpen(false); }} checks={checks} />
          </div>
        </div>
      )}
    </div>
  );
}

function SectionRail({
  lesson, idx, go, checks,
}: {
  lesson: Lesson;
  idx: number;
  go: (i: number) => void;
  checks: Record<string, "got" | "missed">;
}) {
  return (
    <div>
      <div className="mono-label mb-2 px-2">{lesson.minutes} min · {lesson.sections.length} sections</div>
      {lesson.sections.map((s, i) => {
        const sectionChecks = Object.entries(checks).filter(([k]) => k.startsWith(`${s.id}:`));
        const got = sectionChecks.filter(([, v]) => v === "got").length;
        return (
          <button
            key={s.id}
            onClick={() => go(i)}
            className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] transition-colors ${
              i === idx ? "bg-panel2 text-ink" : "text-dim hover:bg-panel2/60 hover:text-ink"
            }`}
          >
            <span
              className="h-4 w-1 shrink-0 rounded-full"
              style={{ background: DEPTH_COLORS[s.depth], opacity: i <= idx ? 1 : 0.35 }}
            />
            <span className="min-w-0 flex-1 truncate">{s.title}</span>
            {sectionChecks.length > 0 && (
              <span className="font-mono text-[9.5px] text-faint">{got}/{sectionChecks.length}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
