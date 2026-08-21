# l3-mlp-numpy — MLP From Raw NumPy

Concept: The rite of passage: a 2-layer neural network (affine → nonlinearity → affine → softmax-CE) where the learner wrote every line — vectorized forward AND backward, minibatch training loop with their own Adam, gradient-checked before training. Gold here honestly unlocks PyTorch.
Learner prerequisites: l3-backprop-theory at Gold (hard gate — scalar autograd built, matrix-form backprop done on paper), l3-sgd-optimizers (their Adam gets reused), l3-classification (softmax-CE gradient ŷ−y already derived).
What beginners commonly misunderstand:
- Scalar→vector leap: they can backprop scalars but drown in shapes — ∂L/∂W = Xᵀδ vs δXᵀ, when to sum over the batch axis (bias gradients), silent broadcasting bugs that gradient-check would catch instantly.
- Gradient checking skipped as ceremony — then a transposed W trains to 60% and they blame the learning rate.
- Loss-goes-down = correct: subtly wrong CE (log of the wrong index, missing 1/n) still "trains".
- Initialization treated as boilerplate: zeros or too-large scales produce dead/saturated nets and the failure looks like everything else.
- Believing they've "done neural nets" after following a tutorial — without the blank-file rebuild, the knowledge lives in the tutorial, not in them.

Candidate videos:
1. Building makemore Part 2: MLP — Andrej Karpathy — 1h16m [repo research report figure; URL verified via nn-zero-to-hero README fetch this session] — https://youtu.be/TCH_1BHY58I (correctness 5, prereq fit 5 after micrograd, rigor 4, exercise compat 5, future relevance 5 — a real MLP trained end-to-end with train/dev/test discipline, lr tuning, under/overfitting; the README blurb confirms it "introduces many basics of machine learning (model training, learning rate tuning, hyperparameters, evaluation, train/dev/test splits, under/overfitting)". His tensors, your NumPy: the node's companion framing)
2. Neural Networks Pt. 3: ReLU In Action!!! / Pt. 4: Multiple Inputs and Outputs — StatQuest — titles verified in playlist listings this session, URLs not surfaced [unverified — via https://www.youtube.com/playlist?list=PLjUC8HjyxGTSrn4cZEw9Uw8R0STaRcbYY] (~9–14 min each [approx]; micro-topic stuck-path only, per §13)
3. Additional "MNIST from scratch in NumPy" videos (e.g. one-off creator walkthroughs) — none verified this session (search budget exhausted before this slot); the niche is covered better by the written case study below
(YouTube egress-blocked this session; durations as annotated.)

Candidate written resources:
1. CS231n notes, "Minimal neural network case study" — file neural-networks-case-study.md verified in the cs231n/cs231n.github.io repo this session; rendered at cs231n.github.io/neural-networks-case-study/ [rendered page not fetchable from this sandbox] (correctness 5, prereq fit 5, exercise compat 5, time 5 — a complete vectorized 2-layer NumPy net on spiral data with the softmax-CE backward spelled out; the closest existing text to this node's exact deliverable)
2. CS231n notes, neural-networks-1 (architecture/activations) and neural-networks-2 (data preprocessing, weight initialization, regularization) — files verified in the same repo; targeted dip-ins for the break-it-five-ways exercise
3. Nielsen, "Neural Networks and Deep Learning" ch 1–2 — site http://neuralnetworksanddeeplearning.com verified via the mnielsen GitHub README fetch this session; code is Python 2.6/2.7 per that README [datedness: read for narrative, never run the code] — alternate long-form explanation
4. micrograd demo.ipynb (https://github.com/karpathy/micrograd, fetched this session) — the 2-layer-MLP-on-moons reference for sanity-checking behavior at tiny scale

Community evidence:
- Learner study-repos and walkthroughs of the Zero-to-Hero MLP progression continue to accumulate (https://github.com/adrische/karpathy-neural-networks-zero-to-hero; https://medium.com/@nico_X/micrograd-the-spelled-out-intro-to-neural-networks-and-backprop-written-walkthrough-a7a6532ff3a4) — the build-along format demonstrably carries learners through, not just past, the material
- The repo's live-verified research report (2026-08-21) confirms Zero-to-Hero v1–7 as the still-consensus 2026 spine with all companion repos alive
- CS231n's assignment A1 (kNN/softmax/2-layer net) is cited in that same report as "the best shape-tracing forcing function in existence" — the case-study notes are its free-standing equivalent

Primary technical authority:
- CS231n course notes (Stanford) for the vectorized formalism + case study; Karpathy makemore Part 2 for the training-discipline walkthrough. (The node's real "primary" is the learner's own gradient-checked implementation — every source here is scaffolding for it.)

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, on paper: for a 2-layer net (affine→ReLU→affine→softmax-CE), write every parameter gradient with shapes for batch size B, input d, hidden h, classes k; state how you'd verify them numerically. 12 min.
- ORIENT: Skim your own l3-backprop-theory artifacts (paper matrix derivation + Value class) — 10 min re-warm; no new video needed.
- CORE WATCH: Karpathy "Building makemore Part 2: MLP" (1h16m, typing along in his idiom) — watched as a COMPANION for training discipline (splits, lr sweep, under/overfit reads), not as the implementation source.
- CORE READ: CS231n "Minimal neural network case study" (~40 min, pencil + REPL) — then close it before implementing.
- INTERACTIVE: `backprop-graph` widget for a final saturation check (why bad init kills σ/ReLU nets); `gradient-descent` widget ravine while choosing lr for the sweep. ~10 min combined.
- PRACTICE: Node exercise verbatim: break the working net five ways on purpose (lr too high; unscaled inputs; dead-ReLU init; wrong CE; transposed W) and write down each failure's signature (loss curve + accuracy + gradient norms) until each is recognizable on sight.
- IMPLEMENT/DERIVE: Node implementation verbatim: 2-layer MLP on make_moons → digits/MNIST-class data, all NumPy — forward, vectorized backward, YOUR l3-sgd-optimizers Adam, minibatches, accuracy tracking; centered finite-difference gradient check on EVERY parameter tensor (rel. err < 1e-6 in float64) before the first real training run; train to >95%. Then: add L2 + early stopping and show the generalization gap closing (node exercise 2, feeds l3-generalization).
- STUCK PATH: micrograd demo.ipynb at tiny scale to isolate logic from vectorization; CS231n neural-networks-2 notes for init/preprocessing bugs; StatQuest Pt. 3 ReLU (via playlist) if the piecewise-linear picture is the blocker.
- DEEPEN: Nielsen ch 1–2 for the classic narrative; CS231n neural-networks-3 (training dynamics) ahead of L4; Karpathy makemore Part 3 (activations/gradients/BatchNorm) belongs to L4 — do not pull it forward.
- PROVE IT: Node masteryTest verbatim: blank file → trained 2-layer MLP with gradient-checked backward, one sitting, no AI, no reference open. (Prior-DL-veteran certification variant: <90 min.)
- TRANSFER: Re-point the SAME code at a different task shape within 15 minutes: 4-class synthetic "gripper outcome" states (d=6 features → k=4), requiring only dimension/config changes — proving the implementation is a machine, not a script. Then swap tanh↔ReLU and re-derive/re-check the one changed backward line.
- RETENTION: +7 days: re-write the softmax-CE backward (δ = ŷ−y, then Xᵀδ with batch mean) from memory and gradient-check it fresh; +30 days: the blank-file rebuild again, timed — this certificate is what admits PyTorch (L4).
Total guided: ~76 min watch + 40 min read + 20 min widgets/diagnostic; the remaining ~5–6 h is the build, the sabotage lab, and the rebuild — as an 8 h rite-of-passage node should spend them.

Why this won: The repo's choice (makemore-MLP as companion) is kept and sharpened: Karpathy provides the training discipline in his tensor idiom, while the one genuinely missing scaffold — a vectorized NumPy softmax-CE reference at exactly this node's scale — is CS231n's case study, now CORE READ with a close-it-before-coding rule. Everything else is the learner's own artifact chain (micrograd engine → their Adam → this MLP), which is the point of the node.
What was rejected (and why): nnfs.io / "Neural Networks from Scratch" book-video series and one-off MNIST-from-scratch YouTube walkthroughs — not verifiable this session (search budget exhausted), longer than the CS231n case study, and tutorial-shaped where this node must be blank-file-shaped. Nielsen as core — Python 2 code and heavier notation; DEEPEN. Pulling makemore Part 3 (BatchNorm/activations) forward — it is L4 material and would blur this node's gate.
Risk of superficial understanding: The tutorial-completion trap: a net assembled by following along trains fine and teaches little. Gates: gradient-check-before-train is mandatory and unfakeable; the five-sabotage lab converts failure signatures into recognition; PROVE IT is blank-file, one sitting, no AI — and the +30-day timed rebuild re-certifies before PyTorch is allowed.
Required active work: The gradient-checked NumPy build to >95%; the five-way sabotage lab with written signatures; L2+early-stopping gap experiment; the 15-minute re-pointing transfer; two spaced blank-file rebuilds.
Last verified: 2026-08-21
