# l11-diffusion-policy — Diffusion Policy, From Scratch

Concept: Conditional diffusion over ACTION chunks — denoise a_{t:t+H} from Gaussian noise,
conditioned on observation features; execute receding-horizon (predict 16, execute 8). The
first policy class the learner implements fully from scratch, and the clean demonstration of
why mean-regression BC dies on multimodal demonstrations while a generative action head
commits to a mode.

Learner prerequisites: l11-diffusion gold (owns a from-scratch 2D DDPM — this node is "swap
x for action chunks, add conditioning"), l11-lerobot gold (pusht dataset + eval loop),
l11-act (chunking rationale, execution-scheme contrast).

What beginners commonly misunderstand:
- Where multimodality actually bites: not "the task has many solutions" in the abstract, but
  that L2/L1 regression on {go-left, go-right} demos outputs their MEAN — a trajectory into
  the obstacle. The fork-dataset money plot exists to make this undeniable in the learner's
  own figures.
- What is diffused vs what conditions: noise lives on the *action chunk*; observations enter
  as conditioning (FiLM/feature injection), never noised. The node diagnostic targets
  exactly this asymmetry.
- Receding horizon vs ACT's temporal ensembling: DP re-plans from fresh noise every h steps
  (forgiving mid-chunk drift); ACT averages overlapping chunks. Different answers to the
  same open-loop-risk problem.
- Underestimating inference cost: DDPM sampling at every re-plan is the latency problem that
  motivates l11-flow-matching — the sampling-steps sweep is the setup for that punchline.
- Normalization traps when cross-checking against LeRobot's implementation: stats live in
  dataset `meta/stats.json` (verified in dataset docs); mismatched normalization between
  your head and the reference silently wrecks the comparison.

Candidate videos:
1. none verifiable this session (web-search budget exhausted before video discovery;
   YouTube and the Columbia project site are egress-blocked from this environment — the
   project page https://diffusion-policy.cs.columbia.edu/ [URL verified via the official
   README] hosts the paper videos and serves as ORIENT). Fallback: the official state-based
   Colab is a superior "watch" for this node anyway — it is the explanation *as runnable
   cells*, from the authors.

Candidate written resources:
1. Diffusion Policy paper — Chi et al., RSS 2023 — https://arxiv.org/abs/2303.04137
   (verified via awesome-vla-2026 index) — CORE READ: §3 (method: DDPM on actions, visual
   conditioning, receding horizon) + Fig. 3 + the multimodality discussion (correctness 5,
   rigor 4–5)
2. Official state-based PushT Colab (URL verified in the official README) —
   https://colab.research.google.com/drive/1gxdkgRVfM55zihY9TFLja97cSVZOZq2B?usp=sharing —
   the authors' minimal end-to-end implementation (beginner fit 5, exercise compatibility 5)
3. Official vision-based Colab (verified same source) —
   https://colab.research.google.com/drive/18GIHeOQ5DyjMN8iIRZL2EKZ0745NLIpg?usp=sharing —
   DEEPEN only (this node's from-scratch build is state-obs by design)
4. Official repo — https://github.com/real-stanford/diffusion_policy (verified: training
   data at https://diffusion-policy.cs.columbia.edu/data/training/, experiment logs +
   checkpoints published, `train.py --config-name=...` workflow) (reference 5)
5. LeRobot reference implementation: `src/lerobot/policies/diffusion/` (dir verified) +
   `examples/training/train_policy.py` (verified: DP on PushT, 5k steps, delta_timestamps
   obs [-0.1, 0.0]s / actions [-0.1…1.4]s — i.e. 2 obs frames + 16-step horizon at 10 fps)
   + `examples/tutorial/diffusion/{diffusion_training_example.py, diffusion_using_example.py}`
   (verified) — the cross-check target.

Community evidence:
- gym-pusht README (verified): the PushT task *originated from Diffusion Policy research*;
  success = 95% goal-zone coverage; state obs is a 5-D vector — the from-scratch build's
  environment is faithful to the paper's (https://github.com/huggingface/gym-pusht)
- lerobot #3802 (closed) + #4047: official `lerobot/diffusion_pusht` checkpoint breaks on
  newer lerobot (SpatialSoftmax pos_grid mismatch; legacy processor pipeline) — for the
  cross-check, TRAIN the LeRobot reference yourself on the same data rather than loading a
  stale hub checkpoint (https://github.com/huggingface/lerobot/issues?q=pusht+diffusion+train)
- Official repo publishes full experiment logs/configs/checkpoints — the reproduction
  culture this program's eval-statistics thread wants the learner to imitate.

Primary technical authority:
- Paper 2303.04137 + the official real-stanford implementation and Colabs (Chi et al.,
  Columbia/TRI/MIT). Node's existing primary `diffusion-policy-repo` confirmed good.

Selected shortest-sufficient packet:
- DIAGNOSTIC: cold: "Why does the denoiser condition on observations but not noise them?
  What does receding-horizon re-planning forgive?" — 5 min written.
- ORIENT: project page (task videos, the multimodality figure) — 8 min.
- CORE WATCH: — (none; see candidates note)
- CORE READ: paper §3 + Fig. 3 + multimodality/ablation sections — 50 min, with your 2D
  DDPM code open, annotating every delta between "diffuse images" and "diffuse action
  chunks conditioned on obs".
- INTERACTIVE: — (the from-scratch build is the interactive; l11-diffusion's toy covered
  the DDPM visuals)
- PRACTICE: run the official state-based Colab top-to-bottom once (90 min incl. training) —
  predict-before-run: chunk length, what conditions the denoiser, how actions are executed.
- IMPLEMENT/DERIVE: YOUR diffusion action head (MLP or small U-Net denoiser) on
  lerobot/pusht state observations; receding-horizon rollout in gym-pusht; ≥50-episode
  eval; then train LeRobot's diffusion policy on identical data (train_policy.py, extended
  past its 5k demo steps) and cross-check (≈4–6 h + training wall-clock; node computeNote:
  1–4 h/run on 8 GB documented).
- STUCK PATH: the state-based Colab as line-by-line reference when your head misbehaves;
  `examples/tutorial/diffusion/diffusion_training_example.py` for the LeRobot-side wiring;
  labml annotated DDPM (repo-existing) for denoiser bugs.
- DEEPEN: vision-based Colab (visual conditioning via the CNN encoder); official repo
  experiment logs; paper appendix on CNN-vs-transformer heads.
- PROVE IT: node masteryTest — from-scratch DP within 10 success-points of the LeRobot
  reference on PushT-state, + the fork-dataset money plot + written explanation.
- TRANSFER: node exercise as the flagship — construct the synthetic two-path fork dataset;
  show BC-MLP averaging into the wall and DP committing to a mode, in one figure. Bonus
  transfer: sampling-steps sweep 5→100 on YOUR policy — success-vs-steps + latency table,
  pre-answering l11-flow-matching's question.
- RETENTION: +7 days: re-derive the conditional-DDPM training loop (noising, ε-target,
  conditioning path) on paper; +1 month: explain to a rubber duck why π0 replaced DDPM
  sampling with flow, using your own latency numbers.

Why this won: the authors' own Colab + paper is the rare case where the authoritative source
is also the most beginner-runnable; the LeRobot minimal example (verified: same task, same
delta_timestamps pattern) gives an independent reference for the ±10-point cross-check. The
packet spends nearly all its minutes in active build, matching the node's "from scratch"
identity. ≈2.5 h read/run + ~5 h build ≈ node's 8 h.

What was rejected (and why): explainer videos (none verifiable this session; the Colab
outperforms video for this node); loading `lerobot/diffusion_pusht` hub checkpoint for the
comparison (community-documented compatibility breakage #3802/#4047 — train the reference
instead); vision-based DP as core (doubles compute for zero conceptual delta on THIS node's
objectives; kept as DEEPEN); U-Net-first implementations (an MLP denoiser reaches parity on
state-obs PushT and keeps attention on the algorithm, not the architecture).

Risk of superficial understanding: high — Colab-copying can produce a "working" policy with
zero ownership. Guards: the from-scratch head must be written before opening the Colab as
reference (Colab is PRACTICE/STUCK-PATH, not template); the fork-dataset plot cannot be
copied from anywhere; the ±10-point cross-check forces normalization/eval details into the
open.

Required active work: the from-scratch conditioned denoiser + receding-horizon rollout, the
LeRobot cross-check on identical data, the fork-dataset money plot, and the
sampling-steps/latency sweep.

Last verified: 2026-08-21
