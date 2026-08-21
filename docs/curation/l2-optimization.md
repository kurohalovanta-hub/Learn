# l2-optimization — Optimization & Gradient Descent

Concept: Minima/maxima/saddles; convex vs non-convex intuition; gradient descent with step-size effects (crawl/converge/oscillate/diverge); momentum; constrained optimization and Lagrange multipliers conceptually. All of deep learning is "follow the negative gradient with taste" — this node builds the taste on 2D landscapes you can see.

Learner prerequisites: l2-multivariable at gold (∇ fluency — GD is nothing but repeated gradient evaluation; the ‖Ax−b‖² gradient derived there is reused here verbatim).

What beginners commonly misunderstand:
- Learning rate as a magic knob rather than a quantity with a stability bound (on a quadratic, η beyond 2/curvature diverges — the crawl/converge/oscillate/diverge quartet).
- "Local minima are the problem in deep learning" — in high dimensions saddle points and ravines dominate; Hessian eigensigns (from l2-multivariable) explain why.
- Momentum as vague "ball rolling" metaphor without seeing WHAT it fixes: zigzag across a ravine's steep walls while crawling along its floor.
- GD "finds" the minimum in one clean slide — learners who never plot trajectories never internalize oscillation/divergence; every claim in this node must come off the learner's own plots.
- Lagrange multipliers as recipe ("set ∇f=λ∇g") without the tangency picture.

Candidate videos:
1. Gradient descent, how neural networks learn — Chapter 2, Deep learning — 3Blue1Brown — 21 min (verified via search snippet; timestamps: cost functions 3:01, gradient descent 6:55, gradient vectors 11:18, recap 12:19, network analysis 13:01) — https://www.youtube.com/watch?v=IHZwWFHWa-w (correctness 5, intuition 5, ML-relevance 5 — grounds GD in an actual loss over 13k parameters; community discussion existed on HN: https://yahnd.com/theater/r/youtube/IHZwWFHWa-w/)
2. Khan Academy optimization/Lagrange videos in "Applications of multivariable derivatives" — https://www.khanacademy.org/math/multivariable-calculus/applications-of-multivariable-derivatives (Sanderson-era; the Lagrange articles are the repo-designated backup; tangency visuals)
3. Second partial derivative test — Khan Academy — https://www.khanacademy.org/math/multivariable-calculus/applications-of-multivariable-derivatives/optimizing-multivariable-functions-videos/v/second-partial-derivative-test (classifying critical points — bridges Hessian curvature into optimization)
4. No standalone momentum video selected: d2l 12.6 covers it implementation-first with the exact ravine experiment the node's exercise requires.

Candidate written resources:
1. d2l.ai Chapter 12 "Optimization Algorithms" — https://www.d2l.ai/chapter_optimization/ — §12.1 optimization vs DL, 12.2 convexity, 12.3 gradient descent (section confirmed via mirror http://gluon.ai/chapter_optimization/gd.html), 12.4 SGD, 12.5 minibatch, 12.6 momentum; every section is a runnable notebook (correctness 5, exercise compatibility 5, ML relevance 5, clarity 4).
2. Paul's Online Notes, Calc III Applications of Partial Derivatives — https://tutorial.math.lamar.edu/classes/calciii/partialderivappsintro.aspx — Relative Minimums and Maximums (critical points + second-derivative test; practice verified: https://tutorial.math.lamar.edu/problems/calciii/RelativeExtrema.aspx) and Lagrange Multipliers (https://tutorial.math.lamar.edu/classes/calciii/lagrangemultipliers.aspx, practice: https://tutorial.math.lamar.edu/problems/calciii/lagrangemultipliers.aspx) — the analytic/by-hand layer of the cluster pattern.
3. Sebastian Ruder, "An overview of gradient descent optimization algorithms" — https://arxiv.org/pdf/1609.04747 (the classic optimizer survey; DEEPEN only — predates modern practice but the GD/momentum/Adam taxonomy is still the shared vocabulary).
4. MML §7.1–7.2 (repo mml-book) — GD + constrained/Lagrange in ML notation; consolidation.

Community evidence:
- The 3B1B GD video drew mainstream discussion (HN Theater archive: https://yahnd.com/theater/r/youtube/IHZwWFHWa-w/) and remains the default first-exposure explainer; Class Central indexes it as a standalone course (https://www.classcentral.com/course/youtube-gradient-descent-how-neural-networks-learn-133386).
- Implementation-first optimization pedagogy is the 2025–2026 norm — d2l's notebook style is mirrored across community forks (e.g. https://github.com/dsgiitr/d2l-pytorch/blob/master/Ch12_Optimization_Algorithms/Gradient_Descent.ipynb), signal that learners actually run this chapter.
- Paul's Notes still the free worked-problem source for the analytic side (instructor pages: https://dcc.libguides.com/mathematics/web); its Lagrange practice set with full solutions has no free equal.
- 2025–2026 adult learners who wanted more drilling bought Math Academy (HN https://news.ycombinator.com/item?id=43135664; balanced critique https://newsletter.ozwrites.com/p/a-balanced-review-of-math-academy) — but optimization "taste" comes from plotting trajectories, not drills; not adopted.

Primary technical authority:
- d2l.ai ch 12 (Zhang, Lipton, Li, Smola) for GD/SGD/momentum with executable code; Paul Dawkins Calc III for critical points and Lagrange worked solutions; MML ch 7 for the ML-notation consolidation.

Selected shortest-sufficient packet:
- DIAGNOSTIC: node diagnostic cold — what happens with η too large (sketch it) and why momentum helps in ravines (5 min written; honest fail expected pre-study)
- ORIENT: 3B1B GD video 3:01–13:01 (~10 min) — cost surface → downhill walking → gradient meaning
- CORE WATCH: — (the ORIENT segment suffices; rest of the video is L3 material)
- CORE READ: d2l §12.1–12.6, RUNNING every code cell and re-plotting each trajectory figure yourself (~2.5 h); then Paul's Relative Min/Max + Lagrange Multipliers worked examples (~45 min)
- INTERACTIVE: gradient-descent (in-app lesson "Gradient Descent", 75 min, already built — reproduce crawl/converge/oscillate/diverge in the widget BEFORE coding them)
- PRACTICE: Paul's Relative Extrema practice set + Lagrange practice set (full solutions, URLs above; ~45–60 min); d2l 12.3/12.6 section exercises
- IMPLEMENT/DERIVE: GD on ‖Ax−b‖² reusing YOUR ∇f=2Aᵀ(Ax−b) from l2-multivariable; trajectories for 5 learning rates over the loss contours; add momentum and show it escaping a ravine plain GD zigzags through; solve one constrained problem by Lagrange and verify graphically (node exercises, ~2 h)
- STUCK PATH: Khan "Applications of multivariable derivatives" Lagrange articles + optimization videos (repo-designated backup) for any piece of d2l that assumes too much
- DEEPEN: d2l §12.10 Adam skim (repo-sanctioned preview); Ruder survey (https://arxiv.org/pdf/1609.04747) for optimizer taxonomy; MML §7.1–7.2 consolidation
- PROVE IT: node masteryTest — from scratch: minimize Rosenbrock with GD+momentum, visualize the path on contours, and explain every hyperparameter's effect from your own plots (60–75 min)
- TRANSFER: baby inverse kinematics — minimize ‖FK(θ)−target‖² for the 2-link arm by GD, gradient via your numerical_jacobian from l2-multivariable; watch θ walk the arm to the target; note where it stalls (elbow singularity foreshadowing) (40 min)
- RETENTION: day+14 — derive the divergence threshold for GD on f(x)=½ax² (η>2/a), sketch all four step-size regimes from memory, and state in one sentence what momentum adds

Why this won: The repo's d2l-primary choice is kept — nothing else combines correct theory with runnable loss-landscape code at beginner-accessible depth — and the cluster pattern's missing analytic layer is restored by adding Paul's Calc III Relative Extrema + Lagrange sections (both with full-solution practice sets, verified live today). The 3B1B segment gives a 10-minute ML-grounded on-ramp. Core ≈7 h of the 9 h budget, and every claimed insight is forced through the learner's own plots.

What was rejected (and why): Boyd Convex Optimization (repo research: do NOT open on this timeline); Ruder survey as core (survey-reading before implementing builds vocabulary, not taste — demoted to DEEPEN); standalone momentum explainers (d2l 12.6 already pairs the math with the ravine experiment); Math Academy (paid, drill-shaped — wrong tool for landscape intuition); Khan as primary (articles are the backup layer, not implementation-first).

Risk of superficial understanding: HIGH — GD is the most familiar-feeling topic in ML ("just go downhill"), so recognition masquerades as mastery easily. Mitigations: the four-regime step-size taxonomy must be produced from the learner's own runs; Rosenbrock (pathological ravine) is the PROVE IT precisely because bowl-shaped intuition dies there; the divergence-threshold derivation in RETENTION separates knowing-that from knowing-why.

Required active work: run all d2l cells; two Paul's practice sets; GD + momentum + Lagrange implementations; Rosenbrock masteryTest with self-explained plots; IK-by-GD transfer.

Last verified: 2026-08-21
