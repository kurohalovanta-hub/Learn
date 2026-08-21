# l1-classes — Classes: Exactly Enough OOP

Concept: class/__init__/self/methods/attributes; dataclasses; __repr__/__eq__/__len__
reading fluency; single inheritance + super() as nn.Module uses it. Goal is reading and
writing framework-style classes — not inheritance-hierarchy worship.

Learner prerequisites: l1-functions (the names/values model and call-by-object-sharing —
class attributes are the same model one level up); l1-data-structures strongly recommended
first (attributes are a dict-like namespace; `__dict__` demystifies).

What beginners commonly misunderstand:
- What `self` IS: not a keyword, just the first parameter, bound to the instance —
  `obj.m(x)` is `Cls.m(obj, x)`. Once seen, method syntax stops being magic. (This node's
  diagnostic asks exactly this.)
- "When would I even USE a class?" — adults stall on motivation more than syntax
  (community evidence below). The robotics answer: you already use them — every gym Env,
  every nn.Module; a class is state + the functions that legitimately mutate it.
- Class attributes vs instance attributes: a mutable class attribute (e.g. `items = []` in
  the class body) is SHARED by all instances — the mutable-default-argument trap wearing
  a costume; assignment through `self` creates a shadowing instance attribute.
- `__init__` is an initializer, not "the constructor that returns the object"; forgetting
  `self.` inside methods (locals vanish at method exit).
- super().__init__() — why the subclass must call it before using parent-established state
  (exactly the nn.Module contract).
- Over-engineering: reaching for inheritance where a function or a dataclass suffices —
  the node's skip-list already guards this.

Candidate videos:
NOTE — cluster verification constraint (search budget exhausted, fetch egress blocked):
no YouTube URLs could be verified; none are included.
1. CS50P Week 8 lecture "Object-Oriented Programming" — David Malan — page listed at
   https://cs50.harvard.edu/python/weeks/ (verified week list W0–W9 incl. W8 OOP) —
   [approx 2–3 h, unverified]. Careful, motivation-first build-up from a plain dict to a
   class; the verified video path if reading alone doesn't click; use topic markers.
2. Corey Schafer — "Python OOP Tutorial 1: Classes and Instances" [approx 15 min] and
   "2: Class Variables" [approx 11 min] — [unverified; no urls]. The historically
   most-recommended OOP series on r/learnpython; part 2 covers the shared-class-attribute
   trap head-on.
3. mCoding — "Python dataclasses" [approx 10 min, unverified; no url] — post-basics
   dataclass idioms.
4. none further found — fallback: Think Python OOP block + CS50P W8.

Candidate written resources:
1. Think Python 3e OOP block: ch 14 [title approx: "Classes and Functions"], ch 15
   "Classes and Methods", ch 16 "Classes and Objects", ch 17 "Inheritance" —
   https://allendowney.github.io/ThinkPython/ (verified; ch 15/16 titles confirmed via
   https://www.oreilly.com/library/view/think-python-3rd/9781098155421/ch15.html and
   .../ch16.html; Inheritance chapter confirmed present in TOC retrieval).
2. Exercism "Classes" concept exercise: "Ellen's Alien Game" —
   https://exercism.org/tracks/python/exercises/ellens-alien-game (verified; prereq chain
   confirmed: basics/bools/comparisons/loops/dicts/lists/numbers/sets/strings/tuples).
3. CS50P Week 8 lecture notes (text form of the lecture) — via
   https://cs50.harvard.edu/python/weeks/ (verified).
4. Python Tutorial §9 "Classes" + dataclasses module docs (docs.python.org, by name;
   FAQ verified live: https://docs.python.org/3.10/faq/programming.html — includes class
   FAQ entries e.g. self, class vs instance attributes).

Community evidence:
- Substack "Master Python Classes" comments: adult learners state classes only clicked
  when tied to something they already manipulate (data records → dataclass; game entity),
  not from shape-hierarchy toys
  (https://benjaminbennettalexander.substack.com/p/master-python-classes-object-oriented/comments)
- dev.to "My Journey Through Advanced Python OOP — A Beginner's Perspective": beginner
  names super(), encapsulation, and operator overloading as the cliff after basic
  syntax — supports keeping dunders at reading-fluency level and drilling super() on the
  nn.Module pattern specifically
  (https://dev.to/hejhdiss/my-journey-through-advanced-python-oop-a-beginners-perspective-312b)
- dev.to "10 Python Concepts That Finally Clicked": class-vs-instance attributes listed
  among late-clicking items; the fix was seeing attribute lookup order, not more OOP
  theory (https://dev.to/naved_shaikh/10-python-concepts-that-finally-clicked-fgo)
- dev.to CodeNewbie thread: OOP repeatedly named the toughest early concept by adult
  self-learners (https://dev.to/codenewbieteam/what-was-your-toughest-coding-concept-and-how-did-you-conquer-it-4nl8)

Primary technical authority:
- Python Tutorial §9 "Classes" + Data Model chapter (docs.python.org, by name) — the
  actual semantics of attribute lookup, __init__, super(), dunders. Programming FAQ
  (verified: https://docs.python.org/3.10/faq/programming.html) for the class-attribute
  sharing entries.

Selected shortest-sufficient packet (total ≈ 3.8 h of the node's 4 h):
- DIAGNOSTIC: (1) What is `self`? (2) What does `super().__init__()` do in a subclass of
  an nn.Module-style base? (3) Predict: class body has `items = []`; two instances both
  `self.items.append(...)` — wait, via `inst.items.append(...)` — what do both see, and
  why? 10 min, cold.
- ORIENT: 10 min — motivation framing before syntax: skim a gym-style `Env` skeleton
  (reset/step/state) and write one sentence on what the class is FOR (state + its
  legitimate mutations). This is the "when would I use one" inoculation.
- CORE WATCH: —
- CORE READ: three packets, immediate coding after each:
  (1) ch 14 + ch 15 ("Classes and Methods"), 45 min → Vector2D class with `+`, `*`,
  norm, `__repr__`; (2) ch 16 ("Classes and Objects") + the class-attribute FAQ entries,
  25 min → run the shared-class-attribute experiment (mutable class attr vs instance
  attr, proven with `__dict__` and `id()`); (3) ch 17 ("Inheritance") single-inheritance
  sections + super(), 20 min → subclass a tiny Base with required `super().__init__()`,
  mirroring nn.Module shape.
- INTERACTIVE: —
- PRACTICE: Exercism "Ellen's Alien Game" (verified above; exercises class attributes vs
  instance attributes explicitly); rewrite Vector2D as `@dataclass` (+ `__eq__` for free,
  note what you no longer write); read a small gym-style Env class and diagram its
  lifecycle reset→step→done (node spec). ~80 min.
- IMPLEMENT/DERIVE: desugar one method call by hand: show `v.norm()` ≡ `Vector2D.norm(v)`
  in the REPL; then print `v.__dict__` before/after setting an attribute. ~15 min.
- STUCK PATH: CS50P Week 8 notes, then lecture segment at 1.5–2×
  (https://cs50.harvard.edu/python/weeks/, verified); Corey Schafer OOP 1–2 by title
  [urls unverified] if a second voice is needed.
- DEEPEN: Tutorial §9 + dataclasses docs (by name); dunder catalog ONLY as reading
  fluency (__repr__/__eq__/__len__). Honor the node skip-list: no multiple inheritance,
  no metaclasses, no descriptors until a library forces it.
- PROVE IT: design a Particle class for a toy simulator (state, step(dt), energy) plus
  one subclass, and justify every method's placement (node mastery test). ~40 min.
- TRANSFER: read an unfamiliar nn.Module-style skeleton (init defines sub-modules,
  forward composes them) and annotate: what self is at each line, what super().__init__()
  established, which attributes are instance vs class. This is the exact reading skill
  L3+ assumes.
- RETENTION: at +1 week: rewrite Vector2D as a dataclass cold in <10 min; explain in two
  sentences why the class-attribute trap and the default-argument trap are the same
  phenomenon (one object, many names).

Why this won: the repo's "OOP block (returned to, as scheduled)" is now pinned to exact
chapters (14–17, titles verified for 15/16) split into three ≤45-min packets, each ending
in code, with the two research-backed stalls (self, shared class attributes) given
dedicated experiments, and motivation handled up front via the Env skeleton — the pattern
community evidence says makes classes click for adults. Ellen's Alien Game is the only
test-driven classes exercise in the pool and is verified live.

What was rejected (and why): CS50P W8 as CORE WATCH (2–3 h for content the learner reads
in 90 min; kept as verified stuck path). Corey Schafer OOP series as core (unverifiable
URLs this session; redundant for a text-fast learner; named stuck path). Fluent Python /
"Python OOP" long-form books (far beyond exactly-enough). Property/descriptor/protocol
coverage (skip-list; nothing in L1–L4 needs it).

Risk of superficial understanding: HIGH by default — classes are where recognition-vs-
mastery bites hardest (syntax is copyable; the object model is not). Guards: the
desugaring exercise (self made mechanical), the __dict__/id() experiments (attribute
lookup made visible), and a PROVE IT that demands placement JUSTIFICATION, not just
working code. Also guard the opposite failure: if every solution sprouts classes, revisit
ORIENT — a function is still the default unit.

Required active work: Vector2D both ways; the class-attribute experiment with printed
proof; Ellen's Alien Game; Env lifecycle diagram; the desugaring REPL session; surprise
journal.

Last verified: 2026-08-21
