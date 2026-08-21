# l1-python-basics — Python: Values, Types & Expressions

Concept: Variables, int/float/str/bool, expressions, operator precedence, f-strings; reading
type errors as information; REPL vs notebook vs script workflows. The first bricks of the
entire code track.

Learner prerequisites: l0-python-setup only (working interpreter + Jupyter + editor).
Zero programming assumed; grade-10 math is plenty.

What beginners commonly misunderstand:
- `/` vs `//` and the int/float divide; `int('3.0')` raising ValueError (string→int parsing
  is not "do the math for me") — exactly the traps in this node's diagnostic.
- Precedence + associativity: `2**3**2` is right-associative (512, not 64); unary minus with `**`.
- "A variable is a box that holds a value." It is a *name bound to an object* — planting the
  names-not-boxes model NOW is the cheap insurance against the aliasing wall at
  l1-data-structures (community evidence below shows mutability is the classic stall).
- Type errors read as "I failed" instead of "the interpreter told me precisely what's wrong."
  Treating tracebacks as data is an explicit objective here.
- Float surprise: `0.1 + 0.2 != 0.3` — binary floating point, not a Python bug.

Candidate videos:
NOTE — verification constraint this session: web-search budget was exhausted by parallel
agents and direct fetch egress is proxy-blocked, so NO YouTube URLs could be surfaced or
verified. Per the URL-integrity rule, no YouTube URLs are included. The packet is designed
to be complete without video; the one verified video path is CS50P.
1. CS50P Week 0 lecture "Functions, Variables" — David Malan (Harvard) — full-lecture length
   [approx 2–3 h, unverified] — https://cs50.harvard.edu/python/weeks/0/ (page verified in
   search results 2026-08-21). Score notes: correctness 5, beginner fit 5, production 5,
   time efficiency 2 as a linear watch (use topic markers at 1.5–2× only when stuck).
2. Corey Schafer — "Python Tutorial for Beginners 2: Strings" and "3: Integers and Floats" —
   [approx 10–20 min each, titles/durations unverified this session; url: none verified —
   locate by title if wanted]. Historically the most-recommended concise beginner series;
   pre-3.12 era but this material is not dated.
3. none further found — fallback: the in-app lesson (below) plus Think Python ch 1–2 carry
   the explanation load; video is optional for this node.

Candidate written resources:
1. Think Python, 3rd ed. (Downey, 2024) ch 1 "Programming as a Way of Thinking", ch 2
   "Variables and Statements", ch 3 "Functions" (first pass) —
   https://allendowney.github.io/ThinkPython/ (verified live; every chapter a runnable
   Jupyter notebook — notebooks at https://github.com/AllenDowney/ThinkPython, verified).
   Chapter numbering cross-verified against the O'Reilly edition TOC:
   https://www.oreilly.com/library/view/think-python-3rd/9781098155421/ (ch01/ch03 pages
   surfaced directly). 5/5 fit: concise, concept-first, respects an intelligent adult.
2. Exercism Python track, "Basics" concept —
   https://exercism.org/tracks/python/concepts/basics (verified) with concept exercise
   "Guido's Gorgeous Lasagna" —
   https://exercism.org/tracks/python/exercises/guidos-gorgeous-lasagna (verified).
   Track confirmed live: 17 concepts, 146 exercises, free (https://exercism.org/tracks/python).
3. PYnative "Python Basic Exercise for Beginners" (15 problems w/ solutions) —
   https://pynative.com/python-basic-exercise-for-beginners/ (verified) — drill sheet if
   more reps needed.
4. Automate the Boring Stuff 3e ch 1–2 — existing repo reference resource (`atbs`,
   lastVerified 2026-08-21) — alternate drill track only.

Community evidence:
- discuss.python.org: a beginner working "Guido's Gorgeous Lasagna" gets stuck on how
  functions/values fit together on literally the first Exercism exercise — evidence that
  pairing ch 1–3 reading with that exact exercise (rather than reading ahead) is the right
  interleave (https://discuss.python.org/t/learning-functions-using-exercism-org-guidos-gorgeous-lasagna-spoiler-warning/12212)
- dev.to "10 Python Concepts That Finally Clicked": mutable-vs-immutable is the archetypal
  "why is my list changing?!" wall — the names/values model planted in this node is what
  later prevents it (https://dev.to/naved_shaikh/10-python-concepts-that-finally-clicked-fgo)
- dev.to CodeNewbie thread "toughest coding concept": adult beginners repeatedly name
  invisible-state topics (scope, references) over syntax — supports predict-then-run drills
  from day one (https://dev.to/codenewbieteam/what-was-your-toughest-coding-concept-and-how-did-you-conquer-it-4nl8)
- Fall-2025 college intro course (Dickinson COMP130) runs on Think Python 3e — ongoing
  institutional adoption signal
  (https://dickinson-comp130-02-fa2025.github.io/comp130-web/textbook/think-python-concatenated.pdf)

Primary technical authority:
- The Python Language Reference / official tutorial (docs.python.org) — semantics of
  numbers, strings, operators. Programming FAQ verified live:
  https://docs.python.org/3.10/faq/programming.html
- Think Python 3e itself is the pedagogical authority of record for this node (repo-verified
  primary; re-verified live this session).

Selected shortest-sufficient packet (total ≈ 5.5 h of the node's 6 h):
- DIAGNOSTIC: predict outputs, cold: `7//2`, `7%2`, `2**3**2`, `'ab'*3`, `int('3.0')`,
  plus `type(3/1)` and `0.1+0.2==0.3` — explain each aloud before running. 10 min.
- ORIENT: in-app lesson "Variables, Types & Expressions", sections 1–2. 10 min.
- CORE WATCH: — (video not required; CS50P W0 reserved for stuck path)
- CORE READ: Think Python 3e as three 15–30 min concept packets, each followed by
  immediate coding — never read all three chapters in a row:
  (1) ch 1, 25 min → 20 predict-then-run expressions; (2) ch 2, 25 min → Exercism
  "Guido's Gorgeous Lasagna"; (3) ch 3 first-pass (defining/calling only), 25 min →
  wrap one conversion as a function. Work IN the chapter notebooks, doing embedded
  exercises inline.
- INTERACTIVE: — (no widget; full in-app lesson exists for this node, 75 min, 9 sections —
  use it as the guided path; the reading packets then consolidate)
- PRACTICE: Exercism "Basics" + "Numbers" concept exercises; PYnative basics 1–10;
  the 20-expression predict-then-run set from the node spec. ~75 min.
- IMPLEMENT/DERIVE: unit-conversion calculator (deg↔rad, m/s↔km/h) with f-string
  formatted table output. ~45 min.
- STUCK PATH: CS50P Week 0 notes + lecture segments (verified:
  https://cs50.harvard.edu/python/weeks/0/) at 1.5–2×, only the failing topic.
- DEEPEN: official Python tutorial §"An Informal Introduction to Python" (docs.python.org,
  navigate from docs root); ATBS ch 1–2 as extra drills. Only if needed.
- PROVE IT: compound-interest table printer from a verbal spec, first try, no reference
  (node mastery test). ~30 min.
- TRANSFER: given a REPL transcript with unfamiliar mixed expressions (`-7//2`, `7%-2`,
  `2**-1`, `'3'+'4'` vs `3+4`), predict every output and state each result's type.
- RETENTION: at +72 h, a fresh 10-expression predict set (variant) and rewrite the
  converter for a new unit pair from memory, cold.

Why this won: Think Python 3e is already the repo's research-verified primary and
re-verified live today (free, current, Jupyter-native — the workflow transfers 1:1 to the
scientific stack). The improvement here is granularity: three timed concept packets with a
named Exercism exercise or drill after each, so the learner codes within 30 minutes of
starting, instead of "read ch 1–3."

What was rejected (and why): CS50P as primary (video-paced, ~2–3 h/lecture — wrong
time-efficiency profile for a fast reader; retained as verified stuck path). ATBS as
primary (automation-flavored examples; repo already relegates it to reference). PYnative/
schoolabe as primary practice (no test harness; Exercism's test-driven loop builds the
pytest habit this curriculum needs). Interactive-book alternates (Runestone FoPP,
openbookproject) — good, but a second spine adds coordination cost for no coverage gain.

Risk of superficial understanding: recognition-vs-mastery is this learner's known failure
mode — watching/reading arithmetic feels trivially easy while the `int('3.0')`-class traps
still bite. Every packet therefore ends in prediction-before-execution, and the PROVE IT
is generative (build from spec), not recognitional.

Required active work: all of PRACTICE + IMPLEMENT + PROVE IT above; predict-then-run is
non-negotiable (say the answer aloud, then run). Log every wrong prediction and its
explanation in a running "surprise journal" — it becomes the RETENTION quiz bank.

Last verified: 2026-08-21
