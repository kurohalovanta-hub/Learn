# The Embodied Intelligence Frontier — August 2026

**Synthesis of the ten verified research reports in `reports/` · written 2026-08-21.**
This is the map the curriculum is built against. Detailed sources and verification tags live in the reports.

## 1. The ten facts that define the field right now

1. **The VLA recipe has converged.** π0.5, GR00T N1.7, GR-3, RDT2, X-VLA all share one shape: a VLM backbone kept close to its language pretraining (knowledge insulation) + a chunked **flow-matching/diffusion action expert** for continuous control + **discrete action tokens (FAST/OpenFAST/RVQ)** where autoregressive unification or cross-embodiment transfer is needed. This convergence is teachable — it's the core of Level 12.
2. **RL from experience went mainstream.** π*0.6/RECAP (advantage-conditioned policies on demos + corrections + autonomous experience), ByteDance GR-RL, SimpleVLA-RL (ICLR 2026), πRL for flow-based VLAs. "Behavior cloning then hope" is no longer the frontier story; value functions are back. This justifies keeping a real RL spine (PPO/SAC/IQL) in the curriculum instead of a token gesture.
3. **Evaluation is in crisis, which makes it opportunity.** LIBERO is saturated (≥97% common) and robustness audits (LIBERO-Plus, CVPR 2026) show scores collapsing under perturbation; models memorize trajectories and ignore language. Distributed real eval (RoboArena) and neural-sim eval (RoboWorld, ρ=0.97 vs RoboArena ranking) are rising. **Evaluation methodology is now a first-class curriculum topic and the single most tractable research entry point for a solo learner.**
4. **World models split into two live bets.** Latent/JEPA (V-JEPA 2/2.1-AC, DINO-WM, TD-MPC2; LeCun's AMI Labs raised ~$1B on this) vs generative-video (Dreamer 4, Genie 3, Cosmos 3, DreamDojo). Generative WMs currently work best as **evaluators and data factories** (Ctrl-World, DreamGen), not online planners. No head-to-head on shared robot benchmarks exists — an explicit open problem.
5. **The world-action-model debate is the next paradigm question.** "Do WAMs generalize better than VLAs?" (2603.22078), VLA-JEPA, NVIDIA's "pretrained to imagine, fine-tuned to act." A 2026-current curriculum must teach both sides of the argument, not pick a winner.
6. **Simulation consolidated on MuJoCo semantics.** MuJoCo Warp GA (DeepMind+NVIDIA), Newton 1.5 (Linux Foundation: Disney/DeepMind/NVIDIA) is Isaac Lab 3.0's physics, mjlab re-hosts Isaac Lab's API on MuJoCo Warp. Learning MuJoCo deeply is now the single most transferable simulator investment. GPU-parallel RL on one consumer card is the default: a Go1 locomotion policy trains in **7 minutes on an RTX 4090** (MuJoCo Playground, documented).
7. **LeRobot became the field's workbench.** 26.8k★, ICLR 2026 paper, v0.6 "Imagine/Evaluate/Improve": every major policy family (ACT → Diffusion → π0.5 → GR00T N1.7 → SmolVLA → world-model policies + reward models), six benchmark suites under one CLI, dataset v3 streaming, DAgger-style correction rollouts. The curriculum's hands-on spine runs through it end to end.
8. **Data went heterogeneous.** Frontier fleets are proprietary (PI 10k+ h, GEN-0 270k h), but the open story is: OXE/DROID (streamable in LeRobot v3) + AgiBot World + **human egocentric video at scale** (EgoDex, EgoVerse, Egocentric-1M) + latent-action learning from video (Genie-1 idea → LAPA → UniVLA) + **synthetic data from world models** (DreamGen) and geometric replay (MimicGen/RoboCasa365).
9. **Robotics scaling laws are claimed but unaudited.** Generalist AI's GEN-0 ("~7B capability threshold", power laws on 270k h). Closed, loud, and the field's reference argument — a critical-reading exercise, not a study target.
10. **Frontier closed, replication open.** π0.7, Gemini Robotics 2, Helix-02, GEN-1 are closed; the open ecosystem (openpi π0.5, GR00T N1.7, SmolVLA, MolmoAct2 — weights+data+tokenizer open — LingBot 2.0, Xiaomi-Robotics-0) lags ~6–18 months but is fully sufficient to train a researcher. Community reimplementations (Dreamer 4) are load-bearing infrastructure.

## 2. What this means for a 210-day curriculum (deltas locked in)

- **Flow matching is core curriculum**, taught as a ~50-line delta from a from-scratch Diffusion Policy (the research-verified teaching path). Diffusion → flow → π0's action expert is one continuous thread.
- **The VLA reading spine is five papers** (RT-2 → OpenVLA → π0+FAST → π0.5 → RECAP), with the tokenization-perspective survey (2507.01925) as the map. Everything else is SKIM.
- **The capstone fine-tune is π0-LoRA/π0.5 via openpi (24 GB) with SmolVLA as the warm-up** (16 GB and below). OpenVLA is studied as the best readable codebase, not fine-tuned.
- **Evaluation statistics get their own node** (rollout-count math, CIs, STEP-style sequential testing, LIBERO-Plus robustness) and the Robot Learning Boss requires seeds + CIs.
- **RL×VLA is a mandatory reading module** (SimpleVLA-RL, RECAP, πRL, RL4VLA) after the PPO/SAC/IQL spine; hands-on only as checkpoint evaluation or QueST-scale stretch.
- **World models get both spines**: reproduce-able latent track (DreamerV3/TD-MPC2/DINO-WM on one GPU) + generative-frontier literacy (Dreamer 4, Cosmos 3, DreamDojo, Ctrl-World).
- **Infrastructure choices**: ROS 2 **Jazzy on Ubuntu 24.04** (not 3-month-old Lyrical — Isaac and the CUDA ecosystem don't support 26.04 yet); **MuJoCo primary sim**; Gazebo Harmonic only inside the ROS project; **Isaac Lab optional/triggered** (16 GB floor + 3.0 beta churn); Genesis watchlist; PyBullet retired.
- **Perception is tools-first**: camera geometry + calibration deeply; SAM 3, Depth Anything 3, YOLO26 as tools wired into pipelines, not studied.
- **Cut list confirmed** (see 03-curriculum-audit.md): frequency-domain control, DH depth, Featherstone, deep SLAM internals, GANs, RNNs-as-unit, classical-CV feature internals, TRPO/Atari archaeology, offline-RL zoo (keep IQL only), Spinning Up code, David Silver course, fast.ai.

## 3. Open problems worth a Month-7 research sprint (tractability-ranked for one GPU)

1. **Policy evaluation** — robustness gaps (LIBERO vs LIBERO-Plus deltas), rollout-count statistics, sim-vs-neural-sim ranking fidelity. Cheap, publishable, directly on-trend.
2. **Data composition & quality for small VLA fine-tunes** — what mix (sim/teleop/synthetic/human-video slices) moves SmolVLA/π0-LoRA success; dataset-quality metrics.
3. **Action representation** — chunk length, flow steps vs FAST tokens on identical data; discrete-diffusion heads at small scale.
4. **World-model-as-evaluator** — can a small learned dynamics model (DINO-WM class) rank policies on PushT/LIBERO tasks like real rollouts do?
5. **RL fine-tuning at small scale** — RIPT-VLA-on-QueST class experiments; advantage-conditioned BC on sim data.
6. **Cross-embodiment transfer at toy scale** — latent-action interfaces between two sim arms.
7. **Failure detection/recovery** — detect-and-retry wrappers around frozen policies; reward-model-guided correction (LeRobot's SARM/rollout machinery makes this hands-on).

## 4. Frontier watch-list (seeded into the app's Frontier Tracker)

π0.7 · Gemini Robotics 2 · GR00T N1.7+ · GEN-0/GEN-1 scaling claims · MolmoAct2/OpenFAST · SmolVLA successors · LeRobot releases · Dreamer 4 official code (still unreleased) · V-JEPA 2.1+ · Cosmos 3 / DreamDojo · Ctrl-World/WMPO lineage · LIBERO-Plus/RoboTwin 2.0/RoboCasa365 · RoboArena/RoboWorld eval · Isaac Lab 3.0 stable (Newton) · MuJoCo Warp · ROS 2 Lyrical adoption · SAM 3.x / Depth Anything 3 · CoRL 2026 (Nov, Austin) outcomes.
