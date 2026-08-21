# Research Report — Benchmarks & Solo-Learner Compute Feasibility (2026-08-21)

> Produced by a dedicated research agent with live verification 2026-08-21. `[V]` = fetched directly; `[S]` = search-corroborated (domain proxy-blocked); `[E]` = estimate derived from verified numbers; `[U]` = could not verify today (flagged).

## PART A — Benchmark / evaluation landscape (Aug 2026)

- **LIBERO** [V]: original repo dormant (last commit Mar 2025; pins torch 1.11 — unrunnable as-is; everyone uses ports). **How it's used in 2026:** LeRobot native env (`--env.type=libero`, protocol 400 episodes = 10/task × 40) + repackaged `lerobot/libero` dataset (**1.9 GB** video-encoded); openpi ships `pi05_libero`; OFT evaluates 500 trials/suite. **Known issues:** near-saturation (SOTA >95–97%; LeRobot reproduces π0.5 at 97.5%) and robustness audits showing collapse to <30% under perturbations — **LIBERO-PRO** (2510.03827), **LIBERO-Plus** (2510.13626, **CVPR 2026**, in LeRobot), **LIBERO-X** (2602.06556) [S]. Verdict: still the standard cheap VLA fine-tune/eval loop, but serious 2026 work reports LIBERO+robustness-variant or adds RoboTwin/RoboCasa/real eval.
- **SimplerEnv** [V]: alive but frozen (last commit Dec 2025); ManiSkill3 integration runs 10–15× faster; still standard zero-shot sim eval (GR00T N1.7 supports it).
- **RoboCasa → RoboCasa365** [V]: v1.0 (Feb 2026) — 365 tasks, 2,500+ scenes, 2,200+ h demos; conda + MuJoCo backend, assets ~10 GB; any candidate GPU fine.
- **ManiSkill3** [V]: RSS 2025; active; "30,000+ FPS on a 4090"; **PPO baselines: PushCube state <1 min; PickCube state 2–5 min; PickCube RGB 15–45 min; visual configs <15 GB VRAM.**
- **Meta-World** [V]: Farama-maintained; v3.1.1 (Jun 2026) pins `mujoco==3.3.0` (contact-representation gotcha vs current 3.12); ML/MT suites; the standard multi-task/meta-RL manipulation suite.
- **CALVIN** [V]: frozen (commits are README paper-list updates); legacy — read results tables only.
- **RoboArena** [S]: CoRL 2025; double-blind pairwise real-world eval on DROID platforms; **active in 2026** (data dump Feb 2026, leaderboard). Follow-on: **RoboWorld** (2607.01060) replicates the benchmark in neural simulators.
- **ALOHA sim + PushT** [V]: gym-aloha (TransferCube/Insertion) + gym-pusht — alive, canonical, first-class in LeRobot.
- **DM Control** [V]: v1.0.45 (2026-08-20) same-day cadence with MuJoCo 3.12; Gymnasium 1.3.0.
- **BEHAVIOR-1K / Challenge 2026** [V/S]: live and heavy — 50 long-horizon mobile-manip tasks, 1,200 h demos; demo release **3.27 TB**; requires Isaac Sim stack (RTX 2070+/8 GB min, 32 GB RAM).
- **New 2026:** **RoboTwin 2.0** (ICML 2026; 50 bimanual tasks, 5 embodiments, strong DR — de-facto bimanual benchmark) [S]; LIBERO robustness variants; ATOM-Bench, UMI-Bench 1.0, RoboWorld, RoCo Challenge @ AAAI 2026 [S].

### Evaluation methodology (the field grew up)
- **Rollout-count math** (NVIDIA blog 2026): at 90% observed success, **70 rollouts → 95% CI spans 15.4 pp; 1,030 rollouts → ±2 pp**. Typical 20–30 real trials are underpowered for comparisons [S].
- **TRI/Princeton "STEP"** sequential testing + TRI guidance: pre-registered success criteria, randomized interleaved A/B, evaluator-blind, identical initial-condition distributions [S].
- Practical solo rule: report CIs, ≥50 rollouts/suite in sim (cheap), never claim a 5-pp gap from 20 rollouts.

## PART B — Compute feasibility (documented)

**Primary source: LeRobot "Compute HW Guide"** [V, quoted]:

| Policy group | Policies | Peak VRAM (BS 8) | Starter GPUs |
|---|---|---|---|
| Light BC | act, vqbet, tdmpc | **~2–6 GB** | laptop 3060, L4 |
| Diffusion | diffusion, multi_task_dit | **~8–14 GB** | RTX 4070+ |
| Small VLA | smolvla | **~10–16 GB** | RTX 4080+ |
| Large VLA | pi0, pi0_fast, pi05, xvla, wall_x | **~24–40 GB** | A100 40 GB+ ("24 GB tight at BS 1") |
| Multimodal | groot, eo1 | **~24–40 GB** | A100 40 GB+ |

Wall-clock anchors (5 epochs, ~50-episode dataset): ACT **~30–60 min on 4090**; diffusion **~2–4 h on 4090**; smolvla ~3–6 h on L4 (1–2 h A100); pi0/pi05 ~4–8 h on A100-40. "Robotics IL typically converges in 5–10 epochs."

1. **ACT on ALOHA sim:** 2–6 GB; ~30–60 min on 4090 (third-party: ~30 min on 3060) [V/S]. Any 12 GB GPU comfortable.
2. **Diffusion Policy on PushT:** 8–14 GB at BS8; ~2–4 h on 4090; grad-checkpointing in LeRobot v0.6.1; fits 12 GB at reduced batch [V/E].
3. **SmolVLA fine-tune:** "20k steps ≈ **~4 h on a single A100**" [V docs]; 10–16 GB at BS8 → fits 16 GB; fits 12 GB at BS≤4 + frozen vision encoder [V/E]. Official PEFT/LoRA in LeRobot.
4. **OpenVLA-7B LoRA:** documented **≥ ~27 GB**; BS16 config ~72 GB; full FT = 8×A100 [V]. **OFT:** LIBERO BS8/GPU ≈ 62 GB, BS1 ≈ **25 GB**; inference ~16 GB; LIBERO RLDS ~10 GB [V]. → **Does not fit 24 GB officially**; needs ≥32 GB (5090) or cloud A100.
5. **π0/π0.5 via openpi** [V]: **inference >8 GB (4090 example); LoRA fine-tune >22.5 GB (4090 example); full FT >70 GB.** LoRA configs exist for π0/π0-FAST; **no LoRA config for π0.5 in openpi** (they report LoRA-for-DROID underperformed); LeRobot's π0.5 path: LIBERO recipe sized for one 80 GB GPU + **PEFT/LoRA supported in LeRobot**. Full π0.5-DROID FT = "~2 days on 8×H100" [V].
6. **GR00T N1.7** [V]: fine-tune "1 GPU 40 GB+ (H100/L40 recommended)", default tune (projector+action head) peaks **<~35 GB**; **inference 16 GB+ (4090)**; BS1–2 on 24 GB marginal-but-plausible via LeRobot [V/E].
7. **LIBERO eval of a VLA:** VRAM ~8–16 GB; wall-clock undocumented; est. **~2–6 h for 400-episode protocol on one 24 GB GPU** [E]. Budget eval like a training run.
8. **PPO/SAC on Gymnasium-MuJoCo: trivial** — minutes-to-1 h on any hardware.
9. **Massively-parallel RL on ONE consumer GPU (documented, spectacular):** MuJoCo Playground notebooks verbatim — quadruped joystick "**7 minutes on an RTX 4090**"; handstand 8 min; **Berkeley Humanoid 17 min**; **PickCube ~3 min**; non-prehensile 33 min [V]. Isaac Lab: **16 GB+ VRAM, 32 GB RAM, Ubuntu 22.04/Win 11** floor; Isaac Sim 5.1 min GPU = RTX 4080; A100/H100 can't render Isaac (no RT cores) [V/S]. 4090 first-class everywhere; 4070 below Isaac floor but fully served by MJX/ManiSkill.
10. **DreamerV3 / TD-MPC2:** TD-MPC2 "**≥8 GB GPU** for single-task online RL"; 317M model needs 24 GB [V]. DreamerV3: ~12 GB state / 24 GB vision; Crafter ~4–24 h on a modern GPU [S].
11. **Cloud pricing `[U]` (last-known, ±30–40%, re-check):** RunPod 4090 ~$0.69/h secure (~$0.35 community); A100-80 ~$1.2–1.7/h; H100 ~$2.4–3.0/h; Vast 3090 ~$0.15–0.25/h. **Cloud budget for heaviest exercises:** 12–16 GB local card → total ≈ **$130–300** (plan $300–500 with re-runs); 24 GB local → **≈ $80–200**.
12. **Storage (2 TB):** `lerobot/libero` 1.9 GB; OpenVLA LIBERO RLDS ~10 GB; own 50-ep dataset ~1–3 GB; DROID sample 1.6 GB; BridgeData V2 124 GB; Octo OXE mix ≈ 1.2 TB (pull subsets); **DROID full 1.8 TB — do not mirror**; BEHAVIOR demos 3.27 TB — exceeds drive. **2 TB comfortable (~300–500 GB working set) if full DROID/OXE/BEHAVIOR never mirrored locally.**

### PyTorch/CUDA/Blackwell + OS (Aug 2026)
- **PyTorch 2.13.0** (Jul 2026); wheels cu126/cu128/**cu130 default since 2.11**; Blackwell routine since 2.7. Gotchas: default wheels need **driver ≥580.65** (LeRobot documents floor); legacy repos pin ancient stacks (LIBERO torch 1.11!) — use LeRobot/ManiSkill ports; JAX stacks install own CUDA.
- **WSL2 viable for ~90% of the curriculum** (LeRobot officially supports WSL2; MuJoCo/MJX/ManiSkill/LIBERO/RL fine). **Isaac Sim/Lab: Ubuntu 22.04/24.04 or native Win 11 only — WSL2 not supported**; USB/camera passthrough friction for real robots. **Dual-boot Ubuntu strongly recommended the moment Isaac Lab / BEHAVIOR / a physical robot enters the plan.**

## VERDICT

**(a) Minimum viable GPU for the full curriculum incl. VLA fine-tuning:** **24 GB (used RTX 3090 or 4090)** — π0-LoRA needs >22.5 GB (openpi's own 4090 example); SmolVLA/diffusion/ACT all fit; GR00T inference 16 GB+; MJX/ManiSkill thrive. Remaining cloud gaps even at 24 GB: OpenVLA-OFT LoRA (≥25–27 GB) + all full fine-tunes (>70 GB). 16 GB tier: everything through SmolVLA local; billion-scale VLA fine-tunes → cloud. 12 GB tier: ACT/diffusion/RL/eval; SmolVLA at reduced batch; below Isaac floor.

**(b) Recommended GPU:** **RTX 4090 24 GB** (explicitly named by openpi, ManiSkill, Playground, GR00T-inference, LeRobot). Buying new + budget: **RTX 5090 32 GB** additionally clears OFT BS1 (~25 GB) and GR00T's <35 GB default fine-tune.

**(c) Must-go-to-cloud by tier:** 12 GB: OpenVLA LoRA, all π0/π0.5 fine-tunes, GR00T FT (~$150–400). 16 GB: same minus SmolVLA (~$130–300). 24 GB: only OFT LoRA + full FTs + multi-GPU repros (~$80–200). Skip-cloud fallback: SmolVLA + π0-LoRA paths, accept published baselines for the rest.

**(d) 3 heaviest exercises + reduced-scale alternatives:**
1. **Full π0.5-DROID fine-tune** (2 days × 8×H100 + 1.8 TB) → *alt:* π0-LoRA on a 50-episode LeRobot dataset on 24 GB; LeRobot π0.5-PEFT; 1.6 GB DROID sample.
2. **OpenVLA-OFT full LIBERO reproduction** (8×A100, 62 GB/GPU) → *alt:* LoRA BS1 (~25 GB) on one cloud A100 for ONE suite with 100–150 trials + CIs; or SmolVLA on `lerobot/libero` locally with the 400-episode protocol.
3. **GR00T N1.7 recommended-scale FT / BEHAVIOR-2026 training** (40 GB+ / 3.27 TB) → *alt:* GR00T via LeRobot BS1–2 on 24 GB or one rented A100 10–20 h; RoboCasa365 for long-horizon kitchen work.
