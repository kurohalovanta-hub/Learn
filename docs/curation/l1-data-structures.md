# l1-data-structures — Lists, Dicts, Sets, Tuples & Comprehensions

Concept: indexing/slicing; mutation vs copy; aliasing; dict/set operations and when each
wins; list/dict comprehensions as the default idiom; nested structures (list of dicts of
lists) navigated confidently. Datasets are lists of dicts; configs are dicts; trajectories
are lists of tuples.

Learner prerequisites: l1-functions (so aliasing-through-function-boundaries connects to
the call-by-object-sharing model already built there).

What beginners commonly misunderstand:
- Aliasing — the single biggest documented stall in this cluster: `b = a` copies the NAME,
  not the list; mutation through either name is visible through both. "Why is my list
  changing?!" (community evidence below). This node's diagnostic is exactly this.
- Shallow vs deep copy: `a[:]` / `list(a)` / `copy.copy` copy one level; nested lists still
  share the inner objects (`copy.deepcopy` exists for a reason).
- `xs.sort()` mutates and returns `None` (chained `xs = xs.sort()` destroys data);
  `sorted(xs)` returns a new list. Same trap: `append` returns None.
- Mutating a list while iterating over it (skipped elements).
- Tuple "immutability" means the tuple's slots can't be rebound — a mutable element inside
  a tuple can still be mutated.
- Slicing endpoints half-open (`xs[2:5]` is 3 items; `xs[:]` is a copy — connects to the
  range() half-open convention from l1-control-flow).
- Comprehensions read inside-out at first; when a comprehension is LESS readable than a
  loop (nested >2 levels) — idiom, not dogma.
- dict keys must be hashable (no lists as keys); modern dicts preserve insertion order.

Candidate videos:
NOTE — cluster verification constraint (search budget exhausted, fetch egress blocked):
no YouTube URLs could be verified; none are included.
1. Ned Batchelder — "Facts and Myths about Python Names and Values" (PyCon talk) —
   [approx 25–30 min, unverified; url: none verified — locate by exact title]. The
   community-canonical fix for aliasing/mutability confusion; if any single video is worth
   scheduling in this cluster, it is this one — its substance is also available as
   verified written articles below, which the packet uses instead.
2. Corey Schafer — "Lists, Tuples, and Sets" [approx 29 min] and "Dictionaries"
   [approx 10 min] — [unverified; no urls]. Concise walkthroughs; redundant with Think
   Python for this learner.
3. CS50P lectures do not have a dedicated collections week (verified week list: W0–W9 —
   conditionals, loops, exceptions, libraries, tests, file I/O, regex, OOP) — loops week
   (W2) touches lists/dicts only in passing. No CS50P slot here.
4. none further found — fallback: Think Python ch 9–11 notebooks.

Candidate written resources:
1. Think Python 3e ch 9 "Lists", ch 10 "Dictionaries", ch 11 "Tuples" —
   https://allendowney.github.io/ThinkPython/ (verified; ch 9/10 confirmed in TOC
   retrieval, ch 11 confirmed via
   https://www.oreilly.com/library/view/think-python-3rd/9781098155421/ch11.html).
   Ch 9 contains the aliasing/references treatment with state diagrams.
2. Exercism concepts with exercises (pairings verified via
   https://exercism.org/tracks/python/concepts and
   https://exercism.org/tracks/python/exercises): Lists ("Card Games"), List Methods,
   Dicts ("Inventory Management" — https://exercism.org/tracks/python/exercises/inventory-management,
   verified), Dict Methods, Tuples ("Tisbury Treasure Hunt"), Sets ("Cater Waiter").
3. dev.to "Python: Mutability, immutability and their consequences" — worked aliasing
   examples with id() checks —
   https://dev.to/aaron_rose_0787cc8b4775a0/python-mutability-immutability-and-their-consequences-2hba
   (verified). 10-min stuck-path read.
4. Python official Programming FAQ — "How do I copy an object in Python?" and the
   mutable-default entry (same root model) —
   https://docs.python.org/3.10/faq/programming.html (verified).
5. Runestone "Foundations of Python Programming" (free interactive book with step-through
   code visualization) — surfaced page:
   https://runestone.academy/ns/books/published/fopp/Tuples/TuplesasReturnValues.html
   (verified) — its CodeLens-style stepping is a Python-Tutor-class aid for aliasing.

Community evidence:
- dev.to "10 Python Concepts That Finally Clicked": mutable-vs-immutable named the classic
  "Why is my list changing?!" moment; the click came from the object/name model, not from
  more examples (https://dev.to/naved_shaikh/10-python-concepts-that-finally-clicked-fgo)
- dev.to mutability writeup: adults specifically report that printing `id()` before/after
  made aliasing land
  (https://dev.to/aaron_rose_0787cc8b4775a0/python-mutability-immutability-and-their-consequences-2hba)
- The least-astonishment literature (functions node) is the SAME confusion surfacing one
  level up — one mental model retires both
  (https://www.geeksforgeeks.org/python/least-astonishment-and-the-mutable-default-argument-in-python/)
- Exercism community: "Inventory Management" has an active improvement thread — maintained,
  test-driven exercise (https://github.com/exercism/python/issues/2342)

Primary technical authority:
- Python Tutorial §5 "Data Structures" (lists as stacks/queues, 5.1.3 List Comprehensions,
  sets, dicts, looping techniques) + Library Reference "Built-in Types" (docs.python.org,
  by name; FAQ page verified live: https://docs.python.org/3.10/faq/programming.html).

Selected shortest-sufficient packet (total ≈ 5.5 h of the node's 6 h):
- DIAGNOSTIC: predict then run: `a=[1,2]; b=a; b.append(3); print(a)` — then the `b=a[:]`
  version — then explain the memory model in two sentences. Plus: what does
  `xs = xs.sort()` leave in `xs`? 10 min, cold.
- ORIENT: 10 min — draw the names→objects diagram for the diagnostic yourself BEFORE
  reading; the reading then confirms or corrects it (commit-before-reveal).
- CORE WATCH: —
- CORE READ: four packets, each read→code within 30 min:
  (1) ch 9 "Lists" incl. the aliasing/references sections, 30 min → Exercism "Card Games",
  then reproduce the aliasing bug and fix it three ways (`[:]`, `list()`, `copy.copy`),
  proving with `id()`; (2) ch 10 "Dictionaries", 25 min → Exercism "Inventory Management";
  (3) ch 11 "Tuples" (incl. tuple-in-dict, tuple unpacking), 20 min → Exercism "Tisbury
  Treasure Hunt"; (4) comprehensions + sets, 20 min: Tutorial §5.1.3–§5.4 (by name) →
  Exercism "Cater Waiter", then rewrite three of your earlier loops as comprehensions.
- INTERACTIVE: —
- PRACTICE: word-frequency counter → top-10 with and without `collections.Counter`;
  invert a dict; group a list of records by field; flatten nested lists (node spec).
  Then the shallow-copy boundary: predict what `copy.copy` does to `[[1,2],[3,4]]` when
  you mutate an inner list; verify; state when deepcopy is required. ~2 h.
- IMPLEMENT/DERIVE: "structure-choice card": for each of five mini-scenarios (config,
  trajectory, seen-set, leaderboard, adjacency), pick list/tuple/dict/set and defend the
  choice in one line each. ~20 min.
- STUCK PATH: dev.to mutability article (verified, above) + step through your own
  diagnostic in a visualizer (Runestone CodeLens on similar examples — verified page
  above; or Python Tutor, referenced by name, url not verified this session); Batchelder
  talk by title if the model still resists.
- DEEPEN: FAQ copy entry; `collections` module docs (Counter, defaultdict) by name —
  after the manual versions, never instead of them.
- PROVE IT: parse a small CSV-like text into records, filter/aggregate/sort by multiple
  criteria, comprehensions throughout — clean first-pass code (node mastery test). ~45 min.
- TRANSFER: navigate an unseen nested blob (list of dicts of lists, JSON-shaped): extract
  three named quantities in one comprehension each; predict which of two proposed "copies"
  of it is actually independent. This is the exact shape of every robot-episode dataset
  record you will meet at L11+.
- RETENTION: at +1 week: aliasing re-diagnostic (dict variant: `d2 = d1` vs `dict(d1)` vs
  nested); rewrite the word-frequency counter cold in <15 min.

Why this won: Think Python ch 9–11 (verified numbering) plus one named, verified Exercism
exercise per structure turns the repo's "Lists, dictionaries, tuples chapters" into four
15–30 min packets with immediate coding. Aliasing gets triple coverage (read → reproduce →
visualize) because it is the best-documented stall for exactly this learner profile, and
because it is the same model that de-mystifies mutable defaults (behind) and class
attributes (ahead).

What was rejected (and why): scheduling the Batchelder talk as CORE WATCH (URL unverifiable
this session; written+experiment path is faster — talk stays a named stuck path).
Corey Schafer collections videos (redundant with the reading for a text-fast learner).
Teaching `collections`/itertools up front (tools before models breeds cargo-culting; they
enter via DEEPEN after manual versions). A second textbook treatment (Runestone) as core —
kept as visual stuck path only.

Risk of superficial understanding: comprehension syntax can be pattern-matched while the
underlying iteration is fog — guard: every comprehension in PRACTICE must first exist as
its loop form in the same file, then be replaced. Aliasing can be memorized as "use [:]"
folklore — guard: the `id()` proofs and the shallow-vs-deep boundary prediction.

Required active work: reproduce-and-fix the aliasing bug with id() proof; loop→comprehension
rewrites; all four Exercism exercises; structure-choice card; surprise journal entries for
every wrong prediction.

Last verified: 2026-08-21
