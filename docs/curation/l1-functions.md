# l1-functions — Functions, Scope & Composition

Concept: def/return, parameters, defaults, keyword args, *args/**kwargs basics; local vs
global scope; why argument mutation surprises people; pure functions vs side effects;
docstrings; decomposition as the unit of thought.

Learner prerequisites: l1-control-flow (and transitively l1-python-basics; simple `def`
already seen in Think Python ch 3).

What beginners commonly misunderstand:
- print vs return — THE classic. A function that prints "works" in the REPL, then the
  program built on it gets `None` everywhere. (Community evidence below: this confusion
  shows up on the very first Exercism exercise.)
- A function without `return` returns `None` (this node's diagnostic).
- Scope: assignment inside a function creates a LOCAL name — reading a global works,
  assigning shadows it; `UnboundLocalError` when you do both (official FAQ entry).
- Mutable default arguments: `def f(x, xs=[])` — defaults are evaluated ONCE at def time
  and shared across calls. Documented as the top "least astonishment" violation; bites in
  real ML configs (node misconception field agrees).
- Argument passing is neither "by value" nor "by reference" — it is call-by-object-sharing:
  the parameter is a new name for the SAME object, so in-place mutation escapes the
  function but rebinding does not.
- Decomposition: beginners write one 60-line blob because each function "is too small to
  bother" — the refactor exercise attacks this directly.

Candidate videos:
NOTE — cluster verification constraint (search budget exhausted, fetch egress blocked):
no YouTube URLs could be verified; none are included.
1. CS50P Week 0 lecture, function segments — David Malan —
   https://cs50.harvard.edu/python/weeks/0/ (verified page) — [segment length approx
   20–40 min, unverified]. Solid but slow; stuck-path only.
2. Ned Batchelder — "Facts and Myths about Python Names and Values" (PyCon talk) —
   [approx 25–30 min, unverified; url: none verified this session — locate by exact
   title]. The canonical explanation of the names/values model that makes argument
   passing and mutable defaults obvious; widely cited as the fix for this confusion.
   Its content is mirrored in written form by the articles below, which ARE verified.
3. Corey Schafer — "Python Functions" episode — [approx 20 min, unverified; no url].
4. none further found — fallback: Think Python ch 3+6 and the verified written
   least-astonishment articles below carry the load.

Candidate written resources:
1. Think Python 3e ch 3 "Functions" (full pass now) + ch 6 "Return Values" —
   https://allendowney.github.io/ThinkPython/ (verified; ch 3 confirmed via
   https://www.oreilly.com/library/view/think-python-3rd/9781098155421/ch03.html; ch 6
   number [approx] from TOC retrieval, title "Return Values" confirmed present).
2. Mutable-default supplement (Think Python does not dwell on the trap):
   GeeksforGeeks "Least Astonishment and the Mutable Default Argument in Python" —
   https://www.geeksforgeeks.org/python/least-astonishment-and-the-mutable-default-argument-in-python/
   (verified) — or pythontutorials.net's longer treatment —
   https://www.pythontutorials.net/blog/least-astonishment-and-the-mutable-default-argument/
   (verified). 10 min read, one trap, permanent immunity.
3. Python official Programming FAQ — "Why are default values shared between objects?",
   "Why did I get an UnboundLocalError…?", "How do I write a function with output
   parameters (call by reference)?" — https://docs.python.org/3.10/faq/programming.html
   (verified) — first-party, exact.
4. dev.to "Tip: Watch out for mutable default arguments in Python" — 3-min drill-format
   recap — https://dev.to/trinityyi/tip-watch-out-for-mutable-default-arguments-in-python-d44
   (verified).

Community evidence:
- discuss.python.org: beginner on Exercism's first functions exercise ("Guido's Gorgeous
  Lasagna") confused about how the function pieces fit — evidence that function-shape
  confusion (signature/body/return) precedes even the scope traps, and that re-doing that
  exercise cleanly is a fair re-entry drill
  (https://discuss.python.org/t/learning-functions-using-exercism-org-guidos-gorgeous-lasagna-spoiler-warning/12212)
- CPython tracker: the mutable-default behavior generated an actual language-level issue
  discussion — beginners are astonished enough that it reached the core tracker; the
  behavior is intended and documented (https://github.com/python/cpython/issues/48348)
- dev.to: multiple independent writeups of the default-args trap as a career "gotcha
  moment" (https://dev.to/vivis_dev/understanding-how-python-evaluates-default-arguments-and-why-mutable-defaults-can-carry-unintended-1ee6,
  https://dev.to/trinityyi/tip-watch-out-for-mutable-default-arguments-in-python-d44)
- Mirrored/translated copies of the famous Stack Overflow "Least Astonishment" Q&A across
  many sites (w3docs, pythonhow, csdn) — a proxy for how often this exact confusion is
  searched (https://pythonhow.com/what/least-astonishment-and-the-mutable-default-argument-in-python/)

Primary technical authority:
- Python official Programming FAQ (verified: https://docs.python.org/3.10/faq/programming.html)
  + Language Reference "Function definitions" / Tutorial §4.7–4.9 (docs.python.org, by name)
  — semantics of defaults (evaluated once), scope rules, *args/**kwargs.

Selected shortest-sufficient packet (total ≈ 4.5 h of the node's 5 h):
- DIAGNOSTIC: (1) What does a function without `return` return? (2) Predict the two
  outputs: `def f(x, xs=[]): xs.append(x); return xs` called as `f(1)` then `f(2)`.
  (3) Predict: `def g(n): n = n + 1` — does the caller's variable change? 10 min, cold.
- ORIENT: —
- CORE WATCH: — (Batchelder talk deliberately NOT scheduled: the written model below is
  faster; the talk is the stuck path if the model doesn't click)
- CORE READ: three packets with immediate coding:
  (1) ch 3 "Functions" full pass, 25 min → re-do "Guido's Gorgeous Lasagna" cleanly:
  docstrings, no duplication, constants named; (2) ch 6 "Return Values", 25 min →
  write `compose(f, g)` returning a new function, use it on two numeric transforms;
  (3) 15-min supplement: GeeksforGeeks least-astonishment article + the two FAQ entries
  (defaults, UnboundLocalError) → immediately reproduce the `xs=[]` trap yourself,
  observe, fix with the `None`-sentinel pattern.
- INTERACTIVE: —
- PRACTICE: refactor a 60-line procedural script into 6 functions with one clear job each
  (node spec); write one pure and one side-effecting version of the same task and label
  them; Exercism "Unpacking and Multiple Assignment" concept ("Locomotive Engineer"-style)
  for *args/**kwargs exposure [exercise name from track knowledge — confirm in-track].
  ~90 min.
- IMPLEMENT/DERIVE: the call-by-object-sharing table, derived by experiment: for
  int/str/tuple/list/dict arguments, does (a) in-place mutation, (b) rebinding, affect the
  caller? 10 predictions → run → one-paragraph rule in your own words. ~25 min.
- STUCK PATH: names/values written model in the verified articles above + draw
  box-and-arrow diagrams for 5 of your own calls; Python Tutor-style step visualization
  (tool referenced by name; url not verified this session) or CS50P Week 0 function
  segments (https://cs50.harvard.edu/python/weeks/0/).
- DEEPEN: FAQ remaining function entries; Tutorial §4.8 (keyword-only args) — only when a
  library signature forces it.
- PROVE IT: given a messy 80-line procedural script, produce a clean decomposition with
  docstrings and no globals, and justify each boundary (node mastery test). ~45 min.
- TRANSFER: predict-and-explain across the function boundary: `def f(xs): xs.append(1)`
  vs `def f(xs): xs = xs + [1]` — same caller list, different outcomes; explain using
  names/values, not folklore. Then spot the `xs=[]`-class bug planted in an unfamiliar
  20-line snippet.
- RETENTION: at +1 week: write the sentinel-default pattern cold; re-answer diagnostic
  (2) with a dict default instead of a list.

Why this won: Think Python remains the right spine for def/return/scope, but it
under-teaches the two traps this learner will actually hit in ML code (mutable defaults,
call-by-object-sharing) — so the packet adds a 15-minute verified written supplement and
a derived-by-experiment table instead of a 30-minute talk. Shortest sufficient: ~65 min
of reading total, everything else generative.

What was rejected (and why): scheduling the Batchelder PyCon talk as CORE WATCH — right
content, but its URL could not be verified this session and the written model + experiment
table deliver the same mental model in half the time (talk demoted to named stuck path).
CS50P W0 as core (pace). Teaching decorators/closures beyond `compose` here (needed later;
L1 scope discipline says exactly-enough). Real Python long-form scope guide (paywall-ish
nag walls, and the FAQ covers it first-party).

Risk of superficial understanding: the learner can parrot "mutable defaults are evaluated
once" without the underlying names/values model — then be re-astonished by class-attribute
sharing at l1-classes. The experiment table and TRANSFER predictions force the model, not
the slogan. Decomposition risk: refactoring to "many small functions" mechanically without
boundary reasoning — hence justify-each-boundary in PROVE IT.

Required active work: the 10-prediction argument-passing experiment (written down BEFORE
running); reproduce-then-fix the default-arg trap; both refactors; surprise journal.

Last verified: 2026-08-21
