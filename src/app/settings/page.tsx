"use client";

import { useRef, useState } from "react";
import { useStore, migrate } from "@/lib/store";
import { pullAndMerge, pushNow } from "@/lib/sync";
import { Panel, SectionTitle } from "@/components/ui";
import type { ProgressData } from "@/lib/types";

export default function SettingsPage() {
  const store = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [syncMsg, setSyncMsg] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(store.exportData(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ei-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as ProgressData;
        if (!data || typeof data !== "object" || !data.nodes) throw new Error("not a progress export");
        store.importData(migrate(data));
        setSyncMsg("Import complete.");
      } catch (e) {
        setSyncMsg(`Import failed: ${(e as Error).message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <div className="mono-label">configuration & data</div>
        <h1 className="font-mono text-2xl font-bold">SETTINGS</h1>
      </div>

      <Panel>
        <SectionTitle>program</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mono-label">day 1 (start date)</span>
            <input
              type="date"
              value={store.settings.startDate ?? ""}
              onChange={(e) => store.updateSettings({ startDate: e.target.value || undefined })}
              className="mt-1"
            />
          </label>
          <label className="block">
            <span className="mono-label">daily focused-hours target</span>
            <input
              type="number" min={3} max={10} step={0.5}
              value={store.settings.dailyHoursTarget}
              onChange={(e) => store.updateSettings({ dailyHoursTarget: Number(e.target.value) })}
              className="mt-1"
            />
          </label>
          <label className="block">
            <span className="mono-label">GPU tier (drives compute notes)</span>
            <select
              value={store.settings.gpuTier}
              onChange={(e) => store.updateSettings({ gpuTier: e.target.value as typeof store.settings.gpuTier })}
              className="mt-1"
            >
              <option value="none">CPU only</option>
              <option value="12">12 GB (4070-class)</option>
              <option value="16">16 GB (4080/5080)</option>
              <option value="24">24 GB (3090/4090) — recommended</option>
              <option value="32+">32 GB+ (5090+)</option>
            </select>
          </label>
          <label className="block">
            <span className="mono-label">research mode (month-7 UI)</span>
            <select
              value={store.settings.researchModeOverride == null ? "auto" : store.settings.researchModeOverride ? "on" : "off"}
              onChange={(e) => {
                const v = e.target.value;
                store.updateSettings({ researchModeOverride: v === "auto" ? undefined : v === "on" });
              }}
              className="mt-1"
            >
              <option value="auto">auto (Day ≥181 or VLA Boss)</option>
              <option value="on">force on</option>
              <option value="off">force off</option>
            </select>
          </label>
        </div>
      </Panel>

      <Panel accent="#4dd6e8">
        <SectionTitle>cross-device sync (optional)</SectionTitle>
        <p className="text-xs text-dim">
          Local-first: everything lives in this browser and in your JSON exports. To sync across devices,
          deploy with the Upstash Redis integration + a <code className="font-mono text-acc">SYNC_SECRET</code> env
          var (README → Deploy), then paste that same secret here on each device.
        </p>
        <div className="mt-2 flex gap-2">
          <input
            type="password"
            placeholder="SYNC_SECRET"
            value={store.settings.syncSecret ?? ""}
            onChange={(e) => store.updateSettings({ syncSecret: e.target.value || undefined })}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="btn" onClick={async () => { try { setSyncMsg(await pullAndMerge()); } catch (e) { setSyncMsg((e as Error).message); } }}>
            ↓ Pull & merge
          </button>
          <button className="btn" onClick={async () => { try { setSyncMsg(await pushNow()); } catch (e) { setSyncMsg((e as Error).message); } }}>
            ↑ Push now
          </button>
          {store.lastSync && (
            <span className={`self-center text-xs ${store.lastSync.ok ? "text-acc-robot" : "text-acc-frontier"}`}>
              {store.lastSync.message} · {new Date(store.lastSync.at).toLocaleTimeString()}
            </span>
          )}
        </div>
        {syncMsg && <div className="mt-2 text-xs text-dim">{syncMsg}</div>}
      </Panel>

      <Panel>
        <SectionTitle>backup / restore</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-acc" onClick={exportJson}>⬇ Export progress JSON</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>⬆ Import (merge-replace)</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
        </div>
        <p className="mt-2 text-xs text-faint">Export weekly. Browsers evict storage; the JSON file and the sync copy are your durable truth.</p>
      </Panel>

      <Panel accent="#f4586e">
        <SectionTitle>danger zone</SectionTitle>
        {!confirmReset ? (
          <button className="btn btn-danger" onClick={() => setConfirmReset(true)}>Reset ALL progress…</button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-acc-frontier">Erases every node, log, experiment and idea on this device. Export first.</span>
            <button className="btn btn-danger" onClick={() => { store.resetAll(); setConfirmReset(false); }}>Yes, erase everything</button>
            <button className="btn" onClick={() => setConfirmReset(false)}>Cancel</button>
          </div>
        )}
      </Panel>

      <div className="text-center text-[11px] text-faint">
        EMBODIED // OS · curriculum verified 2026-08-21 · content is code — see docs/ in the repo
      </div>
    </div>
  );
}
