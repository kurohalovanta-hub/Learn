# l3-classification — Logistic Regression & Cross-Entropy

Concept: Sigmoid turns a score into a probability; decision boundaries; cross-entropy as the Bernoulli MLE loss (not an arbitrary choice); softmax + logits vocabulary for multi-class — the exact loss family VLAs use over action tokens.
Learner prerequisites: l3-linear-regression (the (ŷ−y)x gradient pattern is about to reappear), l2-random-variables (Bernoulli, expectation), l2-stats-mle (log-likelihood).
What beginners commonly misunderstand:
- Sigmoid outputs read as confidence-flavored magic instead of a calibrated Bernoulli parameter fit by maximum likelihood.
- Why not MSE? Most learners can't give either reason (statistical: wrong noise model / not the Bernoulli MLE; optimization: sigmoid+MSE is non-convex with vanishing gradients at confident-wrong predictions).
- Logits vs probabilities blur — "the model outputs probabilities" — leading to double-softmax bugs and log(0) NaNs later.
- Naive softmax overflow with large logits (the subtract-max trick seems like superstition until you break the naive version).
- Surprise that ∂L/∂w has the same (ŷ−y)x form as linear regression — the GLM unity that CS229 makes explicit.

Candidate videos:
1. StatQuest: Logistic Regression — StatQuest (Josh Starmer) — ~9 min [approx] — https://www.youtube.com/watch?v=yIYKR4sgzI8 (prereq fit 5, clarity 5, intuition 5, rigor 2, time 5 — the S-curve + "maximum likelihood, not least squares" headline in minimum minutes)
2. Neural Networks Part 6: Cross Entropy — StatQuest — ~10 min [approx] — https://www.youtube.com/watch?v=6ArSys5qHAU (clarity 5, intuition 4, rigor 3 — why the log appears and why wrong-and-confident is punished hard; framed for NNs, transfers verbatim)
3. Odds and Log(Odds), Clearly Explained!!! — StatQuest — ~11 min [approx] — https://www.youtube.com/watch?v=ARfXDSkQf1Y (good if log-odds/logit vocabulary blocks; stuck-path)
4. Maximum Likelihood, clearly explained!!! — StatQuest — ~6 min [approx] — https://www.youtube.com/watch?v=XepXtl9YKwc (bridge back to l2-stats-mle before the CE-from-MLE derivation)
5. Neural Networks Part 5: ArgMax and SoftMax / The SoftMax Derivative, Step-by-Step!!! / Part 7: Cross Entropy Derivatives and Backpropagation — StatQuest — titles verified in playlist listings this session; individual URLs not surfaced [unverified — locate via the Neural Networks playlist https://www.youtube.com/playlist?list=PLjUC8HjyxGTSrn4cZEw9Uw8R0STaRcbYY or https://statquest.org/video_index.html]. Part 7 existence confirmed via https://www.classcentral.com/course/youtube-neural-networks-part-7-cross-entropy-derivatives-and-backpropagation-133820
(YouTube egress-blocked this session; URLs above appeared in live search results; durations [approx].)

Candidate written resources:
1. CS229 main notes Part II — logistic regression, the logistic loss as MLE, softmax regression via GLMs — https://cs229.stanford.edu/main_notes.pdf [repo-verified 2026-08-21; 2026-08-18 revision] (correctness 5, rigor 5, prereq fit 4 given L2 MLE work — the derivation the mastery test demands)
2. MLU-Explain, "Logistic Regression" — https://mlu-explain.github.io/logistic-regression/ (URL verified via aws-samples/aws-mlu-explain README fetch) — interactive boundary/sigmoid essay, ~12 min; alternate explanation slot
3. CS231n notes, "Linear Classification" (softmax classifier section; linear-classify.md confirmed in the cs231n/cs231n.github.io repo this session; rendered at cs231n.github.io/linear-classify/ [rendered page not fetchable from this sandbox]) — the ML-engineer's softmax/CE presentation with numerical-stability discussion; deepen slot

Community evidence:
- Glasp learner-summary pages exist for StatQuest Logistic Regression — heavy self-study usage (https://glasp.co/youtube/p/statquest-logistic-regression)
- StatQuest maintains a dedicated Logistic Regression playlist — the community's default remediation path when the single video isn't enough (https://www.youtube.com/playlist?list=PLblh5JKOoLUKxzEP5HA2d-Li7IJkHfXSe)
- HuggingFace forum learners recommend the StatQuest NN series (which hosts the CE/softmax videos) as the pre-math intuition layer (https://discuss.huggingface.co/t/neural-networks-video/20249)

Primary technical authority:
- CS229 official lecture notes Part II (Ng & Ma, Stanford) — repo's existing primary, kept: logistic regression + GLM/softmax with the MLE derivation.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold: sketch σ(z); write the binary CE loss; give ONE reason MSE is wrong for classification. 6 min.
- ORIENT: StatQuest "Logistic Regression" (~9 min).
- CORE WATCH: StatQuest "Neural Networks Part 6: Cross Entropy" (~10 min).
- CORE READ: CS229 Part II: logistic regression → derive the CE gradient alongside the notes and CONFIRM it reproduces (ŷ−y)x; then the softmax/GLM section for multi-class (~50 min with pencil).
- INTERACTIVE: — (no classification widget exists; the evolving-decision-boundary plot in IMPLEMENT is the interactive piece, built by the learner).
- PRACTICE: Node exercises: (1) derive ∂L/∂w for logistic regression and explain WHY the (ŷ−y)x form recurs (GLM link function cancellation); (2) implement stable softmax (subtract max) and break the naive version with logits ~1000.
- IMPLEMENT/DERIVE: Node implementation: NumPy logistic regression with GD on a 2D dataset, decision boundary re-plotted during training (evolving-boundary animation or frame grid).
- STUCK PATH: MLU-Explain "Logistic Regression" (~12 min interactive); StatQuest "Odds and Log(Odds)" (~11 min) if logit vocabulary is the blocker; StatQuest "Maximum Likelihood" (~6 min) then re-attempt the CE-from-Bernoulli-MLE derivation.
- DEEPEN: CS231n "Linear Classification" notes (softmax + stability); StatQuest SoftMax/CE-derivative videos via the NN playlist for a step-by-step derivative grind; ISLP ch 4 [repo-verified] for the statistician's view.
- PROVE IT: Node masteryTest verbatim: hand-derive the cross-entropy gradient, then from-scratch multi-class softmax regression on a 3-class toy set with the boundary plotted. No AI.
- TRANSFER: Frame a 3-action robot micro-policy (left / right / grip) as softmax classification over 2D states; train it; then answer in writing: why do VLAs use exactly this loss for action TOKENS, and what does a logit mean there?
- RETENTION: +7 days: the node diagnostic (both reasons CE-over-MSE: statistical + gradient) cold; +30 days: re-derive softmax-CE gradient ŷ−y in ≤10 lines.

Why this won: CS229 Part II already carries the load-bearing derivations (repo decision respected); the failure mode for this learner is arriving at those derivations without the sigmoid/CE mental pictures. Two short verified StatQuest videos (~19 min total) supply exactly those pictures per the §13 "micro-topic clarification, never full-curriculum replacement" rule, and every other minute goes to derivation and implementation, where the node's Gold gate lives.
What was rejected (and why): Non-StatQuest short logistic videos surfaced in search (e.g. "Logistic Regression Clearly Explained in 5 minutes", creator unidentifiable from results) — unverifiable authorship, and StatQuest already fills the slot. Andrew Ng Coursera classification week — 3–4 h for what CS229 does in 12 pages. StatQuest's full Logistic Regression playlist as core — R²-for-logistic/p-value content is statistics-course scope; playlist demoted to stuck-path pool.
Risk of superficial understanding: The learner can watch sigmoid videos and still be unable to produce the CE gradient — recognition trap is severe because the formulas are short. Gates: derivation is required twice (binary, then softmax), the same-form-as-linreg question forces the GLM insight into words, and the stable-softmax exercise makes numerical reality non-optional.
Required active work: Two paper derivations (binary CE gradient; softmax-CE gradient), the evolving-boundary NumPy build, the break-naive-softmax experiment, and the 3-action transfer write-up.
Last verified: 2026-08-21
