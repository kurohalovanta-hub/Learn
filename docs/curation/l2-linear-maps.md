# l2-linear-maps — Basis, Rank, Projections & Least Squares

Concept:
Linear independence, span, basis, rank, column space / null space as capacity language;
orthonormal bases and Gram–Schmidt (once, by hand); least squares as projection of b onto
col(A): normal equations x̂ = (AᵀA)⁻¹Aᵀb from the orthogonality condition, and the
pseudo-inverse as the rank-safe repair. This is the learner's first real ML model —
"training" is born here.

Learner prerequisites:
l2-matrices at Gold (transformation view, inverse, singular intuition, 3B1B Ch 7's
column-space picture); l2-vectors projection formula (the 1-D special case of everything
here). NumPy: matmul, solve.

What beginners commonly misunderstand:
- Rank as a bookkeeping number rather than "dimensions that survive the map"; not
  connecting rank deficiency to the widget's visible collapse of space.
- Gram–Schmidt executed as ritual subtraction with no idea it is repeated projection
  removal — the algorithm then evaporates within a week.
- Normal equations memorized as a formula; unable to re-derive from "residual ⟂ every
  column", which is the only version that survives into ML.
- Why AᵀA is invertible iff A has independent columns — most learners cannot argue
  either direction (this node's diagnostic exists for that reason).
- Least squares seen as "a statistics trick" instead of pure geometry (closest point in
  a subspace); then regularization/pseudo-inverse later feel ad hoc.
- Fitting ever-higher-degree polynomials "because residual shrinks" — no validation
  instinct (VMLS §13.2 is the antidote and stays in core).

Candidate videos:
1. Change of basis | Chapter 13 — 3Blue1Brown — ≈13 min [approx] —
   https://www.youtube.com/watch?v=P2LTAUO1TdA
   (coordinates-are-a-choice; makes "basis" operational; intuition 5)
2. Nonsquare matrices as transformations between dimensions | Chapter 8 — 3Blue1Brown —
   ≈4.5 min [approx] — https://www.youtube.com/watch?v=v8VSDg_WQlA
   (ℝⁿ→ℝᵐ picture that makes tall-A least squares geometric; tiny and load-bearing)
3. Least squares approximation — Khan Academy (Sal Khan) — duration [unverified] —
   https://www.youtube.com/watch?v=MC7l96tW8V8
   (the classic blackboard derivation of x̂ from projection; slower production but the
   only verified free video that walks the actual normal-equations derivation; URL
   verified via COT5615 course listing this session)
4. Dot products and duality | Chapter 9 — 3Blue1Brown — ≈14–15 min [approx] —
   https://www.youtube.com/watch?v=LyGKycYT2v0
   (if deferred from l2-vectors, its projection/duality view pays off right here)
5. MIT 18.06 Strang: orthogonality/projection/least-squares lectures — MIT OCW —
   ~50 min each — https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/
   (gold-standard rigor; 3–4 lectures ≈ 3 h — too heavy for core on this timeline;
   DEEPEN)

Candidate written resources:
1. VMLS Ch 5 + §11.5 + Ch 12 + Ch 13 — https://vmls-book.stanford.edu/vmls.pdf
   (THE authority here: Boyd built the whole book around exactly this node — "only one
   theoretical concept, linear independence… only one method, least squares"; exercises
   included; NumPy companion)
2. Python Language Companion to VMLS — https://ses.library.usyd.edu.au/handle/2123/21370
   (ch-by-ch NumPy code for Gram–Schmidt, QR, least squares)
3. Gregory Gundersen, "Linear Independence, Basis, and the Gram–Schmidt algorithm" —
   https://gregorygundersen.com/blog/2021/04/24/linear-independence/
   (a researcher's careful re-derivation; alternate written voice)
   [content judged from title/author's known style — page not fetchable this session]
4. MML book §2.5–2.6 (Linear Independence; Basis and Rank) and §3.8 (Orthogonal
   Projections) — https://mml-book.github.io/book/mml-book.pdf (formal consolidation
   dialect; section numbering verified this session)

Community evidence:
- VMLS is tractable enough for self-learners that an ML book club worked through it
  cover-to-cover and published notes —
  https://github.com/Machine-Learning-Book-Club/VMLS (listing seen this session)
- COT5615 (grad course) assigns VMLS 5.1–5.4 with 3B1B Ch 2, and VMLS 11.1–11.5 with
  3B1B Ch 7–8 + the Khan least-squares video — the same wiring as this packet —
  https://github.com/meanmachin3/COT5615
- TeachYourselfCS: video series first, real textbook after — the pattern this node's
  read-heavy packet follows — https://github.com/izackwu/TeachYourselfCS-CN
- Grant Sanderson's own "do problems yourself" admission (see l2-vectors record;
  https://www.3blue1brown.com/lessons/sphere-area) applies doubly here: there is no 3B1B
  least-squares chapter at all — video intuition simply cannot carry this node.

Primary technical authority:
- VMLS (Boyd/Vandenberghe 2018), https://vmls-book.stanford.edu/vmls.pdf:
  §5.1 Linear dependence, §5.2 Basis, §5.3 Orthonormal vectors, §5.4 Gram–Schmidt
  algorithm; §11.5 Pseudo-inverse; Ch 12 (p.225): §12.1 Least squares problem,
  §12.2 Solution, §12.3 Solving least squares problems, §12.4 Examples; Ch 13 (p.245):
  §13.1 Least squares data fitting, §13.2 Validation (§13.3 Feature engineering skim).
  Section titles/pages verified this session. Additional exercises:
  https://web.stanford.edu/~boyd/vmls/vmls-additional-exercises.pdf

Selected shortest-sufficient packet:
- DIAGNOSTIC: cold (12 min): (1) argue both directions of "AᵀA invertible ⇔ columns of A
  independent"; (2) fit y = mx + c to (0,1), (1,2), (2,2) via normal equations by hand;
  (3) state what "residual ⟂ col(A)" means in one sentence. Clean → skim §12, jump to
  PROVE IT.
- ORIENT: re-watch the column-space/rank half of 3B1B Ch 7 (uQhTuRlWMxw, second half,
  ~5 min) + Ch 8 if skipped in l2-matrices (≈4.5 min, v8VSDg_WQlA).
- CORE WATCH: 3B1B Ch 13 "Change of basis" (≈13 min, P2LTAUO1TdA), then Khan Academy
  "Least squares approximation" (MC7l96tW8V8, [duration unverified] ~15 min) for the
  projection→normal-equations derivation. ≈ 28 min. Retrieval questions after each
  (Ch 13: what do the columns of the change-of-basis matrix mean? Khan: why does the
  residual have to be orthogonal to EVERY column?).
- CORE READ: VMLS §5.1–5.4 → §11.5 → §12.1–12.4 → §13.1–13.2 (~45 pp, ≈ 90–110 min,
  examples worked by hand as you go). This is deliberately the read-heaviest node in the
  cluster: least squares has no adequate short-video treatment.
- INTERACTIVE: matrix-transform (via the l2-matrices in-app lesson — no dedicated lesson
  exists yet for this node): set a singular/near-singular matrix and narrate what
  happens to rank, column space, and why solve() must fail; watch the collapse that
  rank-deficiency means.
- PRACTICE: (hand, ~60 min) Gram–Schmidt on three vectors in ℝ³ once, fully, tracking
  "subtract the projection" at each step; rank of three small matrices by inspection +
  verification; VMLS exercises: 2 from Ch 5, 2 from Ch 12, 1 from Ch 13 (+
  additional-exercises PDF as pool).
- IMPLEMENT/DERIVE: (~75 min) [= node exercises] (1) derive the normal equations from
  b − Ax̂ ⟂ col(A) on paper; (2) fit a line, then a cubic, to noisy data via your own
  normal-equations solver — no lstsq — then compare against np.linalg.lstsq; (3) build a
  rank-deficient A (duplicate column), watch AᵀA become singular, and repair with
  np.linalg.pinv; note in comments WHY pinv still returns an answer (§11.5).
- STUCK PATH: 3blue1brown.com/lessons/change-of-basis/ text lesson (embedded Questions);
  Gundersen's Gram–Schmidt post for a second written voice; Khan video re-watch at 0.75×
  with pencil.
- DEEPEN: MML §3.8 Orthogonal Projections (formal projection operators) and §2.5–2.6
  (rank, formally); MIT 18.06 orthogonality/projection/least-squares lectures (OCW) if
  the geometry still feels thin; VMLS §13.3 feature engineering as a bridge toward ML.
- PROVE IT: [= node masteryTest] blank page: derive the normal equations from the
  orthogonality condition AND write the polynomial-fit code from scratch, no references;
  both must run/check on first honest attempt or the node is not Gold.
- TRANSFER: robotics calibration — given 20 noisy (commanded_angle, measured_angle)
  pairs from a servo, fit measured = a·commanded + b and report the bias; then explain
  in 3 sentences why adding a 9th-degree polynomial drops the residual but is worse
  (validation, §13.2 language).
- RETENTION: +7–10 days, cold: state the normal equations, the condition for their
  validity, and the pseudo-inverse fallback; re-derive x̂ for the 3-point line fit from
  the diagnostic (≤10 min).

Why this won:
This node is where the cluster's center of gravity shifts from video to text, and VMLS
Ch 5+12+13 is the precise authority: the book's own thesis is that linear independence +
least squares carry all of applied linear algebra, it is free, proof-light, has native
exercises and a NumPy companion — nothing else at beginner-fit level derives validation
(§13.2) alongside the fit. The two short verified videos (3B1B Ch 13, Khan LS) cover the
only two genuinely video-shaped ideas (basis-as-choice; projection picture). Matches and
sharpens the repo's existing primary (vmls Ch 5, 12–13) by adding §11.5 pseudo-inverse
explicitly, which the node's exercises require.

What was rejected (and why):
- Any attempt at a "least squares in 12 minutes" video core: no verified short video
  derives normal equations + validation with rigor; Khan's is the best verified free
  derivation and is kept, but as the junior partner to VMLS.
- MIT 18.06 lecture block as core: ~3 h of lectures for material VMLS covers in ~100
  min of reading with better exercise integration; kept in DEEPEN.
- 3B1B Ch 9–13 as a block (current node backup lists Ch 9, 13): Ch 10–12 (cross
  products, Cramer) are explicitly skim-tier in the repo's own resource record; only
  Ch 13 (+Ch 8 orient) earns core minutes here.
- Gundersen post as CORE READ: excellent voice but no exercises and unfetchable to
  verify depth this session; STUCK PATH.

Risk of superficial understanding:
VERY HIGH — highest in the cluster. x̂ = (AᵀA)⁻¹Aᵀb is the most copy-pasteable formula
in applied math; the videos make the projection picture feel obvious while the
derivation muscle stays unbuilt. That is why PROVE IT demands the derivation AND the
code from a blank page, why the diagnostic asks for the iff-argument, and why practice
forces one full hand Gram–Schmidt (never to be repeated, never to be skipped).

Required active work:
One full hand Gram–Schmidt; 5+ VMLS exercises; normal-equations derivation on paper;
line+cubic fitter with no lstsq; rank-deficiency autopsy with pinv repair; servo
calibration transfer with a validation argument. Video ≈ 28 min (+10 orient); total
focused packet ≈ 5 h of the node's 8 h.

Last verified: 2026-08-21
