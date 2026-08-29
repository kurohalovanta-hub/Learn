"use client";

// Tutor connection status — shown on first run and in Settings, so "is my
// tutor alive?" is never a mystery. A website cannot OAuth into a Claude
// subscription; this card says exactly what IS connected and how to connect.

import { useCallback, useEffect, useState } from "react";

type Status =
  | { state: "checking" }
  | { state: "connected"; backend: "cli" | "api" }
  | { state: "off"; reason: "no-key" | "needs-accounts" };

export function TutorStatusCard() {
  const [status, setStatus] = useState<Status>({ state: "checking" });

  // state changes happen only in async continuations (hooks-compiler safe)
  const check = useCallback(() => {
    fetch("/api/tutor")
      .then((r) => r.json())
      .then((j: { available?: boolean; reason?: string; backend?: "cli" | "api" }) => {
        setStatus(
          j.available
            ? { state: "connected", backend: j.backend === "cli" ? "cli" : "api" }
            : { state: "off", reason: j.reason === "needs-accounts" ? "needs-accounts" : "no-key" },
        );
      })
      .catch(() => setStatus({ state: "off", reason: "no-key" }));
  }, []);

  useEffect(() => { check(); }, [check]);

  const probe = () => {
    setStatus({ state: "checking" });
    check();
  };

  const dot =
    status.state === "connected" ? "#52d68a" : status.state === "checking" ? "#8b97a7" : "#e8b34d";

  return (
    <div className="rounded-md border border-line bg-panel2/50 p-3">
      <div className="flex items-center gap-2">
        <span className="inline-block size-2 rounded-full" style={{ background: dot }} />
        <span className="mono-label">your tutor</span>
        <button
          className="ml-auto font-mono text-[11px] text-dim underline-offset-2 hover:text-acc hover:underline"
          onClick={probe}
        >
          check again
        </button>
      </div>
      <div className="mt-1.5 text-[12.5px] leading-relaxed text-dim">
        {status.state === "checking" && "checking…"}
        {status.state === "connected" && status.backend === "cli" && (
          <><b className="text-acc-robot">Connected — your Claude Code subscription.</b> Ask anything from Today or any node; conversations are saved to your account.</>
        )}
        {status.state === "connected" && status.backend === "api" && (
          <><b className="text-acc-robot">Connected — API key on this deployment.</b> Ask anything from Today or any node; conversations are saved to your account.</>
        )}
        {status.state === "off" && (
          <>
            <b className="text-warn">Not connected on this deployment.</b> Two ways to wake it:
            <span className="mt-1 block">
              <b className="text-ink">On your PC</b> — install Claude Code, sign in once (<code className="text-[11.5px]">claude</code> in a terminal),
              then run this app locally (<code className="text-[11.5px]">npm run dev</code>). The tutor uses your Claude subscription — no API key.
            </span>
            <span className="mt-1 block">
              <b className="text-ink">Anywhere</b> — {status.reason === "needs-accounts"
                ? "accounts are already on; add ANTHROPIC_API_KEY in Vercel and redeploy."
                : "add ANTHROPIC_API_KEY in Vercel (and Redis for accounts) and redeploy."}
            </span>
            <span className="mt-1 block text-faint">Until then the copy-paste bridge on each node works with any AI chat.</span>
          </>
        )}
      </div>
    </div>
  );
}
