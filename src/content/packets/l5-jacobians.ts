import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l5-jacobians.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l5-jacobians",
  whyNow:
    "V = J(θ)θ̇ tells you how joint speeds turn into end-effector motion. J is just the derivative of the forward kinematics you already built, and its columns are joint screws you can point at. The formula takes a minute to memorize; the real work is building those columns by hand and reading σ_min as a warning gauge. Keep ω separate from Euler-angle rates too, because mixing them quietly breaks IK.",
  diagnostic: {
    prompt:
      "No notes: (1) physically, what do the columns of J stand for? (2) What does σ_min of J tell a controller? (3) Is the angular part of your Jacobian the time-derivative of Euler angles? (The third answer is no. If you said yes, this node is for you.)",
    minutes: 8,
  },
  coreWatch: [
    {
      title: "Modern Robotics lightboard, Ch 5 (Jacobian, statics, singularities, manipulability)",
      creator: "Northwestern Robotics (Kevin Lynch)",
      url: "https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx",
      minutes: 20,
      whySelected:
        "Comes straight from the book's own authors, so it matches your primary text. A different lecturer would only add convention risk (unflagged analytic Jacobians, different frames) without teaching you more. About 5 minutes per segment.",
      leaveWith: [
        "column i = joint i's screw, expressed at the current configuration",
        "τ = Jᵀf as the force dual of V = Jθ̇",
        "singularity = rank collapse, not robot damage",
      ],
      unverified: true,
    },
  ],
  recall: [
    {
      q: "Column i of the geometric Jacobian is…?",
      a: "Joint i's screw axis expressed at the current configuration, the end-effector twist produced by unit velocity of joint i alone. Meaningful geometry, not just 'some partials'.",
    },
    {
      q: "The angular rows of the geometric Jacobian produce what, and what do they NOT produce?",
      a: "Angular velocity ω. NOT the time-derivative of Euler angles or quaternion components, that is the analytic Jacobian, and mixing the two corrupts IK and control.",
    },
    {
      q: "What is a singularity, precisely, and does the robot break there?",
      a: "A configuration where J loses rank: some task-space DIRECTION becomes instantaneously unreachable, and nearby motion along it costs enormous joint rates (σ_min → 0). Nothing breaks, a direction disappears.",
    },
    {
      q: "τ = Jᵀf maps which way, and what is the strange flip side at singularities?",
      a: "Task-space wrench → joint torques. At a singularity the arm can RESIST some forces with zero torque, the dual of having lost those motion directions.",
    },
    {
      q: "How do you read the manipulability ellipsoid off the SVD of J?",
      a: "Axes along the left singular vectors, lengths = singular values: long axis = cheap motion, σ_min axis = expensive; the ellipsoid flattens as σ_min → 0, and w = √det(JJᵀ) is the product of the σ's.",
    },
  ],
  interactiveIds: ["planar-arm"],
  lessonId: "l5-jacobians",
  coreRead: [
    {
      title: "Modern Robotics Ch 5",
      resourceId: "modern-robotics",
      url: "https://hades.mech.northwestern.edu/index.php/Modern_Robotics",
      sections:
        "Ch 5, space/body Jacobian construction, statics duality τ = Jᵀf, singularity analysis, manipulability ellipsoid, with the 2R planar case fully worked by hand as you read",
      minutes: 70,
      whySelected: "The manipulability-ellipsoid figures are the mental model this node installs; the construction reuses your l5-lie-se3 screws directly.",
    },
  ],
  practice: [
    {
      prompt:
        "Before you read anything, open the planar-arm widget and wiggle each joint on its own at a few configurations. The tip-velocity arrow you are watching is that joint's column of J. Then stretch the arm toward full extension and watch what happens to the arrows.",
      minutes: 10,
    },
    {
      prompt:
        "Drive the UR5e to a singularity in MuJoCo. Log σ_min → 0, plot the manipulability ellipsoid collapsing, and name the lost task-space direction in plain words: which Cartesian motion just became impossible?",
      minutes: 30,
    },
    {
      prompt:
        "Check τ = Jᵀf with numbers. Apply a known wrench at the UR5e end-effector in MuJoCo, then compare the joint torques your Jᵀ predicts against what the simulator needs to hold still.",
      minutes: 25,
    },
  ],
  implement: {
    spec: "kin.py: build the geometric Jacobian for the UR5e in both space and body versions, each clearly labeled. Verify it against finite differences of your l5-fk forward kinematics at 100 random configurations. Then plot the manipulability ellipsoid along a trajectory, logging w = √det(JJᵀ) and σ_min alongside it.",
    checks: [
      "Finite-difference agreement at 100 random configurations (central differences, tolerance ~1e-6)",
      "Space and body Jacobians labeled, and you can say which frame each expresses the twist in",
      "Ellipsoid + w + σ_min plotted along a real trajectory; σ_min dips exactly where the ellipsoid flattens",
    ],
    minutes: 75,
  },
  stuck: {
    alternateRead: {
      title: "NxRLab/ModernRobotics reference library",
      url: "https://github.com/NxRLab/ModernRobotics",
      sections: "JacobianSpace / JacobianBody, read as executable summaries of the Ch 5 construction (oracle, not crib)",
      minutes: 20,
    },
    note: "If the construction won't click, derive the 2R planar Jacobian twice. Do it once by differentiating your L2 trig FK, and once by the screw-column construction, then show the two matrices are equal. That equality is the whole chapter in miniature.",
  },
  deepen: [
    {
      title: "Body vs space Jacobian via the Adjoint",
      resourceId: "modern-robotics",
      url: "https://hades.mech.northwestern.edu/index.php/Modern_Robotics",
      sections:
        "MR Ch 5's relation J_b = Ad(T⁻¹)·J_s, closes the loop with l5-lie-se3's adjoint; picking one frame and mislabeling it poisons downstream code silently",
      minutes: 25,
    },
    {
      title: "Analytic Jacobians, conversion on demand only",
      resourceId: "modern-robotics",
      sections:
        "the ω-to-Euler-rate conversion formulas, pull in ONLY when a paper forces analytic Jacobians on you; your geometric J's angular rows produce ω, and that stays the default",
      minutes: 20,
    },
  ],
  prove: {
    task: "Node mastery test: (1) your Jacobian passes finite-difference verification against your own FK; (2) you write up one singularity of your arm, saying which end-effector motions become instantly impossible and why the math says so.",
    criteria: [
      "FD verification green at 100 random configurations",
      "The write-up names the lost direction(s) and ties them to rank collapse (σ_min → 0), not just 'the arm is stretched out'",
      "It states what happens to required joint rates for motion NEAR the lost direction",
      "It says clearly why your J's angular rows are ω and not Euler-angle rates",
    ],
    minutes: 35,
  },
  transfer: {
    task: "Real statics: pick a UR5e pose and a 10 N downward press. Compute τ = Jᵀf, apply those torques in MuJoCo with gravity compensation, and check the measured contact force. Then explain why the same press near a singularity needs almost no torque in one direction, and how that ties back to the motion directions the arm lost there.",
    criteria: [
      "Measured contact force matches the commanded 10 N within tolerance",
      "Duality used in the correct direction (task wrench → joint torque, not inverted)",
      "The near-singularity explanation connects resisting force at zero torque to the lost motion directions, the two are duals, and you can say so",
    ],
    minutes: 40,
  },
  retention:
    "+14 days: write V = Jθ̇ and τ = Jᵀf from memory, explain the duality in three sentences, and sketch how the manipulability ellipsoid deforms as the arm approaches full extension.",
  researchRecord: "docs/curation/l5-jacobians.md",
  minutes: 403,
};
