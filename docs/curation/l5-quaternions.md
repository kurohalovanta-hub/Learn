# l5-quaternions — Euler Angles, Axis-Angle & Quaternions

Concept: Why any 3-number chart of orientation must fail somewhere (gimbal lock);
axis-angle and Rodrigues' formula; unit quaternions (half-angle form, composition,
inverse, double cover q ≡ −q); slerp intuition; which representation to use when.

Learner prerequisites: l5-frames-rotations at Gold (rotation matrices, composition,
notation discipline). Complex numbers at "i²=−1 rotates the plane" level (eater series
part 1 re-teaches this interactively). No topology needed — the eater drills build the
hypersphere picture by hand.

What beginners commonly misunderstand:
- Gimbal lock ≠ anything physically jamming: all three gimbals still spin freely; two
  axes have become parallel so one world DOF is unreachable *instantaneously*. It is a
  property of the 3-angle parameterization/mechanism, not of rotation itself.
- "Quaternions avoid gimbal lock because they have 4 numbers" — half-truth; the real
  point is that no singularity-free 3-parameter chart of SO(3) exists, so a 4th number
  + normalization buys a globally smooth representation.
- Double cover: q and −q are the SAME rotation; naive quaternion "distance" ‖q1−q2‖ and
  naive lerp break, and slerp must check the dot-product sign or it takes the long way
  around. Bites everyone in graphics and robotics.
- The sandwich qpq⁻¹: learners try to rotate 3D vectors by single-sided multiplication;
  the half-angle in q = (cos θ/2, ω̂ sin θ/2) exists precisely because the sandwich
  applies the rotation "twice".
- Storage-order landmine: MuJoCo/MJCF store quaternions scalar-first (w,x,y,z); SciPy/
  ROS store scalar-last (x,y,z,w). Silent component swap = garbage orientations with no
  error message.

Candidate videos:
1. Visualizing Quaternions, explorable video series — Grant Sanderson (3B1B) × Ben Eater
   — ~2–3 h total incl. drills [approx; repo estimate] — https://eater.net/quaternions
   (interactive "narrated explorables": you pause and drag the rotation mid-explanation;
   correctness 5, intuition 5, beginner fit 5, exercise compatibility 5 — drills are
   built in; time efficiency 4 — long, but replaces a video AND a problem set)
2. "Quaternions and 3d rotation, explained interactively" — 3Blue1Brown — [approx ~6
   min, duration unverified] — https://www.youtube.com/watch?v=zjMuIxRvygQ
   (the short companion: why q p q⁻¹ describes 3D rotation, gimbal-lock/Euler comparison;
   intuition 5, time efficiency 5; published 2018-10-26)
3. "Euler (gimbal lock) Explained" — GuerrillaCG — ~8 min [per search-result listing] —
   https://www.youtube.com/watch?v=zc8b2Jo7mno
   (THE canonical mechanical-gimbal demo, animator's perspective; beginner fit 5,
   intuition 5, rigor 2 — zero math, which is exactly right for an opener)
4. "Visualizing quaternions (4d numbers) with stereographic projection" — 3Blue1Brown —
   32 min [per Class Central listing] — https://www.youtube.com/watch?v=d4EgbgTm0Bg
   (the full hypersphere construction; intuition 5, rigor 4, but 32 min of 4D geometry
   is MORE than the robotics need — the explorable series covers it with your hands on)
5. "How quaternions produce 3D rotation" — creator [unverified] —
   https://www.youtube.com/watch?v=jTgdKoQv738 (surfaced in search; unvetted — not selected)

Candidate written resources:
1. Modern Robotics Ch 3.2.3 (exponential coordinates) + Appendix B (Euler angles,
   quaternions, conversion formulas) — https://hades.mech.northwestern.edu/index.php/Modern_Robotics
   (the robotics-facing formula sheet your library implements; rigor 5, intuition 2)
2. 3Blue1Brown lesson-page text versions — https://www.3blue1brown.com/lessons/quaternions/
   and https://www.3blue1brown.com/lessons/quaternions-and-3d-rotation/ (same content as
   the videos in readable form; good for revisiting one step)
3. Cornell CS4620 quaternion lecture notes —
   https://www.cs.cornell.edu/courses/cs4620/2009fa/lectures/09quaternions.pdf
   (compact graphics-course treatment incl. slerp; alternate formal explanation)
4. Wikipedia, "Gimbal lock" — https://en.wikipedia.org/wiki/Gimbal_lock (states the
   "nothing is restrained" misconception correction explicitly)

Community evidence:
- HN thread on the eater series — the format (interrupt the speaker, drag the rotation)
  is what people credit for quaternions finally clicking. (https://news.ycombinator.com/item?id=18310788)
- Physics Forums thread sharing the interactive series as the way to learn quaternions.
  (https://www.physicsforums.com/threads/cool-interactive-video-on-quaternions.958869/)
- Andy Matuschak (Khan Academy research) analyzes the eater series as a model "narrated
  explorable" — pedagogy-design evidence, not just popularity.
  (https://medium.com/khan-academy-early-product-development/narrated-explorables-three-mental-models-e16e0d80e4c1)
- W3C css-transitions archive: standards body proposed interpolating transforms via
  quaternions to escape Euler-angle artifacts — the Euler→quaternion migration is an
  industry-wide scar, not academic trivia.
  (https://lists.w3.org/Archives/Public/www-style/2010Oct/0440.html)
- Slerp(x,y,·) vs slerp(x,−y,·) shortest-path handling appears in production code and
  course notes alike — double cover is the #1 practical quaternion bug.
  (https://www.cs.cornell.edu/courses/cs4620/2009fa/lectures/09quaternions.pdf)

Primary technical authority:
- Modern Robotics Appendix B + Ch 3.2.3 for formulas (Rodrigues, exponential
  coordinates, conversions); eater.net/quaternions for the geometric model.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Node diagnostic — why 4 numbers for 3 DOF? What rotation is
  q=(0.707, 0, 0.707, 0)? Plus: "does gimbal lock physically jam a gimbal?" ~8 min.
- ORIENT: GuerrillaCG "Euler (gimbal lock) Explained", ~8 min — mechanical gimbal +
  rotation-order fix, zero math.
- CORE WATCH: 3B1B "Quaternions and 3d rotation, explained interactively" [~6 min],
  THEN the eater.net explorable series with ALL built-in drills (~2–3 h; this is watch
  + practice fused — drag every prompt, never just watch).
- CORE READ: MR Ch 3.2.3 + Appendix B, ~25–30 min — extract the formula sheet
  (Rodrigues, q↔R, axis-angle↔q) your implementation will use.
- INTERACTIVE: so3-explorer widget (axis-angle view) alongside the eater drills; the
  external explorable is the primary interactive for this node.
- PRACTICE: Node exercises — produce gimbal lock concretely in a ZYX visualizer and name
  the lost axis; demonstrate q and −q give the same R and explain why naive quaternion
  distance is wrong. Add: hand-compute the slerp sign check on one example pair.
- IMPLEMENT/DERIVE: se3.py additions — quat↔matrix↔axis-angle with round-trip property
  tests on 1000 random rotations (target 1e-9); derive Rodrigues from the axis-angle
  picture once on paper.
- STUCK PATH: 3B1B 32-min stereographic-projection video (d4EgbgTm0Bg) if the
  hypersphere picture isn't landing; Cornell CS4620 notes for a terser formal pass.
- DEEPEN: Full 32-min video anyway if the 4D geometry delights (novelty fuel, optional);
  MR Appendix B conversion edge cases (θ→0, θ→π).
- PROVE IT: Node mastery test — 1000-rotation round-trip suite green at 1e-9 + half-page
  memo: which representation for storage / composition / interpolation / optimization,
  and why.
- TRANSFER: Convention gauntlet: take one orientation from your library and write it
  correctly into (a) an MJCF body quat attribute (scalar-first w,x,y,z) and (b) a
  SciPy Rotation (scalar-last x,y,z,w); verify both give the same body pose in MuJoCo,
  and state what silently breaks if you swap orders.
- RETENTION: +10 days: write q=(cos θ/2, ω̂ sin θ/2) and Rodrigues from memory; answer
  "your slerp took the long way around — what happened and what's the one-line fix?"

Why this won: The cluster guidance pins eater/3B1B, and the live evidence backs it —
the explorable format with embedded drills is active work, not passive watching, which
is exactly what a recognition-prone fast learner needs on the most "black-boxable"
topic in robotics. GuerrillaCG (8 min) is the cheapest possible correct mental model of
gimbal lock before any math. MR Appendix B supplies the rigor the fun sources omit, and
the implementation round-trips are the honesty check.

What was rejected (and why): 3B1B 32-min stereographic video as CORE (demoted to
STUCK/DEEPEN — brilliant, but the explorable series covers the same construction with
the learner's hands on the wheel; 32 passive minutes vs interactive is the wrong trade
here); unvetted YouTube quaternion explainers (jTgdKoQv738, -zsnHbQyRnc — couldn't
verify creator/quality this session); Shoemake's 1985 slerp paper (historical depth,
no verified URL this session, not needed at this tier); geometric-algebra/rotor
treatments (Hamish Todd substack surfaced — fascinating, but a second formalism now
would fragment the notation the rest of the curriculum builds on).

Risk of superficial understanding: The eater series is fun enough to binge passively —
the drills must be done, not watched. Second trap: memorizing "quaternions fix gimbal
lock" as a slogan without being able to produce gimbal lock on demand or explain WHY
3-parameter charts must fail. The mastery memo (which representation, when, why) is
the anti-slogan check.

Required active work: All eater drills; the 1000-rotation round-trip suite; gimbal
lock produced by hand in a visualizer; the q/−q demonstration; the MJCF/SciPy
convention gauntlet.

Last verified: 2026-08-21
