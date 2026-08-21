# Canonical Resource Selections (PRIMARY / BACKUP / REFERENCE)

**Synthesized from `reports/` · all URLs verified 2026-08-21 · full structured records live in `src/content/resources.ts`.**
Rule (HANDOVER §14): one primary, one backup with a different style, one reference. No five-equivalent-courses. Hours are fast-learner focused hours.

| Topic | PRIMARY | BACKUP | REFERENCE | Hours |
|---|---|---|---|---|
| Terminal/Git/Linux | MIT Missing Semester 2026 (L1–L5 + 2020 L2) | Missing Semester 2020 edition | lecture notes as cheat sheets | 12–15 |
| Python | Think Python 3e (Downey, notebooks) + Exercism track | CS50P (incl. its week 5 testing) | Automate the Boring Stuff 3e Part II; official tutorial | 45–65 |
| NumPy/Matplotlib | Official NumPy absolute-basics + quickstart + broadcasting/indexing/views; Matplotlib quick-start (OO style) | Scientific Python Lectures | From Python to NumPy (Rougier) | 8–15 |
| Algebra→Precalc repair | Khan Academy **test-out loop** (Course Challenges → weak-unit patching; Alg 1 → Alg 2 core → Precalc functions/trig) | Paul's Online Notes: Algebra | OpenStax Alg&Trig 2e / Precalc 2e practice tests | 40–60 |
| Calculus | 3B1B Essence of Calculus (all 12) + Paul's Calc I/III subset | MIT 18.01SC units 1,3 | Khan multivariable (Jacobian unit) | 35–45 |
| Linear algebra | 3B1B Essence of LA (before anything) + **VMLS + Python companion** (ch 1–3,5,6–8,10–13 in NumPy) | MIT 18.06 eigen/SVD lectures + RES.18-010 | Axler LADR 4e (free); immersivemath | 32–42 |
| Eigen/SVD + vector calc + optimization formalism | **MML book ch 4, §5.1–5.7, §7.1–7.2** (consolidation passes) | — | MML rest | 15–20 |
| Probability/statistics | MIT 18.05 S22 notes + psets in Python | Stat 110 + Blitzstein–Hwang 2e (free) | Seeing Theory (2–3 h warm-up) | 25–35 |
| Optimization for ML | d2l.ai ch 12.1–12.6 + Khan Lagrange articles | MML ch 7 | Boyd Convex Opt (do NOT open now) | 8–12 |
| Classic ML | CS229 main notes (2026-08-18 revision) Parts I–II + regularization | StatQuest core ~15 videos | ISLP (free PDF) | 12–15 |
| PyTorch | Official Learn-the-Basics ×8 (PyTorch 2.13) | learnpytorch.io 00–04 | DL with PyTorch 2e (paid) | 6–8 |
| Neural nets from scratch → GPT | **Karpathy Zero to Hero v1–7** (+v8–9 recommended); exit exam = cold-read **microgpt** (Feb 2026) | 3B1B NN series ch 1–7 | d2l.ai; UDL (Prince) | 30–42 |
| Attention/Transformer polish | UvA notebook Tutorial 6 + RoPE (RoFormer §3 + labml impl) | Annotated Transformer (2022 rewrite) | labml.ai annotated implementations | 6–8 |
| Vision/CNNs | CS231n 2025 lectures (selective; incl. L16 Vision&Language, L17 Robot Learning) + A1 + CNN/ViT parts of A2/A3 | d2l vision chapters | Szeliski 2e | 20–25 |
| ViT/CLIP/multimodal | ViT paper + UvA T15 + lucidrains vit-pytorch read; CLIP paper + open_clip zero-shot/probe; SigLIP loss; DINOv3 skim | 3B1B ch 5–7 | big_vision README | 13–16 |
| Experiment tracking | Weights & Biases free tier (+ local CSV hedge) | TensorBoard | — | 1 |
| 3D rotations/Lie | eater.net quaternions (interactive) + **Solà micro-Lie** §I–IV + appendices (+1 h author video); implement SO(3)/SE(3) in NumPy | Modern Robotics ch 3 | manif library docs | 8–10 |
| Kinematics/dynamics | **Modern Robotics** ch 2(skim),3,4,5,6,8-lite,9,11.1–11.4 + build own library against MR pip package | MR video series + Coursera | Corke RTB-Python as test oracle; Featherstone (never linearly) | 50–60 |
| Manipulation | **Tedrake, Robotic Manipulation** (Fall 2025 notes) ch 1–6 deep, 8–10 skim; Deepnote/Drake exercises | OCW 6.4210 F2022 videos | Drake docs | 45–55 |
| Control | Brian Douglas (PID/state-space) → Brunton Control Bootcamp (through LQR/LQG) → Underactuated ch 8+10 → hand-rolled MPC (cvxpy) | Underactuated Spring 2024 videos | databookuw ch 8 | ~25 |
| State estimation | **Labbe, Kalman & Bayesian Filters in Python** ch 1–2,4–8,10–12, filters from scratch (FilterPy as oracle) | Stachniss lecture videos | Thrun, Probabilistic Robotics (2005) | 25–30 |
| Camera geometry/perception | **First Principles of Computer Vision** (image formation, calibration, stereo modules) + OpenCV 5 calibration/solvePnP labs + Open3D ICP lab | Szeliski 2e ch 2 + stereo | OpenCV docs | ~20 |
| Modern perception tools | SAM 3/3.1 + Depth Anything 3 + YOLO26 wired into pipelines (tools, not topics) | Grounding DINO (legacy pipelines) | — | 6–8 |
| SLAM (bridge only) | Stachniss SLAM intro + PythonRobotics EKF-SLAM/FastSLAM demos | — | **SLAM Handbook** (free draft, 2026) | 4–6 |
| Motion planning | Build A*/RRT/RRT* vs **PythonRobotics** reference; Underactuated ch 10 trajopt | LaValle ch 5 skim | OMPL docs | ~20 |
| ROS 2 | Official **Jazzy** tutorials (129 pages, selective) + Articulated Robotics build-along; 55 h syllabus in reports/ros-simulators.md | The Construct (only if install friction dominates) | ROS 2 docs | ~55 |
| Simulators | **MuJoCo 3.12** (+ menagerie + mjctrl oracle) primary; Gazebo Harmonic inside ROS project; MJX/Warp for GPU RL | ManiSkill3 (manipulation/vision RL) | Isaac Lab (triggered elective); Genesis (watchlist) | 15–25 |
| RL theory | **CS 185/285 Spring 2026** selected lectures (2,4–8,15–16) + Sutton&Barto ch 1,3–6 | Spinning Up essays (1 day) | S&B rest; CS234/CS224R | ~25 |
| RL implementation | **CleanRL** + "37 Implementation Details" → PPO & SAC from scratch → port to ManiSkill3 vectorized | SBX (known-good baselines) | Stable-Baselines3 (oracle only) | ~30 |
| GPU-parallel RL | **MuJoCo Playground** Colabs (Go1 in 7 min on 4090) + ManiSkill3 PPO baselines | mjlab (Isaac-Lab-style API on Warp) | Isaac Lab docs (≥16 GB) | 10–14 |
| Sim-to-real | Annual Reviews "Reality Gap" (2026) + Tang real-world-RL survey + Rudin/ADR papers + **unitree_rl_gym sim2sim discipline** + LeRobot HIL-SERL (gym_hil sim variant) | Da et al. survey + AwesomeSim2Real | DrEureka, legged_gym papers | 12–16 |
| Offline RL (demoted) | CORL `iql.py` code-study + concepts | Flow Q-Learning skim | OGBench, Minari | 6–8 |
| Imitation learning | CS285 Lec 2 + **HW1 Spring 2026** (BC+DAgger) → ACT (paper + LeRobot) → **Diffusion Policy from scratch on PushT** → flow-matching delta | LeRobot "Robot Learning: A Tutorial" + HF Robotics Course units | act-plus-plus, real-stanford/diffusion_policy Colabs | ~40 |
| LeRobot ecosystem | LeRobot v0.6 docs + official Colabs (ACT ~1.5 h A100; SmolVLA ~5 h) + dataset v3 + lerobot-eval/rollout | HF notebooks | LeRobot source | 8–12 |
| VLA | Five-paper spine (RT-2 → OpenVLA → π0+FAST → π0.5 → RECAP) + survey 2507.01925 + **SmolVLA fine-tune** then **π0-LoRA via openpi** (24 GB) | GR00T N1.7 repo (humanoid flavor); MolmoAct2 (open-everything) | awesome-vla-2026 index; survey 2505.04769 | ~50 |
| RL×VLA | Reading module: SimpleVLA-RL + RECAP + πRL + RL4VLA (+ code-walks) | RIPT-VLA (QueST-scale stretch) | RLinf | 8–12 |
| World models | Ha&Schmidhuber → **DreamerV3 (run)** → **TD-MPC2 (run, 12 GB)** → V-JEPA 2/2-AC → Dreamer 4 paper; exercise: **DINO-WM** or TD-MPC2 reproduction | WM survey 2605.00080 + WAM tutorial 2607.00836 | Cosmos/DreamDojo/Ctrl-World repos | ~30 |
| Research methodology | HANDOVER §19 templates + STEP/TRI eval statistics + rollout-count math + reproduction workflow | "How to Read a Paper" (Keshav 3-pass) | ML Reproducibility Challenge reports | ~15 |
| C++ (reading literacy) | learncpp.com ch 1–11 + port 2 ROS 2 C++ tutorials | — | cppreference | 20–25 |
| Learning science (in-app citations) | Make It Stick; Dunlosky et al. 2013 (PSPI) | — | — | — |

## Deliberately not selected (and why)

- **fast.ai** — top-down + abstraction layer is the wrong direction for a derive-and-implement path; 2022 content stale.
- **Spinning Up code / David Silver course / TRPO / Atari-DQN lineage** — superseded; essays/concepts absorbed elsewhere.
- **Goodfellow Deep Learning** — reference-only, pre-transformer.
- **Boyd Convex Optimization, Featherstone, Probabilistic Robotics** — references that would eat weeks; consult on demand.
- **The Construct subscription, Coursera certificates** — the free primary paths cover it; credentials are explicitly a non-goal.
- **Craig (DH-centric) robotics text** — PoE-first Modern Robotics is the modern convention.
- **PyBullet, legged_gym, Isaac Gym Preview** — frozen/legacy stacks.
- **MiniVLA, EO-1 standalone** — dormant/absorbed; SmolVLA and LeRobot fill the niches.
