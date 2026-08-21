# l5-lie-se3 — SE(3), Twists & the Micro-Lie Toolkit

Concept: Homogeneous transforms T∈SE(3); so(3)/se(3) as tangent spaces; exp/log maps;
twists as pose velocity; local perturbations ⊞/⊟ and why optimization/interpolation on
rotations must happen in local coordinates (Solà conventions + Jacobian tables).

Learner prerequisites: l5-quaternions (rotation representations), l2-eigen-svd (matrix
exponential intuition via eigen-decomposition), l2-derivatives. This is the node where
the curriculum's math ceiling rises — budget the full 8 h; the guidance explicitly
forbids compressing this to a summary.

What beginners commonly misunderstand:
- exp/log here are MATRIX exp/log (of a skew-symmetric/twist matrix), not elementwise —
  learners who type np.exp(R) get nonsense that still "runs".
- The translational part of a twist is NOT the velocity of the body origin — v = ṗ − ω×p
  subtleties; conflating twist coordinates with "linear velocity + angular velocity
  stacked" causes silent errors in Jacobians later.
- ⊞ is not addition: T ⊞ ξ = T·exp(ξ^) (local/right) or exp(ξ^)·T (global/left); WHICH
  side is a convention choice and libraries differ — mixing left/right perturbations is
  the classic estimation bug the Solà paper exists to prevent.
- "Why can't I just optimize the 9 entries of R?" — the manifold has 3 DOF; naive
  gradient steps leave SO(3), and projecting back ≠ optimizing on the manifold.
- Fear that "Lie theory" requires a semester of abstract algebra — the micro paper's
  entire thesis is that the needed subset is small, concrete, and computational.

Candidate videos:
1. "Joan Solà — Lie theory for the Roboticist" — IROS'20 Workshop on Bringing Geometric
   Methods to Robot Learning (uploaded 2020-10-13) — [approx ~1 h, duration unverified]
   — https://www.youtube.com/watch?v=QR1p0Rabuww
   (the author teaching his own paper; correctness 5, rigor 5, matches the exact
   notation/tables the learner will implement 5, beginner fit 3 — dense, but the paper
   is the follow-along; time efficiency 5 for what it replaces)
2. "Lie theory for the roboticist" — Joan Solà, Robotics & AI Summer School 2020 —
   [duration unverified] — https://www.youtube.com/watch?v=nHOcoIyJj2o
   (second recording of the same material, different audience/Q&A — ideal STUCK PATH:
   same content, second telling)
3. LAASTube mirror of the Solà lecture —
   https://peertube.laas.fr/videos/watch/52ffc81c-09ce-41e9-8d6c-8c8d2b664d71
   (backup host if YouTube is unavailable)
4. "Lie Theory" playlist — https://www.youtube.com/playlist?list=PL--_5dZ5V_Ak31VEwwnTQm7MnZl3EbDbQ
   [creator/content unvetted this session — not selected]

Candidate written resources:
1. Solà, Deray, Atchuthan — "A micro Lie theory for state estimation in robotics" —
   arXiv:1812.01537 (latest v9, 2021-12-08) — https://arxiv.org/abs/1812.01537 (PDF:
   https://arxiv.org/pdf/1812.01537)
   (correctness 5, rigor 5, future relevance 5 — its ⊞/⊟/Jacobian conventions ARE the
   conventions of manif and of modern estimation papers; beginner fit 3 alone, 4 with
   the lecture first; the appendix tables are a permanent desk reference)
2. Modern Robotics Ch 3.3 (homogeneous transforms, twists, screws) —
   https://hades.mech.northwestern.edu/index.php/Modern_Robotics
   (the screw-theoretic road to the same objects; the two views triangulate)
3. Bang-Shien Chen, "Lie theory in Robotics" (learner-written companion notes) —
   https://dgbshien.com/docs/blogs/lie-theory.pdf
   (evidence-of-use + a condensed restatement; STUCK-PATH read, not authority)
4. manif documentation (Solà-convention reference library, C++ with Python bindings) —
   https://artivis.github.io/manif/ (repo fetched this session:
   https://github.com/artivis/manif — implements SO(2/3), SE(2/3), SE_2(3), bundles;
   README directs users to read the paper first)

Community evidence:
- The manif library README instructs users to read the micro-Lie paper before using the
  library — the paper is the field's agreed on-ramp, not one option among many.
  (https://github.com/artivis/manif — fetched 2026-08-21)
- Learners write and publish their own companion notes to the paper — it is studied, not
  skimmed. (https://dgbshien.com/docs/blogs/lie-theory.pdf)
- summarize.tech digests exist for the "Lie theory for the roboticist" lectures —
  learners try to shortcut this topic; the curriculum guidance explicitly forbids the
  10-minute-summary route, and the digest's existence is the cautionary signal.
  (https://www.summarize.tech/www.youtube.com/watch?v=gy8U7S4LWzs)
- The paper is a standard citation in learning/estimation work (e.g. GEM,
  arXiv:2104.02844 builds directly on group structure) — the ⊞/⊟ formalism is what the
  learner will meet again in papers. (https://arxiv.org/pdf/2104.02844)

Primary technical authority:
- Solà et al., arXiv:1812.01537 v9 — §I–IV + SO(3)/SE(3) example boxes + appendix
  Jacobian tables. Reference implementation: manif (artivis.github.io/manif).

Selected shortest-sufficient packet:
- DIAGNOSTIC: Node diagnostic — what is log of a rotation matrix, geometrically? Why
  can't you add rotation matrices to optimize them? Plus: is T⊞ξ the same as ξ⊞T? ~10 min.
- ORIENT: Paper §I + Fig. 1 (the manifold-and-tangent-plane picture), ~10 min — get the
  one picture everything else decorates.
- CORE WATCH: Solà IROS'20 lecture (QR1p0Rabuww) in FULL, ~1 h [approx] — pause-and-note,
  no 2× skimming; the guidance explicitly protects this hour.
- CORE READ: Paper §II–IV + SO(3)/SE(3) boxes + appendix tables, ~2.5–3.5 h with pen —
  every boxed identity gets verified numerically in NumPy as you read (this doubles as
  the start of IMPLEMENT).
- INTERACTIVE: so3-explorer widget (exp/log geodesic behavior); in-app lesson l5-lie-se3
  (90 min).
- PRACTICE: Node exercises — geodesic (log/exp) interpolation vs naive matrix lerp,
  visualized; numeric verification of the SO(3) Jacobian tables on random perturbations.
- IMPLEMENT/DERIVE: Complete se3.py — SE(3) exp/log, adjoint, ⊞/⊟ (right AND left,
  labeled); property suite: exp(log(T))=T, log(exp(ξ))=ξ near identity, Ad_T exp(ξ) =
  exp(Ad_T ξ)·… identities; cross-check against manif's Python bindings as oracle.
- STUCK PATH: Second Solà recording (nHOcoIyJj2o) — same material, second telling; or MR
  Ch 3.3's screw-theory road to twists; Chen's condensed notes for a third phrasing.
- DEEPEN: Paper §V (derivative zoo) only when a specific Jacobian is needed; manif docs;
  SE_2(3) (extended pose) when estimation nodes arrive.
- PROVE IT: Node mastery test — 30-case property suite green (exp/log round trips,
  adjoint identities) + one paragraph: why optimization on rotations uses local
  coordinates.
- TRANSFER: Open kevinzakka/mjctrl diffik.py (fetched this session:
  https://github.com/kevinzakka/mjctrl) and identify the line(s) computing the
  orientation error — state which ⊟ convention (local or global frame) the code uses
  and what would change if you flipped it.
- RETENTION: +14 days: sketch the exp map for SO(3) from the series definition and
  derive Rodrigues from it; re-verify one appendix Jacobian table numerically without
  looking at your old code.

Why this won: Author-taught lecture + author's paper + author-convention library is the
rare perfectly-aligned stack: one notation from first exposure to permanent reference.
The lecture de-abstracts the paper; the paper's boxes/tables become the learner's
property tests; manif is the independent oracle. Nothing shorter is sufficient — the
guidance and the misconception profile (left/right perturbation bugs) both demand the
full treatment.

What was rejected (and why): Any summary-level substitute (10-min Lie videos,
summarize.tech digests) — explicitly forbidden by cluster guidance and pedagogically
right: this node's failure mode is exactly premature familiarity. Abstract Lie-theory
courses/texts (semester-scale, wrong selection of material for robotics). The unvetted
"Lie Theory" playlist (couldn't verify author/quality this session). Ethan Eade's notes
[no URL verified this session] — commonly cited alternative, but adds a second
convention set at the wrong moment.

Risk of superficial understanding: Highest in the cluster. The symbols (exp, log, ⊞)
are easy to recognize and easy to fake; only the property suite + the mjctrl
convention-identification transfer prove the learner can OPERATE the formalism. Watch
for "I get the idea" claims without passing adjoint-identity tests — that is the
recognition-vs-mastery trap this curriculum is built to catch.

Required active work: Numeric verification of every boxed identity while reading; the
full se3.py with right/left ⊞ labeled; 30-case property suite; geodesic-vs-lerp
visualization; the diffik.py convention hunt.

Last verified: 2026-08-21
