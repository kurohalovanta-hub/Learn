# l10-sac — SAC & Continuous Control

Concept: Maximum-entropy RL: optimize return *plus* policy entropy (J(π) = E[Σ r_t + α H(π(·|s_t))]); off-policy actor-critic with a replay buffer; twin critics with the clipped double-Q trick; target networks; squashed-Gaussian (tanh) policies with the log-prob correction; the reparameterization trick (vs the score-function trick from l10-policy-gradient); automatic temperature tuning. The sample-efficient pole of model-free RL — the algorithm inside HIL-SERL and most real-robot RL.

Learner prerequisites: l10-ppo Gold (on-policy world fully owned — SAC is understood by *contrast*), l10-tabular's off-policy Q-learning intuition (SAC is its deep, continuous, entropy-regularized descendant), replay/target-network stabilizers from l10-dqn.

What beginners commonly misunderstand:
- Why "be good AND stay random" is an objective, not a hack: entropy is *in* the return, so values, Bellman backups, and the optimal policy all change — it's a different MDP objective, not exploration noise bolted on.
- Reparameterization vs log-derivative: a = tanh(μ_θ(s) + σ_θ(s)·ξ) makes the pathwise gradient flow *through the critic*, which is why SAC's policy gradient is low-variance where REINFORCE's isn't — the exact fork previewed in the PG node's transfer task.
- The tanh log-prob correction: forgetting the change-of-variables term is the classic silent SAC bug (entropy estimates wrong → temperature loop miscalibrates).
- Twin critics: min(Q1,Q2) fights overestimation bias under max/soft-max backup — learners who skipped the "why does Q-learning overestimate" question can't say what breaks with one critic.
- Off-policy ≠ free lunch: replay reuse gives sample efficiency but couples everything to critic accuracy — SAC is touchier per-hyperparameter than PPO, which the node's comparative study makes visceral.

Candidate videos:
- None selected. No SAC explainer could be verified end-to-end this session (YouTube fetch blocked; search budget exhausted before a quality SAC-specific video with checkable creator/duration surfaced; the Mutual Information series' verified companion dirs stop at function approximation — no SAC episode). This node is code-and-paper-shaped anyway: the two texts below plus a 324-line reference file are shorter than any lecture. Fallback per rule: none found — fallback: CS285 course materials on soft/actor-critic methods via https://rail.eecs.berkeley.edu/deeprlcourse/ if a lecture is wanted [specific lecture unverified].

Candidate written resources:
1. Spinning Up "Soft Actor-Critic" page — https://spinningup.openai.com/en/latest/ [base URL repo-verified; algorithms/sac.rst fetch-verified this session: entropy-regularized RL ("a bonus reward at each time step proportional to the entropy of the policy"), clipped double-Q, squashed Gaussian with state-dependent σ, reparameterization as differentiable sampling] (Clarity 5, rigor 4, ~45 min careful read — the best single explanation of the max-ent machinery; its code remains SKIP per repo policy).
2. CleanRL `sac_continuous_action.py` (~324 lines) — https://github.com/vwxyzjn/cleanrl [fetched] with docs deep link https://docs.cleanrl.dev/rl-algorithms/sac/#sac_continuous_actionpy [quoted from the file's own header docstring, fetch-verified] (the implementation textbook: twin Q, reparameterized actor, auto-α, replay — every objective term visible in one file).
3. Haarnoja et al., "Soft Actor-Critic Algorithms and Applications" — https://arxiv.org/abs/1812.05905 [URL verified via fetched sac.rst] (the practical/modern SAC: automatic temperature tuning lives here — read the temperature-objective section).
4. Haarnoja et al., "Soft Actor-Critic: Off-Policy Maximum Entropy Deep RL with a Stochastic Actor" — https://arxiv.org/abs/1801.01290 [verified via sac.rst] (original derivation from soft policy iteration; DEEPEN).
5. Haarnoja et al., "Learning to Walk via Deep Reinforcement Learning" — https://arxiv.org/abs/1812.11103 [verified via sac.rst] (SAC on a real quadruped in hours — the robotics payoff read; DEEPEN, 20 min skim).

Community evidence:
- CleanRL's benchmarked single-file SAC is the community's default readable reference (repo fetched; 10.3k★ per repo research report), and SBX (SB3-author JAX baselines) exists as the sanity-check oracle the repo research already selected (docs/research/reports/rl-sim-stacks.md).
- LeRobot HIL-SERL — the 2025–26 real-robot RL recipe — is SAC + human interventions (Luo et al.; repo research report, fetch-verified there): the strongest "this algorithm still matters for embodied work" signal available.
- ADGEfficiency/rl-resources build order terminates at "...PPO → SAC" — the community's from-scratch endpoint matches this node's position [GitHub-fetch verified] (https://github.com/ADGEfficiency/rl-resources).
- (reddit/HN threads unreachable via session proxy; no additional learner-retrospective evidence could be verified for SAC specifically this session.)

Primary technical authority:
- Haarnoja et al. 2018 (arXiv:1801.01290 + 1812.05905) — objective, soft Bellman backup, temperature tuning; Spinning Up SAC page as the faithful teaching rendering; CleanRL curves as empirical oracle.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, written: "Why could tabular Q-learning learn from any behavior policy's data, while your PPO must throw rollouts away after one update cycle? And what did PPO's importance ratio buy that a replay buffer can't?" (8 min — positions SAC as the other answer to data reuse.)
- ORIENT: — (the diagnostic plus PPO contrast is the orientation).
- CORE WATCH: — (no verified video earns its minutes; see candidate-videos note).
- CORE READ: Spinning Up SAC page, worked with pen (entropy-augmented objective → soft Bellman target → twin-Q → squashed-Gaussian log-prob → reparameterized policy loss), then the auto-temperature section of arXiv:1812.05905; then read CleanRL `sac_continuous_action.py` top-to-bottom mapping every equation to its line. (~2 h)
- INTERACTIVE: —
- PRACTICE: (a) Derive the tanh change-of-variables log-prob correction yourself, then find the corresponding line in CleanRL. (b) Predict-then-check: what happens to the entropy term of the loss when α→0 and when α is huge? (c) The node's exercise verbatim: freeze α at 3 values vs auto-tune on HalfCheetah; produce the exploration-collapse and chaos regimes and label them. (~2 h incl. runs)
- IMPLEMENT/DERIVE: The node's build verbatim: SAC from scratch on HalfCheetah — replay buffer, twin critics + targets, reparameterized squashed-Gaussian actor, auto-α — then the PPO-vs-SAC study: env steps to threshold return, wall-clock, stability across 3 seeds each, using YOUR PPO from l10-ppo. Validate against CleanRL's curve (docs deep link above). (~3.5–4 h of the node's 6 h)
- STUCK PATH: Diff your file against CleanRL's ~324 lines subsystem-by-subsystem (replay → critics → actor → α), fixing one subsystem at a time; re-read the matching Spinning Up section only for the broken subsystem.
- DEEPEN: arXiv:1801.01290 (soft policy iteration derivation — why the soft value function is the right fixed point); arXiv:1812.11103 for the real-robot Minitaur result; forward-pointer: HIL-SERL (SAC + interventions) arrives with l11/l14 material per the repo research report.
- PROVE IT: Node masteryTest verbatim: working SAC + the PPO-vs-SAC mini-report (sample efficiency, wall-clock, across-seed stability), written up honestly with plots.
- TRANSFER: (a) Connect reparameterization back to the VAE trick (l4/l11) and forward to flow-policy RL: two paragraphs on why "backprop through sampled actions" is the shared move, and where a flow head makes it harder (πRL's two-layer MDP, per docs/research/reports/rl-sim-stacks.md §6). (b) One paragraph: why does HIL-SERL choose an off-policy learner for real-robot RL with human interventions? (Answer must invoke replaying intervention data.)
- RETENTION: +14 days: write J(π) with the entropy term from memory; state what min(Q1,Q2) prevents and what breaks with a single critic; say which trick (score-function vs reparameterization) each of REINFORCE/PPO/SAC uses and why. (12 min.)

Why this won: The repo's primary (CleanRL sac_continuous_action.py, read-then-reimplement) is confirmed and now carries its fetch-verified deep link and line count; the packet adds the missing *theory* layer (Spinning Up SAC page — contents fetch-verified — plus the two Haarnoja papers with verified URLs) so the learner derives the objective rather than transcribing code, and keeps the node's defining comparative artifact (PPO-vs-SAC study) as the mastery centerpiece. ≈ 2 h reading + ~4 h build/study fits the 6 h budget with no video minutes spent.

What was rejected (and why): Any SAC lecture video — nothing verifiable this session beat text+code on minutes (and CS285's soft-RL treatment, while real, is consolidation not entry — consistent with the cluster's §15 sequencing). Spinning Up's SAC *code* — pre-Gymnasium, repo SKIP stands; only the essay page is used. TD3/DDPG detours — repo scope: SAC and PPO are the two poles taught; TD3 appears only as the origin of the clipped double-Q trick (one sentence in sac.rst, sufficient). SBX as a learning text — sanity-check oracle only, per repo research.

Risk of superficial understanding: Medium-high, concentrated in two spots: (1) transcribing the tanh log-prob correction without deriving it (the retention and practice items force the derivation); (2) reporting the PPO-vs-SAC comparison from folklore ("SAC is more sample-efficient") instead of from the learner's own seeds — the mini-report requires the actual measured curves, and l10-eval-pitfalls will audit its seed discipline. Auto-α can also mask a broken entropy term — the frozen-α sweep exists to expose it.

Required active work: From-scratch SAC (blank file, CleanRL as post-attempt diff), tanh-correction derivation, frozen-vs-auto α study with labeled failure regimes, 3-seed PPO-vs-SAC mini-report, reparameterization transfer writing, +14-day closed-book check.

Repo-binding note (HANDOVERFINAL §15): No primary override — cleanrl stays primary for this node. §15's CS285 correction affects l10-sac only by sequencing: SAC arrives after the S&B→tabular→PG→PPO ladder, and no CS285 lecture is required for it (optional consolidation only). The addition this record makes to the repo's binding is a theory companion (Spinning Up SAC essay + Haarnoja 1801.01290/1812.05905, verified URLs) so the node isn't code-only; suggested repo edit: add spinningup-essays backup with sections "Soft Actor-Critic page (essay only)".

Last verified: 2026-08-21
