# Research Report — Imitation Learning, LeRobot & Robot Datasets (2026-08-21)

> Produced by a dedicated research agent with live verification 2026-08-21. **[V]** = fetched directly (github.com/raw.githubusercontent.com); **[S]** = corroborated by multiple independent search results today (huggingface.co/arxiv.org/project pages blocked by sandbox proxy, not dead).

## 1. LeRobot — still THE entry ecosystem, now much bigger

- Repo: https://github.com/huggingface/lerobot [V] — 26.8k★. Docs: https://huggingface.co/docs/lerobot/index [S; pointer verified in README].
- **Version: v0.6.1 (Aug 2026) latest**; v0.6.0 (2026-07-06) was the big one; main at 0.6.2-dev [V pyproject].
- **Peer-reviewed:** "LeRobot: An Open-Source Library for End-to-End Robot Learning," Cadene et al., **ICLR 2026** — arXiv 2602.22818 [S].
- **2026 changes** (releases [V] + coverage [S]):
  - v0.4–0.5: X-VLA, SARM reward model, Wall-X, OpenArm/Unitree G1 support, streaming video encoding, async inference, **PEFT/LoRA training**, phone teleop.
  - **v0.6.0 "Imagine / Evaluate / Improve"** (Jul 2026): world-model policies **VLA-JEPA, FastWAM, LingBot-VA**; VLAs EO-1, EVO1, MolmoAct2; **GR00T N1.5→N1.7**; reward models (SARM, Robometer, TOPreward); **six new sim benchmarks under `lerobot-eval`** (RoboCasa365, RoboTwin 2.0, RoboCerebra, RoboMME, LIBERO-plus, VLABench); **`lerobot-rollout` CLI with human-correction strategies (`base`/`sentry`/`dagger`)**; FSDP; modular installs; PyTorch ≥2.7; 2× faster dataloader; depth support.
  - **NVIDIA partnership (Jul 2026):** GR00T N1.7 GA inside LeRobot (`--policy.type=groot`), Isaac Teleop (`examples/isaac_teleop_to_so101/` [V]), Cosmos 3 integration planned.
- **Policies** [V README + toctree]: IL: **ACT, Diffusion Policy, VQ-BeT, Multitask DiT**; RL: HIL-SERL, TDMPC, gaussian_actor; VLAs: **Pi0, Pi0-FAST, Pi0.5, SmolVLA, GR00T N1.7, X-VLA, EO-1, EVO1, MolmoAct2, WALL-OSS**; world-model policies; reward models.
- **Sim envs registered** [V envs/configs.py]: `pusht`, `aloha`, `libero`, `libero_plus`, `metaworld`, `robocasa`, `robotwin`, `robomme`, `vlabench`, `isaaclab_arena`, `gym_manipulator` (HIL-SERL) + **EnvHub** (community sims from Hub) + **LeIsaac** (SO-101 in Isaac Lab, teleop-in-sim) [V docs].
- **LeRobotDataset v3.0** [V docs]: chunked parquet + MP4, memory-mapped, **streaming from Hub**; porting guide's worked example is DROID (1.7TB RLDS → ~400GB LeRobot v3, streamable).
- Official Colabs [V huggingface/notebooks]: `training-act.ipynb` (~1.5 h/100k steps on A100 @ bs64), `training-smolvla.ipynb` (~5 h/20k steps).
- **Verdict: STUDY — the ecosystem backbone of the whole curriculum.**

## 2. Cheap hardware path (optional)

| Item | Status Aug 2026 | Verdict |
|---|---|---|
| **SO-101 / SO-ARM101** — https://github.com/TheRobotStudio/SO-ARM100 [V] 7.1k★ | **The 2026 recommended starter arm — no successor exists** (SO-100 deprecated in-repo; no SO-102 found). BOM ≈ **$230 leader+follower pair**; kits: Seeed $220–240, WowRobo, PartaBot. Native LeRobot; sim twins: LeIsaac + MuJoCo Menagerie `trs_so_arm100` [V] | SKIM now, STUDY if buying |
| **LeKiwi** [V] 1.4k★ | SO-101 + 3-omniwheel holonomic base + RasPi 5; +$150–250; driver upstream in LeRobot | SKIM (mobile-manip extension) |
| **Reachy Mini** (Pollen/HF) | Shipping; $299 Lite / $449 Wireless; expressive desktop robot, **no manipulator** | SKIP for manipulation |
| ALOHA bimanual | ~$20k research rig | SKIP as purchase; lineage matters |

**Recommendation:** sim-only through the spine; if hardware later, **SO-101 follower+leader (~$230–280 all-in)** — the entire LeRobot tutorial stack is written against it.

## 3. ACT + ALOHA lineage

- Paper: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware" (ALOHA + **ACT**), Zhao, Kumar, Levine, Finn — RSS 2023, arXiv 2304.13705.
- Code: https://github.com/tonyzhaozh/act [V] 2.2k★ MIT — includes **MuJoCo sim tasks (TransferCube, BimanualInsertion) with scripted-demo generation** + "ACT tuning tips". Successor: act-plus-plus [V] 3.7k★ (Mobile ALOHA: ACT + Diffusion + VINN).
- In LeRobot: `--policy.type=act`, docs page, official Colab, `gym-aloha` [V].
- Pedagogy: **the standard "first real IL policy"** — CVAE + transformer predicting **action chunks**; motivates everything after (chunking → diffusion/flow heads → real-time chunking, itself a LeRobot inference mode). Trains ALOHA-sim in hours on 8–12GB VRAM.
- **Verdict: STUDY** (paper + LeRobot implementation; skim original code).

## 4. Diffusion Policy + successors — the 2026 "first policy class from scratch"

- **Canonical:** Chi et al., RSS 2023 → IJRR. https://github.com/real-stanford/diffusion_policy [V] 4.5k★ — includes **PushT** + official Colabs (state-based & vision). In LeRobot: `--policy.type=diffusion`.
- **3D Diffusion Policy (DP3)** [V] — RSS 2024; point clouds; documented **~10GB VRAM, ~3 h/task**; SKIM (STUDY if 3D obs).
- **Equivariant DP** [V] — CoRL 2024 oral; SKIM.
- **Flow matching (the 2025–26 shift):** π0/π0.5 flow action experts; FlowPolicy (AAAI 2025) [V]; Streaming Flow Policy (2505.21851); 2026: CoLA-Flow, EfficientFlow [S]. Consensus: DP-level quality with 1-few-step inference and simpler training.
- **2026 recommendation: still Diffusion Policy on PushT as the first from-scratch policy class** — official repo/Colabs built for it; LeRobot's minimal training example is DP-on-PushT (`examples/training/train_policy.py` [V]); **flow matching is then a ~50-line delta (swap DDPM loss for rectified-flow loss) — assign as the follow-up exercise.** PushT DP trains on 8GB VRAM in hours.
- **Verdict: STUDY (implement from scratch) → STUDY flow-matching delta; DP3/EquiDiff SKIM.**

## 5. BC + DAgger — best modern treatments

1. **Berkeley CS285 Spring 2026 is live** — homework org [V]: `homework_spring2026` (updated May 2026), **HW1 = Imitation Learning (BC + DAgger, MuJoCo)**. Lecture 2 "Supervised Learning of Behaviors" = canonical distribution-shift/DAgger treatment. **STUDY — spine item #1.**
2. **DAgger paper:** Ross, Gordon, Bagnell, AISTATS 2011, arXiv 1011.0686. **STUDY** (short).
3. **Hugging Face Robotics Course** — https://huggingface.co/learn/robotics-course [S]; repo [V]: Units 0–2 out; **Unit 5 RL / Unit 6 IL / Unit 7 Foundation Models "coming soon"** — track it. Built on **"Robot Learning: A Tutorial"** (LeRobot team, late 2025; HF Space `lerobot/robot-learning-tutorial` [S]) — **best single modern survey-with-code. STUDY.**
4. MIT 6.421 Tedrake Robotic Manipulation — BC/Diffusion-Policy chapter — SKIM as second perspective.
- LeRobot's own DAgger hook: `lerobot-rollout` correction strategies (`dagger` mode) [V] — teach interactive imitation concretely.

## 6. Robot datasets — solo-learner usability

| Dataset | Scale | Usability | Verdict |
|---|---|---|---|
| **PushT + LeRobot sim datasets** | ~200 demos, MBs–GBs, v3 | `LeRobotDataset("lerobot/pusht")`, streams — minutes to first batch | **STUDY** |
| **Open X-Embodiment** [V repo] | 1M+ trajectories, 22 embodiments, RLDS | single sub-datasets only; many exist as LeRobot Hub ports | SKIM (concept + one subset) |
| **DROID** [V repo] | 76k trajectories / 350h Franka; official LeRobot v3 port ≈ 400GB **streamable** | stream a slice; openpi's fine-tune target | SKIM |
| **AgiBot World** [V repo, 3.1k★] | Beta 1M trajectories / 43.8TB; LeRobot format; AgiBot World 2026 phased release began | stream small slices | SKIM |
| **RoboMIND V2.0** [V] | 107k trajectories, 479 tasks, 4 embodiments; Apache 2.0 | per-embodiment splits; registration | SKIM |
| **2026: EgoVerse** (arXiv 2604.07607; 1,362h/80k episodes human demos), **Egocentric-1M** (~1M h egocentric) [S] | human egocentric | reading material | SKIM (awareness) |

**Ruling:** data diet = LeRobot Hub sim datasets (PushT/ALOHA/LIBERO) months 1–4; one DROID/OXE streamed slice for the "large-data" module; rest is reading.

## 7. Learning from human video (2026)

- **LAPA** (ICLR 2025) [V]: VQ-VAE latent actions from actionless video → VLA pretraining; 30× cheaper; released model 7B (fine-tune needs 4×A100). **STUDY idea, SKIP running.**
- **Moto** (ICCV 2025 oral) [V]: SKIM.
- **UniVLA** (RSS 2025, OpenDriveLab) [V] 1.1k★: task-centric latent actions; 95.2% LIBERO; pretraining ≈960 A100-h (5% of OpenVLA's). **The teachable latent-action paper — STUDY (read + inspect code).**
- **EgoDex** (Apple 2025) [V]: 829h Vision-Pro egocentric + 3D hand pose, 194 tasks; **16GB test split is a feasible course asset.** SKIM.
- Ego4D/Ego-Exo4D [V]: SKIM (context).
- 2026 state: latent-action absorbed into production VLAs (GR00T trains on latent actions from human video + DreamGen synthetic); LeRobot v0.6 world-model policies are the ecosystem expression. **Teachable core: LAPA → UniVLA → DreamGen concept; one lecture-week, no training runs.**

## 8. Teleoperation & data collection

- **LeRobot-native (default to teach):** leader-follower teleop, keyboard/gamepad, phone teleop [V examples], **Isaac Teleop → sim SO-101** [V], full record→visualize→train loop with **HIL correction rollouts (base/sentry/dagger)** [V]. **STUDY (concepts; LeIsaac allows teleop of a simulated SO-101 with no hardware).**
- **GELLO** (ICRA 2024) [V]: ~$300 printed kinematic-twin controllers. SKIM.
- **UMI** (RSS 2024) [V] 1.6k★: handheld GoPro gripper → in-the-wild demos → DP. **SKIM/STUDY-paper — the "data collection without a robot" concept.**

## 9. Synthetic data generation

- **MimicGen** (CoRL 2023) [V]: 10 human demos → 1000s via segment-transform-replay; 48k demo release. **STUDY (core idea; runnable).**
- **DexMimicGen** (ICRA 2025) [V]: bimanual/dexterous extension. SKIM.
- **RoboCasa → RoboCasa365** (RSS 2024 → **ICLR 2026**) [V] 1.7k★: 365 tasks, 2,500+ scenes, 2,200+ h generated demos; **a LeRobot v0.6 benchmark env.** SKIM (use through lerobot-eval).
- **GR00T-Dreams / DreamGen** [V]: Cosmos world model → synthetic robot video → IDM actions → policy fine-tune ("neural trajectories"); 14B video model = not solo-GPU. **STUDY concept, SKIP running.**
- Framing: two families — **geometric replay** (MimicGen line: cheap, sim) vs **generative world-model** (DreamGen/Cosmos line: expensive, real-transfer).

## 10. Other 2026 developments

- **openpi** [V] 13.4k★: π0/π0.5 open; PyTorch impl; **inference >8GB; LoRA fine-tune >22.5GB (RTX 4090); full >70GB**. STUDY-paper / run-if-24GB.
- **GR00T N1.7** [V]: GA, LeRobot policy type; inference 16GB+, fine-tune 40GB+ ⇒ cloud.
- **SmolVLA (450M)** — the consumer-GPU VLA; community fine-tunes on 16GB and Colab-free; official Colab [V]. **STUDY — the learner's first VLA fine-tune.**
- **Real-Time Chunking (RTC)** now standard LeRobot inference tooling [V].
- v0.6's "Imagine/Evaluate/Improve" signals the field's turn from pure BC toward **evaluate-correct-retrain loops**.
- **LIBERO** [V] 2.2k★ remains the default VLA benchmark; LIBERO-plus (robustness) added in LeRobot.

## (a) Minimal canonical IL spine (ordered)

1. **BC + DAgger:** CS285 Lecture 2 + Spring-2026 HW1 (implement BC and DAgger, MuJoCo); read Ross et al. 2011.
2. **ACT:** read 2304.13705; train `--policy.type=act` on `aloha` sim or official Colab. Understand chunking + CVAE.
3. **Diffusion Policy:** read paper; run official Colab; **implement the DDPM action head from scratch on PushT state-obs**; check against LeRobot's.
4. **Flow-matching delta:** convert your DP to rectified-flow training (refs: FlowPolicy, π0's action expert).
5. **Dataset + ecosystem fluency:** "Robot Learning: A Tutorial" + LeRobotDataset v3 docs; record/edit/port a dataset.
6. **VLA fine-tuning:** SmolVLA fine-tune (official notebook) → `lerobot-eval` on LIBERO; stretch: π0.5-LoRA (24GB).

## (b) First end-to-end sim policy training (verified on current main)

**LeRobot official minimal example — train Diffusion Policy on `lerobot/pusht`, evaluate in gym-pusht:**
- `examples/training/train_policy.py` [V] — DiffusionPolicy on lerobot/pusht, 5k steps, cuda.
- `pusht` env registered [V]; `pip install "lerobot[pusht]"`; env repo gym-pusht [V].
- Eval: `lerobot-eval --policy.path=<ckpt> --env.type=pusht --eval.n_episodes=50` [V README].
- **MuJoCo-free (pymunk 2D), trains on any ≥8GB GPU in ~1–4 h** (5k-step demo well under an hour).
- Second milestone: `--env.type=aloha` ACT training; then LIBERO eval of pretrained π0/SmolVLA.

## (c) Controlled comparison BC vs ACT vs Diffusion Policy — one GPU

**Task: PushT** — the field's canonical policy-class discriminator (multimodal demos punish mean-regression BC); the only benchmark where all three policies + dataset + eval env are first-class in current LeRobot.
- Arm 1 — BC baseline: learner-implemented MLP (+optional GMM head) on state obs (CS285 HW1 skill transfers).
- Arm 2 — ACT: `lerobot-train --policy.type=act --dataset.repo_id=lerobot/pusht --env.type=pusht`.
- Arm 3 — Diffusion: `--policy.type=diffusion`. Optional Arm 4: `--policy.type=vqbet` (designed on PushT).
- Protocol: identical obs (state first, then pixels), **3 seeds × 50 eval episodes**, report success rate + coverage reward; ablate chunk size.
- Budget: each run 8–16GB VRAM, ~1–4 h on RTX 3060/4060-class ⇒ full grid in a weekend.
- Upgrades: ALOHA TransferCube (bimanual, ACT's home turf) or LIBERO-10 (language-conditioned multi-task).

**Bottom line:** LeRobot v0.6.1 (ICLR 2026) is the single recommended ecosystem; sim-first path (PushT → ALOHA-sim → LIBERO → LeIsaac/RoboCasa365) fully intact on one consumer GPU; SO-101 still the starter arm; DP-from-scratch (then flow refactor) the right first implementation; 2026-specific additions: LeRobotDataset v3 streaming, evaluate-correct-improve workflows, world-model policies, egocentric mega-datasets.
