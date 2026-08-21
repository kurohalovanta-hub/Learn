# l10-mdp — MDPs, Returns & Value Functions

Concept: The MDP formalism (S, A, P, r, γ), episodic vs continuing tasks, policies, returns G_t, state/action value functions V^π and Q^π, Bellman expectation and optimality equations, and reward design as problem specification. First contact with RL — everything in L10–L14 is phrased in this vocabulary.

Learner prerequisites: l2-random-variables (Gold: expectation, conditional probability — the Bellman equation IS a conditional-expectation identity), l3-ml-framing. No RL, no prior exposure to sequential decision-making. Comfortable with sums/limits at grade-10+ level; γ-geometric-series is the only new math machinery.

What beginners commonly misunderstand:
- Confusing reward r (one step, given) with return G (cumulative, random) with value V (expected return, a function) — the single most common confusion; every Bellman error traces to it.
- Thinking V and Q are computed rather than *defined* (definition first, algorithms later — that's l10-tabular's job).
- Treating γ as a technicality instead of a modeling choice that trades horizon for variance/convergence.
- Believing the reward "tells the agent how" — reward specifies *what*; the hazard (reward hacking) is invisible until asked to critique a reward they designed.
- Notational drowning: expectation over trajectories vs over next-state is where first-time readers of S&B Ch 3 stall — which is exactly why the visual-first sequencing exists.

Candidate videos:
1. Reinforcement Learning, by the Book (Part 1) — Mutual Information (DJ Rich) — ~13 min [duration unverified] — https://www.youtube.com/watch?v=NFo9v_yKQXA (Correctness 5: follows S&B notation exactly. Prereq fit 5: built for first exposure. Intuition 5: animated gridworld/probability visuals. Rigor 3 (by design). Time efficiency 5. Community signal 4: channel + companion repo github.com/Duane321/mutual_information verified; series widely cited in RL-learning threads. Datedness risk low — tabular RL doesn't move.)
2. Reinforcement Learning By the Book — series playlist — Mutual Information — 6+ parts, ~15–25 min each [durations unverified] — https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr (The only series that is literally a visual companion to the chosen textbook — the pairing eliminates notation-switching cost. Video 2 covers Bellman equations/DP [title unverified from playlist page].)
3. Reinforcement Learning Series: Overview of Methods — Steve Brunton — 22 min (Class Central-verified) — https://www.youtube.com/playlist?list=PLMrJAkhIeNNQe1JXNvaFvURxGY4gE9k74 (Correctness 5, production 5; control-theory framing is a bonus for this robotics program, but it's a taxonomy overview — orients the *field*, not the MDP formalism itself. Better as optional map than core.)
4. Mathematical Foundations of Reinforcement Learning lectures (Ch 2–3: Bellman equation, Bellman optimality) — Shiyu Zhao, Westlake Univ. — lecture-length — https://www.youtube.com/playlist?list=PLEhdbSEZZbDaFWPX4gehhwB9vJZJ1DNm8 (Rigor 5, clarity 4, gridworld-driven throughout; 2.1M+ view series, book repo 17.5k★ [GitHub-fetch verified]. Slower than needed for first pass — held as stuck-path/deepen.)
5. DeepMind x UCL RL Course 2018 — Lecture on MDPs — ~1.5 h — https://www.youtube.com/playlist?list=PLqYmG7hTraZBKeNJ-JE_eyJHZ7XgBoAyb (Authoritative but long, blackboard-paced, pre-2020 framing; fails shortest-sufficient for this learner.)
6. Markov Decision Processes Explained | The Foundation of Reinforcement Learning — creator unverified — https://www.youtube.com/watch?v=ljrjEh13Vyg (Surfaced in search; could not verify creator/quality via blocked YouTube — not selected.)

Candidate written resources:
1. Sutton & Barto, *Reinforcement Learning: An Introduction* 2nd ed., Ch 3 "Finite Markov Decision Processes" — book page http://incompleteideas.net/book/the-book-2nd.html · full free PDF http://incompleteideas.net/book/RLbook2020.pdf [both URLs search-verified 2026-08-21; PDF filename corroborated by multiple GitHub repos linking it; authors' site hosts the full PDF legally] (Correctness 5, rigor 5, exercise compatibility 5 — the canonical definitions the whole program will cite.)
2. Spinning Up "Part 1: Key Concepts in RL" — https://spinningup.openai.com/en/latest/ [base URL repo-verified 2026-08-21; section file rl_intro.rst confirmed via GitHub fetch of openai/spinningup/docs/spinningup; part title [approx]] (Clarity 5, prereq fit 5 — compressed notation-first glossary; ~30 min.)
3. Shiyu Zhao, *Mathematical Foundation of Reinforcement Learning* (Springer; free PDF in repo), Ch 2 "State Values and Bellman Equation", Ch 3 "Optimal State Values and Bellman Optimality Equation" — https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning [fetched: chapter list confirmed] (Rigor 5; the best second explanation when S&B's prose-style derivations don't click.)
4. Deep Learning Wizard "Markov Decision Processes (MDP) and Bellman Equations" — https://www.deeplearningwizard.com/deep_learning/deep_reinforcement_learning_pytorch/bellman_mdp/ [search-verified] (Serviceable but thinner than the above; not selected.)

Community evidence:
- CS285's own syllabus assumes ML (CS189-equivalent) and "some familiarity with reinforcement learning" and sends newcomers to the CS188 EdX course + S&B Ch 3–4 *before* the course — i.e., Berkeley itself says CS285 is not first-exposure material (https://rail.eecs.berkeley.edu/deeprlcourse-fa20/syllabus, also current https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/)
- csdiy.wiki (large self-study community wiki): CS285 "involves a substantial amount of mathematical formulas, so a reasonable mathematical background is recommended" (https://csdiy.wiki/en/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS285/)
- ADGEfficiency/rl-resources (curated learner guide): beginner canon = Sutton & Barto + Silver + Spinning Up; CS285 absent from its beginner path entirely [GitHub-fetch verified] (https://github.com/ADGEfficiency/rl-resources)
- Learning-path threads consistently label Berkeley Deep RL "advanced" vs foundational S&B/Silver/Spinning Up (e.g., https://www.teamblind.com/post/can-anyone-recommend-a-course-on-reinforcement-learning-7ua8bbjk; search-summary consensus). Note: reddit.com and news.ycombinator.com were unreachable through the session proxy — community evidence here comes from syllabi, self-study wikis, curated lists, and search summaries; the S&B HN thread exists at https://news.ycombinator.com/item?id=41912769 [content not fetchable].
- Zhao's math-first gridworld book/lectures: 17.5k★, 2.1M+ lecture views [GitHub-fetch verified] — strong signal that gridworld-visual pedagogy is what actually works for self-learners at this stage.

Primary technical authority:
- Sutton & Barto 2nd ed. (2018), Ch 3 — the field's definitional source (2024 Turing Award); free PDF above. All equations in this node's record trace here.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold: formalize a robot vacuum as an MDP (write S, A, r, γ) and compute a 3-step discounted return for a made-up reward sequence with γ=0.9. No reading first. (10 min — expected to partially fail; that failure is the hook.)
- ORIENT: Mutual Information "Reinforcement Learning, by the Book" Part 1 — https://www.youtube.com/watch?v=NFo9v_yKQXA (~13 min [unverified]).
- CORE WATCH: Video 2 of the same playlist (Bellman equations) — https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr (~20 min [title/duration unverified]).
- CORE READ: S&B Ch 3 complete (agent–environment interface → returns → policies/value functions → Bellman optimality → summary), slow and exact, deriving each boxed equation by hand as met — PDF http://incompleteideas.net/book/RLbook2020.pdf (~100–120 min).
- INTERACTIVE: gridworld-value — set a policy, watch V appear cell-by-cell; predict-then-check three cell values before revealing.
- PRACTICE: (a) The node's modeling drill: formalize gridworld, cart-pole, pick-and-place as MDPs — explicit S, A, r, γ each, plus one sentence on what each reward choice gets wrong. (b) S&B Ch 3 end-of-chapter exercises on return/Bellman manipulation (the γ-recursion and "write V in terms of Q / Q in terms of V" ones; exercise numbering varies by printing [numbering unverified]). (c) Hand-compute V for a 4-state chain under two policies; verify by 20-line simulation. (~90 min)
- IMPLEMENT/DERIVE: Derive the Bellman expectation equation from G_t = r_{t+1} + γG_{t+1} on paper, every expectation step justified; then the chain-MDP simulation above. (~45 min)
- STUCK PATH: Shiyu Zhao lectures for Ch 2 (Bellman equation, gridworld-worked) — https://www.youtube.com/playlist?list=PLEhdbSEZZbDaFWPX4gehhwB9vJZJ1DNm8; plus Spinning Up Part 1 as a compact notation glossary.
- DEEPEN: Zhao book Ch 2–3 (contraction-mapping view of Bellman optimality) — https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning — only if the learner wants the fixed-point proof; NOT required for Gold.
- PROVE IT: Unseen: design the MDP and reward for "battery-constrained inspection drone must photograph 3 checkpoints"; then critique your own reward for hackability (two concrete exploits) and fix one. Plus closed-book: derive Bellman expectation from the return definition (node masteryTest).
- TRANSFER: Show that one-step supervised learning is a degenerate MDP (γ=0, |episode|=1) and say precisely what structure RL adds; then map "VLA executes a language command" onto (S, A, r) and identify which element is hardest to specify (connects to L12).
- RETENTION: +7 days: from memory, write G_t, V^π, Q^*, and the Bellman optimality equation for Q^*; two sentences on what γ trades. (10 min, self-graded against Ch 3.)

Why this won: §15's sequencing (visual/intuitive MDP material + S&B first) is satisfied by the one video series that *is* S&B visualized — zero notation-switching between CORE WATCH and CORE READ, which is the known stall point for first-time Ch 3 readers. S&B Ch 3 stays primary authority (repo binding already correct); the packet adds the missing visual on-ramp and the free-PDF deep link. Total ≈ 35 min video + ~2 h exact reading + ~2.5 h active work ≈ node's 6 h with margin.

What was rejected (and why): CS285 anything — per HANDOVERFINAL §15 and Berkeley's own syllabus, not first-exposure material (this node deliberately contains zero CS285; it enters only at l10-ppo). DeepMind x UCL / David Silver MDP lectures — authoritative but 1.5 h+ for what the 35-min visual pair covers; pre-deep-RL practice framing (repo research already marked Silver SKIP). Brunton overview — good field map but doesn't teach the formalism; optional, not in packet. Unverifiable one-off MDP explainer videos (ljrjEh13Vyg, xtHCGlnhIuA) — couldn't confirm creator/quality through the proxy. Distill "Paths Perspective on Value Learning" — relevant but URL unverifiable this session (distill.pub blocked); it belongs to l10-tabular's topic anyway.

Risk of superficial understanding: High — this node is *recognition-prone*: the video makes V "feel obvious" while the learner still can't produce the conditional-expectation steps. Mitigation: the packet forces three productions (Bellman derivation, chain-MDP hand-compute vs simulation, reward critique) before Gold; commit-before-reveal in the widget.

Required active work: The modeling drill (3 MDPs), hand-computed V verified by simulation, paper derivation of Bellman expectation, reward-hackability critique, and the +7-day closed-book retention check. Video minutes never count toward the gate.

Repo-binding note (HANDOVERFINAL §15): No override needed here — repo primary is already sutton-barto Ch 3, which §15 endorses. The correction *adds* the visual-first layer (Mutual Information series) ahead of the reading and explicitly bars CS285 from this node; the repo's cs285 resource record (study list "Lec 2, 4–6, 7–8, 15–16") should be consumed starting at l10-ppo, not here.

Last verified: 2026-08-21
