import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-probability.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-probability",
  whyNow:
    "Sensors lie and actions slip, so robotics runs on probability. Bayes' rule sits inside the Kalman filter and every localization method you will meet later. Here you build the habit that makes Bayes usable: count a representative population instead of hunting for a formula. You also stop confusing P(A|B) with P(B|A), a mistake that trips up a lot of smart people.",
  diagnostic: {
    prompt:
      "No notes, from memory. (a) A test is 99% accurate and the disease hits 1/1000; guess P(sick|positive) first, then work it out. (b) Two dice sum to 7. What is the probability the first die shows 3? (c) Can two events with positive probability be both independent and mutually exclusive? Get all three right with sound reasoning and you can skip ORIENT and CORE WATCH and go straight to PRACTICE.",
    minutes: 10,
  },
  orient: {
    title: "Seeing Theory, Basic & Compound Probability",
    creator: "Daniel Kunin et al. (Brown)",
    url: "https://seeing-theory.brown.edu/",
    minutes: 20,
    whySelected:
      "Chapters 1 and 2 are a visual warm-up. Spend 15 to 20 minutes playing with sample spaces, conditioning, and expectation before any formulas show up. Treat it as play, not practice.",
    leaveWith: ["conditioning means shrinking the sample space, and you watch it happen live", "a feel for events, unions, and intersections as regions on the page"],
  },
  coreWatch: [
    {
      title: "Bayes theorem, the geometry of changing beliefs",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=HZGCoVF3YvM",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=HZGCoVF3YvM"),
      minutes: 15,
      unverified: true,
      whySelected:
        "The Bayes explanation most people say finally made it click. No calculus, just areas and counts. Watch it before the reading. It builds the 1000-person-table habit, so the reading becomes confirmation instead of symbol-pushing.",
      leaveWith: [
        "draw the representative population instead of reaching for the formula",
        "P(A|B) and P(B|A) answer different questions",
        "evidence moves your belief; it doesn't set it from scratch",
      ],
    },
  ],
  recall: [
    {
      q: "In the 1000-person-table method, what do you compute instead of plugging into the Bayes formula?",
      a: "Count a representative population: how many have the hypothesis, how many in each group show the evidence, then posterior = true positives / all positives.",
    },
    {
      q: "Write P(A|B) in terms of P(B|A).",
      a: "P(A|B) = P(B|A)P(A)/P(B), with P(B) expanded by total probability over the ways B can happen: P(B) = Σᵢ P(B|Aᵢ)P(Aᵢ).",
    },
    {
      q: "What does conditioning on B do to the sample space?",
      a: "Restricts it: B becomes the new universe and everything renormalizes by P(B). The world doesn't change, your candidate set does.",
    },
    {
      q: "Independent vs mutually exclusive for events with positive probability?",
      a: "Near-opposites. Mutually exclusive means one occurring rules the other out (maximal dependence); independent means P(A∩B) = P(A)P(B), so knowing one tells you nothing about the other.",
    },
    {
      q: "Why does a 99%-accurate test NOT give P(sick|positive) = 0.99?",
      a: "Base rates: at 1/1000 prevalence the false positives from the huge healthy group swamp the true positives, the posterior lands near 9%, not 99%.",
    },
  ],
  coreRead: [
    {
      title: "MIT 18.05 S22, Readings 1b, 2, 3",
      url: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_probability.pdf",
      resourceId: "mit-1805",
      sections:
        "In order: Reading 1b (counting and sets) → Reading 2 (terminology, sample spaces, axioms) → Reading 3 (conditional probability, independence, Bayes, trees, total probability, base-rate examples). Do the embedded questions as you read. Skip 1a. (Combined probability PDF linked; the same readings live on the course readings page.)",
      minutes: 60,
      whySelected:
        "Self-contained ~8-page readings at exactly working-engineer depth, with their own self-check questions, the only free text that does this with solved psets attached.",
    },
  ],
  practice: [
    {
      prompt:
        "18.05 Pset 1: the counting, conditional-probability, and Bayes problems. Do them on paper first, full effort, then grade yourself against the posted solutions.",
      source: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_pset01_sol.pdf",
      minutes: 75,
    },
    {
      prompt: "The Class 1 in-class problem set, a warm-up to do before or alongside the pset.",
      source: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class01_pset.pdf",
      minutes: 30,
    },
    {
      prompt:
        "MIT's official interactive port (OLL 18.05r, free to view). Run the auto-graded checkers for units 1 to 3 to get instant feedback on whatever the pset left shaky.",
      source: "https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.05r_10+2022_Summer/about",
      minutes: 45,
    },
  ],
  implement: {
    spec: "bayes_sim.py: (1) simulate the disease-test paradox. Fix accuracy at 99%, sweep prevalence, and plot P(sick|positive) against prevalence so the wrong guess (0.99) and the right answer both show up on one figure. (2) Use Monte-Carlo to check three conditional-probability puzzles from Pset 1 that you first solved by hand.",
    checks: [
      "Simulated P(sick|positive) at 1/1000 prevalence matches your hand Bayes computation to 2 decimals (≈0.09)",
      "The plot makes the base-rate trap visible: posterior far below test accuracy until prevalence is large",
      "All three Monte-Carlo estimates agree with your hand answers within sampling noise",
    ],
    minutes: 60,
  },
  stuck: {
    alternate: {
      title: "The medical test paradox, and redesigning Bayes' rule",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=lG4VkPoG3ko",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=lG4VkPoG3ko"),
      minutes: 21,
      whySelected: "The same idea re-derived through odds and Bayes factors, a genuinely different way to see it rather than a repeat.",
    },
    alternateRead: {
      title: "Introduction to Probability 2e (Blitzstein & Hwang, Stat 110)",
      url: "https://stat110.hsites.harvard.edu/",
      resourceId: "stat110",
      sections: "ch 1–2, the slower, formal treatment with the best problem bank in print",
      minutes: 60,
    },
    note: "If the 1000-person table isn't landing, switch the representation (try the odds form) rather than just a new voice. If the formalism is the block, Stat 110 ch 2 is the slow road. There is a gentler video voice at https://statquest.org/video_index.html.",
  },
  deepen: [
    {
      title: "18.05 Reading 12b, Bayesian Updating: Odds",
      url: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class12-prep-b.pdf",
      resourceId: "mit-1805",
      sections: "the odds / Bayes-factor form, the shape belief updates actually take inside real filters",
      minutes: 30,
    },
    {
      title: "Stat 110 problem sets, ch 1–2",
      url: "https://stat110.hsites.harvard.edu/",
      resourceId: "stat110",
      sections: "for problem volume beyond Pset 1, only if you want the extra reps",
      minutes: 90,
    },
  ],
  prove: {
    task: "Closed book. Take a Bayes problem you have NOT seen from the Practice Exam 1 long list (https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_prac_exam01_all.pdf, solutions in the matching _sol file) and stretch it into a two-stage update: a noisy sensor with a prior belief, then two measurements taken in sequence. Solve it by hand AND by simulation, matching to 2 decimals. This is a robot localization update in miniature.",
    criteria: [
      "Your hand solution writes out the total-probability decomposition of the evidence at each stage",
      "You use the first posterior as the second prior, or you explain why doing it in sequence and all at once give the same answer",
      "The simulation matches your hand answer to 2 decimals",
      "No transposed conditional anywhere: you can point to which quantity is P(evidence|state) and which is P(state|evidence)",
    ],
    minutes: 30,
  },
  transfer: {
    task: "A lidar beam returns 'obstacle' with P(hit|obstacle)=0.95 and P(hit|free)=0.10, and the prior map says P(obstacle)=0.2. You see two hits in a row. Compute the posterior after each hit, then explain why the second hit moves the probability less than the first even though each hit adds the same amount to the log-odds.",
    criteria: [
      "Both posteriors correct, via Bayes' rule or the odds × Bayes-factor form",
      "The explanation names the mechanism: log-odds adds a constant per hit while probability saturates toward 1",
    ],
    minutes: 15,
  },
  retention:
    "+7 days: re-do the disease-test diagnostic with new numbers, accuracy 90%, prevalence 1/50, in under 3 minutes, and write the total-probability decomposition of P(positive) from memory.",
  researchRecord: "docs/curation/l2-probability.md",
  minutes: 360,
};
