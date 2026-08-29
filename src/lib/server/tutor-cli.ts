// Claude Code CLI tutor backend (ADR-005 addendum). When the app runs on the
// learner's own machine, the tutor rides the local `claude` CLI — powered by
// their Claude Code subscription, zero API key. Never available on Vercel
// (no binary, and a server must not hold a personal subscription anyway).

import { spawn, spawnSync } from "node:child_process";
import { homedir } from "node:os";
import type { TutorMessage } from "@/lib/server/tutor";

const cliEnv = () => ({
  ...process.env,
  PATH: `${process.env.PATH ?? ""}:${homedir()}/.local/bin:/opt/homebrew/bin:/usr/local/bin`,
});

/** CLI backend is opt-in territory: dev, or an explicit flag for local `npm start`. */
export const cliAllowed = () =>
  process.env.NODE_ENV === "development" || process.env.TUTOR_USE_CLAUDE_CLI === "1";

let cliPresent: boolean | null = null;
export function claudeCliAvailable(): boolean {
  if (!cliAllowed()) return false;
  if (cliPresent === null) {
    try {
      const r = spawnSync("claude", ["--version"], { env: cliEnv(), timeout: 15_000 });
      cliPresent = r.status === 0;
    } catch {
      cliPresent = false;
    }
  }
  return cliPresent;
}

function serializeConversation(messages: TutorMessage[]): string {
  const turns = messages
    .map((m) => `${m.role === "user" ? "LEARNER" : "TUTOR"}: ${m.content}`)
    .join("\n\n");
  return `[Conversation so far — you are TUTOR. Reply ONLY to the last LEARNER message, following your instructions.]\n\n${turns}`;
}

/** Stream a tutor reply through the local Claude Code CLI. */
export function streamClaudeCli(
  system: string,
  messages: TutorMessage[],
  model?: string,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const child = spawn(
        "claude",
        [
          "-p",
          "--output-format", "stream-json",
          "--include-partial-messages",
          "--verbose",
          "--max-turns", "1",
          "--tools", "",
          "--system-prompt", system,
          ...(model ? ["--model", model] : []),
        ],
        { env: cliEnv(), stdio: ["pipe", "pipe", "pipe"] },
      );

      let emitted = false;
      let stderrTail = "";
      let buf = "";
      const timer = setTimeout(() => child.kill("SIGKILL"), 120_000);

      child.stdout.on("data", (chunk: Buffer) => {
        buf += chunk.toString("utf8");
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const evt = JSON.parse(line) as {
              type?: string;
              event?: { type?: string; delta?: { type?: string; text?: string } };
            };
            const delta = evt.type === "stream_event" ? evt.event : undefined;
            if (delta?.type === "content_block_delta" && delta.delta?.type === "text_delta" && delta.delta.text) {
              emitted = true;
              controller.enqueue(encoder.encode(delta.delta.text));
            }
          } catch { /* non-JSON noise (hook output etc.) — ignore */ }
        }
      });
      child.stderr.on("data", (c: Buffer) => { stderrTail = (stderrTail + c.toString("utf8")).slice(-500); });

      child.on("error", () => {
        clearTimeout(timer);
        controller.enqueue(encoder.encode("⚠ couldn't launch the local Claude Code CLI — is `claude` on PATH?"));
        controller.close();
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        if (!emitted) {
          controller.enqueue(encoder.encode(
            `⚠ the local Claude Code CLI produced no reply${code ? ` (exit ${code})` : ""}${stderrTail ? ` — ${stderrTail.trim().slice(0, 200)}` : ""}. Try \`claude\` in a terminal to check your login.`,
          ));
        }
        controller.close();
      });

      child.stdin.write(serializeConversation(messages));
      child.stdin.end();
    },
  });
}
