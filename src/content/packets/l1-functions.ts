import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-functions.md (live-verified 2026-08-21).
// The Batchelder talk was deliberately NOT scheduled (URL unverifiable that
// session; the written model + experiment table deliver the same mental model
// faster), it remains a named stuck path.

export const packet: LearningPacket = {
  nodeId: "l1-functions",
  whyNow:
    "Break a problem into named, testable functions and you can build real programs, not just scripts. This node also clears the two traps that bite hardest in ML code (mutable default arguments and call-by-object-sharing) by teaching you once how names point to objects. That same picture makes shared class attributes easy to read later at l1-classes.",
  diagnostic: {
    prompt:
      "No notes. (1) What does a function with no return give back? (2) Predict both outputs of def f(x, xs=[]): xs.append(x); return xs, called as f(1) then f(2). (3) In def g(n): n = n + 1, does the caller's variable change? Write down all three answers first, then check each one in the REPL.",
    minutes: 10,
  },
  coreRead: [
    {
      title: "Think Python 3e, Ch 3 'Functions' (full pass)",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 3 in full this time, signatures, bodies, docstrings, calling",
      minutes: 25,
      whySelected: "After reading, redo 'Guido's Gorgeous Lasagna' right away and make it look professional this time.",
    },
    {
      title: "Think Python 3e, Ch 6 'Return Values'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 6, fruitful functions vs None; print is display, return is value",
      minutes: 25,
      whySelected: "Clears up the print-versus-return mixup, the classic beginner one, then you go write compose(f, g).",
    },
    {
      title: "Least Astonishment and the Mutable Default Argument",
      url: "https://www.geeksforgeeks.org/python/least-astonishment-and-the-mutable-default-argument-in-python/",
      sections: "Full article, one trap: default values are evaluated ONCE, at def time",
      minutes: 8,
      whySelected: "Think Python skips over the trap that will actually bite you in ML configs. Ten minutes here and it stops catching you for good.",
    },
    {
      title: "Python Programming FAQ, the function entries",
      url: "https://docs.python.org/3.10/faq/programming.html",
      sections: "'Why are default values shared between objects?' · 'Why did I get an UnboundLocalError…?' · 'How do I write a function with output parameters?'",
      minutes: 7,
      whySelected: "The same traps, straight from Python's own docs, exact and first-party.",
    },
  ],
  recall: [
    { q: "A function with no return (or a bare return) hands back…?", a: "None. print displays, return produces a value, a printing function used in an expression yields None everywhere." },
    { q: "When is a default argument value evaluated?", a: "Once, at def time. The same object is shared across all calls, which is why a mutable default accumulates state." },
    { q: "The sentinel pattern for a mutable default?", a: "def f(x, xs=None): if xs is None: xs = [], a fresh list per call." },
    { q: "Inside def f(): x = x + 1 with x defined globally, what happens?", a: "UnboundLocalError: assignment anywhere in the body makes x local for the WHOLE function, so the read hits an unbound local name." },
    { q: "Python's argument passing in one sentence?", a: "Call-by-object-sharing: the parameter is a new name for the same object, in-place mutation escapes the function, rebinding does not." },
  ],
  practice: [
    {
      prompt:
        "After ch 3, redo Exercism's 'Guido's Gorgeous Lasagna' cleanly, with docstrings, named constants, and no repeated code. You saw it at l1-python-basics; this time make it look professional.",
      source: "https://exercism.org/tracks/python/exercises/guidos-gorgeous-lasagna",
      minutes: 15,
    },
    {
      prompt: "After ch 6, write compose(f, g) that returns a new function, then use it on two number transforms (for example deg→rad composed with rad→arc-length).",
      minutes: 15,
    },
    {
      prompt:
        "After the supplement, make the xs=[] trap happen yourself and watch the list grow across calls. Then fix it with the None-sentinel pattern and confirm the fix holds.",
      minutes: 10,
    },
    {
      prompt:
        "Take a 60-line straight-through script and split it into 6 functions, each with one clear job (stitch your l1-control-flow programs into one file if you need something to work on). Then write one pure and one side-effecting version of the same small task, and label which is which.",
      minutes: 50,
    },
    {
      prompt:
        "Do the Exercism 'Unpacking and Multiple Assignment' concept exercise to get hands-on with *args and **kwargs ('Locomotive Engineer'-style; check the exact name in the track).",
      source: "https://exercism.org/tracks/python/concepts",
      minutes: 20,
    },
  ],
  derive: {
    spec: "Build the call-by-object-sharing table by experiment. For arguments of type int, str, tuple, list, dict, ask two things: does (a) changing it in place, or (b) rebinding it inside the function, affect the caller? Write all 10 predictions down first, run all 10, then state the rule in one paragraph in your own words.",
    checks: [
      "All 10 predictions committed to paper before the first run; disagreements journaled",
      "Table filled from actual runs, not reasoning after the fact",
      "Your paragraph uses names-bound-to-objects, the phrases 'by value' and 'by reference' do not appear",
    ],
    minutes: 25,
  },
  stuck: {
    alternate: {
      title: "CS50P Week 0, the function segments",
      creator: "David Malan (Harvard)",
      url: "https://cs50.harvard.edu/python/weeks/0/",
      minutes: 25,
      whySelected: "Solid but slow. Watch the segments at 1.5–2× speed, and only if the written model won't land.",
      unverified: true,
    },
    alternateRead: {
      title: "Least Astonishment and the Mutable Default Argument (longer treatment)",
      url: "https://www.pythontutorials.net/blog/least-astonishment-and-the-mutable-default-argument/",
      sections: "Full post, the same trap, slower and with more worked examples",
      minutes: 15,
    },
    note: "Draw box-and-arrow name→object diagrams for five of your own calls, then step through them in Python Tutor (find it by name). Last resort: Ned Batchelder's PyCon talk 'Facts and Myths about Python Names and Values' (search the exact title); it is the same model, spoken.",
  },
  deepen: [
    {
      title: "Python Programming FAQ, remaining function entries",
      url: "https://docs.python.org/3.10/faq/programming.html",
      sections: "The rest of the functions section, as questions occur to you",
      minutes: 10,
    },
    {
      title: "The Python Tutorial, §4.8 keyword-only arguments",
      sections: "Keyword-only and positional-only parameters, navigate from the docs.python.org root",
      minutes: 10,
      whySelected: "Only the day a library signature forces it.",
    },
  ],
  prove: {
    task: "Node mastery test. Take a messy ~80-line straight-through script and break it into clean functions, each with a docstring and one clear job, and no globals. Give a one-sentence reason for every split. Run the old and new versions on the same input and paste both outputs to prove they behave the same.",
    criteria: [
      "Outputs identical before vs after (both pasted)",
      "No globals; every function has a docstring and a single job",
      "Every split has a reason: data comes in as parameters and goes out as return values, and you can say why you cut it here",
      "Pure functions separated from side-effecting ones, and labeled",
    ],
    minutes: 45,
  },
  transfer: {
    task: "Predict, then explain what happens across the function boundary: def f(xs): xs.append(1) versus def f(xs): xs = xs + [1], same caller list but different results. Explain it with names and objects, not folklore. Then find the planted mutable-default-class bug in an unfamiliar ~20-line snippet and state the one-line fix.",
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
