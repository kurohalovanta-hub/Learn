import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-integrals.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-integrals",
  whyNow:
    "Just enough integration to read ∫p(x)dx = 1, expectations, and value functions — the notation half of probability. The accumulation-of-small-changes picture (not 'integral = antiderivative' memorized) is what transfers to 𝔼[X] = ∫x p(x)dx and to integrating velocity into position. This node is deliberately minimal and gates at silver: technique-grinding is the canonical Calc II time-sink and is explicitly banned. Do not gold-plate it.",
  diagnostic: {
    prompt:
      "∫₀¹ 3x² dx in your head; what is d/dx ∫₀ˣ f(t)dt?; one u-sub: ∫2x·cos(x²)dx. Clean pass = jump straight to IMPLEMENT and PROVE IT.",
    minutes: 4,
  },
  coreWatch: [
    {
      title: "Integration and the fundamental theorem of calculus — Essence of Calculus Ch. 8",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=rfG8ce4nNh0",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=rfG8ce4nNh0"),
      minutes: 20,
      whySelected: "Builds the FTC from the car-velocity accumulation problem — the one picture that transfers to expectations. Pause at the FTC reveal and state it yourself first.",
      leaveWith: ["integral = accumulated small changes; area is the picture, not the definition", "FTC: the slope of the area function is the height of the graph", "antiderivatives are a family, F(x)+C"],
      unverified: true,
    },
  ],
  recall: [
    { q: "Ch. 8 builds integration from a moving car. What question forces the integral into existence?", a: "Reconstructing distance from the velocity readout alone: sum v(t)·dt slices; the area under v(t) emerges as the answer, and its exact value comes from an antiderivative." },
    { q: "State the FTC in the area-function voice.", a: "d/dx ∫ₐˣ f(t)dt = f(x) — the rate the accumulated area grows is the height of the graph. Hence ∫ₐᵇ f = F(b)−F(a) for any antiderivative F." },
    { q: "What are you hunting for when you try u-substitution?", a: "An inner function u whose derivative du sits beside it (up to a constant) — the chain rule run backwards, not pattern-matching roulette." },
    { q: "Why does every indefinite integral carry +C?", a: "Differentiation kills constants, so integration cannot recover which member of the antiderivative family you had — all of them differ by a constant." },
  ],
  coreRead: [
    {
      title: "Paul's Calc I — Integrals chapter (intro sections)",
      url: "https://tutorial.math.lamar.edu/classes/calci/integralsintro.aspx",
      resourceId: "pauls-notes",
      sections: "Indefinite Integrals → Computing Indefinite Integrals → Definition of the Definite Integral (reach these from the chapter index); worked examples only, skip everything on the node's skip list",
      minutes: 25,
      whySelected: "The exact subset covering the node's whole objective list — nothing from Calc II technique machinery.",
    },
    {
      title: "Paul's — Computing Definite Integrals",
      url: "https://tutorial.math.lamar.edu/classes/calci/computingdefiniteintegrals.aspx",
      resourceId: "pauls-notes",
      sections: "the FTC Part II treatment, worked examples",
      minutes: 10,
    },
    {
      title: "Paul's — Substitution Rule for Indefinite Integrals",
      url: "https://tutorial.math.lamar.edu/classes/calci/substitutionruleindefinite.aspx",
      resourceId: "pauls-notes",
      sections: "worked examples — read each as 'spot the inner-function/derivative pair'",
      minutes: 15,
    },
    {
      title: "Paul's — Substitution Rule for Definite Integrals",
      url: "https://tutorial.math.lamar.edu/classes/calci/SubstitutionRuleDefinite.aspx",
      resourceId: "pauls-notes",
      sections: "worked examples; watch how the limits transform with u",
      minutes: 10,
    },
  ],
  practice: [
    { prompt: "Paul's Substitution Rule practice set (indefinite): odd-numbered problems on paper, self-checked against the full solutions. Stop at fluency, not completion.", source: "https://tutorial.math.lamar.edu/problems/calci/substitutionruleindefinite.aspx", minutes: 30 },
    { prompt: "Paul's Substitution Rule practice set (definite): a handful of problems — the point is transforming the limits along with the variable.", source: "https://tutorial.math.lamar.edu/Problems/CalcI/SubstitutionRuleDefinite.aspx", minutes: 20 },
  ],
  implement: {
    spec: "Trapezoid integrator from scratch (plain loop, then vectorized). Verify against exact ∫₀¹ 3x² dx = 1. Then integrate the standard Gaussian pdf numerically on [−1,1] and discover ≈0.683 — your first contact with '±1σ contains 68%', one node before l2-random-variables needs it. Check your loop against numpy.trapezoid once it works.",
    checks: [
      "∫₀¹ 3x² dx = 1 to 4+ decimals at a modest step count",
      "Standard normal on [−1,1] ≈ 0.683 — and you can say what that number will mean",
      "Your version matches numpy.trapezoid on the same grid",
    ],
    minutes: 45,
  },
  stuck: {
    alternate: {
      title: "What does area have to do with slope? — Essence of Calculus Ch. 9",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr",
      minutes: 10,
      whySelected: "The average-of-a-function view — the exact mental model of expectations. Find Ch. 9 in the series playlist.",
      unverified: true,
    },
    alternateRead: {
      title: "Khan Academy — Integral Calculus units",
      resourceId: "khan-math",
      sections: "adaptive remediation only — videos on failure",
      minutes: 30,
    },
    note: "If the FTC feels like magic, watch Ch. 9 before re-reading anything; use Khan only if u-substitution keeps collapsing.",
  },
  deepen: [
    { title: "MIT 18.01SC Single Variable Calculus — Unit 3", sections: "only if the FTC still feels like magic after the packet; selective use (repo-designated backup) — do NOT run the course linearly", minutes: 120 },
  ],
  prove: {
    task: "Closed book: (1) evaluate ∫x e^{x²}dx by substitution; (2) write a short paragraph explaining why 𝔼[X] = ∫x p(x)dx is 'weighted average, continuum edition' — connect the sum-of-slices picture to the discrete Σx·p(x).",
    criteria: [
      "u = x² spotted from the inner-function/derivative pair; the ½ constant handled; +C present",
      "The explanation names what p(x)dx is (probability mass of a slice) and why the x-weighted sum becomes an integral",
      "Nothing outside the node's scope needed — if you reached for a Calc II technique, you drifted",
    ],
    minutes: 20,
  },
  transfer: {
    task: "Odometry: a wheeled robot drives with v(t) = sin t over [0, π]. Get the position change by exact integral and by your trapezoid code. Halve the step size and watch the error quarter — name why.",
    criteria: ["Exact answer 2 recovered analytically", "Trapezoid error drops ≈4× when h halves, and you attribute it to second-order accuracy (error ~ O(h²))"],
    minutes: 25,
  },
  retention: "Day+10: one cold u-substitution, state both parts of the FTC from memory, and answer: why does the trapezoid error drop 4× when h halves?",
  researchRecord: "docs/curation/l2-integrals.md",
  minutes: 224,
};
