# l11-act — ACT: Action Chunking with Transformers

Concept: The first real imitation policy: a CVAE-transformer that predicts a *chunk* of k
future actions (k=100 default) from multi-camera images + proprioception — action chunking
to fight compounding error (fewer decisions per episode) and a latent z to absorb
demonstrator multimodality, with temporal ensembling smoothing execution. The
"predict sequences, not steps" move every VLA inherited.

Learner prerequisites: l11-lerobot (can train/eval via the CLI), l4-transformer gold
(encoder/decoder, cross-attention — ACT is read as an architecture diagram), l11-bc-dagger
(the failure ACT's chunking attacks). CVAE math needs only the KL term from l2/l4 exposure;
the lesson-level treatment of "z absorbs style" carries the rest.

What beginners commonly misunderstand:
- Why chunking helps at all: it looks like *less* feedback should be worse. The point is the
  effective horizon shrinks (T decisions → T/k decisions), directly attacking the εT²
  compounding from l11-bc-dagger — and it sidesteps per-step multimodality inside a chunk.
- What z does: it is used at *training* (posterior from the action sequence) and set to
  **zero at inference** (verified stated in LeRobot's act.mdx) — beginners expect sampling.
  Without the CVAE, loss on multimodal demos averages styles; with it, style is explained
  away into z.
- Temporal ensembling ≠ receding horizon: ACT overlays exponentially-weighted *overlapping
  chunks* every step; Diffusion Policy re-plans every h steps. Keeping these distinct pays
  off in l11-diffusion-policy.
- Expecting paper-level success out of the box: community reproduction on
  AlohaTransferCube-v0 reports 50–60% vs the ~83% older-version reference (lerobot issue
  #2605, open) — evaluation-protocol and version details move numbers by tens of points.
  This is a feature for this curriculum (l11-eval-statistics exists for exactly this).

Candidate videos:
1. none verifiable this session (web-search budget exhausted before ACT-video discovery;
   YouTube/project-page egress blocked). The ALOHA project page —
   https://tonyzhaozh.github.io/aloha/ (URL verified via the ACT repo README) — hosts the
   demo videos and serves as ORIENT. Fallback for explanation: the paper's Figures 2–3 with
   the LeRobot act.mdx architecture prose (below) — genuinely sufficient given the
   learner's transformer fluency.

Candidate written resources:
1. ACT/ALOHA paper — "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware"
   (Zhao, Kumar, Levine, Finn, RSS 2023) — https://arxiv.org/abs/2304.13705 (URL verified
   in LeRobot act.mdx) — CORE: §method + architecture figure + ablations (chunking,
   ensembling, CVAE) (correctness 5, rigor 4, beginner fit 3–4 after L4)
2. LeRobot ACT docs page (slug `act`; source verified:
   https://github.com/huggingface/lerobot/blob/main/docs/source/act.mdx) — ResNet-18
   backbone → transformer encoder (camera features + joints + latent) → decoder
   cross-attention; ~80M params; "a few hours for 100k steps on a single GPU"; start batch
   size 8; "often achieves high success rates with just 50 demonstrations" (clarity 5,
   time-efficiency 5)
3. Original repo README training recipe (verified via raw fetch):
   `record_sim_episodes.py --task_name sim_transfer_cube_scripted --num_episodes 50` then
   `imitate_episodes.py --policy_class ACT --kl_weight 10 --chunk_size 100 --hidden_dim 512
   --batch_size 8 --dim_feedforward 3200 --num_epochs 2000 --lr 1e-5` —
   https://github.com/tonyzhaozh/act (difficulty 3; the numbers to compare your LeRobot
   config against)
4. "ACT tuning tips" doc (official, linked from repo; URL verified) —
   https://docs.google.com/document/d/1FVIZfoALXg_ZkYKaYVh-qOlaXveq5CtvJHXkY25eYhs/edit?usp=sharing
   — includes the repo's headline advice: for real data "train for at least 5000 epochs or
   3–4× the length after the loss has plateaued" (STUCK-PATH gold)
5. LeRobot ACT implementation — `src/lerobot/policies/act/` (directory verified) — the
   side-by-side code read the node's primary already specifies.

Community evidence:
- lerobot #2605 (open, Dec 2025): ACT on `lerobot/aloha_sim_transfer_cube_human`,
  500-episode eval on an RTX 4080 laptop → 50–60% success vs ~83% expected from older
  lerobot benchmarks; no maintainer resolution — set expectations, pin versions, and treat
  the gap itself as an eval-statistics case study
  (https://github.com/huggingface/lerobot/issues/2605)
- Official Colab "Train ACT with LeRobot" (verified in docs notebooks.mdx): ~1.5 h on an
  A100 for 100k steps at batch 64 —
  https://colab.research.google.com/github/huggingface/notebooks/blob/main/lerobot/training-act.ipynb
  — realistic compute anchor: on a local 8–16 GB card expect several hours (act.mdx: "a few
  hours on a single GPU")
- gym-aloha (verified): TransferCube + Insertion tasks, 14-dim action space (6 joints + 
  gripper × 2 arms) — https://github.com/huggingface/gym-aloha

Primary technical authority:
- The paper (2304.13705) + the official repo hyperparameters + LeRobot's maintained
  implementation/docs. (Node's existing primary `act-repo` confirmed good; this record only
  adds granularity.)

Selected shortest-sufficient packet:
- DIAGNOSTIC: cold: "Why chunk? What does temporal ensembling smooth over? What role does z
  play at train vs test time?" — 5 min written.
- ORIENT: ALOHA project page demo videos (what the tasks look like; why 'fine-grained
  bimanual' is hard) — 8 min.
- CORE WATCH: — (no verified video; paper figures + docs carry it)
- CORE READ: paper §§3–4 (method: CVAE training, chunking, temporal ensembling) + Fig. 2–3
  + ablation table, with act.mdx open as the plain-English gloss — 50 min. Then 40 min
  tracing `src/lerobot/policies/act/` against the figure: find where cameras become tokens,
  where z enters, where inference zeroes it.
- INTERACTIVE: — (no ACT-specific widget; optional 5-min attention-vis refresh if decoder
  cross-attention feels rusty)
- PRACTICE: node exercise — the k=1 ablation IS behavior cloning: before running, predict
  its success and connect to l11-bc-dagger's εT² quantitatively; then run.
- IMPLEMENT/DERIVE: LeRobot-trained ACT on gym-aloha TransferCube with scripted demos
  (either generate 50 via the original repo's `record_sim_episodes.py` or use
  `lerobot/aloha_sim_transfer_cube_human`), W&B-tracked, ≥50-episode eval; chunk-size
  ablation k ∈ {1, 10, 100} (≈ a training-day wall-clock; each run "a few hours" locally
  or ~1.5 h A100-class).
- STUCK PATH: ACT tuning tips doc (train-longer advice, common failure modes) + the
  original-repo hyperparameter block as ground truth when a LeRobot config underperforms.
- DEEPEN: paper appendix ablations; issue #2605 thread as a reproduction-gap case study;
  original repo run for provenance.
- PROVE IT: node masteryTest — ablation table + from-memory architecture diagram with every
  tensor labeled + one paragraph on what the CVAE latent buys.
- TRANSFER: write the "ACT vs Diffusion Policy execution" contrast (ensembling vs receding
  horizon) BEFORE starting l11-diffusion-policy; predict which degrades more gracefully
  with jerky demos and why.
- RETENTION: +7 days: redraw the architecture from blank page; +1 month (in l12-vla-anatomy):
  identify exactly which ACT ideas (chunking, L1 action loss) survive into π0-class VLAs
  and which (CVAE z) were dropped — with a stated reason.

Why this won: paper + maintained implementation side-by-side is the node's stated design and
survives verification; act.mdx now supplies a quality plain-language architecture gloss that
makes a third-party explainer video unnecessary for this learner's L4 background. Packet ≈
1.7 h read/trace + training-day implementation ≈ node's 6 h.

What was rejected (and why): hunting unverified explainer videos (budget exhausted; low
expected value over paper+code for a transformer-fluent learner); training via the original
repo as the *primary* path (2.2k★ but only 20 commits, aging env stack — keep LeRobot as
the workbench, original repo for provenance/hyperparameters); treating the ~83% reference
as the pass bar (community evidence says 50–60% is common on current versions — the mastery
gate is the ablation story + honest CIs, not one headline number).

Risk of superficial understanding: transformer familiarity makes the diagram *look* obvious
while the two load-bearing subtleties (z's train/test asymmetry; ensembling arithmetic) slip
by. Guards: the from-memory tensor-labeled diagram, the k-ablation with pre-registered
predictions, and the diagnostic's z question.

Required active work: chunk-size ablation study with ≥50-episode evals, the labeled
architecture reconstruction, the k=1→BC quantitative connection, and the code-trace notes.

Last verified: 2026-08-21
