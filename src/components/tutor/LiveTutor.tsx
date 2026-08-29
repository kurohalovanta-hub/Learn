"use client";

// The live virtual teacher (ADR-005). Streams grounded Claude replies, ends
// every turn in tap-options so typing is optional, runs learner code for real
// (Pyodide) before review, and logs sessions through the existing
// summary → evidence path so the honesty engine stays the single authority.

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import {
  buildLearnerContext, parseTutorSummary, summaryToEvidence,
  TUTOR_MODE_LABELS, type TutorMode,
} from "@/lib/tutor";
import { runPython, type RunResult } from "@/lib/pyodide-runner";
import { buildLifeContext, buildProgressDigest } from "@/lib/memory-digest";
import { Markdown } from "@/components/lesson/Markdown";
import { TutorBridge } from "@/components/TutorBridge";
import { AIConnect } from "@/components/tutor/AIConnect";
import { TUTOR_TASK_EVENT, type TutorTask } from "@/lib/tutor-task";

type Availability = "checking" | "ready" | "no-key" | "connect" | "unauthed";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

// tolerate the options line landing anywhere in the reply, not only at the end
const stripOpts = (s: string) => s.replace(/\[\[opts:[^\]]*\]\]\s*/g, "");
const parseOpts = (s: string): string[] => {
  const matches = [...s.matchAll(/\[\[opts:([^\]]+)\]\]/g)];
  const last = matches[matches.length - 1];
  return last ? last[1].split("|").map((x) => x.trim()).filter(Boolean).slice(0, 4) : [];
};
const DEPTH_CHIPS = ["shorter", "go deeper", "show me an example", "skip ahead — I know this"];
const STARTERS = [
  "Teach me this from zero.",
  "Quiz me first — maybe I can skip parts.",
  "Why does this node matter for the goal?",
  "I'm stuck — diagnose what I'm missing.",
];

function TeacherAvatar({ state }: { state: "idle" | "thinking" | "speaking" }) {
  const acc = "var(--color-acc)";
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
      <circle cx="17" cy="17" r="15.5" fill="none" stroke="var(--color-line2)" strokeWidth="1" />
      <circle
        cx="17" cy="17" r="15.5" fill="none" stroke={acc} strokeWidth="1.5"
        strokeDasharray={state === "thinking" ? "10 14" : state === "speaking" ? "40 8" : "97 0"}
        strokeLinecap="round" opacity={state === "idle" ? 0.35 : 0.9}
        style={state !== "idle" ? { animation: "tutor-orbit 2.2s linear infinite", transformOrigin: "center" } : undefined}
      />
      <circle
        cx="17" cy="17" r={state === "speaking" ? 6.5 : 5.5} fill={acc}
        opacity={state === "idle" ? 0.5 : 0.95}
        style={state === "speaking" ? { animation: "tutor-breathe 1.1s ease-in-out infinite" } : undefined}
      />
    </svg>
  );
}

export function LiveTutor({ nodeId, bottleneck }: { nodeId: string; bottleneck?: string }) {
  const store = useStore();
  const [avail, setAvail] = useState<Availability>("checking");
  const [backend, setBackend] = useState<"bridge-claude" | "bridge-codex" | "your-claude" | "your-chatgpt" | "cli" | "deployment" | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState<string>("");
  const [mode, setMode] = useState<TutorMode>("teach");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [labOpen, setLabOpen] = useState(false);
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/tutor")
      .then((r) => r.json())
      .then((j: { available?: boolean; reason?: string; models?: string[]; backend?: "bridge-claude" | "bridge-codex" | "your-claude" | "your-chatgpt" | "cli" | "deployment" }) => {
        if (!alive) return;
        setAvail(j.available ? "ready" : j.reason === "sign-in" ? "unauthed" : j.reason === "connect" ? "connect" : "no-key");
        setBackend(j.backend ?? null);
        const ms = j.models ?? [];
        setModels(ms);
        try {
          const saved = localStorage.getItem(`halo-model-${j.backend}`);
          setModel(saved && ms.includes(saved) ? saved : "");
        } catch { /* storage may be blocked */ }
      })
      .catch(() => { if (alive) setAvail("no-key"); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // restore the persisted chat log for this node (follows the account via sync).
  // Idempotent — StrictMode double-mount just re-schedules; the functional
  // update never clobbers a conversation already on screen.
  useEffect(() => {
    if (!store.hydrated) return;
    const saved = useStore.getState().tutorChats[nodeId];
    if (!saved?.messages.length) return;
    const timer = setTimeout(() => {
      setMessages((cur) => (cur.length === 0 ? saved.messages : cur));
    }, 0);
    return () => clearTimeout(timer);
  }, [store.hydrated, nodeId]);

  // packet blocks can deep-link a task into this panel (TutorTaskLink)
  useEffect(() => {
    const onTask = (e: Event) => {
      const d = (e as CustomEvent<TutorTask>).detail;
      if (!d?.text || avail !== "ready" || streaming) return;
      setMode(d.mode);
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      void send(d.text, { modeOverride: d.mode });
    };
    window.addEventListener(TUTOR_TASK_EVENT, onTask);
    return () => window.removeEventListener(TUTOR_TASK_EVENT, onTask);
  });

  const send = async (text: string, { summaryRequest = false, modeOverride = undefined as TutorMode | undefined } = {}) => {
    if (streaming || !text.trim()) return;
    setNotice(null);
    setChips([]);
    const history: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let full = "";
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          nodeId, mode: modeOverride ?? mode, ...(model ? { model } : {}),
          context: `${buildLearnerContext(nodeId, { nodes: store.nodes, events: store.events, logs: store.logs, settings: store.settings }, bottleneck)}\n\nEVERYTHING ELSE THE LEARNER HAS WRITTEN (reviews, ideas, experiments, papers — use when relevant):\n${buildLifeContext({ weeklies: store.weeklies, ideas: store.ideas, experiments: store.experiments, papers: store.papers }) || "nothing yet"}`.slice(0, 8000),
          messages: history,
        }),
      });
      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        if (res.status === 401) setAvail("unauthed");
        setMessages([...history, { role: "assistant", content: `⚠ ${j?.error ?? `tutor unavailable (${res.status})`}` }]);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: stripOpts(full) }]);
      }
      const opts = parseOpts(full);
      if (opts.length) setChips(opts);
      if (full) store.saveTutorChat(nodeId, [...history, { role: "assistant", content: stripOpts(full) }]);

      if (summaryRequest) {
        const parsed = parseTutorSummary(full);
        if (parsed.ok) {
          const evs = summaryToEvidence(parsed.summary);
          for (const e of evs) store.recordEvidence(e);
          const done: Msg = {
            role: "assistant",
            content: `✓ Session logged — ${evs.length} evidence entries recorded. A tutor session supports progress; the typed prove-it is still yours to do.`,
          };
          setMessages([...history, done]);
          setChips([]);
          store.saveTutorChat(nodeId, [...history, done]);
          // fire-and-forget: push the digest to the linked memory repo
          const st = useStore.getState();
          void fetch("/api/memory", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ digest: buildProgressDigest({ nodes: st.nodes, events: st.events, logs: st.logs, tutorChats: st.tutorChats, weeklies: st.weeklies, ideas: st.ideas, experiments: st.experiments, papers: st.papers }) }),
          }).catch(() => {});
        } else {
          setNotice(`Couldn't parse the session summary (${parsed.error}) — evidence not logged.`);
        }
      }
    } catch {
      if (!controller.signal.aborted) {
        setMessages([...history, { role: "assistant", content: "⚠ connection dropped — send that again." }]);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const runCode = async () => {
    if (running || !code.trim()) return;
    setRunning(true);
    setRunResult(null);
    const result = await runPython(code);
    setRunResult(result);
    setRunning(false);
  };

  const sendCodeToTutor = () => {
    const out = runResult
      ? `\n\nREAL OUTPUT (in-browser Python, ${runResult.ms} ms):\n\`\`\`\n${(runResult.stdout || "").slice(0, 3000)}${runResult.error ? `\nERROR: ${runResult.error}` : ""}\n\`\`\``
      : "\n\n(not run yet — review the code as written)";
    void send(`Review my code for this node's practice work.\n\`\`\`python\n${code.slice(0, 6000)}\n\`\`\`${out}\n\nWhere am I wrong, and what did I get right?`);
  };

  if (avail === "checking") return null;

  if (avail !== "ready") {
    return (
      <div className="rounded-md border border-line bg-panel2/50 p-3">
        <div className="mono-label mb-1.5">your tutor — one step from alive</div>
        {avail === "connect" ? (
          <div className="mb-2 space-y-2 text-[12px] text-faint">
            <div>Connect your Claude or ChatGPT and the tutor wakes up right here — it teaches from this node&apos;s curated materials and remembers every conversation in your account.</div>
            <AIConnect compact />
          </div>
        ) : (
          <div className="mb-2 text-[12px] text-faint">
            {avail === "unauthed" && "Sign in, then connect your Claude or ChatGPT in Settings — the tutor runs on your own AI, from any device."}
            {avail === "no-key" && "Accounts aren't enabled on this deployment yet, so the tutor can't hold your connection. The copy-paste bridge below works with any AI meanwhile."}
          </div>
        )}
        <TutorBridge nodeId={nodeId} bottleneck={bottleneck} compact />
      </div>
    );
  }

  const speaking = streaming && messages[messages.length - 1]?.content !== "";
  const avatarState = streaming ? (speaking ? "speaking" : "thinking") : "idle";

  return (
    <div ref={rootRef} className="rounded-md border border-line bg-panel p-3">
      <div className="mb-2 flex items-center gap-2.5">
        <TeacherAvatar state={avatarState} />
        <div className="min-w-0 flex-1">
          <div className="mono-label">resident tutor · live</div>
          <div className="truncate text-[11.5px] text-faint">
            {streaming
              ? (speaking ? "explaining…" : "thinking…")
              : `grounded in this node's curated materials — ask anything${
                  backend === "bridge-claude" ? " · your Claude Code (bridge)" :
                  backend === "bridge-codex" ? " · your ChatGPT Codex (bridge)" :
                  backend === "your-claude" ? " · your Claude key" :
                  backend === "your-chatgpt" ? " · your ChatGPT key" :
                  backend === "cli" ? " · your Claude Code subscription" : ""}`}
          </div>
        </div>
        {models.length > 0 && (
          <select
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              try { localStorage.setItem(`halo-model-${backend}`, e.target.value); } catch { /* fine */ }
            }}
            disabled={streaming}
            className="!w-auto !py-1 font-mono !text-[11.5px]"
            aria-label="model"
          >
            <option value="">model: auto</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as TutorMode)}
          disabled={streaming}
          className="!w-auto !py-1 font-mono !text-[11.5px]"
          aria-label="tutor mode"
        >
          {(Object.keys(TUTOR_MODE_LABELS) as TutorMode[]).map((m) => (
            <option key={m} value={m}>{TUTOR_MODE_LABELS[m]}</option>
          ))}
        </select>
      </div>

      {messages.length > 0 && (
        <div ref={scrollRef} className="mb-2 max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-lg border border-acc/25 bg-acc/8 px-3 py-2 text-[13px] whitespace-pre-wrap"
                    : "max-w-[92%] rounded-lg border border-line bg-panel2 px-3 py-2"
                }
              >
                {m.role === "assistant"
                  ? m.content
                    ? <Markdown className="!text-[13.5px]">{m.content}</Markdown>
                    : <span className="font-mono text-[12px] text-faint">…</span>
                  : m.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* tap options — the no-typing path */}
      <div className="flex flex-wrap gap-1.5">
        {(messages.length === 0 ? STARTERS : chips).map((c) => (
          <button
            key={c}
            disabled={streaming}
            onClick={() => void send(c)}
            className="rounded-full border border-acc/35 bg-panel2 px-3 py-1.5 text-[12px] text-acc transition-colors hover:bg-acc/10 disabled:opacity-40"
          >
            {c}
          </button>
        ))}
        {messages.length > 0 && !streaming &&
          DEPTH_CHIPS.filter((d) => !chips.includes(d)).map((d) => (
            <button
              key={d}
              onClick={() => void send(d)}
              className="rounded-full border border-line2 bg-panel2 px-3 py-1.5 text-[12px] text-dim transition-colors hover:border-acc/40 hover:text-acc"
            >
              {d}
            </button>
          ))}
      </div>

      <div className="mt-2 flex items-end gap-1.5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const t = input; setInput("");
              void send(t);
            }
          }}
          rows={1}
          placeholder="or type — Enter sends"
          className="min-h-[38px] flex-1 resize-y !text-[13px]"
        />
        <button
          className="btn !py-2 text-xs"
          disabled={streaming || !input.trim()}
          onClick={() => { const t = input; setInput(""); void send(t); }}
        >
          send
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          className="font-mono text-[11px] text-dim underline-offset-2 hover:text-acc hover:underline"
          onClick={() => setLabOpen(!labOpen)}
        >
          {labOpen ? "▾ code lab" : "▸ code lab — write python, run it for real, get it reviewed"}
        </button>
        {messages.length > 1 && (
          <span className="ml-auto flex items-center gap-3">
            <button
              className="font-mono text-[11px] text-faint underline-offset-2 hover:text-alert hover:underline disabled:opacity-40"
              disabled={streaming}
              onClick={() => { store.clearTutorChat(nodeId); setMessages([]); setChips([]); }}
            >
              clear log
            </button>
            <button
              className="font-mono text-[11px] text-acc-robot underline-offset-2 hover:underline disabled:opacity-40"
              disabled={streaming}
              onClick={() => void send("End the session now. Output only the end-of-session summary JSON.", { summaryRequest: true })}
            >
              end session → log evidence
            </button>
          </span>
        )}
      </div>

      {labOpen && (
        <div className="rise-in mt-2 space-y-1.5">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={7}
            spellCheck={false}
            placeholder={"# real Python, runs in your browser (numpy works)\nimport numpy as np\nprint(np.linalg.eigvals(np.array([[2., 0.], [0., 3.]])))"}
            className="w-full font-mono !text-[12.5px]"
          />
          <div className="flex flex-wrap gap-1.5">
            <button className="btn !py-1.5 text-xs" disabled={running || !code.trim()} onClick={() => void runCode()}>
              {running ? "running… (first run downloads Python, ~10 MB)" : "▶ run"}
            </button>
            <button
              className="rounded-md border border-line2 bg-panel2 px-2.5 py-1.5 font-mono text-[11.5px] text-dim transition-colors hover:border-acc/50 hover:text-acc disabled:opacity-40"
              disabled={streaming || !code.trim()}
              onClick={sendCodeToTutor}
            >
              review with tutor{runResult ? " (with real output)" : ""}
            </button>
          </div>
          {runResult && (
            <pre className={`max-h-52 overflow-auto rounded-md border p-2.5 font-mono text-[12px] whitespace-pre-wrap ${runResult.ok ? "border-line bg-panel2 text-ink" : "border-alert/40 bg-panel2 text-alert"}`}>
              {runResult.stdout || (runResult.ok ? "(no output)" : "")}
              {runResult.error ? `\n${runResult.error}` : ""}
            </pre>
          )}
        </div>
      )}

      {notice && <div className="mt-1.5 text-[11.5px] text-warn">{notice}</div>}
    </div>
  );
}
