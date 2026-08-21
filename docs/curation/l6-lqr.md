# l6-lqr — LQR — Optimal Feedback

Concept: Optimal state feedback u=−Kx from a quadratic cost J=Σ xᵀQx + uᵀRu; the discrete Riccati recursion implemented from scratch; Q/R as encoded tradeoffs; xᵀPx as a value function — the learner's first Bellman equation, bridging control to RL.
Learner prerequisites: l6-state-space (linearization, eigen-stability, pole placement), l2-optimization. Pole placement must already feel normal — LQR's pitch is "stop hand-picking poles, state what you care about".
What beginners commonly misunderstand: (1) Treating LQR as a library call (`lqr(A,B,Q,R)`) and never seeing the recursion — then Q/R tuning stays cargo-cult. (2) Not realizing only Q/R RATIOS matter (scaling both changes nothing). (3) Missing that P is a value function and the Riccati equation is a Bellman equation — the single most valuable connection for this curriculum, easy to skip. (4) Expecting the gain to work globally on the nonlinear system — LQR is exact for the linearization, local for the robot. (5) Confusing "optimal" with "good": a bad Q/R choice is optimally bad.

Candidate videos:
1. Linear Quadratic Regulator (LQR) Control for the Inverted Pendulum on a Cart [Control Bootcamp] — Steve Brunton — duration [unverified, ~15–18 min] — https://www.youtube.com/watch?v=1_UobILf3cc (designs the optimal full-state gain for the exact cart-pole this node targets; picks up directly from the pole-placement video watched in l6-state-space. Correctness 5, continuity 5, intuition 4, rigor 3 — states rather than derives Riccati, which is fine: the derivation here is the learner's job.)
2. Pole Placement for the Inverted Pendulum on a Cart [Control Bootcamp] — Steve Brunton — [watched in l6-state-space; re-listed as the contrast anchor] — via playlist https://www.youtube.com/playlist?list=PLMrJAkhIeNNR20Mz-VpzgfQs5zrYi085m ("choose poles by hand" vs "state a cost" is the motivating contrast).
3. Robotik Ep.5: Feedback Control with LQR — rey's blog (rrwiyatn) — written+worked, not a video — https://rrwiyatn.github.io/blog/robotik/2020/07/19/lqr.html (learner-authored walkthrough with code; listed under written below — noted here because it fills the "short second explanation" role video-shaped candidates would.)
Note: video candidate pool is deliberately thin — the session's search budget was exhausted before broader sweeps; the node is implementation-first by design, so one continuity video suffices and no gap remains.

Candidate written resources:
1. Underactuated Robotics, Ch 8 "Linear Quadratic Regulators" — Russ Tedrake — https://underactuated.csail.mit.edu/lqr.html [chapter number + filename lqr.html verified this session from the book's own chapters.json on GitHub; site fetch egress-blocked] (the value-function-first derivation this node's exercises demand; difficulty 4 — enter only after the videos and with the Riccati implementation underway.)
2. Underactuated Robotics, Ch 7 "Dynamic Programming" — https://underactuated.csail.mit.edu/dp.html [same verification] (the value-function/Bellman frame that makes "Riccati = Bellman" precise; skim-level.)
3. Data-Driven Science & Engineering Ch 8 (databookuw.com, repo-verified) — bootcamp-notation LQR section, gentler than Tedrake.
4. rey's blog LQR post (URL above) — beginner-register worked example with code; ideal stuck-path read.

Community evidence:
- Learner blog series implements LQR immediately after a bootcamp-style intro and reports it clicking via the cart-pole — the exact sequence this packet uses (https://rrwiyatn.github.io/blog/robotik/2020/07/19/lqr.html)
- Community code-along repos include lqr_cartpend implementations, confirming learners successfully reproduce this lecture's controller (https://github.com/bertozzijr/Control_Bootcamp_S_Brunton)
- Class Central lists the bootcamp (incl. LQR lecture) as a top free control course (https://www.classcentral.com/course/youtube-control-bootcamp-53182)

Primary technical authority:
- Underactuated Robotics Ch 8 (Tedrake) for the derivation and the value-function claim; scipy's `solve_discrete_are` as the numerical oracle the from-scratch recursion must match.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold: write the LQR cost; what does multiplying R by 100 do to the gain and the trajectories? Why is the K you compute for cart-pole only locally valid? Is P related to a value function — how? 8 min.
- ORIENT: — (direct continuity from l6-state-space pole placement; no new orientation needed).
- CORE WATCH: Linear Quadratic Regulator (LQR) Control for the Inverted Pendulum on a Cart [Control Bootcamp] — full video, ~15–18 min [unverified] (~13 min at 1.25×).
- CORE READ: Underactuated Ch 8, the discrete-time / value-function development only — read WITH the Riccati implementation open, not before it (~45–60 min; skip Ch 8's advanced variants on first pass). Gate: start it only after the widget-free Riccati iteration below converges on the double integrator ("only when ready" per curriculum).
- INTERACTIVE: — (no LQR widget exists; the pid-tuner loop is the comparison baseline in PRACTICE).
- PRACTICE: Node exercises — sweep R over 100× both ways: aggressive-vs-lazy trajectories + control-effort plots; write the paragraph explaining why xᵀPx is a value function and the Riccati step is a Bellman backup.
- IMPLEMENT/DERIVE: Discrete Riccati iteration from scratch (fixed-point on P) → K for the double integrator, then cart-pole using YOUR (A,B) from l6-state-space; assert allclose against scipy.linalg.solve_discrete_are; balance MuJoCo cart-pole from perturbed starts. Derive on paper the two-step finite-horizon LQR by backward induction and show the backup formula IS the Riccati step.
- STUCK PATH: rey's blog LQR post (worked code at learner register), then rewatch the pole-placement video and re-ask "what did the cost buy me over hand-picked poles?".
- DEEPEN: Underactuated Ch 7 (DP intro) for the Bellman frame; databookuw Ch 8 LQR section; bootcamp's later Kalman/LQG videos belong to l6-kalman, not here.
- PROVE IT: Node mastery test — cart-pole balanced by your Riccati-derived K, Q/R ablation table, PID-vs-LQR comparison (disturbance rejection, effort) quantified (Gold gate).
- TRANSFER: Write the Bellman backup for a generic discounted quadratic problem and identify each Riccati term's RL counterpart (value iteration, greedy policy, Q-function) — one page; this is the L7/L8 bridge stated in the node's `why`.
- RETENTION: +14 days: blank page — write the Riccati recursion and label every term's meaning; state what happens to K as R→∞ and as Q→∞.

Why this won: One ~15-min continuity video + one exact textbook chapter + a from-scratch implementation is the minimum path that still delivers the node's two non-negotiables: the Riccati recursion implemented (not called) and the value-function interpretation articulated. Underactuated Ch 8 was re-verified as the correct chapter number from the book's own chapters.json this session (Ch 7 = DP, Ch 8 = LQR, Ch 10 = trajopt — the repo's mapping is current). The "only when ready" gate on Tedrake is kept: it's the one source here whose difficulty (4) can stall a momentum learner.
What was rejected (and why): Watching the bootcamp's Kalman/LQG segment now (belongs to l6-kalman; scope creep). Full Underactuated Ch 8 including advanced variants on first pass (time cost without mastery gain at this node). MIT OCW/whole control courses (banned by curriculum rule). Michel-van-Biezen-style long derivation playlists (not verified this session; and 40+ short videos is the opposite of shortest-sufficient). Continuous-time Riccati as primary object (the curriculum's discrete recursion is what maps to Bellman/value iteration; continuous version noted only in DEEPEN reading).
Risk of superficial understanding: Calling scipy and believing the ablation table constitutes understanding. Antidote is hard-gated: the mastery test requires YOUR recursion matching scipy, plus the two-step backward-induction derivation on paper. Second trap: never connecting P to value — the TRANSFER page is the check.
Required active work: Riccati fixed-point implementation + oracle match; cart-pole balance from perturbed starts; Q/R 100× sweeps with effort plots; two-step LQR backward-induction derivation; PID-vs-LQR quantified comparison; Bellman-counterpart page.
Last verified: 2026-08-21
