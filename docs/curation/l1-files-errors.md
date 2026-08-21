# l1-files-errors — Files, Paths & Exceptions

Concept: open/with, text vs binary, encodings (enough), pathlib; JSON and CSV read/write;
try/except/finally, raising, custom messages, EAFP style. Every experiment reads configs
and writes results; exceptions are how research code fails loudly instead of lying.

Learner prerequisites: l1-data-structures (JSON is dicts/lists on disk; CSV rows are
lists/tuples — file work is serialization of structures already mastered).

What beginners commonly misunderstand:
- Paths are resolved relative to the CURRENT WORKING DIRECTORY, not the script's location —
  the #1 "file not found but it's right there" confusion (notebooks make it worse).
- `with open(...)` is not ritual: it guarantees close on ANY exit — it IS try/finally
  (this node's diagnostic asks for exactly that equivalence).
- Bare `except:` (or `except Exception: pass`) makes programs lie silently — the precise
  failure mode this node exists to prevent in research code. Catch narrowly, or don't
  catch.
- Exceptions are control flow you can DESIGN with (EAFP: try the read, handle the miss),
  not merely crashes to suppress; when to catch vs when crashing is correct.
- Text vs binary mode; encoding="utf-8" as an explicit habit (platform-default encodings
  produce heisenbugs); newline handling in CSV.
- JSON ≠ Python: keys become strings, tuples become lists, round-tripping is lossy;
  json.dump writes a file, json.dumps returns a string.
- Appending vs overwriting ('a' vs 'w'); results files clobbered by a re-run.

Candidate videos:
NOTE — cluster verification constraint (search budget exhausted, fetch egress blocked):
no YouTube URLs could be verified; none are included.
1. CS50P Week 3 lecture "Exceptions" — David Malan — listed at
   https://cs50.harvard.edu/python/weeks/ (verified week list) — [approx 1–1.5 h,
   unverified]. The dedicated beginner exceptions treatment; notes-first, lecture as
   stuck path.
2. CS50P Week 6 lecture "File I/O" — same page (verified) — [approx 1.5–2 h, unverified].
   Covers open/with/csv/json at beginner pace.
3. Corey Schafer — "File Objects" [approx 24 min] and "Try/Except" [approx 10 min] —
   [unverified; no urls]. Concise classics; redundant with reading for this learner.
4. none further found — fallback: Think Python ch 13 + CS50P notes.

Candidate written resources:
1. Think Python 3e ch 13 "Files and Databases" —
   https://allendowney.github.io/ThinkPython/ (verified; chapter confirmed via
   https://www.oreilly.com/library/view/think-python-3rd/9781098155421/ch13.html —
   "how programs make their data persistent"). NOTE: the verified 3e TOC has NO dedicated
   exceptions chapter — exceptions coverage is embedded/brief. That gap is filled by the
   CS50P Week 3 notes (below), which the repo already holds as backup resource.
2. CS50P Week 3 "Exceptions" notes + Week 6 "File I/O" notes — via
   https://cs50.harvard.edu/python/weeks/ (verified) — 15–25 min each, structured,
   beginner-exact (raise/try/except/else, ValueError patterns; open/with/csv/json).
3. Automate the Boring Stuff 3e — files chapters + CSV/JSON chapter — existing repo
   reference resource (`atbs`, lastVerified 2026-08-21): the designated lookup shelf for
   pathlib recipes and csv/json boilerplate; never read linearly.
4. Python official docs: tutorial §7.2 (reading/writing files), §8 (errors and
   exceptions), pathlib how-to, json/csv module pages (docs.python.org, by name;
   FAQ page verified live this session: https://docs.python.org/3.10/faq/programming.html).

Community evidence:
- dev.to CodeNewbie "toughest concept" thread: error handling named among the concepts
  self-taught adults defer longest — they suppress errors instead of designing with them;
  motivates the "each failure gets a DISTINCT informative path" exercise
  (https://dev.to/codenewbieteam/what-was-your-toughest-coding-concept-and-how-did-you-conquer-it-4nl8)
- CS50P learner retrospective: the exceptions week is short and lands well at beginner
  level — supports using W3 notes as the dedicated treatment over hunting a third-party
  tutorial (https://www.julianhal.com/programming/cs50p/)
- 2026 course guide confirms CS50P current and free, so leaning a CORE READ on its notes
  is durable (https://freecodingcourses.com/guides/harvard-cs50-free-course-guide-2026)

Primary technical authority:
- Python official docs: Tutorial §8 "Errors and Exceptions", `pathlib` docs, `json`/`csv`
  module docs (docs.python.org, by name; FAQ verified:
  https://docs.python.org/3.10/faq/programming.html). Exception semantics and the EAFP
  glossary definition are first-party.

Selected shortest-sufficient packet (total ≈ 3.8 h of the node's 4 h):
- DIAGNOSTIC: (1) When would you CATCH an exception vs let it crash? Give one example
  each from an experiment-script context. (2) Write the try/finally equivalent of
  `with open(p) as f:` (node diagnostic). (3) Predict: `json.loads(json.dumps({1: (2,3)}))`
  — what comes back? 10 min, cold.
- ORIENT: 5 min — read one real traceback bottom-up (exception type → message → innermost
  frame) and narrate it; tracebacks are the interface to this whole node.
- CORE WATCH: —
- CORE READ: three packets, immediate coding after each:
  (1) Think Python ch 13 file sections (skim the database section — shelve/SQL is not
  gated here), 25 min → write/read a text file; break the path on purpose; observe
  FileNotFoundError; print Path.cwd() and fix it properly with pathlib;
  (2) CS50P Week 3 Exceptions notes, 20 min → wrap the reader in try/except with a
  narrow catch + informative message; add one deliberate `raise ValueError(...)` with a
  message you'd want at 2 a.m.;
  (3) CS50P Week 6 File I/O notes (csv/json sections) + ATBS CSV/JSON chapter as open
  reference, 20 min → round-trip a dict through json.dump/json.load; document the two
  things that changed (key types, tuples).
- INTERACTIVE: —
- PRACTICE: experiment logger: append JSON-lines results (one json.dumps per line, mode
  'a'), then a loader that summarizes runs; robust file reader handling missing file /
  bad encoding / malformed line — each with a DISTINCT, informative error path (node
  spec exercises). ~90 min.
- IMPLEMENT/DERIVE: the catch-vs-crash decision rule, written as your own 5-line policy
  (e.g. catch at boundaries where you can add context or recover; never catch what you
  can't handle; always preserve the original error) — pinned above your desk; every later
  L-level script gets audited against it. ~15 min.
- STUCK PATH: CS50P W3/W6 lecture segments at 1.5–2×
  (https://cs50.harvard.edu/python/weeks/, verified); ATBS files chapters for recipe-level
  unblocking.
- DEEPEN: tutorial §8 full (else/finally clauses, exception chaining `raise ... from`),
  pathlib how-to — when a real script needs it.
- PROVE IT: config-driven script: reads params.json, validates fields with clear errors,
  writes results.csv — must survive five adversarial inputs thrown at it (node mastery
  test). ~45 min.
- TRANSFER: given an unfamiliar traceback from someone else's failing script (three
  frames deep, raised inside a library call), localize the failure, classify it
  (bug vs bad input vs environment), and state whether the script should have caught it.
  Then: add loud validation to YOUR l1-data-structures CSV parser.
- RETENTION: at +1 week: rewrite the JSON-lines logger cold in <15 min; state from
  memory the three failure modes the robust reader distinguishes and why bare `except:`
  is banned in your codebase.

Why this won: Think Python remains the file spine, but the verified 3e TOC shows no
dedicated exceptions chapter — so CS50P Week 3 notes (already the repo's backup resource,
verified live) are promoted to co-equal CORE READ for the exceptions half, and ATBS keeps
its repo role as the CSV/JSON recipe shelf. Three ≤25-min packets, each ending in a file
actually written or an error actually designed; total new reading ≈65 min for a 4-h node
that is mostly building the two artifacts every later level reuses (logger, robust
reader).

What was rejected (and why): Real Python / third-party exceptions tutorials (unverifiable
this session, and CS50P notes + official tutorial cover it first-party). Corey Schafer
file/exception videos as core (unverified URLs; reading is faster here). Teaching
os.path alongside pathlib (one way: pathlib; os.path only as legacy reading fluency).
shelve/SQLite from ch 13 (not gated at L1; the JSONL logger is the format the curriculum
actually uses until proper experiment tracking arrives).

Risk of superficial understanding: exception handling degenerates into wrapping
everything in try/except-pass to make red text go away — the exact opposite of the node's
purpose. Guards: the adversarial-input PROVE IT (silent failure = fail), the ban on bare
except, and the requirement that every catch either adds context or recovers. Path
handling risk: "it works in my notebook" — guard: PROVE IT script must run from a
different working directory.

Required active work: both node-spec artifacts (logger + robust reader) built and kept —
they are reused by P1 and every later project; the catch-vs-crash policy written in own
words; the JSON round-trip loss documented; surprise journal.

Last verified: 2026-08-21
