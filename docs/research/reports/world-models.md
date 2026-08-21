# Research Report — World Models & Physical Reasoning for Embodied Agents (2026-08-21)

> Produced by a dedicated research agent with live web verification on 2026-08-21.
> Tags: **[fetch-verified 2026-08-21]** = fetched directly (sandbox egress allows github.com/pypi.org); **[search-verified 2026-08-21]** = confirmed via ≥2 independent live search results (arxiv.org/huggingface.co/lab blogs blocked by sandbox egress, not dead links).

## 1. Dreamer lineage

### DreamerV3 — Danijar Hafner et al., Google DeepMind
- Paper: "Mastering diverse control tasks through world models," **Nature 640, 647–653 (2025)**, https://www.nature.com/articles/s41586-025-08744-2 [search-verified]
- Code: https://github.com/danijar/dreamerv3 — official JAX, MIT, 3.7k★, actively maintained, runs Atari/Crafter/Minecraft/DMC on a single GPU [fetch-verified]
- PyTorch alternative: https://github.com/Eclectic-Sheep/sheeprl — DreamerV1/2/3 + Plan2Explore, Apache-2.0, single-GPU benchmarks [fetch-verified]
- **Single-GPU: yes** — canonical single-GPU world-model RL. Prereqs: RL basics (actor-critic, λ-returns), VAEs, RNNs/RSSM.
- **STUDY** — the teachable center of gravity: RSSM + imagination training, Nature-blessed, reproducible on one GPU.

### Dreamer 4 — Hafner, Wilson Yan, Lillicrap (Google DeepMind), Sep 2025
- Paper: "Training Agents Inside of Scalable World Models," arXiv:2509.24527 [search-verified]. First agent to obtain Minecraft diamonds **purely from offline data**; shortcut-forcing objective, causal tokenizer + interactive diffusion/flow dynamics, real-time interactive inference on a single GPU.
- **Official code: NOT released as of 2026-08-21** [fetch-verified via github.com/danijar]. Community implementations [all fetch-verified]:
  - https://github.com/nicklashansen/dreamer4 — unofficial PyTorch, MIT, 384★; multi-task DMControl (30 tasks), pretrained checkpoints; **training 8×24GB GPUs; inference 1 GPU**.
  - https://github.com/lucidrains/dreamer4 — MIT, 212★, very active (PyPI `dreamer4` v0.18.4, Aug 12 2026); single-GPU examples: Moving-MNIST tokenizer, **CartPole with dynamics+RL**, HalfCheetah.
  - https://github.com/IamCreateAI/Dreamerv4-MC — Minecraft reproduction; inference-only; 430M tokenizer (>2GB VRAM) + 1.7B DiT dynamics (**9GB VRAM**).
- **No "Dreamer 5."** Substantive follow-on: **"Hallucination in World Models is Predictable and Preventable"** — Hansen & Wang, arXiv:2606.27326 (Jun 2026): 350M Dreamer-4-recipe WM, 3 hallucination modes, introduces **MMBench2** (427h / 210 tasks / 10 domains). Repo: https://github.com/nicklashansen/mmbench2 — MIT, **inference ≥4GB GPU**, training 8×H100 [fetch-verified].
- **STUDY (paper) / community code for hands-on** — frontier recipe the field builds on.

## 2. Meta V-JEPA 2 / V-JEPA 2-AC — and after

- Paper: "V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning," arXiv:2506.09985 (Jun 2025) [search-verified]. 1M+ hrs video pretraining; **V-JEPA 2-AC** post-trained on <62h unlabeled DROID robot video → zero-shot pick-and-place on Franka via CEM planning over latent energy.
- Code+weights: https://github.com/facebookresearch/vjepa2 [fetch-verified] — checkpoints ViT-L/300M → ViT-g/1B; **V-JEPA 2-AC checkpoint released with AC post-training configs**.
- **Successor (no V-JEPA 3): V-JEPA 2.1**, released 2026-03-16 in same repo — arXiv:2603.14482, "Unlocking Dense Features in Video Self-Supervised Learning"; 4 sizes 80M→2B; dense predictive loss → SOTA segmentation/depth/tracking + ~+20% robotic grasp improvement [fetch-verified repo announcement].
- Context: **Yann LeCun left Meta Nov 2025** → co-founded **AMI Labs** (Paris; ~$1.03B raised by Mar 2026) to pursue JEPA-style world models [search-verified, multiple outlets].
- Single-GPU: ViT-L/H inference+probing on 16–24GB; AC planning loop runs on one big GPU but slow (seconds/action); pretraining out of reach.
- **STUDY** — the canonical latent (non-generative) world model with open weights and a real robot-control result.

## 3. DeepMind Genie lineage

- **Genie 1** (Feb 2024, latent actions from unlabeled video) → **Genie 2** (Dec 2024, 3D foundation world model) → **Genie 3** (Aug 2025) — real-time interactive worlds, 720p @ 24fps, minutes-long consistency, promptable world events [search-verified].
- 2026: **Project Genie** consumer prototype opened Jan 29 2026 (Google AI Ultra, US → worldwide May 2026). Jun 2026: **SIMA 2 agents training inside Genie 3 worlds** [search-verified].
- **No weights, no API for programmatic agent training.** Robotics relevance real as a *direction*, zero reproducibility.
- **Verdict: Genie 1 paper (arXiv:2402.15391) STUDY** (latent action models from action-free video is a core teachable idea); Genie 3 **SKIM**; Project Genie **SKIP**.

## 4. NVIDIA Cosmos

- Hub: https://github.com/NVIDIA/Cosmos — now the **Cosmos 3** platform [fetch-verified]. **Cosmos 3 launched Jun 1 2026**: open "omnimodel" family, Mixture-of-Transformers unifying vision reasoning + world generation + **action prediction**. Tiers: Cosmos3-Super 64B / Nano 16B / **Edge 4B** (real-time robotics); weights on HF under OpenMDW-1.1.
- Prior gen (active repos, fetch-verified): **cosmos-predict2.5** (2B/14B, flow-based, robot action-conditioned, LoRA post-training; superseded by Cosmos 3); cosmos-transfer2.5 (sim2real style transfer); cosmos-reason2 (physical-common-sense VLM); cosmos-rl.
- **Cosmos Policy** — arXiv:2601.16163 (Jan 2026): post-trains Predict-2 into a policy (actions/states/values as latent frames); **98.5% LIBERO, 67.1% RoboCasa**, real bimanual ALOHA; supports model-based planning. Code: https://github.com/NVlabs/cosmos-policy — Apache-2.0, checkpoints; **inference 6–10GB VRAM; training 8×80GB+** [fetch-verified].
- **STUDY (Cosmos Policy paper + one Predict post-training walkthrough); SKIM platform breadth.**

## 5. Action-conditioned video WMs for robotics (2025→2026 wave)

- **DreamGen / GR00T-Dreams** — NVIDIA GEAR; arXiv:2505.12705; fine-tune Cosmos on a robot → generate synthetic "dream" trajectories → IDM extracts actions → fine-tune GR00T. https://github.com/nvidia/GR00T-Dreams [fetch-verified]. **STUDY pipeline concept, SKIM code** — reference design for "world models as data factories." (Isaac-GR00T now at **N1.7**, inference 16GB / fine-tune 40GB+ [fetch-verified].)
- **DreamDojo** — NVIDIA GEAR, arXiv:2602.06949, **ICML 2026**; generalist robot WM pretrained on **44,711h human egocentric video**, post-trained per-robot; distilled to 10 FPS real-time. Fully open: https://github.com/NVIDIA/DreamDojo — Apache-2.0, 2B/14B checkpoints (Feb 2026) [fetch-verified]. **STUDY** — current open frontier of robot video WMs.
- **Ctrl-World** — Stanford+Tsinghua (Finn), arXiv:2510.10125, **ICLR 2026**; controllable multi-view WM over DROID for **policy-in-the-loop rollouts** (evaluate/improve π0-style VLAs in imagination). https://github.com/Robert-gyj/Ctrl-World — MIT, ~8GB checkpoint, inference 1×A100 [fetch-verified]. **STUDY** — cleanest academic "WM as VLA evaluator."
- **WMPO** — HKUST + ByteDance, arXiv:2511.09515; pixel-space WM rollouts + GRPO for VLA RL without real interaction. https://github.com/WM-PO/WMPO [fetch-verified]. **SKIM/STUDY**.
- **WorldVLA → RynnVLA-002** — Alibaba DAMO; unified autoregressive action+world model (arXiv:2511.17502), 97.4% LIBERO. https://github.com/alibaba-damo-academy/WorldVLA [fetch-verified]. **SKIM**.
- **Genie Envisioner** — AgiBot; arXiv:2508.05635; GE-Base/GE-Act/GE-Sim; GE-Sim 2.0 (May 2026). Plus **AgiBot World Challenge @ ICRA 2026 world-model track** [fetch-verified]. **SKIM; challenge is a ready-made capstone.**
- **UniSim** (ICLR 2024 oral, arXiv:2310.06114) — never open-sourced. **SKIM** — historical hinge.
- **1X**: World Model Lab (Jun 2026); NEO ships 2026 ($20k, 160M-param Redwood onboard). Open artifact: https://github.com/1x-technologies/1xgpt — 100h EVE data, GENIE-style 35M/138M baselines, runs on RTX 4090 [fetch-verified]. **SKIM**.
- **iVideoGPT** — THU, NeurIPS 2024, arXiv:2405.15223; compact (140–436M) action-conditioned video WM, OXE-pretrained, single-GPU fine-tunable. https://github.com/thuml/iVideoGPT — MIT [fetch-verified]. **STUDY as teachable small-scale video-WM.**

## 6. Model-based RL canon

| Paper | ID | Verdict |
|---|---|---|
| World Models (Ha & Schmidhuber 2018) | arXiv:1803.10122 | STUDY (short, framing) |
| PlaNet (2019) | arXiv:1811.04551 (code archived, TF1) | STUDY paper / don't run code |
| Dreamer / DreamerV2 | 1912.01603 / 2010.02193 | SKIM (deltas only) |
| **DreamerV3** (Nature 2025) | 2301.04104 | **STUDY + run** |
| **TD-MPC2** (ICLR 2024) | arXiv:2310.16828; https://github.com/nicklashansen/tdmpc2 — MIT, 104 tasks, **12GB GPU single-task**, 300+ checkpoints [fetch-verified] | **STUDY + run** — decoder-free latent planning counterpoint |
| Dreamer 4 (2025) | 2509.24527 | STUDY paper |

## 7. WM planning for manipulation — what works small-scale

- **DINO-WM** — NYU (LeCun, Pinto et al.), arXiv:2411.04983, **ICML 2025**; frozen DINOv2 patch features + learned latent dynamics + MPC = zero-shot planning to image goals (maze/push-T/rope/granular). https://github.com/gaoyuezhou/dino_wm — MIT, datasets + checkpoints, **single-GPU trainable end-to-end** [fetch-verified]. **STUDY + reproduce — the most reproducible manipulation-planning WM.**
- V-JEPA 2-AC: zero-shot real Frankas, weights open, single-GPU inference.
- Cosmos Policy: released checkpoints, 10GB inference — reproducible LIBERO/RoboCasa eval.
- **Neural-sim policy evaluation now credible**: **RoboWorld** (arXiv:2607.01060) — DROID-trained WM reproduces RoboArena policy ranking with Pearson ρ=0.970; **Interactive World Simulator** (arXiv:2603.08546) — physically consistent >10 min at 15 FPS on one RTX 4090 [search-verified].
- Honest summary: *planning* with latent WMs works at small scale; *generative-video* WMs work as **evaluators and data generators** more than online planners; long-horizon contact-rich planning open.

## 8. Latent dynamics / representation fundamentals

- **LeCun, "A Path Towards Autonomous Machine Intelligence" (2022)** — https://openreview.net/pdf?id=BZ5a1r-kVsf — JEPA + hierarchical world-model position paper. STUDY (conceptual spine).
- **I-JEPA** — CVPR 2023, arXiv:2301.08243; https://github.com/facebookresearch/ijepa (archived, weights available) [fetch-verified]. STUDY (simplest JEPA).
- **V-JEPA** (2024) — SKIM → jump to V-JEPA 2.
- RSSM (PlaNet/Dreamer) as *the* latent-dynamics teaching object; TD-MPC2 as decoder-free contrast; DINO-WM (frozen features + dynamics) as third pattern.
- **Genie 1's latent action model** — STUDY; underpins 1xgpt, Genie 2/3, and much of 2026.

## 9. Best survey / position papers

- **Primary: "World Model for Robot Learning: A Comprehensive Survey"** — arXiv:2605.00080 (Apr 2026), NTU/Berkeley/Stanford (Jiajun Wu, Abbeel, Malik among authors); policy-centric taxonomy; living companion repo https://github.com/NTUMARS/Awesome-World-Model-for-Robotics-Policy [repo fetch-verified]. **STUDY — assign as the map.**
- **"From World Models to World Action Models: A Concise Tutorial for Robotics"** (arXiv:2607.00836, Jul 2026) — compact design-space tutorial, 4 world-action-model paradigms — **ideal first reading**.
- Others: "World Models for Robotic Manipulation: A Survey" (2606.00113); "A Definition and Roadmap for World Models" (2607.06401).

## 10. 2026 pulse

- **Workshops**: NeurIPS 2026 "World Models in Physical AI", "Robot Learning with World Models", "Continual World Models"; ICLR 2026 WM workshop; AgiBot ICRA 2026 challenge. World models are a first-class theme at every venue.
- **Industry**: Cosmos 3 open omnimodel; AMI Labs ($1.03B); **World Labs Marble** (first commercial WM product, Nov 2025; ~$1B raised); Wayve GAIA-3; 1X WM Lab.
- **Research threads**: hallucination & coverage (2606.27326); WM-based VLA RL (WMPO, VLA-RFT 2510.00406); physics-validity critiques (VideoPhy-2 2503.06800); memory-augmented WMs; WM benchmarking (WorldArena 2.0, MMBench2, DreamGenBench).

## (a) Minimal canonical reading spine (ordered)

1. **Ha & Schmidhuber, "World Models" (2018)** — the idea in simplest form: V-M-C, train the controller in the dream. (½ day)
2. **DreamerV3 (Nature 2025)** — RSSM latent dynamics + imagination actor-critic (PlaNet as appendix-ancestor). *The reproducible core.*
3. **TD-MPC2 (ICLR 2024)** — decoder-free latent WM + MPC; "planning vs imagination-RL" contrast.
4. **V-JEPA 2 / 2-AC (2025)** — internet-scale self-supervised latent WM → zero-shot real-robot planning (LeCun 2022 position paper as companion).
5. **Dreamer 4 (2025)** — frontier synthesis; bridge to the generative wave (Genie 3, Cosmos, DreamDojo).
   *Map: survey 2605.00080; quick orientation: tutorial 2607.00836.*

## (b) One concrete solo-learner exercise (one GPU) — verified

**Primary: TD-MPC2 single-task online RL on DMControl.** README supports single-task training on **one 12GB GPU**; 300+ reference checkpoints to compare against. Exercise: train 5M-param default on `walker-walk`, reproduce curves, swap in a Meta-World manipulation task, ablate horizon/CEM samples. Budget a weekend on a 3090/4090.
**Manipulation-flavored alternative: DINO-WM** — download push-T dataset + checkpoint, run MPC planning zero-shot, retrain dynamics head on one GPU; teaches frozen-features + latent dynamics + planning with no RL machinery.
**Frontier taste (inference-only): MMBench2** checkpoints (≥4GB GPU) or lucidrains `dreamer4` CartPole example.

## (c) Open problems (Aug 2026)

1. Hallucination/coverage of generative WMs off-manifold.
2. Pixels ≠ physics: contact, friction, deformables fail plausibility probes.
3. Evaluation validity: when does WM quality predict downstream policy gain? (RoboWorld ρ=0.97 is best evidence, narrow.)
4. Latent (JEPA) vs generative (Genie/Cosmos) bet unresolved — no head-to-head on shared robot benchmarks.
5. Real-time interactive inference at 15–30 Hz with minutes-scale memory.
6. On-policy RL inside neural sims: compounding model error, reward specification.
7. Action grounding from human video: IDM quality caps synthetic-data pipelines.
8. Long-horizon memory & object permanence as controllable guarantees.
9. Official-code gap: community reimplementations becoming load-bearing infrastructure.
10. Unified omnimodels vs modular stacks: tradeoffs unquantified.
