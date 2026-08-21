import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l0-debug-mindset.md (live-verified 2026-08-21).
// Curation override: the 2026 L4 debugging half is gdb/rr/strace (C/systems) —
// core here is the Python-first 2020 edition + the official tutorial's errors
// chapter; 2026 L4 contributes only its AI-for-debugging section.

export const packet: LearningPacket = {
  nodeId: "l0-debug-mindset",
  whyNow:
    "The single highest-leverage research skill: converting 'it broke' into a located, minimal, explained failure. The error message is not the enemy — it is the most informative artifact you have, and the last line is where reading starts; the next skill is scanning bottom-up for the last frame in YOUR code, because the crash site is often innocent downstream of the real bug. The tools here are props; the graded skill is one written hypothesis at a time. And given your Claude habit, one rule is structural from day one: no AI until the hypothesis is written.",
  diagnostic: {
    prompt:
      "Cold, 5 min, shown a 15-line traceback through 3 library layers (prepared artifact): point at the line to read FIRST and say why. Then: the difference between where code crashed and where it went wrong — with a one-line example.",
    minutes: 5,
  },
  coreRead: [
    {
      title: "Errors and Exceptions — the official Python tutorial",
      url: "https://docs.python.org/3/tutorial/errors.html",
      sections: "Syntax Errors + Exceptions + Handling Exceptions. The raising/custom-exceptions detail can wait for L1.",
      minutes: 15,
      whySelected: "The authority on what a traceback IS — it states the last-line rule verbatim: the last line of the error message indicates what happened.",
    },
    {
      title: "Missing Semester 2020 — Debugging and Profiling notes (debugging half)",
      resourceId: "missing-semester",
      sections:
        "print vs logging (and why logging wins), the pdb walk, one glance at static analysis (pyflakes returns in L1 tooling). The profiling half is deferred to performance work at L4+.",
      minutes: 20,
      whySelected: "Python-first probe selection — the 2026 edition's debugging lecture went C/systems (gdb/rr/strace) and is deferred; this edition matches your stack.",
    },
  ],
  recall: [
    { q: "Which line of a traceback do you read first, and what does it tell you?", a: "The last line — exception type and message: what happened. Then scan upward for the last frame in YOUR code." },
    { q: "Frames in a Python traceback are printed in what order?", a: "Outermost call at the top, innermost — where it raised — at the bottom. So read bottom-up." },
    { q: "When does logging beat print?", a: "When you want severity levels, timestamps/context, on-off without editing code, and output that survives to files. print is fine as a one-shot probe; logging for anything you will run twice." },
    { q: "Two ways to drop into pdb?", a: "python -m pdb script.py from the shell, or a breakpoint() call in the code — then n/s/c to step and p to inspect." },
    { q: "Crash site vs bug site?", a: "Where it raised is often innocent downstream code — e.g. open() explodes on a path that was built wrong 30 lines earlier. Fix where it went wrong, not where it crashed." },
  ],
  practice: [
    {
      prompt:
        "Traceback drill — 8 one-line-broken snippets producing NameError, TypeError, IndexError, KeyError, AttributeError, FileNotFoundError, ModuleNotFoundError, ZeroDivisionError: for each, read the bottom line ALOUD → name the cause → fix → re-run.",
      minutes: 20,
    },
    {
      prompt:
        "The core drill: 5 pre-broken scripts (typo, wrong type, off-by-one, bad path, silent logic bug). Fix each keeping a written hypothesis → test → conclusion log — ONE hypothesis at a time; AI forbidden until a hypothesis is written down. The log is the artifact, not the fix. The silent-logic script matters most: no traceback appears, and the method must survive without its favorite artifact.",
      minutes: 40,
    },
    {
      prompt:
        "Debug one script twice: once with prints, once stepping in pdb (python -m pdb script.py, or breakpoint()). One written sentence: when does each probe win? (The VS Code debugger from l0-editor is the third probe — this adds the terminal-native one.)",
      minutes: 15,
    },
  ],
  implement: {
    spec:
      "debugging-protocol.md, 10 lines or fewer, distilled from your own drill logs: read last line → find your frame → reproduce minimally → one hypothesis → one change → log it. Pin it — prove-it grades your log against it. Then the time capsule: plant a bug in working code today; fix it cold tomorrow using only the protocol.",
    checks: [
      "Protocol is ≤10 lines and traceable to a real mistake in your own logs",
      "Time-capsule bug fixed the next day, with a log that follows the protocol",
    ],
    minutes: 20,
  },
  stuck: {
    alternate: {
      title: "Missing Semester 2020 — Debugging and Profiling lecture (print/logging → pdb segment)",
      creator: "MIT (Missing Semester)",
      url: "https://www.youtube.com/watch?v=l812pUnKxME",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=l812pUnKxME", 0, 1500),
      endSeconds: 1500,
      minutes: 25,
      whySelected: "Watch only if pdb does not click from the notes — the same walk, demonstrated live.",
      unverified: true,
    },
    alternateRead: {
      title: "Missing Semester 2026 L4 notes — AI for Debugging section",
      resourceId: "missing-semester",
      sections: "The sanctioned way to use Claude on a bug: paste the FULL traceback plus your written hypothesis, and ask for critique of the hypothesis — not for the solution.",
      minutes: 5,
    },
    note: "When even hypothesis-forming stalls: rubber-duck it — explain the broken script line by line, aloud. The bug usually surfaces mid-sentence.",
  },
  deepen: [
    {
      title: "Debugging: The 9 Indispensable Rules — David J. Agans (book)",
      sections:
        "Rule-chapter skim AFTER your first real multi-hour bug, not before: understand the system; make it fail; quit thinking and look; divide and conquer; change one thing at a time; keep an audit trail. Your hypothesis log is rules 5 and 6 operationalized.",
      minutes: 120,
    },
    {
      title: "Missing Semester 2026 L4 — Debugging and Profiling (remainder)",
      resourceId: "missing-semester",
      sections: "gdb/lldb, rr record-replay, strace, sanitizers — deferred to the C++/systems moment in later levels.",
      minutes: 30,
    },
  ],
  prove: {
    task:
      "The Gold gate, AI-free: an unseen ~100-line broken script with 3 planted bugs of different species. Fix it in under 30 minutes keeping the written hypothesis log — the log is graded against your protocol, not just the fix.",
    criteria: [
      "All 3 bugs fixed and the script runs clean — paste the final run",
      "Log shows exactly one hypothesis at a time: every change traces to a written hypothesis and a recorded result",
      "Bottom-up traceback reading visible in the log — your-frame identified before any edit",
      "No AI, no pasting the script anywhere; under 30 minutes",
    ],
    minutes: 30,
  },
  transfer: {
    task:
      "Debug a NON-code failure with the same protocol, logging hypotheses identically: a broken venv (wrong interpreter — bridges l0-python-setup) or a git state surprise (bridges l0-git). The method must work where no traceback exists; the first real LeRobot/PyTorch install error will be the natural rep later.",
    criteria: [
      "Same log discipline applied to a substrate with no traceback",
      "Root cause stated in the substrate's own terms (which interpreter/pip; which ref moved) plus the command that proves it",
    ],
    minutes: 15,
  },
  retention:
    "7 days: cold traceback drill on 4 new snippets, bottom-line-first narration. 30 days: audit your most recent real debugging log against the protocol — find where you shotgunned.",
  researchRecord: "docs/curation/l0-debug-mindset.md",
  minutes: 180,
};
