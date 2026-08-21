import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l0-terminal.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l0-terminal",
  whyNow:
    "Every tool in the next 210 days — Python, git, simulators, GPU training — is driven from a shell, and you have never opened one. That is unfamiliarity, not difficulty: about ten commands as reflexes, plus pipes and redirection as the composition habit, make the terminal the fast way. Commands are not incantations; they are programs with arguments, and errors and man pages are structured information, not noise. This node is the substrate for everything else. (Windows: install WSL2 + Ubuntu first so every command behaves like the Linux the whole curriculum assumes; macOS Terminal is fine as-is.)",
  diagnostic: {
    prompt:
      "Cold, 5 min, no AI: open a terminal; predict then verify pwd, ls -l, cd .. — say what each will print BEFORE Enter. Explain what cat data.txt | grep error | wc -l prints for a 6-line sample file shown on paper. Write the find command for 'all *.log modified in the last day'. Fluent at all of it → jump straight to the prove-it run.",
    minutes: 5,
  },
  orient: {
    title: "Missing Semester 2026 L1 — Course Overview + Introduction to the Shell (opening segment)",
    creator: "MIT (Missing Semester)",
    url: "https://www.youtube.com/watch?v=MSgoeuMqUmU",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=MSgoeuMqUmU", 0, 1200),
    endSeconds: 1200,
    minutes: 20,
    whySelected:
      "Watching someone drive a terminal is the fastest cure for never-opened-one paralysis. Watch motivation → what a shell is → navigation, at 1.25–1.5×, and stop when the tools tour begins — the rest of the hour is better spent typing.",
    unverified: true,
  },
  coreRead: [
    {
      title: "Missing Semester 2026 L1 notes",
      url: "https://missing.csail.mit.edu/2026",
      resourceId: "missing-semester",
      sections:
        "Full, typing EVERY command into your own shell as you read: what a shell is → navigation and paths → PATH and which → cat/sort/uniq/head/tail/grep/find → pipes and redirection → scripts. Skim the awk/sed/jq passages — they return in later exercises and in data wrangling.",
      minutes: 25,
      whySelected: "The single best-fit read: ~4,200 words that motivate the shell for people who think well, carrying 19 real exercises.",
    },
    {
      title: "Missing Semester 2020 L2 — Shell Tools and Scripting notes (selected sections)",
      resourceId: "missing-semester",
      sections:
        "Second sitting, still typing along: 'finding how to use commands' (man/tldr), 'finding files' (find), 'finding code' (grep), 'finding shell commands' (history, Ctrl-R).",
      minutes: 15,
      whySelected: "The deeper find/grep/history material the 2026 L1 compresses — exactly the lookup reflexes the exercises need.",
    },
  ],
  recall: [
    { q: "In cat log.txt | grep error | wc -l, what flows between the three programs, and what does the final number mean?", a: "Each | connects one program's stdout to the next program's stdin; the output is the count of lines in log.txt containing 'error'." },
    { q: "What does the shell do with PATH when you type ls?", a: "It searches each PATH directory in order for an executable named ls and runs the first match — which ls shows you what it found." },
    { q: "Difference between > and >> ?", a: "> truncates the target file then writes; >> appends. Both redirect stdout only — stderr needs 2>." },
    { q: "A command just failed. How do you see its exit code, and what does nonzero mean?", a: "echo $? — 0 is success, anything else is failure; && and || chain on exactly this value." },
    { q: "Where does rm move a file?", a: "Nowhere — there is no trash can in the shell; the file is gone. Look at the command (tab-completion helps you not typo it) before Enter." },
  ],
  practice: [
    {
      prompt:
        "Missing Semester 2026 L1 exercises #1–#14, in your own shell: shell check, ls -l flag semantics, globs, quoting, redirection, && and || chaining, why cd must be a builtin, the test -f script, chmod +x, set -x tracing, date-stamped backups, flaky-script arguments, top file extensions, xargs line count. Skip the jq/awk ones on the first pass.",
      source: "https://missing.csail.mit.edu/2026",
      minutes: 60,
    },
    {
      prompt: "Missing Semester 2020 L2 exercises #1 (the four-requirement ls flags task) and #2 (marco/polo shell functions).",
      source: "Missing Semester 2020 L2 notes (Shell Tools & Scripting)",
      minutes: 15,
    },
    {
      prompt:
        "The node's own three: (a) find every .py file under a directory tree containing 'import numpy', using find + grep; (b) write a one-liner that counts lines of code in a project excluding blank lines; (c) break your PATH on purpose, watch ls fail, explain why it failed, then fix it in the same session.",
      minutes: 20,
    },
  ],
  implement: {
    spec:
      "cheatsheet.md, written FROM MEMORY at the end of the packet: every command you now own, each with a one-line 'when I reach for it'. Then check it against The Art of Command Line's Basics section — the delta is your review list.",
    checks: [
      "Written cold — no shell history, no notes open",
      "Every entry has a when-I-reach-for-it, not just a name",
      "Delta against The Art of Command Line captured as an explicit review list",
    ],
    minutes: 15,
  },
  stuck: {
    alternate: {
      title: "Linux Terminal for Beginners — The Complete Starter Guide",
      creator: "tutorialsEU (per Class Central listing)",
      url: "https://www.youtube.com/watch?v=i0DX8U5ttqQ",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=i0DX8U5ttqQ"),
      minutes: 30,
      whySelected: "A gentler second telling, explicitly aimed at people who avoided the terminal because it looks intimidating — use only if the MIT pacing is the problem.",
      unverified: true,
    },
    alternateRead: {
      title: "OverTheWire: Bandit (levels 0–8)",
      url: "https://overthewire.org/wargames/bandit/",
      sections: "Levels 0–8 — cat/ls/find/grep puzzles behind an SSH login; freeCodeCamp's walkthrough exists if truly stuck.",
      minutes: 60,
    },
    note: "Prefer Bandit over re-watching anything: the puzzle format forces recall of the commands with no way to fake it.",
  },
  deepen: [
    {
      title: "The Art of Command Line",
      url: "https://github.com/jlevy/the-art-of-command-line",
      sections: "Basics + Everyday use — the post-packet cheat sheet; too dense as a first read, ideal as the reference you diff your own cheatsheet against.",
      minutes: 30,
    },
    {
      title: "Missing Semester 2026 L2 — Command-line Environment notes",
      resourceId: "missing-semester",
      sections: "Streams, environment variables, return codes, signals and job control — scheduled anyway before l0-github's SSH work.",
      minutes: 25,
    },
  ],
  prove: {
    task:
      "The mastery run: generate the provided messy directory of 100 mixed files, then — shell only, no file manager, no AI, 25-minute cap — organize them into subdirectories by type, find the 3 files containing a given string, batch-rename by pattern, and archive the result. Your command history is the evidence: paste it.",
    criteria: [
      "Shell only end to end — the file manager and AI never opened",
      "The 3 matching files found with find/grep, not by opening files one by one",
      "Batch rename done with a glob/loop/xargs pattern, not a hundred manual mv commands",
      "Archive verified readable (tar -tf) inside the 25-minute cap",
    ],
    minutes: 25,
  },
  transfer: {
    task:
      "Bandit levels 9–12 — an unfamiliar puzzle context that adds sort, uniq and strings under pressure. Then one real task: untangle your actual Downloads folder from the shell, and paste the before/after listings.",
    criteria: [
      "Levels 9–12 passed without a walkthrough",
      "Downloads reorganized with mkdir/globs/mv — before and after ls captured",
    ],
    minutes: 35,
  },
  retention:
    "7 days, cold: re-write the error-counting pipeline and the find command for '*.log modified in the last day', and explain PATH in two sentences. 30 days: the LOC one-liner from memory.",
  researchRecord: "docs/curation/l0-terminal.md",
  minutes: 235,
};
