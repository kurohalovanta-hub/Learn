import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l5-frames-rotations.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l5-frames-rotations",
  whyNow:
    "Robotics is mostly keeping track of where things sit relative to each other, and getting the frame wrong is the most common bug you will hit. The matrices are the ones you already met in L2. The new skill is careful bookkeeping: the ᵃR_b superscript notation catches frame mistakes early, and everything later (FK, Jacobians, IK) reuses it. The matrices will look familiar, so don't let that fool you; the real skill is chasing frames through several steps without a single slip.",
  diagnostic: {
    prompt:
      "Cold, on paper: (1) why must det R = +1, not −1? (2) What breaks if you average two rotation matrices entry by entry? (3) A three-frame chase with full notation: given ʷR_a, ᵃR_b, and a point ᵇp known in frame b, write the chain that gives ʷp, with every symbol carrying its frame super and subscripts.",
    minutes: 10,
  },
  orient: {
    title: "Modern Robotics Ch 3 lightboard videos, opening segments",
    creator: "Northwestern Robotics (Kevin Lynch)",
    url: "https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx",
    minutes: 10,
    whySelected:
      "The first Ch-3 segments (video titles follow the book's section numbers) set up the frame vocabulary in the exact notation the rest of the curriculum uses. They are short on purpose; read along in the book.",
    leaveWith: ["what a coordinate frame really is (a choice you attach to a body)", "why every vector needs a frame label"],
    unverified: true,
  },
  coreWatch: [
    {
      title: "Modern Robotics lightboard, Ch 3.2.1–3.2.2 (rotation matrices; angular velocities)",
      creator: "Northwestern Robotics (Kevin Lynch)",
      url: "https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx",
      minutes: 15,
      whySelected:
        "An exact match to the main reading, taught by the book's own authors, so there is no clash of conventions right when you are forming the notation habit. About 5 minutes per segment.",
      leaveWith: [
        "columns of ᵃR_b = the axes of {b} drawn in {a}",
        "R⁻¹ = Rᵀ, and why",
        "one matrix, two readings: rotate a vector, or re-express it",
      ],
      unverified: true,
    },
  ],
  recall: [
    {
      q: "The columns of ᵃR_b are…?",
      a: "The axes of frame {b} expressed in {a} coordinates, unit length, mutually orthogonal, det +1.",
    },
    {
      q: "R⁻¹ = ?, and why is that computationally free?",
      a: "Rᵀ. Orthonormal columns give RᵀR = I, so the transpose already is the inverse; no solve needed.",
    },
    {
      q: "Subscript cancellation: ᵃR_b ᵇR_c = ?",
      a: "ᵃR_c, adjacent subscript/superscript pairs must match and cancel; if they don't, the product is a frame bug.",
    },
    {
      q: "Do 3D rotations commute?",
      a: "No. Rz(90°)Rx(90°) ≠ Rx(90°)Rz(90°), order changes the final orientation. (2D intuition, where they do commute, does not carry over.)",
    },
    {
      q: "One matrix, two meanings, name them and the trap.",
      a: "Active (rotate the vector within a frame) vs passive (re-express a fixed vector in a rotated frame). They differ by a transpose/angle sign; silently mixing them is the classic wrong-frame bug.",
    },
  ],
  interactiveIds: ["rotation-2d", "so3-explorer"],
  lessonId: "l5-frames-rotations",
  coreRead: [
    {
      title: "Modern Robotics Ch 3.1–3.2.2",
      resourceId: "modern-robotics",
      url: "https://hades.mech.northwestern.edu/index.php/Modern_Robotics",
      sections:
        "Ch 3.1–3.2.2 with pen: re-derive R⁻¹ = Rᵀ yourself, and verify the subscript-cancellation rule on EVERY worked example before reading its solution",
      minutes: 70,
      whySelected:
        "The exact ᵃR_b notation the whole curriculum settles on; FK, Jacobians, and IK all reuse it. A free preprint from the people who wrote the field's standard text.",
    },
  ],
  practice: [
    {
      prompt:
        "Compose Rz(90°)Rx(90°) against Rx(90°)Rz(90°). Predict both final orientations with your hands (thumb and fingers, for real) before you run either one in code. Then check in se3.py and in the so3-explorer.",
      minutes: 10,
    },
    {
      prompt: "Prove R⁻¹ = Rᵀ from the orthonormal columns, in about three lines, with no reference open.",
      minutes: 10,
    },
    {
      prompt:
        "Frame-chase drill: given ʷR_a and ᵃR_b, express a point known in frame b in the world frame. Put full super and subscripts on every symbol, and check the cancellation pattern before you compute any numbers.",
      minutes: 15,
    },
    {
      prompt:
        "Pick any two rotation exercises from MR Ch 3 and solve them with full superscript notation all the way through. The notation is the point here, not the arithmetic.",
      source: "https://hades.mech.northwestern.edu/index.php/Modern_Robotics",
      minutes: 20,
    },
  ],
  implement: {
    spec: "Start your own library. Write se3.py with rot_x/y/z(θ), a compose function, and is_rotation (checking orthonormality and det). Add a matplotlib 3D triad that shows a frame rotating.",
    checks: [
      "rot_x/y/z pass is_rotation (RᵀR ≈ I to 1e-9, det ≈ +1) for 100 random angles",
      "The two composition orders Rz(90°)Rx(90°) and Rx(90°)Rz(90°) print different results, matching your hand prediction",
      "is_rotation REJECTS the entrywise average of two rotations (the diagnostic, now executable)",
      "The 3D triad plot matches what your hands predicted",
    ],
    minutes: 45,
  },
  stuck: {
    alternateRead: {
      title: "Extrinsic & intrinsic rotation: do I multiply from right or left? (Dominic Plein)",
      url: "https://dominicplein.medium.com/extrinsic-intrinsic-rotation-do-i-multiply-from-right-or-left-357c38c1abfd",
      sections: "the whole article, one question, answered properly: body-axis (intrinsic) sequences right-multiply, fixed-axis (extrinsic) left-multiply",
      minutes: 15,
    },
    note: "If a drill failed, first work out WHICH reading (active or passive) you used without noticing; the Grokipedia 'Active and passive transformation' page (grokipedia.com/page/Active_and_passive_transformation) states the sign-flip equivalence cleanly. Then redo the failed chase in the so3-explorer widget before you try a new one.",
  },
  deepen: [
    {
      title: "Modern Robotics lightboard, remainder of Ch 3.2",
      url: "https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx",
      sections: "the remaining Ch 3.2 segments (angular velocities; exponential coordinates, a preview of l5-lie-se3)",
      minutes: 20,
    },
    {
      title: "Active and passive transformation (Grokipedia)",
      url: "https://grokipedia.com/page/Active_and_passive_transformation",
      sections: "the formal statement of the active/passive equivalence-with-sign-flip, read once so the two readings have names",
      minutes: 15,
    },
    {
      title: "Fused Angles and the Deficiencies of Euler Angles (arXiv 1809.10651)",
      url: "https://arxiv.org/pdf/1809.10651",
      sections: "only if curious, beyond need here; evidence that Euler-angle confusion is structural, not a learner failing",
      minutes: 25,
    },
  ],
  prove: {
    task: "Superscript frame-chase test: 5 fresh multi-frame problems (generate random frame chains), solved on paper with full notation, then checked against your se3.py. Zero frame errors; one wrong frame means a retake.",
    criteria: [
      "Every line carries full ᵃR_b super and subscripts, with no bare R's",
      "Cancellation pattern checked BEFORE computing, on all 5 problems",
      "All 5 answers checked numerically against your library",
      "Zero frame errors (the gate is strict on purpose; this is the most common bug in robotics)",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Camera extrinsics: given a world-to-camera rotation from an OpenCV-style calibration, express a world point in the camera frame, and say which reading (active or passive) the vision community's convention uses. Same math, a different field's notation.",
    criteria: [
      "Transform applied in the correct direction (world → camera, not the inverse)",
      "The active/passive reading of the convention identified and justified in one sentence",
    ],
    minutes: 15,
  },
  retention:
    "+7 days: solve 3 fresh frame-chase problems from memory with full notation, and answer in two sentences: why is the entrywise mean of two rotation matrices not a rotation?",
  researchRecord: "docs/curation/l5-frames-rotations.md",
  minutes: 335,
};
