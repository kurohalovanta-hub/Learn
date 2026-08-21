# l2-derivatives — Derivatives & the Chain Rule

Concept: Derivative as local slope AND sensitivity multiplier; differentiation rules (power/product/quotient), chain rule to automaticity, e^x and ln x, light implicit differentiation, finite differences as universal numerical checker. The chain rule IS backpropagation — this node is the single highest-leverage calculus skill in the whole program.

Learner prerequisites: l2-functions-graphs (composition f∘g read at sight — the chain rule is literally "differentiate a composition", so composition fluency is the gating skill). Algebra fluency from l2-algebra for simplification.

What beginners commonly misunderstand:
- Treating the chain rule as a symbol ritual ("multiply by the derivative of the inside") without seeing composition structure — then failing the moment the composition is 3 deep or hidden (e.g. σ(w·x+b)).
- Derivative as a single number at a point vs a function; dy/dx manipulated as a literal fraction without knowing when that's legal.
- Scalar chain-rule habits that silently break at multivariable calculus: a May 2025 Towards Data Science piece documents that backprop confusion traces to learners never distinguishing the scalar chain rule from the total derivative (https://towardsdatascience.com/the-total-derivative-correcting-the-misconception-of-backpropagations-chain-rule/). Protecting against this NOW (always name inner/outer functions explicitly) is cheap insurance for l2-multivariable and l3-backprop-theory.
- Believing you know it after watching — chain rule only becomes automatic through ~30+ mixed reps (this is the node most at risk of recognition-vs-mastery).

Candidate videos:
1. The paradox of the derivative — Chapter 2, Essence of calculus — 3Blue1Brown — ~15–17 min [approx] — https://www.youtube.com/watch?v=9vKqVkMQHKk (correctness 5, intuition 5, rigor 3, time-efficiency 5 — the "derivative is best approximation, not instant rate" framing prevents misconception #2)
2. Derivative formulas through geometry — Chapter 3, Essence of calculus — 3Blue1Brown — duration unverified (~18 min) — https://www.youtube.com/watch?v=S0_qX4VJhMQ (intuition 5 — power rule stops being memorized; slightly optional if time-pressed)
3. Visualizing the chain rule and product rule — Chapter 4, Essence of calculus — 3Blue1Brown — 15:36 (duration via search snippet) — https://www.youtube.com/watch?v=YG15m2VwSjA (correctness 5, intuition 5, exercise compatibility 5 — the load-bearing video of this node; "nudge propagation" IS backprop's mental model)
4. What's so special about Euler's number e? — Chapter 5, Essence of calculus — 3Blue1Brown — duration unverified (~14 min) — https://www.youtube.com/watch?v=m2MIpDrF7Es (why e^x is its own derivative — needed for σ, softmax, log-loss later; intuition 5)
5. The Essence of Calculus — Chapter 1 — 3Blue1Brown — duration unverified (~17 min) — lesson page https://www.3blue1brown.com/lessons/essence-of-calculus/ (pure orientation; watch at 1.5×; skippable for a hurried learner)
6. Full playlist (repo resource 3b1b-calculus) — https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr (all 12 chapters ≈3.5 h video; only ch 1–5 belong to THIS node)

Candidate written resources:
1. Paul's Online Notes, Calc I Derivatives chapter — https://tutorial.math.lamar.edu/classes/calci/calci.aspx — sections verified live this session: Differentiation Formulas (https://tutorial.math.lamar.edu/classes/calci/diffformulas.aspx), Product and Quotient Rule (https://tutorial.math.lamar.edu/classes/calci/productquotientrule.aspx), Chain Rule (https://tutorial.math.lamar.edu/classes/calcI/ChainRule.aspx). Chapter also covers trig/exp/log derivatives, implicit differentiation, higher-order (per chapter index). Every section has a matching fully-solved practice set (clarity 4, exercise compatibility 5, rigor 4, datedness risk 1).
2. Paul's practice sets — Differentiation Formulas (https://tutorial.math.lamar.edu/problems/calci/diffformulas.aspx), Product/Quotient (https://tutorial.math.lamar.edu/problems/calci/productquotientrule.aspx), Chain Rule (https://tutorial.math.lamar.edu/Problems/CalcI/ChainRule.aspx — solution pages confirmed through at least Prob29, i.e. a ~30-problem set with full solutions).
3. Khan Academy differential calculus (via repo khan-math account) — adaptive practice with videos-on-failure; slower but diagnostic (beginner fit 5, time efficiency 3).
4. QuantInsti "Exploring the Chain Rule with Step-by-Step Examples" (Apr 2025) — https://blog.quantinsti.com/understanding-chain-rule/ — chain rule written directly toward neural networks (nice confirmation read, not a spine).

Community evidence:
- University instructors still route struggling calculus students to Paul's Notes on current course pages — e.g. Dutchess CC math guide calls it "a great resource for everything calculus… hundreds of problems for practice" (https://dcc.libguides.com/mathematics/web); also NCSU (https://epavlechko.wordpress.ncsu.edu/?p=106) and CU Boulder (https://math.colorado.edu/~sebo2151/for_students.html) student-resources pages. No displacement signal found in 2025–2026 searches.
- The visible 2025–2026 shift among adult self-learners is toward paid adaptive drilling (Math Academy) — HN: "insanely good… intense, focused" (https://news.ycombinator.com/item?id=43135664), 100-day adult-relearner report (https://gmays.com/how-im-relearning-math-as-an-adult/) — but the balanced review notes "stronger emphasis on procedural fluency than on conceptual understanding" (https://newsletter.ozwrites.com/p/a-balanced-review-of-math-academy, discussed at https://news.ycombinator.com/item?id=43656481). Our free 3B1B(concept)+Paul's(procedure) split already covers both halves.
- Essence of Calculus remains the default concept layer: assigned by AP teachers (https://core-docs.s3.us-east-1.amazonaws.com/documents/asset/uploaded_file/4647/SPHS/4094950/AP_Calculus_-_Videos.pdf), indexed on Class Central (https://www.classcentral.com/index.php/course/youtube-essence-of-calculus-511831), learners publish chapter notes (https://notiq.study/blog/3blue1brown-essence-of-calculus-notes, https://harshityadav95.medium.com/notes-essence-of-calculus-3blue1brown-2a7f97709ae9).
- Chain-rule→backprop confusion is real and documented: TDS total-derivative article (May 2025, url above) + beginner-backprop series (https://towardsdatascience.com/backpropagation-explained-for-beginners-part-1-building-the-intuition/).

Primary technical authority:
- Paul Dawkins, Calculus I notes (Lamar University) — worked derivations for every rule, chain rule two-forms treatment: https://tutorial.math.lamar.edu/classes/calcI/ChainRule.aspx
- For the chain-rule-as-computation-graph view the downstream authority is CS231n's backprop notes (https://cs231n.github.io/optimization-2/) — do not read yet; it is where this node's skill lands at L3.

Selected shortest-sufficient packet:
- DIAGNOSTIC: node diagnostic cold — d/dx of e^{3x²}, ln(sin x), 1/(1+e^{-x}) in under 90 s total; pass = skip to PRACTICE reps + PROVE IT (5 min)
- ORIENT: 3B1B Ch 1 at 1.5× (~11 min) — or skip if impatient
- CORE WATCH: 3B1B Ch 2 → Ch 3 → Ch 4 (chain rule, the load-bearing 15:36) → Ch 5, ~60–65 min total; pause Ch 4 at each rule and predict before reveal
- CORE READ: Paul's Calc I — Differentiation Formulas + Product & Quotient Rule + Chain Rule (URLs above), reading every worked example with pen in hand (~75–90 min)
- INTERACTIVE: derivative-explorer (in-app lesson "Derivatives & the Chain Rule", 80 min, already built)
- PRACTICE: Paul's Chain Rule practice set (~30 problems, full solutions) + Differentiation Formulas set; then the node's 30 chain-rule reps ending with σ(w·x+b) differentiated w.r.t. w, x, and b (~2 h — this is the extra-practice protection the load-bearing skill requires)
- IMPLEMENT/DERIVE: write check_grad(f, df, x) central-difference verifier in NumPy; use it to check 5 of your hand-derivatives incl. σ (45–60 min)
- STUCK PATH: Khan Academy differential-calculus chain-rule lessons (adaptive, videos on failure, via khan-math); QuantInsti chain-rule article for the ML-flavored restatement
- DEEPEN: 3B1B Ch 6 (implicit diff) + Paul's Implicit Differentiation section (chapter page above); MIT 18.01SC Unit 1 (the backup designated in docs/research/reports/foundations.md §5) only if Paul's feels too terse
- PROVE IT: node masteryTest — differentiate L=(y−σ(wx+b))² w.r.t. w and b by hand, verify with YOUR check_grad; this is a neuron's backward pass (30 min)
- TRANSFER: 2-link arm fingertip x(θ₁,θ₂)=l₁cosθ₁+l₂cos(θ₁+θ₂): compute ∂x/∂θ₁ by chain rule, verify by finite differences — your first Jacobian entry, three levels early (20 min)
- RETENTION: day+7 — 10 mixed chain-rule reps (incl. one 3-deep composition and dσ/dx = σ(1−σ) re-derivation) in under 8 min, no notes

Why this won: The 3B1B→Paul's pattern splits exactly along the two failure modes: 3B1B ch 2–5 builds the geometric "sensitivity multiplier" picture faster than anything else in existence (~1 h), and Paul's gives terse adult-toned worked procedure plus the only free ~30-problem chain-rule set with full solutions. Both verified live today; both free; combined core ≈6.5 h of the node's 10 h budget, leaving room for the mandated extra chain-rule reps.

What was rejected (and why): Professor Leonard lectures (multi-hour university pacing — wrong for a fast learner on a 210-day clock; couldn't verify current URLs this session); Math Academy (paid, adaptive-drill strength duplicates Khan while its documented weakness — concept-light — is the half we need most); OpenStax Calculus Vol 1 (fine reference, but reading a full textbook chapter is slower than Paul's per unit of skill; kept as the ecosystem's standard alternative per the 2026 StraighterLine roundup https://www.straighterline.com/blog/affordable-13-best-free-educational-resources-for-students-2026-guide); MIT 18.01SC as primary (60–90 h linear course — explicitly the completionism trap; demoted to DEEPEN).

Risk of superficial understanding: HIGH — this is the canonical recognition-vs-mastery node: chain-rule videos feel obvious while watching. Mitigations baked in: commit-before-reveal during Ch 4, 30 timed reps, finite-difference verification of every hand result, and a PROVE IT that is literally next level's backprop step.

Required active work: ~30 Paul's problems + 30 timed chain reps; check_grad implementation reused for years; masteryTest derivation w.r.t. w AND b; transfer derivative on the FK expression.

Last verified: 2026-08-21
