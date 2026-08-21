# l10-tabular — Dynamic Programming, TD & Tabular Q-Learning

Concept: Solving a *known* MDP with value iteration / policy iteration; learning from experience with Monte-Carlo vs TD(0) targets; bootstrapping; ε-greedy exploration; SARSA vs Q-learning (on- vs off-policy) — all in tables, where every number is inspectable. This is the Gold gate before any deep-RL library (the L3 rule, RL edition), and the gridworld-implementation stage HANDOVERFINAL §15 places *before* any CS285 exposure.

Learner prerequisites: l10-mdp (Bellman equations produced, not just recognized). Python loops/numpy from earlier levels. No neural networks needed — deliberately.

What beginners commonly misunderstand:
- Bootstrapping: that TD updates toward a target *containing its own estimate* — and why that's not circular (it's a fixed-point iteration, the same one value iteration runs with the model known).
- DP vs learning: value iteration *sweeps a known model*; Q-learning *samples*. Learners who miss this think Q-learning "is" value iteration with extra steps.
- On-policy vs off-policy: Q-learning learns the greedy policy's values while *behaving* ε-greedy — invisible until the cliff-walk plot makes SARSA and Q-learning walk different paths.
- ε-greedy: thinking exploration is an implementation detail rather than the reason the data distribution (and thus the learned Q) changes.
- α (step size): treating it as "learning rate like SGD" without seeing that α=1 in a deterministic gridworld is exact while α=1 under stochastic transitions diverges into noise.

Candidate videos:
1. Monte Carlo methods video — Mutual Information — ~20 min [duration unverified] — in playlist https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr (companion-code dir `monte_carlo_for_RL_and_off_policy_methods` verified via github.com/Duane321/mutual_information — the series covers exactly this node's spine, in S&B's own notation).
2. TD learning, SARSA & Q-learning video — Mutual Information — ~20 min [duration unverified] — same playlist (companion dir `td_learning_sarsa_and_q_learning` verified). The visual TD-error treatment is the series' strongest episode for this node.
3. Value Iteration / Bellman-optimality lectures (book Ch 4, 7) — Shiyu Zhao — lecture-length — https://www.youtube.com/playlist?list=PLEhdbSEZZbDaFWPX4gehhwB9vJZJ1DNm8 (rigor 5; gridworld-worked numeric examples of VI/PI convergence — the best "show me the sweeps" resource; longer than needed for core).
4. Reinforcement Learning Series: Overview of Methods — Steve Brunton — 22 min (Class Central-verified: https://www.classcentral.com/course/youtube-reinforcement-learning-series-overview-of-methods-177923) — https://www.youtube.com/playlist?list=PLMrJAkhIeNNQe1JXNvaFvURxGY4gE9k74 (taxonomy: where DP/MC/TD/Q-learning sit in the model-based/model-free map — orientation value only).
5. DeepMind x UCL 2018 (DP + model-free prediction/control lectures) — https://www.youtube.com/playlist?list=PLqYmG7hTraZBKeNJ-JE_eyJHZ7XgBoAyb (3+ h of lecture for what the packet does in ~60 min of video + implementation; rejected on time efficiency).

Candidate written resources:
1. Sutton & Barto 2nd ed. — Ch 4 (Dynamic Programming: policy evaluation, policy improvement, policy/value iteration), Ch 5 (Monte Carlo: prediction, estimation of action values, control; off-policy via importance sampling at concept level only), Ch 6 (TD: TD(0), advantages, SARSA, Q-learning, expected SARSA skim) — PDF http://incompleteideas.net/book/RLbook2020.pdf (search-verified). Includes the Cliff Walking example in Ch 6 (Example 6.6 [numbering unverified]) that this node's signature exercise reproduces.
2. Shiyu Zhao book Ch 4 "Value Iteration and Policy Iteration" + Ch 7 "Temporal-Difference Methods" — https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning [fetched: chapters confirmed] (contraction-mapping proof of VI convergence — the honest "why does this converge" source when wanted).
3. Karpathy REINFORCEjs GridWorld demos (interactive DP + TD in the browser) — main page http://cs.stanford.edu/people/karpathy/reinforcejs (URL quoted from fetched README of https://github.com/karpathy/reinforcejs; demo files gridworld_dp.html, gridworld_td.html confirmed in repo) — poke a live gridworld's rewards and watch V/Q re-converge; predates our own widget, still excellent for the TD case.
4. Gymnasium toy-text envs (FrozenLake, CliffWalking) — https://gymnasium.farama.org/ (repo-verified resource) — `frozen_lake.py` and `cliffwalking.py` confirmed present via GitHub fetch of Farama-Foundation/Gymnasium `envs/toy_text`.

Community evidence:
- ADGEfficiency/rl-resources tells learners to build agents in exactly this order — "dynamic programming/value iteration → REINFORCE → DQN → PPO → SAC" — and warns "Don't make the common mistake of building an environment and agent at the same time!" [GitHub-fetch verified] (https://github.com/ADGEfficiency/rl-resources) — matches this node's design: known envs (FrozenLake/CliffWalking), agent is the artifact.
- CS285 syllabus sends the un-initiated to S&B Ch 3–4 *before* the course — tabular DP is presumed, not taught (https://rail.eecs.berkeley.edu/deeprlcourse-fa20/syllabus). Hence §15: this node must be completed before CS285 lectures make sense.
- Zhao's gridworld-first "Mathematical Foundations of RL" (17.5k★, 2.1M+ views [GitHub-fetch verified]) — the largest self-learner success signal in tabular-RL pedagogy is precisely "one gridworld, every algorithm run on it."
- (reddit/HN direct threads unreachable via session proxy; above sources + search summaries stand in.)

Primary technical authority:
- Sutton & Barto 2nd ed., Ch 4–6 — definitions, convergence claims, and the cliff-walking on/off-policy result all trace here. Free PDF above.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold: given a drawn 3-state MDP with known P and r (γ=0.9), execute one full value-iteration sweep by hand; then answer "what would you do if P were unknown?" (10 min.)
- ORIENT: — (l10-mdp's orientation carries over; go straight to work).
- CORE WATCH: Mutual Information playlist: the Monte-Carlo video and the TD/SARSA/Q-learning video — https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr (~40 min total [durations unverified]). Watch each *after* reading the matching S&B sections, as consolidation.
- CORE READ: S&B Ch 4 (policy evaluation → value iteration; skip async-DP fine print), Ch 5 first-visit MC + why MC needs episode ends, Ch 6 through Q-learning (TD(0), SARSA, Q-learning, the cliff example) — PDF http://incompleteideas.net/book/RLbook2020.pdf (~2.5 h, implement-as-you-read).
- INTERACTIVE: gridworld-value — the widget IS this node: run sweeps, predict which cells update first, toggle policy vs value iteration if supported; commit predicted V for 3 cells before each reveal.
- PRACTICE: (a) Karpathy REINFORCEjs gridworld_dp then gridworld_td demos: change the reward layout, predict the new V-field before pressing run (http://cs.stanford.edu/people/karpathy/reinforcejs). (b) S&B Ch 6 exercises on TD vs MC targets [exercise numbering unverified]. (c) The node's exploration study: ε ∈ {0.01, 0.1, 0.3} on FrozenLake, 5 seeds each, plot learning curves. (~90 min)
- IMPLEMENT/DERIVE: The node's implementation, unchanged and non-negotiable: (1) gridworld value iteration with V-heatmap animation (feeds the gridworld-value widget's mental model); (2) tabular Q-learning on FrozenLake-v1 and CliffWalking-v0 (env files verified in Gymnasium); (3) the SARSA-vs-Q-learning cliff plot, explained from YOUR figure. (~4 h)
- STUCK PATH: Shiyu Zhao lectures Ch 4 (VI/PI worked numerically) and Ch 7 (TD) — https://www.youtube.com/playlist?list=PLEhdbSEZZbDaFWPX4gehhwB9vJZJ1DNm8; his book chapters for the written version.
- DEEPEN: Zhao book Ch 4 contraction-mapping convergence proof of value iteration; S&B Ch 5 off-policy importance-sampling sections — only if curiosity demands; not gate material (repo SKIP list: eligibility-trace machinery, Dyna).
- PROVE IT: Node masteryTest verbatim: blank file → value iteration + Q-learning both solving a gridworld, TD-error curve plotted, plus a written intuition-level paragraph on why Q-learning converges off-policy.
- TRANSFER: Design your own 1-D "line-following robot" MDP (position × heading states, noisy transitions), solve it with your Q-learning unchanged; one paragraph: which parts of your code were env-specific vs algorithm-generic? Optional second transfer: Taxi-v3.
- RETENTION: +10 days: re-derive the Q-learning update from the Bellman optimality equation and state in two lines what bootstrapping means and why α must shrink (or be small) under stochasticity. (10 min.)

Why this won: §15 demands gridworld implementation before any deep-RL course, and this packet is implementation-dominant (≈4 of 6 h at the keyboard) with S&B as the only theory source — the repo's existing (correct) binding, now given exact section granularity, a verified free-PDF link, verified env files, and the S&B-aligned video pair for consolidation. Total ≈ 40 min video + 2.5 h read + ~5.5 h active.

What was rejected (and why): CS285 Q-learning lectures (7–8) — §15: they presuppose this node; they get consumed later if at all (the repo's cs285 study-list keeps them optional at the DQN/off-policy stage). DeepMind x UCL DP/prediction lectures — 3× the minutes for no implementation gain. Brunton overview — orientation only, learner is already oriented. Distill "Paths Perspective on Value Learning" — the ideal TD-intuition read but its URL could not be verified this session (distill.pub proxy-blocked): none found — fallback: the TD-error plots the learner produces themselves + REINFORCEjs gridworld_td. HF Deep RL course Units 1–2 — repo research already graded it "low-maintenance"; adds Colab overhead without adding concepts.

Risk of superficial understanding: Medium-high. Watching value iteration converge feels like understanding; the gate is producing it from a blank file and *explaining the cliff plot* — a learner who can't say why SARSA detours from the cliff edge has recognition, not mastery. The α/stochasticity misconception survives FrozenLake's default settings — force is_slippery=True in at least one run.
Required active work: Blank-file VI + Q-learning, the cliff SARSA/Q comparison with written explanation, exploration sweep across seeds, TD-error plot, line-follower transfer MDP, +10-day derivation check. The widget and demos are prediction-first (commit before reveal), never passive.

Repo-binding note (HANDOVERFINAL §15): No override — repo primary sutton-barto Ch 4–6 is what §15 prescribes for this stage. Record makes the sequencing explicit: this node (with l10-mdp) must reach Gold *before* the learner opens any CS285 lecture; CS285 first legitimately appears in l10-policy-gradient's DEEPEN and l10-ppo's supporting material.

Last verified: 2026-08-21
