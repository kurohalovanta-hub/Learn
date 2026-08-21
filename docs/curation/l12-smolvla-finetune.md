# l12-smolvla-finetune — SmolVLA: Your First VLA Fine-Tune

Concept: Running the complete foundation-model loop — data, fine-tune, CI'd evaluation — on
the consumer-GPU VLA (450M: SmolVLM2 backbone + ~100M flow-matching action expert with
layer-skipping and async inference), then answering "what did VLM pretraining buy at my
scale?" against your own from-scratch Diffusion Policy numbers. The warm-up for the openpi
capstone.

Learner prerequisites: l12-vla-anatomy gold (reads the architecture as an instance of the
recipe), l11-lerobot gold (datasets, lerobot-train/eval), l11-eval-statistics (Wilson CIs,
episodes×seeds discipline), l11-diffusion-policy (the DP baseline it is compared against).

What beginners commonly misunderstand:
- Expecting fine-tuning to be push-button. The single most instructive community thread
  (lerobot #2915, open, unanswered): 120 self-collected episodes, SmolVLA_base, "no
  meaningful improvement" — data quality/consistency and task-description text dominate
  outcomes at this scale; the sim-dataset path this node takes exists to remove the
  data-collection confound FIRST.
- Assuming official-checkpoint benchmark numbers reproduce: #2354 and #3264 (both open)
  report failure to reproduce SmolVLA's LIBERO results with official checkpoints —
  version/protocol sensitivity is normal; your CIs and pinned versions are the defense.
- Trusting `--policy.train_expert_only` / freeze flags blindly: #4018 (closed) documents a
  partial-freeze bug where the last VLM layer + final norm stayed trainable — for the
  frozen-vision ablation, COUNT trainable params yourself (`p.requires_grad` sum) instead
  of believing the flag.
- Docs drift is real: #2984 fixed an incorrect training command in the SmolVLA docs —
  cross-check any copied command against `lerobot-train --help`.
- Underestimating eval cost: 50+ episodes × seeds of sim rollouts can rival training time;
  budget for it (the l11-eval-statistics lesson priced this).

Candidate videos:
1. none verifiable this session (web-search budget exhausted before video discovery;
   YouTube egress blocked). Fallback: the official Colab notebook (below) is the
   walkthrough format for this node — every step executable, maintained by the authors.

Candidate written resources:
1. LeRobot SmolVLA docs (slug `smolvla`; source verified:
   https://github.com/huggingface/lerobot/blob/main/docs/source/smolvla.mdx ; rendered page
   URL verified in search: https://huggingface.co/docs/lerobot/en/smolvla) — CORE: exact
   fine-tune command (`lerobot-train --policy.path=lerobot/smolvla_base
   --dataset.repo_id=… --batch_size=64 --steps=20000`), "~4 hrs on a single A100" for 20k
   steps, ≥50-episode dataset guidance (e.g. 10 episodes × 5 positions), reference dataset
   (SVLA SO100 PickPlace), `lerobot-rollout` deployment (correctness 5, time-efficiency 5)
2. Official Colab — "Train SmolVLA with LeRobot" (URL verified in docs notebooks.mdx and
   search) —
   https://colab.research.google.com/github/huggingface/notebooks/blob/main/lerobot/training-smolvla.ipynb
   (notebook source: https://github.com/huggingface/notebooks/blob/main/lerobot/training-smolvla.ipynb)
   — notebooks.mdx states ~5 h on A100 at batch 64 / 20k steps (vs smolvla.mdx's ~4 h —
   quote the range, 4–5 h) (beginner fit 5)
3. SmolVLA paper — Shukor et al. 2025 — https://arxiv.org/abs/2506.01844 (URL verified via
   awesome-vla-2026; pdf URL also surfaced in search) — CORE READ §method: what was cut
   from π0-scale designs and what survived (rigor 4)
4. HF SmolVLA blog (source verified:
   https://github.com/huggingface/blog/blob/main/smolvla.md) — layer skipping (action
   expert attends to VLM features up to N = half the layers), flow-matching expert, async
   inference (+~30% response, ~2× throughput), community-data pretraining (487 curated
   SO100 datasets, ~10M frames, <30k episodes) (clarity 5, ORIENT-perfect)
5. LeRobot PEFT/LoRA tutorial (slug `peft_training`, verified in toctree) + `libero.mdx` /
   `libero_plus.mdx` (verified present) — the sim-eval and low-VRAM levers.

Community evidence:
- lerobot #2915 (open, Feb 2026): 120-episode SO-101 cube task fine-tune → no meaningful
  improvement; explicit plea for community success stories went unanswered — support is
  thin; plan to debug from first principles (data audit, loss curves, known-dataset sanity
  run) (https://github.com/huggingface/lerobot/issues/2915)
- lerobot #2354 + #3264 (open): SmolVLA LIBERO results not reproducing from official
  checkpoints; #2418: LIBERO fine-tune tensor-shape mismatch; #2351: adapting SmolVLA to
  other arms needs care (feature mapping) — the reproduction gap is the norm, which is
  exactly why this node demands CIs and a same-data DP comparison
  (https://github.com/huggingface/lerobot/issues?q=smolvla+finetune)
- lerobot #4018 (closed): partial-freeze `set_requires_grad()` bug left last VLM layer
  trainable — verify freeze status empirically for the ablation exercise
- Medium community writeups exist and were surfaced in search (titles verified, content not
  fetchable this session — medium.com egress-blocked): "Fine Tuning SmolVLA for New
  Environments (Code included!)" (Correll Lab / Toward Humanoids)
  https://medium.com/correll-lab/fine-tuning-smolvla-for-new-environments-code-included-af266c56d632
  and "GenAI for Robotics: Fine-Tuning SmolVLA to Pick and Place"
  https://medium.com/@henryhu1607/genai-for-robotics-fine-tuning-smolvla-to-pick-and-place-940b485e6c9b
- Third-party guide confirming the ecosystem path: https://docs.phospho.ai/learn/train-smolvla
  (surfaced in search; not fetched)

Primary technical authority:
- LeRobot SmolVLA docs + official Colab + paper 2506.01844 (node's existing primary
  confirmed, including its documented "~20k steps ≈ 4 h A100" figure — docs still say
  exactly this; the notebooks page says ~5 h, so cite 4–5 h).

Selected shortest-sufficient packet:
- DIAGNOSTIC: cold, written: "What do you predict VLM pretraining buys at 450M on your sim
  task vs your from-scratch DP — and what won't it buy? State numbers you expect." — 10 min
  (this pre-registration is what makes the final comparison meaningful).
- ORIENT: HF SmolVLA blog — architecture + async + community-data story — 15 min.
- CORE WATCH: — (no verified video; Colab is the walkthrough)
- CORE READ: smolvla.mdx docs page (commands, data guidance, rollout) — 20 min; paper
  §method + LIBERO/Meta-World results tables — 40 min, annotating deltas from π0-scale
  designs (layer skip, expert size, data source).
- INTERACTIVE: vla-flow (in-app) — 5 min re-visit: point to where layer-skipping cuts the
  diagram and where async inference splits it.
- PRACTICE: dry-run discipline: `lerobot-train --help` cross-check of every flag you'll
  use (#2984 taught why); a 500-step smoke run on the chosen sim dataset to validate
  shapes/cameras/task-strings before committing compute.
- IMPLEMENT/DERIVE: fine-tune `lerobot/smolvla_base` on the chosen sim dataset (LIBERO
  task via libero.mdx path, or the task your DP baseline used), 16 GB local at batch ≤8 /
  12 GB at batch ≤4 (node computeNote, consistent with docs' start-small advice) or the
  official Colab on A100 (~4–5 h, ≈$5–15 cloud); W&B curves; ≥50-episode × seeds eval with
  Wilson CIs; the DP-vs-SmolVLA same-data comparison table (≈8 h with training).
- STUCK PATH: run the official Colab unmodified on their reference dataset first (SVLA
  SO100 PickPlace) to separate "my setup is broken" from "my fine-tune is bad"; then the
  issues map above (#2915 for expectations, #2418 for LIBERO shape errors).
- DEEPEN: peft_training.mdx (LoRA route if VRAM-bound); `src/lerobot/policies/smolvla/`
  source read for the architecture observation the masteryTest requires; paper ablations.
- PROVE IT: node masteryTest — complete fine-tune report: config, curves, CI'd ≥50-episode
  eval, DP comparison, one architecture observation from source.
- TRANSFER: the frozen-vs-unfrozen vision ablation at fixed compute — but hardened: verify
  the freeze empirically (trainable-param count; #4018), report the tradeoff with CIs.
- RETENTION: +14 days (before boss-vla): answer the node diagnostic purely from your own
  numbers, no notes; re-state the 3 things you'd do differently for the π0/openpi capstone.

Why this won: the official docs + Colab are verified current TODAY with exact commands and
honest compute numbers, and the community-issues layer (unique find of this research pass)
converts the node's biggest risk — silent fine-tune failure with thin support — into named,
pre-briefed failure modes. Packet ≈ 1.5 h read + ~6.5 h run/eval/report ≈ node's 8 h.

What was rejected (and why): real-robot (SO-10x) fine-tuning paths and hardware videos (no
arm in this program's loop at this node; sim keeps the "does pretraining help" question
clean); Medium tutorials as CORE (unfetchable this session, unversioned commands age fast —
listed as community evidence only); fine-tuning from a community checkpoint instead of
`smolvla_base` (breaks the pretraining-value experiment); trusting official-checkpoint
LIBERO numbers as targets (#2354/#3264 — compare against YOUR baselines instead).

Risk of superficial understanding: "the loss went down and the robot moves" — without the
pre-registered prediction, the CI'd eval, and the DP comparison, this node degrades into
running someone's notebook. The smoke-run + empirical-freeze-check habits are also the
transferable research skills the capstone needs.

Required active work: pre-registered prediction memo, smoke run, full fine-tune with W&B,
CI'd ≥50-episode evaluation, same-data DP comparison table, empirically-verified freeze
ablation, and the source-read architecture observation.

Last verified: 2026-08-21
