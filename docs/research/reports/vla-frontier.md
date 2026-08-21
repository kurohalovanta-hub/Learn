# Research Report — VLA / Generalist Robot Policy Frontier (2026-08-21)

> Produced by a dedicated research agent with live web verification on 2026-08-21.
> Verification legend: **[V-F]** = fetched directly today (github.com / GitHub API — the only hosts the sandbox egress proxy permits). **[V-S]** = confirmed via multiple independent live search results today; direct fetch blocked by sandbox egress policy (arxiv.org, huggingface.co, lab blogs), not dead links. **[MEM]** = pre-cutoff knowledge; re-check before external publication.

## 0. What changed in 2026 (headlines)

1. **π0.7** (Physical Intelligence, Apr 2026): "steerable generalist" trained with multimodal prompts (language, metadata, control modality, visual subgoals); emergent skill recombination, cross-robot generalization, matches RL-finetuned specialists out of the box. Closed weights. arXiv 2604.15483 [V-S].
2. **Gemini Robotics 2** (DeepMind, Jul 30 2026): whole-body control ("feet to fingertips"), three variants — GR-2 VLA, ER-2, On-Device-2 — demoed on Apptronik Apollo 2; early access only [V-S].
3. **GR00T N1.7** (NVIDIA, Apr 2026): current GA open-weights model, 3B, new Cosmos-Reason2-2B (Qwen3-VL-arch) backbone, relative EE actions over 40-step horizon [V-F].
4. **Generalist AI GEN-0 → GEN-1**: GEN-0 (Nov 2025, 10B+, 270k+ hrs dexterous data, "Harmonic Reasoning" think-and-act-concurrently architecture, first empirical robotics **scaling laws** incl. a ~7B "capability threshold"); GEN-1 (~Apr 2026) claims 99% success where SOTA gets 64%, 3× faster, 1 hr adaptation data. Closed. The field's loudest "GPT-moment" claim [V-S].
5. **MolmoAct2** (Ai2, May 2026, arXiv 2605.02881): fully open (weights + data + **OpenFAST** open tokenizer + MolmoER embodied-reasoning backbone); their real-robot eval places MolmoAct2 (0.51) > OpenVLA-OFT (0.36) > π0.5 (0.32) [V-S].
6. **RL-from-experience went mainstream**: π*0.6/RECAP (Nov 2025), ByteDance **GR-RL** (autonomous shoe-lacing, 83%), a wave of VLA-RL papers at ICLR 2026 [V-S].
7. **World-action models (WAM)** emerged as the counter-paradigm: NVIDIA "Pretrained to Imagine, Fine-Tuned to Act" blog, VLA-JEPA, Genie 3 lineage, LeCun's departure from Meta to found AMI Labs; open empirical question "Do WAMs generalize better than VLAs?" (arXiv 2603.22078) [V-S].
8. **Evaluation crisis is now explicit**: LIBERO saturated (multiple models ≥98%); Ai2 shipped **vla-evaluation-harness** ("any VLA on any sim benchmark", 551★, created Mar 2026, active today) [V-F]; RoboArena-style distributed real-world eval and VLA-REPLICA proposed [V-S].
9. **China's open-weights wave**: LingBot-VLA 4B (Ant/Robbyant, Mar 2026, 20k hrs) and **LingBot-VLA 2.0 6B** (Jul 8 2026, Apache-2.0); **Xiaomi-Robotics-0** (4.7B, Feb 2026, Apache-2.0, 98.7% LIBERO); **RDT2** (Tsinghua, Qwen2.5-VL-7B + Residual-VQ, zero-shot cross-embodiment from 10k hrs UMI human data); AgiBot **GO-2** (Apr 2026, async dual-system) [V-S/V-F].
10. **Whole-body VLAs**: Figure **Helix-02** (Jan/Feb 2026; single network for legs+torso+arms+fingers, "System 0" replacing 109k lines of locomotion C++; 8-hr autonomous logistics shifts in May 2026) — closed, no papers [V-S].

## 1. Physical Intelligence (the center of gravity)

| Model | Date | Paper | Open? |
|---|---|---|---|
| π0 | Oct 2024 | arXiv 2410.24164 [V-S] | **Yes** (openpi, Feb 2025) |
| FAST (π0-FAST) | Jan 2025 | arXiv 2501.09747 [V-S] | Yes (tokenizer + model) |
| π0.5 | Apr 2025 | arXiv 2504.16054 [V-S] | **Yes** (openpi, Sept 2025) |
| π*0.6 (RECAP) | Nov 17 2025 | arXiv 2511.14759 [V-S]; blog pi.website/blog/pistar06 [V-S] | No (model card only) |
| **π0.7** | **Apr 16 2026** | **arXiv 2604.15483** [V-S]; blog pi.website/blog/pi07 [V-S] | **No** |

- **openpi repo** — https://github.com/Physical-Intelligence/openpi [V-F]: **13.4k★**, Apache-2.0. Checkpoints: `pi0_base`, `pi0_fast_base`, `pi05_base` + finetuned (π0.5-LIBERO, π0.5-DROID w/ knowledge insulation, π0-ALOHA variants, DROID). JAX: full FT + **LoRA + FSDP**; PyTorch (added Sept 2025): full FT + DDP only (no LoRA/FSDP yet). **Documented VRAM: inference >8 GB; LoRA fine-tune >22.5 GB (fits one RTX 4090); full FT >70 GB (A100/H100)**. LeRobot datasets are the fine-tuning entry point. π0.6/π0.7 are NOT in openpi — open releases lag frontier by ~2 versions.
- Company: $600M Series B (late 2025) [V-S]. π*0.6's RECAP = RL with Experience & Corrections via Advantage-conditioned Policies: demos → teleop corrections → autonomous RL with a learned value function conditioning the policy on advantage; doubles throughput / halves failures on espresso, laundry, box assembly [V-S].
- **Pedagogy**: this lineage IS the curriculum spine (flow-matching action expert → co-training/hierarchy → RL-from-deployment → steerability). Prereqs: VLMs (PaliGemma), flow matching/diffusion, action chunking, then RL (advantage functions) for RECAP.
- **Verdicts**: π0 **STUDY**; π0.5 **STUDY** (capstone target); FAST **STUDY**; π*0.6 **STUDY paper-only**; π0.7 **SKIM**.

## 2. OpenVLA lineage — still the best code to read, no longer SOTA

- **OpenVLA** — arXiv 2406.09246 [V-S]; repo https://github.com/openvla/openvla [V-F]: 6.9k★, MIT code / Llama-2 license weights, 7B (DINOv2+SigLIP → Llama-2), trained on 970k OXE trajectories. Last real update **Mar 2025** (OFT announcement) — effectively frozen. LoRA FT documented at **27–72 GB** (above single consumer GPU).
- **OpenVLA-OFT** — arXiv 2502.19645; repo https://github.com/moojink/openvla-oft [V-F]: 1.3k★, MIT. Parallel decoding + action chunking + continuous L1-regression head: 26× faster generation, LIBERO SOTA-at-the-time; **inference ~16 GB; training 27–80 GB**. Still the standard *baseline* in 2026 papers [V-S].
- **MiniVLA** — https://github.com/Stanford-ILIAD/openvla-mini [V-F]: 375★, Qwen2.5-0.5B backbone, Residual-VQ action chunking; **dormant since Dec 2024**.
- **Is OpenVLA still canonical?** As a *readable reference implementation and ablation study*: yes — STUDY the paper + skim OFT. As the thing you *fine-tune*: **no — superseded by openpi (π0.5), SmolVLA, and GR00T N1.7**.
- **Verdicts**: OpenVLA **STUDY**; OpenVLA-OFT **SKIM**; MiniVLA **SKIP**.

## 3. NVIDIA GR00T

- **Timeline**: N1 (Mar 2025, arXiv 2503.14734 [V-S]) → N1.5 (Jun 2025) → N1.6 (Sept 2025; CES Jan 2026 showcase) → **N1.7 (Apr 2026, current GA)** [V-S/V-F].
- **Repo** https://github.com/NVIDIA/Isaac-GR00T [V-F]: **7.9k★**, Apache-2.0 code / NVIDIA Open Model License weights. `nvidia/GR00T-N1.7-3B` (~6 GB) + finetuned LIBERO/DROID/SimplerEnv checkpoints; backbone **Cosmos-Reason2-2B (Qwen3-VL arch)** + flow-matching DiT action head (dual-system); **inference 16 GB+ VRAM single GPU; finetuning rec. 40 GB+ (H100/L40)**; old versions on `n1d5`/`n1d6` branches.
- **GR00T-Dreams / DreamGen** — https://github.com/NVIDIA/GR00T-Dreams [V-F]: 599★; Cosmos world-model → synthetic robot video → IDM-extracted actions → finetune N1; DreamGenBench.
- **Verdicts**: GR00T N1 paper **STUDY**; Isaac-GR00T N1.7 repo **STUDY/USE**; Dreams/Mimic **SKIM**.

## 4. Google DeepMind

- **RT-1** (arXiv 2212.06817 [V-S]) / **RT-2** (arXiv 2307.15818 [V-S]): legacy — no code/weights ever. RT-2 remains the conceptual founding document of "VLM → action tokens."
- **Gemini Robotics 1.5 + ER 1.5** (Sept 2025): arXiv 2510.03342 [V-S]. Multi-embodiment VLA with **Motion Transfer** + interleaved "think-before-acting" reasoning; ER 1.5 GA via Gemini API [V-S].
- **Gemini Robotics 2 / ER 2 / On-Device 2** (Jul 30 2026): whole-body VLA, multi-robot collaboration, safety stack [V-S]. Early access; no weights, no arXiv yet.
- **Verdicts**: RT-1 **SKIM**; RT-2 **STUDY** (spine paper #1); GR 1.5 report **SKIM+**; GR 2 **SKIM**.

## 5. Hugging Face / LeRobot

- **LeRobot** — https://github.com/huggingface/lerobot [V-F]: **26.8k★**, very active; ICLR 2026 paper. Policies span classic IL (ACT, Diffusion Policy, VQ-BeT, Multitask DiT) and integrated VLAs: **Pi0, Pi0-FAST, Pi0.5, GR00T N1.7, SmolVLA, X-VLA, EO-1, MolmoAct2, WALL-OSS, EVO1** + HIL-SERL RL. Hardware: SO-100/SO-101, LeKiwi, Koch, Unitree G1, Reachy2. LeRobotDataset (MP4+Parquet) is the de-facto interchange format — even openpi consumes it.
- **SmolVLA** — arXiv 2506.01844 [V-S]; weights `lerobot/smolvla_base`. **450M params**, community-data-trained, async inference, **trains on a single consumer GPU** [V-S]. **No SmolVLA-2 exists as of today.**
- **Verdicts**: LeRobot **STUDY/USE** (the workbench); SmolVLA **STUDY + hands-on** (first VLA to train end-to-end yourself).

## 6. RT-X / Open X-Embodiment

- arXiv 2310.08864 [V-S]; https://github.com/google-deepmind/open_x_embodiment [V-F]: 1,990★, updated Aug 20 2026. ~1M+ episodes, 22 embodiments.
- **2026 role**: still the standard open pretraining corpus, but frontier moved to proprietary fleets (PI 10k+ hrs, GEN-0 270k hrs), egocentric human/UMI data (RDT2), and world-model synthetic data (DreamGen). New open corpora: DROID, AgiBot World (1M+ trajectories, 3,147★ [V-F]), MolmoAct2 datasets, AIRoA ~10,000-hr dataset + ICRA 2026 competition [V-S].
- **Verdict**: paper **SKIM**; dataset **USE**.

## 7. Chinese + rest-of-world ecosystem

| System | Org | Key facts | Open? | Verdict |
|---|---|---|---|---|
| **GR-3** (arXiv 2507.15493) + **GR-RL** | ByteDance Seed | 4B MoT VLA + ByteMini; GR-RL: real-world RL, shoe-lacing 83.3% | No | SKIM |
| **RDT-1B → RDT2** | Tsinghua | RDT2: Qwen2.5-VL-7B; RVQ + flow variants; 10k+ hrs UMI human data, zero-shot cross-embodiment. https://github.com/thu-ml/RDT2 [V-F]: 803★, Apache-2.0; inference ~16 GB; FM finetune ~16 GB | Yes | SKIM (STUDY if human-data route) |
| **AgiBot GO-1 → GO-2** | AgiBot | GO-1: ViLLA latent-action, open weights; GO-2 (Apr 2026): async dual-system, LIBERO 98.5% | GO-1 yes | SKIM |
| **WALL-OSS / Wall-X** | X-Square | arXiv 2509.11766; https://github.com/X-Square-Robot/wall-x [V-F]: 1.2k★ Apache-2.0; WALL-OSS-0.5 (2605.30877); LeRobot templates | Yes | SKIM |
| **UniVLA** | OpenDriveLab | RSS 2025; task-centric latent actions from cross-embodiment video; https://github.com/OpenDriveLab/UniVLA [V-F]: 1.1k★; ~123M LoRA post-train | Yes | SKIM (STUDY if latent-action research) |
| **X-VLA** | THU-AIR | arXiv 2510.10274, ICLR 2026; soft-prompted flow-matching, ~0.9B, SOTA on 6 benchmarks; in LeRobot [V-F] | Yes | SKIM |
| **LingBot-VLA / 2.0** | Robbyant (Ant) | v1: 4B, 20k hrs; v2.0 (Jul 2026): 6B, arXiv 2607.06403 [V-F repos] | Yes | SKIM |
| **Xiaomi-Robotics-0** | Xiaomi | arXiv 2602.12684; [V-F repo] 4.7B Apache-2.0, LIBERO 98.7%, consumer-GPU targeted | Yes | SKIM |
| **EO-1** | EO-Robotics | archived → integrated into LeRobot | via LeRobot | SKIP |

## 8. Other major 2026 entrants

- **GEN-0 / GEN-1 (Generalist AI)** — scaling-laws claims (~7B capability threshold); no papers/weights. SKIM blogs; treat claims as unaudited.
- **MolmoAct / MolmoAct2 (Ai2)** — https://github.com/allenai/molmoact [V-F]: Apache-2.0; action *reasoning* model (depth tokens → visual trace → actions, steerable). MolmoAct2: MolmoER backbone, OpenFAST tokenizer, 720-hr bimanual YAM dataset. **Most complete fully-open 2026 release — SKIM→STUDY.**
- **Ai2 vla-evaluation-harness** — https://github.com/allenai/vla-evaluation-harness [V-F]: 551★, Mar 2026, active. "Any VLA on any sim benchmark." **USE** — capstone eval backbone.
- **World-action-model track**: VLA-JEPA (2602.10098); "Do World Action Models Generalize Better than VLAs?" (2603.22078); WM survey 2605.00080. SKIM the debate.
- **Community index**: https://github.com/miracle-techlink/awesome-vla-2026 [V-F]: 250+ papers, updated Aug 17 2026. USE as map.

## 9. Action representation — the 2026 consensus

- No single winner; a stable portfolio: (1) **flow matching + separate action expert** (π0/π0.5, GR00T, X-VLA, RDT2-FM) dominates deployed continuous control; (2) **discrete tokens back for pretraining/VLM alignment**: FAST (DCT+BPE), FAST+, **OpenFAST**, Residual-VQ, FASTer (2512.04952); (3) **continuous regression + chunking** (OpenVLA-OFT L1) as pragmatic finetuning baseline; (4) rising: **discrete diffusion VLAs** (top ICLR 2026 submission trend) + latent-action spaces (UniVLA, ViLLA).
- Consensus recipe: VLM backbone kept close to language pretraining (knowledge insulation) + chunked flow/diffusion action expert + discrete tokens where autoregressive unification needed. **Teach flow matching AND FAST; mention discrete diffusion as frontier.**

## 10. Surveys

1. **"A Survey on VLA Models: An Action Tokenization Perspective"** — arXiv 2507.01925 [V-S]. Best pedagogical frame. **STUDY early in VLA block.**
2. **"VLA Models: Concepts, Progress, Applications and Challenges"** — arXiv 2505.04769, revised Jan 2026, 80+ models [V-S]. **SKIM as reference.**
- Honorable mentions: Efficient-VLA survey 2510.24795; data-centric 2604.23001; VLA safety 2604.23775.

## 11. Conference pulse 2026

- **ICRA 2026** (Jun, Vienna; 5,088 submissions): Robot-Learning Best Paper = "Do You Know Where Your Camera Is? View-Invariant Policy Learning with Camera Conditioning"; AIRoA 10k-hr dataset competition. **RSS 2026** (Jul, Sydney). **CoRL 2026: Nov 9–12, Austin — upcoming**. **ICLR 2026**: 164 VLA submissions.

## (a) Minimal canonical reading spine (ordered)

0. *(pre-VLA)* ACT/ALOHA + Diffusion Policy via LeRobot implementations.
1. **RT-2** (2307.15818) — founding idea: VLM whose output tokens are motor commands.
2. **OpenVLA** (2406.09246) — open replication on OXE; codebase you can read end-to-end.
3. **π0 + FAST** (2410.24164 + 2501.09747) — flow-matching action expert vs compressed discrete tokens.
4. **π0.5** (2504.16054) — heterogeneous co-training + hierarchy → open-world generalization.
5. **π*0.6 / RECAP** (2511.14759) — value-function-guided RL from real deployments.
   *(Parallel skims: GR00T N1 2503.14734; Gemini Robotics 1.5 2510.03342; survey 2507.01925 as map.)*

## (b) The ONE capstone fine-tune: **π0.5 via openpi**

LoRA fine-tune `pi05_base` on LIBERO (reproduce π0.5-LIBERO), then on a self-collected LeRobot dataset. Why: frontier lineage (same codepath as SOTA), documented consumer feasibility (LoRA >22.5 GB → one RTX 4090/5090; inference >8 GB), active Apache-2.0 repo, LeRobot-native data, natural RECAP-style research extensions. **Budget alternative**: SmolVLA-450M via LeRobot (earlier warm-up, one modest GPU). **Humanoid alternative**: GR00T N1.7 (16 GB inference; finetune wants 40 GB+).

## (c) Dominant open problems (Aug 2026)

1. **Evaluation**: LIBERO saturated; sim-real correlation unproven; reproducible real-world eval is open, publishable, low-compute.
2. **RL / learning from experience at scale**: value functions for VLAs, advantage conditioning, autonomous data flywheels.
3. **Scaling laws & data composition**: does GEN-0's power law replicate on open data? What data mix transfers best?
4. **Cross-embodiment transfer mechanisms**: motion transfer vs soft prompts vs latent actions vs RVQ token spaces — no winner.
5. **World models ↔ VLA unification**: do world-action models generalize better?
6. **Action representation frontier**: discrete diffusion, unified tokenizers, real-time async inference.
7. **Whole-body loco-manipulation + safety, continual learning without forgetting** — open stacks lag closed badly.

## Master verdict table

| System | Verdict | One-line why |
|---|---|---|
| RT-2 | STUDY | Founding concept; cheap to read |
| RT-1, Octo, OXE paper | SKIM | Historical context + dataset literacy ≤1 day |
| OpenVLA (+OFT) | STUDY / SKIM | Best readable open codebase; OFT = why continuous heads win |
| MiniVLA | SKIP | Dormant; SmolVLA replaced it |
| π0 + FAST | STUDY | Architecture canon, both branches |
| π0.5 (openpi) | STUDY + capstone | Frontier lineage, 4090-class LoRA path |
| π*0.6 RECAP | STUDY (paper) | RL-from-experience playbook |
| π0.7 | SKIM | Steerability ideas; closed |
| GR00T N1 / N1.7 | STUDY / USE | Dual-system + only strong open humanoid stack |
| GR00T-Dreams/Mimic | SKIM | Synthetic-data flywheel |
| Gemini Robotics 1.5 / 2 | SKIM+ / SKIM | Thinking-VLA + whole-body direction |
| SmolVLA + LeRobot | STUDY + hands-on | Daily workbench; first trained VLA |
| MolmoAct2 | SKIM→STUDY | Most-open 2026 release; eval mindset |
| GEN-0/GEN-1 | SKIM | Scaling-law claims; closed |
| GR-3/GR-RL, RDT2, GO-1/2, WALL-OSS, UniVLA, X-VLA, LingBot, Xiaomi-R-0 | SKIM | Ecosystem literacy; pick ONE per research direction |
| EO-1, one-off 2026 arXiv entries | SKIP | Unvetted/archived/incremental |
| Helix-02, humanoid PR demos | SKIP | No papers, no weights |
