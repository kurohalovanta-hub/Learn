# l2-matrices — Matrices & Linear Systems

Concept:
A matrix is a function that moves space: matrix×vector = transformed vector = mix of
columns (both views held simultaneously); matrix multiply = composition of
transformations (why order matters); identity and inverse; determinant as area/volume
scale factor; solving small linear systems; singular vs invertible read geometrically.
Every neural layer, camera model and robot pose is one of these.

Learner prerequisites:
l2-vectors at Gold (dot product, norms, span vocabulary from 3B1B Ch 2); l2-trig for
reading rotation matrices (cos/sin entries). NumPy basics from the l2-vectors implement
step.

What beginners commonly misunderstand:
- "A matrix is a table of numbers" (already flagged in the node) — the numbers are just
  where the basis vectors land; without this, matmul is an arbitrary index dance.
- Believing AB = BA, or reading ABx as "A first" — composition order is right-to-left,
  the single most common early bug in both math and robotics code.
- The (row × column) matmul rule memorized with zero connection to composition — 3B1B
  Ch 4's entire reason to exist.
- Determinant as "a formula with minus signs" instead of signed area scale; det = 0 read
  as an algebra fact, not "space collapsed, information destroyed, no inverse".
- Inverse as a universal right ("just divide by the matrix") — no intuition for when it
  cannot exist or why np.linalg.solve beats computing A⁻¹.
- Watch-only trap (cluster caveat): the grid animations of Ch 3–7 feel complete; without
  writing matrices for pictures and pictures for matrices, the skill does not form.

Candidate videos:
1. Linear transformations and matrices | Chapter 3 — 3Blue1Brown — 10:59 —
   https://www.youtube.com/watch?v=kYB8IZa5AuE
   (the load-bearing video of the entire cluster; correctness 5, intuition 5+,
   time-efficiency 5; the node's misconception is literally its thesis)
2. Matrix multiplication as composition | Chapter 4 — 3Blue1Brown — 10:04 —
   https://www.youtube.com/watch?v=XkY2DOUCWMU
   (order-matters made visceral; intuition 5)
3. The determinant | Chapter 6 — 3Blue1Brown — 10:03 —
   https://www.youtube.com/watch?v=Ip3X9LOh2dk
   (area-scaling + sign + det=0 collapse; intuition 5; no computation drill — pair with
   hand practice)
4. Inverse matrices, column space and null space | Chapter 7 — 3Blue1Brown —
   ≈12 min [approx] — https://www.youtube.com/watch?v=uQhTuRlWMxw
   (systems-of-equations-as-geometry; also pre-seeds rank/column space for l2-linear-maps)
5. Three-dimensional linear transformations | Chapter 5 — 3Blue1Brown — 4:46 —
   https://www.youtube.com/watch?v=rHLEWRxRGiM
   (cheap 3D generalization; robotics-relevant; optional)
6. Nonsquare matrices as transformations between dimensions | Chapter 8 — 3Blue1Brown —
   ≈4.5 min [approx] — https://www.youtube.com/watch?v=v8VSDg_WQlA
   (2D→3D maps; primes the ℝⁿ→ℝᵐ reading every network layer needs; optional here,
   assumed by l2-linear-maps)
7. MIT 18.06 Lecture 1–3 (Strang) — MIT OCW — ~50 min each —
   https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/ (authoritative but 5×
   the minutes for this node's objectives; stays backup per existing repo research)

Candidate written resources:
1. VMLS Ch 6, 8, 10, 11 (exact sections below) — https://vmls-book.stanford.edu/vmls.pdf
   (matrix-vector as column mix §6.4, systems §8.3, matmul/composition §10.1–10.2,
   inverses §11.1–11.3; proof-light, exercise-rich, NumPy companion)
2. 3blue1brown.com text lessons — /lessons/linear-transformations/,
   /lessons/matrix-multiplication/, /lessons/determinant/, /lessons/inverse-matrices/
   (text + embedded interactive Questions; verified in site source repo)
3. Immersive Linear Algebra ch 6 "The Matrix" — http://immersivemath.com/ila/index.html
   (interactive alternate)
4. MML book §4.1 Determinant and Trace — https://mml-book.github.io/book/mml-book.pdf
   (VMLS deliberately omits determinants entirely; §4.1 is the formal patch when needed)

Community evidence:
- UF COT5615 pairs VMLS §5.x–§10.4 reading with exactly 3B1B Ch 2–6, and VMLS Ch 11 with
  Ch 7–8 — independent confirmation of this packet's video↔section mapping —
  https://github.com/meanmachin3/COT5615 (README fetched this session)
- Grant Sanderson (in his own lesson text): best way to learn is "to do problems
  yourself… a bit hypocritical coming from a channel essentially consisting of lectures" —
  https://github.com/3b1b/3Blue1Brown.com (sphere-area lesson source; live:
  https://www.3blue1brown.com/lessons/sphere-area)
- TeachYourselfCS: 3B1B as the entry point, then Strang for the full treatment —
  https://github.com/izackwu/TeachYourselfCS-CN (TeachYourselfCS.md)
- Learner note repos for the series (e.g.
  https://github.com/SireJeff/linear-algebra-3blue1brown-notes; chapter-notes series at
  https://dilipkumar.medium.com/linear-combinations-span-and-basis-vectors-chapter-2-essence-of-linear-algebra-481d4f19e7da)
  [title-level evidence]: the community's working pattern is watch → re-derive in
  writing, not watch alone.

Primary technical authority:
- VMLS (Boyd/Vandenberghe 2018), free PDF https://vmls-book.stanford.edu/vmls.pdf:
  §6.1 Matrices, §6.2 Zero and identity matrices, §6.3 Transpose/addition/norm,
  §6.4 Matrix-vector multiplication; §7.1 Geometric transformations; §8.1 Linear and
  affine functions, §8.3 Systems of linear equations; §10.1 Matrix-matrix multiplication,
  §10.2 Composition of linear functions, §10.3 Matrix power; §11.1 Left/right inverses,
  §11.2 Inverse, §11.3 Solving linear equations. (Section titles verified this session;
  ch starts: 6→p.107, 8→p.147.) Determinant authority: MML §4.1 (VMLS omits det by
  design).

Selected shortest-sufficient packet:
- DIAGNOSTIC: cold (10 min): (1) what does det A = 0 mean geometrically and what does it
  break? (2) invert [[2,1],[1,1]] by hand; (3) write the matrix that rotates 90° CCW,
  and predict [[0,-1],[1,0]] applied to the unit square. All three instant → skim CORE
  READ, jump to PROVE IT.
- ORIENT: — (Ch 3 is the orientation)
- CORE WATCH: in order, with 3 retrieval questions answered from memory after each
  before continuing: Ch 3 (10:59, kYB8IZa5AuE) → Ch 4 (10:04, XkY2DOUCWMU) → Ch 6
  (10:03, Ip3X9LOh2dk) → Ch 7 (≈12 min, uQhTuRlWMxw). ≈ 44 min. Optional +9 min: Ch 5
  (4:46) and Ch 8 (≈4.5) for the 3D and nonsquare pictures (Ch 8 becomes required by
  l2-linear-maps). Sample retrieval Qs — Ch 3: where do the matrix's columns come from?
  Ch 4: does order matter in R·S and why? Ch 6: what does a negative determinant mean?
  Ch 7: connect "no inverse" to det = 0 and to the column space.
- CORE READ: VMLS §6.1–6.4 + §7.1 + §8.1, 8.3 + §10.1–10.3 + §11.1–11.3, working inline
  examples (≈ 70–85 min). §7.1 geometric transformations is the robotics hook (rotation
  matrices appear here first in print).
- INTERACTIVE: matrix-transform (in the l2-matrices in-app lesson, "Matrices as
  Machines", 80 min) — set each of: rotation, shear, scale, reflection, a singular
  matrix, and a composition; predict the grid BEFORE releasing each change
  (commit-before-reveal).
- PRACTICE: (hand, ~50 min) multiply two 2×2 matrices in both orders and exhibit
  AB ≠ BA; invert two 2×2s via the ad−bc formula; solve one 3×3 system by elimination
  ONCE; compute det for rotation/shear/singular examples and match to the widget's area
  readout; 4–6 exercises from VMLS ch 6/8/10/11 + the additional-exercises PDF
  (https://web.stanford.edu/~boyd/vmls/vmls-additional-exercises.pdf).
- IMPLEMENT/DERIVE: (~50 min) the node's animation exercise — animate the unit square
  under 6 labeled 2×2 matrices (rotation, shear, scale, reflection, singular,
  composition) in matplotlib; np.linalg.solve on a 3×3, then break it with a singular
  matrix and explain the failure in one paragraph; verify (AB)x == A(Bx) numerically.
- STUCK PATH: the 3blue1brown.com text lessons for chapters 3/4/6/7 (embedded Questions
  double as extra retrieval reps); immersivemath ch 6 if the column-mix view resists.
- DEEPEN: MML §4.1 (Determinant and Trace) for the formal determinant; MIT 18.06 L1–L3
  (Strang, OCW) only if the elimination mechanics feel shaky; The Art of Linear Algebra
  (Hiranabe's graphic notes on Strang, free) for the "matmul 4 ways" one-pagers —
  https://github.com/kenjihiranabe/The-Art-of-Linear-Algebra.
- PROVE IT: [= node masteryTest] given a picture of a transformed grid, write the
  matrix; given R(θ)S(2,1), sketch the picture — both directions, no tools, two fresh
  instances.
- TRANSFER: robotics — compose rotate(30°) then shear vs shear then rotate(30°) on a
  2-link arm's base frame and show the fingertip lands in different places (15 lines,
  reuses l2-trig FK); ML — write a 2→3 "layer" W and explain, via Ch 8's picture, what
  its columns mean.
- RETENTION: +7 days, cold: write the 90°-rotation and x-axis-reflection matrices from
  memory, compute their composition both orders, and state which composition equals a
  single reflection (check numerically after committing).

Why this won:
Ch 3+4+6+7 is the exact minimal 3B1B subset for this node's four objectives (~44 min
total), each chapter mapping 1:1 onto an objective, and VMLS §6/§8/§10/§11 provides the
matching computational text WITH exercises — the same pairing an actual graduate course
(COT5615) converged on independently. The transformation-first sequencing (video before
any index arithmetic) directly encodes the node's stated misconception fix. VMLS's
deliberate determinant gap is patched by Ch 6 + MML §4.1 instead of dragging in a second
textbook as core.

What was rejected (and why):
- Assigning "Ch 3–8" as an undifferentiated block (current node text): Ch 5 and Ch 8 are
  worthwhile but optional footnotes (9 min combined) — packet marks them optional so the
  core stays 44 focused minutes; granularity improved, selection unchanged in spirit.
- MIT 18.06 L1–3 as core: authoritative, but ~150 min for objectives 3B1B+VMLS cover in
  ~120 including practice; kept in DEEPEN consistent with existing repo research.
- Khan Academy matrix videos: slower per concept; no advantage over VMLS text + widget.
- "Essence of linear algebra" full-series binge: banned by cluster guidance; also the
  documented recognition trap.

Risk of superficial understanding:
HIGH. The grid animations are so good that learners report "getting it" while unable to
write the shear matrix for a drawn shear. PROVE IT is deliberately bidirectional
(picture→matrix AND matrix→picture, unseen instances); the widget step forces prediction
before observation; retrieval questions between videos break the binge pattern.

Required active work:
Hand: 2×2 products both orders, two inverses, one 3×3 elimination, dets matched to
geometry, 4–6 VMLS exercises. Code: 6-matrix animation, solve + singular failure
autopsy, composition check. Both PROVE IT directions on fresh instances. Video ≈ 44–53
min; total focused packet ≈ 4.5 h (node budget 8 h covers the 80-min in-app lesson +
slack).

Last verified: 2026-08-21
