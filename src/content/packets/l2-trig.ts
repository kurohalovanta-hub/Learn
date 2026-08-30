import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-trig.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-trig",
  whyNow:
    "For the next 200 days, sin and cos are everywhere in your work, and you need to see them as the coordinates of a point moving around a circle, not ratios of triangle sides. The triangle picture breaks at 90°; the circle picture never does. Test out of the school trig you still know and fix only what fails, but do the unit-circle reframe and the three build tasks either way, because answering triangle questions with the old picture is the exact fake mastery this node catches.",
  diagnostic: {
    prompt:
      "Cold, about 25 min. (1) On paper: convert 150° to radians on sight; sketch sin(2x − π/2); compute atan2(−1, −1). (2) Take the Khan Algebra 2 Trigonometry unit test cold, from the unit page: https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig . Skip anything you do not know; never guess. If you score ≥90% and your paper answers are clean, jump to IMPLEMENT and PROVE IT. You still do the reframe work.",
    minutes: 25,
    repair: true,
  },
  orient: {
    title: "Unit circle definition of trig functions",
    creator: "Khan Academy (Sal)",
    url: "https://www.khanacademy.org/math/get-ready-for-precalculus/x65c069afc012e9d0:get-ready-for-trigonometry/x65c069afc012e9d0:unit-circle-introduction/v/unit-circle-definition-of-trig-functions-1",
    minutes: 5,
    whySelected:
      "The move from triangle to circle in its simplest form, the exact reframe this node is built around. Watch it even if you passed the diagnostic, as long as your school trig only used triangles.",
    unverified: true,
  },
  coreRead: [
    {
      title: "Trig unit circle review",
      url: "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig/x2ec2f6f830c9fb89:unit-circle/a/trig-unit-circle-review",
      resourceId: "khan-math",
      sections: "Full review article; then re-derive the exact values at 0, π/6, π/4, π/3, π/2 from the circle's symmetry, memorize by derivation, never as a table",
      minutes: 15,
      whySelected: "A short statement of the circle definition that sits next to the exercises; the reference you check your fixes against.",
    },
  ],
  recall: [
    {
      q: "Define cos θ and sin θ without mentioning a triangle.",
      a: "The x- and y-coordinates of the point at angle θ on the unit circle. This definition is total, it works at 90°, at 210°, for negative angles, everywhere the ratio picture dies.",
    },
    {
      q: "Why radians and not degrees?",
      a: "A radian is arc length on the unit circle, so θ ≈ sin θ for small θ and d/dθ sin θ = cos θ hold only in radians, and every NumPy/robotics API is radians-native. Degrees are a display format, not a working unit.",
    },
    {
      q: "What breaks in arctan(y/x) that atan2(y, x) fixes?",
      a: "The ratio y/x destroys the signs: quadrants II↔IV and III↔I collapse onto each other, and x = 0 divides by zero. atan2 keeps both signs, covers the full circle, and handles the axes.",
    },
    {
      q: "How far is sin(2x − π/2) shifted?",
      a: "π/4 to the right, not π/2, factor the frequency first: sin(2(x − π/4)). Same factoring rule as function transformations.",
    },
    {
      q: "What is sin²θ + cos²θ = 1 actually saying?",
      a: "It IS the unit circle equation x² + y² = 1 applied to the point (cos θ, sin θ). Geometry, not an identity to memorize, the only one you must own.",
    },
  ],
  interactiveIds: ["rotation-2d", "planar-arm"],
  practice: [
    {
      prompt:
        "Fix your failures only. Start with the Unit circle exercise, then work the rest of the Algebra 2 trig exercises (radians, graphs, Pythagorean identity) until the unit test clears ≥90%.",
      source: "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig/x2ec2f6f830c9fb89:unit-circle/e/unit-circle",
      minutes: 40,
    },
    {
      prompt:
        "Use the Precalc trig unit test as the higher bar. Go light on the identities lessons; past sin²+cos²=1 they are just lookups, and the angle-sum formulas fall out on their own when you derive the rotation matrix.",
      source: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:trig",
      minutes: 25,
    },
    {
      prompt:
        "Speed work, on paper: 10 fast conversions between degrees and radians (both directions, until they come instantly), then 5 sketches of a·sin(bx + c) with the phase factored out before you draw.",
      minutes: 20,
    },
  ],
  implement: {
    spec: "The heart of this node, about 90 min, radians only in all code. (1) orbit.py: plot or animate p(t) = (r·cos ωt, r·sin ωt), and check sin²+cos²=1 numerically at every timestep. (2) Your first FK, in about 15 lines: the fingertip of a 2-link arm, x = l₁cos θ₁ + l₂cos(θ₁+θ₂), y = l₁sin θ₁ + l₂sin(θ₁+θ₂), checked against the planar-arm widget. (3) Break arctan: evaluate arctan(y/x) against atan2(y, x) at one point per quadrant plus (0, ±1), then use what fails to write the 4-case definition of atan2 yourself. No Python yet? Do (1) and (2) on paper and Desmos, and (3) by hand.",
    checks: [
      "cos²+sin²=1 holds to ~1e-12 at every sample of the orbit",
      "FK matches the planar-arm widget for at least 3 angle pairs, including one with θ₂ negative",
      "Your arctan table explicitly shows the II↔IV and III↔I collapses and the x = 0 blowup",
      "Your hand-written 4-case atan2 agrees with np.arctan2 on all test points",
    ],
    minutes: 90,
  },
  stuck: {
    alternate: {
      title: "Basic trigonometry",
      creator: "Khan Academy",
      url: "https://www.youtube.com/watch?v=Jsiy4TxgIME",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=Jsiy4TxgIME"),
      minutes: 8,
      whySelected: "Triangle-first framing. Open this ONLY if SOH-CAH-TOA itself is gone. It will not teach the rotation view, so come back to the circle right after.",
      unverified: true,
    },
    alternateRead: {
      title: "Trigonometry: An Overview of Important Topics (short-course PDF)",
      url: "https://www.govst.edu/uploadedFiles/Academics/Colleges_and_Programs/CAS/Trigonometry_Short_Course_Tutorial_Lauren_Johnson.pdf",
      sections: "Matching topic only, built for returning students refreshing trig fast (content unverified at curation; URL from live search)",
      minutes: 30,
      whySelected: "A text path for each failed skill; otherwise every failed Khan exercise links its own matched video.",
    },
    note: "Fix the failed skill and come back. Do not fall back into the triangle picture as your home base; the circle is the definition now.",
  },
  deepen: [
    {
      title: "Right triangles & trigonometry (Khan)",
      url: "https://www.khanacademy.org/math/trigonometry/trigonometry-right-triangles",
      resourceId: "khan-math",
      sections: "Only if right-triangle basics themselves failed the diagnostic. Skip the rest of the standalone Trigonometry course, it is a community-flagged restitch of units you already have.",
      minutes: 60,
    },
    {
      title: "OpenStax Algebra & Trigonometry 2e",
      sections: "Trigonometric functions chapters, only if you want rigorous statements beyond the working level (authority of record; practice tests double as an unseen instrument)",
      minutes: 60,
    },
  ],
  prove: {
    task: "Cold, about 40 min. Starting from the unit circle, derive that a point p = (x, y) rotated by θ lands at (x cos θ − y sin θ, x sin θ + y cos θ). You may not quote memorized angle-sum formulas as premises; derive or geometrically justify them along the way. Then write rotate(p, θ) with tests: composition rotate(θ₁)∘rotate(θ₂) = rotate(θ₁+θ₂), norm preservation, and rotate(π/2) on the unit vectors.",
    criteria: [
      "Derivation starts from (cos θ, sin θ) as the coordinates of the rotated basis and reasons geometrically, with no formula quoted as a premise",
      "rotate(p, θ) passes all three test groups (composition, norm preservation, rotate(π/2) on î and ĵ)",
      "You can say what cos θ actually is, the x-coordinate of the rotated unit vector, without mentioning triangles",
    ],
    minutes: 40,
  },
  transfer: {
    task: "Three transfers, about 25 min. (1) Robot heading: given velocity (vₓ, v_y) in each of the four quadrants, compute the heading with atan2 and explain the two arctan failures it fixes. (2) Express sin(2x − π/2) as a cosine and read off amplitude, frequency, and phase as a 'wave spec'. (3) Predict exactly what the rotation-2d widget will show for θ = 210°, both coordinates with signs first, before you move the slider.",
    criteria: [
      "All four headings correct, with the quadrant-collapse and x=0 failures of arctan named",
      "The cosine rewrite is derived via the phase shift, not looked up",
      "The 210° prediction (−√3/2, −1/2) stated before the slider moves, from the circle's symmetry",
    ],
    minutes: 25,
  },
  retention:
    "Day +7: reproduce the five exact-value points on the circle from symmetry in ≤5 min; re-derive R(θ) cold; one fresh atan2 evaluation in quadrant III. Day +30, when l5-frames-rotations opens: re-derive R(θ) as the warm-up, spaced by design.",
  researchRecord: "docs/curation/l2-trig.md",
  minutes: 285,
};
