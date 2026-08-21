import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-python-basics.md (live-verified 2026-08-21).
// No YouTube URL could be verified for this cluster that session; the packet is
// complete without video — CS50P Week 0 is the verified stuck path.

export const packet: LearningPacket = {
  nodeId: "l1-python-basics",
  whyNow:
    "Every line of the next 209 days — regression, kinematics, the VLA fine-tune script — is built from these bricks: names bound to objects, types, expressions that evaluate. You also install two habits that compound forever: predict before you run, and read tracebacks as information instead of verdicts. Start inside the in-app lesson (its opening sections are your orientation), then consolidate with three short reading packets — you are writing code within the first 30 minutes.",
  diagnostic: {
    prompt:
      "Cold, before running anything: predict the outputs of 7//2, 7%2, 2**3**2, 'ab'*3, int('3.0'), type(3/1), and 0.1+0.2==0.3 — explain each aloud, then run them. Every wrong prediction goes into your surprise journal with the reason it surprised you.",
    minutes: 10,
  },
  lessonId: "l1-python-basics",
  coreRead: [
    {
      title: "Think Python 3e — Ch 1 'Programming as a Way of Thinking'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 1, worked IN the chapter notebook — do the embedded exercises inline",
      minutes: 25,
      whySelected:
        "Concept-first and Jupyter-native — the workflow transfers 1:1 to the scientific stack. Read, then go straight to the 20-expression predict-then-run set. Never read the three chapters back to back.",
    },
    {
      title: "Think Python 3e — Ch 2 'Variables and Statements'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 2, in the notebook — variables as names bound to objects, not boxes",
      minutes: 25,
      whySelected:
        "Plants the names-not-boxes model now — cheap insurance against the aliasing wall at l1-data-structures. Read, then straight into Exercism's 'Guido's Gorgeous Lasagna'.",
    },
    {
      title: "Think Python 3e — Ch 3 'Functions' (first pass)",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 3, defining and calling only — the full functions treatment waits for l1-functions",
      minutes: 25,
      whySelected: "Just enough def/call to wrap one unit conversion as a function in the implement task.",
    },
  ],
  recall: [
    { q: "7//2 and 7/2 — values and types?", a: "7//2 is 3 (int — floor division); 7/2 is 3.5 (float — / always returns float, even 4/2 == 2.0)." },
    { q: "Why does int('3.0') raise ValueError while int(3.0) works?", a: "String-to-int parsing accepts only integer literals — it does not do math for you. Parse the float first: int(float('3.0'))." },
    { q: "2**3**2 — value and why?", a: "512. ** is right-associative: 2**(3**2) = 2**9, not (2**3)**2 = 64." },
    { q: "Is a Python variable a box that holds a value?", a: "No — it is a name bound to an object. Assignment rebinds the name; it never copies the object." },
    { q: "Why is 0.1 + 0.2 == 0.3 False?", a: "Binary floating point cannot represent those decimals exactly; the sum is 0.30000000000000004. A property of floats, not a Python bug." },
  ],
  practice: [
    {
      prompt:
        "Immediately after ch 1: the 20-expression predict-then-run set — int/float division, precedence and associativity, string ops. Say each answer ALOUD before running; log every wrong prediction and its explanation in the surprise journal (it becomes your retention quiz bank).",
      minutes: 25,
    },
    {
      prompt:
        "After ch 2: Exercism 'Guido's Gorgeous Lasagna' (the Basics concept exercise), then the Numbers concept exercise — your first taste of the test-driven loop this curriculum runs on.",
      source: "https://exercism.org/tracks/python/concepts/basics",
      minutes: 30,
    },
    {
      prompt: "PYnative basic exercises 1–10 — extra reps with solutions; check only after committing an answer.",
      source: "https://pynative.com/python-basic-exercise-for-beginners/",
      minutes: 20,
    },
  ],
  implement: {
    spec: "convert.py — a unit-conversion calculator: degrees↔radians and m/s↔km/h, each conversion wrapped as its own function (this is the ch 3 pairing), results printed as an f-string formatted table with aligned columns.",
    checks: [
      "Each converter RETURNS its value — nothing prints inside the conversion functions",
      "Columns align via format specs (e.g. {x:8.3f}), not hand-counted spaces",
      "deg→rad→deg round-trips to the input for three spot-check values",
    ],
    minutes: 45,
  },
  stuck: {
    alternate: {
      title: "CS50P Week 0 — Functions, Variables (notes + lecture segments)",
      creator: "David Malan (Harvard)",
      url: "https://cs50.harvard.edu/python/weeks/0/",
      minutes: 30,
      whySelected:
        "The one verified video path for this node. Use the topic markers at 1.5–2×, only for the failing topic — never a linear watch (the full lecture runs hours).",
      unverified: true,
    },
    note: "Notes first, lecture segment second — and only the topic that is actually failing.",
  },
  deepen: [
    {
      title: "The Python Tutorial — 'An Informal Introduction to Python'",
      sections: "The informal introduction (numbers, strings) — navigate from the docs.python.org root",
      minutes: 20,
      whySelected: "First-party semantics of numbers, strings and operators — only if you want the language-lawyer version.",
    },
    {
      title: "Automate the Boring Stuff, 3rd ed. — ch 1–2",
      url: "https://automatetheboringstuff.com/",
      resourceId: "atbs",
      sections: "Ch 1–2 as extra drills",
      minutes: 20,
      whySelected: "Alternate drill track only — more reps, never a second spine.",
    },
  ],
  prove: {
    task: "From this verbal spec, first try, no reference: print a compound-interest table. Principal, annual rate and year count are variables at the top of the script; one row per year showing the year, the interest earned that year, and the closing balance, in aligned columns. Run it and paste the printed table as your evidence.",
    criteria: [
      "Built from the spec alone — no reference, no earlier code open",
      "Compounding math correct: one row verified against a hand calculation",
      "Columns aligned with f-string format specs; money shown to 2 decimals",
      "Any error fixed by reading the traceback, not by guessing",
    ],
    minutes: 30,
  },
  transfer: {
    task: "A REPL transcript with unfamiliar mixed expressions: -7//2, 7%-2, 2**-1, '3'+'4' versus 3+4. Predict every output AND state each result's type before running any of them.",
    criteria: [
      "All predictions written before touching the REPL",
      "Types stated, not just values (int vs float vs str)",
      "Every wrong prediction explained and journaled",
    ],
    minutes: 10,
  },
  retention:
    "At +72 h: a fresh 10-expression predict-then-run set (variant of the diagnostic), and rewrite the unit converter for a NEW unit pair from memory, cold.",
  researchRecord: "docs/curation/l1-python-basics.md",
  minutes: 320,
};
