import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-optimization.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-optimization",
  whyNow:
    "All of deep learning is 'follow the negative gradient with taste'. This node builds the taste on 2D landscapes you can SEE: step size as a quantity with a stability bound (not a magic knob), momentum as the specific fix for ravine zigzag, saddles — not local minima — as the real high-dimensional enemy. GD is the most familiar-feeling topic in ML, so recognition masquerades as mastery easily; here, every claim must come off your own plots.",
  diagnostic: {
    prompt:
      "Written, cold: what happens with η too large — sketch it, and show the inequality intuition. Why does momentum help in ravines? An honest fail is expected pre-study.",
    minutes: 5,
  },
  orient: {
    title: "Gradient descent, how neural networks learn — Deep Learning Ch. 2",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=IHZwWFHWa-w", 181, 781),
    startSeconds: 181,
    endSeconds: 781,
    minutes: 10,
    whySelected: "Watch 3:01–13:01 only: cost surface → downhill walking → what the gradient vector means, grounded in an actual loss over 13k parameters. The rest of the video is L3 material.",
    leaveWith: ["a loss landscape is a real surface you walk on", "training = repeated gradient evaluation plus a step-size decision"],
  },
  recall: [
    { q: "GD on f(x) = ½ax². For which η does it converge, and what happens at the boundary?", a: "The update is x ← (1−ηa)x, so convergence needs |1−ηa| < 1, i.e. η < 2/a. Near the bound it oscillates while converging; beyond it, it diverges. Step size has a stability bound, not a vibe." },
    { q: "What actually dominates high-dimensional loss landscapes — local minima?", a: "No: saddle points and ravines. A saddle has at least one negative Hessian eigenvalue, so a downhill escape direction always exists." },
    { q: "What specific pathology does momentum fix?", a: "Ravine zigzag: plain GD bounces across the steep walls while crawling along the floor. The running velocity average cancels the alternating wall components and accumulates the consistent along-valley component." },
    { q: "Name the four step-size regimes you must be able to produce on demand.", a: "Crawl (η tiny), converge, oscillate (η near 2/curvature), diverge (η beyond it) — all four from your own runs, not from a figure you saw." },
    { q: "At a constrained optimum of f on g = 0, what is the geometric relation between ∇f and ∇g?", a: "Parallel: ∇f = λ∇g. The f level set is tangent to the constraint — otherwise sliding along g = 0 could still improve f." },
  ],
  interactiveIds: ["gradient-descent"],
  lessonId: "l2-optimization",
  coreRead: [
    {
      title: "d2l.ai Ch. 12 — Optimization Algorithms",
      url: "https://www.d2l.ai/chapter_optimization/",
      resourceId: "d2l",
      sections: "§12.1 optimization vs DL · §12.2 convexity · §12.3 gradient descent · §12.4 SGD · §12.5 minibatch · §12.6 momentum — RUN every code cell and re-plot each trajectory figure yourself",
      minutes: 150,
      whySelected: "Nothing else combines correct theory with runnable loss-landscape code at this depth; §12.6 pairs momentum's math with the exact ravine experiment the node's exercise requires.",
    },
    {
      title: "Paul's Calc III — Relative Minimums and Maximums",
      url: "https://tutorial.math.lamar.edu/classes/calciii/partialderivappsintro.aspx",
      resourceId: "pauls-notes",
      sections: "Relative Minimums and Maximums (from the Applications chapter index): critical points + second-derivative test, worked examples",
      minutes: 20,
      whySelected: "The analytic by-hand layer d2l skips — classifying critical points before you trust an optimizer to find them.",
    },
    {
      title: "Paul's Calc III — Lagrange Multipliers",
      url: "https://tutorial.math.lamar.edu/classes/calciii/lagrangemultipliers.aspx",
      resourceId: "pauls-notes",
      sections: "worked examples — hold the tangency picture (∇f ∥ ∇g at the touch point), not the recipe",
      minutes: 25,
    },
  ],
  practice: [
    { prompt: "Paul's Relative Extrema practice set (full solutions): find and classify critical points by hand — including at least one saddle.", source: "https://tutorial.math.lamar.edu/problems/calciii/RelativeExtrema.aspx", minutes: 25 },
    { prompt: "Paul's Lagrange Multipliers practice set (full solutions) — no free equal exists; for each problem, sketch why the solution is a tangency.", source: "https://tutorial.math.lamar.edu/problems/calciii/lagrangemultipliers.aspx", minutes: 25 },
    { prompt: "d2l §12.3 and §12.6 end-of-section exercises — answer from your own reruns of the cells, not from the text.", source: "https://www.d2l.ai/chapter_optimization/", minutes: 20 },
  ],
  implement: {
    spec: "Before coding, reproduce crawl/converge/oscillate/diverge in the gradient-descent instrument. Then gd_lab.py: (1) GD on ‖Ax−b‖² reusing YOUR ∇f = 2Aᵀ(Ax−b) from l2-multivariable; trajectories for 5 learning rates plotted over the loss contours. (2) Add momentum; show it escaping an ill-conditioned ravine that plain GD zigzags through. (3) Solve one constrained problem by Lagrange on paper and verify graphically (f contours tangent to the constraint at your solution).",
    checks: [
      "All four step-size regimes visible in YOUR plots, each labeled with its η",
      "Momentum reaches the ravine floor in far fewer steps, and you can name which term cancels the zigzag",
      "The Lagrange point sits exactly where a contour kisses the constraint curve in your plot",
    ],
    minutes: 120,
  },
  stuck: {
    alternateRead: {
      title: "Khan Academy — Applications of multivariable derivatives",
      url: "https://www.khanacademy.org/math/multivariable-calculus/applications-of-multivariable-derivatives",
      resourceId: "khan-multivariable",
      sections: "Lagrange-multiplier articles + optimization videos (incl. the second-partial-derivative test) — the repo-designated backup",
      minutes: 40,
    },
    note: "Use Khan for any piece of d2l that assumes too much; the tangency visuals in the Lagrange articles are the best free repair for recipe-only understanding.",
  },
  deepen: [
    { title: "d2l.ai §12.10 — Adam", url: "https://www.d2l.ai/chapter_optimization/", resourceId: "d2l", sections: "skim only — repo-sanctioned preview of the optimizer you will meet for real at L3", minutes: 20 },
    { title: "An overview of gradient descent optimization algorithms (Ruder)", url: "https://arxiv.org/pdf/1609.04747", sections: "the GD/momentum/Adam taxonomy — still the field's shared vocabulary; predates modern practice, read for names not recipes", minutes: 45 },
    { title: "MML book §7.1–7.2", resourceId: "mml-book", sections: "GD + constrained optimization/Lagrange in ML notation — consolidation pass", minutes: 40 },
  ],
  prove: {
    task: "Node masteryTest, from scratch: minimize the Rosenbrock function with GD+momentum, visualize the path over the contours, and explain every hyperparameter's effect (η, momentum coefficient, init) from your OWN plots. Rosenbrock is the PROVE IT precisely because bowl-shaped intuition dies in its banana valley.",
    criteria: [
      "The valley path is shown, not described — plain GD visibly struggles where momentum tracks the floor",
      "Every hyperparameter claim points at a specific plot you produced",
      "You can state why the bowl intuition fails here (curvature wildly different across vs along the valley)",
    ],
    minutes: 70,
  },
  transfer: {
    task: "Baby inverse kinematics: minimize ‖FK(θ)−target‖² for the 2-link arm by GD, with the gradient via your numerical_jacobian from l2-multivariable. Watch θ walk the arm to the target. Then find a case where progress stalls and note the arm's shape.",
    criteria: [
      "Arm converges to a reachable target from several initializations",
      "The stall case is shown, with the observation that it happens near a straightened elbow — singularity foreshadowing that l5-jacobians will name",
    ],
    minutes: 40,
  },
  retention: "Day+14: derive the divergence threshold for GD on f(x) = ½ax² (η > 2/a), sketch all four step-size regimes from memory, and state in one sentence what momentum adds.",
  researchRecord: "docs/curation/l2-optimization.md",
  minutes: 510,
};
