"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { TEMPLATES } from "@/content/templates";
import { EmptyState, Panel, SectionTitle } from "@/components/ui";
import type { ExperimentRecord } from "@/lib/types";

const STATUS_COLOR: Record<ExperimentRecord["status"], string> = {
  planned: "#4dd6e8", running: "#e8b34d", done: "#52d68a", negative: "#a78bfa", abandoned: "#5a6675",
};

const FIELDS: { key: keyof ExperimentRecord; label: string; area?: boolean; ph: string }[] = [
  { key: "hypothesis", label: "Hypothesis (falsifiable)", area: true, ph: "If I change X, metric Y will move by Z because…" },
  { key: "baseline", label: "Baseline", ph: "What existing method / whose code / what scale" },
  { key: "independentVar", label: "Independent variable", ph: "The ONE thing changed" },
  { key: "dependentVar", label: "Dependent variable", ph: "Exactly what is measured (episodes, seeds)" },
  { key: "controls", label: "Controls", ph: "What stays constant" },
  { key: "seeds", label: "Seeds / variance plan", ph: "e.g. 3 seeds × 50 episodes, Wilson CIs" },
  { key: "commit", label: "Code commit", ph: "hash" },
  { key: "config", label: "Config", ph: "path or inline diff" },
  { key: "dataset", label: "Dataset", ph: "id + version" },
  { key: "metrics", label: "Metrics", ph: "success rate, return, …" },
  { key: "result", label: "Result", area: true, ph: "Numbers + curves; surprises" },
  { key: "conclusion", label: "Conclusion", area: true, ph: "What the evidence supports (and doesn't)" },
  { key: "next", label: "Next experiment", ph: "What this result implies" },
];

export default function ExperimentsPage() {
  const store = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const experiments = [...store.experiments].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mono-label">pre-register → run → log → decide</div>
          <h1 className="font-mono text-2xl font-bold">EXPERIMENT TRACKER</h1>
        </div>
        <button
          className="btn btn-acc"
          onClick={() => {
            store.upsertExperiment({ title: "Untitled experiment" });
          }}
        >
          + New experiment
        </button>
      </div>

      {experiments.length === 0 ? (
        <EmptyState title="No experiments yet" hint="Every run without a pre-registered plan is a vibe, not evidence." />
      ) : (
        <div className="space-y-3">
          {experiments.map((e) => (
            <Panel key={e.id}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: STATUS_COLOR[e.status] }} />
                <input
                  className="!w-auto min-w-0 flex-1 !border-0 !bg-transparent !p-0 text-[15px] font-semibold"
                  value={e.title}
                  onChange={(ev) => store.upsertExperiment({ id: e.id, title: ev.target.value })}
                />
                <select
                  value={e.status}
                  onChange={(ev) => store.upsertExperiment({ id: e.id, status: ev.target.value as ExperimentRecord["status"] })}
                  className="!w-auto !py-1 text-xs"
                >
                  {Object.keys(STATUS_COLOR).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn !py-1 text-xs" onClick={() => setOpenId(openId === e.id ? null : e.id)}>
                  {openId === e.id ? "close" : "open"}
                </button>
                <button className="btn btn-danger !py-1 text-xs" onClick={() => store.deleteExperiment(e.id)}>×</button>
              </div>
              {openId === e.id && (
                <div className="mt-3 grid gap-3 border-t border-line pt-3 md:grid-cols-2">
                  {FIELDS.map((f) => (
                    <div key={f.key} className={f.area ? "md:col-span-2" : ""}>
                      <div className="mono-label mb-1">{f.label}</div>
                      {f.area ? (
                        <textarea
                          rows={2}
                          value={(e[f.key] as string) ?? ""}
                          placeholder={f.ph}
                          onChange={(ev) => store.upsertExperiment({ id: e.id, [f.key]: ev.target.value })}
                          className="text-[13px]"
                        />
                      ) : (
                        <input
                          value={(e[f.key] as string) ?? ""}
                          placeholder={f.ph}
                          onChange={(ev) => store.upsertExperiment({ id: e.id, [f.key]: ev.target.value })}
                          className="text-[13px]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}

      <Panel>
        <SectionTitle>templates (HANDOVER §19)</SectionTitle>
        <div className="grid gap-3 md:grid-cols-2">
          {TEMPLATES.map((t) => (
            <details key={t.id} className="rounded-md border border-line bg-panel2 p-3">
              <summary className="cursor-pointer text-sm font-medium hover:text-acc">{t.title}</summary>
              <p className="mt-1 text-xs text-faint">{t.description}</p>
              <ul className="mt-2 space-y-0.5">
                {t.fields.map((f, i) => <li key={i} className="text-xs text-dim">▸ {f}</li>)}
              </ul>
            </details>
          ))}
        </div>
      </Panel>
    </div>
  );
}
