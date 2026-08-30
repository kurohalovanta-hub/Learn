import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l2-functions-graphs.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-functions-graphs",
  whyNow:
    "Machine learning is mostly fitting functions, and a neuron σ(Wx+b) is a plain function with its input scaled and shifted. Learn to read shift, scale, and reflect at a glance now, and activations, loss curves, and normalization will make sense later. Like the algebra repair, the diagnostic is the path: pass it clean and you go straight to proving mastery; miss parts and you fix only those.",
  diagnostic: {
    prompt:
      "Cold, about 30 min, three parts. (1) On paper, sketch y = 2e^(−(x−1)) + 3 without plotting, then state the domain and range of ln(x−2). (2) Khan Algebra 2 'Transformations of functions' Unit Test, cold: https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:log-graphs/test/x2ec2f6f830c9fb89:transformations-unit-test . (3) Precalc composite-functions exercise, cold: https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:composite/x9e81a4f98389efdf:composing/e/compose-functions . If you are unsure, skip it; never guess. Score 90% or better on both Khan tests, with clean sketches facing the right way, and you go straight to PROVE IT.",
    minutes: 30,
    repair: true,
  },
  orient: {
    title: "Shifting functions introduction",
    creator: "Khan Academy (Sal)",
    url: "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:shift/v/shifting-functions-intro",
    minutes: 5,
    whySelected:
      "A five-minute fix for the most common mistake: f(x+2) shifts LEFT, not right. Watch it only if your diagnostic sketch went the wrong way; otherwise skip.",
    unverified: true,
  },
  coreRead: [
    {
      title: "Transformations of functions: FAQ",
      url: "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:log-graphs/a/transformations-of-functions-faq",
      resourceId: "khan-math",
      sections: "The whole unit's shift/scale/reflect rules in one compact written pass",
      minutes: 10,
      whySelected: "The shortest complete written summary of the unit. Read it once before you patch, so every exercise you miss points back to a rule you can name.",
    },
  ],
  recall: [
    {
      q: "f(x+2) shifts the graph which way, and why?",
      a: "Left. The input is pre-processed: at position x the function now sees x+2, so the feature that lived at 0 appears at x = −2. Graphs move opposite the sign inside.",
    },
    {
      q: "Before reading a·f(bx−c)+d off a graph, what must you do?",
      a: "Factor the input: a·f(b(x − c/b)) + d. The horizontal shift is c/b, not c, scale and shift do not commute.",
    },
    {
      q: "Is f⁻¹(x) the same as 1/f(x)?",
      a: "No. f⁻¹ un-does f (f⁻¹(f(x)) = x); 1/f is the reciprocal of the output. And only injective functions invert, which is why x² needs a domain cut and σ⁻¹ exists.",
    },
    {
      q: "What is the domain of f∘g?",
      a: "The inputs in g's domain whose outputs land inside f's domain, range of the inner function must fit the domain of the outer. The same reasoning you will reuse for layer shapes and ln-of-negative bugs.",
    },
  ],
  practice: [
    {
      prompt:
        "Only the skills you missed. Drill 'Identify function transformations', then Transformations Quiz 1 (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:symmetry/quiz/x2ec2f6f830c9fb89:transformations-quiz-1) and Quiz 2 (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:trans-all-together/quiz/x2ec2f6f830c9fb89:transformations-quiz-2), then re-take the Unit Test until you hit 90% or better.",
      source:
        "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:transformations/x2ec2f6f830c9fb89:trans-all-together/e/shifting_and_reflecting_functions",
      minutes: 50,
    },
    {
      prompt:
        "Get fluent with composition. Do 'Compose functions', then the sibling 'Evaluate composite functions' exercises in the same Precalc lesson, both from formulas and from graphs & tables. The graphs-and-tables set matters most; it trains you to see a function as a mapping (any input→output pairing counts), not just symbols to push around.",
      source: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:composite/x9e81a4f98389efdf:composing/e/compose-functions",
      minutes: 40,
    },
    {
      prompt:
        "Node exercise, on paper. Sketch e^x, ln x, x², 1/x, and σ(x), plus one shifted or scaled version of each, so 10 sketches in all, and check every one in Desmos (or matplotlib once you have Python). Then do 10 reps the other way: given the graph of a transformed primitive, work back to its formula.",
      minutes: 50,
    },
  ],
  implement: {
    spec: "Transformation grid, about 60 min. Write a matplotlib script that, for each primitive f ∈ {exp, ln, x², 1/x, σ}, plots f(x), f(x−h)+k, and a·f(bx) for 2–3 parameter values in a labeled grid. Then check with numbers, not your eyes, that exp and ln undo each other (f⁻¹(f(x)) = x to machine precision on the shared domain) and that σ(x) + σ(−x) = 1. No Python yet? Do the same grid by hand on graph paper and check every panel in Desmos.",
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
      whySelected: "Paired one-to-one with the practice set above. As a rule, each Khan exercise you miss links its own 5-minute video; open that one, not a full lecture.",
      unverified: true,
    },
    alternateRead: {
      title: "Paul's Online Math Notes, Algebra",
      url: "https://tutorial.math.lamar.edu/classes/alg/alg.aspx",
      resourceId: "pauls-notes",
      sections: "Graphing and Functions + Common Graphs chapters, matching section only",
      minutes: 30,
      whySelected: "A plain, grown-up text path for anything that trips you up twice. Solved problems, no classroom pacing.",
    },
    note: "Fix one missed skill at a time, then go back to the exercises. Do not restart the whole unit from the top.",
  },
  deepen: [
    {
      title: "Get ready for Algebra 2, transformations & modeling",
      url: "https://www.khanacademy.org/math/get-ready-for-algebra-ii/x6e4201668896ef07:get-ready-for-transformations-of-functions-and-modeling-with-functions",
      resourceId: "khan-math",
      sections: "One level down, only if composition/domain reasoning stays shaky after the patch loop",
      minutes: 60,
    },
    {
      title: "College Algebra, Transformations of functions",
      url: "https://www.khanacademy.org/math/college-algebra/xa5dd2923c88e7aa8:transformations-of-functions",
      resourceId: "khan-math",
      sections: "Same skills in a different course shell, a second question bank when you want more reps, not extra theory",
      minutes: 45,
    },
  ],
  prove: {
    task: "Cold, about 30 min. Read a neuron: break σ(Wx+b) into primitive transformations of σ. Then sketch, without plotting, how the graph changes for W ∈ {½, 1, 4, −2} and b ∈ {−2, 0, 3}. Finish with one paragraph on why W controls steepness (it scales the input) and b controls position (it shifts the input).",
    criteria: [
      "σ(Wx+b) rewritten as σ(W(x + b/W)) before any sketch, with the scale factored out first and the center found at x = −b/W",
      "All W and b cases sketched correctly at sight, including the reflection at W = −2",
      "The paragraph is causal (input scaling steepens, input shift relocates), not a memorized slogan",
      "Un-gameable by Khan pattern-matching: the decomposition is produced, not recognized from choices",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Three transfers, about 25 min. (1) z-scoring x ↦ (x−μ)/σ is which transformations, in which order, and what does it do to the graph of any density? (2) Given a plotted tanh(2x−1)+0.5, work back to the formula. (3) State the domain condition that makes ln(σ(x)) safe, and why log-of-sigmoid turns up inside cross-entropy.",
    criteria: [
      "z-scoring named as shift by μ then scale by 1/σ, with the graph effect (recenter to 0, rescale spread to 1) stated",
      "tanh formula recovered by factoring the phase, not guessed",
      "σ(x) ∈ (0,1) ⇒ ln(σ(x)) always defined and negative, and identified as the log-likelihood term of cross-entropy",
    ],
    minutes: 25,
  },
  retention: "Day +7: five unseen transformed-primitive graphs → recover the formulas, ≤15 min, ≥4/5. Plus one cold σ(Wx+b) decomposition with fresh W, b.",
  researchRecord: "docs/curation/l2-functions-graphs.md",
  minutes: 300,
};
