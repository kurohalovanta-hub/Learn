# The Paper Ladder — 63 Papers from First Backprop to the Frontier

**Verified against reports/ (2026-08-21). Full cards (per HANDOVER §29: prereqs, key equations/figures, reproduction plan, compute, questions) live in `src/content/papers.ts`. This is the canonical ordering.**

Verdicts: **READ** = deep read, notes, questions answered · **READ+RUN** = read and execute/reproduce code · **SKIM** = 30–60 min for the idea and context. Reading order follows curriculum levels; rungs unlock with their level.

## Rung 1 — Neural networks & vision foundations (with L3–L4)

| # | Paper | Link | Verdict |
|---|---|---|---|
| 1 | AlexNet (2012) | proceedings.neurips.cc (c399862d) | SKIM — where the era started |
| 2 | Adam (2014) | arxiv.org/abs/1412.6980 | SKIM — the optimizer you'll type daily |
| 3 | BatchNorm (2015) | arxiv.org/abs/1502.03167 | SKIM after Karpathy v4 |
| 4 | ResNet (2015) | arxiv.org/abs/1512.03385 | **READ** — residual streams are the load-bearing idea of all modern nets |
| 5 | LayerNorm (2016) | arxiv.org/abs/1607.06450 | SKIM |
| 6 | Attention Is All You Need (2017) | arxiv.org/abs/1706.03762 | **READ twice** — after building GPT |
| 7 | GPT-2 (2019) | cdn.openai.com (language models) | SKIM with Karpathy v9 |
| 8 | RoFormer / RoPE (2021) | arxiv.org/abs/2104.09864 | **READ §3** — the 2026 default positional scheme |
| 9 | ViT (2020) | arxiv.org/abs/2010.11929 | **READ** — the robot-policy vision backbone |
| 10 | CLIP (2021) | arxiv.org/abs/2103.00020 | **READ method** — language⇄vision grounding |
| 11 | MAE (2021) | arxiv.org/abs/2111.06377 | SKIM — self-supervised bridge |
| 12 | SigLIP (2023) | arxiv.org/abs/2303.15343 | SKIM loss section — the contrastive loss 2026 VLMs use |
| 13 | DINOv2 (2023) | arxiv.org/abs/2304.07193 | SKIM |
| 14 | DINOv3 (2025) | arxiv.org/abs/2508.10104 | SKIM — the 2026 default dense-feature backbone |

## Rung 2 — Reinforcement learning (with L10)

| # | Paper | Link | Verdict |
|---|---|---|---|
| 15 | GAE (2015) | arxiv.org/abs/1506.02438 | SKIM — the advantage estimator inside every PPO |
| 16 | PPO (2017) | arxiv.org/abs/1707.06347 | **READ** — then implement from scratch |
| 17 | SAC (2018) | arxiv.org/abs/1801.01290 | **READ** — then implement |
| 18 | Learning to Walk in Minutes (Rudin, 2021) | arxiv.org/abs/2109.11978 | **READ** — created the massively-parallel recipe |
| 19 | OpenAI ADR / Rubik's Cube (2019) | arxiv.org/abs/1910.07113 | SKIM — automatic domain randomization |
| 20 | IQL (2021) | arxiv.org/abs/2110.06169 | **READ** — the offline-RL algorithm that survived into VLA-land |
| 21 | Deep RL for Robotics: Real-World Successes (2024/25) | arxiv.org/abs/2408.03539 | **READ** — the best "why RL for robots" |

## Rung 3 — Imitation learning & action generation (with L11)

| # | Paper | Link | Verdict |
|---|---|---|---|
| 22 | DAgger (2011) | arxiv.org/abs/1011.0686 | **READ** — covariate shift, the founding IL problem |
| 23 | DDPM (2020) | arxiv.org/abs/2006.11239 | **READ** — prerequisite for Diffusion Policy |
| 24 | ACT / ALOHA (2023) | arxiv.org/abs/2304.13705 | **READ+RUN** — action chunking, CVAE; train it in LeRobot |
| 25 | Diffusion Policy (2023) | arxiv.org/abs/2303.04137 | **READ+RUN** — implement the action head from scratch on PushT |
| 26 | Flow Matching (Lipman, 2022) | arxiv.org/abs/2210.02747 | **READ core** — then convert your DP to flow |
| 27 | UMI (2024) | arxiv.org/abs/2402.10329 | SKIM — data collection without a robot |
| 28 | MimicGen (2023) | arxiv.org/abs/2310.17596 | SKIM — geometric-replay synthetic data |
| 29 | Micro Lie theory (Solà, 2018) | arxiv.org/abs/1812.01537 | **READ** (in L5) — pose math for every robotics paper |

## Rung 4 — Generalist policies & VLA (with L12) — the core spine in bold

| # | Paper | Link | Verdict |
|---|---|---|---|
| 30 | RT-1 (2022) | arxiv.org/abs/2212.06817 | SKIM — history |
| 31 | **RT-2 (2023)** | arxiv.org/abs/2307.15818 | **READ — spine #1**: VLM tokens as motor commands |
| 32 | Open X-Embodiment (2023) | arxiv.org/abs/2310.08864 | SKIM — the open pretraining corpus |
| 33 | Octo (2024) | arxiv.org/abs/2405.12213 | SKIM — the open generalist before VLAs |
| 34 | **OpenVLA (2024)** | arxiv.org/abs/2406.09246 | **READ+code — spine #2**: the codebase you can actually read |
| 35 | OpenVLA-OFT (2025) | arxiv.org/abs/2502.19645 | SKIM — why continuous heads + chunking win |
| 36 | **π0 (2024)** | arxiv.org/abs/2410.24164 | **READ — spine #3a**: flow-matching action expert |
| 37 | **FAST (2025)** | arxiv.org/abs/2501.09747 | **READ — spine #3b**: the discrete-token counterpoint |
| 38 | **π0.5 (2025)** | arxiv.org/abs/2504.16054 | **READ — spine #4**: co-training + hierarchy → open-world generalization; the capstone's paper |
| 39 | SmolVLA (2025) | arxiv.org/abs/2506.01844 | **READ+RUN** — the VLA you train yourself |
| 40 | GR00T N1 (2025) | arxiv.org/abs/2503.14734 | SKIM+ — dual-system + data pyramid |
| 41 | Gemini Robotics 1.5 (2025) | arxiv.org/abs/2510.03342 | SKIM — thinking-VLA + motion transfer |
| 42 | **π*0.6 / RECAP (2025)** | arxiv.org/abs/2511.14759 | **READ — spine #5**: RL from deployment experience |
| 43 | VLA survey: action-tokenization perspective (2025) | arxiv.org/abs/2507.01925 | **READ early** — the map |
| 44 | MolmoAct2 (2026) | arxiv.org/abs/2605.02881 | SKIM — most-open 2026 release; action reasoning |
| 45 | π0.7 (2026) | arxiv.org/abs/2604.15483 | SKIM — steerable generalists |
| 46 | SimpleVLA-RL (2025, ICLR 2026) | arxiv.org/abs/2509.09674 | **READ** — the canonical VLA-RL teaching paper |
| 47 | πRL (2025) | arxiv.org/abs/2510.25889 | SKIM — RL through flow heads (two-layer MDP) |
| 48 | What Can RL Bring to VLA Generalization? (2025) | arxiv.org/abs/2505.19789 | **READ** — the controlled experiment |

## Rung 5 — World models (with L13)

| # | Paper | Link | Verdict |
|---|---|---|---|
| 49 | World Models (Ha & Schmidhuber, 2018) | arxiv.org/abs/1803.10122 | **READ** — the idea in simplest form |
| 50 | PlaNet (2019) | arxiv.org/abs/1811.04551 | SKIM — RSSM ancestor |
| 51 | **DreamerV3 (2023/Nature 2025)** | arxiv.org/abs/2301.04104 | **READ+RUN** — the reproducible core |
| 52 | **TD-MPC2 (2023, ICLR 2024)** | arxiv.org/abs/2310.16828 | **READ+RUN** — decoder-free latent planning counterpoint |
| 53 | Genie (2024) | arxiv.org/abs/2402.15391 | **READ** — latent actions from action-free video |
| 54 | **V-JEPA 2 / 2-AC (2025)** | arxiv.org/abs/2506.09985 | **READ** — internet-scale latent WM → zero-shot robot control |
| 55 | DINO-WM (2024, ICML 2025) | arxiv.org/abs/2411.04983 | **READ+REPRODUCE** — the solo-feasible manipulation WM |
| 56 | **Dreamer 4 (2025)** | arxiv.org/abs/2509.24527 | **READ** — frontier synthesis (offline Minecraft diamonds) |
| 57 | Ctrl-World (2025, ICLR 2026) | arxiv.org/abs/2510.10125 | SKIM — WM as VLA evaluator |
| 58 | World Models for Robot Learning survey (2026) | arxiv.org/abs/2605.00080 | **READ** — the map |
| 59 | World→World-Action Models tutorial (2026) | arxiv.org/abs/2607.00836 | **READ first** — 4 WAM paradigms in one sitting |
| 60 | Do WAMs Generalize Better than VLAs? (2026) | arxiv.org/abs/2603.22078 | SKIM — the open paradigm question |

## Rung 6 — Sim-to-real & evaluation (with L14–L15)

| # | Paper | Link | Verdict |
|---|---|---|---|
| 61 | Domain Randomization (Tobin, 2017) | arxiv.org/abs/1703.06907 | SKIM — where DR started |
| 62 | LIBERO (2023) + LIBERO-Plus (2025, CVPR 2026) | arxiv.org/abs/2306.03310 · arxiv.org/abs/2510.13626 | SKIM pair — benchmark + its robustness critique (read together) |
| 63 | RoboArena (2025, CoRL 2025) | arxiv.org/abs/2506.18123 | **READ** — how the field now evaluates for real |

## Cadence and pipeline rules

- Average ≈2 papers/week from Month 2, weighted: Months 2–4 mostly SKIMs and foundational READs; Months 5–6 the VLA/WM spine; Month 7 direction-specific.
- Every READ enters the Paper Room kanban (queue → triaged → reading → deriving → reproducing …) with its card's questions answered in writing — no paper tourism (HANDOVER §26).
- The five-paper VLA spine (31→34→36/37→38→42) and the WM spine (49→51→52→54→56) are **gating**: the VLA Boss requires the first, the world-model experiment the second.
- Frontier additions land through the app's Frontier Tracker with a "does the roadmap change?" verdict — the ladder is versioned, not frozen.
