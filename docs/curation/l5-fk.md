# l5-fk — Forward Kinematics (Product of Exponentials)

Concept: Where is the end-effector, given the joints: screw/joint axes, home
configuration M, and the product-of-exponentials formula
T(θ)=e^{[S1]θ1}···e^{[Sn]θn}M — assembled from the learner's own exp map. DH tables at
read-a-table literacy only.

Learner prerequisites: l5-lie-se3 at Gold (SE(3) exp map is the engine PoE runs on);
l5-mujoco-basics (MuJoCo is the ground-truth oracle). The 2-link trig FK from L2 is the
anchor example.

What beginners commonly misunderstand:
- PoE vs DH: most older tutorials teach Denavit–Hartenberg first; learners then think
  frame-assignment ceremony is intrinsic to FK. PoE needs only ONE home pose M and the
  joint screws in one fixed frame — the ceremony evaporates. (DH remains read-only
  literacy for legacy docs.)
- The exponentials are matrix exponentials of twists — not elementwise; and their ORDER
  matters: space-form exponentials premultiply M left-to-right from joint 1 outward;
  swapping to the body form changes where the axes are expressed, not the answer.
- Screw axes must be written in the fixed frame AT THE HOME CONFIGURATION — extracting
  them from a model at a non-home pose is the classic silent error.
- "FK is easy" complacency: the concept is easy; error-free parameterization of a real
  6-DOF model file is the actual skill, which is why the mastery test is oracle-checked
  at 1e-6.

Candidate videos:
1. Modern Robotics lightboard segments for Ch 4 (PoE, space and body form) —
   Northwestern Robotics — ~5 min each [approx; repo research report verified
   2026-08-21] — playlist: https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx
   (correctness 5, exact match to text 5, time efficiency 5; terse — read alongside)
2. Coursera "Modern Robotics" specialization (Course 2 covers kinematics; video content
   overlaps the free playlist) — https://www.coursera.org/specializations/modernrobotics
   (same material with quizzes/deadlines; only if external structure is wanted)
3. Pool intentionally thin: cluster guidance pins MR chapters + per-chapter videos, and
   the session's search budget was exhausted before alternate-FK-video discovery; no
   non-MR FK video was verified. Most alternatives online are DH-based and would
   actively conflict with the PoE-first curriculum.

Candidate written resources:
1. Modern Robotics Ch 4 (PoE FK; includes worked 6R examples — the book works a UR5e-
   style arm) + Appendix C (DH, read once) —
   https://hades.mech.northwestern.edu/index.php/Modern_Robotics
2. NxRLab/ModernRobotics reference library (fetched this session — Python/MATLAB/
   Mathematica, written to be read: FKinSpace/FKinBody are ~10 lines) —
   https://github.com/NxRLab/ModernRobotics
3. MuJoCo Menagerie UR5e model (fetched this session — the actual MJCF whose frames the
   learner mines for screw axes) — https://github.com/google-deepmind/mujoco_menagerie

Community evidence:
- Reddit-comment aggregation for the MR Coursera courses: learners report the material
  is rigorous and the programming projects are what create real skill — videos alone are
  not the course. (https://reddsera.com/specializations/modernrobotics/)
- Coursera learner ratings (91% liked course 1, 86% the kinematics course, per review
  aggregation) — solid but not universal: the friction is exactly the terse-video +
  must-do-exercises design this packet leans into.
  (https://course.careers/engineering-courses/modern-robotics-mechanics-planning-and-control-specialization-course)
- No FK-specific confusion threads were captured live this session (search budget
  exhausted); the PoE-vs-DH misconception framing traces to the repo's research phase
  (docs/research/reports/robotics-theory.md, verified 2026-08-21).

Primary technical authority:
- Modern Robotics Ch 4 (Lynch & Park) + the NxRLab reference implementation; MuJoCo
  body poses as numerical ground truth.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Node diagnostic — what is a screw axis? Why does PoE avoid DH's
  frame-assignment ceremony? Plus: hand-FK the 2R planar arm with trig only. ~10 min.
- ORIENT: First Ch-4 segment of the MR playlist (~5 min): the PoE idea in one picture —
  each joint screws everything outboard of it.
- CORE WATCH: MR playlist Ch 4 segments on the space-form and body-form PoE, ~15–20 min
  total [approx ~5 min/video].
- CORE READ: MR Ch 4.1 study + the body-form section (~45–60 min, re-deriving the 2R
  and one 6R worked example on paper); Appendix C once (~15 min, literacy only).
- INTERACTIVE: planar-arm widget — drag joints, predict T(θ) before displaying it.
- PRACTICE: Node exercises — derive the 2-link planar FK from PoE and match the L2 trig
  version; extract the UR5e screw axes from its MJCF (document the process, note the
  home configuration you used).
- IMPLEMENT/DERIVE: kin.py — FK for the Menagerie UR5e from your extracted screw axes;
  validate against MuJoCo body poses on 500 random configurations to <1e-6; compare
  your code shape against NxRLab FKinSpace (after writing yours).
- STUCK PATH: The worked 6R example in MR Ch 4 traced line-by-line; NxRLab FKinSpace
  source read as a 10-line executable summary; re-derive with the body form to
  triangulate.
- DEEPEN: Body-form PoE fluency (needed for body Jacobian next node); MR's URDF/model-
  format discussion in the FK chapter (skim).
- PROVE IT: Node mastery test — FK matching MuJoCo to 1e-6 on 500 random configs for a
  6-DOF arm YOU parameterized from the model file, plus the 2-link derivation on paper.
- TRANSFER: Parameterize a second, different arm — Franka Panda from Menagerie (7-DOF,
  9 DoFs listed with gripper — decide which joints are kinematic) — and state what
  changes in PoE for a prismatic joint (ω=0 case) even though the Panda has none.
- RETENTION: +14 days: write the PoE formula and the definition of a screw axis from
  memory; FK one config of the UR5e and check against MuJoCo without consulting your
  earlier notes.

Why this won: The guidance pins MR Ch 4 + its short videos, and nothing discovered
contradicts that: MR is the only free, PoE-first treatment with a readable reference
implementation, and the learner's Lie node feeds it perfectly (PoE is "your exp map,
n times"). The packet's real weight is deliberately in the oracle-checked
implementation, where the actual skill lives.

What was rejected (and why): DH-first tutorials and courses (convention conflict with
the entire downstream stack — Drake/Pinocchio/modern papers are PoE/screw-first; DH
kept at App-C literacy); Coursera enrollment as CORE (same videos + paywalled
structure; the self-paced packet + MuJoCo oracle replaces the autograder); any
unverified third-party FK video (none vetted this session).

Risk of superficial understanding: "I understand PoE" after the 2R example is cheap;
the 6-DOF parameterization from a real MJCF — home pose, axis directions, signs,
frame of expression — is where every error hides. The 1e-6 oracle requirement makes
faking impossible; do not soften it.

Required active work: Screw-axis extraction documented; kin.py FK vs MuJoCo 500-config
check; 2R paper derivation; Panda re-parameterization transfer.

Last verified: 2026-08-21
