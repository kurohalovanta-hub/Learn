import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-data-structures.md (live-verified 2026-08-21).
// Aliasing gets triple coverage (read → reproduce → visualize) — it is the
// best-documented stall for this learner profile, and the same model that
// explains mutable defaults (behind) and class attributes (ahead).

export const packet: LearningPacket = {
  nodeId: "l1-data-structures",
  whyNow:
    "Datasets are lists of dicts; configs are dicts; trajectories are lists of tuples — choosing the structure IS half of programming. The core event of this node is aliasing: two names, one object, the classic 'why is my list changing?!' wall. You will read it, reproduce it, and prove it with id() — the same model that just explained mutable defaults and will explain shared class attributes next. Comprehensions become your default idiom, loop-first so they are never fog.",
  diagnostic: {
    prompt:
      "Predict, then run: a = [1, 2]; b = a; b.append(3); print(a). Now the b = a[:] version. Explain the memory model in two sentences. Also: what does xs = xs.sort() leave in xs? Finally — before any reading — draw the names→objects diagram for these snippets and keep it; the reading will confirm or correct it (commit-before-reveal).",
    minutes: 20,
  },
  coreRead: [
    {
      title: "Think Python 3e — Ch 9 'Lists'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 9 including the aliasing/references sections with their state diagrams",
      minutes: 30,
      whySelected: "The aliasing treatment this node pivots on. Read → 'Card Games', then reproduce-and-fix the aliasing bug with id() proof.",
    },
    {
      title: "Think Python 3e — Ch 10 'Dictionaries'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 10 — lookup, hashable keys, dicts as the config/record structure",
      minutes: 25,
      whySelected: "Read → straight into Exercism 'Inventory Management'.",
    },
    {
      title: "Think Python 3e — Ch 11 'Tuples'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 11 — tuple unpacking, tuples in dicts, what 'immutable' does and does not mean",
      minutes: 20,
      whySelected: "Read → Exercism 'Tisbury Treasure Hunt'. Trajectories are lists of tuples from here on.",
    },
    {
      title: "The Python Tutorial — §5 'Data Structures'",
      sections: "§5.1.3 (list comprehensions) through §5.4 (sets) — navigate from the docs.python.org root",
      minutes: 20,
      whySelected: "First-party on the default idiom. Read → 'Cater Waiter', then the loop→comprehension rewrites.",
    },
  ],
  recall: [
    { q: "b = a where a is a list — what got copied?", a: "Only the name binding. Both names point at the same list object; mutation through either is visible through both." },
    { q: "Three ways to make a one-level copy — and what all three fail to do?", a: "a[:], list(a), copy.copy(a) — all shallow: nested objects are still shared. Only copy.deepcopy severs those." },
    { q: "xs = xs.sort() leaves xs as…?", a: "None — sort() mutates in place and returns None (append too). Use sorted(xs) when you want a new list." },
    { q: "Why can't a list be a dict key?", a: "Keys must be hashable and mutable objects are not. Use a tuple of hashables instead." },
    { q: "xs[2:5] gives how many items — and what is xs[:]?", a: "Three (half-open, exactly like range); xs[:] is a full shallow copy." },
    { q: "A tuple is immutable — can anything inside it still change?", a: "Yes: the slots cannot be rebound, but a mutable element (a list inside) can still be mutated in place." },
  ],
  practice: [
    {
      prompt:
        "One Exercism exercise per structure, right after its chapter: 'Card Games' (lists), 'Inventory Management' (dicts), 'Tisbury Treasure Hunt' (tuples), 'Cater Waiter' (sets).",
      source: "https://exercism.org/tracks/python/exercises",
      minutes: 50,
    },
    {
      prompt:
        "Reproduce the aliasing bug (two names, one list), then fix it three ways — a[:], list(a), copy.copy(a) — proving with id() that each fix creates a distinct object.",
      minutes: 15,
    },
    {
      prompt:
        "Word-frequency counter → top-10, first without and then with collections.Counter; invert a dict; group a list of records by a field; flatten nested lists. Rule: every comprehension must first exist as its loop form in the same file, then be replaced.",
      minutes: 55,
    },
    {
      prompt:
        "The shallow-copy boundary: predict what copy.copy does to [[1, 2], [3, 4]] when you mutate an inner list; verify; write one sentence on when deepcopy is required.",
      minutes: 10,
    },
    {
      prompt: "Rewrite three of your l1-control-flow loops as comprehensions — but only where the comprehension reads better; nested past two levels stays a loop.",
      minutes: 10,
    },
  ],
  implement: {
    spec: "The structure-choice card: for five mini-scenarios — an experiment config, a robot trajectory, a set of visited states, a leaderboard, a graph adjacency — pick list / tuple / dict / set and defend each choice in one line.",
    checks: [
      "Each defense cites a property — mutability, ordering, lookup cost, hashability — not taste",
      "At least one choice is a tuple BECAUSE it must be hashable or fixed-shape",
    ],
    minutes: 20,
  },
  stuck: {
    alternateRead: {
      title: "Python: Mutability, immutability and their consequences",
      url: "https://dev.to/aaron_rose_0787cc8b4775a0/python-mutability-immutability-and-their-consequences-2hba",
      sections: "Full post — worked aliasing examples with id() checks",
      minutes: 10,
    },
    note: "Print id() before and after every operation that confuses you — the model becomes visible. Step similar snippets in Runestone FoPP's CodeLens or Python Tutor (find either by name). If the model still resists: Ned Batchelder's talk 'Facts and Myths about Python Names and Values', located by exact title.",
  },
  deepen: [
    {
      title: "Python Programming FAQ — 'How do I copy an object in Python?'",
      url: "https://docs.python.org/3.10/faq/programming.html",
      sections: "The copy entry (and re-skim the mutable-default entry — same root model)",
      minutes: 10,
    },
    {
      title: "collections module docs — Counter, defaultdict",
      sections: "Counter and defaultdict only — navigate from the docs.python.org root",
      minutes: 15,
      whySelected: "After the manual versions, never instead of them.",
    },
  ],
  prove: {
    task: "Node mastery test: parse a small CSV-like text (a dozen lines you write once, e.g. name,lab,hours rows) into a list of dicts, then filter by one criterion, aggregate by another (totals per group), and sort by multiple keys — comprehensions throughout, clean first-pass code. Paste the parsed records and the final aggregated, sorted output.",
    criteria: [
      "First-pass clean: at most one traceback fix, no debugging spiral",
      "Comprehensions used where they read better; none nested past two levels",
      "Mutating a filtered result leaves the source records intact — demonstrate it (no aliasing accident)",
      "Pasted output shows filter, aggregate and sort all correct",
    ],
    minutes: 45,
  },
  transfer: {
    task: "Navigate an unseen JSON-shaped blob — a list of dicts of lists, the exact shape of every robot-episode dataset record you will meet at L11+: extract three named quantities, one comprehension each. Then decide which of two proposed 'copies' of it is actually independent — and prove your answer with a mutation and an id() check.",
    criteria: [
      "Each extraction is a single comprehension",
      "The independence call is correct and proven, not asserted",
    ],
    minutes: 15,
  },
  retention:
    "At +1 week: the aliasing re-diagnostic in dict form (d2 = d1 vs dict(d1) vs a nested dict), then rewrite the word-frequency counter cold in under 15 minutes.",
  researchRecord: "docs/curation/l1-data-structures.md",
  minutes: 335,
};
