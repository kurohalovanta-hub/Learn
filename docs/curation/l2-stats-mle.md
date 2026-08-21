# l2-stats-mle — Estimation & Maximum Likelihood

Concept:
Likelihood vs probability; log-likelihood; the MLE recipe (write likelihood, take log,
differentiate, set to zero); MLE for Bernoulli and Gaussian by hand; sampling
variability and standard error; Bayesian updating with discrete priors as the other
estimation philosophy. The node's entire reason to exist on this path: "training a
model" IS maximum likelihood — cross-entropy is negative log-likelihood, least squares
is MLE under Gaussian noise. Per the curriculum guidance, formal statistics beyond
this (NHST, confidence-interval machinery, bootstrap) is deliberately excluded.

Learner prerequisites:
l2-random-variables (PMF/PDF, Bernoulli/Gaussian/exponential forms, expectation) and
l2-derivatives (differentiate, set to zero; log rules from l2-algebra). Gradient
notation from l2-multivariable helps for the two-parameter Gaussian MLE but a
one-parameter-at-a-time treatment works.

What beginners commonly misunderstand:
- Likelihood vs probability: same formula, different variable. Probability fixes θ and
  varies data; likelihood fixes the observed data and varies θ. The likelihood is not
  a pdf over θ and need not integrate to 1. (Widespread enough that StatQuest maintains
  a dedicated "Probability is not Likelihood" video.)
- "Why log?" — learners accept it as ritual. The real reasons: log is monotone (same
  argmax), turns products into sums (differentiable term-by-term), and prevents
  numerical underflow of 10⁻³⁰⁰-scale products.
- MLE of σ² divides by n, not n−1 — the MLE is biased, and that is fine here; sample
  variance vs MLE variance confuses everyone's first pass.
- Thinking the MLE is "the most probable θ" — that is MAP language; MLE says "the θ
  that makes the DATA most probable."
- Not seeing that minimizing a loss and maximizing likelihood are the same act with a
  sign flip and a log.

Candidate videos:
1. Maximum Likelihood, clearly explained!!! — StatQuest (Josh Starmer) — ~6 min
   [approx] — https://www.youtube.com/watch?v=XepXtl9YKwc
   (Jul 2017. The canonical gentle on-ramp: slide a Gaussian over data, watch the
   likelihood change. Correctness 5 at its scope, prereq fit 5, intuition 4, rigor 2
   — no derivation, which is exactly right for an ORIENT slot. Massive learner-success
   signal; datedness risk 0 — the math cannot date.)
2. Probability is not Likelihood. Find out why!!! — StatQuest — short [duration and
   direct URL unverified this session; locate via the video index
   https://statquest.org/video_index.html]
   (Existence and tagline confirmed via search. Directly targets misconception #1.)
3. Maximum Likelihood for the Binomial Distribution, Clearly Explained!!! — StatQuest —
   duration [unverified] — https://www.youtube.com/watch?v=4KKV9yZCoM4
   (Full p̂=k/n derivation on video — the node's first exercise, worked. STUCK PATH.)
4. Maximum Likelihood for the Exponential Distribution, Clearly Explained! V2.0 —
   StatQuest — duration [unverified] — https://www.youtube.com/watch?v=p3T-_LMrvBc
   (Matches the node's diagnostic question "MLE of λ for exponential data".)
5. Binomial distributions | Probabilities of probabilities, part 1 — 3Blue1Brown —
   ~12 min [approx] — https://www.youtube.com/watch?v=8idr1WZ1A7Q
   (Already watched in l2-random-variables; its likelihood-curve plots ARE this node's
   "plot the likelihood surface" exercise in animated form. Re-watch pointer, not a
   new slot.)

Candidate written resources:
1. MIT 18.05 S22 Reading 10b "Maximum Likelihood Estimates" (Orloff & Bloom) —
   https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class10-prep-b.pdf
   (THE core read: log-likelihood, worked discrete + continuous MLEs, exactly
   engineer-depth, ~10 pages.)
2. MIT 18.05 S22 Reading 10a "Introduction to Statistics" —
   https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class10-prep-a_pdf/
   (Short framing read: statistic vs parameter, point estimates.)
3. MIT 18.05 S22 Reading 11 "Bayesian Updating with Discrete Priors" —
   https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class11-prep.pdf
   (The update-table method — the exact mechanics of a discrete Bayes filter; bridges
   to kalman-1d later. Kept per the repo's "MLE + Bayesian updating classes".)
4. MIT 18.05 S22 Reading 12b "Bayesian Updating: Odds" —
   https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class12-prep-b.pdf
   (DEEPEN only.)
5. Wikipedia, "Maximum likelihood estimation" —
   https://en.wikipedia.org/wiki/Maximum_likelihood_estimation
   (Reference for properties — consistency, invariance — not a first read.)
6. Blitzstein & Hwang (Stat 110) — https://stat110.hsites.harvard.edu/ — for
   estimation-adjacent depth; note Stat 110 is probability-first and thin on MLE
   specifically, so it backs up the probability side more than this node.

Community evidence:
- StatQuest's MLE videos are the standard community answer for "MLE finally made
  sense"; learner-made summaries and study notes of exactly these videos circulate
  (e.g. https://glasp.co/youtube/p/maximum-likelihood-for-the-binomial-distribution-clearly-explained),
  and Class Central packages the Statistics Fundamentals playlist as a free course
  (https://www.classcentral.com/course/youtube-statistics-fundamentals-45654).
- The existence of a dedicated, popular "Probability is not Likelihood" video is
  itself field evidence of THE canonical confusion to pre-empt (confirmed via the
  Class Central StatQuest listing, https://www.classcentral.com/course/youtube-statquest-90294).
- 18.05's Pset 6 Problem 2 has students "use maximum likelihood estimates to develop
  Gauss' method of least squares" — the institutionally-sanctioned version of this
  node's mastery test, with solutions
  (https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_pset06.pdf).
- MIT OLL 18.05r provides auto-graded checkers through the statistics unit —
  https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.05r_10+2022_Summer/about

Primary technical authority:
- MIT 18.05 S22 Readings 10a + 10b (MLE) and 11 (Bayesian updating), with:
  - Pset 6 (Problem 1: continuous MLE / gamma-form likelihood; Problem 2: MLE ⇒ least
    squares) — https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_pset06.pdf
  - Class 10 in-class problems + solutions —
    https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class10_pset_sol.pdf
  - Exam 2 practice questions + solutions (MLE + Bayesian updating topics) —
    https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_prac_exam02a.pdf
    and …prac_exam02a_sol.pdf

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold (10 min): (a) "Why maximize LOG likelihood — give two reasons";
  (b) derive the MLE of λ for n exponential samples; (c) "is the likelihood a
  probability distribution over θ?" Clean on all three → skip to Pset 6 directly.
- ORIENT: StatQuest "Maximum Likelihood, clearly explained!!!"
  (https://www.youtube.com/watch?v=XepXtl9YKwc, ~6 min [approx]) + the "Probability is
  not Likelihood" short (via https://statquest.org/video_index.html). ≤ 12 min total.
- CORE WATCH: — (this node is a reading-and-deriving node; the ORIENT videos are the
  only screen time it needs).
- CORE READ: 18.05 Reading 10a (skim, ~10 min) then 10b in full with pencil (~40 min);
  Reading 11 (~30 min) after the MLE work is done.
- INTERACTIVE: gaussian-explorer — generate 20 noisy points, fit μ and σ by eye with
  the sliders, THEN compute μ̂, σ̂ by MLE and compare: the eye is good at μ,
  systematically bad at σ. Makes "the likelihood picks the curve" physical.
- PRACTICE: Class 10 in-class problems (with solutions) as warm-up; Pset 6 Problems
  1–2 as the main event; likelihood-surface plot for 10 vs 1000 coin flips (node
  exercise — watch it sharpen, connect to standard error); Exam 2 practice MLE
  questions for volume. ~2 h.
- IMPLEMENT/DERIVE: (1) Derive p̂=k/n (Bernoulli) and μ̂, σ̂² (Gaussian) from the
  log-likelihood on paper; (2) numerically maximize the same log-likelihoods with a
  grid/your l2-optimization GD and confirm agreement; (3) one Bayesian update table
  (Reading 11 style) for a coin with prior {0.4: fair, 0.6: biased}. ~90 min.
- STUCK PATH: StatQuest binomial-MLE (https://www.youtube.com/watch?v=4KKV9yZCoM4) and
  exponential-MLE (https://www.youtube.com/watch?v=p3T-_LMrvBc) walkthroughs — the
  same derivations narrated stroke by stroke.
- DEEPEN: 18.05 Reading 12b (odds form of updating); Wikipedia MLE properties section;
  Stat 110 for the probability underpinnings — only if the Level-3 loss-function
  lessons feel unmoored.
- PROVE IT: The node's mastery test, closed book, on paper: (1) assume yᵢ = axᵢ + b + εᵢ
  with ε ~ N(0, σ²); show maximizing the likelihood ⇔ minimizing Σ(yᵢ − axᵢ − b)² —
  then check yourself against the posted Pset 6 solution; (2) show that for binary
  labels under a Bernoulli model, NLL is exactly cross-entropy. Both from a blank page.
- TRANSFER: A depth sensor returns readings with occasional dropouts modeled as
  exponential inter-dropout times; given 12 observed gaps, estimate λ by MLE and give
  a standard-error-flavored statement of your uncertainty; explain what doubling the
  data does to the likelihood surface's width.
- RETENTION: +7 days: write from memory the three-line chain
  "cross-entropy = −Σ log p = NLL → minimizing it = MLE", and state the Gaussian-noise
  ⇒ least-squares correspondence in one sentence. +30 days (before Level-3 losses
  lesson): re-derive σ̂² and say why it divides by n.

Why this won:
Reading 10b + Pset 6 is a perfect-fit core: the pset's Problem 2 IS this node's mastery
test in official form with solutions for self-grading — no other free source scaffolds
"loss functions are MLE in disguise" this directly. StatQuest's two shorts are the
community-proven 12-minute on-ramp that pre-empts the likelihood-vs-probability trap
before the formalism. Bayesian updating (Reading 11) stays because the discrete update
table is the literal ancestor of the Bayes/Kalman filters on this path. Packet ≈ 5 h
of the 8 h budget. Formal-statistics creep (NHST, CIs, bootstrap) is excluded by
design per curriculum guidance.

What was rejected (and why):
- 18.05's NHST/confidence-interval/bootstrap classes — explicitly off-path; MLE and
  Bayesian updating are the only statistics this research path consumes directly.
- StatQuest "Maximum Likelihood for the Normal Distribution, step-by-step" as CORE —
  the full-length walkthrough would replace the learner's own derivation, which is the
  node's point; the shorter clips as STUCK PATH preserve the struggle.
- Stat 110 as this node's backup-in-practice — Blitzstein is probability-first and
  light on MLE mechanics; kept in the cluster for probability depth, not here.
- A cross-entropy/KL video (e.g. the often-recommended Aurélien Géron talk) — could
  not be verified this session (no URL surfaced in results); the NLL≡cross-entropy
  identity is fully covered by the PROVE IT derivation, so nothing is lost.
- mathematicalmonk / full lecture-length MLE treatments — measure-theoretic framing
  and length mismatch an 8 h node.

Risk of superficial understanding:
Highest in the cluster. MLE derivations follow a rhythm (log, differentiate, solve)
that can be mimicked without understanding what the likelihood function IS — the
learner can produce p̂=k/n and still fail "is likelihood a pdf over θ?". The
gaussian-explorer eye-fit-vs-MLE comparison and the transfer task (uncertainty
statement, surface width) test the concept, not the ritual. The PROVE IT derivations
are the node's whole payoff: if least-squares≡MLE is reproduced from memory a month
later, Level 3's loss functions arrive pre-explained.

Required active work:
Four hand derivations (Bernoulli, Gaussian, exponential, LS≡MLE); one numerical
maximization cross-check; one Bayesian update table; Pset 6 self-graded against
official solutions; likelihood-surface plots at two sample sizes.

Last verified: 2026-08-21
