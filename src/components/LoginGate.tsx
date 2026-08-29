"use client";

import { useState } from "react";
import { TutorStatusCard } from "@/components/tutor/TutorStatusCard";
import { useAuth } from "@/lib/auth-client";
import { startSync } from "@/lib/sync";

export function LoginGate() {
  const auth = useAuth();
  const firstRun = !auth.bootstrapped;
  const [mode, setMode] = useState<"login" | "register">(firstRun ? "register" : "login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "error" | "ok"; text: string } | null>(null);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "register") {
        const r = await auth.register(username, password);
        if (!r.ok) setMsg({ tone: "error", text: r.error ?? "Registration failed." });
        else if (r.approved) {
          const l = await auth.login(username, password);
          if (l.ok) startSync();
          else setMsg({ tone: "ok", text: "Admin account created — sign in." });
        } else {
          setMsg({ tone: "ok", text: "Request submitted. An administrator must approve your account before you can sign in." });
          setMode("login");
        }
      } else {
        const r = await auth.login(username, password);
        if (r.ok) startSync();
        else setMsg({ tone: "error", text: r.error ?? "Sign-in failed." });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid-backdrop flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-mono text-lg font-bold tracking-[0.3em] text-ink">
            HALO<span className="text-acc">{" // "}</span>VANTA
          </div>
          <div className="mt-2 text-xs text-faint">
            PROJECT : VANTA HALO — the ascent to embodied-intelligence research
          </div>
        </div>

        <div className="panel p-5" style={{ borderTop: "2px solid var(--acc-code)" }}>
          {firstRun ? (
            <div className="mb-4">
              <div className="mono-label text-acc">first boot</div>
              <div className="mt-1 text-[15px] font-semibold">Commission this system</div>
              <p className="mt-1 text-xs text-dim">
                No accounts exist yet. The first account becomes the <b className="text-ink">administrator</b>;
                everyone after that needs your approval.
              </p>
            </div>
          ) : (
            <div className="mb-4 flex gap-1 rounded-lg border border-line bg-panel2 p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setMsg(null); }}
                  className={`flex-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    mode === m ? "bg-acc/15 text-acc" : "text-dim hover:text-ink"
                  }`}
                >
                  {m === "login" ? "Sign in" : "Request access"}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); submit(); }}
            className="space-y-3"
          >
            <label className="block">
              <span className="mono-label">username</span>
              <input
                className="mt-1"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="a–z, 0–9, _ or -"
              />
            </label>
            <label className="block">
              <span className="mono-label">password</span>
              <input
                className="mt-1"
                type="password"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "min 8 characters" : "••••••••"}
              />
            </label>

            {msg && (
              <div
                className="rounded-md border px-3 py-2 text-xs"
                style={{
                  borderColor: msg.tone === "error" ? "#f4586e55" : "#52d68a55",
                  color: msg.tone === "error" ? "#f58a99" : "#7de0a8",
                }}
              >
                {msg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={busy || !username || !password}
              className="btn btn-acc w-full justify-center !py-2.5 disabled:opacity-40"
            >
              {busy ? "…" : firstRun ? "Create admin account" : mode === "login" ? "Sign in" : "Request access"}
            </button>
          </form>
        </div>

        <div className="mt-4"><TutorStatusCard /></div>

        <p className="mt-4 text-center text-[11px] text-faint">
          Progress is stored per account and synced across your devices — tutor chats included.
        </p>
      </div>
    </div>
  );
}
