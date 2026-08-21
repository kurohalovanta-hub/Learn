# Research Report — Foundation Resources, Verified Picks (2026-08-21)

> Produced by a dedicated research agent with live verification on 2026-08-21. Every URL confirmed live via search-index retrieval of the actual page (sandbox direct-fetch egress limited). Hour estimates assume a fast adult at 2–3× university pace, doing exercises but not completionism.
> Correction established: **Gilbert Strang is alive** (retired May 2023; OCW materials permanently archived).

## 1. Linux / Terminal / Git survival

**PRIMARY — The Missing Semester of Your CS Education (MIT CSAIL)** — https://missing.csail.mit.edu/ — current edition **2026** (https://missing.csail.mit.edu/2026/); 2020 edition still up. [verified 2026-08-21]
- 2026 edition (9 lectures): 1 Shell intro · 2 Command-line Environment (incl. SSH) · 3 Dev Environment & Tools (editors) · 4 Debugging & Profiling · 5 Version Control & Git · 6 Packaging · 7 Agentic Coding · 8 Beyond the Code · 9 Code Quality.
- **STUDY (2026):** L1, L2, L3, L5, L4 (first half). **STUDY (2020 edition):** L2 Shell Tools & Scripting (deeper files/find/grep/pipes); SKIM L4 Data Wrangling. **SKIM:** 2026 L6, L9. **SKIP:** 2026 L7–L8; 2020 L8–L10.
- **Hours: 12–15** to functional; git fluency continues by daily use. Why: only resource covering shell+git+ssh+debugging+editors in one place for people who think well; exercises are real tasks.
- BACKUP: the 2020 edition. REFERENCE: each lecture's notes as cheat sheets.

## 2. Python from zero

**PRIMARY — Think Python, 3rd edition (Allen Downey, 2024)** — https://allendowney.github.io/ThinkPython/ — every chapter a runnable Jupyter notebook. [verified]
- **STUDY** ch 1–3 and everything through strings, lists, dictionaries, tuples, files (~first 12–13 chapters). **SKIM on first pass** the OOP block near the end — return right before PyTorch. **SKIP** turtle-graphics detours.
- **Hours: 25–35** incl. exercises. Why: runs natively in Jupyter (zero-cost tooling transfer to scientific Python), concise, concept-first, respects an intelligent adult. (py4e slower/shallower; ATBS automation-flavored; CS50P video-paced ~40–50 h.)

**BACKUP — CS50P (Harvard)** — https://cs50.harvard.edu/python/ [verified free]. Weeks 0–7 + psets (check50); SKIM week 8; **its week 5 (Unit Tests/pytest) is the best beginner testing intro anywhere — do it regardless.** Hours: 35–45.

**REFERENCE — Automate the Boring Stuff 3e** (free online, May 2025) — Part I ch 1–8 as alternate drill track; Part II is a lookup shelf (ch 9 regex, 10–11 files, 18 CSV/JSON). Official tutorial ch 3–5, 9 for semantics lookups.

**PRACTICE — Exercism Python track** — https://exercism.org/tracks/python [verified]: 146 exercises, free, test-driven (habituates pytest workflow). ~25–35 exercises interleaved; **hours: 10–15**.

## 3. NumPy / Matplotlib / Jupyter

**PRIMARY — Official NumPy guides**: "NumPy: the absolute basics for beginners" (https://numpy.org/doc/stable/user/absolute_beginners.html) + quickstart + user-guide sections **Broadcasting**, **Indexing on ndarrays**, **Copies and views** (the three that prevent 90% of beginner bugs). SKIP structured arrays, ufunc internals. **Matplotlib Quick start** (https://matplotlib.org/stable/users/explain/quick_start.html) + Pyplot tutorial, using the OO (`fig, ax`) style. **Total hours: 8–10.** [all verified]

**BACKUP — Scientific Python Lectures** — https://lectures.scientific-python.org/ [verified]: NumPy + Matplotlib chapters, ~6–8 h. (No separate Jupyter course needed.)

**REFERENCE/STRETCH — From Python to NumPy (Rougier)** — https://www.labri.fr/perso/nrougier/from-python-to-numpy/ [verified]: vectorization craft; SKIM after 2 weeks of NumPy; 6–10 h if worked. Direct training for tensorized PyTorch code.

## 4. Math repair (Grade-10 → precalc, fast)

**PRIMARY — Khan Academy with test-out strategy** [URLs verified]: Algebra 1 → Algebra 2 → Precalculus selected units.
- **Test-out mechanism verified:** every course has a Course Challenge + per-unit Unit Tests; skills can be mastered directly without watching videos. Loop: Course Challenge → patch weak units via Unit Tests → drill only failed skills.
- Path: (1) **Algebra 1 Course Challenge only** — diagnose; patch linear equations/graphs, systems, functions, exponents & radicals, quadratics; skip sequences/statistics. (2) **Algebra 2 core**: STUDY rational exponents/radicals, logarithms, transformations of functions, equations, trigonometry; SKIM polynomial units (unit tests only), exponential models; SKIP complex numbers, modeling. (3) **Precalculus**: STUDY composite functions + trigonometric functions (identities lightly); SKIM vectors/matrices (linalg track does it properly); SKIP conics, prob & combinatorics, series.
- **Hours: 40–60** (as low as ~30 with strong diagnostics). Only free resource with adaptive diagnostics + infinite generated practice + instant feedback — exactly what *repair* needs. Videos only on failure; exercises-first.

**BACKUP — Paul's Online Math Notes: Algebra** — https://tutorial.math.lamar.edu/classes/alg/alg.aspx [verified]: terse adult-toned text + solved problems; 25–40 h; for the video-hater.

**REFERENCE — OpenStax Algebra & Trigonometry 2e / Precalculus 2e** [verified]: chapter Practice Tests with answer keys as independent verification. Never read linearly.

## 5. Calculus (minimal for ML)

**PRIMARY (intuition) — 3Blue1Brown, Essence of Calculus** — playlist verified; 12 chapters, ~3.5 h video / **~5 h** with notes. Esp. ch 2–4 (visual chain rule = the backprop primitive), 7–9, 11 (Taylor).

**PRIMARY (working skill) — Paul's Notes Calc I + Calc III subset** [verified]:
- Calc I — STUDY: limits (intuitive only), all derivative rules (**chain rule until automatic**), min/max, antiderivatives, u-substitution, FTC. SKIM: related rates, L'Hôpital. **SKIP: trig-sub/partial-fractions, volumes, arc length, all Calc II series machinery.**
- Calc III — STUDY: partials, multivariable chain rule, directional derivatives, **gradient**, min/max + Lagrange multipliers. SKIP: multiple/line/surface integrals, Green/Stokes.
- Hours: 22–32.
- Jacobians: Khan Academy **Multivariable calculus** unit "Derivatives of multivariable functions" (gradient + **Jacobian**; Grant Sanderson-authored) [verified]; Hessian via MML §5.7. ~6–8 h.
- **Calculus total: ~35–45 h.**

**BACKUP — MIT 18.01SC** (OCW Scholar) [verified]: Units 1 & 3 (A–B) only if Paul's too terse; do NOT run linearly (60–90 h full).

Unlocks: read ∂L/∂w, derive gradients by hand, chain rule = backprop, Hessian curvature, basic integrals for continuous probability.

## 6. Linear algebra

**PRIMARY (intuition) — 3Blue1Brown, Essence of Linear Algebra** [playlist verified; 16 chapters]. STUDY all except SKIM ch 10–12 (cross products, Cramer). **Hours: 3–4. Do BEFORE any computational resource.**

**PRIMARY (implementation spine) — VMLS: Introduction to Applied Linear Algebra (Boyd & Vandenberghe)** — free PDF https://vmls-book.stanford.edu/vmls.pdf + slides + **Python companion** (Leung & Matsypura) [all verified].
- STUDY (implementing every concept in NumPy): ch 1–3, 5 (vectors, linear functions, norm/distance, independence/basis/orthonormal/Gram–Schmidt); ch 6–8, 10–11 (matrices, systems, matmul, inverses/pseudo-inverse/QR); ch 12–13 (**least squares + data fitting = first real ML model**). SKIM: ch 4 (k-means), 14. SKIP: ch 9, 15–19.
- Hours: 20–28 with coding.
- **Known gap: no eigen/SVD.** Close with **MML book ch 4 "Matrix Decompositions"** — STUDY §4.1–4.2, 4.4–4.5, ~6–8 h, implement eig/SVD on real matrices (image compression exercise).
- Backup video: MIT 18.06 Strang (OCW, verified) — eigen lectures L21–22, L25, L29 only; or **RES.18-010 "A 2020 Vision of Linear Algebra"** (6 videos, 2 h capstone) [verified].
- **Linear algebra total: ~32–42 h.**
- Rejected as spine: full 18.06 (60+ h, board-paced), Axler LADR 4e (free PDF verified at https://linear.axler.net/ — beautiful *second* course, wrong first pass), immersivemath (SKIM companion), Strang "LA for Everyone" (paid).

## 7. Probability / statistics

**PRIMARY — MIT 18.05 (Orloff & French Kamrin, Spring 2022 OCW)** — course + consolidated Probability/Statistics reading PDFs + solved psets/exams [verified].
- STUDY: counting/sample spaces; **conditional probability & Bayes**; independence; discrete RVs; **expectation/variance**; continuous RVs; **common distributions**; joints & covariance; LLN + **CLT/Gaussians**; **MLE**; Bayesian updating. SKIM: NHST, confidence intervals. SKIP: R-specific work (redo in NumPy), regression classes, bootstrap.
- Hours: 25–35 (psets in Python = free simulation practice). Why: the only free resource at exactly working-engineer depth with self-contained notes AND solved psets; 2–3× faster than lecture-video courses for a strong reader.

**BACKUP — Harvard Stat 110 + Blitzstein–Hwang 2e** — free book http://probabilitybook.net + stat110.net supplements + YouTube playlist [verified]. STUDY ch 1–5, 7, 10; SKIM 6, 9; SKIP 8, 11–13. Hours: 35–50 (deeper, slower, best problems anywhere). MLE thin here — that's why 18.05 is primary.

**WARM-UP — Seeing Theory** (Brown) — https://seeing-theory.brown.edu/ [verified functional]: 2–3 h of play; makes distributions/CLT/Bayes visible. Do not linger.

## 8. Mathematics for Machine Learning (Deisenroth, Faisal, Ong)

Free PDF verified at https://mml-book.github.io/. **Assessment: REFERENCE + consolidation, not spine** (terse, proof-forward — demoralizing as first exposure, superb as notation-standardizing pass).
- ch 2–3: SKIM after VMLS. **ch 4 (eigen/SVD): STUDY** (assigned in §6). **ch 5 Vector Calculus: STUDY §5.1–5.7** (best compact treatment of exactly the multivariable calculus ML uses; chain-rule-as-backprop) ~6–8 h. ch 6: SKIM/STUDY Gaussian sections (§6.5–6.6). **ch 7: STUDY §7.1–7.2** (GD, constrained/Lagrange). Part II: SKIM as preview.
- Total across program: ~15–20 h.

## 9. Optimization basics

**PRIMARY — d2l.ai ch 12 "Optimization Algorithms"** [verified]: STUDY 12.1–12.6 (incl. **convexity**, GD, SGD, minibatch, momentum); SKIM Adam (12.10) now. Implementation-first. Hours: 6–9.
Plus **Lagrange multipliers**: Khan multivariable "Applications of multivariable derivatives" articles [verified]. ~2–3 h.
BACKUP/REFERENCE: MML ch 7. Boyd *Convex Optimization*: do NOT open on this timeline. **Topic total: 8–12 h.**

## 10. Lie groups SO(3)/SE(3)

**PRIMARY — Solà, Deray, Atchuthan, "A micro Lie theory for state estimation in robotics"** — https://arxiv.org/abs/1812.01537 [verified]. STUDY §I–IV + appendices A–C (worked SO(2)/SO(3)/SE(3)); SKIM §V; SKIP uncertainty until EKF. Pair with the author's ~1 h lecture video (https://www.youtube.com/watch?v=QR1p0Rabuww [verified]) — watch BEFORE reading. Implement with **manif** (https://artivis.github.io/manif/). **Hours: 10–14.** The community-standard on-ramp; appendix tables are a permanent reference.
**BACKUP — Modern Robotics ch 3** (free PDF verified at https://hades.mech.northwestern.edu/images/7/7f/MR.pdf): rotations/exponential coords/twists hands-on before abstraction; ~6–8 h.

## 11. Learning science (citable canon)

1. **Make It Stick** (Brown, Roediger, McDaniel; Harvard UP 2014) — canonical trade synthesis of retrieval practice/spacing/interleaving. (~$15; the one justified purchase.)
2. **Dunlosky et al. 2013**, "Improving Students' Learning With Effective Learning Techniques," *PSPI* 14(1) — free mirror verified https://gwern.net/doc/psychology/spaced-repetition/2013-dunlosky.pdf. Top-rated techniques = practice testing + distributed practice.

## (a) Total hour budget (fast learner)

| Block | Hours |
|---|---|
| Terminal/Linux/git survival | 12–15 |
| Python to competent (+ Exercism + testing) | 35–50 |
| NumPy/Matplotlib/Jupyter | 10–15 |
| Math repair (algebra→precalc, test-out loop) | 40–60 |
| Calculus (single + multivariable min. incl. Jacobians/Hessians) | 35–45 |
| Linear algebra (3B1B + VMLS-in-NumPy + MML ch 4) | 32–42 |
| Probability/stats (18.05 + Python simulation) | 25–35 |
| Optimization basics | 8–12 |
| Lie groups (robotics-bound) | 10–14 |
| **TOTAL (with Lie)** | **≈ 210–290 h** |

At 25 h/wk: 8–11 weeks; at 40 h/wk: 5–7 weeks. Anyone promising materially less than ~200 h is selling passive familiarity; anyone demanding 600+ is running university pacing.

## (b) Concurrency plan

- Weeks 1–3: Python ∥ algebra repair ∥ Missing Semester (1 lecture/day, week 1).
- Weeks 3–5: NumPy/Matplotlib ∥ finish precalc ∥ 3B1B Essence of Calculus.
- Weeks 5–8: Calculus (Paul's) ∥ linear algebra (3B1B → VMLS-in-NumPy). Probability WAITS for basic integrals.
- Weeks 8–11: Probability (18.05, simulate in NumPy) ∥ optimization ∥ MML ch 5. Lie groups LAST.
- Rule: **always one code track + one math track in parallel; never two new math tracks at once.** Spaced repetition from day 1.

## (c) Biggest time-sink to avoid

**Course completionism** — running whole university-paced courses linearly instead of test-out + minimal subset + build. Concrete forms: grinding all Khan units to 100%, watching all 35 lectures of 18.06 or all of CS50P/Stat 110, and Calc-II-style integration-technique grinding. Correlated failure: passive video logged as "studying" — every video hour must be matched by an hour of retrieval (exercises, code, cards) or it evaporates.
