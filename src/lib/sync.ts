"use client";

import { useStore } from "./store";
import type { ProgressData } from "./types";

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let started = false;

async function call(method: "GET" | "PUT", secret: string, body?: ProgressData) {
  const res = await fetch("/api/sync", {
    method,
    headers: {
      "x-sync-secret": secret,
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 501) throw new Error("Sync not configured on the server (see README → Deploy).");
  if (res.status === 401) throw new Error("Sync secret rejected.");
  if (!res.ok) throw new Error(`Sync failed: HTTP ${res.status}`);
  return res;
}

export async function pullAndMerge(): Promise<string> {
  const s = useStore.getState();
  const secret = s.settings.syncSecret;
  if (!secret) return "No sync secret set.";
  const res = await call("GET", secret);
  if (res.status === 204) return "No remote data yet.";
  const remote = (await res.json()) as ProgressData | null;
  if (remote && typeof remote === "object" && remote.nodes) {
    useStore.getState().mergeRemote(remote);
    return "Merged remote progress.";
  }
  return "No remote data yet.";
}

export async function pushNow(): Promise<string> {
  const s = useStore.getState();
  const secret = s.settings.syncSecret;
  if (!secret) return "No sync secret set.";
  await call("PUT", secret, s.exportData());
  return "Pushed.";
}

function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    try {
      const msg = await pushNow();
      if (msg === "Pushed.") useStore.getState().setLastSync({ at: Date.now(), ok: true, message: "Synced" });
    } catch (e) {
      useStore.getState().setLastSync({ at: Date.now(), ok: false, message: (e as Error).message });
    }
  }, 4000);
}

/** Start background sync: pull-merge on load/focus, debounced push on change. Idempotent. */
export function startSync() {
  if (started || typeof window === "undefined") return;
  started = true;

  const tryPull = async () => {
    const s = useStore.getState();
    if (!s.settings.syncSecret) return;
    try {
      const msg = await pullAndMerge();
      s.setLastSync({ at: Date.now(), ok: true, message: msg });
    } catch (e) {
      s.setLastSync({ at: Date.now(), ok: false, message: (e as Error).message });
    }
  };

  tryPull();
  window.addEventListener("focus", tryPull);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") tryPull();
  });

  let lastRev = useStore.getState().rev;
  useStore.subscribe((state) => {
    if (state.rev !== lastRev) {
      lastRev = state.rev;
      if (state.settings.syncSecret) schedulePush();
    }
  });

  // best-effort durable storage
  try {
    navigator.storage?.persist?.();
  } catch {
    /* ignore */
  }
}
