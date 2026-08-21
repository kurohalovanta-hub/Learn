# Research Report — Robotics Theory Resources (2026-08-21)

> Produced by a dedicated research agent with live verification 2026-08-21. **✅F** = fetched directly · **✅S** = confirmed via live search-index hit today · **✅P** = PyPI JSON API today · **◐** = cross-reference-verified.

## 1. Kinematics/geometry/dynamics spine — Modern Robotics (Lynch & Park) = PRIMARY

- Book site (free preprint PDF): https://hades.mech.northwestern.edu/index.php/Modern_Robotics ✅S (modernrobotics.org canonical). Videos: ~5-min lightboard series, playlist https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx ✅S. Code: https://github.com/NxRLab/ModernRobotics ✅F — Python/MATLAB/Mathematica, commits Feb 2026, `pip install modern_robotics` 1.1.1 ✅P. Coursera specialization live ✅S.
- **STUDY**: Ch 3 Rigid-Body Motions (SO(3)/SE(3), twists, screws, exp/log — the heart), Ch 4 FK (product of exponentials), Ch 5 Velocity Kinematics & Statics (body/space Jacobians, singularities, manipulability), Ch 6 IK (Newton–Raphson numerical; skim analytic 6.1), Ch 8 Dynamics *lite*: 8.1–8.3 (M(q)+C+g structure, Newton–Euler idea), 8.5, 8.9 skim, Ch 9 Trajectories 9.1–9.4, Ch 11 Control 11.1–11.4 (computed torque, PID limits).
- **SKIM**: Ch 2 C-space (~2 h vocabulary; don't grind Grübler), Ch 12 §12.1 only (form/force closure vocabulary).
- **SKIP**: Ch 7 Closed Chains, Ch 10 Motion Planning (superseded by planning track), 11.5–11.6, Ch 12 depth, Ch 13 Wheeled Robots, Appendix C (DH — read-only).
- Hours (incl. building own library alongside): **50–60**.
- Why: only top-tier text simultaneously free (PDF+videos+MOOC+reference library) and **screw-theory/PoE-first** — the convention of Drake, Pinocchio, and modern learning-robotics code. Craig (DH-centric, paid) → skip. **Corke RVC3 Python toolbox** — `roboticstoolbox-python` v1.3.1 (Jul 2026) ✅P + spatialmath 1.1.16 ✅P — **REFERENCE/cross-check oracle** for your FK/IK/Jacobian tests.

## 2. Quaternions & Lie theory

- **Visualizing Quaternions (3B1B × Ben Eater)** — https://eater.net/quaternions ✅S — interactive "explorable videos". STUDY all + drills. **2–3 h. PRIMARY (intuition).**
- **Solà et al., "A micro Lie theory for state estimation in robotics"** — https://arxiv.org/abs/1812.01537 ✅S. STUDY §I–IV + SO(3)/SE(3) boxes + Jacobian tables; SKIM proofs. Prereq: MR Ch 3. **5–7 h incl. implementing exp/log/⊞/⊟ in NumPy.** Replaces a semester of abstract Lie material; the exact formalism of modern estimation/learning papers. **PRIMARY (rigor).**

## 3. Tedrake courses

- **Robotic Manipulation** — https://manipulation.csail.mit.edu/ ✅F(source)/✅S. **Current: Fall 2025 working notes**; `pip install manipulation` 2025.10.20 ✅P; Deepnote exercises on **Drake** (1.56.0, Aug 2026 ✅P). Videos: OCW 6.4210 Fall 2022 ✅S + YouTube channel.
  - **Gold chapters**: **Ch 3 Basic Pick and Place** (spatial algebra → differential IK → full geometric pick-and-place — the single best implementation chapter in robotics education), **Ch 4 Geometric Pose Estimation** (cameras, depth, point clouds, ICP), **Ch 5 Bin Picking** (antipodal grasping), **Ch 6 Motion Planning** (optimization + sampling + GCS). STUDY those + Ch 1–2. SKIM: Ch 8 Control, 9 Detection/Segmentation, 10 Deep Perception. SKIP now: Ch 7 Mobile Manipulation, 11 RL, 12 Soft/Tactile.
  - Hours: **45–55**. **PRIMARY for manipulation** — nothing else combines research taste (Tedrake/TRI), executable notebooks, free videos.
- **Underactuated Robotics** — https://underactuated.csail.mit.edu/ ✅S; repo commits through May 2026 ✅F; `pip install underactuated` 2026.1.2 ✅P; Spring 2024 = last full video edition. **Surgical use**: STUDY Ch 8 LQR + Ch 10 Trajectory Optimization (+ Ch 7 DP intro for value-function intuition); SKIM Ch 3 (canonical test rigs) + Ch 17 planning-through-contact intuition; SKIP walking/Lyapunov/robust chapters. **10–15 h. SECONDARY (control depth + trajopt).**

## 4. Control fast path (~25 h total)

1. **Brian Douglas** — Control Systems Lectures, playlist ✅S + engineeringmedia.com/videos ✅S. STUDY intro/PID/state-space (~5 h at 1.25×). Best-in-class intuition.
2. **Steve Brunton — Control Bootcamp** playlist ✅S. STUDY state-space, stability, controllability, pole placement, **LQR**, Kalman/LQG segment; SKIP robust-control tail. ~10 h with pause-and-implement (cart-pole LQR in Python/MuJoCo). Companion: Data-Driven Science & Engineering Ch 8 (databookuw.com ✅S) — optional.
3. **LQR→MPC bridge**: Underactuated Ch 8+10, then implement receding-horizon QP (double integrator → cart-pole) with cvxpy/OSQP in MuJoCo loop. ~10 h.

**Frequency-domain control (Bode/root locus/Nyquist): CUT.** Those tools answer SISO loop-shaping for plants you can only measure in frequency domain — avionics/process workflow. Our plants are simulated, MIMO, nonlinear, contact-rich; the field's vocabulary is state-space + optimization + learned policies. Nothing downstream (Tedrake, estimation, robot learning) needs a Bode plot. One 20-min Douglas video for vocabulary; zero more.

## 5. State estimation

- **PRIMARY: Labbe, *Kalman and Bayesian Filters in Python*** — https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python ✅F: 19.2k★, executable Jupyter book, complete (last commit Jul 2024 — finished, not abandoned). STUDY Ch 1–2 (g-h, discrete Bayes), 4–8 (KF design), 11 EKF, 12 particle filters; Ch 10 UKF skim-then-implement; SKIP 13–14. **Write every filter from scratch; FilterPy only as test oracle.** Prereq: probability + linalg. **25–30 h.**
- REFERENCE: Thrun *Probabilistic Robotics* (2005; **no new edition as of 2026** ✅S) — canonical derivations, don't read linearly.
- BACKUP: **Cyrill Stachniss** lecture videos — https://www.ipb.uni-bonn.de/teaching/ ✅S, MSR2-2021 course ✅S.

## 6. Perception / CV (tools-first)

- **Camera geometry: First Principles of Computer Vision (Shree Nayar, Columbia)** — https://fpcv.cs.columbia.edu/ ✅S + YouTube channel ✅S. STUDY only: image formation/lenses, **calibration (intrinsics/extrinsics)**, stereo + SfM overview. **~6 h at 1.5×.** Clearest short treatment in existence.
- **OpenCV now at 5.0** (opencv-python 5.0.0.93, Jul 2026 ✅P; https://opencv.org/opencv-5/ ✅S). Do calibration + solvePnP/ArUco tutorials. **~4 h**: calibrate a simulated camera, reproject, estimate a fiducial pose.
- **Open3D v0.19.0** (Jan 2025 ✅F) — still the standard point-cloud/ICP toolkit. **~4 h**: RGB-D→cloud, normals, ICP (pairs with Tedrake Ch 4). REFERENCE after.
- **Szeliski 2nd ed** — free PDF via szeliski.org/Book ✅S. REFERENCE only.
- **2026 tools to USE, not study (~6–8 h wiring):**
  - **SAM 3 / SAM 3.1** (Meta; released Nov 19 2025; 3.1 checkpoints Mar 2026) — https://github.com/facebookresearch/sam3 ✅F 11.4k★; open-vocabulary concept prompts, segments+tracks, image+video. **Current default — subsumes most Grounding-DINO+SAM-2 pipelines.**
  - **Grounding DINO** ✅F 10.5k★ — BACKUP for box-style open-vocab detection / reproducing 2023–25 papers.
  - **YOLO26** (Ultralytics ✅F 60.8k★, pip 8.4.124 Aug 2026 ✅P) — fast supervised detection.
  - **Depth Anything 3** (ByteDance-Seed, Nov 2025; arXiv:2511.10647 ✅S) — any-view depth/geometry, big jump over DA-V2/VGGT.

## 7. SLAM / VO — mostly SKIP (defended)

For a manipulation-focused, sim-first researcher deep SLAM is off the critical path (near-known kinematic state; workspace-scale scenes; estimation needs covered by KF/EKF + ICP/pose). **Minimal treatment (4–6 h):** Stachniss "Introduction to SLAM" + graph-SLAM overview, then run/read EKF-SLAM + FastSLAM demos in **PythonRobotics** (https://github.com/AtsushiSakai/PythonRobotics ✅F 30.3k★, active). Reference: **the SLAM Handbook** (Carlone, Kim, Barfoot, Cremers, Dellaert; Cambridge UP 2026) — **free draft in repo** https://github.com/SLAM-Handbook-contributors/slam-handbook-public-release ✅F 4.6k★, 18 chapters incl. spatial AI. VO: concept-level only.

## 8. Motion planning (~20–22 h)

- **Implementation PRIMARY: build A*, RRT, RRT\* yourself; cross-check against PythonRobotics** ✅F. ~12 h: grid A* → 2D RRT/RRT* → RRT in arm joint space (MuJoCo collision checks) + shortcutting + time-parameterization (MR Ch 9).
- Theory REFERENCE: LaValle *Planning Algorithms* free at http://lavalle.pl/planning/ ◐. SKIM Ch 5 + 6 intro only.
- **Trajopt intuition: Underactuated Ch 10** — STUDY (~6 h incl. a collocation exercise); Tedrake Manipulation Ch 6 for the manipulation stack incl. **GCS** (SKIM as "know it exists" — 2023–26 research direction).
- Tool REFERENCE: **OMPL** ✅F (active; VAMP SIMD integration). Don't study; know it's the production library.

## 9. Dynamics depth — Featherstone NOT needed

**MR Ch 8 lite + simulator internals docs is the right depth.** Do: (i) derive 2-link Lagrangian once by hand; (ii) *stretch (~6 h)*: implement recursive Newton–Euler from MR Ch 8 pseudocode, match `modern_robotics.InverseDynamics`; (iii) read MuJoCo "Computation" docs chapter (MuJoCo 3.12.0, Aug 2026 ✅P) for constraints/contacts. **Featherstone = REFERENCE only** — spatial-vector algebra matters if you *build* simulators; a learning-first researcher consumes it through MuJoCo/Drake/Pinocchio. Contact intuition → Underactuated Ch 17 skim + MuJoCo docs.

## 10. 2025–26 entrants

**No new theory textbook/course has displaced MR + Tedrake.** Adopt: SLAM Handbook (new canonical estimation reference); LeRobot + free "Robot Learning Tutorial" (the on-ramp for the *next* stage); perception tool turnover (SAM 3/3.1, Depth Anything 3, YOLO26, OpenCV 5).

## (a) Hours

| Block | Hours |
|---|---|
| Rotations/quaternions/Lie (eater.net + Solà + own SO3/SE3 lib) | 8–10 |
| Modern Robotics spine + own kinematics library | 50–60 |
| Control fast path | ~25 |
| State estimation (Labbe from scratch) | 25–30 |
| **Robotics-theory core** | **≈110–125 h** |
| Tedrake Manipulation (Ch 1–6, 8–10 + notebooks) | 45–55 |
| Perception tools lab | ~20 |
| Motion planning (+trajopt) | ~20 |
| SLAM bridge | 4–6 |
| End project | 25–35 |
| **Full robotics block** | **≈225–260 h** |

## (b) Honest CUTS (defended)

1. **DH parameters beyond reading a table** (30 min, MR App C) — PoE strictly more composable; DH survives in legacy docs only.
2. **Full manipulator-dynamics derivations** — one 2-link Lagrangian + one RNEA implementation gives the structure; simulators do the rest.
3. **Frequency-domain control** — vocabulary only (see §4).
4. **Lyapunov/robust/adaptive control theory** — ROI only if later doing safety certificates.
5. **Closed chains & wheeled-robot kinematics** (MR Ch 7, 13).
6. **Grasp-mechanics depth** (wrench spaces, closure proofs) — modern grasping is learned or antipodal-heuristic; vocabulary only.
7. **Deep SLAM/factor-graph internals** — SLAM Handbook on demand.
8. **Classical CV feature internals** (SIFT/ORB derivations, MRF stereo) — foundation-model tools + geometry are what's used.
9. **UKF sigma-point derivations, smoothers, adaptive filters** — recipe-level UKF only.

## (c) END PROJECT — "PandaKin": from-scratch arm stack in MuJoCo

**Simulator:** MuJoCo ≥3.12 + **Franka Panda / UR5e from mujoco_menagerie** ✅F (UR5e for cleaner 6-DOF IK; Panda for 7-DOF nullspace). Reference oracle: **kevinzakka/mjctrl** ✅F (single-file diff-IK with nullspace, operational-space control — pedagogical gold).

Build from scratch (NumPy only):
1. `se3.py` — SO(3)/SE(3) exp/log, quaternion↔matrix, ⊞/⊟ (Solà conventions).
2. `kin.py` — PoE FK (space+body), geometric Jacobian, numerical IK (damped least squares + joint limits).
3. `traj.py` — quintic time scaling; joint + Cartesian screw trajectories.
4. `ctrl.py` — joint PD+gravity-comp, computed-torque; task-space diff-IK velocity control at 500 Hz.
5. `est.py` — EKF fusing noisy encoders + simulated 30 Hz camera pose measurement (noise + dropout); control from the *estimate*.
6. `plan.py` — joint-space RRT around a shelf obstacle, shortcut, time-parameterize, execute.
7. Capstone behavior: scripted pick-and-place; perception stretch: SAM 3 segmentation from the sim camera + ICP pose via Open3D.

**Verification (the point):** FK/Jacobian/IK/dynamics match `modern_robotics` + `roboticstoolbox-python` to 1e-8/1e-6; Jacobian finite-difference check; IK ≥95% success on 500 random reachable poses (<1 mm, <0.5°); circle-tracking RMSE <2 mm; computed-torque vs PD comparison plot; EKF NEES/NIS within chi-square bounds, graceful degradation at 20% dropout; RRT collision-free across 50 seeds with path-length stats. Deliverable: repo with CI test suite + 2-min rendered rollout. **25–35 h.** Produces the kinematics library the rest of the curriculum reuses.
