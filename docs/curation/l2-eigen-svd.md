# l2-eigen-svd — Eigenvalues, Eigenvectors & SVD

Concept:
Av = λv as "directions the map only stretches"; eigendecomposition of symmetric matrices;
powers of A through eigenvalues (the stability preview control theory will cash in); SVD
as rotate–stretch–rotate for EVERY matrix, singular values as importance ranking, and
truncated SVD A_k = Σσᵢuᵢvᵢᵀ as the master low-rank approximation — the picture behind
PCA, conditioning, and LoRA's ΔW = BA.

Learner prerequisites:
l2-linear-maps at Gold (basis, rank, change of basis — 3B1B Ch 13 is the direct
launchpad for Ch 14's eigenbasis payoff); determinant intuition from l2-matrices;
comfortable NumPy.

What beginners commonly misunderstand:
- Believing every matrix has real eigenvectors — the rotation matrix counterexample
  (complex eigenvalues, no invariant direction) is this node's diagnostic for a reason.
- Conflating eigendecomposition and SVD: expecting U = V, or applying eigen-thinking to
  nonsquare/nonsymmetric matrices where only SVD applies; not knowing SVD exists for
  EVERY matrix while eigendecomposition does not.
- Eigenvectors as "special outputs" rather than invariant DIRECTIONS (any scalar
  multiple works; sign/scale non-uniqueness confuses numerical checks).
- Expecting eigenvectors to be orthogonal in general — true for symmetric matrices only
  (the spectral-theorem privilege PCA relies on).
- det(A−λI) = 0 executed with no idea WHY singularity is the requirement (3B1B Ch 14
  derives it; learners who skip to the recipe cannot reconstruct it).
- Watch-only trap, sharpest here: after Ch 14 learners can nod at Av=λv yet cannot
  compute a 2×2 eigenpair or explain what σ₁/σₙ says about a system.

Candidate videos:
1. Eigenvectors and eigenvalues | Chapter 14 — 3Blue1Brown — ≈17 min [approx] —
   https://www.youtube.com/watch?v=PFDu9oVAE-g
   (the canonical geometric introduction; derives det(A−λI)=0 from collapse; ends on
   eigenbasis/diagonalization — feeds the powers-of-A exercise directly; intuition 5)
2. A quick trick for computing eigenvalues | Chapter 15 — 3Blue1Brown —
   duration [unverified, ~13 min] — https://www.youtube.com/watch?v=e50Bj7jn9IQ
   (2021 addition; mean/product trick for 2×2 — a speed tool AFTER the concept holds;
   optional)
3. Singular Value Decomposition (SVD): Mathematical Overview — Steve Brunton —
   duration [unverified, ~12 min] — https://www.youtube.com/watch?v=nbBvuuNVfco
   (rotate–stretch–rotate + UΣVᵀ anatomy from the author of Data-Driven Science and
   Engineering; correctness 5, clarity 4–5, the standard community pick to patch 3B1B's
   missing SVD chapter)
4. Singular Value Decomposition (SVD): Matrix Approximation — Steve Brunton —
   duration [unverified, ~14 min] — https://www.youtube.com/watch?v=xy3QyyhiuY4
   (truncated SVD/Eckart–Young — exactly the image-compression + LoRA picture this
   node's mastery test demands)
5. Singular Value Decomposition (the SVD) — Gilbert Strang, MIT OCW —
   duration [unverified, ~7 min] — https://www.youtube.com/watch?v=mBcLRGuAFUk
   (the inventor-adjacent authority in miniature; stuck-path alternate voice)
6. Singular Value Decomposition (SVD): Overview — Steve Brunton —
   duration [unverified] — https://www.youtube.com/watch?v=gXbThCXjZFM
   (higher-level framing; redundant with #3 for this packet — rejected from core)
7. MIT 18.06 L21–22 (eigen) + L29 (SVD) — Strang — ~50 min each — existing repo backup
   (mit-1806) — full-rigor fallback, too heavy for core on this timeline.

Candidate written resources:
1. MML book Ch 4 (Matrix Decompositions) — free PDF —
   https://mml-book.github.io/book/mml-book.pdf
   (§4.2 Eigenvalues and Eigenvectors p.105 · §4.4 Eigendecomposition and
   Diagonalization p.115 · §4.5 Singular Value Decomposition p.119 · §4.6 Matrix
   Approximation p.129 · exercises p.137 — section/page numbers verified this session;
   the exact ML-dialect treatment, includes the geometry figures)
2. Eigenvectors and Eigenvalues Explained Visually — Setosa (Powell/Lehe) — interactive —
   https://setosa.io/ev/eigenvectors-and-eigenvalues/
   (drag the matrix, watch invariant directions; ideal pre-video primer, 5–10 min)
3. 3blue1brown.com/lessons/eigenvalues/ — text version of Ch 14 with embedded
   interactive Questions (verified in site source repo) — retrieval reps built in.
4. Gregory Gundersen, "Singular Value Decomposition as Simply as Possible" —
   https://gregorygundersen.com/blog/2018/12/10/svd/ [title-level evidence — URL
   verified this session, page not fetchable] — alternate written SVD walkthrough.
5. The Art of Linear Algebra (Hiranabe) — free graphic notes on Strang, with one-page
   EVD and SVD diagrams — https://github.com/kenjihiranabe/The-Art-of-Linear-Algebra
   (repo + SVD/EVD sources verified this session; ideal one-page retention artifact)

Community evidence:
- The 3B1B series famously has NO SVD chapter — courses and curated lists across GitHub
  patch it with Brunton's SVD playlist (e.g. https://github.com/davrot/pytutorial
  preparation list pairs "SVD: Overview" + "Mathematical Overview";
  https://github.com/alcatraz47/tad lists the full Brunton SVD sequence; a university
  text-analysis course cites "Steve Brunton (2020), SVD: Mathematical Overview /
  Matrix Approximation" — https://github.com/lipogg/textanalyse-mit-r). The Brunton
  patch is the de-facto community standard.
- Setosa's eigenvector page is the standard interactive companion in ML study guides
  (e.g. https://github.com/DS-AI-GATE/dsai-gate ML fundamentals list;
  https://github.com/ml4a/ml4a.github.io intro pairs it with the 3B1B playlist).
- Grant Sanderson's own "do problems yourself" caveat (see l2-vectors record;
  https://www.3blue1brown.com/lessons/sphere-area) — and his eigenvalues lesson opens by
  admitting students find this topic "particularly unintuitive… left floating away
  unanswered in a sea of computations" (lesson source fetched from
  https://github.com/3b1b/3Blue1Brown.com) — i.e. the author designed Ch 14 as the
  intuition half and expects the computation half to happen elsewhere. This packet is
  that elsewhere.
- MML's own repo ships a PCA tutorial notebook (tutorial_pca.ipynb, with solutions) —
  https://github.com/mml-book/mml-book.github.io (README fetched this session) —
  official active-work companion to Ch 4/Ch 10.

Primary technical authority:
- MML book (Deisenroth/Faisal/Ong 2020), https://mml-book.github.io/ (PDF:
  https://mml-book.github.io/book/mml-book.pdf): §4.2, §4.4, §4.5, §4.6 + Ch 4
  exercises (p.137). Still maintained (errata process live on the site).
- Numerical ground truth for all exercises: numpy.linalg.eig / svd documentation
  behavior (verified against hand results in IMPLEMENT).

Selected shortest-sufficient packet:
- DIAGNOSTIC: cold (10 min): (1) eigenvalues of a 90° rotation matrix — what goes
  wrong and what does it mean? (2) eigenvalues/vectors of diag(3, ½) and of
  [[3,1],[0,2]]; (3) what does σ₁/σₙ tell you about solving Ax=b? Clean sweep → skim
  §4.5–4.6, jump to PROVE IT.
- ORIENT: Setosa eigenvectors interactive (5–10 min of dragging BEFORE any video —
  find the invariant directions of a symmetric and a shear matrix by hand/eye).
- CORE WATCH: 3B1B Ch 14 (≈17 min, PFDu9oVAE-g) with 4 retrieval questions after
  (why does det(A−λI)=0 have to hold? what is an eigenbasis good for? which matrices
  have none? what does a repeated eigenvalue with one direction look like?). Then
  Brunton "SVD: Mathematical Overview" (nbBvuuNVfco, ~12 min [unverified]) + "SVD:
  Matrix Approximation" (xy3QyyhiuY4, ~14 min [unverified]). ≈ 43 min total.
  Optional +13: Ch 15 quick-trick after hand practice, as a speed tool.
- CORE READ: MML §4.2 (pp.105–114) → §4.4 (pp.115–119) → §4.5 (pp.119–129) → §4.6
  (pp.129–134); §4.1 determinant/trace as 10-min skim only (covered geometrically in
  l2-matrices); §4.3 Cholesky SKIP for now (returns with Gaussians). ≈ 2–2.5 h with
  worked examples. This is the node's formalism spine.
- INTERACTIVE: matrix-transform (in the l2-eigen-svd in-app lesson, 85 min): set
  [[3,1],[0,2]], hunt the two invariant directions by eye, then verify against your
  hand-computed eigenvectors; set a rotation and watch the hunt fail.
- PRACTICE: (hand, ~60 min) eigenpairs of [[3,1],[0,2]], one symmetric matrix
  ([[2,1],[1,2]]), and diag(3,½) — verify Av=λv each time; 3 iterations of power
  iteration by hand on the symmetric one; MML Ch 4 exercises (p.137): 2 eigen + 1 SVD;
  apply Ch 15's mean-product trick to speed-check your 2×2 answers (optional).
- IMPLEMENT/DERIVE: (~90 min) [= node exercises] (1) truncated-SVD image compression:
  plot reconstruction quality vs k, find the elbow, annotate σ-spectrum; (2) iterate
  x ← Ax for eigenvalues inside/outside the unit circle — plot trajectories, answer
  "will this system blow up?"; (3) PCA on a 2D point cloud from scratch: covariance →
  eigenvectors → projection (check against the MML tutorial_pca notebook only AFTER
  your own version runs).
- STUCK PATH: 3blue1brown.com/lessons/eigenvalues/ (text + embedded Questions); Strang
  "Singular Value Decomposition (the SVD)" (mBcLRGuAFUk) for a second SVD voice;
  Gundersen's SVD post for a written walkthrough.
- DEEPEN: MIT 18.06 L21–22 + L29 (existing repo backup mit-1806) or RES.18-010 "A 2020
  Vision of Linear Algebra" as the 2 h capstone; Brunton's full SVD playlist
  (https://www.youtube.com/playlist?list=PLMrJAkhIeNNSVjnsviglFoY2nXildDCcv) toward
  data-driven methods; The Art of Linear Algebra EVD/SVD one-pagers as a wall chart.
- PROVE IT: [= node masteryTest] implement power iteration from scratch to find the top
  eigenvector of a fresh symmetric matrix, prove to yourself it converged (ratio test),
  AND write ≤1 page explaining LoRA's ΔW = BA through the truncated-SVD picture of
  low-rank structure (§4.6 language: what is kept, what is discarded, why r ≪ n is
  enough).
- TRANSFER: control preview — for the damped 2D system x ← Ax with A = R(10°)·diag(.98,
  .95), predict long-run behavior from eigenvalue magnitudes BEFORE simulating; then
  connect: "training explodes/dies" = the same spectral statement about repeated linear
  maps. Second transfer: explain why the covariance matrix's top eigenvector IS the
  direction of maximum variance (tie back to l2-linear-maps projections).
- RETENTION: +7–10 days, cold: state which matrices admit eigendecomposition vs SVD;
  write A = UΣVᵀ and say what each factor DOES geometrically; sketch what happens to
  x ← Ax for |λ|max = 1.03 vs 0.97 (≤8 min).

Why this won:
Ch 14 remains the best geometric opener for eigen (and the repo's research already
banked 3B1B); but 3B1B provably lacks an SVD chapter, and the community's standard,
authority-grade patch is Brunton's two focused SVD videos — Mathematical Overview for
UΣVᵀ anatomy, Matrix Approximation for exactly the low-rank/Eckart–Young picture the
mastery test's LoRA question requires. MML Ch 4 stays the formal spine (unchanged from
the repo), with granularity sharpened: §4.6 Matrix Approximation PROMOTED into core
(it is the LoRA/compression payload) and §4.1 DEMOTED to skim (determinant/trace
already earned geometrically in l2-matrices). Setosa-first ordering gives the learner
an invariant-direction "feel" to hang Ch 14 on — 10 interactive minutes that community
guides consistently pair with the series.

What was rejected (and why):
- Running MIT 18.06 L21/22/29 as core (current node backup): ~2.5 h of lecture for
  content Ch 14 + Brunton + MML cover in ~3 h INCLUDING the reading and with better
  exercise integration; stays DEEPEN/fallback exactly as the repo intended.
- Brunton "SVD: Overview" (gXbThCXjZFM): overlaps Mathematical Overview; one framing
  video is enough.
- Visual Kernel's SVD series and other one-off visualizers: could not verify URLs this
  session (search budget exhausted) — not listed rather than risk fabrication; Brunton
  + Strang cover the same ground with named authority.
- 3B1B Ch 16 "Abstract vector spaces": beautiful but zero exercise surface and not on
  this node's critical path (functions-as-vectors returns in l4/l6 contexts).
- Teaching eigen via characteristic-polynomial drill (the trad route): explicitly
  anti-goal; the node needs det(A−λI)=0 derived once, understood forever, then NumPy.

Risk of superficial understanding:
VERY HIGH — the famous failure mode of this topic (Grant's own framing: intuition
"left floating away… in a sea of computations", and the inverse failure — computation
with no intuition — is what recognition-mode learners produce here). The specific
tells: can say "stretch direction", cannot produce an eigenpair by hand; can run
np.linalg.svd, cannot say what U does. The packet forces both directions: hand
eigenpairs verified numerically, power iteration built from scratch, and a
words-and-pictures LoRA explanation that cannot be pattern-matched from any single
source in the packet.

Required active work:
3 hand eigenpairs + hand power iteration + 3 MML exercises; SVD compression with elbow
analysis; stability simulation; from-scratch PCA (checked against MML's official
notebook after); PROVE IT power-iteration + LoRA essay; two transfer tasks. Video ≈
43–56 min; total focused packet ≈ 6 h of the node's 8 h (85-min in-app lesson
included in the remainder).

Last verified: 2026-08-21
