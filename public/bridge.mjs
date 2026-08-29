#!/usr/bin/env node
// HALO bridge — runs on YOUR machine (PC or any always-on box).
// It answers the website's tutor questions through your own Claude Code
// and/or ChatGPT Codex logins. Nothing to install, no API keys:
//
//   1. Sign in once on this machine:  claude   (and/or)   codex login
//   2. Get a bridge key: HALO → Settings → connections → create bridge key
//   3. Run:  HALO_TOKEN=halo_xxx node bridge.mjs
//
// Optional: HALO_URL=https://your-halo.example (defaults to milanhalo.me)
//           HALO_NO_WEB=1  — forbid the tutor from using web search/fetch
//
// Works on macOS, Linux, and Windows (PowerShell:  $env:HALO_TOKEN="halo_xxx"; node bridge.mjs)
// Outbound-only: no ports, no tunnel needed — run it on any box that stays on.

import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const WIN = process.platform === "win32";
// with shell:true (needed for .cmd shims on Windows) args must be quoted
const spawnCli = (bin, args) =>
  WIN
    ? spawn(bin, args.map((a) => (/[\s"^&|<>%]/.test(a) ? `"${a.replaceAll('"', '\\"')}"` : a)), { stdio: ["pipe", "pipe", "pipe"], shell: true })
    : spawn(bin, args, { stdio: ["pipe", "pipe", "pipe"] });

const URL_BASE = (process.env.HALO_URL ?? "https://www.milanhalo.me").replace(/\/+$/, "");
const TOKEN = process.env.HALO_TOKEN ?? "";
if (!TOKEN.startsWith("halo_")) {
  console.error("HALO_TOKEN missing. Create one in HALO → Settings → connections, then:");
  console.error("  HALO_TOKEN=halo_xxx node bridge.mjs");
  process.exit(1);
}

const has = (bin) => {
  try { return spawnSync(bin, ["--version"], { timeout: 15000, shell: WIN }).status === 0; }
  catch { return false; }
};
const HAS_CLAUDE = has("claude");
const HAS_CODEX = has("codex");
if (!HAS_CLAUDE && !HAS_CODEX) {
  console.error("Neither `claude` nor `codex` found on PATH. Install/sign in to at least one first.");
  process.exit(1);
}
console.log(`HALO bridge → ${URL_BASE}`);
console.log(`  engines: ${[HAS_CLAUDE && "Claude Code", HAS_CODEX && "ChatGPT Codex"].filter(Boolean).join(" + ")}`);

const api = (path, opts = {}) =>
  fetch(`${URL_BASE}/api/bridge${path}`, {
    ...opts,
    headers: { "x-bridge-token": TOKEN, "content-type": "application/json", ...(opts.headers ?? {}) },
  });

const post = (jobId, payload) =>
  api("", { method: "POST", body: JSON.stringify({ jobId, ...payload }) }).catch(() => {});

const serialize = (messages) =>
  `[Conversation so far — you are TUTOR. Reply ONLY to the last LEARNER message, following your instructions.]\n\n` +
  messages.map((m) => `${m.role === "user" ? "LEARNER" : "TUTOR"}: ${m.content}`).join("\n\n");

const CLAUDE_MODELS = { sonnet: "sonnet", opus: "opus", haiku: "haiku" };

const WEB_TOOLS = process.env.HALO_NO_WEB === "1" ? null : "WebSearch,WebFetch";

function runClaude(job) {
  return new Promise((resolve) => {
    const dir = mkdtempSync(join(tmpdir(), "halo-"));
    const sysFile = join(dir, "system.md");
    writeFileSync(sysFile, job.system, "utf8");
    const args = [
      "-p", "--output-format", "stream-json", "--include-partial-messages", "--verbose",
      "--system-prompt-file", sysFile,
      // web lookup lets the tutor verify links and pull fresh material; nothing else
      ...(WEB_TOOLS ? ["--tools", WEB_TOOLS, "--max-turns", "6"] : ["--tools", "", "--max-turns", "1"]),
    ];
    const model = CLAUDE_MODELS[job.model];
    if (model) args.push("--model", model);
    const child = spawnCli("claude", args);

    let pending = [];
    let emitted = false;
    let buf = "";
    const flush = () => {
      if (pending.length) { void post(job.id, { chunks: pending }); pending = []; }
    };
    const flusher = setInterval(flush, 350);
    const killer = setTimeout(() => child.kill("SIGKILL"), 150_000);

    child.stdout.on("data", (data) => {
      buf += data.toString("utf8");
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const evt = JSON.parse(line);
          const d = evt.type === "stream_event" ? evt.event : null;
          if (d?.type === "content_block_delta" && d.delta?.type === "text_delta" && d.delta.text) {
            emitted = true;
            pending.push(d.delta.text);
          }
        } catch { /* non-JSON noise */ }
      }
    });
    child.on("close", (code) => {
      clearInterval(flusher); clearTimeout(killer); flush();
      rmSync(dir, { recursive: true, force: true });
      void post(job.id, emitted ? { done: true } : { error: `Claude Code gave no reply (exit ${code}) — run \`claude\` here to check your login.` })
        .then(() => resolve());
    });
    child.on("error", () => {
      clearInterval(flusher); clearTimeout(killer);
      rmSync(dir, { recursive: true, force: true });
      void post(job.id, { error: "couldn't launch claude on this machine" }).then(() => resolve());
    });
    child.stdin.write(serialize(job.messages));
    child.stdin.end();
  });
}

function runCodex(job) {
  return new Promise((resolve) => {
    const args = ["exec", "-s", "read-only", "--skip-git-repo-check", "-"];
    if (job.model && /^[\w.-]{2,40}$/.test(job.model)) args.splice(1, 0, "-m", job.model);
    const child = spawnCli("codex", args);
    let out = "";
    const killer = setTimeout(() => child.kill("SIGKILL"), 150_000);
    child.stdout.on("data", (d) => { out += d.toString("utf8"); });
    child.on("close", (code) => {
      clearTimeout(killer);
      const text = out.trim();
      void post(job.id, text ? { chunks: [text.slice(0, 100_000)], done: true } : { error: `Codex gave no reply (exit ${code}) — run \`codex login status\` here.` })
        .then(() => resolve());
    });
    child.on("error", () => {
      clearTimeout(killer);
      void post(job.id, { error: "couldn't launch codex on this machine" }).then(() => resolve());
    });
    child.stdin.write(`${job.system}\n\n${serialize(job.messages)}`);
    child.stdin.end();
  });
}

let stopping = false;
process.on("SIGINT", () => { stopping = true; console.log("\nbridge stopping…"); });

let failures = 0;
for (;;) {
  if (stopping) process.exit(0);
  try {
    const res = await api("");
    if (res.status === 401) {
      console.error("Bridge key rejected — create a fresh one in Settings → connections.");
      process.exit(1);
    }
    const { job } = await res.json();
    failures = 0;
    if (job) {
      const engine = job.provider === "codex" && HAS_CODEX ? "codex" : HAS_CLAUDE ? "claude" : "codex";
      console.log(`[${new Date().toISOString().slice(11, 19)}] job ${job.id.slice(0, 8)} → ${engine}${job.model ? ` (${job.model})` : ""}`);
      await (engine === "codex" ? runCodex(job) : runClaude(job));
      continue; // check for the next job immediately
    }
  } catch {
    failures += 1;
    if (failures === 5) console.error("Can't reach HALO — retrying in the background…");
  }
  await new Promise((r) => setTimeout(r, 1500));
}
