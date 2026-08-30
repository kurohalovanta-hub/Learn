import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-derivatives.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-derivatives",
  whyNow:
    "The chain rule is backpropagation. Learn it cold here and Level 3's backprop derivation turns into simple bookkeeping. A derivative just answers one question: when you nudge the input a little, how much does the output move? The videos feel obvious while you watch them, but only the practice reps make it stick.",
  diagnostic: {
    prompt:
      "Cold, under 90 seconds total: find d/dx of e^{3x²}, of ln(sin x), and of 1/(1+e^{-x}). If you get all three clean, skip ahead to the timed practice reps and prove it.",
    minutes: 5,
  },
  orient: {
    title: "The Essence of Calculus, Chapter 1",
    creator: "3Blue1Brown",
    url: "https://www.3blue1brown.com/lessons/essence-of-calculus/",
    minutes: 11,
    whySelected: "Just orientation. It sets up the 'invent calculus yourself' frame for the whole series. Watch at 1.5×, or skip if you are impatient.",
    unverified: true,
  },
  coreWatch: [
    {
      title: "The paradox of the derivative, Essence of Calculus Ch. 2",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=9vKqVkMQHKk",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=9vKqVkMQHKk"),
      minutes: 16,
      whySelected: "'Instantaneous rate of change' sounds like a paradox; 'best constant approximation near a point' does not. This framing keeps you from thinking of a derivative as one single number.",
      leaveWith: ["derivative = best linear approximation, not magic instant speed", "f'(x) is a function, not one number", "dy/dx is a limit of real ratios over shrinking nudges"],
      unverified: true,
    },
    {
      title: "Derivative formulas through geometry, Ch. 3",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=S0_qX4VJhMQ",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=S0_qX4VJhMQ"),
      minutes: 18,
      whySelected: "The power rule stops being something you memorize: d(x²) is just two strips of a growing square. A little optional if you are short on time.",
      leaveWith: ["power rule from geometry, not incantation", "d(uv) = u·dv + v·du as area strips"],
      unverified: true,
    },
    {
      title: "Visualizing the chain rule and product rule, Ch. 4",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=YG15m2VwSjA",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=YG15m2VwSjA"),
      minutes: 16,
      whySelected: "The most important video here. A small nudge dx travels through g, then through f, and the sensitivities multiply along the way. That picture of a nudge traveling and multiplying is exactly how backprop works. Pause at each rule and predict the answer before it shows you.",
      leaveWith: ["chain rule = sensitivities multiply along a composition", "always name outer f and inner g explicitly", "d/dx f(g(x)) = f'(g(x))·g'(x), evaluated at the inner value"],
    },
    {
      title: "What's so special about Euler's number e?, Ch. 5",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=m2MIpDrF7Es",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=m2MIpDrF7Es"),
      minutes: 14,
      whySelected: "Why e^x is its own derivative. You will need this for σ, softmax, and log-loss later.",
      leaveWith: ["d/dx aˣ = aˣ·ln a; only a = e gives constant 1", "d/dx ln x = 1/x"],
      unverified: true,
    },
  ],
  recall: [
    { q: "Why is 'instantaneous rate of change' a paradox, and what is the derivative instead?", a: "Change needs two points; at one instant nothing changes. The derivative is the limit of average rates over shrinking windows, the best constant-slope approximation of f near the point." },
    { q: "d/dx f(g(x)) = ?, and how do you read it as nudges?", a: "f'(g(x))·g'(x). A nudge dx becomes dg = g'(x)dx, which becomes df = f'(g(x))·dg: sensitivities multiply along the composition." },
    { q: "Why is d(uv) = u·dv + v·du, geometrically?", a: "uv is the area of a u×v rectangle; nudging each side adds two strips, u·dv and v·du, and the corner sliver vanishes in the limit." },
    { q: "What makes e special among exponentials?", a: "d/dx aˣ = aˣ·ln a, every exponential's derivative is proportional to itself; a = e is the base where the constant is exactly 1." },
    { q: "Your hand derivative disagrees with (f(x+h)−f(x−h))/2h at several x. Which do you trust?", a: "The finite difference, it is a direct measurement. The symbolic result almost certainly has a chain-rule slip." },
  ],
  interactiveIds: ["derivative-explorer"],
  lessonId: "l2-derivatives",
  coreRead: [
    {
      title: "Paul's Calc I, Differentiation Formulas",
      url: "https://tutorial.math.lamar.edu/classes/calci/diffformulas.aspx",
      resourceId: "pauls-notes",
      sections: "full section, every worked example with pen in hand",
      minutes: 25,
      whySelected: "A short, no-nonsense worked procedure for exactly what the videos showed you geometrically.",
    },
    {
      title: "Paul's Calc I, Product and Quotient Rule",
      url: "https://tutorial.math.lamar.edu/classes/calci/productquotientrule.aspx",
      resourceId: "pauls-notes",
      sections: "full section, worked examples",
      minutes: 25,
    },
    {
      title: "Paul's Calc I, Chain Rule",
      url: "https://tutorial.math.lamar.edu/classes/calcI/ChainRule.aspx",
      resourceId: "pauls-notes",
      sections: "full section incl. the two-forms treatment; work every example before reading its solution",
      minutes: 35,
      whySelected: "This is the step-by-step backbone of the main skill here, and it leads you to the only free 30-ish problem chain-rule set with full solutions.",
    },
  ],
  practice: [
    { prompt: "Paul's Chain Rule practice set: about 30 problems with full solutions. Do them on paper, and name the outer and inner function on every problem, even the easy ones.", source: "https://tutorial.math.lamar.edu/Problems/CalcI/ChainRule.aspx", minutes: 45 },
    { prompt: "Paul's Differentiation Formulas practice set. Do enough problems to make the power, product, and quotient rules automatic, then check yourself against the full solutions.", source: "https://tutorial.math.lamar.edu/problems/calci/diffformulas.aspx", minutes: 25 },
    { prompt: "30 timed chain-rule reps, mixed and getting harder (include some 3-deep compositions), ending with σ(w·x+b) differentiated with respect to w, x, and b. Name the inner and outer function every single time; that habit is what keeps your scalar work from falling apart once things go multivariable.", minutes: 50 },
  ],
  implement: {
    spec: "check_grad(f, df, x): a central-difference checker in NumPy. Compare df(x) against (f(x+h)−f(x−h))/(2h). Use it to check five of your own hand derivatives, including σ(x)=1/(1+e^{-x}) and its σ(1−σ) form. You will reuse this function for years.",
    checks: [
      "Agrees with every correct hand derivative to ~1e-7 at h=1e-5",
      "Catches a deliberately planted wrong derivative",
      "dσ/dx = σ(x)(1−σ(x)) verified numerically at several x",
    ],
    minutes: 50,
  },
  stuck: {
    alternateRead: {
      title: "Khan Academy, Differential Calculus (chain rule lessons)",
      resourceId: "khan-math",
      sections: "chain-rule lessons with adaptive practice, videos appear on failure; slower but diagnostic",
      minutes: 40,
    },
    note: "If the chain rule still feels like a meaningless symbol ritual, read the QuantInsti walk-through (blog.quantinsti.com/understanding-chain-rule). It restates the rule directly in neural-network terms.",
  },
  deepen: [
    { title: "3B1B Essence of Calculus Ch. 6, implicit differentiation", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", resourceId: "3b1b-calculus", sections: "Ch. 6 from the series playlist", minutes: 15 },
    { title: "Paul's Calc I, Implicit Differentiation", url: "https://tutorial.math.lamar.edu/classes/calci/calci.aspx", resourceId: "pauls-notes", sections: "Implicit Differentiation section, reached from the Derivatives chapter index", minutes: 30 },
    { title: "MIT 18.01SC Single Variable Calculus, Unit 1", sections: "only if Paul's feels too terse; selective use, do NOT run the course linearly (repo-designated backup, foundations report §5)", minutes: 120 },
  ],
  prove: {
    task: "Closed book: differentiate L = (y − σ(wx+b))² with respect to w and b by hand. Write out the composition structure (outer and inner at every layer) instead of pattern-matching. Then check both results with your own check_grad. This is a neuron's backward pass, one level early.",
    criteria: [
      "Both derivatives correct, with the 3-deep composition named at every step",
      "dσ/dx = σ(1−σ) derived inside the computation, not quoted",
      "check_grad confirms ∂L/∂w and ∂L/∂b to ~1e-7",
      "Done without notes",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Two-link arm, fingertip position x(θ₁,θ₂) = l₁cos θ₁ + l₂cos(θ₁+θ₂): compute ∂x/∂θ₁ by the chain rule, then check it with finite differences at a few configurations. You have just computed your first Jacobian entry, three levels early.",
    criteria: ["Derivative correct, including the chain-rule term on cos(θ₁+θ₂)", "Finite-difference check agrees at several (θ₁, θ₂)"],
    minutes: 20,
  },
  retention: "Day+7: 10 mixed chain-rule reps, including one 3-deep composition and re-deriving dσ/dx = σ(1−σ), in under 8 minutes, no notes.",
  researchRecord: "docs/curation/l2-derivatives.md",
  minutes: 385,
};
