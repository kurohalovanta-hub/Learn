# l5-ik — Inverse Kinematics (Numerical)

Concept: What joint angles put the hand THERE: Newton–Raphson on SE(3) with the error
via the log map; damped least squares (λ) to survive singularities; joint limits;
null-space motion for redundant arms. Differential IK as the control law inside modern
manipulation stacks.

Learner prerequisites: l5-jacobians at Gold; l5-lie-se3 (the error e = log(T_target
T(θ)⁻¹)ᵛ is a ⊟); l5-mujoco-basics (teleop exercise runs in the viewer).

What beginners commonly misunderstand:
- Expecting closed form: general 6-DOF IK is solved by iteration; analytic IK is a
  special-geometry luxury (skim-level only here).
- Why the raw pseudo-inverse explodes: J⁺ divides by small singular values; near a
  singularity σ_min→0 and steps blow up. Damping replaces 1/σ with σ/(σ²+λ²) — bounded,
  at the price of bias. Learners often treat λ as a magic constant instead of a
  robustness/accuracy dial.
- Orientation error is NOT "subtract the Euler angles" or "subtract quaternion
  components" — it is the log-map twist. Euler subtraction near ±π and q/−q both
  produce garbage steps that mostly-converge, which makes the bug insidious.
- Convergence failure has TWO distinct causes — a genuinely unreachable/limits-blocked
  target vs a local minimum / wrong branch — and the fixes differ (reject vs restart).
- Clamping joint limits naively can deadlock progress; redundancy (7-DOF) turns limits
  into a null-space objective instead.

Candidate videos:
1. Modern Robotics lightboard segments for Ch 6 (numerical IK, Newton–Raphson,
   pseudoinverse) — Northwestern Robotics — ~5 min each [approx; repo research report
   verified 2026-08-21] — playlist:
   https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx
   (correctness 5, exact match to text 5, time efficiency 5)
2. No alternate IK video verified this session (search budget exhausted) — none found —
   fallback: MR playlist Ch 6 + mjctrl code walk (a working 100-line implementation is
   the best "video" for this node anyway).

Candidate written resources:
1. Modern Robotics Ch 6 (numerical IK; skim 6.1 analytic) —
   https://hades.mech.northwestern.edu/index.php/Modern_Robotics
2. kevinzakka/mjctrl — diffik.py (differential IK on the 6-DOF UR5e),
   diffik_nullspace.py (7-DoF Panda, null-space), opspace.py (iiwa14) — fetched this
   session; single-file pedagogical implementations, sole dependency MuJoCo ≥3.1.0 —
   https://github.com/kevinzakka/mjctrl (the oracle the node already designates)
3. Samuel Buss, "Introduction to Inverse Kinematics with Jacobian Transpose,
   Pseudoinverse and Damped Least Squares" — the classic DLS survey — [no URL verified
   this session; cite by name only, locate when needed]
4. NxRLab/ModernRobotics IKinSpace/IKinBody (readable Newton-iteration reference) —
   https://github.com/NxRLab/ModernRobotics (fetched this session)

Community evidence:
- No IK-specific learner threads captured live this session (search budget exhausted);
  the λ-as-magic-constant and Euler-subtraction-error misconceptions trace to the node
  design + repo research phase (docs/research/reports/robotics-theory.md, live-verified
  2026-08-21). Flagged honestly rather than padded.
- Adjacent live evidence: mjctrl exists precisely because learners need minimal
  readable controller references next to MuJoCo — "single-file pedagogical
  implementations of common robotics controllers." (https://github.com/kevinzakka/mjctrl)
- MR Coursera reddit aggregation: the programming assignments (IK included) are where
  the specialization pays off. (https://reddsera.com/specializations/modernrobotics/)

Primary technical authority:
- Modern Robotics Ch 6 (Lynch & Park) for the algorithm; mjctrl diffik.py as the
  working oracle; your own 500-pose benchmark as ground truth.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Node diagnostic — why iterate instead of solving in closed form? What
  does the damping term do to the smallest singular values? (Answer expected in σ/(σ²+λ²)
  form.) ~8 min.
- ORIENT: First MR Ch-6 playlist segment (~5 min): IK as root-finding on your FK.
- CORE WATCH: MR playlist Ch 6 numerical-IK segments, ~10–15 min total [approx].
- CORE READ: MR Ch 6 numerical sections (Newton–Raphson with the twist error; skim 6.1
  analytic), ~40–50 min; then read diffik.py top-to-bottom AFTER writing your own
  first draft (~15 min).
- INTERACTIVE: planar-arm widget — 2R IK intuition: two elbow branches, unreachable
  targets; predict-then-check.
- PRACTICE: Node exercises — show undamped IK exploding near your l5-jacobians
  singularity, fix with λ, plot both trajectories; sweep λ over 3 orders of magnitude
  and plot final error vs λ (the robustness/accuracy dial made visible).
- IMPLEMENT/DERIVE: kin.py — DLS IK with joint limits, error via log map (your se3.py
  ⊟); benchmark on 500 random reachable poses: target ≥95% success, <1 mm, <0.5°;
  convergence plots.
- STUCK PATH: mjctrl diffik.py line-by-line (a working minimal implementation
  demystifies faster than prose); NxRLab IKinSpace as a second reference shape.
- DEEPEN: diffik_nullspace.py on the Panda — null-space posture objective for a
  redundant arm (node objective 3's demo); Buss DLS survey by name if the theory itch
  needs scratching.
- PROVE IT: Node mastery test — benchmark green (≥95% / <1 mm / <0.5°) with your own
  convergence plot + a paragraph on how λ trades accuracy for robustness.
- TRANSFER: Differential-IK teleop at 100 Hz — drag a mocap target in the MuJoCo viewer
  and have the arm follow (node exercise 2) — then repeat on the Panda with the
  null-space variant and describe what the extra DOF buys you.
- RETENTION: +14 days: write the DLS update Δθ = Jᵀ(JJᵀ+λ²I)⁻¹e and the log-map error
  definition from memory; answer "your IK converges to a wrong-looking elbow — bug or
  expected? what do you check first?"

Why this won: MR Ch 6 gives the correct algorithm in the curriculum's own notation, and
mjctrl (already the repo's designated oracle, re-verified today) turns it into a
runnable reference the learner reads only AFTER a first attempt — preserving the
implement-before-reveal discipline. The λ-sweep practice converts the node's central
idea (damping as a dial) from prose into a plot the learner made.

What was rejected (and why): Analytic-IK deep dives (special geometry, off the modern
numerical path — skim only); CCD/FABRIK tutorials (animation-world IK; wrong tool
lineage for manipulation research); optimization-solver IK (Drake/TRAC-IK) at this tier
(consume later, after owning the Newton/DLS core); Buss survey as CORE READ (no URL
verified this session, and MR + working code cover the need — kept as named DEEPEN).

Risk of superficial understanding: An IK that "usually works" is easy; the mastery is
in the failure modes — singularity behavior, branch vs local-minimum diagnosis, λ
tradeoff — which is exactly what the benchmark + explosion demo + memo force. Copying
diffik.py before writing your own would gut the node; the order is enforced by the
packet.

Required active work: Own DLS implementation with log-map error; 500-pose benchmark;
undamped-explosion + λ-sweep plots; 100 Hz teleop demo; nullspace variant on Panda.

Last verified: 2026-08-21
