import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-multivariable.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-multivariable",
  whyNow:
    "One object, two careers: ∇L drives every training run, J drives every robot-arm velocity map. Partials, the gradient, the Jacobian and the multivariable chain rule are load-bearing for the entire program — backprop at L3 IS Jacobian products, manipulator control at L5 IS the Jacobian. And the single most damaging misconception in all of backprop — applying the scalar chain rule where paths must be SUMMED — gets killed here, now, while it is cheap.",
  diagnostic: {
    prompt:
      "Cold: gradient of x·y at (2,3)? Jacobian shape of f: ℝ⁵→ℝ³? What does a negative Hessian eigenvalue mean?",
    minutes: 5,
  },
  orient: {
    title: "Gradient descent, how neural networks learn — the gradient-vector segment",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=IHZwWFHWa-w", 618, 799),
    startSeconds: 618,
    endSeconds: 799,
    minutes: 4,
    whySelected: "∇ as 'which nudge matters most' — in 13,002 dimensions. Watch 11:18–12:19 plus the surrounding minute; the full video belongs to l2-optimization.",
    leaveWith: ["the gradient's components rank inputs by how much they matter"],
  },
  coreWatch: [
    {
      title: "Khan Academy Multivariable Calculus — 'Derivatives of multivariable functions' unit",
      creator: "Khan Academy (videos by Grant Sanderson)",
      url: "https://www.khanacademy.org/math/multivariable-calculus",
      minutes: 70,
      whySelected: "The closest thing to an 'Essence of multivariable calculus' — Sanderson-authored partials, gradient, directional derivatives, and the Jacobian-as-local-linearization subsection, with embedded practice. Do the unit's exercises as you go; watch at 1.25–1.5×.",
      leaveWith: [
        "∂ = ordinary derivative with the other inputs frozen — not a new operation",
        "∇f = vector of partials; points steepest ascent; ⊥ level curves",
        "Jacobian = the local linear map; rows = outputs, columns = inputs",
      ],
    },
  ],
  recall: [
    { q: "f(x,y) = x²y. What is ∂f/∂x, and what exactly does ∂ license you to do?", a: "2xy — freeze y as a constant and take an ordinary derivative. Partial differentiation is not a new operation." },
    { q: "Why does ∇f point in the steepest-ascent direction?", a: "The directional derivative along unit u is ∇f·u = |∇f|cos θ, maximized when u aligns with ∇f. That is a derivation, not a fact to memorize — and it also gives ∇f ⊥ level sets (zero change along them)." },
    { q: "f: ℝ⁵→ℝ³ — Jacobian shape, and what do rows and columns mean?", a: "3×5: one row per output, one column per input. J is the best local linear approximation of f — matrix-vector multiply on input nudges." },
    { q: "h(x) = f(x, g(x)). Why is dh/dx NOT just ∂f/∂g · g'(x)?", a: "x reaches f along two paths (directly, and through g) and paths are SUMMED: dh/dx = ∂f/∂x + ∂f/∂g·g'(x). Missing the sum is the documented root of backprop confusion." },
    { q: "The Hessian at a critical point has eigenvalues {+3, −1}. What is the point?", a: "A saddle — a negative eigenvalue means some direction curves downhill; the Hessian is curvature, not a formula." },
  ],
  interactiveIds: ["gradient-descent"],
  coreRead: [
    {
      title: "Paul's Calc III — Partial Derivatives",
      url: "https://tutorial.math.lamar.edu/Classes/CalcIII/PartialDerivatives.aspx",
      resourceId: "pauls-notes",
      sections: "worked computations — build the freeze-the-others reflex",
      minutes: 30,
    },
    {
      title: "Paul's Calc III — Chain Rule (multivariable, tree diagrams)",
      url: "https://tutorial.math.lamar.edu/Classes/CalcIII/ChainRule.aspx",
      resourceId: "pauls-notes",
      sections: "the full tree-diagram treatment — do NOT skip; this is the total-derivative vaccine (paths sum)",
      minutes: 35,
      whySelected: "Tree diagrams drill exactly the multi-path summation that scalar chain-rule habits silently break on.",
    },
    {
      title: "Paul's Calc III — Directional Derivatives",
      url: "https://tutorial.math.lamar.edu/Classes/CalcIII/DirectionalDeriv.aspx",
      resourceId: "pauls-notes",
      sections: "defines the gradient and PROVES steepest ascent — reproduce that proof yourself",
      minutes: 25,
    },
  ],
  practice: [
    { prompt: "Paul's practice sets for all three sections (~15 problems total, full solutions). Every multi-path chain-rule problem in the set is mandatory — those are the reps that protect backprop.", source: "https://tutorial.math.lamar.edu/problems/calciii/partialderivsintro.aspx", minutes: 60 },
    { prompt: "Plot a 2D loss surface and its gradient field. Predict every arrow from the level sets BEFORE revealing it (do this in the gradient-descent instrument too), then walk downhill by hand for 5 steps.", minutes: 35 },
    { prompt: "Compute the Jacobian of polar→cartesian (x = r cos θ, y = r sin θ) by hand, stating the shape and what each entry means.", minutes: 25 },
  ],
  implement: {
    spec: "numerical_jacobian(f, x) via central differences — the generalization of l2-derivatives' check_grad to vector in/vector out. Verify your hand polar→cartesian Jacobian with it. Then visualize Hessian eigenvalues at a saddle vs a bowl (f = x²−y² vs x²+y²).",
    checks: [
      "Reproduces the hand polar→cartesian Jacobian at several (r, θ)",
      "Returns the right m×n shape for arbitrary f: ℝⁿ→ℝᵐ without special-casing",
      "Saddle shows mixed-sign eigenvalues, bowl all-positive — and you can point at both pictures",
    ],
    minutes: 75,
  },
  stuck: {
    alternateRead: {
      title: "The Total Derivative: Correcting the Misconception of Backpropagation's Chain Rule",
      url: "https://towardsdatascience.com/the-total-derivative-correcting-the-misconception-of-backpropagations-chain-rule/",
      sections: "full article — targeted repair for multi-path chain-rule confusion",
      minutes: 20,
    },
    note: "The moment f(x, g(x)) trips you, read the total-derivative article — this is THE documented backprop blocker. For gradient/directional-derivative re-explanations, use the Khan unit's text articles.",
  },
  deepen: [
    { title: "MML book §5.1–5.7", url: "https://mml-book.github.io/", resourceId: "mml-book", sections: "the ML-dialect consolidation (Jacobian shape conventions, Hessian) — terse; read only after everything computes", minutes: 60 },
    { title: "Second partial derivative test", url: "https://www.khanacademy.org/math/multivariable-calculus/applications-of-multivariable-derivatives/optimizing-multivariable-functions-videos/v/second-partial-derivative-test", resourceId: "khan-multivariable", sections: "one video — the Hessian-as-curvature payoff", minutes: 12 },
    { title: "Paul's Calc III — Gradient Vector, Tangent Planes", url: "https://tutorial.math.lamar.edu/Classes/CalcIII/GradientVectorTangentPlane.aspx", resourceId: "pauls-notes", sections: "the ∇ ⊥ level-sets geometry, with practice set", minutes: 25 },
  ],
  prove: {
    task: "Node masteryTest: for f(x) = ‖Ax−b‖², derive ∇f = 2Aᵀ(Ax−b) BY COMPONENTS once (expand, differentiate one xₖ honestly), then again by matrix calculus — and verify with your numerical_jacobian at random A, b, x. Gradient descent on this f is training linear regression.",
    criteria: [
      "Component route: ∂/∂xₖ of Σᵢ(Σⱼ aᵢⱼxⱼ − bᵢ)² done without hand-waving",
      "Matrix-calculus route reaches the same 2Aᵀ(Ax−b)",
      "numerical_jacobian agrees numerically",
      "Every intermediate shape stated (Ax−b is m×1, Aᵀ(·) is n×1)",
    ],
    minutes: 45,
  },
  transfer: {
    task: "Two-link arm FK f(θ₁,θ₂) = (x,y): compute the full 2×2 Jacobian by hand via the chain rule on the angle sums, verify with numerical_jacobian, then answer: which joint moves the fingertip more right now? This is l5-jacobians, three levels early.",
    criteria: [
      "All four entries correct, including the shared chain-rule terms on (θ₁+θ₂)",
      "Numerical check agrees at several configurations",
      "'Which joint matters more' read off the Jacobian columns, with the reasoning said aloud",
    ],
    minutes: 30,
  },
  retention: "Day+7: cold-write the multivariable chain rule as a Jacobian product for h = f∘g with g: ℝ⁵→ℝ², f: ℝ²→ℝ³, stating every shape; then one multi-path ∂/∂x of f(x, g(x)).",
  researchRecord: "docs/curation/l2-multivariable.md",
  minutes: 439,
};
