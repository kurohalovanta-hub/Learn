# l1-control-flow — Control Flow: Conditionals & Loops

Concept: if/elif/else, boolean logic and truthiness; for/while, range, break/continue,
nested loops; the two workhorse patterns (loop-accumulator, loop-search). First exposure to
algorithmic thinking and to off-by-one bugs.

Learner prerequisites: l1-python-basics (values, types, expressions, simple functions).

What beginners commonly misunderstand:
- `range(n)` is half-open (0..n-1) — the root of most off-by-one bugs; also
  `range(len(xs))` vs iterating `xs` directly.
- `=` vs `==` in conditions; chaining like `if x == 1 or 2:` "works" (truthy 2) but is wrong.
- while-loop update discipline: forgetting the state update → infinite loop; not knowing
  Ctrl-C is fine and nothing broke.
- Truthiness: `if xs:` vs `if xs != []:` vs `if len(xs) > 0` — all legal, one idiomatic.
- break/continue scope in nested loops (break exits the innermost loop only).
- Tracing: beginners run code hoping, instead of executing it in their head line by line —
  hand-tracing nested loops is the antidote (this node's diagnostic).

Candidate videos:
NOTE — same verification constraint as the cluster (search budget exhausted mid-session,
fetch egress blocked): no YouTube URLs surfaced, none are included.
1. CS50P Week 1 lecture "Conditionals" and Week 2 lecture "Loops" — David Malan — full
   lectures [approx 1.5–2.5 h each, unverified] — week pages listed at
   https://cs50.harvard.edu/python/weeks/ (verified). Time-inefficient as a linear watch;
   surgical stuck-path use only, via topic markers.
2. Corey Schafer — "Conditionals and Booleans" and "Loops and Iterations" episodes of his
   beginner series — [approx 10–16 min each; titles/durations unverified this session;
   url: none verified — locate by title]. Strong reputation for concision.
3. none further found — fallback: Think Python ch 5 + ch 7 notebooks carry the explanation.

Candidate written resources:
1. Think Python 3e ch 5 "Conditionals and Recursion" + ch 7 "Iteration and Search" —
   https://allendowney.github.io/ThinkPython/ (verified). Chapter numbers/titles verified
   via O'Reilly TOC pages
   (https://www.oreilly.com/library/view/think-python-3rd/9781098155421/ch05.html surfaced
   in search; ch 7 "Iteration and Search" confirmed in TOC retrieval). Exactly resolves the
   repo's coarser "Conditionals + iteration chapters" pointer.
2. Exercism concepts: Bools ("Ghost Gobble Arcade Game"), Comparisons, Conditionals
   ("Meltdown Mitigation" — a nuclear-reactor control system: thematically perfect for a
   future roboticist), Loops ("Making the Grade") — concept list and exercise pairings
   verified via https://exercism.org/tracks/python/concepts and
   https://exercism.org/tracks/python/exercises (17 concepts / 146 exercises confirmed).
3. PYnative exercises (loop section) — https://pynative.com/python-exercises-with-solutions/
   (verified) — overflow drills with solutions.
4. CS50P Week 1/Week 2 lecture notes (text) — via https://cs50.harvard.edu/python/weeks/
   (verified) — 15–25 min structured re-explanations, the written stuck path.

Community evidence:
- dev.to CodeNewbie "toughest concept" thread: loops/nested loops recur as the first real
  wall after syntax; what fixed it was tracing by hand and writing many tiny programs —
  supports the trace-and-predict drills here
  (https://dev.to/codenewbieteam/what-was-your-toughest-coding-concept-and-how-did-you-conquer-it-4nl8)
- dev.to "10 Python Concepts That Finally Clicked" lists loop/iteration patterns among
  late-clicking basics — argues for pattern-naming (accumulator, search) rather than
  syntax-only teaching (https://dev.to/naved_shaikh/10-python-concepts-that-finally-clicked-fgo)
- CS50P learner retrospective rates the course's structured weekly problem sets highly as
  practice, while noting the pace — consistent with using its psets/notes as backup, not
  spine (https://www.julianhal.com/programming/cs50p/)

Primary technical authority:
- The Python Tutorial §4 "More Control Flow Tools" and the Language Reference on compound
  statements (docs.python.org; FAQ page verified live this session:
  https://docs.python.org/3.10/faq/programming.html).

Selected shortest-sufficient packet (total ≈ 4.5 h of the node's 5 h):
- DIAGNOSTIC: hand-trace `for i in range(3): for j in range(i): print(i, j)` — write the
  exact output, then run. Plus: what does `while True:` + `break` mean? 5 min.
- ORIENT: —
- CORE WATCH: —
- CORE READ: two concept packets, each read→code within 30 min:
  (1) ch 5 conditionals/boolean sections, 20 min (read the recursion sections for
  exposure; recursion mastery is NOT gated here) → immediately Exercism "Ghost Gobble
  Arcade Game" + "Meltdown Mitigation"; (2) ch 7 "Iteration and Search", 25 min →
  immediately Exercism "Making the Grade".
- INTERACTIVE: —
- PRACTICE: FizzBuzz variants without looking anything up; Collatz sequence length; prime
  tester; number-guessing game; then deliberately write three off-by-one bugs, predict
  each's wrong output, verify (node spec exercises). ~2 h.
- IMPLEMENT/DERIVE: name the pattern before writing each practice program ("accumulator"
  / "search with early exit") — one-line comment at top; builds the pattern vocabulary.
- STUCK PATH: CS50P Week 1 (conditionals) / Week 2 (loops) notes first, lecture segment
  at 1.5–2× second (https://cs50.harvard.edu/python/weeks/, verified).
- DEEPEN: Python Tutorial §4 (else-on-loops, enumerate/zip preview) — only if curiosity
  demands; enumerate/zip get drilled at l1-data-structures anyway.
- PROVE IT: dice-histogram of 10,000 simulated roll sums, loops only, no libraries,
  working first or second run (node mastery test). ~40 min.
- TRANSFER: hand-trace an unseen 6-line nested loop with break/continue and state the
  output before running; then convert one of your for-loops to a while-loop and back.
- RETENTION: at +1 week: FizzBuzz + Collatz cold in under 10 minutes total; one new
  trace-by-hand nested-loop instance.

Why this won: the existing Think Python spine holds; the win is precision (ch 5 + ch 7 by
number, recursion explicitly parked, one named Exercism exercise bolted to each packet)
and the "reactor control" conditionals exercise, which lands the robotics framing early.
Reading time stays ≈45 min; everything else is fingers-on-keyboard, matching the gold
gate this node carries.

What was rejected (and why): full CS50P weeks 1–2 as primary (4+ h of lecture for ~45 min
of reading equivalent — wrong efficiency for this learner; kept as stuck path). Recursion
mastery here (Think Python introduces it in ch 5, but nothing downstream in L1–L3 gates
on it; deferring avoids a classic beginner morale sink). Codewars/LeetCode-style drill
sites (interview-skewed, no pedagogy ordering; Exercism + spec exercises suffice).

Risk of superficial understanding: FizzBuzz-class tasks are pattern-matchable from memory
of examples — the learner can "succeed" without being able to trace. The off-by-one-bug
construction exercise and hand-tracing transfer task are the guards: they require the
execution model, not the recipe.

Required active work: every practice program written from a blank file (no copy-paste
skeletons); predict every trace before running; surprise journal updated with each wrong
trace. The three deliberate off-by-one bugs must each come with a one-sentence explanation
of WHY the boundary was wrong.

Last verified: 2026-08-21
