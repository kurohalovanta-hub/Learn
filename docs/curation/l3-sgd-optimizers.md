# l3-sgd-optimizers — SGD, Momentum & Adam

Concept: Minibatch SGD as noisy-but-cheap gradient descent (noise/speed tradeoff, batch-size effects); momentum as a leaky average that fixes ravines; RMS scaling as per-coordinate step sizes; Adam assembled from both, with bias correction; learning-rate schedules as concept.
Learner prerequisites: l3-linear-regression (GD already implemented on MSE); l2-optimization. The logistic-regression problem from l3-classification is the racetrack.
What beginners commonly misunderstand:
- SGD noise read as pure defect — missing that small batches buy far more steps per FLOP and that the noise floor at convergence is a feature of the method, not a bug in their code.
- Momentum imagined as "speed boost" rather than a leaky average of gradients that cancels oscillation across a ravine while accumulating along it.
- Adam memorized as incantation: few can say which problem each term solves (m: variance reduction/direction memory; v: per-coordinate scale; bias correction: the zero-initialized EMAs are underestimates early).
- Bias correction skipped as pedantry — until the first steps with β₂=0.999 produce absurd effective step sizes.
- "Adam always wins" — never having raced optimizers on one fixed problem across batch sizes.

Candidate videos:
1. Gradient Descent, Step-by-Step — StatQuest — ~24 min [aggregator-stated] — https://www.youtube.com/watch?v=sDv4f4s2SB8 — final section introduces stochastic GD (segment: the SGD tail, ~last 4 min [approx]); already watched in full at l3-linear-regression, so only that segment re-plays here
2. StatQuest "Stochastic Gradient Descent, Clearly Explained!!!" — title known from the StatQuest catalog; URL did not surface before the session's search budget exhausted [unverified — locate via https://statquest.org/video_index.html]
3. Dedicated Adam/momentum explainer — none verified this session (search budget exhausted before this slot) — fallback: d2l.ai adam.md/momentum.md below, which the packet makes CORE READ anyway
(YouTube and statquest.org egress-blocked; only URLs from live search results are listed.)

Candidate written resources:
1. d2l.ai "Optimization Algorithms" ch 12 — sections 12.4 sgd, 12.5 minibatch-sgd, 12.6 momentum, 12.10 adam — chapter file structure (sgd.md, minibatch-sgd.md, momentum.md, adam.md) verified this session in the d2l-ai/d2l-en GitHub repo; adam.md fetched in full: derives Adam as momentum + per-coordinate scaling with explicit bias-correction treatment and ends with 4 exercises (incl. "construct a case for which Adam diverges"). Rendered at https://www.d2l.ai/chapter_optimization/ [repo-verified 2026-08-21]. (correctness 5, rigor 4, prereq fit 4, exercise compatibility 5, time 4 — runnable, plot-as-you-read)
2. CS231n notes "neural-networks-3" (training dynamics: SGD, momentum, RMSProp, Adam from the practitioner side; file confirmed in cs231n/cs231n.github.io repo; rendered at cs231n.github.io/neural-networks-3/ [rendered page not fetchable from sandbox]) — alternate explanation slot
3. Ruder, "An overview of gradient descent optimization algorithms" — canonical survey; URL/arXiv id not verifiable this session [unverified] — DEEPEN only if wanted after d2l 12.7–12.9

Community evidence:
- The repo's live-verified research report (docs/research/reports/dl-ml-resources.md, 2026-08-21) selected d2l ch 12 precisely for "implementation-first — you plot loss landscapes and code GD yourself"; d2l is free, PyTorch-era maintained, used by ~500 universities.
- Class Central snippet for the StatQuest GD video confirms it "covers Loss Functions, the Gradient Descent algorithm, and Stochastic Gradient Descent" — supporting the segment-reuse choice (https://www.classcentral.com/course/youtube-gradient-descent-step-by-step-133838)

Primary technical authority:
- d2l.ai ch 12 (Zhang, Lipton, Li, Smola) — repo's existing primary, kept; section mapping confirmed against source: 12.4 SGD · 12.5 minibatch SGD · 12.6 momentum · 12.10 Adam (+12.11 lr-scheduler for the schedules objective).

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold: write the three Adam update equations and say what problem each term solves; predict what batch size does to the loss curve's noise floor. 8 min.
- ORIENT: Re-play the SGD tail segment of StatQuest "Gradient Descent, Step-by-Step" (~4 min) — one image of "one point at a time" before the math.
- CORE WATCH: — (no sufficiently-scoped verified video exists for momentum/Adam; this node is read-and-build by design).
- CORE READ: d2l 12.4 (SGD) → 12.5 (minibatch, the noise/compute tradeoff figures) → 12.6 (momentum as leaky average, ravine demo) → 12.10 (Adam + bias correction), running the code as you read (~75 min).
- INTERACTIVE: `gradient-descent` widget — ravine landscape: β=0 oscillates, β≈0.9 glides; saddle landscape: see why "stuck in local minima" is the wrong fear. Do this BEFORE reading 12.6, then again after (~10 min).
- PRACTICE: d2l exercises: 12.10's "adjust the learning rate and analyze," "why does convergence need lr reduction," and "construct a case where Adam diverges (Yogi converges)"; node exercise: loss curves for batch ∈ {1, 16, full} with a written explanation of the observed noise floor.
- IMPLEMENT/DERIVE: Node implementation: SGD / SGD+momentum / Adam as interchangeable NumPy optimizer classes with one `step(params, grads)` interface; race all three on the SAME l3-classification logistic-regression problem across batch sizes; one figure, three curves per batch size.
- STUCK PATH: CS231n neural-networks-3 notes (practitioner re-telling of the same algorithms); the `gradient-descent` widget ravine again with the equations open side-by-side.
- DEEPEN: d2l 12.7 AdaGrad → 12.8 RMSProp → 12.9 Adadelta (the lineage that makes Adam's v-term inevitable) + 12.11 lr-scheduler; Ruder's survey [unverified URL] only if the family tree wants completing.
- PROVE IT: Node masteryTest verbatim: write Adam from its update equations from memory; show it matching a reference implementation's trajectory on a fixed seed (assert allclose on parameter traces).
- TRANSFER: Take your Adam back to l3-linear-regression's problem; drop β₂ from 0.999 → 0.9 and explain the resulting instability in terms of noisy v̂ estimates; then answer: why do BC/VLA training recipes default to AdamW with warmup rather than raw SGD (per-coordinate scale across heterogeneous parameter groups + early-step bias).
- RETENTION: +7 days: the diagnostic cold (three equations + what each term solves + why bias correction); +30 days: re-implement Adam's step() in ≤15 lines without reference.

Why this won: The repo's d2l primary is already the best-in-class choice for a build-it node — verified this session down to the section files and exercise lists — so the packet's job was granularity: exact section order, the widget as pre-reading intuition, d2l's own exercises promoted into PRACTICE, and a memory-to-allclose PROVE IT. No video carries momentum/Adam at the needed rigor in less time than d2l's own text; the honest call is CORE WATCH = none.
What was rejected (and why): Hunting a dedicated Adam video — search budget exhausted before verification, and d2l 12.10 (fetched, with derivation + exercises) already does it better for a learner who reads math. StatQuest SGD video as core — redundant with the already-watched GD video's SGD tail plus d2l 12.4–12.5. 3Blue1Brown ch 2 (gradient descent) — L2/linreg already own that intuition; adding it here is minutes without new mechanism.
Risk of superficial understanding: Adam-as-incantation. The learner can pass a multiple-choice quiz and still not know why bias correction exists. Gates: the from-memory trajectory-matching PROVE IT cannot be faked; the β₂ transfer experiment forces the v-term's meaning; the batch-size race makes the noise floor an observed fact.
Required active work: The three-optimizer race across batch sizes, the Adam-from-memory allclose test, d2l's divergence-construction exercise, and the β₂ instability write-up.
Last verified: 2026-08-21
