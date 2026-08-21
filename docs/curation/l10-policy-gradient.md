# l10-policy-gradient — Policy Gradients & GAE, Derived

Concept: Optimizing the policy directly: the log-derivative (score-function) trick, REINFORCE derived end-to-end, why the estimator is high-variance, reward-to-go, the EGLP lemma, baselines proved unbiased, advantage A = Q − V, and GAE's λ as the bias–variance dial. The derivation is the deliverable — this is the mathematical spine under PPO and under how VLAs are RL-fine-tuned in 2026.

Learner prerequisites: l10-mdp Gold (trajectory expectations), l3-backprop-theory Gold (∇ log, chain rule, expectations of gradients). Fresh off l10-tabular: knows values/TD — must now *not* confuse the PG estimator with a TD update.

What beginners commonly misunderstand:
- Why you can't push ∇_θ through E_{τ∼π_θ}[R(τ)] directly (the distribution depends on θ) — the whole trick exists to fix exactly this, yet most first passes memorize the trick without the blocking problem.
- The estimator is *unbiased but noisy*: learners see one bad CartPole run and conclude "PG is broken" instead of "variance is the enemy" — hence this node measures the variance instead of asserting it.
- Baselines: the near-magical fact that subtracting b(s) changes variance but not the expectation — believed only after proving E[∇log π · b] = 0 (EGLP) themselves.
- Advantage vs reward-to-go vs return: three drop-in weights for the same ∇log π term; keeping their bias/variance trade straight is the point of GAE's λ.
- Sign/credit confusion: PG *increases log-probability of actions in proportion to how good their outcomes were* — not "rewards good episodes" (per-timestep credit via reward-to-go is the fix, and the derivation shows why past rewards drop out).

Candidate videos:
1. Policy Gradient Methods video — Mutual Information — ~25 min [duration unverified] — in playlist https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr (companion dir `policy_gradient_methods` verified via github.com/Duane321/mutual_information). S&B Ch-13-aligned, visual, derivation-respecting — the right first watch under §15.
2. CS285 "Policy Gradients" lecture (Lec 5 in recent numbering [lecture numbering varies by year]) — Sergey Levine — ~1.5 h of parts — course https://rail.eecs.berkeley.edu/deeprlcourse/ (Rigor 5, robotics framing 5; but it is a graduate lecture assuming ML maturity — per HANDOVERFINAL §15 and Berkeley's own prerequisites, wrong as *first* exposure; scored best as consolidation AFTER the learner has the derivation.)
3. CS285 "Actor-Critic" lecture (Lec 6 [numbering unverified]) — same course (GAE and value-baseline material lives here; same sequencing verdict).
4. Shiyu Zhao lectures Ch 9 "Policy Gradient Methods" — https://www.youtube.com/playlist?list=PLEhdbSEZZbDaFWPX4gehhwB9vJZJ1DNm8 (Rigor 5; slower, proof-complete; strong stuck-path).
5. DeepMind x UCL 2018 policy-gradient lecture — https://www.youtube.com/playlist?list=PLqYmG7hTraZBKeNJ-JE_eyJHZ7XgBoAyb (long-form; subsumed by the above; rejected on time efficiency).

Candidate written resources:
1. Spinning Up "Part 3: Intro to Policy Optimization" — https://spinningup.openai.com/en/latest/ [base URL repo-verified; page title and full contents verified this session via GitHub fetch of docs/spinningup/rl_intro3.rst: derives the simplest policy gradient via the log-derivative trick, EGLP lemma ("E[∇_θ log P_θ(x)] = 0"), reward-to-go ("Don't Let the Past Distract You"), baselines ("The most common choice of baseline is the on-policy value function"), with runnable minimal PyTorch code; section list: Deriving the Simplest Policy Gradient / Implementing it / EGLP / Reward-to-Go / Baselines / Other Forms / Recap]. Companion proof pages exist (extra_pg_proof1.rst, extra_pg_proof2.rst — confirmed in repo). The single best beginner-honest derivation document in the field.
2. Sutton & Barto Ch 13 "Policy Gradient Methods" (§13.1–13.4: policy approximation, the policy gradient theorem, REINFORCE, REINFORCE-with-baseline) — PDF http://incompleteideas.net/book/RLbook2020.pdf (the theorem's canonical statement; pairs 1:1 with the Mutual Information video).
3. Schulman et al., "High-Dimensional Continuous Control Using Generalized Advantage Estimation" — https://arxiv.org/abs/1506.02438 [URL verified via fetched Spinning Up vpg.rst/ppo.rst references] (GAE's source; read §1–3 for the λ-estimator and the bias–variance argument).
4. Sutton et al. 2000, "Policy Gradient Methods for RL with Function Approximation" — https://papers.nips.cc/paper/1713-policy-gradient-methods-for-reinforcement-learning-with-function-approximation.pdf [URL verified via fetched vpg.rst] (the original theorem — DEEPEN-only).
5. Schulman thesis, "Optimizing Expectations" — http://joschu.net/docs/thesis.pdf [URL verified via fetched vpg.rst] (unifies score-function/pathwise estimators; DEEPEN).
6. Lilian Weng's policy-gradient survey post — widely recommended, but its URL could not be verified this session (lilianweng.github.io proxy-blocked): not included; fallback: resources 1–3 cover the same ground.

Community evidence:
- Berkeley's own CS285 syllabus: "CS189 or equivalent is a prerequisite... will assume some familiarity with reinforcement learning, numerical optimization and machine learning," directing newcomers to CS188 + S&B first (https://rail.eecs.berkeley.edu/deeprlcourse-fa20/syllabus, https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/) — first-exposure PG from CS285 contradicts the course's own assumptions.
- csdiy.wiki on CS285: heavy formula load, background recommended (https://csdiy.wiki/en/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS285/); a learner compendium exists precisely because people need scaffolding (https://medium.com/@weijunmingjeremy/cs-285-deep-rl-compendium-1e7fed2da114).
- ADGEfficiency/rl-resources beginner build order: "...cross entropy method → REINFORCE → DQN → PPO..." — REINFORCE-from-scratch before anything fancy [GitHub-fetch verified] (https://github.com/ADGEfficiency/rl-resources).
- Spinning Up's whole existence is OpenAI's institutional answer to "deep-RL courses assume too much"; its Part-3 derivation + minimal code remains the community's default "finally made PG click" reference (base URL repo-verified; contents fetch-verified). (reddit/HN threads unreachable via session proxy — evidence via syllabi, wikis, curated lists.)

Primary technical authority:
- Sutton & Barto Ch 13 (policy gradient theorem) + Schulman et al. 2016 (GAE, arXiv:1506.02438). Spinning Up Part 3 is the teaching text; equations trace to these two.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, on paper: "You want ∇_θ E_{x∼p_θ}[f(x)]. Why can't you just differentiate inside the expectation? Get as far as you can." (8 min — sets up the trick as the answer to a felt problem.)
- ORIENT: Mutual Information "Policy Gradient Methods" video — playlist https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr (~25 min [unverified]).
- CORE WATCH: — (the core of this node is a derivation done by hand, not a lecture; CS285 deliberately deferred to DEEPEN).
- CORE READ: Spinning Up Part 3 worked line-by-line with pen mirroring every step (log-derivative trick → simplest PG → EGLP → reward-to-go → baseline), then S&B §13.1–13.4 for the theorem statement proper, then GAE paper §1–3 (~2–2.5 h total).
- INTERACTIVE: — (no existing widget matches score-function estimation; gridworld-value is value-side only — do not force it).
- PRACTICE: (a) Reproduce the full ∇J derivation closed-book including the EGLP/baseline-unbiasedness step (the node's exercise). (b) Predict-then-verify: does replacing full return with reward-to-go change the *expectation* or the *variance*? Prove which. (c) GAE by hand on a 3-step toy trajectory for λ=0 and λ=1, showing TD(0)-advantage and MC-advantage fall out as the endpoints. (~90 min)
- IMPLEMENT/DERIVE: The node's implementation verbatim: REINFORCE from scratch on CartPole → add learned V baseline → *measure* gradient-estimate variance with/without baseline and plot it; then implement GAE and sweep λ ∈ {0, 0.9, 0.95, 1}. Validate the no-baseline/baseline gap is visible across ≥3 seeds. (~3.5 h)
- STUCK PATH: Shiyu Zhao Ch 9 lectures (slow, proof-complete PG derivation) — https://www.youtube.com/playlist?list=PLEhdbSEZZbDaFWPX4gehhwB9vJZJ1DNm8; plus Spinning Up's extra PG proof pages (repo-confirmed) for the two steps most often stuck on.
- DEEPEN: NOW CS285 — "Policy Gradients" + "Actor-Critic" lectures (https://rail.eecs.berkeley.edu/deeprlcourse/) as consolidation and robotics framing, watched at 1.25–1.5×; optionally CS285 HW2 from https://github.com/berkeleydeeprlcourse/homework_spring2026 [hw2 dir fetch-confirmed; its PG topic is the course's tradition — topic label unverified]; Sutton et al. 2000 and the Schulman thesis for the estimator-zoo view.
- PROVE IT: Node masteryTest verbatim: the full derivation reproduced closed-book + REINFORCE-with-baseline working + your measured variance-reduction plot, all three presented together.
- TRANSFER: Use the score-function trick *outside RL*: write the gradient estimator for a non-differentiable objective (e.g., expected edit-distance of sampled token sequences), and state in two sentences when you'd prefer reparameterization instead — this is the exact PG-vs-reparam fork that returns in l10-sac.
- RETENTION: +14 days: write the policy-gradient theorem from memory, prove baseline unbiasedness in ≤5 lines, and answer "λ=0 vs λ=1 gives you what?" (12 min.)

Why this won: This is the node where HANDOVERFINAL §15 explicitly overrides the repo. Beginners hitting CS285 Lec 4–6 as first PG exposure stall on assumed ML maturity (Berkeley's own syllabus says so; community wikis corroborate); the §15 sequence — gentle complete derivation (Spinning Up Part 3, contents fetch-verified) + S&B Ch 13 + simple from-scratch REINFORCE FIRST, CS285 after — preserves all of the rigor (nothing in the derivation is simplified) while cutting the failure mode. Packet ≈ 25 min video + ~2.5 h derivation reading + ~5 h active work ≈ node's 7 h.

What was rejected (and why): CS285 Lec 4–6 as PRIMARY (the repo's current binding) — demoted to DEEPEN per §15; retained there because Levine's robotics framing and the actor-critic lecture's GAE treatment are genuinely the best consolidation once the learner owns the derivation. DeepMind x UCL PG lecture — length without added derivation value. Lilian Weng's PG post — unverifiable URL this session (proxy), and redundant given Spinning Up Part 3. Karpathy's "Pong from Pixels" essay — classic motivation but URL unverifiable this session and its from-pixels scope belongs to a later stage: none found — fallback: Spinning Up Part 3's own minimal implementation section.

Risk of superficial understanding: Highest in the cluster. The derivation reads smoothly (every step is elementary), producing strong recognition-illusion; and a REINFORCE that "trains CartPole" can be cargo-culted from the Spinning Up code without owning a single expectation step. Mitigations built in: closed-book reproduction gate, the *measured* variance plot (can't be faked by copying), the λ-endpoint hand-check, and heavy-AI-assistance honesty rule (assisted derivation caps below Gold per project policy).

Required active work: Closed-book ∇J derivation with baseline proof; REINFORCE + baseline + GAE implemented from a blank file; variance measured (not asserted) across seeds; λ sweep; score-function transfer exercise; +14-day retention proof.

Repo-binding note (HANDOVERFINAL §15) — EXPLICIT OVERRIDE: The repo currently binds `primary: cs285, Lectures 4–6` for this node. Per §15 (community evidence: CS285 too hard as first exposure), this record replaces the primary with Spinning Up "Intro to Policy Optimization" + S&B Ch 13 + from-scratch REINFORCE, and moves CS285 Lec 5–6 to DEEPEN (post-derivation consolidation). Suggested repo edit when content is updated: `primary: { resourceId: "spinningup-essays", sections: "Intro to Policy Optimization — worked line-by-line" }`, `backup: { resourceId: "sutton-barto", sections: "Ch 13.1–13.4" }`, with cs285 referenced in a deepen/notes field; the spinningup-essays record's skipParts ("THE CODE") should be relaxed to permit Part 3's minimal PG snippets, which are pedagogical, not the deprecated TF1 library code.

Last verified: 2026-08-21
