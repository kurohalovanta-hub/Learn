import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-control-flow.md (live-verified 2026-08-21).
// No YouTube URL could be verified for this cluster that session; reading +
// blank-file practice carry the node — CS50P W1/W2 is the verified stuck path.

export const packet: LearningPacket = {
  nodeId: "l1-control-flow",
  whyNow:
    "Computation is repetition with decisions — and loops are your first real algorithms, plus your first off-by-one bugs. This node also installs the skill everything downstream leans on: executing code in your head, line by line, instead of running it and hoping. Two named patterns — accumulator and search-with-early-exit — will carry you from FizzBuzz to training loops. Reading stays at ~45 minutes; the rest is fingers on keyboard, matching the Gold gate this node carries.",
  diagnostic: {
    prompt:
      "Hand-trace, cold: for i in range(3): for j in range(i): print(i, j) — write the EXACT output line by line, then run to check. Second: what does while True: with a break inside mean, and when does that loop end?",
    minutes: 5,
  },
  coreRead: [
    {
      title: "Think Python 3e — Ch 5 'Conditionals and Recursion'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 5 — conditionals and boolean sections; read the recursion sections for exposure only (recursion mastery is NOT gated here)",
      minutes: 20,
      whySelected:
        "Read, then code within 30 minutes: straight into 'Ghost Gobble Arcade Game' and 'Meltdown Mitigation'.",
    },
    {
      title: "Think Python 3e — Ch 7 'Iteration and Search'",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 7 — while/for, and the two workhorse patterns you will name in every practice program",
      minutes: 25,
      whySelected: "Read → immediately Exercism 'Making the Grade'. Names the accumulator and search patterns explicitly.",
    },
  ],
  recall: [
    { q: "What does range(5) produce, and what is its last value?", a: "0, 1, 2, 3, 4 — half-open, it stops BEFORE 5. The same convention as slicing; the root of most off-by-one bugs." },
    { q: "Why is `if x == 1 or 2:` wrong even though it runs?", a: "It parses as (x == 1) or (2); 2 is truthy, so the branch always executes. Write x == 1 or x == 2, or x in (1, 2)." },
    { q: "break inside the inner of two nested loops exits…?", a: "Only the innermost loop; the outer loop keeps iterating." },
    { q: "The two workhorse loop patterns?", a: "Accumulator (build a result across iterations: total, count, best-so-far) and search (scan for a hit, exit early with break/return)." },
    { q: "Your while loop runs forever. What did you almost certainly forget — and is Ctrl-C safe?", a: "The state update that moves the condition toward False. Ctrl-C just raises KeyboardInterrupt; nothing is broken." },
  ],
  practice: [
    {
      prompt:
        "One Exercism exercise bolted to each read: after ch 5 — 'Ghost Gobble Arcade Game' (bools) and 'Meltdown Mitigation' (conditionals: a nuclear-reactor control system — your first controller). After ch 7 — 'Making the Grade' (loops).",
      source: "https://exercism.org/tracks/python/concepts",
      minutes: 45,
    },
    {
      prompt:
        "From a blank file each — no skeletons, nothing looked up: FizzBuzz plus two variants; Collatz sequence length; prime tester; number-guessing game. Before writing each one, put its pattern in a one-line comment at the top: 'accumulator' or 'search with early exit'. Predict every trace before running; journal every wrong trace.",
      minutes: 95,
    },
    {
      prompt:
        "Deliberately write three off-by-one bugs (loop bound, range endpoint, index-vs-length), predict each one's wrong output, run to verify, and add a one-sentence explanation of WHY that boundary is wrong.",
      minutes: 25,
    },
  ],
  implement: {
    spec: "patterns.md — after the practice set, one line per program naming its pattern (accumulator / search / both), its state variable(s), and their update. This is the vocabulary you will use to READ unfamiliar loops from here on.",
    checks: [
      "Every practice program carries its pattern comment at the top",
      "For each accumulator you can name the state variable, its initial value, and its update line",
    ],
    minutes: 10,
  },
  stuck: {
    alternate: {
      title: "CS50P Week 1 'Conditionals' / Week 2 'Loops' — notes, then lecture segments",
      creator: "David Malan (Harvard)",
      url: "https://cs50.harvard.edu/python/weeks/",
      minutes: 30,
      whySelected: "The verified backup path. Notes first (15–25 min, structured); lecture segment at 1.5–2× second, only the failing topic.",
      unverified: true,
    },
    note: "If a trace keeps surprising you, slow down and execute it on paper with a variables table — do not re-read yet.",
  },
  deepen: [
    {
      title: "The Python Tutorial — §4 'More Control Flow Tools'",
      sections: "Loop else clauses; a preview of enumerate/zip (drilled properly at l1-data-structures) — navigate from the docs.python.org root",
      minutes: 20,
      whySelected: "Only if curiosity demands — nothing here is gated yet.",
    },
  ],
  prove: {
    task: "Node mastery test, one sitting: print a text histogram of dice-roll sums over 10,000 simulated two-die rolls — loops and the random module only, no Counter, no numpy. It must work on the first or second run. Paste the printed histogram as your evidence.",
    criteria: [
      "Working on the first or second run — any fix driven by the traceback or a hand-trace, not trial and error",
      "Counts accumulated with your own loop accumulator (a dict or an 11-slot list), not a library",
      "Bars scaled sensibly (e.g. one mark per N rolls) and the counts sum to 10,000",
      "The pasted shape is the triangular two-dice distribution peaking at 7",
    ],
    minutes: 40,
  },
  transfer: {
    task: "Hand-trace an unseen ~6-line nested loop containing break and continue and write its exact output before running. Then take one of your for-loops, convert it to a while-loop and back, preserving behavior.",
    criteria: [
      "Predicted output exact — order and line count included",
      "You can state which loop the break exits",
      "The for↔while conversions behave identically on three test inputs",
    ],
    minutes: 15,
  },
  retention:
    "At +1 week: FizzBuzz and Collatz length, cold, in under 10 minutes combined; then one new nested-loop hand-trace with exact output written before running.",
  researchRecord: "docs/curation/l1-control-flow.md",
  minutes: 280,
};
