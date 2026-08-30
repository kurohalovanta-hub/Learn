import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l0-editor.md (live-verified 2026-08-21).
// Curation override: Missing Semester 2026 L3 is vim/LSP material with no VS Code
// walkthrough, demoted to DEEPEN; the official VS Code Python tutorial is core.

export const packet: LearningPacket = {
  nodeId: "l0-editor",
  whyNow:
    "You will spend thousands of hours in this editor, so a little setup now pays off every day. VS Code does not run your Python; the interpreter you pick in the status bar does, and that picker is where most 'VS Code can't find my package' problems start. The Command Palette (one keystroke) reaches every command, and the debugger is worth using on day one. Watch out for the real trap: installing a pile of extensions and picking themes for an afternoon feels like setup but is just delay.",
  diagnostic: {
    prompt:
      "Cold, 2 minutes, in a folder of 3 small .py files. Do three things, under 60 seconds each: go to a definition, search the whole project for a string, and set a breakpoint. If you have never used more than a plain text editor, skip straight to the orient video.",
    minutes: 2,
  },
  orient: {
    title: "Getting Started with Visual Studio Code",
    creator: "Visual Studio Code (official)",
    url: "https://www.youtube.com/watch?v=f8_uF_IDV50",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=f8_uF_IDV50"),
    minutes: 7,
    whySelected: "The official UI tour (activity bar, Command Palette, terminal panel) so the workbench layout is in your head before the do-along.",
    unverified: true,
  },
  coreRead: [
    {
      title: "Getting Started with Python in VS Code, official tutorial",
      url: "https://code.visualstudio.com/docs/python/python-tutorial",
      sections:
        "Full, as a strict do-along: Python extension → workspace → 'Python: Create Environment' (venv) → select interpreter → run a file → set a breakpoint, step, watch a variable → pip install numpy inside the environment. Note which steps touch the venv, l0-python-setup re-explains exactly those.",
      minutes: 50,
      whySelected:
        "First-party and current (refreshed 2026-02-04). Covers every objective for this node as a do-along in under an hour, then hands off cleanly to l0-python-setup.",
    },
  ],
  recall: [
    { q: "What actually runs your Python code, VS Code or something else?", a: "The interpreter you selected; VS Code is a front-end. The status-bar interpreter picker decides which python, and whose site-packages, executes your file." },
    { q: "The one keystroke that reaches every VS Code command?", a: "Ctrl/Cmd-Shift-P, the Command Palette. Everything in the menus is a shortcut to it." },
    { q: "Your script is paused at a breakpoint. Name two things the debug view gives you that print() does not.", a: "Live variables/watch expressions and the call stack, plus line-by-line stepping from the paused state." },
    { q: "'VS Code can't find numpy', what do you check first?", a: "Which interpreter is selected: numpy was installed into one environment's site-packages, so the picker must point at that same environment." },
  ],
  practice: [
    {
      prompt:
        "Keyboard drill on a toy project, 5 reps each: Command Palette (Ctrl-Shift-P), quick-open (Ctrl-P), multi-cursor (Ctrl-D / Alt-click), rename symbol (F2), go-to-definition (F12), find-in-project (Ctrl-Shift-F), toggle terminal (Ctrl-`). Tie every rep to a real task, not typed into the air.",
      minutes: 15,
    },
    {
      prompt:
        "Turn on format-on-save with the default formatter. Then step through a 20-line script with one breakpoint and one watch expression, saying out loud what the debugger shows at each step.",
      minutes: 10,
    },
  ],
  implement: {
    spec:
      "Build two files of your own. First, keybindings-cheatsheet.md written from memory, 10+ shortcuts, each with a note on when to use it. Second, a saved workspace .vscode/settings.json with format-on-save on. This is the first config file you can explain line by line.",
    checks: [
      "Cheatsheet written cold, 10+ entries, each tied to a task",
      "settings.json present in the workspace and every line explainable aloud",
    ],
    minutes: 10,
  },
  stuck: {
    alternate: {
      title: "Getting started with debugging in VS Code",
      creator: "Visual Studio Code (official)",
      url: "https://www.youtube.com/watch?v=3HiLLByBWkg",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=3HiLLByBWkg"),
      minutes: 10,
      whySelected: "Breakpoints, call stack, and watch shown end to end. The demo uses Node.js, but the ideas carry straight over to Python.",
      unverified: true,
    },
    note: "Stuck on one topic? Open the matching official intro-videos docs page (code editing, productivity, or debugging). One page plus one short video for that topic, not the whole series.",
  },
  deepen: [
    {
      title: "Missing Semester 2026 L3, Development Environment and Tools (notes)",
      resourceId: "missing-semester",
      sections:
        "What a language server is, the thing actually powering go-to-definition and completion, and AI-assisted editing hygiene. Vim-mode is explicitly deferred: a month-3 productivity investment, not week-1.",
      minutes: 15,
    },
  ],
  prove: {
    task:
      "In a 3-file toy project that shares one function: rename the symbol across all files, jump between the definition and its usages, run it, then debug it to a breakpoint. Narrate it aloud and touch the mouse at most twice.",
    criteria: [
      "Rename landed in all three files; a project-wide search shows zero stale names",
      "All navigation by keyboard, and you kept to at most two mouse touches",
      "Breakpoint hit, and one watch expression read while paused",
      "You narrated the whole run, naming every keystroke as you went",
    ],
    minutes: 15,
  },
  transfer: {
    task:
      "Open a real cloned repo (this feeds l0-github's mastery test) and answer 'where is X defined and who calls it?' within 5 minutes, using quick-open, project search, and go-to-definition in a codebase you have never seen.",
    criteria: [
      "Answer produced in under 5 minutes",
      "Route was quick-open → project search → go-to-definition, not directory scrolling",
    ],
    minutes: 10,
  },
  retention:
    "7 days, cold: the 60-second diagnostic again, plus add a watch expression while stopped at a breakpoint. 30 days: is format-on-save still on, and which shortcut do you use least? Re-drill that one.",
  researchRecord: "docs/curation/l0-editor.md",
  minutes: 119,
};
