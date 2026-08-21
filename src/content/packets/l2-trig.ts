import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-trig.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-trig",
  whyNow:
    "Every joint angle, rotation matrix, wave and phase for the next 200 days is sin/cos — as the coordinates of a rotating point, not triangle-side ratios. The triangle definition dies at 90°; the circle definition never dies. Test out of what school trig survived, patch only failures — but the unit-circle reframe and the three build artifacts are never skipped, because passing triangle-style questions with the old picture is exactly the false mastery this node exists to prevent.",
  diagnostic: {
    prompt:
      "Cold, ~25 min. (1) On paper: convert 150° to radians instantly; sketch sin(2x − π/2); compute atan2(−1, −1). (2) Khan Algebra 2 Trigonometry unit test, cold, from the unit page: https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig . Skip, never guess. ≥90% plus clean paper answers ⇒ jump to IMPLEMENT and PROVE IT — the reframe work is never skipped.",
    minutes: 25,
    repair: true,
  },
  orient: {
    title: "Unit circle definition of trig functions",
    creator: "Khan Academy (Sal)",
    url: "https://www.khanacademy.org/math/get-ready-for-precalculus/x65c069afc012e9d0:get-ready-for-trigonometry/x65c069afc012e9d0:unit-circle-introduction/v/unit-circle-definition-of-trig-functions-1",
    minutes: 5,
    whySelected:
      "The triangle→circle reframe in minimal form — the exact move this node exists for. Watch even on a passed diagnostic if your school trig was triangle-only.",
    unverified: true,
  },
  coreRead: [
    {
      title: "Trig unit circle review",
      url: "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig/x2ec2f6f830c9fb89:unit-circle/a/trig-unit-circle-review",
      resourceId: "khan-math",
      sections: "Full review article; then re-derive the exact values at 0, π/6, π/4, π/3, π/2 from the circle's symmetry — memorize by derivation, never as a table",
      minutes: 15,
      whySelected: "Compact, exercise-adjacent statement of the circle definition — the reference you patch against.",
    },
  ],
  recall: [
    {
      q: "Define cos θ and sin θ without mentioning a triangle.",
      a: "The x- and y-coordinates of the point at angle θ on the unit circle. This definition is total — it works at 90°, at 210°, for negative angles, everywhere the ratio picture dies.",
    },
    {
      q: "Why radians and not degrees?",
      a: "A radian is arc length on the unit circle, so θ ≈ sin θ for small θ and d/dθ sin θ = cos θ hold only in radians — and every NumPy/robotics API is radians-native. Degrees are a display format, not a working unit.",
    },
    {
      q: "What breaks in arctan(y/x) that atan2(y, x) fixes?",
      a: "The ratio y/x destroys the signs: quadrants II↔IV and III↔I collapse onto each other, and x = 0 divides by zero. atan2 keeps both signs, covers the full circle, and handles the axes.",
    },
    {
      q: "How far is sin(2x − π/2) shifted?",
      a: "π/4 to the right, not π/2 — factor the frequency first: sin(2(x − π/4)). Same factoring rule as function transformations.",
    },
    {
      q: "What is sin²θ + cos²θ = 1 actually saying?",
      a: "It IS the unit circle equation x² + y² = 1 applied to the point (cos θ, sin θ). Geometry, not an identity to memorize — the only one you must own.",
    },
  ],
  interactiveIds: ["rotation-2d", "planar-arm"],
  practice: [
    {
      prompt:
        "Failures only: the Unit circle exercise, then the remaining Algebra 2 trig lesson exercises (radians, graphs, Pythagorean identity) until the unit test clears ≥90%.",
      source: "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:trig/x2ec2f6f830c9fb89:unit-circle/e/unit-circle",
      minutes: 40,
    },
    {
      prompt:
        "Precalc trig unit test as the higher bar. Take the identities lessons lightly — beyond sin²+cos²=1 they are lookups, and the angle-sum formulas become obvious in the rotation-matrix derivation anyway.",
      source: "https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:trig",
      minutes: 25,
    },
    {
      prompt:
        "Speed layer, on paper: 10 rapid conversions degrees↔radians (both directions, until instant), then 5 sketches of a·sin(bx + c) with the phase factored before drawing.",
      minutes: 20,
    },
  ],
  implement: {
    spec: "The node's heart, ~90 min, radians only in all code. (1) orbit.py: plot or animate p(t) = (r·cos ωt, r·sin ωt); confirm sin²+cos²=1 numerically at every timestep. (2) Your first FK, in ~15 lines: fingertip of a 2-link arm, x = l₁cos θ₁ + l₂cos(θ₁+θ₂), y = l₁sin θ₁ + l₂sin(θ₁+θ₂); check against the planar-arm widget. (3) Break arctan: evaluate arctan(y/x) vs atan2(y, x) on one point per quadrant plus (0, ±1); from the failures, write the 4-case definition of atan2 yourself. Pre-Python variant: (1) and (2) on paper + Desmos, (3) by hand evaluation.",
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
      whySelected: "Triangle-first framing — open ONLY if SOH-CAH-TOA itself is gone. It will not teach the rotation view; come back to the circle immediately after.",
      unverified: true,
    },
    alternateRead: {
      title: "Trigonometry: An Overview of Important Topics (short-course PDF)",
      url: "https://www.govst.edu/uploadedFiles/Academics/Colleges_and_Programs/CAS/Trigonometry_Short_Course_Tutorial_Lauren_Johnson.pdf",
      sections: "Matching topic only — built for returning students refreshing trig fast (content unverified at curation; URL from live search)",
      minutes: 30,
      whySelected: "Text path per failed skill; otherwise each failed Khan exercise links its own matched video.",
    },
    note: "Patch the failed skill and return. Do not fall back into the triangle picture as the home base — the circle is the definition now.",
  },
  deepen: [
    {
      title: "Right triangles & trigonometry (Khan)",
      url: "https://www.khanacademy.org/math/trigonometry/trigonometry-right-triangles",
      resourceId: "khan-math",
      sections: "Only if right-triangle basics themselves failed the diagnostic. Skip the rest of the standalone Trigonometry course — it is a community-flagged restitch of units you already have.",
      minutes: 60,
    },
    {
      title: "OpenStax Algebra & Trigonometry 2e",
      sections: "Trigonometric functions chapters — only if you want rigorous statements beyond the working level (authority of record; practice tests double as an unseen instrument)",
      minutes: 60,
    },
  ],
  prove: {
    task: "Cold, ~40 min: derive from the unit circle — no memorized angle-sum formulas allowed as premises; derive or geometrically justify them on the way — that a point p = (x, y) rotated by θ lands at (x cos θ − y sin θ, x sin θ + y cos θ). Then implement rotate(p, θ) with tests: composition rotate(θ₁)∘rotate(θ₂) = rotate(θ₁+θ₂), norm preservation, and rotate(π/2) on the unit vectors.",
    criteria: [
      "Derivation starts from (cos θ, sin θ) as coordinates of the rotated basis and reasons geometrically — no formula quoted as a premise",
      "rotate(p, θ) passes all three test groups (composition, norm preservation, rotate(π/2) on î and ĵ)",
      "You can say what cos θ IS — the x-coordinate of the rotated unit vector — without mentioning triangles",
    ],
    minutes: 40,
  },
  transfer: {
    task: "Three transfers, ~25 min: (1) robot heading — given velocity (vₓ, v_y) in each of the four quadrants, compute the heading with atan2 and explain the two arctan failures it fixes; (2) express sin(2x − π/2) as a cosine and read off amplitude/frequency/phase as a 'wave spec'; (3) predict exactly what the rotation-2d widget will show for θ = 210° — both coordinates, signs first — before moving the slider.",
    criteria: [
      "All four headings correct, with the quadrant-collapse and x=0 failures of arctan named",
      "The cosine rewrite is derived via the phase shift, not looked up",
      "The 210° prediction (−√3/2, −1/2) stated before the slider moves, from the circle's symmetry",
    ],
    minutes: 25,
  },
  retention:
    "Day +7: reproduce the five exact-value points on the circle from symmetry in ≤5 min; re-derive R(θ) cold; one fresh atan2 evaluation in quadrant III. Day +30, when l5-frames-rotations opens: re-derive R(θ) as the warm-up — spaced by design.",
  researchRecord: "docs/curation/l2-trig.md",
  minutes: 285,
};
