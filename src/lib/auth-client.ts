"use client";

import { create } from "zustand";

export interface AuthUser {
  username: string;
  role: "admin" | "user";
}

export type AuthStatus =
  | "loading" // first /api/auth/me in flight
  | "local" // no Redis configured — browser-only mode, no accounts
  | "signedout" // accounts configured, no valid session
  | "authed";

interface AuthState {
  status: AuthStatus;
  bootstrapped: boolean; // does any account exist yet?
  user: AuthUser | null;
  error?: string;
  refresh: () => Promise<void>;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string; pending?: boolean }>;
  register: (username: string, password: string) => Promise<{ ok: boolean; error?: string; approved?: boolean }>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string; note?: string }>;
  generateRecoveryCode: () => Promise<{ ok: boolean; code?: string; error?: string }>;
  resetWithCode: (username: string, code: string, newPassword: string) => Promise<{ ok: boolean; error?: string; note?: string }>;
}

async function json<T>(res: Response): Promise<T & { error?: string }> {
  try {
    return (await res.json()) as T & { error?: string };
  } catch {
    return { error: `HTTP ${res.status}` } as T & { error?: string };
  }
}

export const useAuth = create<AuthState>((set, get) => ({
  status: "loading",
  bootstrapped: true,
  user: null,

  refresh: async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await json<{ configured: boolean; bootstrapped?: boolean; user: AuthUser | null }>(res);
      if (!data.configured) {
        set({ status: "local", user: null });
      } else {
        set({
          status: data.user ? "authed" : "signedout",
          bootstrapped: data.bootstrapped ?? true,
          user: data.user ?? null,
        });
      }
    } catch {
      // network failure: keep the app usable offline with whatever we knew
      if (get().status === "loading") set({ status: "local", user: null });
    }
  },

  login: async (username, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await json<{ ok?: boolean; user?: AuthUser; pending?: boolean }>(res);
    if (res.ok && data.user) {
      set({ status: "authed", user: data.user });
      return { ok: true };
    }
    return { ok: false, error: data.error ?? "Sign-in failed.", pending: data.pending };
  },

  register: async (username, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await json<{ ok?: boolean; approved?: boolean }>(res);
    if (res.ok && data.ok) {
      set({ bootstrapped: true });
      return { ok: true, approved: data.approved };
    }
    return { ok: false, error: data.error ?? "Registration failed." };
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    set({ status: "signedout", user: null });
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await json<{ ok?: boolean; note?: string }>(res);
    if (res.ok && data.ok) return { ok: true, note: data.note };
    return { ok: false, error: data.error ?? "Could not change password." };
  },

  generateRecoveryCode: async () => {
    const res = await fetch("/api/auth/recovery-code", { method: "POST" });
    const data = await json<{ ok?: boolean; code?: string }>(res);
    if (res.ok && data.ok && data.code) return { ok: true, code: data.code };
    return { ok: false, error: data.error ?? "Could not generate a recovery code." };
  },

  resetWithCode: async (username, code, newPassword) => {
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, code, newPassword }),
    });
    const data = await json<{ ok?: boolean; note?: string }>(res);
    if (res.ok && data.ok) return { ok: true, note: data.note };
    return { ok: false, error: data.error ?? "Reset failed." };
  },
}));
