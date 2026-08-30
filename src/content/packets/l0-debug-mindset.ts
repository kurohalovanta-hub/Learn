import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l0-debug-mindset.md (live-verified 2026-08-21).
// Curation override: the 2026 L4 debugging half is gdb/rr/strace (C/systems), 
// core here is the Python-first 2020 edition + the official tutorial's errors
// chapter; 2026 L4 contributes only its AI-for-debugging section.

export const packet: LearningPacket = {
  nodeId: "l0-debug-mindset",
  whyNow:
    "This is where 'it broke' turns into a bug you can locate and explain. Read the error's last line first, then scan up for the last line that lives in your own code; the crash spot is often fine, and the real bug sits a few lines back. The graded skill is writing one hypothesis at a time, and one rule holds from day one: no AI until you've written that hypothesis down.",
  diagnostic: {
    prompt:
      "Cold, 5 minutes. Given a 15-line traceback that runs through 3 library layers (a prepared artifact), point at the line you'd read first and say why. Then explain the difference between where code crashed and where it went wrong, with a one-line example.",
    minutes: 5,
  },
  coreRead: [
    {
      title: "Errors and Exceptions, the official Python tutorial",
      url: "https://docs.python.org/3/tutorial/errors.html",
      sections: "Syntax Errors + Exceptions + Handling Exceptions. The raising/custom-exceptions detail can wait for L1.",
      minutes: 15,
      whySelected: "The source of truth on what a traceback is. It states the last-line rule word for word: the last line of the error message tells you what happened.",
    },
    {
      title: "Missing Semester 2020, Debugging and Profiling notes (debugging half)",
      resourceId: "missing-semester",
      sections:
        "print vs logging (and why logging wins), the pdb walk, one glance at static analysis (pyflakes returns in L1 tooling). The profiling half is deferred to performance work at L4+.",
      minutes: 20,
      whySelected: "This edition is Python-first and matches your stack. The 2026 lecture went C and systems (gdb/rr/strace), so it's saved for later.",
    },
  ],
  recall: [
    { q: "Which line of a traceback do you read first, and what does it tell you?", a: "The last line, exception type and message: what happened. Then scan upward for the last frame in YOUR code." },
    { q: "Frames in a Python traceback are printed in what order?", a: "Outermost call at the top, innermost, where it raised, at the bottom. So read bottom-up." },
    { q: "When does logging beat print?", a: "When you want severity levels, timestamps/context, on-off without editing code, and output that survives to files. print is fine as a one-shot probe; logging for anything you will run twice." },
    { q: "Two ways to drop into pdb?", a: "python -m pdb script.py from the shell, or a breakpoint() call in the code, then n/s/c to step and p to inspect." },
    { q: "Crash site vs bug site?", a: "Where it raised is often innocent downstream code, e.g. open() explodes on a path that was built wrong 30 lines earlier. Fix where it went wrong, not where it crashed." },
  ],
  practice: [
    {
      prompt:
        "Traceback drill. 8 snippets, each broken on one line, producing NameError, TypeError, IndexError, KeyError, AttributeError, FileNotFoundError, ModuleNotFoundError, ZeroDivisionError. For each one: read the bottom line aloud, name the cause, fix it, re-run.",
      minutes: 20,
    },
    {
      prompt:
        "The core drill: 5 pre-broken scripts (typo, wrong type, off-by-one, bad path, silent logic bug). Fix each one while keeping a written log of each hypothesis, its test, and what you concluded, one hypothesis at a time; no AI until the hypothesis is written down. The log is the real work here, not the fix. The silent-logic script matters most, because no traceback shows up and your method has to work without one.",
      minutes: 40,
    },
    {
      prompt:
        "Debug one script twice: once with prints, once stepping through pdb (python -m pdb script.py, or breakpoint()). Then write one sentence: when does each probe win? (The VS Code debugger from l0-editor is a third probe; this drill adds the terminal one.)",
      minutes: 15,
    },
  ],
  implement: {
    spec:
      "Write debugging-protocol.md, 10 lines or fewer, pulled from your own drill logs: read the last line, find your frame, reproduce it small, one hypothesis, one change, log it. Pin it up; prove-it grades your log against it. Then the time capsule: plant a bug in working code today, and fix it cold tomorrow using only the protocol.",
    checks: [
      "Protocol is ≤10 lines and traceable to a real mistake in your own logs",
      "Time-capsule bug fixed the next day, with a log that follows the protocol",
    ],
    minutes: 20,
  },
  stuck: {
    alternate: {
      title: "Missing Semester 2020, Debugging and Profiling lecture (print/logging → pdb segment)",
      creator: "MIT (Missing Semester)",
      url: "https://www.youtube.com/watch?v=l812pUnKxME",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=l812pUnKxME", 0, 1500),
      endSeconds: 1500,
      minutes: 25,
      whySelected: "Watch this only if pdb doesn't click from the notes. It's the same walk, shown live.",
      unverified: true,
    },
    alternateRead: {
      title: "Missing Semester 2026 L4 notes, AI for Debugging section",
      resourceId: "missing-semester",
      sections: "The sanctioned way to use Claude on a bug: paste the FULL traceback plus your written hypothesis, and ask for critique of the hypothesis, not for the solution.",
      minutes: 5,
    },
    note: "When you can't even form a hypothesis, rubber-duck it: explain the broken script out loud, line by line. The bug usually shows up mid-sentence.",
  },
  deepen: [
    {
      title: "Debugging: The 9 Indispensable Rules, David J. Agans (book)",
      sections:
        "Rule-chapter skim AFTER your first real multi-hour bug, not before: understand the system; make it fail; quit thinking and look; divide and conquer; change one thing at a time; keep an audit trail. Your hypothesis log is rules 5 and 6 operationalized.",
      minutes: 120,
    },
    {
      title: "Missing Semester 2026 L4, Debugging and Profiling (remainder)",
      resourceId: "missing-semester",
      sections: "gdb/lldb, rr record-replay, strace, sanitizers, deferred to the C++/systems moment in later levels.",
      minutes: 30,
    },
  ],
  prove: {
    task:
      "The Gold gate, no AI: an unseen script of about 100 lines with 3 planted bugs of different kinds. Fix it in under 30 minutes while keeping your written hypothesis log. The log is graded against your protocol, not just the fix.",
    criteria: [
      "All 3 bugs fixed and the script runs clean; paste the final run",
      "Log shows one hypothesis at a time: every change traces back to a written hypothesis and a recorded result",
      "Bottom-up traceback reading shows in the log: you found your frame before any edit",
      "No AI, no pasting the script anywhere, under 30 minutes",
    ],
    minutes: 30,
  },
  transfer: {
    task:
      "Debug a non-code failure with the same protocol, logging hypotheses the same way: a broken venv (wrong interpreter, bridges l0-python-setup) or a surprising git state (bridges l0-git). The method has to work where there's no traceback; your first real LeRobot or PyTorch install error will be the natural rep later.",
    criteria: [
      "Same log discipline applied to a substrate with no traceback",
      "Root cause stated in the substrate's own terms (which interpreter/pip; which ref moved) plus the command that proves it",
    ],
    minutes: 15,
  },
  retention:
    "7 days: cold traceback drill on 4 new snippets, bottom-line-first narration. 30 days: audit your most recent real debugging log against the protocol, find where you shotgunned.",
  researchRecord: "docs/curation/l0-debug-mindset.md",
  minutes: 180,
};
