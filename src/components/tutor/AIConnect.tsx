"use client";

// Connect your own AI to HALO. Each account links its own Claude and/or
// ChatGPT key; the in-site tutor runs on YOUR connection — no site-wide key,
// nothing to run locally. Keys are validated, stored server-side against your
// account, and never shown again.

import { useCallback, useEffect, useState } from "react";

type Provider = "anthropic" | "openai";

interface Linked {
  anthropic: boolean;
  openai: boolean;
  prefer: Provider;
}

const NAMES: Record<Provider, string> = { anthropic: "Claude", openai: "ChatGPT" };
const KEY_URLS: Record<Provider, string> = {
  anthropic: "console.anthropic.com/settings/keys",
  openai: "platform.openai.com/api-keys",
};

export function AIConnect({ compact }: { compact?: boolean }) {
  const [linked, setLinked] = useState<Linked | null | "unauthed">(null);
  const [open, setOpen] = useState<Provider | null>(null);
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/tutor/config")
      .then(async (r) => {
        if (!r.ok) return setLinked("unauthed");
        setLinked((await r.json()) as Linked);
      })
      .catch(() => setLinked("unauthed"));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const connect = async (provider: Provider) => {
    setBusy(true); setMsg(null);
    try {
      const r = await fetch("/api/tutor/config", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ provider, key }),
      });
      const j = (await r.json()) as { ok?: boolean; error?: string };
      if (j.ok) {
        setMsg(`✓ ${NAMES[provider]} connected — the tutor now runs on your ${NAMES[provider]}.`);
        setKey(""); setOpen(null); refresh();
      } else setMsg(`✗ ${j.error ?? `failed (${r.status})`}`);
    } catch (e) {
      setMsg(`✗ ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async (provider: Provider) => {
    setBusy(true); setMsg(null);
    await fetch("/api/tutor/config", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ provider }),
    }).catch(() => {});
    setBusy(false); refresh();
  };

  const setPrefer = async (prefer: Provider) => {
    await fetch("/api/tutor/config", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prefer }),
    }).catch(() => {});
    refresh();
  };

  if (linked === null) return null;
  if (linked === "unauthed") {
    if (compact) return null;
    return <div className="text-[12.5px] text-faint">Sign in first — AI connections are per account.</div>;
  }

  const row = (provider: Provider) => {
    const on = linked[provider];
    return (
      <div key={provider} className="flex flex-wrap items-center gap-2">
        <span className="inline-block size-2 rounded-full" style={{ background: on ? "#52d68a" : "#2a3646" }} />
        <span className="w-16 font-mono text-[12.5px] text-ink">{NAMES[provider]}</span>
        {on ? (
          <>
            <span className="text-[11.5px] text-acc-robot">connected</span>
            {linked.anthropic && linked.openai && (
              <button
                className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${linked.prefer === provider ? "border-acc/50 text-acc" : "border-line2 text-faint hover:text-dim"}`}
                onClick={() => void setPrefer(provider)}
                title="Which connection the tutor uses first"
              >
                {linked.prefer === provider ? "in use" : "use this"}
              </button>
            )}
            <button
              className="font-mono text-[11px] text-faint underline-offset-2 hover:text-alert hover:underline"
              disabled={busy}
              onClick={() => void disconnect(provider)}
            >
              disconnect
            </button>
          </>
        ) : (
          <button
            className="rounded-md border border-acc/35 bg-panel2 px-2.5 py-1 text-[12px] text-acc transition-colors hover:bg-acc/10"
            onClick={() => { setOpen(open === provider ? null : provider); setKey(""); setMsg(null); }}
          >
            {open === provider ? "close" : `connect ${NAMES[provider]} →`}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {!compact && (
        <p className="text-[12.5px] leading-relaxed text-dim">
          The tutor runs on <b className="text-ink">your</b> AI. Connect one (or both) once — it works from any
          device, and everything it learns about you lands in your account and your memory repo.
        </p>
      )}
      {row("anthropic")}
      {row("openai")}

      {open && (
        <div className="rise-in space-y-2 rounded-md border border-line bg-panel2/50 p-3">
          <div className="text-[12px] text-faint">
            Get a key at <b className="text-dim">{KEY_URLS[open]}</b> (2 minutes, works immediately). It&apos;s stored
            with your account, used only for your tutoring, and you can disconnect any time.
          </div>
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={open === "anthropic" ? "sk-ant-…" : "sk-…"}
            type="password"
            className="w-full font-mono !text-[12.5px]"
            autoComplete="off"
          />
          <button className="btn !py-1.5 text-xs" disabled={busy || key.trim().length < 20} onClick={() => void connect(open)}>
            {busy ? "checking key…" : `connect ${NAMES[open]}`}
          </button>
        </div>
      )}

      {msg && <div className="text-[11.5px] text-dim">{msg}</div>}
    </div>
  );
}
