import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l2-algebra.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-algebra",
  whyNow:
    "You are not re-taking school. 'Bad at math' almost always means 8–15 specific broken skills, and a cold diagnostic names them precisely in under an hour — then you patch exactly those and nothing else. The non-negotiable payoff is log/exponent fluency: log rules are how you will read every loss curve and learning-rate schedule for the next 200 days. Here the diagnostic IS the path; the packet body exists only for what it exposes.",
  diagnostic: {
    prompt:
      "Cold, one sitting, no notes (free Khan account so results persist): take the Algebra 1 Course Challenge — https://www.khanacademy.org/math/algebra/test/x2f8bb11595b61c86:course-challenge (~30–40 min) — and screenshot the skill-level breakdown. If ≥85%: the same day, take the Algebra 2 Course Challenge cold — https://www.khanacademy.org/math/algebra2/test/x2ec2f6f830c9fb89:course-challenge (~40 min). Use Skip, never guess (a skip is marked incorrect, which is what you want — honest diagnosis), and know that a challenge cannot be restarted mid-attempt. Alg 2 ≥85% ⇒ skip all patching below; the three core unit tests, the log-law derivation and the OpenStax prove-it still stand. Hints used on any question = that skill is broken; log it.",
    minutes: 70,
    repair: true,
  },
  orient: {
    title: "Master Algebra II with Khan Academy — course map",
    creator: "Edison Prep",
    url: "https://edisonprep.com/algebra-2/",
    minutes: 5,
    whySelected:
      "Five minutes to see the terrain: the 12 units of Khan's Algebra 2 and which of them this node deliberately skips (sequences, statistics, conics, modeling). Orientation only — nothing on this page is study material.",
  },
  recall: [
    {
      q: "Read log(ab) = log a + log b backwards as an exponent law — which one is it?",
      a: "b^m · b^n = b^(m+n). Multiplying powers adds exponents, and logs ARE exponents — every log rule is an exponent law read in the other direction.",
    },
    {
      q: "Without a calculator: what does a^(3/2) mean?",
      a: "(√a)³ — the denominator is a root, the numerator a power. Fractional and negative exponents are notation for roots and reciprocals, not new objects.",
    },
    {
      q: "Why is dividing both sides of x(x−3) = 2x by x illegal?",
      a: "x can be zero — dividing by an expression that can be zero silently drops the x = 0 solution. Move everything to one side and factor instead.",
    },
    {
      q: "(a+b)² = ?",
      a: "a² + 2ab + b². Never a² + b² — dropping the cross term is the classic under-pressure distribution error.",
    },
    {
      q: "You only have ln on hand. Compute log₂ x.",
      a: "log₂ x = ln x / ln 2 — from x = 2^(log₂ x), take ln of both sides and solve. Change of base is derived, not memorized.",
    },
  ],
  practice: [
    {
      prompt:
        "Algebra 1 patch loop (only if the diagnosis flagged skills): from the challenge report, drill ONLY the failed skills, then take that unit's Unit Test to ≥90%. Typical adult-gap units: linear equations, systems, functions intro, exponents & radicals, quadratics. Skip sequences/statistics entirely. Time here scales with the diagnosis (2–8 h across the whole patch loop) — a clean report costs zero.",
      source: "https://www.khanacademy.org/math/algebra/test/x2f8bb11595b61c86:course-challenge",
      minutes: 120,
    },
    {
      prompt:
        "Algebra 2 core, regardless of challenge score — each unit to Unit Test ≥90%: Rational exponents & radicals (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:exp), Logarithms (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:logs), Equations (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:eq). A lucky 85% on the challenge can hide a skill it never drew; these three unit tests are the check. Fast if the skills are intact.",
      source: "https://www.khanacademy.org/math/algebra2",
      minutes: 150,
    },
    {
      prompt:
        "Finisher, timed: 20 mixed log/exponent equations under a 40-minute timer, on paper. Recognition is not repair — only cold retrieval under time pressure is.",
      minutes: 40,
    },
  ],
  derive: {
    spec: "One page, by hand, from the exponent laws alone: derive log(ab) = log a + log b, log(a/b) = log a − log b, log(aⁿ) = n·log a, and change of base log_b x = ln x / ln b. Then a 5-line note: why is training loss plotted on a log axis? (What do exponential decay and power laws become on log and log-log axes?)",
    checks: [
      "Each law is derived by substituting a = b^m, not quoted — logs treated as exponents throughout",
      "Change of base derived from b^(log_b x) = x, not asserted",
      "The log-axis note connects straight lines on log plots to exponential/power-law behavior",
    ],
    minutes: 30,
  },
  stuck: {
    alternate: {
      title: "Exponential & logarithmic functions — Algebra II playlist",
      creator: "Khan Academy",
      url: "https://www.youtube.com/playlist?list=PLSQl0a2vh4HCusqEWppQKkzwVNLVCrV-p",
      minutes: 15,
      whySelected:
        "Video-flavored fallback: browse per failed skill only, never linearly. The structurally correct video for this node is the 3–8 min one Khan links from each failed exercise.",
      unverified: true,
    },
    alternateRead: {
      title: "Paul's Online Math Notes — Algebra",
      url: "https://tutorial.math.lamar.edu/classes/alg/alg.aspx",
      resourceId: "pauls-notes",
      sections: "Only the section matching the broken skill: Preliminaries (exponents/radicals/factoring) · Solving Equations · Exponential & Logarithm Functions",
      minutes: 30,
      whySelected: "For any skill that fails twice in Khan: terse adult-toned text with fully solved problems beats re-watching.",
    },
    note: "Re-watching explanations feels like repair; it isn't. Open text or video only after a skill has failed, then go straight back to the exercises.",
  },
  deepen: [
    {
      title: "Step down: Algebra basics Course Challenge",
      url: "https://www.khanacademy.org/math/algebra-basics/test/xed0a1484:course-challenge",
      resourceId: "khan-math",
      sections: "Only if the Algebra 1 Course Challenge collapses (<60%): run the same diagnose-and-patch loop one level lower. Never open otherwise.",
      minutes: 40,
    },
    {
      title: "Step down: Get ready for Algebra 1 Course Challenge",
      url: "https://www.khanacademy.org/math/get-ready-for-algebra-i/test/x127ac35e11aba30e:course-challenge",
      resourceId: "khan-math",
      sections: "The rung below Algebra basics — same rule: only on a collapsed diagnostic, never as browsing material.",
      minutes: 40,
    },
  ],
  prove: {
    task: "Closed book, timed: OpenStax Algebra & Trigonometry 2e chapter Practice Tests for the Equations chapter and the Exponential & Logarithmic Functions chapter, graded against the answer keys, ≥90% on both. An instrument Khan never trained you on — so pattern-matching Khan's question style buys nothing.",
    criteria: [
      "≥90% on BOTH chapter practice tests, closed book, under time",
      "No hints, no notes; a skipped question counts as a miss",
      "Every miss traced to a named skill and re-drilled in Khan before claiming the node",
      "Solutions show legal moves only (no dividing by a possibly-zero expression, no dropped solutions)",
    ],
    minutes: 60,
  },
  transfer: {
    task: "Reading loss curves, which is what this was for: (1) given samples of loss(t) = C·t^(−α) from a synthetic training run, recover α by hand as the slope on log-log axes; (2) convert the claim 'loss halves every k epochs' into an exponential decay equation and solve for k given two measured points.",
    criteria: [
      "α recovered as the negative of the log-log slope, with the reasoning written out",
      "The halving claim becomes L(t) = L₀ · 2^(−t/k) (or e^(−λt) with λ = ln 2 / k) and k is solved with log rules, not trial and error",
    ],
    minutes: 25,
  },
  retention: "Day +7: 10 fresh mixed log/exponent/radical equations (unseen — Khan mastery review or generated) in ≤20 min at ≥9/10. One miss = re-drill that one skill only, nothing else.",
  researchRecord: "docs/curation/l2-algebra.md",
  minutes: 500,
};
