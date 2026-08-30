import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-multivariable.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-multivariable",
  whyNow:
    "The same math shows up twice later. The gradient (∇L) runs every training step, and the Jacobian (J) maps every robot-arm motion. Learn partials, the gradient, the Jacobian, and the multivariable chain rule now, and you also kill the most common backprop bug: when a variable reaches the output by two paths, you add the paths, you don't just multiply one.",
  diagnostic: {
    prompt:
      "No notes: what is the gradient of x·y at (2,3)? What shape is the Jacobian of f: ℝ⁵→ℝ³? What does a negative Hessian eigenvalue tell you?",
    minutes: 5,
  },
  orient: {
    title: "Gradient descent, how neural networks learn, the gradient-vector segment",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=IHZwWFHWa-w", 618, 799),
    startSeconds: 618,
    endSeconds: 799,
    minutes: 4,
    whySelected: "See the gradient as 'which nudge matters most,' even in 13,002 dimensions. Watch 11:18–12:19 plus the minute around it; the full video belongs to l2-optimization.",
    leaveWith: ["each part of the gradient tells you how much that input matters"],
  },
  coreWatch: [
    {
      title: "Khan Academy Multivariable Calculus, 'Derivatives of multivariable functions' unit",
      creator: "Khan Academy (videos by Grant Sanderson)",
      url: "https://www.khanacademy.org/math/multivariable-calculus",
      minutes: 70,
      whySelected: "The closest thing to an 'Essence of multivariable calculus.' Sanderson made these: partials, the gradient, directional derivatives, and the part where the Jacobian is a local linear map, with practice built in. Do the exercises as you go; watch at 1.25–1.5×.",
      leaveWith: [
        "∂ is just an ordinary derivative with the other inputs held still, not a new operation",
        "∇f is the vector of partials; it points uphill the steepest way and sits at right angles to the level curves",
        "the Jacobian is the local linear map; rows are outputs, columns are inputs",
      ],
    },
  ],
  recall: [
    { q: "f(x,y) = x²y. What is ∂f/∂x, and what exactly does ∂ license you to do?", a: "2xy, freeze y as a constant and take an ordinary derivative. Partial differentiation is not a new operation." },
    { q: "Why does ∇f point in the steepest-ascent direction?", a: "The directional derivative along unit u is ∇f·u = |∇f|cos θ, maximized when u aligns with ∇f. That is a derivation, not a fact to memorize, and it also gives ∇f ⊥ level sets (zero change along them)." },
    { q: "f: ℝ⁵→ℝ³, Jacobian shape, and what do rows and columns mean?", a: "3×5: one row per output, one column per input. J is the best local linear approximation of f, matrix-vector multiply on input nudges." },
    { q: "h(x) = f(x, g(x)). Why is dh/dx NOT just ∂f/∂g · g'(x)?", a: "x reaches f along two paths (directly, and through g) and paths are SUMMED: dh/dx = ∂f/∂x + ∂f/∂g·g'(x). Missing the sum is the documented root of backprop confusion." },
    { q: "The Hessian at a critical point has eigenvalues {+3, −1}. What is the point?", a: "A saddle, a negative eigenvalue means some direction curves downhill; the Hessian is curvature, not a formula." },
  ],
  interactiveIds: ["gradient-descent"],
  coreRead: [
    {
      title: "Paul's Calc III, Partial Derivatives",
      url: "https://tutorial.math.lamar.edu/Classes/CalcIII/PartialDerivatives.aspx",
      resourceId: "pauls-notes",
      sections: "worked computations, build the freeze-the-others reflex",
      minutes: 30,
    },
    {
      title: "Paul's Calc III, Chain Rule (multivariable, tree diagrams)",
      url: "https://tutorial.math.lamar.edu/Classes/CalcIII/ChainRule.aspx",
      resourceId: "pauls-notes",
      sections: "the full tree-diagram treatment, do NOT skip; this is the total-derivative vaccine (paths sum)",
      minutes: 35,
      whySelected: "Tree diagrams drill the multi-path summation that scalar chain-rule habits quietly get wrong.",
    },
    {
      title: "Paul's Calc III, Directional Derivatives",
      url: "https://tutorial.math.lamar.edu/Classes/CalcIII/DirectionalDeriv.aspx",
      resourceId: "pauls-notes",
      sections: "defines the gradient and PROVES steepest ascent, reproduce that proof yourself",
      minutes: 25,
    },
  ],
  practice: [
    { prompt: "Paul's practice sets for all three sections (~15 problems total, with full solutions). Do every multi-path chain-rule problem; those are the reps that protect you from the backprop bug.", source: "https://tutorial.math.lamar.edu/problems/calciii/partialderivsintro.aspx", minutes: 60 },
    { prompt: "Plot a 2D loss surface and its gradient field. Predict every arrow from the level sets BEFORE revealing it (do this in the gradient-descent instrument too), then walk downhill by hand for 5 steps.", minutes: 35 },
    { prompt: "Compute the Jacobian of polar→cartesian (x = r cos θ, y = r sin θ) by hand, stating the shape and what each entry means.", minutes: 25 },
  ],
  implement: {
    spec: "Write numerical_jacobian(f, x) using central differences. It is l2-derivatives' check_grad grown up to handle vector in, vector out. Check your hand polar→cartesian Jacobian with it. Then show the Hessian eigenvalues at a saddle versus a bowl (f = x²−y² versus x²+y²).",
    checks: [
      "Reproduces the hand polar→cartesian Jacobian at several (r, θ)",
      "Returns the right m×n shape for arbitrary f: ℝⁿ→ℝᵐ without special-casing",
      "Saddle shows mixed-sign eigenvalues, bowl all-positive, and you can point at both pictures",
    ],
    minutes: 75,
  },
  stuck: {
    alternateRead: {
      title: "The Total Derivative: Correcting the Misconception of Backpropagation's Chain Rule",
      url: "https://towardsdatascience.com/the-total-derivative-correcting-the-misconception-of-backpropagations-chain-rule/",
      sections: "full article, targeted repair for multi-path chain-rule confusion",
      minutes: 20,
    },
    note: "The moment f(x, g(x)) trips you, read the total-derivative article; this is the classic backprop blocker. If you need the gradient or directional derivative explained another way, use the Khan unit's text articles.",
  },
  deepen: [
    { title: "MML book §5.1–5.7", url: "https://mml-book.github.io/", resourceId: "mml-book", sections: "the ML-dialect consolidation (Jacobian shape conventions, Hessian), terse; read only after everything computes", minutes: 60 },
    { title: "Second partial derivative test", url: "https://www.khanacademy.org/math/multivariable-calculus/applications-of-multivariable-derivatives/optimizing-multivariable-functions-videos/v/second-partial-derivative-test", resourceId: "khan-multivariable", sections: "one video, the Hessian-as-curvature payoff", minutes: 12 },
    { title: "Paul's Calc III, Gradient Vector, Tangent Planes", url: "https://tutorial.math.lamar.edu/Classes/CalcIII/GradientVectorTangentPlane.aspx", resourceId: "pauls-notes", sections: "the ∇ ⊥ level-sets geometry, with practice set", minutes: 25 },
  ],
  prove: {
    task: "Node masteryTest: for f(x) = ‖Ax−b‖², derive ∇f = 2Aᵀ(Ax−b) two ways. First by components (expand it, differentiate one xₖ honestly), then by matrix calculus. Verify with your numerical_jacobian at random A, b, x. Running gradient descent on this f is exactly training linear regression.",
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
