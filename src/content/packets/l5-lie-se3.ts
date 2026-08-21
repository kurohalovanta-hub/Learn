import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l5-lie-se3.md (live-verified 2026-08-21).
// Depth-flagged: the curation record explicitly forbids compressing this node.

export const packet: LearningPacket = {
  nodeId: "l5-lie-se3",
  whyNow:
    "This is the node where the curriculum's math ceiling rises. Homogeneous transforms carry rotation and translation as one object; exp/log maps let you differentiate, interpolate and optimize poses without ever leaving the manifold — the formalism every modern estimation and robot-learning paper assumes silently. You get a rare perfectly-aligned stack: the author teaching his own paper, the paper's boxed identities as your test suite, the author-convention library (manif) as your oracle — one notation from first exposure to permanent desk reference. Budget the full block; the record forbids the summary route, and the symbols here are exactly the kind that are easy to recognize and easy to fake.",
  diagnostic: {
    prompt:
      "Cold: (1) what is log of a rotation matrix, geometrically — what kind of object comes out, and what do its 3 numbers mean? (2) Why can't you optimize a rotation by gradient-stepping its 9 matrix entries and why doesn't projecting back fix it? (3) Is T ⊞ ξ the same thing as ξ ⊞ T? If the third question looks meaningless, that is precisely what this node repairs.",
    minutes: 10,
  },
  coreWatch: [
    {
      title: "Lie theory for the Roboticist (IROS'20 workshop lecture)",
      creator: "Joan Solà",
      url: "https://www.youtube.com/watch?v=QR1p0Rabuww",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=QR1p0Rabuww"),
      minutes: 60,
      whySelected:
        "The author teaching his own paper — de-abstracts every symbol you are about to implement, in the exact notation of the paper and of manif. Watch in FULL, pause-and-note; no 2× skimming — the curation record explicitly protects this hour.",
      leaveWith: [
        "the manifold-and-tangent-plane picture",
        "exp/log as the round trip between group and tangent space",
        "why ⊞/⊟ replace + and − on manifolds",
        "the thesis: the needed subset of Lie theory is small, concrete, computational",
      ],
      unverified: true,
    },
  ],
  coreRead: [
    {
      title: "A micro Lie theory for state estimation in robotics — §I + Fig. 1 first",
      resourceId: "sola-lie",
      url: "https://arxiv.org/abs/1812.01537",
      sections: "§I and Figure 1 only, BEFORE the lecture — the manifold-with-tangent-plane picture",
      minutes: 10,
      whySelected: "The one picture everything else in this node decorates. Get it first; the lecture then lands on prepared ground.",
    },
    {
      title: "A micro Lie theory — the working read",
      resourceId: "sola-lie",
      url: "https://arxiv.org/abs/1812.01537",
      sections:
        "§II–IV + the SO(3)/SE(3) example boxes + the appendix Jacobian tables — with pen AND an open NumPy session: every boxed identity gets verified numerically on random inputs the moment you read it. Do not read past a box you have not tested; this file becomes the seed of se3.py's test suite",
      minutes: 195,
      whySelected:
        "Its ⊞/⊟ and Jacobian conventions ARE the conventions of manif and of modern estimation papers — learn them once, use them for the rest of the curriculum. The appendix tables are a permanent desk reference.",
    },
  ],
  recall: [
    {
      q: "exp in this node is which exp — and what does np.exp(R) compute instead?",
      a: "The MATRIX exponential of a skew/twist matrix (the series Σ Aᵏ/k!). np.exp is elementwise, so it returns well-formed nonsense that still runs — the classic silent bug.",
    },
    {
      q: "What lives in the tangent space of SO(3) at the identity, and how many numbers parameterize it?",
      a: "Skew-symmetric matrices [ω]× — 3 numbers (the axis·angle vector). That 3 equals the group's DOF, which is why optimization happens here and not in the 9 entries of R.",
    },
    {
      q: "Write T ⊞ ξ in the right/local convention — and name the other convention.",
      a: "T ⊞ ξ = T·exp(ξ^): the perturbation lives in the local/body frame. The left/global convention is exp(ξ^)·T. They are different operations; libraries differ, and mixing them is the classic estimation bug.",
    },
    {
      q: "Why can't you optimize the 9 entries of R directly?",
      a: "The manifold has 3 DOF; a naive gradient step leaves SO(3) (orthonormality/det break), and projecting back onto the manifold is not the same as optimizing on it. Correct steps happen in the tangent space via ⊞.",
    },
    {
      q: "The v in a twist ξ = (v, ω) is…?",
      a: "NOT the velocity of the body origin. For a spatial twist v = ṗ − ω×p — it is the velocity of the point of the (extended) moving body instantaneously passing through the frame origin. Conflating it with 'linear velocity stacked on ω' causes silent Jacobian errors later.",
    },
  ],
  interactiveIds: ["so3-explorer"],
  lessonId: "l5-lie-se3",
  practice: [
    {
      prompt:
        "During the working read: verify every boxed identity numerically on random inputs as you meet it — exp/log closed forms, adjoint, the ⊞/⊟ definitions. (Time counted inside the core-read block; the point is that reading and testing are one activity here.)",
    },
    {
      prompt:
        "Geodesic vs naive: interpolate two rotations by R(t) = R₁·exp(t·log(R₁ᵀR₂)) and by entrywise lerp of the matrices. Animate both triads and check at every t which path stays in SO(3) (RᵀR = I, det = +1) — watch the lerp path shear and scale.",
      minutes: 30,
    },
    {
      prompt:
        "Verify the SO(3) Jacobian tables numerically: finite-difference the defining limits for the right and left Jacobians (Jr, Jl and their inverses) on random perturbations and compare against the appendix closed forms.",
      minutes: 30,
    },
  ],
  implement: {
    spec: "Complete se3.py: SO(3)+SE(3) exp and log in closed form, hat/vee, adjoint, and ⊞/⊟ implemented in BOTH conventions — right/local (T ⊞ ξ = T·exp(ξ^)) and left/global (exp(ξ^)·T) — explicitly labeled, never mixed. Property suite: exp(log(T)) = T; log(exp(ξ)) = ξ near identity; T·exp(ξ^)·T⁻¹ = exp((Ad_T ξ)^); (T ⊞ ξ) ⊟ T = ξ in each convention. Cross-check every operation against manif's Python bindings as oracle (github.com/artivis/manif).",
    checks: [
      "Round trips hold to 1e-9 near identity — and you can state where log's validity ends (θ → π)",
      "Right and left ⊞ produce DIFFERENT results on the same (T, ξ), your tests prove it, and every docstring names its convention",
      "The adjoint identity verified numerically on random T and ξ",
      "Every operation agrees with manif to numerical precision — an independent oracle, not your own code checking itself",
    ],
    minutes: 110,
  },
  derive: {
    spec: "On paper, references closed: (1) from the series exp([ω]×θ) = I + [ω]×θ + [ω]×²θ²/2! + …, use the identity [ω]×³ = −[ω]× to collapse the even and odd terms into Rodrigues' formula R = I + sinθ[ω]× + (1−cosθ)[ω]×². (2) Invert it: derive log — θ from tr(R) = 1 + 2cosθ, the axis from the skew part R − Rᵀ — and state exactly where the extraction degenerates (θ → 0 and θ → π) and what your code must do at each (Taylor branch near 0; separate axis extraction near π). (3) One tight paragraph: why the v in a twist (v, ω) is not the velocity of the body origin — write v = ṗ − ω×p and say which point v actually describes.",
    checks: [
      "The series collapsed via [ω]×³ = −[ω]× with the sin/cos series recognized — not quoted from memory",
      "log derivation names BOTH degenerate angles and the numerical fix for each, matching what se3.py actually does",
      "The twist paragraph is correct: v belongs to the body point instantaneously at the origin, and the ṗ − ω×p correction is stated, not hand-waved",
    ],
    minutes: 55,
  },
  stuck: {
    alternate: {
      title: "Lie theory for the roboticist — Summer School 2020 recording",
      creator: "Joan Solà",
      url: "https://www.youtube.com/watch?v=nHOcoIyJj2o",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=nHOcoIyJj2o"),
      minutes: 60,
      whySelected: "The same material, second telling — different audience, different Q&A. When the first pass didn't land, hear it again before pushing symbols.",
      unverified: true,
    },
    alternateRead: {
      title: "Modern Robotics Ch 3.3 — the screw-theory road",
      resourceId: "modern-robotics",
      url: "https://hades.mech.northwestern.edu/index.php/Modern_Robotics",
      sections: "Ch 3.3 (homogeneous transforms, twists, screws) — the same objects reached from geometry instead of group theory; the two views triangulate",
      minutes: 60,
    },
    note: "Third phrasing if needed: Bang-Shien Chen's condensed companion notes (dgbshien.com/docs/blogs/lie-theory.pdf) — evidence this paper is studied, not skimmed. If YouTube is unreachable, the LAAS PeerTube mirror carries the lecture (peertube.laas.fr/videos/watch/52ffc81c-09ce-41e9-8d6c-8c8d2b664d71).",
  },
  deepen: [
    {
      title: "Micro Lie paper §V — the derivative zoo",
      resourceId: "sola-lie",
      url: "https://arxiv.org/abs/1812.01537",
      sections:
        "§V — Jacobians of composition, inverse, group action, exp/log — pulled in a block at a time, the day a specific Jacobian appears in your IK error term or estimator",
      minutes: 60,
      whySelected:
        "Only-when-needed by design, but this is where l5-ik's log-map error Jacobian and l6-ekf-pf's on-manifold linearizations actually come from. Knowing it exists and where is the deliverable now.",
    },
    {
      title: "manif — the Solà-convention reference library",
      url: "https://artivis.github.io/manif/",
      sections:
        "docs plus the SO3/SE3 sources (github.com/artivis/manif): read the API against the appendix tables — every table row has a function name; note the README itself directs users to read the paper first",
      minutes: 45,
      whySelected: "Once you have read the paper, the library doubles as executable notation — and it stays your oracle for every SE(3) computation in the curriculum.",
    },
    {
      title: "SE_2(3) — the extended pose group",
      url: "https://github.com/artivis/manif",
      sections: "manif's SE_2(3) (pose + velocity as one group element) — read when the estimation nodes make IMU-style state real",
      minutes: 30,
      whySelected: "The same ⊞/⊟ machinery, one group bigger — a preview of why this formalism scales where ad-hoc pose parameterizations collapse.",
    },
  ],
  prove: {
    task: "Run your 30-case property suite on the finished module — SO(3)+SE(3) exp/log round trips (near identity AND far), adjoint identities, ⊞/⊟ inverse relations in both conventions — all green, with manif agreeing on every shared operation. Then, closed book, one paragraph: why does optimization on rotations use local coordinates?",
    criteria: [
      "All 30 cases green at the declared tolerances (1e-9 near identity)",
      "Right and left conventions are covered by tests that would FAIL if the two were swapped — the suite can tell them apart",
      "manif agreement on every operation it also implements",
      "The paragraph is concrete: 3 DOF, what a naive step in the 9 entries does, why projection ≠ tangent-space optimization, what ⊞ does instead",
    ],
    minutes: 45,
  },
  transfer: {
    task: "Open diffik.py in kevinzakka/mjctrl (github.com/kevinzakka/mjctrl) and find the line(s) computing the orientation error. State which ⊟ convention the code uses — local/body or global/space frame — justified from which side the difference is composed and where the log is taken. Then state precisely what would change in the controller's behavior if you flipped the convention and touched nothing else.",
    criteria: [
      "Correct line(s) identified in real, running controller code",
      "Convention named WITH the algebraic justification, not by pattern-matching variable names",
      "The flip consequence is concrete — the error twist lands in the wrong frame, feedback pushes in the wrong direction for large errors — not 'it would break'",
    ],
    minutes: 30,
  },
  retention:
    "+14 days: sketch the SO(3) exp map from the series definition and derive Rodrigues from it, cold; then re-verify one appendix Jacobian table numerically without opening your old code.",
  researchRecord: "docs/curation/l5-lie-se3.md",
  minutes: 665,
};
