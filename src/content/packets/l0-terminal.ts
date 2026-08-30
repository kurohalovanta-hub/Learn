import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l0-terminal.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l0-terminal",
  whyNow:
    "Every tool you touch in the next 210 days runs from a shell: Python, git, simulators, GPU training. If you have never opened one, that is unfamiliar, not hard. Learn about ten commands until they are reflex, then learn to pipe them together, and the terminal becomes the fast way to work. Commands are just programs you hand arguments to, and errors and man pages are information you can read. Everything later sits on top of this. (Windows: install WSL2 and Ubuntu first so your commands behave like the Linux the rest of the course assumes; the macOS Terminal works as is.)",
  diagnostic: {
    prompt:
      "Cold, 5 minutes, no AI. Open a terminal. Before you press Enter, say what pwd, ls -l, and cd .. will each print, then run them and check. On paper, work out what cat data.txt | grep error | wc -l prints for a 6-line sample file. Write the find command for 'all *.log modified in the last day'. If all of that came easily, skip ahead to the prove-it run.",
    minutes: 5,
  },
  orient: {
    title: "Missing Semester 2026 L1, Course Overview + Introduction to the Shell (opening segment)",
    creator: "MIT (Missing Semester)",
    url: "https://www.youtube.com/watch?v=MSgoeuMqUmU",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=MSgoeuMqUmU", 0, 1200),
    endSeconds: 1200,
    minutes: 20,
    whySelected:
      "Watching someone drive a terminal is the quickest way past the fear of opening one. Watch the motivation, then what a shell is, then navigation, at 1.25 to 1.5 speed, and stop when the tools tour starts. The rest of the hour is better spent typing.",
    unverified: true,
  },
  coreRead: [
    {
      title: "Missing Semester 2026 L1 notes",
      url: "https://missing.csail.mit.edu/2026",
      resourceId: "missing-semester",
      sections:
        "Full, typing EVERY command into your own shell as you read: what a shell is → navigation and paths → PATH and which → cat/sort/uniq/head/tail/grep/find → pipes and redirection → scripts. Skim the awk/sed/jq passages, they return in later exercises and in data wrangling.",
      minutes: 25,
      whySelected: "The best read for this: about 4,200 words that make the case for the shell to a sharp reader, with 19 real exercises built in.",
    },
    {
      title: "Missing Semester 2020 L2, Shell Tools and Scripting notes (selected sections)",
      resourceId: "missing-semester",
      sections:
        "Second sitting, still typing along: 'finding how to use commands' (man/tldr), 'finding files' (find), 'finding code' (grep), 'finding shell commands' (history, Ctrl-R).",
      minutes: 15,
      whySelected: "The deeper find, grep, and history material that the 2026 L1 notes only touch on. These are the lookup reflexes the exercises need.",
    },
  ],
  recall: [
    { q: "In cat log.txt | grep error | wc -l, what flows between the three programs, and what does the final number mean?", a: "Each | connects one program's stdout to the next program's stdin; the output is the count of lines in log.txt containing 'error'." },
    { q: "What does the shell do with PATH when you type ls?", a: "It searches each PATH directory in order for an executable named ls and runs the first match, which ls shows you what it found." },
    { q: "Difference between > and >> ?", a: "> truncates the target file then writes; >> appends. Both redirect stdout only, stderr needs 2>." },
    { q: "A command just failed. How do you see its exit code, and what does nonzero mean?", a: "echo $?, 0 is success, anything else is failure; && and || chain on exactly this value." },
    { q: "Where does rm move a file?", a: "Nowhere, there is no trash can in the shell; the file is gone. Look at the command (tab-completion helps you not typo it) before Enter." },
  ],
  practice: [
    {
      prompt:
        "Work through Missing Semester 2026 L1 exercises #1 through #14 in your own shell: the shell check, ls -l flag meanings, globs, quoting, redirection, chaining with && and ||, why cd has to be a builtin, the test -f script, chmod +x, set -x tracing, date-stamped backups, flaky-script arguments, top file extensions, and the xargs line count. Skip the jq and awk ones this first time.",
      source: "https://missing.csail.mit.edu/2026",
      minutes: 60,
    },
    {
      prompt: "Missing Semester 2020 L2 exercises #1 (the four-requirement ls flags task) and #2 (the marco/polo shell functions).",
      source: "Missing Semester 2020 L2 notes (Shell Tools & Scripting)",
      minutes: 15,
    },
    {
      prompt:
        "Three of your own: (a) using find and grep, list every .py file under a directory tree that contains 'import numpy'; (b) write a one-liner that counts lines of code in a project, not counting blank lines; (c) break your PATH on purpose, watch ls stop working, say why it failed, then fix it in the same session.",
      minutes: 20,
    },
  ],
  implement: {
    spec:
      "Write cheatsheet.md from memory at the end of the packet: every command you now know, each with a one-line note on when you reach for it. Then check it against The Art of Command Line's Basics section. Whatever you missed becomes your review list.",
    checks: [
      "Written cold, no shell history, no notes open",
      "Every entry has a when-I-reach-for-it, not just a name",
      "Delta against The Art of Command Line captured as an explicit review list",
    ],
    minutes: 15,
  },
  stuck: {
    alternate: {
      title: "Linux Terminal for Beginners, The Complete Starter Guide",
      creator: "tutorialsEU (per Class Central listing)",
      url: "https://www.youtube.com/watch?v=i0DX8U5ttqQ",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=i0DX8U5ttqQ"),
      minutes: 30,
      whySelected: "A gentler second take, made for people who avoided the terminal because it looks scary. Use it only if the MIT pacing is what tripped you up.",
      unverified: true,
    },
    alternateRead: {
      title: "OverTheWire: Bandit (levels 0–8)",
      url: "https://overthewire.org/wargames/bandit/",
      sections: "Levels 0–8, cat/ls/find/grep puzzles behind an SSH login; freeCodeCamp's walkthrough exists if truly stuck.",
      minutes: 60,
    },
    note: "Reach for Bandit before re-watching anything. The puzzle format makes you recall the commands yourself, with no way to fake it.",
  },
  deepen: [
    {
      title: "The Art of Command Line",
      url: "https://github.com/jlevy/the-art-of-command-line",
      sections: "Basics + Everyday use, the post-packet cheat sheet; too dense as a first read, ideal as the reference you diff your own cheatsheet against.",
      minutes: 30,
    },
    {
      title: "Missing Semester 2026 L2, Command-line Environment notes",
      resourceId: "missing-semester",
      sections: "Streams, environment variables, return codes, signals and job control, scheduled anyway before l0-github's SSH work.",
      minutes: 25,
    },
  ],
  prove: {
    task:
      "The mastery run. Generate the provided messy directory of 100 mixed files. Then, using the shell only (no file manager, no AI, 25-minute cap), sort them into subdirectories by type, find the 3 files that contain a given string, batch-rename by pattern, and archive the result. Your command history is the proof, so paste it.",
    criteria: [
      "Shell only from start to finish; you never opened the file manager or AI",
      "The 3 matching files found with find and grep, not by opening files one at a time",
      "Batch rename done with a glob, loop, or xargs, not a hundred manual mv commands",
      "Archive checked readable with tar -tf, inside the 25-minute cap",
    ],
    minutes: 25,
  },
  transfer: {
    task:
      "Bandit levels 9 through 12. These are unfamiliar puzzles that make you use sort, uniq, and strings under a little pressure. Then one real task: clean up your actual Downloads folder from the shell, and paste the before and after listings.",
    criteria: [
      "Levels 9 through 12 passed without a walkthrough",
      "Downloads reorganized with mkdir, globs, and mv, with the before and after ls captured",
    ],
    minutes: 35,
  },
  retention:
    "7 days, cold: re-write the error-counting pipeline and the find command for '*.log modified in the last day', and explain PATH in two sentences. 30 days: the LOC one-liner from memory.",
  researchRecord: "docs/curation/l0-terminal.md",
  minutes: 235,
};
