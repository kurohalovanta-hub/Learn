# l10-ppo — PPO From Scratch (The 37 Details)

Concept: PPO as engineered trust-region policy optimization: the clipped surrogate L^CLIP, importance ratios, vectorized rollout buffers, minibatch epochs, advantage normalization, entropy bonus, value clipping — and the debugging craft (approx-KL, clip fraction, explained variance) that separates a paper-correct PPO from one that trains. The workhorse of robot RL and VLA fine-tuning; Gold here gates all RL libraries.

Learner prerequisites: l10-policy-gradient Gold (owns ∇J, baselines, GAE — PPO is "REINFORCE hardened for reuse of data"), l4-training-loop Gold habits (logging, seeds), Gymnasium API from l10-tabular. This is the stage where HANDOVERFINAL §15 says CS285 + CleanRL + implementation-details material now belongs.

What beginners commonly misunderstand:
- Why multiple gradient epochs on one batch breaks naive PG (the data becomes off-policy the moment θ moves) — the importance ratio r_t and the clip exist for *this*, not as decoration.
- What the clip actually does per-sign: for A>0 it caps the incentive at (1+ε); for A<0 it caps at (1−ε) — and that min() makes the bound one-sided (pessimistic), not symmetric.
- "Silent failure": PPO rarely crashes; it just plateaus. Learners look at return curves when the diagnosis lives in approx-KL, clip fraction, and explained variance.
- Believing the paper equation is the algorithm: the reproducible behavior lives in the implementation details (advantage normalization per-minibatch, orthogonal init, LR anneal, GAE bootstrapping at truncation, obs normalization) — the 37-details thesis.
- Value-loss clipping and entropy-bonus folklore: several "standard" details are load-bearing on some envs and inert on others; only ablation tells you which.

Candidate videos:
1. CS285 policy-gradient/actor-critic + advanced-policy-gradients lectures — Sergey Levine — course https://rail.eecs.berkeley.edu/deeprlcourse/ (NOW appropriate per §15: with the derivation owned, Levine's "why trust regions" argument is the best conceptual bridge from PG to PPO's clip. Lecture numbering shifts by year — use the current syllabus page https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/ to locate "Advanced Policy Gradients" [numbering unverified].)
2. Costa Huang's PPO implementation video walkthroughs — referenced around the 37-details ecosystem, but neither the README of https://github.com/vwxyzjn/ppo-implementation-details nor any URL I could verify this session lists them [unverified — not selected].
3. Mutual Information playlist — no PPO episode exists in its verified companion-code dirs (MC/TD/PG/function-approx only) — no candidate.
4. Steve Brunton "Overview of Deep RL Methods" — Class Central entry verified (https://www.classcentral.com/course/youtube-overview-of-deep-reinforcement-learning-methods-134232) (taxonomy-level; no implementation content; not selected).

Candidate written resources:
1. "The 37 Implementation Details of Proximal Policy Optimization" — Huang et al., ICLR Blog Track 2022 — https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/ [URL fetch-verified via the companion repo README this session] + companion repo https://github.com/vwxyzjn/ppo-implementation-details [fetched] (Correctness 5, exercise compatibility 5 — organized as exactly the checklist a from-scratch builder needs; the field's reference for "why doesn't my PPO train".)
2. CleanRL `ppo.py` (~312 lines) and `ppo_continuous_action.py` — https://github.com/vwxyzjn/cleanrl [fetched: both files confirmed] with docs at https://docs.cleanrl.dev/ (README-verified) and the deep link https://docs.cleanrl.dev/rl-algorithms/ppo/#ppopy [quoted from ppo.py's own header docstring, fetch-verified] (single-file, benchmarked — the reference curves the mastery test validates against; the style ManiSkill3's baselines copy).
3. Schulman et al., "Proximal Policy Optimization Algorithms" — https://arxiv.org/abs/1707.06347 [URL verified via fetched Spinning Up ppo.rst] (the primary paper; §3's objective is the node's equation).
4. Spinning Up PPO page — https://spinningup.openai.com/en/latest/ [base repo-verified; ppo.rst fetch-confirmed, including the clean g(ε,A) reformulation of the clip: (1+ε)A for A≥0, (1−ε)A for A<0] (the best 15-minute conceptual read on what the clip bounds; the code on that site remains SKIP per repo policy).
5. Heess et al., "Emergence of Locomotion Behaviours in Rich Environments" — https://arxiv.org/abs/1707.02286 [verified via ppo.rst] (why PPO scaled to locomotion; DEEPEN-only).
6. Schulman thesis — http://joschu.net/docs/thesis.pdf [verified via vpg.rst] (trust-region lineage TRPO→PPO; DEEPEN-only; TRPO itself stays SKIP per repo research).

Community evidence:
- The 37-details blog exists *because* the community discovered paper-faithful PPOs don't reproduce reported results — implementation details, not the objective, carry the performance (https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/, repo fetched).
- CleanRL (10.3k★ per repo research; fetched active) is the de-facto community standard for "readable reference PPO," and ManiSkill3's PPO baseline is explicitly adapted from it (docs/research/reports/rl-sim-stacks.md) — validating it as the oracle for l10-parallel-rl next.
- ADGEfficiency/rl-resources build order ends "...REINFORCE → DQN → PPO → SAC" — PPO as the first *serious* algorithm you implement, after simple PG [GitHub-fetch verified] (https://github.com/ADGEfficiency/rl-resources).
- HANDOVERFINAL §15 sequencing: selected CS285 lectures + CleanRL + PPO implementation details belong at THIS stage — matching how Berkeley itself positions the material (post-prerequisites), per its syllabus (https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/). (reddit/HN unreachable via session proxy.)

Primary technical authority:
- Schulman et al. 2017 (arXiv:1707.06347) for the objective; Huang et al. ICLR Blog 2022 for implementation ground truth; CleanRL benchmarked curves (docs.cleanrl.dev) as the empirical oracle.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, written: "Your REINFORCE takes one gradient step per collected batch. What exactly goes wrong if you take ten? Derive where the math breaks." (8 min — the answer *is* the importance ratio; grade against 37-details intro after.)
- ORIENT: Spinning Up PPO page, background section only — the clip explained via g(ε,A) (~15 min).
- CORE WATCH: CS285 "Advanced Policy Gradients" lecture segment on trust regions / why constraining the update works, at 1.25× (locate via https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/; ~45–60 min [lecture numbering and exact length unverified]). First CS285 consumption of the program — deliberately here, not earlier.
- CORE READ: PPO paper §1–3 (30 min), then "The 37 Implementation Details" consumed *alongside the build* — each detail read at the moment your implementation lacks it, with the checklist kept open (≈3 h spread across the build) — https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/.
- INTERACTIVE: —
- PRACTICE: (a) The node's ablations: advantage normalization, orthogonal init, LR anneal on Hopper — quantified, tabulated. (b) Metrics drill: from logged approx-KL + clip fraction + explained variance of three provided/self-generated runs, identify the silently-failing one and name the fix. (~2 h)
- IMPLEMENT/DERIVE: The node's build verbatim: blank-file PPO → CartPole (discrete) → Hopper/HalfCheetah continuous (Gymnasium-MuJoCo) → validate against CleanRL reference curves on matched seeds (`ppo.py`/`ppo_continuous_action.py`, docs deep link https://docs.cleanrl.dev/rl-algorithms/ppo/#ppopy). Consult CleanRL only *after* each subsystem attempt, diff-style. (~5–6 h of the node's 9 h)
- STUCK PATH: Read the corresponding ~30 lines of CleanRL side-by-side with yours (single-file structure makes the diff tractable); Spinning Up PPO page for objective-level confusion; 37-details' env-specific sections for MuJoCo-specific ones (obs/reward normalization).
- DEEPEN: CS285 actor-critic lecture in full if GAE-in-practice still feels shaky; Heess 2017 for locomotion-scale behavior; Schulman thesis for the TRPO lineage (reading only — TRPO stays a paragraph, per repo audit); optionally CS285 HW (policy-gradient assignment) from https://github.com/berkeleydeeprlcourse/homework_spring2026 [hw2 present; topic label unverified].
- PROVE IT: Node masteryTest verbatim: your PPO reaches CleanRL-comparable return on Hopper within 2× wall-clock, matched seeds, with the 3-detail ablation table and the metric-diagnosis writeup. This Gold-gates all RL libraries.
- TRANSFER: (a) Explain, one page, how the same clipped-ratio machinery reappears in RLHF/VLA fine-tuning (ratio over token/action log-probs, KL-to-reference as trust region) — connects to L12/L16. (b) Port discrete CartPole PPO to continuous actions yourself and list precisely what changed (Gaussian head, log-prob, entropy) before checking ppo_continuous_action.py.
- RETENTION: +14 days: sketch L^CLIP and both clip cases (A>0 / A<0) from memory; name five of the 37 details and the failure each prevents; state which logged metric warns that the policy moved too fast. (15 min.)

Why this won: The repo's primary (ppo-37-details + CleanRL backup) survives inspection — it is exactly the §15-mandated stage-three material, and both URLs plus the file-level artifacts were re-verified this session (blog URL from the companion repo README; ppo.py ~312 lines with its docs deep link quoted from the header). The packet's addition is placement of *first* CS285 contact here (trust-region lecture as CORE WATCH) and the Spinning Up clip-intuition page as a 15-minute on-ramp. ≈ 1 h video + ~3.5 h reading interleaved + ~7–8 h build/ablation across the node's 9 h.

What was rejected (and why): CS285 as anything earlier than this node — §15 override, documented in l10-policy-gradient.md. Unverifiable PPO video walkthroughs [no URL verified] — the 37-details text + CleanRL diff loop covers the need. TRPO implementation — repo SKIP list (one-paragraph lineage only). Stable-Baselines3 as reference — repo policy: baseline oracle only, never the learning vehicle; CleanRL's single files are strictly better diff targets. HF Deep RL course PPO unit — adds Colab plumbing, no details depth.

Risk of superficial understanding: The canonical one: copying CleanRL until curves match without owning *why* each detail exists — laundered plagiarism of understanding. Mitigations: blank-file rule with consult-after-attempt discipline, the ablation table (requires forming hypotheses), the silent-failure diagnosis from metrics alone, and the closed-book retention sketch. AI-assisted code beyond debugging caps the claim below Gold per program policy.

Required active work: Blank-file PPO (discrete + continuous), seed-matched validation vs CleanRL, 3-detail ablation with table, metrics-only failure diagnosis, RLHF-connection page, +14-day closed-book sketch.

Repo-binding note (HANDOVERFINAL §15): No primary override — ppo-37-details stays primary, cleanrl stays backup. The §15 correction *lands* here rather than changes here: this node is where the repo's cs285 record (study list "Lec 4–6" etc.) is first consumed, and the cs285 record's role should be understood as supporting material for l10-ppo onward, never as the entry point to RL (see l10-policy-gradient.md for the explicit demotion).

Last verified: 2026-08-21
