"use client";

import { useStore } from "./store";
import { useAuth } from "./auth-client";
import type { ProgressData } from "./types";

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let started = false;

async function call(method: "GET" | "PUT", body?: ProgressData) {
  const res = await fetch("/api/progress", {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 501) throw new Error("Accounts not configured on the server.");
  if (res.status === 401) {
    // session expired mid-use — surface via auth state
    useAuth.getState().refresh();
    throw new Error("Session expired — sign in again.");
  }
  if (!res.ok && res.status !== 204) throw new Error(`Sync failed: HTTP ${res.status}`);
  return res;
}

export async function pullAndMerge(): Promise<string> {
  const res = await call("GET");
  if (res.status === 204) return "No cloud data yet.";
  const remote = (await res.json()) as ProgressData | null;
  if (remote && typeof remote === "object" && remote.nodes) {
    useStore.getState().mergeRemote(remote);
    return "Merged cloud progress.";
  }
  return "No cloud data yet.";
}

export async function pushNow(): Promise<string> {
  await call("PUT", useStore.getState().exportData());
  return "Saved to cloud.";
}

function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    try {
      await pushNow();
      useStore.getState().setLastSync({ at: Date.now(), ok: true, message: "Synced" });
    } catch (e) {
      useStore.getState().setLastSync({ at: Date.now(), ok: false, message: (e as Error).message });
    }
  }, 3500);
}

/**
 * Start per-user sync once authenticated. Handles the owner contract:
 * the local cache belongs to one username; a different login resets it
 * before pulling that user's cloud copy.
 */
export function startSync() {
  if (started || typeof window === "undefined") return;
  const auth = useAuth.getState();
  if (auth.status !== "authed" || !auth.user) return;
  started = true;
  const username = auth.user.username;

  const store = useStore.getState();
  if (store.owner && store.owner !== username) {
    store.resetAll();
  }
  useStore.getState().setOwner(username);

  const tryPull = async () => {
    if (useAuth.getState().status !== "authed") return;
    try {
      const msg = await pullAndMerge();
      useStore.getState().setLastSync({ at: Date.now(), ok: true, message: msg });
    } catch (e) {
      useStore.getState().setLastSync({ at: Date.now(), ok: false, message: (e as Error).message });
    }
  };

  tryPull().then(() => {
    // ensure the server has a copy even on a fresh account
    schedulePush();
  });
  window.addEventListener("focus", tryPull);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") tryPull();
  });

  let lastRev = useStore.getState().rev;
  useStore.subscribe((state) => {
    if (state.rev !== lastRev) {
      lastRev = state.rev;
      if (useAuth.getState().status === "authed") schedulePush();
    }
  });

  try {
    navigator.storage?.persist?.();
  } catch {
    /* ignore */
  }
}

/** Allow a re-arm after logout→login as a different user. */
export function resetSyncLifecycle() {
  started = false;
  if (pushTimer) clearTimeout(pushTimer);
}
