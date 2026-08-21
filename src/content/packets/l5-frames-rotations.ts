import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l5-frames-rotations.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l5-frames-rotations",
  whyNow:
    "Robotics is the discipline of keeping track of where things are relative to other things, and wrong-frame bugs are its #1 practical error source. The math here is your L2 matrices; the new skill is bookkeeping discipline — the ᵃR_b superscript notation is the vaccine, and everything downstream (FK, Jacobians, IK) reuses it verbatim. Matrices will look familiar; do not let recognition pass for the skill, which is error-free multi-frame chases under pressure.",
  diagnostic: {
    prompt:
      "Cold, on paper: (1) why must det R = +1, not −1? (2) What breaks when you average two rotation matrices entrywise? (3) A 3-frame chase with explicit notation: given ʷR_a and ᵃR_b and a point ᵇp known in frame b, write the chain that produces ʷp — every symbol carrying its frame super/subscripts.",
    minutes: 10,
  },
  orient: {
    title: "Modern Robotics Ch 3 lightboard videos — opening segments",
    creator: "Northwestern Robotics (Kevin Lynch)",
    url: "https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx",
    minutes: 10,
    whySelected:
      "The first Ch-3 segments of the playlist (video titles follow book section numbers) set the frame vocabulary in the exact notation the whole curriculum uses. Terse by design — the book is the follow-along.",
    leaveWith: ["what a coordinate frame IS (a choice, attached to a body)", "why every vector needs a frame label"],
    unverified: true,
  },
  coreWatch: [
    {
      title: "Modern Robotics lightboard — Ch 3.2.1–3.2.2 (rotation matrices; angular velocities)",
      creator: "Northwestern Robotics (Kevin Lynch)",
      url: "https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx",
      minutes: 15,
      whySelected:
        "Exact match to the primary text sections, from the book's own authors — no convention noise at exactly the moment notation discipline is being formed. ~5 min per segment.",
      leaveWith: [
        "columns of ᵃR_b = axes of {b} drawn in {a}",
        "R⁻¹ = Rᵀ and why",
        "one matrix, two readings: rotate a vector vs re-express it",
      ],
      unverified: true,
    },
  ],
  recall: [
    {
      q: "The columns of ᵃR_b are…?",
      a: "The axes of frame {b} expressed in {a} coordinates — unit length, mutually orthogonal, det +1.",
    },
    {
      q: "R⁻¹ = ? — and why is that computationally free?",
      a: "Rᵀ. Orthonormal columns give RᵀR = I, so the transpose already is the inverse; no solve needed.",
    },
    {
      q: "Subscript cancellation: ᵃR_b ᵇR_c = ?",
      a: "ᵃR_c — adjacent subscript/superscript pairs must match and cancel; if they don't, the product is a frame bug.",
    },
    {
      q: "Do 3D rotations commute?",
      a: "No. Rz(90°)Rx(90°) ≠ Rx(90°)Rz(90°) — order changes the final orientation. (2D intuition, where they do commute, does not carry over.)",
    },
    {
      q: "One matrix, two meanings — name them and the trap.",
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
        "The exact ᵃR_b notation the entire curriculum standardizes on — FK, Jacobians and IK all reuse it. Free preprint from the primary authority.",
    },
  ],
  practice: [
    {
      prompt:
        "Compose Rz(90°)Rx(90°) vs Rx(90°)Rz(90°): predict BOTH final orientations with your hands (physically, thumb and fingers) before running either in code — then check in se3.py and in the so3-explorer.",
      minutes: 10,
    },
    {
      prompt: "Prove R⁻¹ = Rᵀ from orthonormal columns, in 3 lines, no reference open.",
      minutes: 10,
    },
    {
      prompt:
        "Frame-chase drill: given ʷR_a and ᵃR_b, express a point known in frame b in the world frame. Full super/subscripts on every symbol; verify the cancellation pattern before computing numbers.",
      minutes: 15,
    },
    {
      prompt:
        "Pick any two rotation exercises from MR Ch 3 and solve them with full superscript notation throughout — the notation is the point, not the arithmetic.",
      source: "https://hades.mech.northwestern.edu/index.php/Modern_Robotics",
      minutes: 20,
    },
  ],
  implement: {
    spec: "Start your library: se3.py with rot_x/y/z(θ), compose, and is_rotation (orthonormality + det checks); plus a matplotlib 3D triad visualization of a frame rotating.",
    checks: [
      "rot_x/y/z pass is_rotation (RᵀR ≈ I to 1e-9, det ≈ +1) for 100 random angles",
      "The two composition orders Rz(90°)Rx(90°) and Rx(90°)Rz(90°) print different results — matching your hand prediction",
      "is_rotation REJECTS the entrywise average of two rotations (the diagnostic, now executable)",
      "The 3D triad plot matches what your hands predicted",
    ],
    minutes: 45,
  },
  stuck: {
    alternateRead: {
      title: "Extrinsic & intrinsic rotation: do I multiply from right or left? (Dominic Plein)",
      url: "https://dominicplein.medium.com/extrinsic-intrinsic-rotation-do-i-multiply-from-right-or-left-357c38c1abfd",
      sections: "the whole article — one question, answered properly: body-axis (intrinsic) sequences right-multiply, fixed-axis (extrinsic) left-multiply",
      minutes: 15,
    },
    note: "If a drill failed, first diagnose WHICH reading (active vs passive) you silently used — the Grokipedia 'Active and passive transformation' page (grokipedia.com/page/Active_and_passive_transformation) states the sign-flip equivalence cleanly. Then redo the failed chase in the so3-explorer widget before attempting a new one.",
  },
  deepen: [
    {
      title: "Modern Robotics lightboard — remainder of Ch 3.2",
      url: "https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx",
      sections: "the remaining Ch 3.2 segments (angular velocities; exponential coordinates — a preview of l5-lie-se3)",
      minutes: 20,
    },
    {
      title: "Active and passive transformation (Grokipedia)",
      url: "https://grokipedia.com/page/Active_and_passive_transformation",
      sections: "the formal statement of the active/passive equivalence-with-sign-flip — read once so the two readings have names",
      minutes: 15,
    },
    {
      title: "Fused Angles and the Deficiencies of Euler Angles (arXiv 1809.10651)",
      url: "https://arxiv.org/pdf/1809.10651",
      sections: "only if curious — beyond need here; evidence that Euler-angle confusion is structural, not a learner failing",
      minutes: 25,
    },
  ],
  prove: {
    task: "Superscript-notation frame-chase test: 5 unseen multi-frame problems (generate random frame chains), solved on paper with explicit notation, then verified against your se3.py. Zero frame errors — one wrong frame is a retake.",
    criteria: [
      "Every line carries full ᵃR_b super/subscripts — no naked R's",
      "Cancellation pattern checked BEFORE computing, on all 5 problems",
      "All 5 answers verified numerically against your library",
      "Zero frame errors (the gate is deliberately unforgiving — this is the #1 bug source in robotics)",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Camera extrinsics: given a world-to-camera rotation from an OpenCV-style calibration, express a world point in the camera frame — and state which reading (active or passive) the vision community's convention uses. Same math, different community's notation.",
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
