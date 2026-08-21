# l5-jacobians — The Manipulator Jacobian

Concept: J(θ) maps joint velocities to end-effector twist (V = Jθ̇); columns are joint
screws at the current configuration; force duality τ = Jᵀf; singularities as rank
collapse; manipulability ellipsoid. The L2 multivariable Jacobian "wearing a hard hat".

Learner prerequisites: l5-fk at Gold (J is the derivative of YOUR FK); l2-multivariable
at Gold (Jacobian-as-linearization); l2-eigen-svd (singular values read the ellipsoid).

What beginners commonly misunderstand:
- Geometric vs analytic Jacobian: the angular rows produce angular velocity ω, NOT the
  time-derivative of Euler angles/quaternion components; mixing them corrupts IK and
  control. (This distinction is why the curriculum's log-map error in l5-ik works.)
- Columns ARE meaningful objects: column i is joint i's screw axis expressed at the
  current configuration — not just "some partial derivatives". Seeing this turns J from
  a formula into geometry.
- Singularity ≠ robot breaks: it is an instantaneous loss of a task-space DIRECTION
  (rank collapse); nearby, achievable velocities in the lost direction cost enormous
  joint rates — which is a σ_min statement, read straight off the SVD.
- Duality direction: τ = Jᵀf maps task forces to joint torques (not the other way);
  learners invert it. At singularities the arm can RESIST some forces with zero torque —
  the flip side of losing motion directions.
- Body vs space Jacobian: two frames of expression related by the Adjoint; picking one
  and mislabeling it poisons downstream code silently.

Candidate videos:
1. Modern Robotics lightboard segments for Ch 5 (velocity kinematics & statics,
   singularities, manipulability) — Northwestern Robotics — ~5 min each [approx; repo
   research report verified 2026-08-21] — playlist:
   https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx
   (correctness 5, exact text match 5, time efficiency 5; terse by design)
2. No alternate Jacobian video was verified this session (search budget exhausted
   before this node's discovery pass) — none found — fallback: MR playlist Ch 5 +
   in-app lesson. The in-app lesson (90 min, planar-arm widget, 8 sections) already
   provides the columns-as-velocities visual most alternate videos would add.

Candidate written resources:
1. Modern Robotics Ch 5 (space/body Jacobian, statics τ=Jᵀf, singularity analysis,
   manipulability) — https://hades.mech.northwestern.edu/index.php/Modern_Robotics
   (rigor 5; the manipulability ellipsoid figures are the mental model)
2. NxRLab/ModernRobotics reference library (JacobianSpace/JacobianBody as readable
   oracles) — https://github.com/NxRLab/ModernRobotics (fetched this session)
3. kevinzakka/mjctrl (fetched this session) — https://github.com/kevinzakka/mjctrl —
   diffik.py shows the Jacobian consumed by a real controller (preview of l5-ik).

Community evidence:
- No Jacobian-specific learner threads captured live this session (search budget
  exhausted); the geometric-vs-analytic and singularity misconceptions trace to the
  node design + repo research phase (docs/research/reports/robotics-theory.md,
  live-verified 2026-08-21). Flagged honestly rather than padded with unverified links.
- Adjacent live evidence: MR Coursera reddit-comment aggregation says the programming
  projects (Jacobian/IK weeks included) are where learning actually happens.
  (https://reddsera.com/specializations/modernrobotics/)

Primary technical authority:
- Modern Robotics Ch 5 (Lynch & Park); numerical truth via finite differences of the
  learner's own FK and MuJoCo applied-force experiments.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Node diagnostic — columns of J correspond to what? What does σ_min of J
  tell a controller? Plus: "is the angular part of your J the derivative of Euler
  angles?" ~8 min.
- ORIENT: In-app lesson opening + planar-arm widget: wiggle each joint alone at several
  configurations; watch the tip-velocity arrow = that column of J. ~10 min.
- CORE WATCH: MR playlist Ch 5 segments (Jacobian, statics, singularities,
  manipulability), ~20 min total [approx ~5 min/video].
- CORE READ: MR Ch 5 — space/body Jacobian construction, statics duality, singularity
  analysis, manipulability ellipsoid, ~60–75 min with the 2R planar case fully worked
  by hand.
- INTERACTIVE: planar-arm widget (in-app lesson l5-jacobians, 90 min) — includes the
  stretch-to-singularity experiment.
- PRACTICE: Node exercises — drive the UR5e to a singularity, show σ_min→0 and the
  ellipsoid collapsing, name the lost direction; verify τ=Jᵀf numerically with MuJoCo
  applied forces.
- IMPLEMENT/DERIVE: kin.py — geometric Jacobian (space + body, labeled); verify against
  finite differences of your FK at 100 random configs; plot the manipulability
  ellipsoid along a trajectory; w = √det(JJᵀ) logged alongside σ_min.
- STUCK PATH: 2R planar Jacobian derived twice — once by differentiating your trig FK,
  once by the screw-column construction — and shown equal; NxRLab JacobianSpace read as
  executable summary.
- DEEPEN: Body-vs-space Jacobian via the Adjoint (closes the loop with l5-lie-se3);
  analytic-Jacobian conversion formulas only when a paper forces them.
- PROVE IT: Node mastery test — finite-difference-verified Jacobian + written
  explanation of one singularity of your arm: which motions become impossible and why
  the math says so.
- TRANSFER: Statics in anger: choose a UR5e pose and a required 10 N downward press;
  compute τ = Jᵀf, apply those torques in MuJoCo with gravity compensation, and verify
  the contact force; then explain why the same press near a singularity needs almost no
  torque in one direction.
- RETENTION: +14 days: write V=Jθ̇ and τ=Jᵀf from memory and explain the duality in
  three sentences; sketch how the ellipsoid deforms as the arm approaches full
  extension.

Why this won: The node is the derivative of the learner's own FK, so the highest-value
minutes are MR's short exact-match videos plus the in-app widget (which makes columns
visible) and the finite-difference self-check — an alternate lecturer would add
convention risk (analytic Jacobians, different frames) without adding capability.

What was rejected (and why): Generic "robot Jacobian explained" videos (none verified
this session; most teach the analytic Jacobian without flagging it, planting the exact
geometric-vs-analytic confusion this node must prevent); Featherstone-level velocity
algebra (research-phase CUT, reference-only); Coursera enrollment (overlaps free
playlist).

Risk of superficial understanding: The formula V=Jθ̇ is memorizable in a minute; the
mastery is (a) constructing J's columns as transformed screws, (b) reading σ_min like a
gauge, (c) never confusing ω with Euler rates. The finite-difference check catches (a);
the singularity write-up catches (b); the diagnostic catches (c).

Required active work: FD-verified Jacobian; singularity hunt with ellipsoid plots;
τ=Jᵀf MuJoCo verification; the twice-derived 2R Jacobian.

Last verified: 2026-08-21
