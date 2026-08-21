# Research Report — ML/DL Best-of-Breed Resources (2026-08-21)

> Produced by a dedicated research agent with live verification 2026-08-21. Tags: **[F]** = fetched directly (github.com); **[S]** = confirmed via live search results today; **[K]** = pre-2025 stable canonical link.

## 1. Karpathy "Neural Networks: Zero to Hero" — PRIMARY SPINE (still best in 2026)

Playlist: https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ [S] · course page https://karpathy.ai/zero-to-hero.html [S] · repo https://github.com/karpathy/nn-zero-to-hero [F].

| # | Video | Length | Verdict |
|---|---|---|---|
| 1 | Building micrograd (backprop from scratch) | 2h26 | STUDY (code along) |
| 2 | Building makemore (bigram LM, tensors) | 1h58 | STUDY |
| 3 | makemore 2: MLP | 1h16 | STUDY |
| 4 | makemore 3: Activations, Gradients, BatchNorm | 1h56 | STUDY (best "why training breaks" lecture anywhere) |
| 5 | makemore 4: Becoming a Backprop Ninja | 1h56 | STUDY (do the exercises — this makes you able to *derive* backprop) |
| 6 | makemore 5: WaveNet | 0h56 | SKIM (shape-tracing practice) |
| 7 | Let's build GPT: from scratch | 1h56 | STUDY twice |
| 8 | GPT Tokenizer | 2h13 | STUDY once, don't over-invest |
| 9 | Let's reproduce GPT-2 (124M) | 4h02 | STUDY (real training engineering: mixed precision, DDP, LR schedules) |

≈18h40m video; **~30 h worked** for 1–7, +12 h for 8–9. Repos all alive [F]: micrograd 17.2k★ · makemore · ng-video-lecture · minbpe · build-nanogpt · nanoGPT 62.3k★ (README: "old and deprecated" as of Nov 2025 in favor of nanochat).

**2025–2026 Karpathy additions [verified]:**
- **nanochat** (Oct 2025) — https://github.com/karpathy/nanochat [F]: 57.4k★, full LLM pipeline for ~$48–100 on an 8×H100 node; post-course capstone context, not a tutorial.
- **microgpt** (blog 2026-02-12, http://karpathy.github.io/2026/02/12/microgpt/ [S]): ~200 lines dependency-free pure Python — tokenizer + autograd + GPT (RMSNorm, KV-cache MHA) + Adam + train/infer. **Use as the stage-exit exam: read it cold and re-derive every line.**
- "Deep Dive into LLMs like ChatGPT" (Feb 2025, 3h31m) — SKIM at 1.5×.
- LLM101n/Eureka: archived, never shipped — ignore [F].

## 2. Classic ML fundamentals — minimal path (~12–15 h)

- **PRIMARY: CS229 official lecture notes** — https://cs229.stanford.edu/main_notes.pdf [S — shows "Tengyu Ma and Andrew Ng, August 18, 2026" = updated 3 days before verification]. STUDY: Part I (linear regression/LMS), Part II (classification, logistic regression, GLM/MLE), bias–variance + regularization chapters. SKIP: SVM/kernels, GDA depth, learning-theory proofs, EM. ~8–10 h.
- **PRIMARY (visual, parallel): StatQuest** — ~15 videos at 1.5×: linear/logistic regression, MLE, GD, bias–variance, ridge/lasso, cross-validation, ROC/AUC. ~4 h. SKIP trees/boosting/SVM series.
- BACKUP: Andrew Ng ML Specialization (Coursera; free to audit confirmed) — Course 1 + Course 2 wks 1–3 only, ~15 h, only if CS229 notes too dry.
- REFERENCE: **ISLP** free PDF https://www.statlearning.com [S]; labs repo [F] maintained. Do not work through.

## 3. PyTorch

**Current stable: PyTorch 2.13.0** (2026-07-08) [F via releases] — FlexAttention on MPS, `nn.LinearCrossEntropyLoss`, Python 3.15 wheels.
- **PRIMARY: Official "Learn the Basics"** — https://docs.pytorch.org/tutorials/beginner/basics/intro.html [S, updated 2026-01]: STUDY all 8 (Quickstart → Tensors → Data → Transforms → Build NN → **Autograd** → Optimization → Save/Load), typing everything. ~5–6 h. Then SKIM TensorBoard quickstart, (later) DDP overview.
- BACKUP: learnpytorch.io sections 00–04 (only if more drilling wanted).
- REFERENCE (paid): *Deep Learning with PyTorch 2e* (Manning, published) — not required. 1st edition outdated, don't use.

## 4. CS231n — refreshed, still the vision backbone

- Site https://cs231n.stanford.edu/ [S] — now "Deep Learning for Computer Vision"; **Spring 2025 lecture videos public** (Stanford Online playlist https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16 [S]); 2026 offering exists (slides at /slides/2026/).
- Key lectures: L6 CNN Architectures, **L8 Attention & Transformers**, L9 Detection/Segmentation (DETR), L13–14 Generative, L15 3D, **L16 Vision & Language**, **L17 Robot Learning** — the last pair aims exactly at our trajectory.
- **Verdict: PRIMARY for vision.** STUDY 1–9 selectively (L4–5 at 2× — Karpathy covered), plus L16–17; SKIM L13–15. ~12 h video / 16 h worked. **Assignments: A1 (kNN/softmax/2-layer net) fast (~6 h) + CNN/Transformer parts of A2/A3 (~10–15 h) — best shape-tracing forcing function in existence.**

## 5. d2l.ai — REFERENCE

[S/F] Active, free, PyTorch-first, print by Cambridge UP, 500 universities. **Role: encyclopedia backup** (attention ch 9–11 notably good). 0 scheduled hours; dip-in only.

## 6. Attention/Transformer implementation guides (ranked)

1. **PRIMARY: UvA Deep Learning notebooks** — https://github.com/phlippe/uvadlc_notebooks [F], rendered https://uvadlc-notebooks.readthedocs.io/. STUDY **Tutorial 6: Transformers & Multi-Head Attention** (~3 h) after Karpathy v7; later **Tutorial 15: Vision Transformers** (~3 h).
2. **PRIMARY (reference): labml.ai annotated implementations** — https://github.com/labmlai/annotated_deep_learning_paper_implementations [F], 67.3k★, rendered https://nn.labml.ai. Side-by-side paper/code: Transformer, **RoPE**, FlashAttention, ViT, LoRA, DDPM. Lookup, SKIM as needed.
3. **BACKUP: The Annotated Transformer** (Harvard NLP 2022 rewrite) [F] — the encoder–decoder + training-loop completion of the decoder-only picture. STUDY once (~4 h) or SKIM.

## 7. Understanding attention — the 2026 path

1. **3Blue1Brown NN series**: ch 1–4 SKIM as refresher; **STUDY ch 5 "Transformers/GPT", ch 6 "Attention in transformers", ch 7 "How might LLMs store facts"** [S; no new DL chapters 2025–26]. ~1.5–2 h. Watch ch 6 *before* Karpathy v7, rewatch after.
2. Karpathy v7 → code it → UvA T6 → microgpt attention block as final check.
3. **RoPE**: RoFormer §3 (https://arxiv.org/abs/2104.09864 [K]) + labml annotated RoPE, implement inside your nanoGPT clone (~2–3 h). Sinusoidal/learned-absolute is legacy in 2026 — learn once from Annotated Transformer, then RoPE is the default (open_clip's text tower and nanochat are RoPE-based).

## 8. ViT / CLIP / modern vision backbones

- **ViT** — arXiv:2010.11929 [F-id]; READ fully (~2 h). Implementation: UvA T15 + **lucidrains/vit-pytorch** [F, 25.5k★ active] — read `vit.py` (~150 lines) then train on CIFAR-10. ~6–8 h total.
- **CLIP** — arXiv:2103.00020 + repo [F, 34.2k★]. READ method + prompt-engineering, SKIM evals (~2 h). **open_clip** [F, 14.1k★, active through 2026: FSDP2, RoPE text tower, SigLIP models] — run zero-shot + linear probe (~3 h). Training CLIP from scratch: out of scope.
- **DINOv3: released Aug 2025** — arXiv:2508.10104, repo [F, 11.2k★]; ViT-S→7B, dense features without fine-tuning. SKIM + play with frozen features (~2 h). **DINO/SigLIP families are the standard VLA vision backbones** — "frozen dense features + head" is directly load-bearing.
- **SigLIP** — arXiv:2303.15343; **SigLIP 2** arXiv:2502.14786 [verified in big_vision README [F]]. SKIM sigmoid-loss section (30 min).

## 9. fast.ai — SKIP

Still the 2022 edition [F]; fastbook2e is early WIP; org energy went to solveit platform. Top-down + abstraction layer = wrong direction for a derive-and-implement path; content stale (no ViT/LLM depth).

## 10. Theory references

- **Understanding Deep Learning** (Prince, MIT Press 2023) — REFERENCE, first choice. Repo active [F, 9.8k★: errata/answers/notebooks/slides]. ⚠️ free-PDF link on udlbook site could not be re-confirmed from sandbox — check once; ISLP+d2l cover the gap otherwise. Use: transformers ch 12, best figures in the field. SKIM 6–8 h across the whole curriculum.
- **Goodfellow Deep Learning (2016)** — REFERENCE-ONLY (Part I math refreshers ch 3–5). Do not schedule.

## 11. Experiment tracking — pick: Weights & Biases free tier

Free personal/academic tier confirmed 2026 (~5 seats/5 GB; note: personal entities deprecated May 2024 — new users create a solo team). Acquired by CoreWeave — product continues [S]. Why: zero-config watch/sweeps/histograms (pairs with Karpathy v4 diagnostics); used by nanoGPT/nanochat and most robot-learning repos. Setup 1 h. TensorBoard = local BACKUP. MLflow = SKIP solo. Hedge: also log runs to local CSV/JSON (10 lines).

## 12. New 2026 community standards

2026 guides still converge on Karpathy Z2H as entry [S]. Genuinely new: **microgpt** (instantly canonical single-file reference), **nanochat** (standard full-pipeline teaching codebase), **Stanford CS336 "Language Modeling from Scratch"** (2024/25/**26** iterations, repos [F]) — the consensus *next stage after* this curriculum; note for roadmap. For our destination: **LeRobot** [F, 26.8k★] — everything above (ViT + CLIP/SigLIP + transformer fluency + PyTorch) is precisely the prerequisite set for reading LeRobot policy code.

## (a) Total hours: "Python-competent" → "tiny Transformer + ViT, explain backprop, trace shapes"

| Block | Hours |
|---|---|
| Classic ML minimal (CS229 excerpts + StatQuest) | 12–15 |
| Karpathy 1–7 worked (+ backprop-ninja exercises) | 25–30 |
| PyTorch Learn the Basics + drill | 6–8 |
| 3B1B ch 5–7 | 2 |
| Transformer polish: UvA T6 + RoPE implement | 6–8 |
| CS231n 2025: selected lectures + A1 + CNN/ViT assignment parts | 20–25 |
| ViT: paper + vit-pytorch + UvA T15 + CIFAR-10 run | 8–10 |
| CLIP/SigLIP/DINOv3 + open_clip probe | 5–6 |
| Capstone: microgpt cold-read + rebuild tiny GPT from memory + W&B runs | 5–6 |
| **Core total** | **≈ 90–110 h** |
| + tokenizer video + GPT-2 reproduction worked | +12–14 |
| **Full stage** | **≈ 105–125 h** |

Exit criteria: hand-derive backprop through linear+softmax+CE; implement multi-head causal attention from a blank file; train GPT-on-Shakespeare + ViT-on-CIFAR-10 with sane curves; trace every tensor shape.

## (b) Minimal paper set (reading order)

1. AlexNet (2012) — SKIM (historical framing) [K]
2. Adam (1412.6980) — SKIM (algorithm box) [K]
3. BatchNorm (1502.03167) — SKIM after Karpathy v4 [K]
4. **ResNet (1512.03385) — READ** (residual = the load-bearing idea) [K]
5. LayerNorm (1607.06450) — SKIM [K]
6. **Attention Is All You Need (1706.03762) — READ twice** (after building GPT) [K]
7. GPT-2 report — SKIM with Karpathy v9 [K]
8. **RoFormer/RoPE (2104.09864) — READ §3** [K]
9. **ViT (2010.11929) — READ** [F-id]
10. **CLIP (2103.00020) — READ method** [F-id]
11. MAE (2111.06377) — SKIM [K]
12. SigLIP (2303.15343) — SKIM loss [F-id]
13. DINOv2 (2304.07193) — SKIM [K]
14. DINOv3 (2508.10104) — SKIM [F-id]

Deliberately excluded here: GAN, VAE, DDPM, RNN/seq2seq, BERT, RT-2/π0 (next stage opens those).

## (c) Skippable DL content for a robot-learning target

- **SKIP outright:** SVMs/kernels; tree/boosting depth; classical NLP pipelines (word2vec, parsing, BERT-era recipes); **GANs** (diffusion won); classical CV features (SIFT/HOG); TensorFlow/Keras; JAX (defer until a lab forces it); MLOps; speech; Bayesian ML/PGMs; learning-theory proofs.
- **RNNs/LSTMs: not needed as a unit in 2026.** 30 min of concept (why gating existed, why attention replaced it); makemore already teaches autoregressive modeling the modern way.
- **DEFER (needed later):** diffusion/DDPM — required for Diffusion Policy and flow-matching action heads (stage-2 material); RL; NeRF/3D; multi-GPU systems beyond DDP intro.
- **Counter-intuitive KEEP:** BatchNorm/LayerNorm pathologies (Karpathy v4), frozen-backbone linear probing, tokenizer basics (VLAs tokenize *actions* — BPE intuition transfers directly).
