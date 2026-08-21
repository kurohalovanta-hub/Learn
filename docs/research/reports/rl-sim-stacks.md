# Research Report — RL for Robotics + Sim Training Stacks (2026-08-21)

> Produced by a dedicated research agent with live verification 2026-08-21. **[fetched]** = direct GitHub/PyPI-API fetch; **[search-verified]** = live search corroboration (doc domains blocked by sandbox proxy).

**Headline (Aug 2026):** Massively-parallel GPU RL on a single consumer card is now the *default* way robotics RL is taught and done. The MuJoCo ecosystem consolidated around **MuJoCo Warp (MJWarp)** — GA, DeepMind+NVIDIA, versioned with MuJoCo 3.12.0 — powering MuJoCo Playground (default backend since v0.2.0), **mjlab**, and NVIDIA's **Newton 1.5.0** engine (Linux Foundation), which is the physics backend of **Isaac Lab 3.0 beta**. "RL is back" at the frontier: RL fine-tuning of VLAs went from papers (mid-2025) to the defining industry result (π*0.6/RECAP) and an ICLR 2026 canon (SimpleVLA-RL).

## 1. Teaching canon

- **Spinning Up (OpenAI)** [fetched]: README says "Maintenance" — TF1-era + 2020 PyTorch, pre-Gymnasium. **SKIM the essays** ("Key Papers in Deep RL", "Spinning Up as a Deep RL Researcher") — still the best short conceptual on-ramp. **SKIP the code.**
- **Sutton & Barto 2nd ed (2018)** — still canonical, **no 3rd edition**; free PDF at incompleteideas.net [search-verified]. (2024 Turing Award.) **STUDY selectively:** Ch 1, 3–6 (MDP/DP/MC/TD); skim 9–10, 13. NOT cover-to-cover.
- **Berkeley CS 185/285, Spring 2026** — course live, renumbered, public lectures [search-verified: rail.eecs.berkeley.edu/deeprlcourse, Spring 2026 Lecture 1 on YouTube; Fall 2023 playlist complete]. Only course treating RL *as robot learning* (IL→RL→offline arc), Levine. HWs single-GPU. **STUDY selected lectures:** Lec 2 (IL), 4–6 (PG/AC), 7–8 (Q-learning), 15–16 (offline RL), model-based overview. ~2 weeks part-time. (CS234 W2026 and CS224R acceptable substitutes.)
- **David Silver UCL (2015)** — **SKIP** (pre-deep-RL practice; subsumed).

**The modern path:** Spinning Up essays (1 day) → S&B Ch 3–6 + CS285 PG/AC/Q lectures → **CleanRL `ppo.py` + "37 Implementation Details" → reimplement PPO from scratch** (CartPole → MuJoCo Hopper) → **reimplement SAC** (HalfCheetah) → GPU-parallel: **MuJoCo Playground Colabs** (locomotion) + **ManiSkill3 PPO** (manipulation) → sim-to-real module → RL×VLA reading module. ~5–6 weeks to research literacy.

## 2. Implementation-first resources

- **CleanRL** [fetched, 10.3k★ active]: single-file benchmarked PPO/SAC/DQN/TD3; the style modern robotics baselines copy (ManiSkill's PPO is "adapted from CleanRL"). **STUDY — the primary implementation textbook.**
- **"The 37 Implementation Details of PPO"** (ICLR Blog 2022) [search-verified] — **STUDY** alongside the from-scratch exercise; the document that makes a PPO actually train.
- **HF Deep RL Course** [fetched]: "low-maintenance state"; Units 1–4 fine as optional motivational on-ramp. **SKIM.**
- **SBX (SB3+JAX)** [fetched]: SAC/TQC/CrossQ from SB3's author — known-good fast baselines for sanity checks. **SKIM.**

## 3. Core libraries (versions via PyPI API 2026-08-21)

| Library | Version | Verdict |
|---|---|---|
| **Gymnasium** | 1.3.0 (Apr 2026) | The env API standard. **STUDY/use.** |
| Gymnasium-Robotics | 1.4.2 | Fetch/Shadow/Adroit/Kitchen; goal-conditioned/HER concepts. **SKIM (one HER exercise max).** |
| **Stable-Baselines3** | 2.9.0 (Jun 2026) | Still the standard reliable baseline library. **SKIM — baseline oracle, never the learning vehicle.** |
| TorchRL | 0.13.3 | **SKIP** (abstraction-heavy). |
| **RSL-RL** | 5.4.2 (Jul 2026) | ETH robotics-first PPO + student–teacher distillation; the trainer inside Isaac Lab/mjlab/Playground. **STUDY (read its PPO + distillation once).** |
| skrl | 2.1.0 | SKIP. |
| Brax | 0.14.2 | Background (Playground calls its PPO/SAC). SKIM. |

Center of gravity moved from "Gymnasium env + SB3" to "GPU-parallel sim + rsl_rl/brax-PPO/CleanRL-style code."

## 4. Massively-parallel sim RL — the 2026 stack

- **MuJoCo 3.12.0 (2026-08-20)**, monthly cadence [fetched]. **MuJoCo Warp GA** (`pip install mujoco-warp`, versioned with MuJoCo) [fetched] — NVIDIA-GPU-only for speed, batch ray-tracing renderer, "tentpole of Newton". MJX (JAX) routes to Warp; pure-JAX MJX remains for TPU/differentiability.
- **Newton 1.5.0 (2026-08-11)** [fetched] — Disney+DeepMind+NVIDIA, Linux Foundation, Apache-2.0; MJWarp primary solver; consumer NVIDIA GPUs supported; the engine inside Isaac Lab 3.0.
- **MuJoCo Playground — the pick for GPU-parallel RL learning** [fetched]: DeepMind (+Zakka et al., arXiv:2502.08844); **v0.2.0 (2026-03-16) made Warp the default backend**; ~50+ envs (DM Control, Go1/Spot quadrupeds, G1/H1 humanoids, LEAP hand, Franka, ALOHA), vision envs via Madrona/Warp batch renderer; **five Colabs verified** incl. locomotion + manipulation. Locomotion policies train in **minutes on one consumer GPU** (4090 ideal, 3090 fine, 4070 workable state-based). Proven sim-to-real (Go1, LEAP, humanoids). **STUDY — primary GPU-parallel platform.**
- **mjlab (2026)** [fetched]: Zakka/Liao/Yi et al., arXiv:2601.22074 — **Isaac Lab's manager-based env API directly on MuJoCo Warp**; rsl_rl trainer; G1 velocity/motion-imitation tasks; `uvx --from mjlab demo`. **STUDY (second half)** — teaches Isaac-Lab abstractions without Isaac Sim's install weight; use for "build your own locomotion env".
- **Isaac Lab** [fetched]: stable **2.3.2** (Feb 2026, Isaac Sim 5.x); **3.0.0-beta2 (Jun 2026)** on Isaac Sim 6.0 with **multi-backend physics (PhysX + Newton)**, kit-less execution. Hardware: min **16 GB VRAM** (better than RTX 3070), 32 GB RAM; 4070 = documented OOM reports. **SKIM for a 4090 learner** — one late week (ANYmal/G1 velocity tutorial) for industry familiarity; **don't build the curriculum's RL core on a platform mid-breaking-transition**. On 12 GB: skip; mjlab is the API-compatible stand-in.
- **ManiSkill3 — the pick for manipulation + vision RL** [fetched]: UCSD Hao Su Lab; RSS 2025 (arXiv:2410.00425); stable 3.0.1 (Apr 2026); fastest GPU-parallel sim+**rendering** (30k+ FPS on a 4090, 2–3× lower VRAM than rivals); tuned baselines PPO/SAC/TD-MPC2 + BC/DP/VLAs. **Verified from PPO README: PushCube state PPO <1 min; PickCube 2–5 min; vision PickCube 15–45 min — single GPU.** Code single-file, adapted from CleanRL. **STUDY** — smoothest bridge from own CleanRL PPO to GPU-parallel training.
- **Genesis → Genesis World** [fetched]: company-backed (Genesis AI), `genesis-world` 1.3.3 (Aug 2026), 29.8k★, multi-solver, CUDA/ROCm/Metal. Delivered as an engine but thin benchmarks/baselines/sim2real recipes vs MuJoCo/ManiSkill/Isaac. **SKIM (half-day awareness); do not build on it.**

**Which ONE:** GPU-parallel platform = **MuJoCo Playground** (+ ManiSkill3 as manipulation/vision complement). From-scratch substrate = **plain Gymnasium + MuJoCo (CPU)** — from-scratch PPO/SAC must be debuggable without JAX/Warp machinery; then port the same PPO to ManiSkill3's vectorized API to learn the GPU-parallel deltas.

## 5. Sim-to-real in 2026

**Best practice:** massive parallelism + **domain randomization** (mass/friction/latency/motor params + obs noise) + **teacher–student distillation** (privileged teacher → student, rsl_rl) + actuator modeling + delay modeling + **sim2sim validation** (train in Warp/Isaac → replay in vanilla CPU MuJoCo) + ONNX export. DR-parameter search via LLMs (DrEureka) established. No single 2026 breakthrough — the 2021–24 recipe became push-button.

- **"The Reality Gap in Robotics"** — Annual Review of Control/Robotics/Auton. Systems (2026) [search-verified]. **STUDY — the modern best-practices survey.**
- **Tang et al., "Deep RL for Robotics: A Survey of Real-World Successes"** (Annual Reviews 2025; arXiv:2408.03539). **STUDY — the best "why RL for robots" read.**
- Da et al. sim2real survey (2502.13187) + AwesomeSim2Real repo [fetched]. SKIM.
- **Classic canon (still assigned in 2026):** Tobin DR (1703.06907); Peng dynamics rand. (1710.06537); **OpenAI ADR/Rubik's (1910.07113)**; Hwangbo Science Robotics 2019 (actuator nets); **Rudin "Learning to Walk in Minutes" (2109.11978 — created the massively-parallel recipe)**; Miki wild-ANYmal; DeXtreme (2210.13702). **STUDY Rudin + ADR pair, SKIM rest.**
- DrEureka [fetched] — SKIM paper, don't run (IsaacGym legacy).
- legged_gym [fetched] — migrated to Isaac Lab; SKIP (read DR/actuator-net paper parts).
- **unitree_rl_gym** [fetched]: Go2/G1/H1 with explicit **Train → Play → Sim2Sim (MuJoCo) → Sim2Real** pipeline — **the best hardware-free sim2real proxy** (sim2sim = the transfer discipline minus the robot). **STUDY as the no-hardware sim2real lab** (or replicate the sim2sim loop with mjlab/Playground policies).
- **LeRobot HIL-SERL** — real-robot RL (SAC + human interventions + learned reward classifier; Luo et al. 2410.21845); **sim variant (gym_hil) confirmed** [fetched docs dir] → teachable without hardware, drops onto a SO-101 later. **STUDY (sim variant).**

**Teachable without hardware:** DR ablations (train Go1 with/without friction+mass randomization, evaluate under perturbed sim2sim), teacher–student distillation, actuator-latency injection, ONNX export + CPU-MuJoCo replay, HIL-SERL in gym_hil. **Not teachable:** real deployment debugging — flag as the known gap.

## 6. RL × VLA (2025–26) — the frontier module

Two families: (i) simulator-scale online RL on open VLAs (GRPO/PPO/RLOO on OpenVLA-OFT/π0 in LIBERO/ManiSkill), (ii) real-world experience-driven RL (RECAP, HIL-SERL). Open implementations are multi-A100 for 7B models; on one 4090 = paper study + code reading + evaluating released checkpoints.

- **SimpleVLA-RL** — ICLR 2026, PRIME-RL [fetched]; arXiv:2509.09674. veRL GRPO-style RL on OpenVLA-OFT; LIBERO-Long 97.6 SOTA; 1-demo cold start 17→92. **Hardware: 8×A800-80GB min.** **STUDY paper + code-walk; SKIP running.** The canonical teaching paper.
- **π*0.6 + RECAP** (Nov 2025; arXiv:2511.14759) — advantage-conditioned policies on demos + corrections + autonomous experience; 2× throughput, ½ failures over multi-hour runs. Closed. **STUDY (reading)** — clearest statement of why value learning matters for VLAs.
- **πRL** (arXiv:2510.25889) in **RLinf** [fetched, 4.6k★]: first open online-RL for *flow-based* VLAs (Flow-Noise/Flow-SDE PPO/GRPO); LIBERO π0.5 43.9→94.0. Cluster-scale. **SKIM RLinf; STUDY πRL's two-layer-MDP formulation** (best pedagogy on "RL through a flow head").
- **RIPT-VLA** (NeurIPS 2025) [fetched]: RLOO sparse-reward post-training; works on lightweight QueST — **the most 4090-plausible hands-on**; SKIM, optional stretch lab.
- **GRAPE** (ICRA 2026) [fetched]: trajectory-wise preference optimization (DPO-family). SKIM.
- **RL4VLA** ("What Can RL Bring to VLA Generalization?", 2505.19789) [fetched]: PPO > GRPO/DPO for VLA generalization. **STUDY the paper (the module's controlled experiment); SKIP running.**

**Verdict:** a 3–5 day reading + code-walk module (SimpleVLA-RL + RECAP + πRL + RL4VLA) is mandatory for a 2026 embodied researcher; hands-on = LIBERO evaluation of released RL-tuned checkpoints, or RIPT-VLA-on-QueST as ambitious capstone. The concepts (sparse rewards, RLOO/GRPO vs PPO, value filtering, advantage conditioning) are pre-taught by the PPO/SAC/IQL spine — the argument for that spine.

## 7. Offline RL in 2026

Demoted as curriculum material — absorbed into VLA post-training (RECAP is advantage-conditioned offline-style RL; Cal-QL/WSRL-style offline-to-online boots real-robot RL). D4RL legacy; successors **Minari** (Farama) and **OGBench** (ICLR 2025) [fetched: 85 GCRL datasets, JAX reference impls, single-GPU runs].
- **CORL** [fetched, active fork]: single-file IQL/CQL/TD3+BC/Cal-QL. **STUDY exactly one file: `iql.py`** (IQL = the algorithm that survived into VLA-land: expectile value learning + AWR extraction).
- CQL: SKIM historical. **Flow Q-Learning** (2502.02538): SKIM — the modern "RL over flow policies" bridge.
- **Budget: 2–3 days**, framed as "offline RL = the value-learning half of VLA post-training," right before the RL×VLA module.

## (a) Minimal RL spine

**Concepts:** MDPs/returns; policy vs value; TD vs MC; deadly-triad intuition; policy-gradient theorem + variance reduction + **GAE**; actor-critic; **PPO** (clipping, advantage norm, vectorized rollouts); max-entropy RL + **SAC**; exploration basics; goal-conditioning/HER (concept); **DR + teacher–student distillation**; offline core (**IQL**); RL-as-post-training (RLOO/GRPO vs PPO, sparse success rewards, value filtering). NOT required: convergence proofs, regret bounds, bandits beyond intuition.

**Primary:** CS 185/285 Spring 2026 selected lectures + CleanRL + "37 Details" + S&B Ch 3–6 as reference.

**From-scratch implementations:**
1. **PPO** (must be built end-to-end): CartPole → MuJoCo Hopper/HalfCheetah; validate against CleanRL curves; **then port to ManiSkill3 PushCube with 2048 parallel envs (trains <1 min when correct — brutal fast correctness oracle).**
2. **SAC**: HalfCheetah/Walker2d; compare sample-efficiency vs PPO; sanity-check against SBX.
3. (compressed) **IQL** — implement the two losses in CORL's skeleton on one dataset, or guided code-walk.
   (DQN optional 1-day warm-up; skip Atari.)

## (b) GPU-parallel robotics RL exercise (tutorial-verified)

**Primary: MuJoCo Playground locomotion Colab** (`learning/notebooks/locomotion.ipynb` [fetched, exists]) — train **Unitree Go1 joystick policy (PPO, thousands of parallel Warp envs) in minutes** on a 4090 (or free Colab), incl. built-in DR configs; repeat for G1 humanoid; inspect reward/DR terms. **Companion: ManiSkill3 PPO** — state PickCube (2–5 min) then RGB PickCube (15–45 min). **Stretch:** rebuild the Go1 velocity task in **mjlab** (manager-based API) to learn Isaac-Lab-style env authoring; optional 1-week Isaac Lab pass only if ≥16 GB VRAM.

## (c) SKIP list (classic RL curricula content, low value here)

Full S&B coverage (bandits, eligibility traces beyond GAE intuition, Dyna, average-reward); tabular-theory tracks (convergence proofs, regret, LSTD, Silver course); DQN-lineage archaeology (Atari-57, Rainbow, distributional RL); **TRPO** (one paragraph on why PPO replaced it); evolutionary/MARL/AlphaZero-MCTS; Spinning Up codebase; pre-Gymnasium Gym; Isaac Gym Preview/legged_gym as build targets; exhaustive offline-RL zoo; meta-RL/exploration deep dives (MAML/RL², curiosity); RLHF/LLM-RL implementation detail; model-based RL *implementations* (SKIM TD-MPC2/DreamerV3 conceptually — building them costs weeks the sim2real and VLA modules need more).
