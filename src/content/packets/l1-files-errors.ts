import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-files-errors.md (live-verified 2026-08-21).
// The verified Think Python 3e TOC has NO dedicated exceptions chapter, so
// CS50P Week 3 notes are promoted to co-equal CORE READ for the exceptions
// half; ATBS keeps its repo role as the CSV/JSON recipe shelf.

export const packet: LearningPacket = {
  nodeId: "l1-files-errors",
  whyNow:
    "Every experiment you run reads a config and writes results. Exceptions are how research code fails loudly instead of lying to you. A swallowed error in a training script can cost a GPU-day and a wrong answer; a clear ValueError costs a minute. Here you build the two things you reuse in P1 and every later level (the JSON-lines logger and the reader that handles bad input), plus your own rule for when to catch an error and when to let it crash.",
  diagnostic: {
    prompt:
      "Cold, no notes: (1) When do you CATCH an exception versus let it crash? Give one example of each from an experiment script. (2) Write the try/finally version of with open(p) as f: and say exactly what with guarantees. (3) Predict what comes back from json.loads(json.dumps({1: (2, 3)})).",
    minutes: 10,
  },
  coreRead: [
    {
      title: "Think Python 3e, Ch 13 'Files and Databases'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 13 file sections; SKIM the database/shelve part, not gated here",
      minutes: 20,
      whySelected: "The file spine. Note: the verified 3e TOC has no dedicated exceptions chapter, so the CS50P notes below carry that half.",
    },
    {
      title: "CS50P Week 3 'Exceptions', lecture notes",
      url: "https://cs50.harvard.edu/python/weeks/",
      resourceId: "cs50p",
      sections: "Week 3 notes: raise, try/except/else, ValueError patterns",
      minutes: 15,
      whySelected: "The beginner exceptions reading, verified live. Read it, then design an error of your own instead of just suppressing one.",
    },
    {
      title: "CS50P Week 6 'File I/O', lecture notes",
      url: "https://cs50.harvard.edu/python/weeks/",
      resourceId: "cs50p",
      sections: "Week 6 notes: open/with, csv and json sections",
      minutes: 20,
      whySelected: "Covers the csv/json workflow at the depth you need; keep the ATBS CSV/JSON chapter open as your recipe shelf.",
    },
  ],
  recall: [
    { q: "Relative paths resolve against what?", a: "The process's current working directory, NOT the script's location. Print Path.cwd() when confused; notebooks make this worse." },
    { q: "What does with open(p) as f: guarantee, and what is it sugar for?", a: "f.close() runs on ANY exit, normal or exception. It is exactly try: body / finally: f.close()." },
    { q: "Why is bare except: banned in research code?", a: "It swallows every failure, typos included, and lets the program lie silently. Catch the narrowest type you can actually handle, or let it crash loudly." },
    { q: "Two things a JSON round-trip changes about a Python dict?", a: "Non-string keys become strings and tuples become lists: {1: (2, 3)} comes back as {'1': [2, 3]}." },
    { q: "'a' vs 'w' mode?", a: "'a' appends; 'w' truncates to empty on open, a re-run in 'w' clobbers your results file." },
    { q: "What is EAFP?", a: "Easier to Ask Forgiveness than Permission: try the operation and handle the exception, rather than pre-checking, the check races and duplicates the logic." },
  ],
  practice: [
    {
      prompt:
        "ORIENT, before the reading: break something on purpose and read the traceback from the bottom up: exception type, then message, then the innermost frame that is YOUR code. Tracebacks are how you talk to everything in this node.",
      minutes: 5,
    },
    {
      prompt:
        "After ch 13: write a text file and read it back with encoding='utf-8' set explicitly. Break the path on purpose, watch FileNotFoundError happen, run print(Path.cwd()) to see why, then fix it with pathlib instead of hardcoding an absolute path.",
      minutes: 10,
    },
    {
      prompt:
        "After the Week 3 notes: wrap your file reader in try/except with a narrow catch and a message that actually helps. Then add one deliberate raise ValueError(...) whose message you would be glad to read at 2 a.m.",
      minutes: 10,
    },
    {
      prompt:
        "After the Week 6 notes: round-trip a dict through json.dump and json.load, then write down the two things that changed (key types, tuples). Keep that note; it will explain a future bug.",
      minutes: 10,
    },
  ],
  implement: {
    spec: "Two pieces you keep and reuse in P1 and every later level. (1) An experiment logger that appends one json.dumps(...) per line to results.jsonl in mode 'a', plus a loader that reads it back and prints a run summary. (2) A reader that handles a missing file, bad encoding, and a malformed line, each with its own clear error path.",
    checks: [
      "Re-running the logger appends, it never clobbers earlier results",
      "The loader summarizes n runs correctly (count plus one aggregate)",
      "The three bad inputs produce three DIFFERENT, useful messages; no bare except anywhere",
      "The malformed-line path names the line number and the offending content",
    ],
    minutes: 70,
  },
  derive: {
    spec: "Your catch-vs-crash policy, five lines, in your own words. For example: catch at boundaries where you can add context or recover; never catch what you cannot handle; keep the original error (raise … from); crash loudly on a programmer bug; bare except is banned. Pin it, because every later script gets checked against it.",
    checks: [
      "Five lines or fewer, each one actionable on real code",
      "It bans silent swallowing and mandates preserving the original error",
    ],
    minutes: 15,
  },
  stuck: {
    alternate: {
      title: "CS50P Week 3 'Exceptions' / Week 6 'File I/O', lecture segments",
      creator: "David Malan (Harvard)",
      url: "https://cs50.harvard.edu/python/weeks/",
      minutes: 30,
      whySelected: "The slower spoken version of the notes you already read; watch at 1.5–2×, only the topic that tripped you.",
      unverified: true,
    },
    note: "When you just need a recipe ('how do I X with pathlib/csv?'), go straight to the ATBS lookup shelf instead of reading it start to finish.",
  },
  deepen: [
    {
      title: "The Python Tutorial §8 'Errors and Exceptions' + the pathlib how-to",
      sections: "§8 in full, else/finally clauses, exception chaining with raise … from; the pathlib how-to when a real script needs it. Navigate from the docs.python.org root.",
      minutes: 20,
      whySelected: "The official behavior, for when you outgrow the notes.",
    },
    {
      title: "Automate the Boring Stuff, 3rd ed.",
      url: "https://automatetheboringstuff.com/",
      resourceId: "atbs",
      sections: "Files chapters + the CSV/JSON chapter, recipe lookup only, never linear",
      minutes: 15,
      whySelected: "Your shelf for pathlib and csv/json boilerplate.",
    },
  ],
  prove: {
    task: "Node mastery test: write a config-driven script that reads params.json, checks the fields with clear errors, computes something small, and writes results.csv. Build five nasty inputs (missing file, malformed JSON, missing required key, wrong-type field, bad encoding) and throw them at it, then run it once more from a different working directory. Paste the five error messages and the top of results.csv.",
    criteria: [
      "All five bad inputs produce loud, specific messages with zero silent failures (all five pasted)",
      "Every catch adds context or recovers; no bare except anywhere",
      "results.csv survives a re-run without being clobbered (append or version)",
      "Works when launched from another directory, using pathlib rather than cwd luck",
    ],
    minutes: 45,
  },
  transfer: {
    task: "Take an unfamiliar traceback from someone else's failing script, three frames deep, raised inside a library call. Find where it fails, classify it (bug, bad input, or environment), and say whether the script should have caught it under your policy. Then add loud validation to YOUR l1-data-structures CSV parser.",
    criteria: [
      "Localization points at the deepest frame in the script's own code, not the library's",
      "The catch/no-catch verdict is consistent with your five-line policy",
      "The parser now fails loudly, naming the line, on a bad row",
    ],
    minutes: 15,
  },
  retention:
    "At +1 week: rewrite the JSON-lines logger cold in under 15 minutes; from memory, name the three failure modes the robust reader distinguishes and why bare except is banned in your codebase.",
  researchRecord: "docs/curation/l1-files-errors.md",
  minutes: 245,
};
