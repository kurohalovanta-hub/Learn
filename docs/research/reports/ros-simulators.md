# Research Report — ROS 2 + Simulator Infrastructure (2026-08-21)

> Produced by a dedicated research agent with live verification 2026-08-21. **[V]** = fetched/cloned directly (GitHub, raw files, repo clones of doc-site sources); **[S]** = confirmed via search snippets; **[B]** = canonical URL egress-blocked today, verified indirectly as noted.

## 1. ROS 2 distros (Aug 2026)

Source: `ros2/ros2_documentation` rolling branch cloned [V]; docs.ros.org hits [S].

| Distro | Released | EOL | Status |
|---|---|---|---|
| **Lyrical Luth** (12th, **LTS**) | **May 22, 2026** | May 2031 | Current LTS. **Tier 1 only on Ubuntu 26.04** + Win 11; **Ubuntu 24.04 = Tier 3 source-build**. C++20, Python 3.12–3.14. |
| Kilted Kaiju (non-LTS) | May 2025 | **Dec 2026** | Dies in 4 months — do not adopt. |
| **Jazzy Jalisco (LTS)** | May 2024 | **May 2029** | Tier 1 on **Ubuntu 24.04**; mature ecosystem. |
| Humble (LTS) | May 2022 | May 2027 | Legacy; still what much industry runs. |

**Recommendation: install Jazzy Jalisco on Ubuntu 24.04.** Reasons (verified): (1) Lyrical's Tier-1 platform is Ubuntu 26.04, but **Isaac Sim 6.0 supports only Ubuntu 22.04/24.04** [V IsaacSim README] — a GPU learner on 26.04 cuts themselves off from the CUDA/sim ecosystem; (2) Jazzy has runway to May 2029; (3) Nav2/MoveIt/ros2_control/ros_gz all ship Jazzy binaries and 2024–26 tutorials target Jazzy; (4) Lyrical is 3 months old — core stacks released into it [V rosdistro lyrical/distribution.yaml] but third-party lags. Skills transfer near-verbatim later.
**Verdict: Jazzy = STUDY (as infrastructure). Lyrical = REFERENCE. Kilted/Humble = SKIP.**

## 2. Learning resources + hours

- **PRIMARY: Official ROS 2 Jazzy tutorials** — https://docs.ros.org/en/jazzy/Tutorials.html [B — structure verified by cloning docs repo: 129 tutorial pages; Beginner CLI (9 lessons: nodes/topics/services/params/actions/rqt/bag), Beginner Client Libraries (workspace/colcon/pub-sub/interfaces), Intermediate (Launch, TF2, URDF, RViz, Actions, Testing)]. Canonical, current, dry but exact. The spine.
- **PRIMARY companion (build-along): Articulated Robotics** (Josh Newans) — articulatedrobotics.xyz [B; author GitHub active [V], companion repo articubot_one 496★ [V]]. "Building a mobile robot" series = best free end-to-end path (URDF/Xacro → Gazebo → ros2_control → sensors → Nav2).
- BACKUP: The Construct [B — unverified today; subscription; use only if local-install friction dominates].
- **Hours to competent ROS 2 literacy: 40–60** (budget 55 in-plan; syllabus in (b)). "ROS mastery" (executors, RMW tuning, real-time) is a job, not a course — out of scope by design.

## 3. Gazebo (new, "gz")

Source: gazebosim/docs `index.yaml` [V].
- **Gazebo Jetty** (gz-sim 10) = current **LTS, Sep 2025 → May 2031** (aligned to Lyrical). **Harmonic** (gz-sim 8, LTS → May 2029, aligned to Jazzy). Ionic EOL Dec 2026.
- **ros_gz** [V]: official pairings **Jazzy↔Harmonic**, Lyrical↔Jetty. Our Jazzy learner runs **Gazebo Harmonic from apt** — zero friction; `gz_ros2_control` released for it [V rosdistro].
- Role: **the** ROS-native sensor/world simulator (lidar/camera/IMU, SDF worlds, Nav2 integration). Not for RL at scale. **Verdict: STUDY (8–10 h, only via the ROS robot project — never standalone).**

## 4. NVIDIA Isaac Sim + Isaac Lab

- Versions [V]: Isaac Sim **6.0.0 GA 2026-06-04**, **6.0.1 GA 2026-06-22**; open source (Apache 2.0) since 5.0; pip wheels; **free for individuals**.
- Isaac Lab: stable **2.3.2** (Feb 2026, needs Isaac Sim 5.1); **3.0.0-beta2 (Jun 2026)** on Isaac Sim 6.0 — multi-backend physics (**PhysX + Newton/MJWarp**), kit-less workflows ("Kit-less Newton workflows do not require Isaac Sim"), Python 3.12.
- **System requirements** [V README + S docs]: **Windows 11 or Ubuntu 22.04/24.04 only**; workstation GPU **min RTX 4080-class, ~16 GB VRAM + 32 GB RAM minimum**; sensor-heavy needs more. Learning curve: high (Omniverse/Kit, USD, RTX renderer + Isaac Lab abstractions); **20–40 h to productive**.
- See (c): **OPTIONAL, triggered — not required.**

## 5. MuJoCo

- **3.12.0 (2026-08-20)** [V releases]; monthly cadence; Apache 2.0; 14.6k★; `pip install mujoco`; first-class Python bindings (free-threaded PEP 703 support in changelog [V]).
- **MJX** reframed as "a JAX API for various implementations": MJX-JAX (NVIDIA/AMD/Apple/TPU) and **MJX-Warp** (`impl='warp'`, batch rendering 2026). Actively extended.
- **MuJoCo Warp** [V]: DeepMind + NVIDIA, part of **Newton** (Linux Foundation: Disney/DeepMind/NVIDIA [V]) — the industry convergence point: **MJCF/MuJoCo semantics GPU-batched inside both Google and NVIDIA stacks** (Newton is Isaac Lab 3.0's backend).
- **mujoco_menagerie** [V]: ~80 curated models (G1/H1/Go2, Franka, UR, Shadow/Allegro/Leap, Spot, ANYmal, Aloha-class, **trs_so_arm100**). USD import/export docs in-tree; Newton USD schemas in 3.12.
- **Verdict: STUDY — the curriculum's primary simulator.** 6–10 h to fluency; +10–15 h for MJX/Warp batched patterns.

## 6. Genesis

[V repo + releases]: 1.0 ~May 2026 ("Genesis World"); v1.3.3 (2026-08-13), near-weekly releases; deterministic sim, differentiable rigid solver, tactile sensors, Nyx renderer, CUDA/ROCm/Metal/CPU; 29.8k★; company-backed (Genesis AI). **Genuinely maturing but young 1.x** — API churn, thin benchmarks/docs, no ROS-native story. **Verdict: SKIM (1–2 h demo; re-evaluate month ~5). Not core infrastructure.**

## 7. PyBullet

[V]: last real release 3.25 (2022); 2025 commits packaging-only; zero commits since 2025-10-22. **Frozen/legacy. SKIP for learning; REFERENCE when reproducing legacy code.**

## 8. MoveIt 2 + Nav2

- **MoveIt 2** [V]: still *the* manipulation planning standard; main supports Rolling+Lyrical+Jazzy+Humble; released into jazzy/lyrical rosdistro [V]; **moveit_py** ships across supported distros (thinner than C++ API). Tutorials lag (target Rolling/Humble; work on Jazzy with minor edits). **Verdict: STUDY-lite (one Panda/UR pick-place pass, 6–8 h).**
- **Nav2** [V]: the standard ROS 2 navigation stack, 4.6k★, CI for Humble/Jazzy/Lyrical. **Verdict: STUDY-lite (bringup + BT concepts on sim TurtleBot, 6–8 h; internals = REFERENCE).**

## 9. Robot description formats

- **URDF/Xacro** — mandatory (ROS, ros2_control, MoveIt; Isaac imports URDF). ~4 h inside the robot-build project.
- **MJCF** — mandatory for the learning-researcher track. ~3 h.
- **USD** — Isaac-native, emerging interchange (MuJoCo documents OpenUSD import/export; Newton schemas in 3.12). REFERENCE unless Isaac adopted.
- **SDF** — Gazebo worlds; read-only familiarity (1 h).
Net: **learn URDF+MJCF, skim SDF, defer USD.**

## 10. ros2_control

[V]: healthy, standard; master targets Rolling+Lyrical, maintained jazzy branch; gz_ros2_control released for Jazzy. **STUDY-lite (3–4 h: architecture, diff_drive_controller, joint_trajectory_controller, hardware-interface concept). Custom hardware interfaces = REFERENCE.**

## 11. C++ reality check

ROS 2 core is C++-first (Lyrical requires C++20), but a robot-learning researcher operates **~90% in Python** in 2026: rclpy, moveit_py, Nav2 via launch/params, MuJoCo/MJX/Isaac Lab/Genesis all Python-facing, training in PyTorch/JAX. Actually needed: **reading fluency** — headers, CMakeLists, templates-at-a-glance, trace a Nav2 costmap plugin or ros2_control hardware interface, write one trivial rclcpp node. **~20–25 h, not a semester.** Best minimal resource: **learncpp.com** (ch ~1–11 + skim classes/templates) [B canonical], then port two official ROS 2 C++ tutorials (pub/sub + service). C++ becomes real only when writing Nav2/MoveIt plugins or real-time loops — out of scope until a project demands it.

## 12. 2026 headlines

1. **ROS 2 Lyrical Luth LTS released 2026-05-22** (Ubuntu 26.04); Kilted dies Dec 2026.
2. **Isaac Sim 6.0 GA + Isaac Lab 3.0 beta with Newton (MJWarp) physics** — the NVIDIA↔DeepMind convergence via Linux-Foundation Newton is the year's biggest sim story.
3. **MuJoCo monthly train → 3.12**, MJX-Warp + batch rendering, OpenUSD in/out.
4. **Gazebo Jetty LTS current** (May 2031); "rotary" rolling stream.
5. Genesis 1.0 → 1.3.3, company-backed. 6. PyBullet frozen. 7. Isaac ROS 4.6.0 (2026-08-19).

## (a) Simulator strategy — two simulators, one optional third

| Phase | Simulator | Why |
|---|---|---|
| (i) First kinematics/dynamics play | **MuJoCo** (pip + viewer + menagerie) | Zero friction, best-documented physics, instant visual feedback; carries through RL |
| (ii) Classic control | **MuJoCo** (+ Gymnasium classic envs) | Same API, no new tool |
| (iii) RL at scale | **MJX/MJWarp on the single GPU** | Thousands of batched envs; feeds from the same MJCF models. Isaac Lab alternative only if ≥16 GB VRAM |
| (iv) Manipulation/imitation | **MuJoCo** (menagerie arms; ALOHA/robosuite/LeRobot are MuJoCo-centric) | Optional Isaac Lab upgrade when justified |
| (v) ROS-integrated mobile robot + nav | **Gazebo Harmonic via ros_gz on Jazzy** | The only first-class Nav2/sensor/ros2_control sim |

**Net: MuJoCo-family (STUDY) + Gazebo Harmonic (STUDY, scoped) required. Isaac Sim/Lab optional third. Genesis watchlist. PyBullet retired.** Two mental models: MJCF/Python for learning research, URDF/SDF/ROS for systems integration.

## (b) Minimal ROS 2 syllabus (~55 h, Jazzy on Ubuntu 24.04)

| # | Topic | Hours |
|---|---|---|
| 1 | Install; workspace/colcon/sourcing; CLI: nodes/topics/services/params/actions; rqt, ros2 bag | 6 |
| 2 | rclpy: pub/sub, service+client, action client; custom interfaces; parameters (read-port one C++ pub/sub) | 10 |
| 3 | Launch files (Python), namespaces/remapping, YAML params, composition (concept) | 4 |
| 4 | **TF2** + **URDF/Xacro** + robot_state_publisher + RViz | 8 |
| 5 | **Gazebo Harmonic + ros_gz**: spawn your URDF robot, diff-drive via ros2_control, lidar+camera+IMU bridged | 9 |
| 6 | **Nav2**: slam_toolbox → map → AMCL → Nav2 bringup; BT concept, costmaps, goals from rclpy | 8 |
| 7 | **MoveIt 2** taster: Panda/UR demo, planning scene, moveit_py motion request | 4 |
| 8 | Capstone: perception→planning→control — camera/lidar node detects target → publishes goal → Nav2/MoveIt executes; rosbag the run | 6 |
| | **Total** | **≈55 h** |

Excluded (REFERENCE only): DDS/RMW tuning, QoS deep-dive, executors, lifecycle nodes, real-time, security, custom plugins, C++ authoring beyond one port. That line keeps ROS infrastructure, not identity.

## (c) Isaac Sim: OPTIONAL — scheduled late (month 5–6), adopted on trigger

Evidence: hardware floor real (min RTX 4080-class/16 GB VRAM/32 GB RAM [V/S]; 12 GB runs it poorly); platform coupling (Ubuntu 22.04/24.04 only — another reason Jazzy/24.04 is the base); transition churn (Isaac Lab 3.0 beta mid-migration to Newton/MJWarp — **whose physics is MuJoCo semantics anyway**, so learning MuJoCo first is the transferable investment); cost is time (20–40 h Omniverse/USD onboarding buys little that MuJoCo+menagerie doesn't cover for a first RL/IL curriculum).
**Adoption triggers** (any one → install): GPU-parallel photoreal perception RL; Isaac-Lab-specific baselines/mimic datasets; sim2real on Jetson/Isaac ROS; target lab/employer standardized on it; ≥16 GB VRAM + wanting the humanoid task library (reasonable month-5 elective, budget 25 h).

**Bottom line:** Jazzy on 24.04 + MuJoCo 3.12 (+MJX/Warp) + Gazebo Harmonic + Nav2/MoveIt2/ros2_control, ~55 h ROS total, Isaac as triggered elective, Genesis watchlist, PyBullet retired.
