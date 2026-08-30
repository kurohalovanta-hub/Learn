import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l2-algebra.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-algebra",
  whyNow:
    "Being 'bad at math' usually comes down to 8 to 15 specific broken skills, not one big problem. A cold test names yours in under an hour, so you fix only those and skip the rest. What you want out of this node is reading logs and exponents without stopping to think, because every loss curve you will ever plot sits on a log axis.",
  diagnostic: {
    prompt:
      "Take the Algebra 1 Course Challenge cold, one sitting, no notes, on a free Khan account so results save: https://www.khanacademy.org/math/algebra/test/x2f8bb11595b61c86:course-challenge (~35 min). Screenshot the skill breakdown. Scored 85% or more? Take the Algebra 2 Course Challenge the same day: https://www.khanacademy.org/math/algebra2/test/x2ec2f6f830c9fb89:course-challenge (~40 min). Pass that one too and you skip all the patching below; only the log-law derivation and the closed-book prove-it are left. A few things to hold to. Press Skip instead of guessing, since a skip counts as wrong and that is the honest reading. You can't restart a challenge once it's started. Any question where you needed a hint is a broken skill, so write it down.",
    minutes: 70,
    repair: true,
  },
  orient: {
    title: "Master Algebra II with Khan Academy, course map",
    creator: "Edison Prep",
    url: "https://edisonprep.com/algebra-2/",
    minutes: 5,
    whySelected:
      "Five minutes to see the whole map: the 12 units of Khan's Algebra 2 and which ones this node skips on purpose (sequences, statistics, conics, modeling). This is for orientation only. Nothing on this page is study material.",
  },
  recall: [
    {
      q: "Read log(ab) = log a + log b backwards as an exponent law, which one is it?",
      a: "b^m · b^n = b^(m+n). Multiplying powers adds exponents, and logs ARE exponents, every log rule is an exponent law read in the other direction.",
    },
    {
      q: "Without a calculator: what does a^(3/2) mean?",
      a: "(√a)³, the denominator is a root, the numerator a power. Fractional and negative exponents are notation for roots and reciprocals, not new objects.",
    },
    {
      q: "Why is dividing both sides of x(x−3) = 2x by x illegal?",
      a: "x can be zero, dividing by an expression that can be zero silently drops the x = 0 solution. Move everything to one side and factor instead.",
    },
    {
      q: "(a+b)² = ?",
      a: "a² + 2ab + b². Never a² + b², dropping the cross term is the classic under-pressure distribution error.",
    },
    {
      q: "You only have ln on hand. Compute log₂ x.",
      a: "log₂ x = ln x / ln 2, from x = 2^(log₂ x), take ln of both sides and solve. Change of base is derived, not memorized.",
    },
  ],
  practice: [
    {
      prompt:
        "Algebra 1 patch loop, only if the diagnosis flagged skills. From the challenge report, drill ONLY the failed skills, then take that unit's Unit Test to ≥90%. The units adults usually have gaps in are linear equations, systems, functions intro, exponents and radicals, and quadratics. Skip sequences and statistics entirely. The time here follows the diagnosis (2 to 8 h across the whole loop), and a clean report costs nothing.",
      source: "https://www.khanacademy.org/math/algebra/test/x2f8bb11595b61c86:course-challenge",
      minutes: 120,
    },
    {
      prompt:
        "Algebra 2 core, no matter your challenge score. Take each unit to a Unit Test of ≥90%: Rational exponents and radicals (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:exp), Logarithms (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:logs), Equations (https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:eq). A lucky 85% on the challenge can hide a skill it never tested, and these unit tests catch it. Quick if the skills are solid.",
      source: "https://www.khanacademy.org/math/algebra2",
      minutes: 150,
    },
    {
      prompt:
        "Finisher, timed: 20 mixed log and exponent equations under a 40-minute timer, on paper. Recognizing a method is not the same as being able to do it. Only cold recall under time pressure proves that.",
      minutes: 40,
    },
  ],
  derive: {
    spec: "One page, by hand, from the exponent laws alone. Derive log(ab) = log a + log b, log(a/b) = log a − log b, log(aⁿ) = n·log a, and change of base log_b x = ln x / ln b. Then write a 5-line note answering this: why is training loss plotted on a log axis? (What do exponential decay and power laws become on log and log-log axes?)",
    checks: [
      "Each law is derived by substituting a = b^m, not quoted, logs treated as exponents throughout",
      "Change of base derived from b^(log_b x) = x, not asserted",
      "The log-axis note connects straight lines on log plots to exponential/power-law behavior",
    ],
    minutes: 30,
  },
  stuck: {
    alternate: {
      title: "Exponential & logarithmic functions, Algebra II playlist",
      creator: "Khan Academy",
      url: "https://www.youtube.com/playlist?list=PLSQl0a2vh4HCusqEWppQKkzwVNLVCrV-p",
      minutes: 15,
      whySelected:
        "A video fallback: browse it by failed skill only, never straight through. The right video for this node is the short 3 to 8 min one Khan links from each failed exercise.",
      unverified: true,
    },
    alternateRead: {
      title: "Paul's Online Math Notes, Algebra",
      url: "https://tutorial.math.lamar.edu/classes/alg/alg.aspx",
      resourceId: "pauls-notes",
      sections: "Only the section matching the broken skill: Preliminaries (exponents/radicals/factoring) · Solving Equations · Exponential & Logarithm Functions",
      minutes: 30,
      whySelected: "For any skill that fails twice in Khan: plain, grown-up text with fully worked problems beats watching a video again.",
    },
    note: "Watching an explanation again feels like progress, but it isn't. Open text or video only after a skill has failed, then go straight back to the exercises.",
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
      sections: "The rung below Algebra basics, same rule: only on a collapsed diagnostic, never as browsing material.",
      minutes: 40,
    },
  ],
  prove: {
    task: "Closed book, timed: the OpenStax Algebra & Trigonometry 2e chapter Practice Tests for the Equations chapter and the Exponential & Logarithmic Functions chapter, graded against the answer keys, ≥90% on both. Khan never trained you on this test, so knowing Khan's question style won't help you here.",
    criteria: [
      "≥90% on BOTH chapter practice tests, closed book, under time",
      "No hints, no notes; a skipped question counts as a miss",
      "Every miss traced to a named skill and re-drilled in Khan before you claim the node",
      "Solutions show legal moves only (no dividing by an expression that could be zero, no dropped solutions)",
    ],
    minutes: 60,
  },
  transfer: {
    task: "Reading loss curves, which is the point of all this: (1) given samples of loss(t) = C·t^(−α) from a synthetic training run, recover α by hand as the slope on log-log axes; (2) turn the claim 'loss halves every k epochs' into an exponential decay equation and solve for k from two measured points.",
    criteria: [
      "α recovered as the negative of the log-log slope, with the reasoning written out",
      "The halving claim becomes L(t) = L₀ · 2^(−t/k) (or e^(−λt) with λ = ln 2 / k) and k is solved with log rules, not trial and error",
    ],
    minutes: 25,
  },
  retention: "Day +7: 10 fresh mixed log/exponent/radical equations (unseen, Khan mastery review or generated) in ≤20 min at ≥9/10. One miss = re-drill that one skill only, nothing else.",
  researchRecord: "docs/curation/l2-algebra.md",
  minutes: 500,
};
