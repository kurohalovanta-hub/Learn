# l2-vectors — Vectors & Dot Products

Concept:
Vectors as arrows in space AND as ordered data (the two views must fuse); addition and
scaling geometrically; the dot product three ways — algebraic Σaᵢbᵢ, geometric ‖a‖‖b‖cosθ,
and as similarity/projection; norms, distances, unit vectors, projection of a onto b.
Foundation claim for the whole field: states, actions, observations, gradients and
embeddings are vectors, and attention scores are dot products.

Learner prerequisites:
l2-functions-graphs (function notation, sketching); l2-trig unit-circle fluency for the
cosθ reading (sin²+cos²=1, atan2). No prior linear algebra, no NumPy fluency assumed —
this node introduces the first real NumPy work.

What beginners commonly misunderstand:
- Treating "arrow" and "list of numbers" as two unrelated definitions instead of two views
  of one object (3B1B Ch 1 exists precisely to fuse them).
- Believing the dot product is "just the formula" — never connecting Σaᵢbᵢ to ‖a‖‖b‖cosθ,
  so cosine similarity later feels like magic.
- Sign blindness: not knowing instantly that a·b < 0 means "pointing more than 90° apart".
- Projection direction confusion: proj_b a is a vector ALONG b, scaled by (a·b)/(b·b) —
  learners routinely swap a and b or forget the denominator.
- Recognition-vs-mastery trap (this cluster's known caveat): the 3B1B animations feel like
  understanding; without immediate hand calculation + implementation the intuition decays
  in days. Evidence below.

Candidate videos:
1. Vectors | Chapter 1, Essence of linear algebra — 3Blue1Brown — 9:52 —
   https://www.youtube.com/watch?v=fNk_zzaMoSs
   (correctness 5, prereq fit 5, intuition 5, time-efficiency 5; the canonical
   arrow-vs-list fusion; 12M+ views; zero datedness risk)
2. Linear combinations, span, and basis vectors | Chapter 2 — 3Blue1Brown — 9:59 —
   https://www.youtube.com/watch?v=k7RM-ot2NWY
   (intuition 5; span/basis vocabulary needed by every later node; slightly ahead of this
   node's objectives but cheap at 10 min and pre-loads l2-linear-maps)
3. Dot products and duality | Chapter 9 — 3Blue1Brown — ≈14–15 min [approx] —
   https://www.youtube.com/watch?v=LyGKycYT2v0
   (the WHY of algebraic=geometric via duality; rigor 4, intuition 5; caveat: the duality
   argument leans on the transformation view from Ch 3–4, so it lands best as this node's
   capstone and fully clicks after l2-matrices)
4. Khan Academy vector videos (unit: vectors) — Sal Khan — long multi-video unit
   (prereq fit 5 but time-efficiency 2 vs 3B1B; slower, computation-first; kept as
   remedial only)
5. Three-dimensional linear transformations | Chapter 5 — 3Blue1Brown — 4:46 —
   https://www.youtube.com/watch?v=rHLEWRxRGiM (not this node's topic; noted for cluster
   completeness, assigned in l2-matrices)

Candidate written resources:
1. VMLS (Boyd/Vandenberghe) Ch 1 §1.1–1.4 + Ch 3 §3.1–3.4 — free PDF —
   https://vmls-book.stanford.edu/vmls.pdf
   (correctness 5, prereq fit 5 — proof-light, data-first examples; the exact vocabulary
   applied ML uses; exercises included)
2. 3blue1brown.com text lessons "Vectors" and "Span" — free —
   https://www.3blue1brown.com/lessons/span/ (text version of the videos WITH embedded
   interactive check questions — verified in the site's source repo that vectors/span/
   dot-products lesson pages all contain <Question> quiz blocks)
3. Immersive Linear Algebra (Ström/Åström/Akenine-Möller) ch 2–3 — free interactive book —
   http://immersivemath.com/ila/index.html (draggable figures; good stuck-path, weaker
   exercise culture)
4. Python Language Companion to VMLS (Leung/Matsypura) — free PDF —
   https://ses.library.usyd.edu.au/handle/2123/21370 (chapter-by-chapter NumPy
   transliteration; pairs directly with CORE READ)

Community evidence:
- Grant Sanderson himself, in his own site's lesson text: "the best way to really learn
  math is to do problems yourself, which is a bit hypocritical coming from a channel
  essentially consisting of lectures" — the creator's own statement of this cluster's
  caveat (source fetched from the site's repo: https://github.com/3b1b/3Blue1Brown.com,
  app/pages/lessons/2018/sphere-area/index.mdx; live at
  https://www.3blue1brown.com/lessons/sphere-area)
- TeachYourselfCS positions Essence of Linear Algebra as the STARTING point, "followed by
  Gilbert Strang's book and video lectures" — i.e., the series is an intuition primer,
  never the complete course (mirror fetched:
  https://github.com/izackwu/TeachYourselfCS-CN — TeachYourselfCS.md, English section)
- A graduate course (UF COT5615, Math for Intelligent Systems) institutionalizes exactly
  this node's packet: VMLS §1.1–1.5, 2.1–2.2 reading paired with 3B1B Ch 1 —
  https://github.com/meanmachin3/COT5615 (README fetched this session)
- Learners publish whole note-taking repos/blogs to make the series stick — e.g.
  https://github.com/SireJeff/linear-algebra-3blue1brown-notes and the retrospective
  "Understanding 3blue1brown Essence of Linear Algebra" (https://hongtaoh.com/en/2022/07/07/la/)
  [title-level evidence — pages not fetchable this session]: passive watching is
  widely reported as insufficient; serious learners convert the videos into active work.

Primary technical authority:
- VMLS: Boyd & Vandenberghe, *Introduction to Applied Linear Algebra* (Cambridge, 2018),
  free PDF at https://vmls-book.stanford.edu/vmls.pdf — Ch 1 (Vectors: §1.1 Vectors,
  §1.2 Vector addition, §1.3 Scalar-vector multiplication, §1.4 Inner product) and Ch 3
  (Norm and distance: §3.1 Norm, §3.2 Distance, §3.3 Standard deviation, §3.4 Angle).
  Section titles verified this session via course mirrors of the TOC.
  Additional exercises: https://web.stanford.edu/~boyd/vmls/vmls-additional-exercises.pdf

Selected shortest-sufficient packet:
- DIAGNOSTIC: cold, no notes (8 min): for a=(3,4), b=(1,0) compute a·b, ‖a‖, cosθ; state
  when a·b is zero / negative / maximal; prove ‖a‖=√(a·a). Clean sweep with instant
  answers → jump straight to PROVE IT.
- ORIENT: — (Ch 1 is already the orientation)
- CORE WATCH: 3B1B Ch 1 "Vectors" (9:52, fNk_zzaMoSs) + Ch 2 "Linear combinations, span,
  and basis vectors" (9:59, k7RM-ot2NWY) ≈ 20 min. After EACH video, answer 3 retrieval
  questions from memory before proceeding (e.g. Ch 1: state both views of a vector and
  the operation that connects them; Ch 2: define span of {a,b}; when do two vectors fail
  to span the plane?). Then, AFTER Practice below, Ch 9 "Dot products and duality"
  (≈14–15 min, LyGKycYT2v0) as capstone — flag: its duality argument previews the
  matrix-as-transformation view; re-watch after l2-matrices if it half-clicks.
- CORE READ: VMLS §1.1–1.4 (~20 pp) + §3.1–3.4 (~18 pp), ≈ 45–55 min, working the inline
  examples by hand; skip §1.5/§3.3 on a fast pass (complexity, stdev — return in
  l2-random-variables).
- INTERACTIVE: vector-playground (in the l2-vectors in-app lesson, 70-min lesson uses it
  twice) — drag a and b until a·b = 0, then negative, then maximal; watch the projection
  bar track cosθ.
- PRACTICE: (hand, ~40 min) VMLS exercises from Ch 1 and Ch 3 (inner products, norms,
  angle — pick 6 from the book + 2 from the additional-exercises PDF); plus: compute
  dot/norm/angle for 5 vector pairs by hand and CHECK each in NumPy afterward
  (commit-before-reveal).
- IMPLEMENT/DERIVE: (~40 min) dot, norm, cosine_similarity, project(a, b) in NumPy from
  primitives (no @ until each is hand-rolled once); verify a·b = ‖a‖‖b‖cosθ numerically on
  20 random pairs; word-vector toy — rank 10 vectors by cosine similarity to a query.
- STUCK PATH: 3blue1brown.com text lessons /lessons/vectors/ and /lessons/span/ (same
  argument, self-paced, embedded check questions); immersivemath ch 2–3 draggable figures
  for the geometric view.
- DEEPEN: VMLS Ch 2 (Linear functions §2.1–2.2) — only if hungry; it bridges directly
  into l2-matrices. 3B1B Ch 9 rewatch post-l2-matrices counts as deepening too.
- PROVE IT: derive the projection formula proj_b a = ((a·b)/(b·b))b from the condition
  "error (a − cb) ⟂ b" alone, on paper, then implement and test it; explain in ≤5
  sentences why attention scores are dot products (query-key similarity). [= node
  masteryTest]
- TRANSFER: robotics context — given a robot at heading h (unit vector) and an obstacle
  direction d, use sign(h·d) and the projection of velocity onto d to decide "moving
  toward or away, and how fast"; no lesson scaffold.
- RETENTION: +7 days, cold: re-derive the projection formula and re-implement
  cosine_similarity from an empty file (≤10 min); if either stalls, re-do PRACTICE set B.

Why this won:
Ch 1+2 are the highest-intuition-per-minute introduction in existence (score sweep on
clarity/intuition/time), and VMLS §1.1–1.4 + §3.1–3.4 is the only beginner-fit written
treatment that speaks the exact applied-ML dialect (norm/distance/angle as data
operations) while shipping exercises. The packet's video→retrieval→read→hand→NumPy→unseen
sequence directly implements HANDOVER's cluster pattern and neutralizes the known
watch-only failure mode. Ch 9 placed as capstone (not opener) because its duality
argument presumes the transformation view — sequencing verified against the series' own
ordering.

What was rejected (and why):
- Khan Academy vectors unit as CORE: 3–4× the minutes for the same objectives; retained
  implicitly as remedial via l2-algebra habits. (Khan's linear-algebra course is video-only
  in most of the unit — weak exercise compatibility here.)
- MIT 18.06 Lecture 1: too heavy for this node's scope; 18.06 stays where the repo
  already has it (eigen lectures backup, capstone use).
- Whole-playlist assignment ("watch all 16"): explicitly banned by the cluster guidance —
  this node needs exactly Ch 1, 2, 9.
- immersivemath as CORE READ: charming interactivity but VMLS beats it on exercises,
  notation continuity (NumPy companion), and ML vocabulary; kept as STUCK PATH.

Risk of superficial understanding:
HIGH — this is the cluster where "I watched it and it made sense" is most seductive
(creator himself warns watching ≠ doing). The tell: fluent talk about arrows, inability
to compute proj_b a or explain a·b < 0 sixty seconds later. Mitigation is structural:
retrieval questions between videos, commit-before-reveal hand calcs, and a
derivation-based PROVE IT that cannot be pattern-matched from the videos.

Required active work:
5 hand-calculation pairs + 8 VMLS exercises; 4 NumPy primitives implemented and verified
against the cosθ identity; projection formula derived from orthogonality; cosine-ranking
toy; delayed cold re-derivation. Video minutes ≈ 34; total focused packet ≈ 3.5 h
(node budget 6 h leaves room for the 70-min in-app lesson + stuck paths).

Last verified: 2026-08-21
