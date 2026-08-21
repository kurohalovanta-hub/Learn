# Curriculum Audit — HANDOVER vs the Verified 2026 Field

**Per HANDOVER §34.3–5: audit for missing prerequisites, add missing critical topics, remove obsolete/redundant ones. Written 2026-08-21 against the reports in `reports/`.**

## A. The handover got right (confirmed by research, unchanged)

Level skeleton L0–L16; simulation-first + optional cheap hardware (SO-101 is *still* the 2026 starter arm, ~$230/pair, no successor); Python-primary with C++ reading literacy (~90% of 2026 robot-learning work is Python-facing); mastery gates over calendar; ACT + Diffusion Policy + action chunking as the IL core; VLA as the core specialization; world models as a distinct level; research methodology as first-class; the deprioritize list (§18) — every item on it survived scrutiny.

## B. ADDED — topics the handover missed or under-specified

| Addition | Where | Why (evidence) |
|---|---|---|
| **Flow matching** as an action-generation primitive | L11 (new node after Diffusion Policy) | π0/π0.5/GR00T/X-VLA/RDT2-FM all use flow action experts; teachable as a ~50-line delta from from-scratch DP |
| **RL fine-tuning of VLAs / learning from experience** | L12 (reading module) | RECAP/π*0.6, SimpleVLA-RL (ICLR 2026), πRL, GR-RL — the defining 2025–26 development |
| **Evaluation statistics** (rollout counts, CIs, sequential testing, robustness suites) | L11 + L15 (own node; boss requirement) | LIBERO saturation + LIBERO-Plus collapse results; NVIDIA/TRI methodology work; cheapest real research entry point |
| **Latent action models / learning from human video** | L12–L13 (node) | Genie-1 idea → LAPA → UniVLA → GR00T pipeline; egocentric mega-datasets (EgoDex/EgoVerse) |
| **World models as evaluators & data factories** | L13 | Ctrl-World, DreamGen, RoboWorld (ρ=0.97) — the working use of generative WMs in 2026 |
| **The VLA-vs-WAM debate** | L13 (frontier node) | 2603.22078, VLA-JEPA, AMI Labs — the open paradigm question |
| **Knowledge insulation + dual-system architectures** | L12 concepts | π0.5, GR00T, GO-2 async dual-system — recurring design pattern |
| **Real-time chunking / async inference constraints** | L12 | RTC is now standard LeRobot tooling; latency is a core VLA design constraint (handover asked "latency?" — now concrete) |
| **Teacher–student distillation + sim2sim validation** | L14 | The documented 2026 sim-to-real recipe (rsl_rl distillation; unitree_rl_gym Train→Play→Sim2Sim→Sim2Real) |
| **Dataset-quality / data-composition literacy** | L11 | LeRobot dataset v3 streaming, DROID slices, MimicGen-vs-DreamGen synthetic families |
| **Reward models & correction workflows** | L11–L12 | LeRobot v0.6 "Imagine/Evaluate/Improve": SARM/rollout `dagger` mode — interactive imitation is now tooling, not just a paper |
| **Modern perception tool fluency** (SAM 3, Depth Anything 3, YOLO26) as tools | L8 | 2024-era picks (SAM 2 alone, DA-V2) are no longer defaults |
| **Explicit diagnostic-skip machinery** | app engine | Handover §25 demanded it; research (Khan test-out loop, course-completionism warning) says it's the top time-sink defense |

## C. REMOVED / DEMOTED — with defense

| Cut | Was implied by handover | Defense |
|---|---|---|
| Frequency-domain control (Bode/root locus) | L6 "control" | SISO loop-shaping for measured plants — process-engineering workflow; nothing downstream (Tedrake, estimation, robot learning) needs it. One vocabulary video. |
| DH parameters beyond reading a table | L5 | PoE/screw theory is what Drake/Pinocchio/modern code uses; MR Appendix C in 30 min |
| Featherstone-depth dynamics | L5–L6 | One 2-link Lagrangian + optional RNEA implementation gives the structure; simulators do the rest |
| Deep SLAM / factor-graph internals | L8–L9 | Manipulation-focused researcher has near-known kinematic state; Bayes-filter→SLAM bridge (4–6 h) + SLAM Handbook as reference |
| Classical CV feature internals (SIFT/ORB derivations) | L8 | Foundation-model tools + geometry/calibration are what's actually used |
| GANs; RNN/LSTM unit; classical NLP; TF/Keras | L4 | Diffusion won; attention replaced gating (30-min concept only); PyTorch-only |
| Offline RL as a full unit | L10 | Demoted to IQL-file study + concepts — absorbed into VLA post-training (RECAP is advantage-conditioned offline-style RL) |
| Atari/DQN archaeology, TRPO, exhaustive S&B | L10 | One toy DQN day max; PPO-first is the field's practice |
| Spinning Up codebase; David Silver course | L10 | TF1-era / pre-deep-RL; essays only |
| ROS 2 mastery (executors, RMW/QoS tuning, lifecycle depth) | L7 | Capped: 55 h literacy syllabus; "ROS is infrastructure, not identity" made concrete |
| Isaac Sim as required | L7 | 16 GB floor + Ubuntu coupling + 3.0-beta churn; Newton/MJWarp converges on MuJoCo semantics anyway → triggered elective |
| PyBullet; Gazebo Classic; ROS 1 | L7 | Frozen/legacy |
| Nav2/MoveIt deep internals | L9 | Bringup + concepts (6–8 h each); internals reference-only |
| Electronics/embedded module | L14 | Hardware track optional; SO-101 path needs none of it |
| "Reproduce multiple meaningful results" (Month 6, plural-heavy) | §8 | Rescoped: **one rigorous component-level reproduction + one evaluation-level reproduction**. A full π0-scale reproduction is not solo-feasible (documented: 2 days × 8×H100 for π0.5-DROID FT) |

## D. CORRECTED — handover assumptions the research overturned

1. **"OpenVLA and successors" as the fine-tune target** → OpenVLA is frozen (Mar 2025) and its LoRA floor (~27 GB) exceeds consumer cards. It stays as the *best readable codebase* (STUDY); the fine-tune path is SmolVLA → π0-LoRA/π0.5 (openpi documents >22.5 GB on an RTX 4090) or GR00T-via-LeRobot.
2. **"Research the best currently supported ROS 2 distro"** → answer is **Jazzy on Ubuntu 24.04**, *not* the newest LTS (Lyrical, 3 months old, Tier-1 only on Ubuntu 26.04 which Isaac/CUDA stacks don't support).
3. **Simulator plurality** → handover listed Gazebo/MuJoCo/Isaac as peers. 2026 reality: MuJoCo-family is the primary axis (Warp/Newton convergence); Gazebo scoped to the ROS project; Isaac triggered.
4. **LIBERO as "the" benchmark** → must be taught *with* its saturation/robustness critique; benchmark literacy now includes when a benchmark stops measuring progress.
5. **"SmolVLA / LeRobot ecosystem" as one bullet** → LeRobot is now the workbench for the entire hands-on curriculum (policies, datasets, eval, teleop, RL) — promoted from topic to infrastructure.
6. **Month-5 "Isaac Lab/MuJoCo" for robot learning** → MuJoCo Playground + ManiSkill3 are the verified single-GPU RL platforms (documented minutes-scale training); Isaac Lab optional.
7. **Handover's compute caution ("cloud GPU only when justified")** → quantified: 24 GB local runs everything except OFT-LoRA and full FTs; total cloud budget $80–200 (24 GB tier) to $150–400 (12 GB tier). See 04-compute-strategy.md.

## E. Feasibility deltas (fed into 06-feasibility.md)

Research hour-audits force honest budget increases vs the first draft: L2 math 96→~130 h (foundations report: 132–182 h for repair+calc+LA+prob; fast-learner + test-outs assumed at low-mid), L4 DL 78→85, L5+L6 robotics 92→106, L7 ROS 40→52, L10 RL 46→50. New core ≈ **920 h** (+ 90 h weekly reviews ≈ 1,010 h) vs 900–1,260 h available → fits at **5.6 h/day** with ~250 h ceiling headroom. De-scope levers unchanged (L9 shrink; reproduction scope). The verdict stands: feasible **iff** parallel tracks + diagnostic skipping + pre-agreed cuts.
