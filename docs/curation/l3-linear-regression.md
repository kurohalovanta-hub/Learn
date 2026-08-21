# l3-linear-regression — Linear Regression From Scratch

Concept: ŷ = Xw + b with MSE loss; the two solution routes (normal equations vs gradient descent); feature scaling and why GD needs it; the MLE view (Gaussian noise ⇒ least squares). The first complete learn-from-data organism the learner builds.
Learner prerequisites: l3-ml-framing; l2-linear-maps (Xw as matrix–vector product), l2-optimization (gradients, descent), l2-stats-mle (likelihood). The ∇ math was already derived in L2 — this node makes it run.
What beginners commonly misunderstand:
- "Linear" means straight lines in x — missing that the model is linear in the PARAMETERS, so polynomial/feature-mapped regression is still linear regression.
- Gradient descent treated as magic dust: divergence from a too-big learning rate or unscaled features gets read as "broken data" instead of ill-conditioned loss geometry (the ravine).
- Normal equations memorized without knowing when they fail (singular/ill-conditioned XᵀX, huge d) or that GD and the closed form are answering the same question.
- MSE taken as arbitrary convention rather than the log-likelihood of a Gaussian noise model.

Candidate videos:
1. The Main Ideas of Fitting a Line to Data (a.k.a. Least Squares) — StatQuest — ~9 min [approx] — https://www.youtube.com/watch?v=PaFPbb66DxQ (prereq fit 5, clarity 5, intuition 5, rigor 2, time 5 — the residuals-to-loss picture with zero overhead; ideal ORIENT)
2. Gradient Descent, Step-by-Step — StatQuest — ~24 min [aggregator-stated] — https://www.youtube.com/watch?v=sDv4f4s2SB8 (correctness 5, clarity 5, intuition 5, rigor 3, time 4 — walks GD ON least squares exactly as this node implements it, ending with a first look at SGD; the single best-matched video for this node)
3. Linear Regression, Clearly Explained!!! — StatQuest — ~27 min [aggregator-stated] — https://www.youtube.com/watch?v=7ArmBVF2dCs (clarity 5, but R²/p-value/statistics-course emphasis — half off-target for an ML-track node; demoted to stuck-path)
4. Maximum Likelihood, clearly explained!!! — StatQuest — ~6 min [approx] — https://www.youtube.com/watch?v=XepXtl9YKwc (clarity 5, time 5 — pairs with the CS229 probabilistic-interpretation section for the Gaussian⇒MSE punchline)
(YouTube egress-blocked this session; all URLs above appeared in live search results. The two "aggregator-stated" durations came from Class Central/Glasp result snippets.)

Candidate written resources:
1. CS229 main notes Part I — LMS/gradient descent, the normal equations, and the probabilistic interpretation (Gaussian noise ⇒ least squares) — https://cs229.stanford.edu/main_notes.pdf [repo-verified 2026-08-21; 2026-08-18 revision] (correctness 5, rigor 5, prereq fit 3–4 after L2 math, time 4 — ~12 pages that this node exists to make executable)
2. MLU-Explain, "Linear Regression" — https://mlu-explain.github.io/linear-regression/ (URL verified via aws-samples/aws-mlu-explain README fetch; repo archived 2026-03, stable) — interactive residuals/fit visual, ~12 min (clarity 5, rigor 2 — alternate explanation slot)
3. d2l.ai ch 12.3 "Gradient Descent" (gd.md verified in d2l-ai/d2l-en repo this session; rendered under https://www.d2l.ai/chapter_optimization/ [repo-verified]) — learning-rate/conditioning experiments in runnable code; optional bridge to l3-sgd-optimizers.

Community evidence:
- Class Central lists the StatQuest GD video as a standalone course and its snippet pitches it as "for those already familiar with Least Squares and Linear Regression" — confirms the ORIENT→WATCH ordering used here (https://www.classcentral.com/course/youtube-gradient-descent-step-by-step-133838)
- Glasp holds learner-made summaries of both the linreg and GD videos — high self-study traffic (https://glasp.co/youtube/p/gradient-descent-step-by-step, https://glasp.co/youtube/p/linear-regression-clearly-explained)
- StatQuest's ML fundamentals repeatedly surface as the beginner path in practitioner blogs (https://paulvanderlaken.com/2019/04/01/statquest-statistical-concepts-clearly-explained/)

Primary technical authority:
- CS229 official lecture notes (Ng & Ma, Stanford), Part I: linear regression, LMS, normal equations, probabilistic interpretation — the repo's existing primary, kept.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold: write the model, the MSE loss, and ∇w L in matrix form; say when the normal equations fail. 8 min.
- ORIENT: StatQuest "Main Ideas of Fitting a Line to Data" (~9 min).
- CORE WATCH: StatQuest "Gradient Descent, Step-by-Step" (~24 min at 1.25×).
- CORE READ: CS229 Part I: LMS + normal equations + probabilistic interpretation (~45 min with pencil — re-derive ∇w L = (2/n)Xᵀ(Xw−y) yourself before he does).
- INTERACTIVE: `gradient-descent` widget — run bowl vs ravine landscapes; watch unscaled-feature geometry (the ravine) force a tiny learning rate; note what the β slider foreshadows for l3-sgd-optimizers. ~10 min.
- PRACTICE: Node exercises: (1) show GD diverging without feature scaling and converging with it; (2) polynomial features degree 1→15, train-vs-val error curves — the learner's first overfitting curve (feeds l3-generalization).
- IMPLEMENT/DERIVE: Node implementation: NumPy-only fit of synthetic + one real dataset by (a) normal equations, (b) own GD; overlay both fits; loss-curve plot. Derivation of ∇w L on paper goes in the same notebook.
- STUCK PATH: MLU-Explain "Linear Regression" interactive (~12 min); StatQuest "Linear Regression, Clearly Explained" (~27 min) if the least-squares/R² statistical view needs rebuilding; StatQuest "Maximum Likelihood" (~6 min) before re-reading the probabilistic interpretation if Gaussian⇒MSE won't land.
- DEEPEN: ISLP ch 3 (statlearning.com [repo-verified]) for the statistician's full treatment; d2l 12.3 GD section for conditioning experiments.
- PROVE IT: Node masteryTest verbatim: blank file → working linear regression via BOTH routes on unseen data, ∇L derivation on paper, no sklearn, no AI.
- TRANSFER: Fit a linear-in-parameters friction model τ = k₁ω + k₂·sign(ω) + k₃ to synthetic motor data with least squares — the point: "linear regression" fits nonlinear PHYSICS as long as parameters enter linearly, which is how classical robot system-ID actually works.
- RETENTION: +7 days: write ∇w MSE from memory; state the two failure modes of normal equations and the fix (regularize / use GD); +30 days: re-run the blank-file build in <30 min.

Why this won: The repo's CS229 primary is exactly right for the math; what it lacks for THIS learner (2–3 y academic gap) is a pictures-first on-ramp and a place to feel conditioning. The added StatQuest ORIENT/WATCH pair costs ~33 min and covers both, and the `gradient-descent` widget's ravine landscape turns "GD needs scaling" from a rule into an image. Everything else is unchanged node implementation work.
What was rejected (and why): StatQuest "Linear Regression, Clearly Explained" as core (27 min, R²/p-value emphasis is the statistics course, not the ML pipeline — stuck-path only). 3Blue1Brown-style calculus re-derivations (L2 already owns that). Khan Academy regression units (slower, spread across many clips, no matrix form). No additional video for normal equations found necessary — CS229's 1-page derivation plus the L2 linear-algebra base suffices.
Risk of superficial understanding: The learner can copy the closed form and believe GD "worked" because loss went down. Gates: the diagnostic demands the gradient from memory in matrix form; PROVE IT is a blank-file rebuild on unseen data; the divergence exercise forces meeting failure, not just success.
Required active work: Paper derivation of ∇w L; both-solvers NumPy build; the scaling-divergence and degree-sweep experiments; friction-model transfer fit.
Last verified: 2026-08-21
