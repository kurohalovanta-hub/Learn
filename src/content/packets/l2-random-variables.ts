import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-random-variables.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-random-variables",
  whyNow:
    "Losses are expectations, policies are distributions, and sensor noise is Gaussian. This is the language every ML and robotics paper speaks. After this node, 'my success rate moved 8 points between evals' turns into a computation (σ/√n) instead of a hunch.",
  diagnostic: {
    prompt:
      "Cold, no notes: (a) Var(3X−2) in terms of Var(X); (b) E[X+Y] for DEPENDENT X, Y, legal or not?; (c) sketch N(2, 0.25) and mark the ±1σ mass; (d) the pdf of X at 0.3 is 2.4, is that a probability? All four clean, jump straight to the PRACTICE psets.",
    minutes: 10,
  },
  orient: {
    title: "Binomial distributions | Probabilities of probabilities, part 1",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=8idr1WZ1A7Q",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=8idr1WZ1A7Q"),
    minutes: 12,
    unverified: true,
    whySelected:
      "Builds the PMF habit on a distribution you can count, and it pre-loads the likelihood curves that l2-stats-mle will turn into MLE.",
    leaveWith: ["a PMF assigns mass to outcomes; parameters shape it", "binomial = n independent Bernoullis, counted"],
  },
  coreWatch: [
    {
      title: "But what is the Central Limit Theorem?",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=zeJD6dqJ5lo",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=zeJD6dqJ5lo"),
      minutes: 31,
      whySelected:
        "The heart of this node. Watch AFTER Readings 4a–5c and BEFORE Reading 6b. The video gives you the picture (Galton-board convolutions up to the σ/√n scaling), and 6b then reads as confirmation. It runs long, but this is the exact idea the mastery test hinges on.",
      leaveWith: [
        "sums of independent RVs blur toward a Gaussian",
        "the sample mean's spread shrinks as σ/√n",
        "why 50-rollout evals wobble run to run",
      ],
    },
  ],
  recall: [
    {
      q: "The pdf of X at 0.3 is 2.4, is that a probability?",
      a: "No. Densities can exceed 1 and P(X=0.3)=0 for continuous X; only integrals of the pdf over intervals are probabilities.",
    },
    {
      q: "E[X+Y] when X and Y are dependent?",
      a: "Still E[X]+E[Y], linearity of expectation needs no independence. It's Var(X+Y) that picks up the 2Cov(X,Y) term.",
    },
    {
      q: "Var(aX+b)?",
      a: "a²Var(X): shifting doesn't spread a distribution, and scaling spreads it quadratically in the variance.",
    },
    {
      q: "What exactly does the CLT say becomes Gaussian?",
      a: "Sums (or means) of many independent draws, suitably normalized, NOT the data distribution itself. The sample mean of n draws has standard deviation σ/√n.",
    },
    {
      q: "In N(μ, σ²), the second parameter is…?",
      a: "The variance σ², not the standard deviation, sources differ, so read the notation before you plug in numbers.",
    },
  ],
  interactiveIds: ["gaussian-explorer"],
  coreRead: [
    {
      title: "Seeing Theory, probability distributions",
      url: "https://seeing-theory.brown.edu/",
      resourceId: "seeing-theory",
      sections: "10 minutes of distribution play before the readings, drag parameters, watch pdf/CDF shapes respond; play, not practice",
      minutes: 10,
    },
    {
      title: "MIT 18.05 S22, Readings 4a–5c",
      url: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/readings/",
      resourceId: "mit-1805",
      sections:
        "In full: 4a (discrete RVs), 4b (expected value), 5a (variance), 5b (continuous RVs). Targeted: 5c, uniform, exponential and normal entries only. Do the embedded reading questions as you go.",
      minutes: 70,
      whySelected:
        "The core readings. Each one maps to a single objective (4a→PMF, 4b/5a→E/Var, 5b/5c→pdf + zoo), with self-checks built into each.",
    },
    {
      title: "MIT 18.05 S22, Readings 6a–7b (after the CLT video)",
      url: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/readings/",
      resourceId: "mit-1805",
      sections:
        "6a: definitions plus the E/Var table only. 6b (LLN + CLT): in full, video first, so this is confirmation. 7a: skim for joint-PMF mechanics only. 7b (covariance and correlation): in full.",
      minutes: 50,
    },
  ],
  practice: [
    {
      prompt:
        "In the gaussian-explorer instrument, drag μ and σ and watch the pdf/CDF respond. Verify the ±1σ ≈ 68% mass claim your l2-integrals node found numerically. Then simulate your own sensor noise in NumPy and match the widget's Gaussian to its histogram.",
      minutes: 15,
    },
    {
      prompt: "18.05 Pset 2 in full: variance of discrete RVs and continuous RVs. On paper before you check anything.",
      source: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/pages/problem-sets",
      minutes: 60,
    },
    {
      prompt: "Pset 4: the CLT-estimate and transformation problems, graded against the posted solutions.",
      source: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_pset04_sol.pdf",
      minutes: 45,
    },
    {
      prompt:
        "Pset 5: the covariance/correlation problems plus ONE worked joint-CDF problem. Skip the rest of the joint-CDF technicalities; the robotics path needs covariance fluency, not joint-CDF manipulation.",
      source: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_pset05_sol.pdf",
      minutes: 45,
    },
    {
      prompt: "OLL 18.05r auto-graded checkers for the RV/expectation/CLT units. Instant feedback on anything still shaky.",
      source: "https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.05r_10+2022_Summer/about",
      minutes: 30,
    },
  ],
  implement: {
    spec: "Three NumPy experiments, exactly as the node prescribes: (1) check linearity of expectation on DEPENDENT variables (X and X² on the same draws); (2) sum n uniforms for n = 1, 2, 5, 30, histogram each, and overlay the matching Gaussian using YOUR μ and σ formulas (nμ, nσ², predicted, not fitted); (3) fit a Gaussian to noisy sensor data by computing μ̂ and σ̂, then overlay it on the histogram.",
    checks: [
      "mean(X + X²) ≈ mean(X) + mean(X²) on the same draws, linearity survives maximal dependence, and you can say why Var would not",
      "The n=30 histogram hugs the predicted (not fitted) Gaussian overlay",
      "The fitted sensor-noise curve tracks its histogram, with a σ̂ formula you can defend",
    ],
    minutes: 90,
  },
  stuck: {
    alternate: {
      title: "Why 'probability of 0' does not mean 'impossible'",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=ZA4JkHKZM50",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=ZA4JkHKZM50"),
      minutes: 12,
      unverified: true,
      whySelected: "Exactly the pdf-vs-probability block, with densities introduced honestly. Reach for it when continuous RVs are where you stalled.",
    },
    alternateRead: {
      title: "Introduction to Probability 2e (Blitzstein & Hwang, Stat 110)",
      url: "https://stat110.hsites.harvard.edu/",
      resourceId: "stat110",
      sections: "ch 4, the expectation story-proofs, the best in print",
      minutes: 40,
    },
    note: "For a slower second voice on the normal distribution, StatQuest's fundamentals videos via https://statquest.org/video_index.html.",
  },
  deepen: [
    {
      title: "18.05 Reading 7a, Joint Distributions, Independence (in full)",
      url: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/readings/",
      resourceId: "mit-1805",
      sections: "the full joint-density treatment beyond the skimmed joint-PMF mechanics",
      minutes: 40,
    },
    {
      title: "Stat 110 (Blitzstein & Hwang)",
      url: "https://stat110.hsites.harvard.edu/",
      resourceId: "stat110",
      sections: "ch 5 + 7, universality of the uniform; multivariate-normal preview. Only if the Kalman/GP road ahead starts to strain.",
      minutes: 90,
    },
  ],
  prove: {
    task: "Unassisted, closed book: (1) derive E and Var of a Bernoulli(p) and a Uniform(a,b) from the definitions, with the sum and integral written out; (2) simulate a 50-rollout policy evaluation twice with true success p=0.7, report the two differing success rates, and explain the gap with the CLT (σ/√n with actual numbers), stating how many rollouts it takes to halve the error bar. This is the eval-statistics point the whole field just relearned.",
    criteria: [
      "Derivations proceed from E[X] = Σ x·p(x) / ∫ x·p(x)dx and Var(X) = E[X²] − E[X]², not quoted results",
      "The eval explanation produces the number: sd of a 50-rollout success rate ≈ √(0.7·0.3/50) ≈ 0.065",
      "Halving the error bar = 4× the rollouts (200), stated and justified from the √n law",
    ],
    minutes: 40,
  },
  transfer: {
    task: "An IMU reads z = true + ε with ε ~ N(0, σ²). (1) What is the distribution of the mean of k readings, and how many readings do you need for a 95% interval of ±0.1σ? (2) The flip side: your robot's grasp success differs by 8 points between two 20-trial evals, signal or noise? Decide with a computed standard error, not a feeling.",
    criteria: [
      "Mean of k readings stated as N(true, σ²/k), averaging shrinks variance, not bias",
      "k derived from 1.96·σ/√k ≤ 0.1σ (k ≈ 385), not guessed",
      "The grasp verdict cites the ≈14–16 point sd of a difference between two 20-trial success rates and concludes: noise",
    ],
    minutes: 25,
  },
  retention:
    "+7 days: from memory, write the Gaussian pdf, state Var(aX+b), and answer 'why do means of many rollouts stabilize?' in two sentences, with LLN and CLT correctly attributed.",
  researchRecord: "docs/curation/l2-random-variables.md",
  minutes: 533,
};
