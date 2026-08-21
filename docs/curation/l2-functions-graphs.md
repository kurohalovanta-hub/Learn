# l2-functions-graphs — Functions & Graphs

Concept:
Functions as objects: notation, domain/range, composition f∘g, inverses, and — the core
payoff — reading graph transformations (shift/scale/reflect) at sight across the families
e^x, ln x, x^n, 1/x, sigmoid. ML is function fitting; a neuron σ(Wx+b) is literally
"primitive function + scale + shift", so this node trains the exact eye used to read
activations, loss curves, and normalization for the rest of the program. Same test-out
philosophy as l2-algebra: diagnose with Khan unit tests, patch only failures.

Learner prerequisites:
l2-algebra (fluent equation manipulation, exponent/log rules). No programming strictly
required, but the sketch-then-verify exercises assume matplotlib once L1 Python exists;
paper + Desmos (free web grapher, no account) covers it before then.

What beginners commonly misunderstand:
- f(x+2) shifts LEFT, not right (the single most common transformation error — inputs are
  pre-processed, so the graph moves opposite the sign).
- Order of operations on transformations: a·f(bx−c)+d is not readable until factored to
  a·f(b(x−c/b))+d; horizontal scale-then-shift vs shift-then-scale give different graphs.
- Function = formula. The mapping view (any input→output table, including data) is the one
  ML needs; adults trained on formulas resist it.
- Inverse ≠ reciprocal: f⁻¹(x) is un-doing, not 1/f(x); and only injective functions
  invert (why ln needs x>0, why σ⁻¹ exists but x² needs a domain cut).
- Domain/range of compositions: range of the inner function must land inside the domain of
  the outer — the exact reasoning later reused for layer shapes and numerical-stability
  bugs (ln of a negative loss term).

Candidate videos:
1. Shifting functions introduction — Khan Academy (Sal) — [approx 3–8 min, unverified] —
   https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:shift/v/shifting-functions-intro
   (correctness 5, prereq fit 5, clarity 4, intuition 4, time-efficiency 5 — the canonical
   5-minute fix for the f(x+2)-direction error)
2. Identifying function transformations — Khan Academy — [approx 5–9 min, unverified] —
   https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:trans-all-together/v/shifting-and-reflecting-functions
   (correctness 5, clarity 4, exercise compatibility 5 — paired 1:1 with the practice set below)
3. Finding composite functions — Khan Academy — [approx 4–8 min, unverified] —
   https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:composite/x9e81a4f98389efdf:composing/v/new-function-from-composition
   (correctness 5, prereq fit 5, time-efficiency 4)
4. Evaluating composite functions (formulas / tables / graphs) — Khan Academy — [approx
   3–7 min each, unverified] —
   https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:composite/x9e81a4f98389efdf:composing/v/evaluating-composite-functions
   (+ .../v/evaluating-composite-functions-using-tables , .../v/evaluating-composite-functions-using-graphs)
   (the tables/graphs variants train the mapping view, not just symbol-pushing — intuition 4)
No strong third-party candidate (3B1B has no transformations video; nothing else surfaced in
this session's search results before the budget closed); none found — fallback: Khan
per-skill videos above, which are exercise-paired anyway.

Candidate written resources:
1. Transformations of functions: FAQ — Khan Academy article — ~10 min —
   https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:log-graphs/a/transformations-of-functions-faq
   (compact written summary of the whole unit; clarity 4, time-efficiency 5)
2. Paul's Online Math Notes — Algebra, "Graphing and Functions" + "Common Graphs" chapters —
   https://tutorial.math.lamar.edu/classes/alg/alg.aspx [repo-verified 2026-08-21;
   egress-blocked for refetch this session] (adult-toned text path; clarity 5 for
   text-learners, rigor 4)
3. OpenStax Algebra & Trigonometry 2e — Functions chapter Practice Test [repo-verified
   reference; egress-blocked this session] (unseen final instrument)
4. College Algebra (Khan) — Transformations of functions unit —
   https://www.khanacademy.org/math/college-algebra/xa5dd2923c88e7aa8:transformations-of-functions
   (same skills, different course shell — useful as a second question bank, not extra theory)

Community evidence:
- Khan Help Center: exercises-first (videos only on failure) is a recognized, viable use
  pattern — learners ask if they lose anything by skipping straight to mastery challenges
  (https://support.khanacademy.org/hc/en-us/community/posts/360078058832-Am-I-missing-important-insights-and-material-by-only-doing-exercises-and-mastery-challenges)
- HN relearning threads: returning adults consistently report the gap is graph/function
  fluency more than arithmetic — diagnostics placed a confident learner into "Precalc plus
  bits of Algebra II", i.e. exactly this node's material
  (https://news.ycombinator.com/item?id=39047825)
- HN "Ask HN: Best way to relearn basic math?": the working mechanism is many problems with
  instant feedback ("zone of proximal development"), matching unit-test-first here
  (https://news.ycombinator.com/item?id=20446796)
- Khan Help Center: tests can't be restarted mid-attempt; Skip marks incorrect — protocol
  for honest cold diagnostics
  (https://support.khanacademy.org/hc/en-us/community/posts/4403705001357-Restarting-Course-Challenge-Unit-Test ,
  https://support.khanacademy.org/hc/en-us/articles/26236154715789-Update-Navigate-Questions-at-Your-Own-Pace-with-the-Skip-Button)
- 2026 structure check: Algebra 2 "Transformations of functions" unit and its unit test are
  live at the URLs below (search-verified this session); the SY 26-27 restructure touches
  Algebra 1/IM courses, not this unit
  (https://support.khanacademy.org/hc/en-us/articles/45949029775373-Back-to-school-2026-New-courses-restructures-and-revisions-coming-to-our-content-library)

Primary technical authority:
- OpenStax Algebra & Trigonometry 2e, Functions chapter (peer-reviewed statements of
  domain/range/composition/inverse + practice tests) [repo-verified reference]. Khan is the
  practice engine.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, ~30 min total: (1) node diagnostic on paper — sketch y = 2e^(−(x−1))+3
  unplotted; state domain/range of ln(x−2); (2) Khan Algebra 2 "Transformations of
  functions" Unit Test cold
  (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:log-graphs/test/x2ec2f6f830c9fb89:transformations-unit-test);
  (3) Precalc composite-functions practice cold:
  https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:composite/x9e81a4f98389efdf:composing/e/compose-functions .
  ≥90% + clean sketches ⇒ jump to PROVE IT.
- ORIENT: Shifting functions introduction (video 1 above), ~5 min — only if the sketch had
  a direction error; else skip.
- CORE WATCH: — (videos only per failed skill, via STUCK PATH)
- CORE READ: Transformations FAQ article (~10 min)
  (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:log-graphs/a/transformations-of-functions-faq)
- INTERACTIVE: — (no in-app transformation widget yet; flag: a "function-transformer"
  slider widget would slot here. Use Desmos as the external sandbox meanwhile.)
- PRACTICE: ~90–150 min, only-failed-skills rule:
  · Identify function transformations:
    https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:trans-all-together/e/shifting_and_reflecting_functions
  · Transformations Quiz 1 + Quiz 2, then Unit Test to ≥90%:
    https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:symmetry/quiz/x2ec2f6f830c9fb89:transformations-quiz-1 ,
    https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:trans-all-together/quiz/x2ec2f6f830c9fb89:transformations-quiz-2
  · Composition: e/compose-functions + e/evaluate-composite-functions-from-formulas +
    e/evaluate-composite-functions-from-graphs-and-tables (Precalc :composite unit, URLs as
    in Candidate videos/practice; the graphs&tables one trains the mapping view)
  · Node exercise: hand-sketch e^x, ln x, x², 1/x, σ(x) + one shifted/scaled variant of
    each (10 sketches), then verify in Desmos/matplotlib; 10 reps of graph→formula recovery.
- IMPLEMENT/DERIVE: ~60 min. matplotlib grid script: for each primitive f ∈ {exp, log, x²,
  1/x, σ}, plot f(x), f(x−h)+k, a·f(bx) with 2–3 parameter values; verify numerically that
  exp/ln undo each other (f⁻¹(f(x))=x to machine precision) and that σ(x)+σ(−x)=1.
  (Pre-Python variant: same grid by hand on graph paper, checked in Desmos.)
- STUCK PATH: the matched Khan video for the failed skill (videos 1–4 above); text-learner
  alternative: Paul's Notes "Graphing and Functions"
  (https://tutorial.math.lamar.edu/classes/alg/alg.aspx) [repo-verified].
- DEEPEN: Only if composition/domain reasoning stays shaky: "Get ready for Algebra 2 —
  transformations & modeling" unit
  (https://www.khanacademy.org/math/get-ready-for-algebra-ii/x6e4201668896ef07:get-ready-for-transformations-of-functions-and-modeling-with-functions)
  one level down, or the College Algebra transformations unit as a second question bank
  (https://www.khanacademy.org/math/college-algebra/xa5dd2923c88e7aa8:transformations-of-functions).
- PROVE IT: Node mastery test, cold, ~30 min: decompose σ(Wx+b) into primitive
  transformations; sketch, without plotting, how the graph changes as W ∈ {½, 1, 4, −2} and
  b ∈ {−2, 0, 3}; one paragraph on why W controls steepness (input scaling) and b position
  (input shift) — the exact skill of reading a neuron.
- TRANSFER: ~25 min: (1) z-scoring x↦(x−μ)/σ as shift-then-scale — state what it does to
  any density's graph; (2) given a plotted tanh(2x−1)+0.5, recover the formula; (3) state
  domain constraint that makes ln(σ(x)) safe and why log-of-sigmoid appears in
  cross-entropy.
- RETENTION: Day +7: five unseen transformed-primitive graphs (AI-generated or Khan mastery
  review) → recover formulas, ≤15 min, ≥4/5; plus one cold σ(Wx+b) decomposition with new
  W, b.
Packet total: ~3–4.5 h if diagnostics pass fast; up to ~7 h with full patching (node budget
10 h holds).

Why this won:
Exactly mirrors the verified test-out loop of l2-algebra one level up: the Algebra 2
transformations unit test + Precalc composite exercises are the two smallest instruments
that cover every node objective, and both URLs were live-verified in this session's search
results. The Khan videos are exercise-paired (each failed skill links its own 5-minute
fix), which beats any external lecture for repair speed. The packet's center of mass is the
sketch-verify-decompose work, not video — matching both LEARNING-SYSTEM active-work rules
and the community mechanism (problem volume with feedback). The σ(Wx+b) prove-it makes the
robotics/ML payoff explicit and is un-gameable by pattern-matching Khan questions.

What was rejected (and why):
- Any linear precalculus course or playlist (repair ≠ first learning; hours budget).
- 3B1B as core — no dedicated transformations/composition video exists in Essence series;
  forcing an adjacent video in would be popularity-driven selection.
- Professor Leonard-style full lectures — hours-long; wrong grain for a 10 h node
  [not searched this session; rejected on format].
- Desmos "activities" as core — great sandbox (kept as verification tool), but activities
  are classroom-paced and unverifiable this session (no URL surfaced in results).
- College Algebra unit as primary — duplicate of the Algebra 2 unit; kept as DEEPEN bank.

Risk of superficial understanding:
Transformation questions are highly pattern-matchable (pick "left 2, up 3" from
multiple-choice without a mental graph). The unit test alone therefore over-certifies.
Mitigations: the paper sketches (production, not recognition), graph→formula recovery
(inverse direction), the σ(Wx+b) decomposition with parameter sweep, and the day-7 unseen
set. Composition risk: evaluating f(g(2)) mechanically while unable to state domain of
f∘g — the transfer item (ln∘σ) checks precisely that.

Required active work:
10 hand sketches verified against a grapher; ≥90% on transformations unit test; composition
practice sets; matplotlib (or graph-paper) transformation grid; graph→formula ×10; cold
σ(Wx+b) decomposition; day-7 recovery set.
Last verified: 2026-08-21
