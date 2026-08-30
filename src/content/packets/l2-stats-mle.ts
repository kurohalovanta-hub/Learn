import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-stats-mle.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-stats-mle",
  whyNow:
    "'Training a model' really means maximum likelihood. Cross-entropy is negative log-likelihood; least squares is MLE with Gaussian noise. Derive that once from a blank page and loss functions stop feeling arbitrary. This node sticks to the two tools you will use later: MLE and Bayesian updating.",
  diagnostic: {
    prompt:
      "Cold: (a) why maximize LOG likelihood; give two real reasons; (b) derive the MLE of λ for n exponential samples; (c) is the likelihood a probability distribution over θ? Clean on all three, and skip straight to Pset 6.",
    minutes: 10,
  },
  orient: {
    title: "Maximum Likelihood, clearly explained!!!",
    creator: "StatQuest (Josh Starmer)",
    url: "https://www.youtube.com/watch?v=XepXtl9YKwc",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=XepXtl9YKwc"),
    minutes: 6,
    unverified: true,
    whySelected:
      "A gentle start: slide a Gaussian over the data and watch the likelihood change. It skips the derivation on purpose; that part is your job in a few minutes.",
    leaveWith: ["likelihood as a slidable, comparable quantity", "the best parameters make the observed data most probable"],
  },
  coreWatch: [
    {
      title: "Probability is not Likelihood. Find out why!!!",
      creator: "StatQuest (Josh Starmer)",
      url: "https://statquest.org/video_index.html",
      minutes: 5,
      unverified: true,
      whySelected:
        "Find it by title in the linked video index (no direct URL this session). Watch it with the orient video. It heads off the classic mix-up (likelihood is not a pdf over θ) before the notation can lock it in.",
      leaveWith: ["probability: fix θ, vary data · likelihood: fix the observed data, vary θ", "L(θ) need not integrate to 1"],
    },
  ],
  recall: [
    {
      q: "Likelihood vs probability, same formula, so what changes?",
      a: "Which slot varies. Probability fixes θ and varies the data; likelihood fixes the observed data and varies θ. L(θ) is not a pdf over θ and need not integrate to 1.",
    },
    {
      q: "The real reasons to maximize LOG likelihood?",
      a: "log is monotone (same argmax); it turns products into sums you can differentiate term-by-term; and it prevents numerical underflow of 10⁻³⁰⁰-scale products.",
    },
    {
      q: "The MLE recipe in four verbs?",
      a: "Write the likelihood, take the log, differentiate, set to zero, then check you found a maximum.",
    },
    {
      q: "MLE of σ² divides by n, not n−1, bug?",
      a: "No: the MLE of variance is biased, and that's fine here. The n−1 'sample variance' is a different estimator; conflating them is everyone's first-pass confusion.",
    },
    {
      q: "'The MLE is the most probable θ', right?",
      a: "No, that's MAP language. The MLE is the θ that makes the observed DATA most probable.",
    },
    {
      q: "In a discrete Bayesian update table, the columns are…?",
      a: "Hypotheses, prior, likelihood of the data under each hypothesis, unnormalized posterior = prior × likelihood, then normalize by the column total.",
    },
  ],
  interactiveIds: ["gaussian-explorer"],
  coreRead: [
    {
      title: "18.05 Reading 10a, Introduction to Statistics",
      url: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class10-prep-a_pdf/",
      resourceId: "mit-1805",
      sections: "skim, statistic vs parameter, point estimates; framing only",
      minutes: 10,
    },
    {
      title: "18.05 Reading 10b, Maximum Likelihood Estimates",
      url: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class10-prep-b.pdf",
      resourceId: "mit-1805",
      sections: "in full, with pencil: log-likelihood, worked discrete AND continuous MLEs",
      minutes: 40,
      whySelected: "The core read. About 10 pages at engineer depth; no other free source builds 'loss functions are MLE in disguise' this directly.",
    },
    {
      title: "18.05 Reading 11, Bayesian Updating with Discrete Priors",
      url: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class11-prep.pdf",
      resourceId: "mit-1805",
      sections: "read AFTER the MLE work is done: the update-table method, the literal ancestor of the Bayes/Kalman filters on this path",
      minutes: 30,
    },
  ],
  practice: [
    {
      prompt:
        "In gaussian-explorer: generate 20 noisy points, fit μ and σ by EYE with the sliders, and write your guesses down. Then compute μ̂ and σ̂ by MLE and compare. Your eye is good at μ and consistently off on σ; watch the likelihood beat your guess.",
      minutes: 15,
    },
    {
      prompt: "Class 10 in-class problems as warm-up, checked against the posted solutions.",
      source: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class10_pset_sol.pdf",
      minutes: 25,
    },
    {
      prompt:
        "Pset 6, Problems 1–2: the continuous (gamma-form) likelihood, and 'use MLE to develop Gauss' method of least squares'. This is the main event. Give it full effort before you peek at solutions.",
      source: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_pset06.pdf",
      minutes: 45,
    },
    {
      prompt: "Plot the likelihood surface for 10 coin flips, then 1000. Watch it sharpen, and connect its width to standard error.",
      minutes: 20,
    },
    {
      prompt: "Exam 2 practice questions on MLE for volume, with posted solutions.",
      source: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_prac_exam02a.pdf",
      minutes: 30,
    },
  ],
  derive: {
    spec: "On paper, from the log-likelihood, no template open: derive p̂ = k/n for n Bernoulli flips, then μ̂ and σ̂² for n Gaussian samples. Write every differentiation step, and give an argument (second derivative or shape) that you found a maximum.",
    checks: [
      "The log is taken BEFORE differentiating, and you can give two reasons why",
      "σ̂² comes out dividing by n, and you can say why that's a biased estimator and why that's fine here",
      "The Bernoulli result is sanity-checked at the edges k=0 and k=n",
    ],
    minutes: 40,
  },
  implement: {
    spec: "mle_check.py: (1) numerically maximize the same two log-likelihoods on simulated data (grid search, or the gradient ascent from l2-optimization if you built it) and confirm they match your closed forms; (2) one Bayesian update table in Reading 11 style for a coin with prior {fair: 0.4, biased: 0.6}, updated over a short flip sequence.",
    checks: [
      "Numerical argmax matches p̂, μ̂, σ̂² to 3 decimals",
      "Every posterior column sums to 1, and each update uses the previous posterior as its prior",
      "Doubling the simulated data visibly narrows the numerical likelihood surface",
    ],
    minutes: 50,
  },
  stuck: {
    alternate: {
      title: "Maximum Likelihood for the Binomial Distribution, Clearly Explained!!!",
      creator: "StatQuest (Josh Starmer)",
      url: "https://www.youtube.com/watch?v=4KKV9yZCoM4",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=4KKV9yZCoM4"),
      minutes: 10,
      unverified: true,
      whySelected: "The p̂ = k/n derivation you are attempting, narrated stroke by stroke. Watch it, close it, then redo yours from a blank page.",
    },
    note: "Stuck on the exponential-λ diagnostic instead? The matching walkthrough is 'Maximum Likelihood for the Exponential Distribution, Clearly Explained! V2.0' at https://www.youtube.com/watch?v=p3T-_LMrvBc (duration unverified). These are here to un-stick you, not to replace your own derivation.",
  },
  deepen: [
    {
      title: "18.05 Reading 12b, Bayesian Updating: Odds",
      url: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class12-prep-b.pdf",
      resourceId: "mit-1805",
      sections: "the odds / Bayes-factor form of updating, the shape used inside real filters",
      minutes: 30,
    },
    {
      title: "Wikipedia, Maximum likelihood estimation",
      url: "https://en.wikipedia.org/wiki/Maximum_likelihood_estimation",
      sections: "properties: consistency, invariance, reference material, not a first read",
      minutes: 20,
    },
    {
      title: "Stat 110 (Blitzstein & Hwang)",
      url: "https://stat110.hsites.harvard.edu/",
      resourceId: "stat110",
      sections: "probability underpinnings, only if the Level-3 loss-function lessons feel unmoored, note it is probability-first and thin on MLE mechanics specifically",
      minutes: 60,
    },
  ],
  prove: {
    task: "The node's mastery gate, closed book, from a blank page: (1) assume yᵢ = a·xᵢ + b + εᵢ with ε ~ N(0, σ²); show that maximizing the likelihood is the same as minimizing Σ(yᵢ − a·xᵢ − b)², and only then check yourself against the posted Pset 6 solution; (2) show that for binary labels under a Bernoulli model, negative log-likelihood is exactly cross-entropy. You will reuse both arguments in ML work for years.",
    criteria: [
      "The Gaussian pdf is written into the likelihood and the log taken before any calculus",
      "The σ and constant terms are clearly marked as argmax-irrelevant; that step IS the theorem",
      "Cross-entropy falls out of the log of p^y · (1−p)^(1−y), not quoted from memory",
      "The Pset 6 solution is consulted only after the attempt, and any disagreement is chased to its root",
    ],
    minutes: 40,
  },
  transfer: {
    task: "A depth sensor has occasional dropouts; model the inter-dropout times as exponential. Given 12 observed gaps, estimate λ by MLE, give a standard-error-flavored statement of your uncertainty, and explain what doubling the data does to the likelihood surface's width.",
    criteria: [
      "λ̂ = 1/(mean gap) derived from the exponential log-likelihood, not recalled",
      "The uncertainty statement scales like λ̂/√n, more data, narrower estimate",
      "Doubling n narrows the surface by about √2, connected back to the 10-vs-1000-flips plot from practice",
    ],
    minutes: 20,
  },
  retention:
    "+7 days: write from memory the chain 'cross-entropy = −Σ log p = NLL; minimizing it = MLE', and state the Gaussian-noise ⇒ least-squares correspondence in one sentence. +30 days, right before the Level-3 losses lesson: re-derive σ̂² and say why it divides by n.",
  researchRecord: "docs/curation/l2-stats-mle.md",
  minutes: 386,
};
