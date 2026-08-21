# l5-mujoco-basics — MuJoCo: Your Primary Laboratory

Concept: Operate the curriculum's physics home: install + viewer; MJCF anatomy
(bodies/joints/geoms/actuators/sensors); load Menagerie robots; step the sim from
Python; read qpos/qvel/sensordata; apply controls; render offscreen.

Learner prerequisites: l1-numpy, l1-classes. No kinematics theory needed — this node
deliberately precedes/parallels FK so the lab exists before the math needs an oracle.

What beginners commonly misunderstand:
- Joint vs actuator: a joint defines a degree of freedom; an actuator is a separate
  element that exerts effort on it. A model with joints but no actuators is a puppet
  with no strings — and ctrl does nothing until actuators exist.
- mjModel vs mjData: the model is constant structure; ALL state (qpos, qvel,
  sensordata, contact forces) lives in mjData. Beginners hunt for sensor readings in
  the model.
- Units/angle gotcha: MJCF attributes are parsed in degrees by default (compiler
  angle="degree"), while runtime state in mjData is radians. Writing 90 in XML and
  reading 1.5708 in Python confuses everyone once.
- Quaternions are scalar-first (w,x,y,z) in MJCF/mjData — opposite of SciPy/ROS
  scalar-last. (Cross-links to the l5-quaternions transfer task.)
- Commanded ≠ actual: position actuators have gains/dynamics; the node's sinusoid
  exercise exists to make the learner DISCOVER tracking lag rather than be told.
- Free-floating bodies need a freejoint; a body without any joint is welded to its
  parent — "why won't my cube fall" is the classic first-scene bug.

Candidate videos:
1. No standalone video course verified this session — the search budget was exhausted
   at exactly this node's discovery query. none found — fallback: the official
   interactive Colab tutorial (below), which is better than video for this node: every
   concept is a cell you run and mutate. Candidate video course by name for a later
   verification pass: Pranav Bhounsule's MuJoCo bootcamp [no URL verified this session].

Candidate written resources:
1. MuJoCo official documentation — https://mujoco.readthedocs.io (URL confirmed inside
   the official GitHub README fetched this session) — Overview for concepts, XML/MJCF
   reference as needed, Python bindings chapter. (correctness 5, authority 5, beginner
   fit 3 — reference-dense, hence the Colab-first packet)
2. Official introductory Colab tutorial notebook ("MuJoCo basics") —
   https://colab.research.google.com/github/google-deepmind/mujoco/blob/main/python/tutorial.ipynb
   (from the fetched README; runnable end-to-end without local install)
3. MuJoCo Menagerie README + universal_robots_ur5e model (fetched this session) —
   https://github.com/google-deepmind/mujoco_menagerie — model quality grades (A+/A/B/C),
   loading via `python -m mujoco.viewer --mjcf .../scene.xml` or the robot_descriptions
   pip package; contains UR5e (6 DoF), Franka Panda (9 DoFs incl. gripper), and
   trs_so_arm100.
4. kevinzakka/mjctrl (fetched this session) — https://github.com/kevinzakka/mjctrl —
   minimal controller scripts to READ later (l5-ik oracle); here it demonstrates
   idiomatic mujoco-python structure.
5. Model-editing Colab (mjSpec) — https://colab.research.google.com/github/google-deepmind/mujoco/blob/main/python/mjspec.ipynb
   (from fetched README; programmatic model construction — STUCK PATH for XML fatigue)

Community evidence:
- Internal research report (docs/research/reports/ros-simulators.md, live-verified
  2026-08-21): MuJoCo 3.12.0 released 2026-08-20, monthly cadence, 14.6k stars, pip
  install, first-class Python bindings; chosen for "zero friction, best-documented
  physics, instant visual feedback"; MJCF semantics now run GPU-batched inside both
  Google (MJX/Warp) and NVIDIA (Newton/Isaac Lab 3) stacks — learning MuJoCo first is
  the transferable investment. (internal: docs/research/reports/ros-simulators.md)
- The official README routes newcomers to the Colab tutorial rather than the docs —
  the maintainers' own on-ramp ordering, adopted by this packet.
  (https://github.com/google-deepmind/mujoco — fetched 2026-08-21)
- No live Reddit/forum threads captured this session (search budget exhausted at this
  node); flagged honestly. A later pass may add learner-retrospective links for the
  MJCF-defaults and degrees-vs-radians gotchas.

Primary technical authority:
- MuJoCo official documentation (mujoco.readthedocs.io) + the google-deepmind/mujoco
  repository and its tutorial notebooks. Version context: 3.12.0 (2026-08-20).

Selected shortest-sufficient packet:
- DIAGNOSTIC: Node diagnostic — difference between a joint and an actuator in MJCF?
  Where do sensor readings live in mjData? Plus: "your cube doesn't fall — why?" ~5 min.
- ORIENT: Docs Overview page skim (~10 min): the mjModel/mjData split and the
  computation pipeline picture — just enough vocabulary for the notebook.
- CORE WATCH: — (no video selected; the interactive notebook replaces it)
- CORE READ: (read = run, for this node) Official intro Colab tutorial run top-to-bottom, mutating every cell
  (change a geom, add a joint, break it, fix it), ~45–60 min. Then read the Menagerie
  ur5e.xml top-to-bottom with the MJCF reference open, annotating every element,
  ~30–40 min (node backup task).
- INTERACTIVE: — (the sim itself is the interactive; no in-app widget applies)
- PRACTICE: Node exercises — author a 2-link pendulum MJCF from scratch, verify DOFs
  and limits in the viewer; drive a Menagerie UR5e with sinusoidal joint commands and
  plot commanded vs actual (discover actuator dynamics exist).
- IMPLEMENT/DERIVE: The mastery scene — tabletop MJCF (arm + cube + camera), scripted
  arm motion from Python, rendered video + joint-state CSV recorded offscreen.
- STUCK PATH: mjSpec model-editing Colab (build models in Python when XML errors
  frustrate); `python -m mujoco.viewer --mjcf <model>` for instant visual debugging of
  any MJCF (command form from the fetched Menagerie README).
- DEEPEN: Docs "Computation" chapter (how contacts/constraints actually work) — but
  this is l5-dynamics-lite's assigned reading; only pull it early if curiosity demands.
- PROVE IT: Node mastery test — the tabletop scene + scripted motion + rendered video +
  CSV, all driven from Python.
- TRANSFER: Load trs_so_arm100 (the SO-101 twin from Menagerie) and write a half-page
  comparison with the UR5e MJCF: actuator types/gains, joint ranges, mesh vs primitive
  geoms — reading an unfamiliar model file is the real-world skill.
- RETENTION: +7 days: from a blank file, write a minimal MJCF (worldbody, one jointed
  body, geom, actuator, sensor) that loads in the viewer — no references open.

Why this won: For a tool node, executable material beats lectures: the maintainers' own
Colab is runnable, current (repo README fetched today), and forces interaction; the
Menagerie UR5e is simultaneously the reading exercise and the arm every later node
(FK/IK/Jacobians/boss) reuses. The docs stay in the reference role they are written
for. Total packet stays inside the node's 5 h with room for the mastery scene.

What was rejected (and why): Third-party video courses (none verifiable this session;
also 2023-era MuJoCo tutorials predate the modern viewer/bindings churn — datedness
risk is real at MuJoCo's monthly release cadence); reading the full MJCF reference
linearly (thousands of attributes; it is a lookup surface, not a course); dm_control
tutorials (extra abstraction layer the curriculum deliberately avoids at this stage).

Risk of superficial understanding: Copy-pasting a working scene without being able to
author one blank-page — the retention check (minimal MJCF from memory) and the
from-scratch pendulum exist precisely for this. Also: succeeding with position
actuators while never noticing tracking dynamics — the sinusoid plot forces the
discovery.

Required active work: Every Colab cell mutated; pendulum MJCF from scratch; annotated
ur5e.xml; sinusoid tracking plot; tabletop mastery scene with video + CSV.

Last verified: 2026-08-21
