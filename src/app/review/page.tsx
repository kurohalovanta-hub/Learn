"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { reviewQueue, upcomingReviews, type ReviewOutcome } from "@/lib/engine/review";
import { EmptyState, Panel, SectionTitle } from "@/components/ui";

export default function ReviewPage() {
  const store = useStore();
  const queue = reviewQueue(store.nodes);
  const upcoming = upcomingReviews(store.nodes);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const grade = (nodeId: string, outcome: ReviewOutcome) => {
    store.reviewNode(nodeId, outcome);
    setRevealed((r) => ({ ...r, [nodeId]: false }));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <div className="mono-label">retrieval practice — closed book, then grade yourself honestly</div>
        <h1 className="font-mono text-2xl font-bold">REVIEW · {queue.length} due</h1>
        <p className="mt-1 text-xs text-faint">
          Testing yourself beats re-reading (Dunlosky et al. 2013; Make It Stick). Attempt the prompt cold — out loud
          or on paper — BEFORE revealing anything. Failing here is the system working.
        </p>
      </div>

      {queue.length === 0 ? (
        <EmptyState title="Queue clear" hint="Mastered nodes surface here on their spaced schedule." />
      ) : (
        <div className="space-y-3">
          {queue.map((item) => (
            <Panel key={item.nodeId} accent="#f2934d">
              <div className="flex items-center justify-between gap-2">
                <Link href={`/node/${item.nodeId}`} className="text-sm font-semibold hover:text-acc">{item.title}</Link>
                <span className="font-mono text-[11px] text-faint">
                  {item.overdueDays > 0 ? `${item.overdueDays}d overdue` : "due today"}
                </span>
              </div>
              <div className="mt-2 rounded-md border border-line bg-panel2 p-3 text-sm text-ink">
                {item.prompt}
              </div>
              {!revealed[item.nodeId] ? (
                <button className="btn mt-3" onClick={() => setRevealed((r) => ({ ...r, [item.nodeId]: true }))}>
                  I attempted it — grade me
                </button>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn btn-danger" onClick={() => grade(item.nodeId, "failed")}>✗ failed (1d)</button>
                  <button className="btn" onClick={() => grade(item.nodeId, "hard")}>hard</button>
                  <button className="btn" onClick={() => grade(item.nodeId, "good")}>good</button>
                  <button className="btn btn-acc" onClick={() => grade(item.nodeId, "easy")}>easy</button>
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <Panel>
          <SectionTitle>next 7 days</SectionTitle>
          <div className="space-y-1">
            {upcoming.map((u) => (
              <div key={u.nodeId} className="flex justify-between text-xs">
                <Link href={`/node/${u.nodeId}`} className="text-dim hover:text-acc">{u.title}</Link>
                <span className="font-mono text-faint">{new Date(u.due).toISOString().slice(0, 10)}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
