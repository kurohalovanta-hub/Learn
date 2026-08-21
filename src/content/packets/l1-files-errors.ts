import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-files-errors.md (live-verified 2026-08-21).
// The verified Think Python 3e TOC has NO dedicated exceptions chapter, so
// CS50P Week 3 notes are promoted to co-equal CORE READ for the exceptions
// half; ATBS keeps its repo role as the CSV/JSON recipe shelf.

export const packet: LearningPacket = {
  nodeId: "l1-files-errors",
  whyNow:
    "Every experiment you will ever run reads a config and writes results — and exceptions are how research code fails loudly instead of lying silently. A swallowed error in a training script costs a GPU-day and a wrong conclusion; a clear ValueError costs a minute. This node builds the two artifacts P1 and every later level reuse (the JSON-lines logger and the robust reader), plus your personal catch-vs-crash policy.",
  diagnostic: {
    prompt:
      "Cold: (1) When do you CATCH an exception vs let it crash? One example of each from an experiment-script context. (2) Write the try/finally equivalent of with open(p) as f: — what exactly does with guarantee? (3) Predict: json.loads(json.dumps({1: (2, 3)})) — what precisely comes back?",
    minutes: 10,
  },
  coreRead: [
    {
      title: "Think Python 3e — Ch 13 'Files and Databases'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 13 file sections; SKIM the database/shelve part — not gated here",
      minutes: 20,
      whySelected: "The file spine. Note: the verified 3e TOC has no dedicated exceptions chapter — the CS50P notes below carry that half.",
    },
    {
      title: "CS50P Week 3 'Exceptions' — lecture notes",
      url: "https://cs50.harvard.edu/python/weeks/",
      resourceId: "cs50p",
      sections: "Week 3 notes: raise, try/except/else, ValueError patterns",
      minutes: 15,
      whySelected: "The dedicated beginner exceptions treatment, first-party-adjacent and verified live — read → immediately design an error, don't just suppress one.",
    },
    {
      title: "CS50P Week 6 'File I/O' — lecture notes",
      url: "https://cs50.harvard.edu/python/weeks/",
      resourceId: "cs50p",
      sections: "Week 6 notes: open/with, csv and json sections",
      minutes: 20,
      whySelected: "Covers the csv/json workflow at exactly the needed depth; keep the ATBS CSV/JSON chapter open as the recipe shelf.",
    },
  ],
  recall: [
    { q: "Relative paths resolve against what?", a: "The process's current working directory — NOT the script's location. Print Path.cwd() when confused; notebooks make this worse." },
    { q: "What does with open(p) as f: guarantee, and what is it sugar for?", a: "f.close() runs on ANY exit, normal or exception. It is exactly try: body / finally: f.close()." },
    { q: "Why is bare except: banned in research code?", a: "It swallows every failure — typos included — and lets the program lie silently. Catch the narrowest type you can actually handle, or let it crash loudly." },
    { q: "Two things a JSON round-trip changes about a Python dict?", a: "Non-string keys become strings and tuples become lists: {1: (2, 3)} comes back as {'1': [2, 3]}." },
    { q: "'a' vs 'w' mode?", a: "'a' appends; 'w' truncates to empty on open — a re-run in 'w' clobbers your results file." },
    { q: "What is EAFP?", a: "Easier to Ask Forgiveness than Permission: try the operation and handle the exception, rather than pre-checking — the check races and duplicates the logic." },
  ],
  practice: [
    {
      prompt:
        "ORIENT — first, before the reading: break something on purpose and narrate the traceback bottom-up: exception type → message → innermost frame that is YOUR code. Tracebacks are the interface to this whole node.",
      minutes: 5,
    },
    {
      prompt:
        "After ch 13: write then read back a text file with encoding='utf-8' explicit. Break the path on purpose, observe FileNotFoundError, print(Path.cwd()) to see WHY, then fix it properly with pathlib — not by hardcoding an absolute path.",
      minutes: 10,
    },
    {
      prompt:
        "After the Week 3 notes: wrap your file reader in try/except with a NARROW catch and an informative message; then add one deliberate raise ValueError(...) whose message you would want to meet at 2 a.m.",
      minutes: 10,
    },
    {
      prompt:
        "After the Week 6 notes: round-trip a dict through json.dump → json.load and document the two things that changed (key types, tuples). Keep the note — it explains a future bug.",
      minutes: 10,
    },
  ],
  implement: {
    spec: "Two artifacts, kept and reused by P1 and every later level: (1) experiment logger — append one json.dumps(...) per line to results.jsonl in mode 'a', plus a loader that reads it back and prints a run summary; (2) robust reader — handles missing file, bad encoding, malformed line, each with a DISTINCT, informative error path.",
    checks: [
      "Re-running the logger appends — it never clobbers earlier results",
      "The loader summarizes n runs correctly (count plus one aggregate)",
      "The three bad inputs produce three DIFFERENT, useful messages; no bare except anywhere",
      "The malformed-line path names the line number and the offending content",
    ],
    minutes: 70,
  },
  derive: {
    spec: "Your catch-vs-crash policy, five lines, in your own words — e.g.: catch at boundaries where you can add context or recover; never catch what you cannot handle; preserve the original error (raise … from); crash loudly on programmer error; bare except is banned. Pin it — every later script gets audited against it.",
    checks: [
      "Five lines or fewer, each one actionable on real code",
      "It bans silent swallowing and mandates preserving the original error",
    ],
    minutes: 15,
  },
  stuck: {
    alternate: {
      title: "CS50P Week 3 'Exceptions' / Week 6 'File I/O' — lecture segments",
      creator: "David Malan (Harvard)",
      url: "https://cs50.harvard.edu/python/weeks/",
      minutes: 30,
      whySelected: "The slower spoken version of the notes you already read — segments at 1.5–2×, failing topic only.",
      unverified: true,
    },
    note: "For recipe-level unblocking ('how do I X with pathlib/csv?') go straight to the ATBS lookup shelf, never a linear read.",
  },
  deepen: [
    {
      title: "The Python Tutorial §8 'Errors and Exceptions' + the pathlib how-to",
      sections: "§8 in full — else/finally clauses, exception chaining with raise … from; the pathlib how-to when a real script needs it. Navigate from the docs.python.org root.",
      minutes: 20,
      whySelected: "First-party semantics for when you outgrow the notes.",
    },
    {
      title: "Automate the Boring Stuff, 3rd ed.",
      url: "https://automatetheboringstuff.com/",
      resourceId: "atbs",
      sections: "Files chapters + the CSV/JSON chapter — recipe lookup only, never linear",
      minutes: 15,
      whySelected: "The designated shelf for pathlib and csv/json boilerplate.",
    },
  ],
  prove: {
    task: "Node mastery test: a config-driven script — reads params.json, validates fields with clear errors, computes something small, writes results.csv. Design five adversarial inputs (missing file, malformed JSON, missing required key, wrong-type field, bad encoding) and throw them at it; then run it once more from a DIFFERENT working directory. Paste the five error messages and the head of results.csv.",
    criteria: [
      "All five adversarial inputs produce loud, specific messages — zero silent failures (all five pasted)",
      "Every catch adds context or recovers; no bare except anywhere",
      "results.csv survives a re-run without being clobbered (append or version)",
      "Works when launched from another directory — pathlib, not cwd luck",
    ],
    minutes: 45,
  },
  transfer: {
    task: "Take an unfamiliar traceback from someone else's failing script — three frames deep, raised inside a library call. Localize the failure, classify it (bug vs bad input vs environment), and state whether the script should have caught it, per your policy. Then add loud validation to YOUR l1-data-structures CSV parser.",
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
