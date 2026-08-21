import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l2-functions-graphs.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-functions-graphs",
  whyNow:
    "ML is function fitting, and a neuron σ(Wx+b) is literally 'primitive function + input scale + input shift'. This node trains the exact eye you will use on activations, loss curves and normalization for the rest of the program: read shift/scale/reflect at sight, own composition and inverses. Same test-out deal as algebra repair: the diagnostic is the path — pass it clean and you jump straight to proving mastery; fail parts and you patch only those.",
  diagnostic: {
    prompt:
      "Cold, ~30 min, three parts. (1) On paper: sketch y = 2e^(−(x−1)) + 3 without plotting; state the domain and range of ln(x−2). (2) Khan Algebra 2 'Transformations of functions' Unit Test, cold: https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:log-graphs/test/x2ec2f6f830c9fb89:transformations-unit-test . (3) Precalc composite-functions exercise, cold: https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:composite/x9e81a4f98389efdf:composing/e/compose-functions . Skip, never guess. ≥90% on both Khan instruments plus clean, correctly-oriented sketches ⇒ jump straight to PROVE IT.",
    minutes: 30,
    repair: true,
  },
  orient: {
    title: "Shifting functions introduction",
    creator: "Khan Academy (Sal)",
    url: "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:shift/v/shifting-functions-intro",
    minutes: 5,
    whySelected:
      "The canonical five-minute fix for the single most common error: f(x+2) shifts LEFT. Watch only if your diagnostic sketch had a direction error; otherwise skip.",
    unverified: true,
  },
  coreRead: [
    {
      title: "Transformations of functions: FAQ",
      url: "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:log-graphs/a/transformations-of-functions-faq",
      resourceId: "khan-math",
      sections: "The whole unit's shift/scale/reflect rules in one compact written pass",
      minutes: 10,
      whySelected: "The shortest complete written summary of the unit — read once before patching so every exercise failure lands on a named rule.",
    },
  ],
  recall: [
    {
      q: "f(x+2) shifts the graph which way, and why?",
      a: "Left. The input is pre-processed: at position x the function now sees x+2, so the feature that lived at 0 appears at x = −2. Graphs move opposite the sign inside.",
    },
    {
      q: "Before reading a·f(bx−c)+d off a graph, what must you do?",
      a: "Factor the input: a·f(b(x − c/b)) + d. The horizontal shift is c/b, not c — scale and shift do not commute.",
    },
    {
      q: "Is f⁻¹(x) the same as 1/f(x)?",
      a: "No. f⁻¹ un-does f (f⁻¹(f(x)) = x); 1/f is the reciprocal of the output. And only injective functions invert — which is why x² needs a domain cut and σ⁻¹ exists.",
    },
    {
      q: "What is the domain of f∘g?",
      a: "The inputs in g's domain whose outputs land inside f's domain — range of the inner function must fit the domain of the outer. The same reasoning you will reuse for layer shapes and ln-of-negative bugs.",
    },
  ],
  practice: [
    {
      prompt:
        "Only failed skills: drill 'Identify function transformations', then Transformations Quiz 1 (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:symmetry/quiz/x2ec2f6f830c9fb89:transformations-quiz-1) and Quiz 2 (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:trans-all-together/quiz/x2ec2f6f830c9fb89:transformations-quiz-2), then re-take the Unit Test to ≥90%.",
      source:
        "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:trans-all-together/e/shifting_and_reflecting_functions",
      minutes: 50,
    },
    {
      prompt:
        "Composition to fluency: 'Compose functions', then the sibling 'Evaluate composite functions' exercises in the same Precalc lesson — from formulas, and from graphs & tables. The graphs-and-tables set is the important one: it trains the mapping view (any input→output pairing is a function), not symbol-pushing.",
      source: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:composite/x9e81a4f98389efdf:composing/e/compose-functions",
      minutes: 40,
    },
    {
      prompt:
        "Node exercise, on paper: sketch e^x, ln x, x², 1/x, σ(x), plus one shifted/scaled variant of each — 10 sketches — and verify every one in Desmos (or matplotlib once you have Python). Then 10 reps of the inverse direction: given a transformed-primitive graph, recover the formula.",
      minutes: 50,
    },
  ],
  implement: {
    spec: "Transformation grid, ~60 min: a matplotlib script that, for each primitive f ∈ {exp, ln, x², 1/x, σ}, plots f(x), f(x−h)+k, and a·f(bx) for 2–3 parameter values in a labeled grid. Verify numerically that exp and ln undo each other (f⁻¹(f(x)) = x to machine precision on the shared domain) and that σ(x) + σ(−x) = 1. Pre-Python variant: the same grid by hand on graph paper, every panel checked in Desmos.",
    checks: [
      "All five families × three variants render and are labeled with their formulas",
      "np.allclose(np.log(np.exp(x)), x) and σ(x)+σ(−x)=1 both verified, not eyeballed",
      "You can point at any panel and read off a, b, h, k in the a·f(b(x−h))+k form without hesitation",
    ],
    minutes: 60,
  },
  stuck: {
    alternate: {
      title: "Identifying function transformations",
      creator: "Khan Academy",
      url: "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:trans-all-together/v/shifting-and-reflecting-functions",
      minutes: 7,
      whySelected: "Paired 1:1 with the practice set above. In general: each failed Khan exercise links its own 5-minute video — open that one, not a lecture.",
      unverified: true,
    },
    alternateRead: {
      title: "Paul's Online Math Notes — Algebra",
      url: "https://tutorial.math.lamar.edu/classes/alg/alg.aspx",
      resourceId: "pauls-notes",
      sections: "Graphing and Functions + Common Graphs chapters, matching section only",
      minutes: 30,
      whySelected: "Adult-toned text path for anything that fails twice — solved problems, no classroom pacing.",
    },
    note: "Patch per failed skill, then return to exercises. Do not restart the unit from the top.",
  },
  deepen: [
    {
      title: "Get ready for Algebra 2 — transformations & modeling",
      url: "https://www.khanacademy.org/math/get-ready-for-algebra-ii/x6e4201668896ef07:get-ready-for-transformations-of-functions-and-modeling-with-functions",
      resourceId: "khan-math",
      sections: "One level down — only if composition/domain reasoning stays shaky after the patch loop",
      minutes: 60,
    },
    {
      title: "College Algebra — Transformations of functions",
      url: "https://www.khanacademy.org/math/college-algebra/xa5dd2923c88e7aa8:transformations-of-functions",
      resourceId: "khan-math",
      sections: "Same skills in a different course shell — a second question bank when you want more reps, not extra theory",
      minutes: 45,
    },
  ],
  prove: {
    task: "Cold, ~30 min — reading a neuron: decompose σ(Wx+b) into primitive transformations of σ. Then sketch, without plotting, how the graph changes for W ∈ {½, 1, 4, −2} and b ∈ {−2, 0, 3}. Close with one paragraph on why W controls steepness (input scaling) and b controls position (input shift).",
    criteria: [
      "σ(Wx+b) rewritten as σ(W(x + b/W)) before any sketch — scale factored out first, center identified at x = −b/W",
      "All W and b cases sketched correctly at sight, including the reflection at W = −2",
      "The paragraph is causal (input scaling steepens, input shift relocates), not a memorized slogan",
      "Un-gameable by Khan pattern-matching: the decomposition is produced, not recognized from choices",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Three transfers, ~25 min: (1) z-scoring x ↦ (x−μ)/σ is which transformations in which order, and what does it do to the graph of any density? (2) Given a plotted tanh(2x−1)+0.5, recover the formula. (3) State the domain constraint that makes ln(σ(x)) safe, and why log-of-sigmoid shows up inside cross-entropy.",
    criteria: [
      "z-scoring named as shift by μ then scale by 1/σ, with the graph effect (recenter to 0, rescale spread to 1) stated",
      "tanh formula recovered by factoring the phase, not guessed",
      "σ(x) ∈ (0,1) ⇒ ln(σ(x)) always defined and negative — and identified as the log-likelihood term of cross-entropy",
    ],
    minutes: 25,
  },
  retention: "Day +7: five unseen transformed-primitive graphs → recover the formulas, ≤15 min, ≥4/5. Plus one cold σ(Wx+b) decomposition with fresh W, b.",
  researchRecord: "docs/curation/l2-functions-graphs.md",
  minutes: 300,
};
