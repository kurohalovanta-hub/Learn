import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-functions.md (live-verified 2026-08-21).
// The Batchelder talk was deliberately NOT scheduled (URL unverifiable that
// session; the written model + experiment table deliver the same mental model
// faster) — it remains a named stuck path.

export const packet: LearningPacket = {
  nodeId: "l1-functions",
  whyNow:
    "Functions are the unit of thought: decomposing problems into named, testable pieces is what separates software from scripts — and it mirrors how the math ahead composes. This node also retires the two traps that bite hardest in real ML code, mutable default arguments and call-by-object-sharing, by building the names-bound-to-objects model once, properly. The same model will demystify shared class attributes at l1-classes.",
  diagnostic: {
    prompt:
      "Cold: (1) What does a function without return return? (2) Predict both outputs of def f(x, xs=[]): xs.append(x); return xs — called as f(1), then f(2). (3) def g(n): n = n + 1 — does the caller's variable change? Commit all three answers, then verify in the REPL.",
    minutes: 10,
  },
  coreRead: [
    {
      title: "Think Python 3e — Ch 3 'Functions' (full pass)",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 3 in full this time — signatures, bodies, docstrings, calling",
      minutes: 25,
      whySelected: "Read → immediately re-do 'Guido's Gorgeous Lasagna' to a professional standard.",
    },
    {
      title: "Think Python 3e — Ch 6 'Return Values'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 6 — fruitful functions vs None; print is display, return is value",
      minutes: 25,
      whySelected: "Kills the print-vs-return confusion — THE classic — then straight into writing compose(f, g).",
    },
    {
      title: "Least Astonishment and the Mutable Default Argument",
      url: "https://www.geeksforgeeks.org/python/least-astonishment-and-the-mutable-default-argument-in-python/",
      sections: "Full article — one trap: default values are evaluated ONCE, at def time",
      minutes: 8,
      whySelected: "Think Python does not dwell on the trap that will actually bite you in ML configs; ten minutes here buys permanent immunity.",
    },
    {
      title: "Python Programming FAQ — the function entries",
      url: "https://docs.python.org/3.10/faq/programming.html",
      sections: "'Why are default values shared between objects?' · 'Why did I get an UnboundLocalError…?' · 'How do I write a function with output parameters?'",
      minutes: 7,
      whySelected: "The same traps from the language's own mouth — first-party and exact.",
    },
  ],
  recall: [
    { q: "A function with no return (or a bare return) hands back…?", a: "None. print displays, return produces a value — a printing function used in an expression yields None everywhere." },
    { q: "When is a default argument value evaluated?", a: "Once, at def time. The same object is shared across all calls — which is why a mutable default accumulates state." },
    { q: "The sentinel pattern for a mutable default?", a: "def f(x, xs=None): if xs is None: xs = [] — a fresh list per call." },
    { q: "Inside def f(): x = x + 1 with x defined globally — what happens?", a: "UnboundLocalError: assignment anywhere in the body makes x local for the WHOLE function, so the read hits an unbound local name." },
    { q: "Python's argument passing in one sentence?", a: "Call-by-object-sharing: the parameter is a new name for the same object — in-place mutation escapes the function, rebinding does not." },
  ],
  practice: [
    {
      prompt:
        "After ch 3: re-do Exercism's 'Guido's Gorgeous Lasagna' cleanly — docstrings, named constants, zero duplication. You met it at l1-python-basics; now it should look professional.",
      source: "https://exercism.org/tracks/python/exercises/guidos-gorgeous-lasagna",
      minutes: 15,
    },
    {
      prompt: "After ch 6: write compose(f, g) returning a NEW function, and use it on two numeric transforms (e.g. deg→rad composed with rad→arc-length).",
      minutes: 15,
    },
    {
      prompt:
        "After the supplement: reproduce the xs=[] trap yourself, watch the list accumulate across calls, then fix it with the None-sentinel pattern and confirm the fix.",
      minutes: 10,
    },
    {
      prompt:
        "Refactor a 60-line procedural script into 6 functions with one clear job each (stitch your l1-control-flow programs into one file if you need a victim). Then write one pure and one side-effecting version of the same small task, and label which is which.",
      minutes: 50,
    },
    {
      prompt:
        "Exercism 'Unpacking and Multiple Assignment' concept exercise for *args/**kwargs exposure ('Locomotive Engineer'-style — confirm the exact name in-track).",
      source: "https://exercism.org/tracks/python/concepts",
      minutes: 20,
    },
  ],
  derive: {
    spec: "The call-by-object-sharing table, derived by experiment: for arguments of type int, str, tuple, list, dict — does (a) in-place mutation, (b) rebinding inside the function affect the caller? Write all 10 predictions down FIRST, run all 10, then state the rule as one paragraph in your own words.",
    checks: [
      "All 10 predictions committed to paper before the first run; disagreements journaled",
      "Table filled from actual runs, not reasoning after the fact",
      "Your paragraph uses names-bound-to-objects — the phrases 'by value' and 'by reference' do not appear",
    ],
    minutes: 25,
  },
  stuck: {
    alternate: {
      title: "CS50P Week 0 — the function segments",
      creator: "David Malan (Harvard)",
      url: "https://cs50.harvard.edu/python/weeks/0/",
      minutes: 25,
      whySelected: "Solid but slow — segments at 1.5–2×, only if the written model refuses to land.",
      unverified: true,
    },
    alternateRead: {
      title: "Least Astonishment and the Mutable Default Argument (longer treatment)",
      url: "https://www.pythontutorials.net/blog/least-astonishment-and-the-mutable-default-argument/",
      sections: "Full post — the same trap, slower and with more worked examples",
      minutes: 15,
    },
    note: "Draw box-and-arrow name→object diagrams for five of your own calls; step them in Python Tutor (find it by name). Last resort: Ned Batchelder's PyCon talk 'Facts and Myths about Python Names and Values' — locate by exact title; the same model, spoken.",
  },
  deepen: [
    {
      title: "Python Programming FAQ — remaining function entries",
      url: "https://docs.python.org/3.10/faq/programming.html",
      sections: "The rest of the functions section, as questions occur to you",
      minutes: 10,
    },
    {
      title: "The Python Tutorial — §4.8 keyword-only arguments",
      sections: "Keyword-only and positional-only parameters — navigate from the docs.python.org root",
      minutes: 10,
      whySelected: "Only the day a library signature forces it.",
    },
  ],
  prove: {
    task: "Node mastery test: take a messy ~80-line procedural script and produce a clean decomposition — functions with docstrings and one clear job each, zero globals — plus a one-sentence justification for every boundary. Run both versions on the same input and paste both outputs to show identical behavior.",
    criteria: [
      "Outputs identical before vs after (both pasted)",
      "No globals; every function has a docstring and a single job",
      "Each boundary justified: data flows in as parameters and out as return values — and you can say why THIS cut",
      "Pure functions separated from side-effecting ones, and labeled",
    ],
    minutes: 45,
  },
  transfer: {
    task: "Predict, then explain across the function boundary: def f(xs): xs.append(1) versus def f(xs): xs = xs + [1] — same caller list, different outcomes. Explain with names and objects, not folklore. Then find the planted mutable-default-class bug in an unfamiliar ~20-line snippet and state the one-line fix.",
    criteria: [
      "Predictions written before running",
      "Explanation names which object was mutated vs which name was rebound",
      "Bug found; the sentinel fix stated correctly",
    ],
    minutes: 15,
  },
  retention:
    "At +1 week: write the None-sentinel default pattern cold; then re-answer the default-argument diagnostic with a dict default instead of a list.",
  researchRecord: "docs/curation/l1-functions.md",
  minutes: 270,
};
