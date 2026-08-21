# l11-bc-dagger — Behavior Cloning & DAgger

Concept: Imitation as supervised learning on demonstrations — and why it is *not* just
supervised learning: the policy's own errors manufacture test states outside the training
distribution (covariate shift by feedback), compounding to O(εT²) worst-case regret; DAgger
repairs the data-collection loop (query the expert on the learner's states) to O(εT).

Learner prerequisites: l4-training-loop gold (can train a supervised net and read loss
curves), l10-mdp gold (states/actions/horizon language). The theory needs only expectation
notation and a union-bound-style argument — grade-10-math-safe with the lesson's derivation.

What beginners commonly misunderstand:
- "My validation loss is great, so the policy is good." Validation states come from the
  expert distribution; the failure lives on states only the *learner* visits — invisible in
  every offline metric. (The in-app bc-drift widget was built to make this visceral.)
- That more demonstrations fix drift. They only widen the covered band; the random-walk out
  of it still compounds — hence the demo-count scaling exercise plateaus.
- That DAgger changes the model or the loss. It changes *whose states get labeled* — same
  architecture, same loss, different data distribution.
- Reading εT² as a prediction rather than a worst-case bound (tightness discussion in
  Ross et al. §2).
- Conflating DAgger's practical cost (a queryable expert at learner states) with its
  algorithmic content — why it is cheap in sim (scripted expert) and expensive with humans.

Candidate videos:
1. CS 285: Lecture 2, Imitation Learning. Part 1 — Sergey Levine (RAIL, Fall-2023
   recording) — duration [unverified] — https://www.youtube.com/watch?v=tbLaFtYpWWU
   (correctness 5, authority 5, beginner fit 3 — assumes ML vocabulary the learner now has;
   the canonical treatment, by the field's central figure)
2. CS 285: Lecture 2, Imitation Learning. Part 5 — Levine — duration [unverified] —
   https://www.youtube.com/watch?v=awfrsjYnJmw (later part of the same lecture; per-part
   topic split [unverified] — locate the DAgger/theory part from the playlist index)
3. Full CS285 playlist, Fall 2022 —
   https://www.youtube.com/playlist?list=PL_iWQOsE6TfX7MaC6C3HcdOf1g337dlC9 — and Fall 2020
   — https://www.youtube.com/playlist?list=PL_iWQOsE6TfURIIhCrlt-wj9ByIVpbfGc (older
   recordings of the same Lecture 2 if the Fa23 links move)
4. Shorter third-party BC/DAgger explainer videos: none verifiable this session (web-search
   budget exhausted before video discovery; YouTube egress blocked) — fallback: the in-app
   lesson + bc-drift widget already fill the "intuition in 10 minutes" slot, which is why
   no ORIENT video is required.

Candidate written resources:
1. CS285 Lecture 2 slides (current course, "Supervised Learning of Behaviors") —
   https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-2.pdf (rigor 5, time
   efficiency 5 as a re-scan artifact after the video)
2. RobotForge, "Imitation learning 101: behavior cloning and DAgger" —
   https://robotforge.org/tutorials/learning/imitation-learning-basics (beginner fit 5;
   search-result content confirms it walks state/action recording, MSE/CE losses, the T²ε
   argument, and DAgger-as-recovery — a clean stuck-path read)
3. EmergentMind topic page, "Dataset Aggregation (DAgger) in Imitation Learning" —
   https://www.emergentmind.com/topics/dataset-aggregation-dagger (concise reference with
   paper links)
4. Branton DeMoss, "Imitation Learning Review" (Oxford) —
   https://www.robots.ox.ac.uk/~bdemoss/research_notes/ImitationLearning.pdf (rigor 4-5;
   DEEPEN material connecting BC→DAgger→IRL)
5. Community lecture notes for cross-checking your own notes: rubato-yeong CS285 §2 notes
   https://rubato-yeong.github.io/cs285/cs285-2/ ; Patrick Yin CS285 notes PDF
   https://patrickyin.me/undergrad_notes/img/CS285_Notes.pdf

Community evidence:
- csdiy.wiki course review of CS285: widely recommended self-study path but flagged as
  demanding — supports using *only* Lecture 2 + HW1 here, not the whole course yet
  (https://csdiy.wiki/en/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS285/)
- berkeleydeeprlcourse/homework_spring2026 verified live (updated May 2026): hw1 =
  `hw1_imitation`, modern uv-based workflow ("never run pip directly — always `uv run`"),
  W&B logging, optional Modal remote training — setup friction for a beginner is real but
  is itself curriculum (https://github.com/berkeleydeeprlcourse/homework_spring2026)
- The volume of "why does my BC policy fail at deployment" tutorial content (RobotForge,
  Medium's "Imitate with Caution" https://medium.com/analytics-vidhya/imitate-with-caution-offline-and-online-imitation-ee20de054fdb,
  https://shivanshmundra.github.io/post/imitation_learning/) confirms covariate shift is THE
  standard beginner wall — the node's framing is right.

Primary technical authority:
- Ross, Gordon, Bagnell 2011, "A Reduction of Imitation Learning to No-Regret Online
  Learning" — https://arxiv.org/abs/1011.0686 (repo-existing verified selection; the εT² vs
  εT theorems) + CS285 Lecture 2 + Spring-2026 HW1
  (https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw1 verified;
  handout https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf)

Selected shortest-sufficient packet:
- DIAGNOSTIC: node diagnostic cold: "Why does 1% per-step error destroy a 200-step episode?
  What exactly does DAgger change about the data distribution?" — written answer, 5 min.
- ORIENT: in-app lesson §why + §drive with the bc-drift widget labs (η sweep, band width,
  DAgger toggle, mean-|offset| strip) — 12 min.
- CORE WATCH: CS285 Lecture 2, Parts 1→5 at 1.25–1.5×
  (start https://www.youtube.com/watch?v=tbLaFtYpWWU, continue via playlist) — ≈60–75 min
  total [per-part durations unverified]. Watch WITH the εT² question in hand: Levine's
  tightrope-walker and the distribution-shift diagrams are the canonical pictures.
- CORE READ: DAgger paper §§1–3 + Theorem statements (skip no-regret machinery proofs on
  first pass) — 25 min; slides lec-2.pdf as re-scan — 10 min.
- INTERACTIVE: bc-drift (in-app).
- PRACTICE: node exercise — vary demo count 5→500 on HW1's BC, plot the scaling curve, and
  write one paragraph on where and *why* it plateaus (drift, not capacity).
- IMPLEMENT/DERIVE: Spring-2026 HW1 (uv workflow): BC on expert MuJoCo demos → measure gap
  vs expert → implement DAgger → recovery-across-iterations plot; separately, reproduce the
  εT² vs εT argument on paper from a blank page (~4 h total).
- STUCK PATH: RobotForge imitation-learning-basics (gentler walk of the same argument);
  EmergentMind DAgger page for a second compact statement.
- DEEPEN: DeMoss Imitation Learning Review PDF (BC→DAgger→IRL context); lecture slides'
  case studies.
- PROVE IT: node masteryTest — HW1-grade artifact: both algorithms implemented, the
  compounding-error story told with YOUR plots, T vs T² on paper, no notes.
- TRANSFER: read LeRobot's `il_robots` docs section on rollout strategies (verified: base /
  sentry / highlight / dagger) and write 10 lines mapping rollout-dagger onto Ross et al.'s
  loop — who is the expert, whose states get labeled, what replaces β-mixing. Optional
  spice: skim "Revisiting DAgger in the Era of LLM-Agents"
  (https://arxiv.org/pdf/2605.12913) to see the same fix reappearing outside robotics.
- RETENTION: +7 days: blank-page derivation of both bounds + one-sentence answer to "why
  can't validation loss see the failure?"; +30 days (during l12): explain why action
  chunking and DAgger attack the same T from opposite ends.

Why this won: Lecture 2 + HW1 is the canonical, currently-maintained (Spring 2026, verified
today) pairing of exactly this node's three objectives, from the field's central authority —
and the in-app lesson + bc-drift widget already supply the fast-intuition layer a shorter
video would have added. Packet ≈ 2 h explanation + ~4–5 h HW ≈ node's 6 h.

What was rejected (and why): watching more of CS285 now (only Lecture 2 is on the critical
path; the rest belongs to L10's plan); third-party explainer videos (none verifiable this
session; redundant with widget + RobotForge text); assignment-solution repos (poison the
mastery claim); the analytics-vidhya Medium post as core (fine as ambient reading, weaker
rigor than RobotForge/DeMoss).

Risk of superficial understanding: the theory is memorizable as a slogan ("errors compound")
without the mechanism. Guards: the widget's η/band experiments demand *mechanistic*
predictions; the scaling-curve exercise falsifies "more data fixes it"; the blank-page bound
derivation separates recognition from mastery.

Required active work: HW1 BC+DAgger implementation with your own plots, demo-count scaling
study, blank-page εT²/εT derivation, and the rollout-dagger mapping memo.

Last verified: 2026-08-21
