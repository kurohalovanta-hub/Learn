# l4-training-loop — The Training Loop, Owned

Concept: The five-line heartbeat — forward, loss, zero_grad, backward, step — plus everything that makes it a scientific instrument: nn.Module composition and parameters(), Dataset/DataLoader batching, train/val separation, checkpointing that can survive a kill, metric logging, device hygiene, and seed control. The claim of the node: the learner will never again use a Trainer they couldn't rebuild — the same loop that fine-tunes π0.5 is the one written here.

Learner prerequisites: l4-pytorch-tensors (autograd semantics incl. grad accumulation — which makes zero_grad's position self-evident rather than ritual); l3-mlp-numpy (a training loop already written once in NumPy — this node ports and hardens it); Python file/CLI fluency (L1) for the train.py skeleton.

What beginners commonly misunderstand:
- Order matters and each position has a REASON: zero_grad before backward (else stale accumulation), step after backward (else stepping on old/zero grads — the node diagnostic's "subtly wrong" case: step before backward applies the PREVIOUS batch's gradients, which trains, badly, and hides), scheduler after optimizer.
- model.train() vs model.eval() + torch.no_grad() for validation: three switches, three different jobs (dropout/BN behavior, dropout/BN behavior, graph recording) — beginners flip one and think they flipped all.
- Logging loss without .item()/.detach() retains the graph per step — the slow-leak OOM that surfaces hours in (planted in l4-pytorch-tensors; recurs here in context).
- Checkpointing = model state_dict + optimizer state_dict + scheduler + epoch/step + RNG states — resuming from model-only checkpoints silently changes the run (Adam moments reset, LR schedule restarts, data order differs); the node's kill-and-resume exercise exists to make "curves continue seamlessly" a verified property, not a hope.
- Validation loss computed with shuffled/augmented val data, or metrics averaged over unequal batch sizes without weighting — quiet evaluation bugs.
- Seeds: torch, numpy, python, dataloader workers, and CUDA determinism flags are SEPARATE — "I set the seed" usually set one of five.
- device moves: model.to(device) is in-place-ish for modules but tensor.to(device) returns a new tensor — mixing them produces the classic "expected cuda got cpu."

Candidate videos:
- None live-verified this session: the session-wide WebSearch budget was exhausted (200/200) before this node's candidate pass; video domains are egress-blocked from the sandbox — recorded per the brief's integrity rule. Fallback: no CORE WATCH needed — the repo's research phase (2026-08-21) also assigned this node docs-plus-build, and community consensus per its report is that loop-writing is learned by writing. (Karpathy's makemore videos — durations research-phase confirmed — already model bare-loop discipline in the adjacent l4-embeddings-lm node; no double-billing here.)

Candidate written resources:
1. PyTorch official "Learn the Basics" — sections Data (Datasets & DataLoaders) → Transforms → Build the Neural Network → Optimization Loop → Save & Load Model — docs.pytorch.org/tutorials/beginner/basics/intro.html per repo resources.ts [repo research-phase verified 2026-08-21 [S], updated 2026-01; not re-fetched this session — egress blocked] (correctness 5, prereq fit 5 — continues the exact tutorial the previous node started, clarity 4, rigor 3, time-efficiency 5, exercise compatibility 4, future relevance 5, datedness minimal — first-party) — CORE READ, keep as primary.
2. A Recipe for Training Neural Networks — Andrej Karpathy (2019 blog) — [url not captured this session — the essay lives on karpathy's blog; verify before adding to resources.ts] (the field's canonical training-discipline essay: "neural net training fails silently", overfit-one-batch, verify-loss-at-init — it is the WHY behind this node's habits; correctness 5, community signal 5, datedness low — practices unchanged) — DEEPEN candidate pending URL verification.
3. Dive into Deep Learning — training-loop sections of the linear networks / MLP chapters — d2l.ai per repo resources.ts [repo-verified; exact section paths unverified this session] (alternate implementation voice — STUCK PATH)
4. W&B quickstart — wandb.ai per repo resources.ts (l4-experiment-craft owns the full treatment; here only the 10-line hookup) [repo-verified]

Community evidence:
- None live-gathered this session (budget exhausted — honest per brief). Convergent signals carried from the repo research phase [2026-08-21]: 2026 self-study guides still route through Karpathy-style bare loops before any Trainer abstraction (docs/research/reports/dl-ml-resources.md §"2026 guides"); W&B chosen because "used by nanoGPT/nanochat and most robot-learning repos" — the logging habit transfers directly.
- Supporting signal from adjacent-node evidence gathered this session: learner retrospectives on the Z2H path (https://aayushgarg.dev/posts/2025-09-08-building-gpt-from-scratch.html, https://briansigafoos.com/neural-networks-karpathy/ [both live ✓]) consistently report the durable skill came from writing the training code themselves — the pedagogical premise of this node.

Primary technical authority:
- PyTorch official tutorials + torch.utils.data / torch.optim docs (first-party, PyTorch 2.13) [repo resources.ts]
- The node's own train.py skeleton spec (config dict, loop, val evaluation, best-checkpoint saving, CSV + W&B logging) — the artifact IS the authority going forward: every later node reuses it.

Selected shortest-sufficient packet:
- DIAGNOSTIC: 6 min, cold: the node diagnostic — order zero_grad/backward/step/forward/loss correctly, explain each position, and state precisely what goes subtly wrong if step precedes backward. Then: "list everything a resumable checkpoint must contain." Fluent ⇒ skip CORE READ, go straight to IMPLEMENT.
- ORIENT: 10 min: re-open your L3 NumPy training loop and annotate it with the five responsibilities PyTorch will take over (params, grads, update, batching, device) — read the tutorial hunting for each.
- CORE WATCH: —
- CORE READ: Learn the Basics: Data → Transforms → Build NN → Optimization → Save/Load (~2.5 h, typing everything; at the Optimization page, close the browser and write the loop from memory FIRST, then diff against theirs).
- INTERACTIVE: — (no loop widget; the kill-and-resume experiment is the interaction)
- PRACTICE: node exercises: (1) train your L3 MLP architecture in PyTorch on the same data — match NumPy accuracy, compare wall-clock, explain the difference; (2) kill the training run mid-epoch (Ctrl-C at a random step), resume from checkpoint, and overlay the loss curves to prove seamless continuation — repeat until the overlay is exact, which forces optimizer/RNG state into the checkpoint.
- IMPLEMENT/DERIVE: the reusable train.py skeleton (node implementation spec): config dict, train/val loop, best-checkpoint saving, CSV logging + W&B hookup, seed control (all five seed surfaces), device arg. This file is a program-long asset — write it like one (argparse, docstring contract, ~150 clean lines).
- STUCK PATH: d2l.ai training-loop sections for a second voice (repo backup); for checkpoint-resume mismatches, binary-search the state you forgot (optimizer → scheduler → RNG → dataloader order) by overlaying curves after restoring each.
- DEEPEN: Karpathy's "A Recipe for Training Neural Networks" essay [url to verify] for the failure-taxonomy that motivates every habit here; PyTorch reproducibility notes [unverified this session] for CUDA-determinism limits.
- PROVE IT: node mastery test verbatim: from a blank file, full training loop for a GIVEN unfamiliar model+dataset with validation, checkpointing and logging — no Lightning, no Trainer, no copying, no train.py open.
- TRANSFER: point the skeleton at a NON-vision problem with zero code-structure change: regression on a synthetic 2-link-arm dataset (inputs: joint angles; targets: end-effector xy from your l4-pytorch-tensors FK) — Dataset class, MSE loss, val split, checkpoint resume. Proves the skeleton is problem-agnostic — the property that makes it reusable for policies later.
- RETENTION: +7 days: blank-file the five-line loop + eval block in ≤10 min incl. the three eval switches; +21 days: the checkpoint-contents question cold; ongoing: every later node (CIFAR P4, GPT, ViT) reuses train.py — each reuse IS the retention check.
- Total packet: ~6 h core (orient 10m + read 2.5h + skeleton ~2h + practice ~1.5h), PROVE IT separate per gate.

Why this won: First-party docs remain the correct spine (research-phase verified current at 2026-01/PyTorch 2.13), and the node's real deliverable is not knowledge but an ARTIFACT — train.py — so curation effort went into hardening the build: write-from-memory-then-diff at the Optimization page, the exact-overlay standard for kill-and-resume (which forces full checkpoint semantics), the five-surface seed checklist, and a non-vision transfer that certifies the skeleton's generality. No video slot: none could be live-verified this session, none is needed — loop fluency is a writing skill, and the adjacent Karpathy nodes already provide modeled loop-writing.

What was rejected (and why): PyTorch Lightning / HF Trainer tutorials (the node's explicit anti-goal — abstractions are permitted only after the learner can rebuild them); "PyTorch full course" videos (hours of re-explained autograd for minutes of loop content); building a config framework (Hydra etc.) now (a config dict suffices; tooling sophistication belongs to l4-experiment-craft); TensorBoard as primary logging (repo hedge: W&B + CSV, per research phase).

Risk of superficial understanding: The loop is five lines — trivially recognizable, rarely owned. The tells: cannot say WHY step-before-backward trains-but-wrong; checkpoint that resumes with a visible loss-curve kink; eval that forgot one of the three switches. Every one of these has a dedicated forcing exercise above. The other risk is copying the tutorial's loop into train.py — the write-from-memory-then-diff protocol and the blank-file mastery test (on an UNFAMILIAR model+dataset) close it. AI-assist caveat as always: a generated train.py caps below Gold by the program's own rules.

Required active work: from-memory loop write with diff; NumPy-vs-PyTorch match with wall-clock analysis; kill/resume with exact curve overlay; five-surface seeding; the 150-line train.py artifact; blank-file mastery run on an unseen problem; FK-regression transfer reusing the skeleton unchanged.

Last verified: 2026-08-21
