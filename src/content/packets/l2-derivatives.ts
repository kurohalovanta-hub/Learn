import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-derivatives.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-derivatives",
  whyNow:
    "The chain rule IS backpropagation — this is the single highest-leverage calculus skill in the whole program. A derivative is a sensitivity multiplier: how hard does the output move when you nudge the input? Master that question here, until it is automatic, and Level 3's backprop derivation becomes bookkeeping. This is also the canonical recognition-vs-mastery trap: the videos feel obvious while watching. Only the reps make it real.",
  diagnostic: {
    prompt:
      "Cold, under 90 seconds total: d/dx of e^{3x²}, of ln(sin x), of 1/(1+e^{-x}). Clean pass = skip straight to the timed practice reps and PROVE IT.",
    minutes: 5,
  },
  orient: {
    title: "The Essence of Calculus — Chapter 1",
    creator: "3Blue1Brown",
    url: "https://www.3blue1brown.com/lessons/essence-of-calculus/",
    minutes: 11,
    whySelected: "Pure orientation — the 'invent calculus yourself' frame for the whole series. Watch at 1.5×, or skip if impatient.",
    unverified: true,
  },
  coreWatch: [
    {
      title: "The paradox of the derivative — Essence of Calculus Ch. 2",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=9vKqVkMQHKk",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=9vKqVkMQHKk"),
      minutes: 16,
      whySelected: "'Instantaneous rate of change' is a paradox; 'best constant approximation near a point' is not — this framing prevents the derivative-as-single-number confusion.",
      leaveWith: ["derivative = best linear approximation, not magic instant speed", "f'(x) is a function, not one number", "dy/dx is a limit of real ratios over shrinking nudges"],
      unverified: true,
    },
    {
      title: "Derivative formulas through geometry — Ch. 3",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=S0_qX4VJhMQ",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=S0_qX4VJhMQ"),
      minutes: 18,
      whySelected: "The power rule stops being memorized: d(x²) is two strips of a growing square. Slightly optional if time-pressed.",
      leaveWith: ["power rule from geometry, not incantation", "d(uv) = u·dv + v·du as area strips"],
      unverified: true,
    },
    {
      title: "Visualizing the chain rule and product rule — Ch. 4",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=YG15m2VwSjA",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=YG15m2VwSjA"),
      minutes: 16,
      whySelected: "The load-bearing video of this node: a nudge dx propagates through g, then through f, multiplying sensitivities. This 'nudge propagation' IS backprop's mental model. Pause at each rule and predict before the reveal.",
      leaveWith: ["chain rule = sensitivities multiply along a composition", "always name outer f and inner g explicitly", "d/dx f(g(x)) = f'(g(x))·g'(x) — evaluated at the inner value"],
    },
    {
      title: "What's so special about Euler's number e? — Ch. 5",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=m2MIpDrF7Es",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=m2MIpDrF7Es"),
      minutes: 14,
      whySelected: "Why e^x is its own derivative — needed for σ, softmax, and log-loss later.",
      leaveWith: ["d/dx aˣ = aˣ·ln a; only a = e gives constant 1", "d/dx ln x = 1/x"],
      unverified: true,
    },
  ],
  recall: [
    { q: "Why is 'instantaneous rate of change' a paradox, and what is the derivative instead?", a: "Change needs two points; at one instant nothing changes. The derivative is the limit of average rates over shrinking windows — the best constant-slope approximation of f near the point." },
    { q: "d/dx f(g(x)) = ? — and how do you read it as nudges?", a: "f'(g(x))·g'(x). A nudge dx becomes dg = g'(x)dx, which becomes df = f'(g(x))·dg: sensitivities multiply along the composition." },
    { q: "Why is d(uv) = u·dv + v·du, geometrically?", a: "uv is the area of a u×v rectangle; nudging each side adds two strips, u·dv and v·du, and the corner sliver vanishes in the limit." },
    { q: "What makes e special among exponentials?", a: "d/dx aˣ = aˣ·ln a — every exponential's derivative is proportional to itself; a = e is the base where the constant is exactly 1." },
    { q: "Your hand derivative disagrees with (f(x+h)−f(x−h))/2h at several x. Which do you trust?", a: "The finite difference — it is a direct measurement. The symbolic result almost certainly has a chain-rule slip." },
  ],
  interactiveIds: ["derivative-explorer"],
  lessonId: "l2-derivatives",
  coreRead: [
    {
      title: "Paul's Calc I — Differentiation Formulas",
      url: "https://tutorial.math.lamar.edu/classes/calci/diffformulas.aspx",
      resourceId: "pauls-notes",
      sections: "full section, every worked example with pen in hand",
      minutes: 25,
      whySelected: "Terse, adult-toned worked procedure for exactly what the videos showed geometrically.",
    },
    {
      title: "Paul's Calc I — Product and Quotient Rule",
      url: "https://tutorial.math.lamar.edu/classes/calci/productquotientrule.aspx",
      resourceId: "pauls-notes",
      sections: "full section, worked examples",
      minutes: 25,
    },
    {
      title: "Paul's Calc I — Chain Rule",
      url: "https://tutorial.math.lamar.edu/classes/calcI/ChainRule.aspx",
      resourceId: "pauls-notes",
      sections: "full section incl. the two-forms treatment; work every example before reading its solution",
      minutes: 35,
      whySelected: "The procedural spine of the node's central skill — and the gateway to the only free ~30-problem chain-rule set with full solutions.",
    },
  ],
  practice: [
    { prompt: "Paul's Chain Rule practice set: ~30 problems with full solutions. On paper, naming the outer and inner function on every single problem — no exceptions, even the easy ones.", source: "https://tutorial.math.lamar.edu/Problems/CalcI/ChainRule.aspx", minutes: 45 },
    { prompt: "Paul's Differentiation Formulas practice set — enough problems to make power/product/quotient automatic; self-check against the full solutions.", source: "https://tutorial.math.lamar.edu/problems/calci/diffformulas.aspx", minutes: 25 },
    { prompt: "30 timed chain-rule reps, mixed and escalating (include 3-deep compositions), ending with σ(w·x+b) differentiated w.r.t. w, x, AND b. Naming inner/outer explicitly every time is your vaccine against the scalar-habits-break-at-multivariable failure.", minutes: 50 },
  ],
  implement: {
    spec: "check_grad(f, df, x): central-difference verifier in NumPy — compare df(x) against (f(x+h)−f(x−h))/(2h). Use it to check five of your hand derivatives, including σ(x)=1/(1+e^{-x}) and its σ(1−σ) form. You will reuse this function for years.",
    checks: [
      "Agrees with every correct hand derivative to ~1e-7 at h=1e-5",
      "Catches a deliberately planted wrong derivative",
      "dσ/dx = σ(x)(1−σ(x)) verified numerically at several x",
    ],
    minutes: 50,
  },
  stuck: {
    alternateRead: {
      title: "Khan Academy — Differential Calculus (chain rule lessons)",
      resourceId: "khan-math",
      sections: "chain-rule lessons with adaptive practice — videos appear on failure; slower but diagnostic",
      minutes: 40,
    },
    note: "If the chain rule still feels like a symbol ritual, read the QuantInsti walk-through (blog.quantinsti.com/understanding-chain-rule) — it restates the rule directly in neural-network terms.",
  },
  deepen: [
    { title: "3B1B Essence of Calculus Ch. 6 — implicit differentiation", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", resourceId: "3b1b-calculus", sections: "Ch. 6 from the series playlist", minutes: 15 },
    { title: "Paul's Calc I — Implicit Differentiation", url: "https://tutorial.math.lamar.edu/classes/calci/calci.aspx", resourceId: "pauls-notes", sections: "Implicit Differentiation section, reached from the Derivatives chapter index", minutes: 30 },
    { title: "MIT 18.01SC Single Variable Calculus — Unit 1", sections: "only if Paul's feels too terse; selective use — do NOT run the course linearly (repo-designated backup, foundations report §5)", minutes: 120 },
  ],
  prove: {
    task: "Closed book: differentiate L = (y − σ(wx+b))² w.r.t. w and b by hand, writing the composition structure (outer/inner at every layer) rather than pattern-matching. Then verify both results with YOUR check_grad. This IS a neuron's backward pass, one level early.",
    criteria: [
      "Both derivatives correct, with the 3-deep composition named at every step",
      "dσ/dx = σ(1−σ) derived inside the computation, not quoted",
      "check_grad confirms ∂L/∂w and ∂L/∂b to ~1e-7",
      "Done without notes",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Two-link arm fingertip x(θ₁,θ₂) = l₁cos θ₁ + l₂cos(θ₁+θ₂): compute ∂x/∂θ₁ by the chain rule, then verify by finite differences at a few configurations. You have just computed your first Jacobian entry — three levels early.",
    criteria: ["Derivative correct, including the chain-rule term on cos(θ₁+θ₂)", "Finite-difference check agrees at several (θ₁, θ₂)"],
    minutes: 20,
  },
  retention: "Day+7: 10 mixed chain-rule reps — including one 3-deep composition and re-deriving dσ/dx = σ(1−σ) — in under 8 minutes, no notes.",
  researchRecord: "docs/curation/l2-derivatives.md",
  minutes: 385,
};
