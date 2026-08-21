# l2-trig — Trigonometry for Rotation

Concept:
Trig rebuilt on the unit circle, in radians, as the mathematics of rotation — not
triangle-side ratios. Targets: (cosθ, sinθ) as coordinates of a rotating point;
sin/cos/tan graphs with amplitude/frequency/phase; sin²+cos²=1 as the circle equation;
atan2 as the quadrant-correct angle-recovery function. Payoff is immediate and permanent:
every joint angle, rotation matrix, wave, and phase in the next 200 days is this node.
Test-out philosophy: the school triangle-trig that survived is verified by unit test, and
only the unit-circle reframe is actually studied.

Learner prerequisites:
l2-functions-graphs (graph transformations — sin(2x−π/2) is read as a transformed sin) and
l2-algebra fluency. First FK exercise wants minimal Python; a pre-Python variant on paper +
Desmos works.

What beginners commonly misunderstand:
- sin = "opposite/hypotenuse" only: the triangle definition dies at θ=90°; the circle
  definition (y-coordinate at angle θ) is total, and school-trained adults must actively
  replace the old picture, not extend it.
- Degrees as default: radians are not a convention preference — arc length, angular
  velocity, d/dθ sin = cos, and every robotics/NumPy API are radians-native.
- arctan(y/x) "recovers the angle": it collapses quadrants II↔IV and III↔I and explodes at
  x=0; atan2(y,x) exists precisely because of this (the node makes the failure explicit).
- Phase read wrong: sin(2x−π/2) is shifted π/4 right, not π/2 — factor the frequency first:
  sin(2(x−π/4)); this is the same factoring rule as l2-functions-graphs.
- Identities as a memorization wall: only sin²+cos²=1 must be owned (it IS the circle);
  angle-sum formulas are lookups until the rotation-matrix derivation makes them obvious.

Candidate videos:
1. Unit circle (definition of trig functions) — Khan Academy (Sal) — [approx 4–9 min,
   unverified] —
   https://www.khanacademy.org/math/get-ready-for-precalculus/x65c069afc012e9d0:get-ready-for-trigonometry/x65c069afc012e9d0:unit-circle-introduction/v/unit-circle-definition-of-trig-functions-1
   (correctness 5, prereq fit 5, clarity 4, intuition 4, time-efficiency 5 — the exact
   triangle→circle reframe this node exists for)
2. The trig functions & right triangle trig ratios — Khan Academy — [approx 4–8 min,
   unverified] —
   https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig/x2ec2f6f830c9fb89:unit-circle/v/matching-ratios-trig-functions
   (bridges the school picture to the circle picture; clarity 4, exercise-paired 5)
3. Basic trigonometry — Khan Academy (YouTube) — [duration unverified] —
   https://www.youtube.com/watch?v=Jsiy4TxgIME (also https://www.youtube.com/watch?v=F21S9Wpi0y8)
   (triangle-first framing — STUCK-PATH only if SOH-CAH-TOA itself is gone; intuition 2 for
   this node's rotation goal)
4. Trigonometry — Khan Academy High School Math playlist — [multi-video, unverified] —
   https://www.youtube.com/playlist?list=PLSQl0a2vh4HDlPPGAIW8PrielZqH6FzKx
   (browse-on-failure bank, never linear)
No third-party unit-circle/atan2 video surfaced before this session's search budget closed;
none found — fallback: Khan per-skill videos above + the in-app rotation-2d widget, which
covers the "watch a point rotate" job interactively.

Candidate written resources:
1. Trig unit circle review — Khan Academy article — ~10 min —
   https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig/x2ec2f6f830c9fb89:unit-circle/a/trig-unit-circle-review
   (compact, exercise-adjacent; clarity 4, time-efficiency 5)
2. Trigonometry — open textbook, ch. 1 (U. Minnesota open library) —
   https://open.lib.umn.edu/trigonometry/chapter/chapter-1/ [content unverified this
   session] (text-path candidate for foundations; rigor 4)
3. "Trigonometry: An Overview of Important Topics" — Governors State Univ. short-course PDF —
   https://www.govst.edu/uploadedFiles/Academics/Colleges_and_Programs/CAS/Trigonometry_Short_Course_Tutorial_Lauren_Johnson.pdf
   [content unverified this session] (built exactly for returning students refreshing trig
   fast; STUCK-PATH text candidate)
4. OpenStax Algebra & Trigonometry 2e — trigonometric functions chapters + Practice Tests
   [repo-verified 2026-08-21 reference; egress-blocked this session] (authority + unseen
   final instrument)
5. Classtime mirror of Khan Trigonometry course —
   https://www.classtime.com/curriculum/c/khan-academy-khan-academy-(english---us-curriculum)-math-trigonometry/5489
   (structure reference only)

Community evidence:
- Khan Help Center, "Trigonometry Course is a mess": learners report the standalone Trig
  course is a confusing 4-unit stitch of the Geometry right-triangle unit + the Algebra 2
  trig unit — reinforces selecting the Algebra 2/Precalc units directly instead of the
  standalone course
  (https://support.khanacademy.org/hc/en-us/community/posts/27229402084237-Trigonometry-Course-is-a-mess)
- Search-verified structure note: "the Trigonometry unit in the Algebra 2 course builds on
  the Right triangles & trigonometry unit in the Geometry course; together those two units
  constitute the Trigonometry course" — i.e. the standalone course adds nothing beyond the
  units already selected (https://www.khanacademy.org/math/trigonometry/trigonometry-right-triangles)
- HN relearning threads: adults' retained trig is typically triangle-mechanical; what
  transfers to calculus/graphics is the circle/graph view — the reframe, not re-drill, is
  the work (https://news.ycombinator.com/item?id=39047825 , https://news.ycombinator.com/item?id=32258659)
- Khan Help Center: Skip-marks-incorrect + no mid-test restart — same honest-cold-diagnostic
  protocol as the rest of the cluster
  (https://support.khanacademy.org/hc/en-us/articles/26236154715789-Update-Navigate-Questions-at-Your-Own-Pace-with-the-Skip-Button)

Primary technical authority:
- OpenStax Algebra & Trigonometry 2e (unit-circle definitions, identities, graphs; practice
  tests) [repo-verified reference]. atan2's definition is an authority matter of programming
  math libraries (NumPy/C math documentation) — verify against `np.arctan2` behavior in
  the exercise itself.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, ~25 min: (1) node paper diagnostic — 150°→radians instantly; sketch
  sin(2x−π/2); compute atan2(−1,−1); (2) Khan Algebra 2 Trigonometry unit test cold (from
  the unit page https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig).
  ≥90% and clean paper answers ⇒ skip to IMPLEMENT/DERIVE + PROVE IT (the reframe work is
  never skipped).
- ORIENT: Unit circle video (candidate 1), ~5–9 min — watch even on a passed diagnostic if
  school trig was triangle-only; it is the reframe in minimal form.
- CORE WATCH: — (test-out node; per-skill videos via STUCK PATH only)
- CORE READ: Trig unit circle review article (~10 min)
  (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig/x2ec2f6f830c9fb89:unit-circle/a/trig-unit-circle-review)
  + memorize-by-derivation: exact values at 0, π/6, π/4, π/3, π/2 from the circle's
  symmetry, never as a table.
- INTERACTIVE: rotation-2d (watch (cosθ, sinθ) BE the rotating point; connect θ slider to
  coordinates before any formula) → then planar-arm as the FK preview (two angles → fingertip).
- PRACTICE: ~60–90 min, failures only:
  · Unit circle practice: https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig/x2ec2f6f830c9fb89:unit-circle/e/unit-circle
  · Remaining Algebra 2 :trig lesson exercises (radians, graphs, Pythagorean identity) to
    unit test ≥90%
  · Precalc trig unit test as the higher bar (https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:trig)
    — identities lessons lightly, per repo study note
  · 10 rapid conversions degrees↔radians + 5 phase-factored sketches a·sin(bx+c)
- IMPLEMENT/DERIVE: ~90 min, the node's heart:
  (1) orbit.py — animate/plot p(t)=(r·cos ωt, r·sin ωt); confirm sin²+cos²=1 numerically at
  every step.
  (2) First FK in ~15 lines: fingertip of a 2-link arm, x = l₁cosθ₁ + l₂cos(θ₁+θ₂),
  y = l₁sinθ₁ + l₂sin(θ₁+θ₂); check against the planar-arm widget.
  (3) Break arctan: evaluate arctan(y/x) vs atan2(y,x) on one point per quadrant + (0, ±1);
  write the 4-case definition of atan2 from the failures.
- STUCK PATH: matched Khan video per failed skill (candidates 2–4); text alternative: GovSt
  short-course PDF (returning-student refresher) or open.lib.umn.edu Trigonometry ch. 1
  [both content-unverified this session, URLs from live search].
- DEEPEN: Only if right-triangle basics themselves failed: Khan "Right triangles &
  trigonometry" unit (https://www.khanacademy.org/math/trigonometry/trigonometry-right-triangles);
  only if hungry for rigor: OpenStax trig chapters [repo-verified reference]. Skip the rest
  of the standalone Trig course (community-flagged as a redundant stitch).
- PROVE IT: Node mastery test, cold, ~40 min: derive from the unit circle (no memorized
  angle-sum formulas allowed as premises — derive or geometrically justify them) that a
  point p rotated by θ lands at (x cosθ − y sinθ, x sinθ + y cosθ); implement rotate(p, θ)
  with tests: composition rotate(θ₁)∘rotate(θ₂)=rotate(θ₁+θ₂), norm preservation,
  rotate(π/2) on unit vectors.
- TRANSFER: ~25 min: (1) robot heading — given velocity (vₓ, v_y) in all four quadrants,
  compute heading with atan2 and explain the two arctan failures it fixes; (2) express
  sin(2x−π/2) as a cosine and read amplitude/frequency/phase as a "wave spec"; (3) predict
  what the rotation-2d widget shows for θ=210° before moving the slider.
- RETENTION: Day +7: reproduce the five exact-value points on the circle from symmetry in
  ≤5 min; re-derive R(θ) cold; one fresh atan2 evaluation in quadrant III. Day +30 (when
  l5-frames-rotations opens): re-derive R(θ) as the warm-up — spaced by design.
Packet total: ~4–4.5 h fixed (node budget 6 h leaves room for patching).

Why this won:
The two Khan units (Algebra 2 :trig, Precalc :trig) were live-verified this session and are
the smallest test-out instruments covering every objective; the standalone Trigonometry
course was checked and rejected with community evidence that it is literally those units
restitched. The packet deliberately spends its minutes on the three artifacts (orbit, FK,
rotate+tests) rather than video, because the node's stated purpose is rotation-readiness —
and the existing rotation-2d/planar-arm widgets give an interactive core no external video
matches. Unit-circle reframe stays mandatory even on a passed diagnostic: passing
school-style questions with the triangle picture is precisely the recognition-vs-mastery
trap flagged for this learner.

What was rejected (and why):
- Khan standalone Trigonometry course as the spine — community-verified "mess"; redundant
  with the selected units (support post above).
- 3B1B Lockdown-math trig / third-party unit-circle explainers — could not be verified this
  session (search budget exhausted before the video-candidate pass); rather than include
  unverified URLs, the slot falls back to Khan's exercise-paired videos + widgets. Revisit
  on next curation pass.
- Triangle-drill workbooks / identity-proving problem sets — school trig's long tail
  (sum-to-product etc.) is explicitly out of scope; identities beyond sin²+cos²=1 are
  lookups per node objectives.
- Precalc "identities" deep lessons — repo study note already caps them at "lightly";
  keeping that cap.

Risk of superficial understanding:
Highest-risk node of the cluster for false mastery: unit-circle exact values can be
flash-carded and unit tests passed while the learner still cannot say what cos MEANS as a
coordinate — which surfaces 3 weeks later as inability to read a rotation matrix. The
derivation-based PROVE IT (rotation from the circle, no memorized formulas) and the widget
prediction task (state coordinates before moving the slider) are the specific antidotes.
atan2 risk: memorizing "use atan2" without owning the quadrant failure — hence the
break-arctan-first exercise ordering. Radians risk: converting via 180/π mechanically while
still thinking in degrees; the rapid-conversion drill plus radians-only policy in all code
kills the crutch.

Required active work:
Cold diagnostic + unit test ≥90%; exact values re-derived from symmetry; orbit.py; 2-link
FK 15-liner checked against planar-arm; arctan-breaking table + atan2 4-case definition;
rotate(p,θ) with passing tests; day-7 and day-30 rederivations.
Last verified: 2026-08-21
