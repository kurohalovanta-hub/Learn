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
        if (!r.ok) setMsg({ tone: "error", text: r.error ?? "That didn't work." });
        else if (r.approved) {
          const l = await auth.login(username, password);
          if (l.ok) startSync();
          else setMsg({ tone: "ok", text: "You're set up — sign in." });
        } else {
          setMsg({ tone: "ok", text: "Sent. An admin needs to let you in before you can sign in." });
          setMode("login");
        }
      } else {
        const r = await auth.login(username, password);
        if (r.ok) startSync();
        else setMsg({ tone: "error", text: r.error ?? "Wrong username or password." });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* hero — the halo, the climb */}
      <div className="relative flex min-h-[38vh] flex-1 items-end overflow-hidden lg:min-h-screen">
        <div className="halo-hero absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-bg/70 lg:to-bg" aria-hidden />
        <div className="relative z-10 max-w-xl p-8 lg:p-14">
          <div className="font-mono text-lg font-bold tracking-[0.3em] text-ink">
            HALO<span className="text-acc">{" // "}</span>VANTA
          </div>
          <h1 className="mt-4 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            One thing a day, until you can build the real thing.
          </h1>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-dim">
            A patient climb from zero to embodied-intelligence research. You prove what you know;
            a tutor that remembers you fills the gaps. No streaks, no busywork.
          </p>
        </div>
      </div>

      {/* sign-in — frosted glass over the dark */}
      <div className="flex flex-1 items-center justify-center p-6 lg:max-w-[460px]">
        <div className="w-full max-w-sm">
          <div className="halo-glass rounded-2xl p-6">
            {firstRun ? (
              <div className="mb-4">
                <div className="mono-label text-acc">you&apos;re first</div>
                <div className="mt-1 text-[16px] font-semibold">Set up your account</div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-dim">
                  Nobody&apos;s here yet, so this one runs the place. Pick a name and password you&apos;ll remember —
                  anyone who joins later waits for you to let them in.
                </p>
              </div>
            ) : (
              <div className="mb-4 flex gap-1 rounded-xl border border-line bg-panel2/60 p-1">
                {(["login", "register"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setMsg(null); }}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      mode === m ? "bg-acc/15 text-acc" : "text-dim hover:text-ink"
                    }`}
                  >
                    {m === "login" ? "Sign in" : "Join"}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-3">
              <label className="block">
                <span className="mono-label">username</span>
                <input
                  className="mt-1"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="letters, numbers, _ or -"
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
                  placeholder={mode === "register" ? "at least 8 characters" : "••••••••"}
                />
              </label>

              {msg && (
                <div
                  className="rounded-lg border px-3 py-2 text-xs"
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
                {busy ? "…" : firstRun ? "Create my account" : mode === "login" ? "Sign in" : "Ask to join"}
              </button>
            </form>
          </div>

          <div className="mt-4"><TutorStatusCard /></div>

          <p className="mt-4 text-center text-[11px] text-faint">
            Your progress and tutor chats save to your account and follow you across devices.
          </p>
        </div>
      </div>
    </div>
  );
}
