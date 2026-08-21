# l2-random-variables — Random Variables, Expectation & Gaussians

Concept:
Discrete/continuous random variables (PMF/PDF/CDF); expectation, variance, covariance;
linearity of expectation; the distribution zoo (Bernoulli, binomial, uniform,
exponential, Gaussian); LLN and CLT. This is the vocabulary layer: losses are
expectations, policies are distributions, sensor noise is Gaussian, and eval variance
across rollouts is the CLT wearing a lab coat.

Learner prerequisites:
l2-probability (conditioning, independence) and l2-integrals (∫ as area, u-substitution
— enough to read ∫x p(x)dx; the Gaussian normalizing constant is NOT derived here).
NumPy for histogram/simulation work.

What beginners commonly misunderstand:
- A pdf value is not a probability: densities can exceed 1, and P(X=x)=0 for continuous
  X (the "probability 0 ≠ impossible" confusion — 3b1b made a whole video on it).
- E[X+Y]=E[X]+E[Y] holds even for DEPENDENT variables — but Var(X+Y) needs the
  covariance term; learners overgeneralize one or the other.
- Var(aX+b): the b vanishing and the a² both surprise beginners.
- CLT confusion: believing "everything becomes normal" (it is sums/means that do), and
  confusing the distribution of the sample mean with the data distribution.
- Reading N(μ, σ²) notation inconsistently (σ vs σ²) across sources.

Candidate videos:
1. But what is the Central Limit Theorem? — 3Blue1Brown — 31 min (confirmed) —
   https://www.youtube.com/watch?v=zeJD6dqJ5lo
   (Mar 2023. Builds the CLT from Galton-board convolutions to the σ/√n scaling.
   Correctness 5, intuition 5, rigor 4, prereq fit 4; long but the topic earns it —
   this is the node's conceptual centerpiece and directly explains why 50-rollout
   evals wobble. Community success signal very high.)
2. Binomial distributions | Probabilities of probabilities, part 1 — 3Blue1Brown —
   ~12 min [approx] — https://www.youtube.com/watch?v=8idr1WZ1A7Q
   (Mar 2020. Likelihood-flavored binomial build-up; doubles as a preview of MLE for
   l2-stats-mle. Strong candidate for ORIENT.)
3. Why "probability of 0" does not mean "impossible" | Probabilities of probabilities,
   part 2 — 3Blue1Brown — duration [unverified] —
   https://www.youtube.com/watch?v=ZA4JkHKZM50
   (Exactly the pdf-vs-probability misconception; densities introduced honestly.
   Short-list for STUCK PATH on continuous RVs.)
4. StatQuest statistics fundamentals (normal distribution, expected values) — Josh
   Starmer — durations [unverified] — index at https://statquest.org/video_index.html
   (Gentle alternate voice; individual video URLs not verified this session — locate
   via the index. Slower per insight than 3b1b for this learner.)
5. Understanding the Central Limit Theorem with 3Blue1Brown & Neil deGrasse Tyson
   (StarTalk short) — https://www.youtube.com/shorts/I6APD28_PDg
   (Fun 60s hook only; no instructional value beyond motivation.)

Candidate written resources:
1. MIT 18.05 S22 Readings 4a–7b (the node's spine), all confirmed live:
   - 4a Discrete Random Variables —
     https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class04-prep-a.pdf
   - 4b Discrete RVs: Expected Value —
     https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class04-prep-b.pdf
   - 5a Variance of Discrete RVs —
     https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class05-prep-a.pdf
   - 5b Continuous Random Variables —
     https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class05-prep-b.pdf
   - 5c Gallery of Continuous RVs —
     https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class05-prep-c.pdf
   - 6a Expectation/Variance/SD for Continuous RVs —
     https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class06-prep-a.pdf
   - 6b Central Limit Theorem and Law of Large Numbers —
     https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class06-prep-b.pdf
   - 7a Joint Distributions, Independence — via readings page
     https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/readings/
     (also mirrored as an OLL asset PDF, confirmed)
   - 7b Covariance and Correlation —
     https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class07-prep-b.pdf
2. Seeing Theory Ch 3 "Probability Distributions" [chapter title unverified this
   session] — https://seeing-theory.brown.edu/ (drag-a-distribution play; CLT demo).
3. Blitzstein & Hwang (Stat 110) ch 3–5, 7 — https://stat110.hsites.harvard.edu/
   (Backup depth; the expectation chapter's story-proofs are the best in print.)

Community evidence:
- The 3b1b CLT video is widely cited as the explanation that made the CLT concrete
  (external writeups analyze it point by point, e.g. Physics of Risk:
  https://rf.mokslasplius.lt/3blue1brown-central-limit-theorem/); Class Central lists
  it as a standalone free course
  (https://www.classcentral.com/course/youtube-but-what-is-the-central-limit-theorem-142863).
- Seeing Theory's HN reception (https://news.ycombinator.com/item?id=13735714):
  visualization praised for making distributions tangible — with the standing caveat
  that clicking is not competence.
- MIT's own interactive 18.05r port (reading questions + problem checkers per unit)
  is the institutionally-endorsed self-study wrapper for these exact readings —
  https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.05r_10+2022_Summer/about
- Self-learner completion account of 18.05 (S. T. Lanier, Medium) —
  https://medium.com/swlh/mit-18-05-873f15aec11d [existence verified; body unfetchable
  this session].

Primary technical authority:
- MIT 18.05 S22 Readings 4a–7b (above) with Problem Sets 2, 4, 5:
  - Pset 2 topics confirmed: variance of discrete RVs, continuous RVs.
  - Pset 3 solutions live —
    https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_pset03_sol.pdf
  - Pset 4 (CLT estimates, transformations of RVs) solutions —
    https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_pset04_sol.pdf
  - Pset 5 (joint CDFs, covariance, correlation) solutions —
    https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_pset05_sol.pdf
  - Problem-sets index —
    https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/pages/problem-sets

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold (10 min): Var(3X−2) in terms of Var(X); E[X+Y] for dependent X,Y —
  legal or not?; sketch N(2, 0.25) marking the ±1σ mass; "the pdf of X at 0.3 is 2.4 —
  is that a probability?" All four clean → jump to PRACTICE psets.
- ORIENT: 3b1b "Binomial distributions" (https://www.youtube.com/watch?v=8idr1WZ1A7Q,
  ~12 min [approx]) — builds the PMF habit and quietly pre-loads likelihood for
  l2-stats-mle; plus 10 min of Seeing Theory distribution play.
- CORE WATCH: 3b1b "But what is the Central Limit Theorem?"
  (https://www.youtube.com/watch?v=zeJD6dqJ5lo), full 31 min, AFTER Readings 4a–5c and
  BEFORE Reading 6b — the video supplies the picture, 6b then reads as confirmation.
- CORE READ: 18.05 Readings in two passes (~2 h total): full read of 4a, 4b, 5a, 5b,
  6b, 7b; targeted read of 5c (uniform, exponential, normal entries only) and 6a
  (definitions + the E/Var table); skim 7a for joint-PMF mechanics only. Do the
  embedded reading questions.
- INTERACTIVE: gaussian-explorer — drag μ and σ, watch the pdf/CDF respond; verify the
  ±1σ ≈ 68% claim the l2-integrals node discovered numerically; then match the widget
  Gaussian to a histogram of your own simulated sensor noise.
- PRACTICE: Pset 2 (variance + continuous RVs) and pset 4's CLT-estimate problems in
  full; from pset 5 the covariance/correlation problems (skip joint-CDF technicalities
  beyond one worked problem); check everything against the posted solutions; OLL
  checkers for instant feedback. ~3 h.
- IMPLEMENT/DERIVE: The node's three exercises, kept exactly: (1) empirically verify
  linearity of expectation on DEPENDENT variables (X, X² on the same draws); (2) sum
  n uniforms for n=1,2,5,30 and watch the CLT emerge in histograms (overlay the
  matching Gaussian using your μ, σ formulas); (3) fit a Gaussian to noisy sensor data
  via μ̂, σ̂ and overlay it. ~90 min.
- STUCK PATH: 3b1b "probability of 0 ≠ impossible"
  (https://www.youtube.com/watch?v=ZA4JkHKZM50) for the pdf/density block; StatQuest
  normal-distribution videos via https://statquest.org/video_index.html for a slower
  second voice; Stat 110 ch 4 for expectation story-proofs.
- DEEPEN: Stat 110 ch 5 + 7 (universality of the uniform; MVN preview) — only if the
  Kalman/GP road ahead starts to strain; 18.05 Reading 7a in full for joint densities.
- PROVE IT: The node's mastery test, unassisted: derive E and Var of a Bernoulli and a
  uniform from definitions; then simulate a 50-rollout policy evaluation twice (p=0.7
  success), get different success rates, and explain the discrepancy quantitatively
  with the CLT (σ/√n), stating how many rollouts halve the error bar.
- TRANSFER: An IMU gives z = true + ε, ε~N(0, σ²). Averaging k readings: what is the
  distribution of the mean, and how many readings for a 95% interval of ±0.1σ? Then
  the inverse question: your robot's grasp success differs 8 points between two
  20-trial evals — is that signal or noise?
- RETENTION: +7 days: from memory, write the Gaussian pdf, state Var(aX+b), and answer
  "why do means of many rollouts stabilize?" in two sentences (LLN + CLT, correctly
  attributed).

Why this won:
The 18.05 readings are the only free text at the right depth with per-reading
self-checks and solved psets that map one-to-one onto this node's objective list
(4a→PMF, 4b/5a→E/Var, 5b/5c→pdf+zoo, 6b→LLN/CLT, 7b→covariance). The 31-minute 3b1b
CLT video is the one long watch that pays for itself: it is the exact concept this
node's mastery test (rollout-eval variance) hinges on. Packet ≈ 7.5 h of the 10 h
budget. gaussian-explorer slots here as the designated cluster widget.

What was rejected (and why):
- Full sequential read of all nine readings — 7a joint densities and 6a's
  integration-heavy middle are trimmed to targeted reads; the robotics path needs
  covariance fluency (7b) more than joint-CDF manipulation.
- 3b1b "Why π is in the normal distribution" / convolution videos — gorgeous, but
  deriving the normalizing constant is not on the critical path; DEEPEN-shelf at best.
- StatQuest as primary video track — five short videos ≈ one 3b1b in coverage but
  without the connected picture; kept as stuck-path voice.
- Stat 110 as primary — ch 3–5 alone exceed this node's entire hour budget.
- Khan Academy random-variables unit — pacing mismatch for this learner.

Risk of superficial understanding:
The distribution zoo invites flashcard memory that dissolves on contact ("which one is
exponential for?"). Higher risk: CLT recognition without the σ/√n number — the learner
can narrate "means stabilize" yet still not compute how many rollouts an eval needs.
Every check above forces the quantitative form. The dependent-variables linearity
exercise exists precisely to break the "I already knew that" illusion.

Required active work:
Three NumPy experiments with plots; psets 2/4/5 selections on paper against solutions;
widget-to-histogram Gaussian match; closed-book Bernoulli/uniform derivations; the
two-eval rollout explanation written out with numbers.

Last verified: 2026-08-21
