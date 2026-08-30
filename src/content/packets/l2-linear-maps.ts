import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-linear-maps.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-linear-maps",
  whyNow:
    "Least squares is your first real ML model. Training starts here as plain geometry: you project b onto the column space of A. Basis and rank give you the words to say what a map (and later a network) can and cannot represent. Most of this node is reading, not video, because there is no good short video for least squares, so VMLS carries it.",
  diagnostic: {
    prompt:
      "Cold, no notes: (1) argue BOTH directions of 'AᵀA invertible ⇔ columns of A independent'; (2) fit y = mx + c to (0,1), (1,2), (2,2) with the normal equations by hand; (3) say in one sentence what 'residual ⟂ col(A)' means. If that comes out clean, skim §12 and go straight to PROVE.",
    minutes: 12,
  },
  orient: {
    title: "Inverse matrices, column space and null space, Ch. 7 (second half re-watch)",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=uQhTuRlWMxw",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=uQhTuRlWMxw"),
    minutes: 5,
    whySelected: "Re-watch only the column-space and rank half. 'Rank = the dimensions that survive the map' is the wording every step below leans on.",
    leaveWith: ["rank = dimension of the column space", "null space = what the map crushes to zero"],
    unverified: true,
  },
  coreWatch: [
    {
      title: "Nonsquare matrices as transformations between dimensions, Ch. 8",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=v8VSDg_WQlA",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=v8VSDg_WQlA"),
      minutes: 5,
      whySelected: "Skip if you already watched it in l2-matrices. This is the ℝⁿ→ℝᵐ picture that makes a tall A geometric. Short clip, but least squares leans on it.",
      leaveWith: ["a 3×2 matrix maps the plane onto a plane inside 3-space", "b usually lies OFF that plane, so you approximate"],
      unverified: true,
    },
    {
      title: "Change of basis, Ch. 13",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=P2LTAUO1TdA",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=P2LTAUO1TdA"),
      minutes: 13,
      whySelected: "Coordinates are a choice. This is what turns 'basis' into something you use, not just a word.",
      leaveWith: ["columns of the change-of-basis matrix = the new basis vectors in the old language", "same vector, different coordinates"],
      unverified: true,
    },
    {
      title: "Least squares approximation",
      creator: "Khan Academy (Sal Khan)",
      url: "https://www.youtube.com/watch?v=MC7l96tW8V8",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=MC7l96tW8V8"),
      minutes: 15,
      whySelected: "The one verified free video that walks the full projection to normal-equations derivation. The pace is slow, so keep the pencil moving.",
      leaveWith: ["x̂ solves AᵀAx̂ = Aᵀb", "the residual must be orthogonal to EVERY column of A"],
      unverified: true,
    },
  ],
  recall: [
    { q: "What do the columns of a change-of-basis matrix mean?", a: "They are the new basis vectors written in the old coordinates, the matrix translates the new language into ours." },
    { q: "Why must the least-squares residual be orthogonal to EVERY column of A?", a: "b − Ax̂ ⟂ col(A) means no direction inside the column space can reduce the error further; per-column orthogonality is exactly Aᵀ(b − Ax̂) = 0, which IS the normal equations." },
    { q: "A is 3×2 (tall). What does it do as a map, and why can Ax = b fail?", a: "It maps ℝ² onto a 2-D plane inside ℝ³; b generically lies off that plane, so you project b onto col(A) and solve the nearest problem instead." },
    { q: "Rank, in one geometric sentence?", a: "The number of dimensions that survive the map, dim(col(A))." },
  ],
  interactiveIds: ["matrix-transform"],
  coreRead: [
    {
      title: "VMLS (Boyd & Vandenberghe)",
      url: "https://vmls-book.stanford.edu/vmls.pdf",
      resourceId: "vmls",
      sections: "§5.1–5.4 (independence, basis, orthonormal vectors, Gram–Schmidt) → §11.5 (pseudo-inverse) → §12.1–12.4 (least squares: problem, solution, solving, examples) → §13.1–13.2 (data fitting, validation), work the examples by hand as you go",
      minutes: 100,
      whySelected: "This is the authority. The book's own claim is that linear independence and least squares carry all of applied linear algebra. It is the most reading-heavy node in the cluster, on purpose.",
    },
  ],
  practice: [
    { prompt: "Gram–Schmidt on three vectors in ℝ³, once, fully, by hand. Say 'subtract the projection onto what came before' at every step. Do it this once, and do not skip it.", minutes: 25 },
    { prompt: "Find the rank of three small matrices by eye, then check with np.linalg.matrix_rank. In the matrix-transform instrument, set a singular or near-singular matrix and talk through what happens to rank and column space, and why solve() has to fail.", minutes: 10 },
    { prompt: "VMLS exercises: 2 from Ch 5, 2 from Ch 12, 1 from Ch 13. Use the additional-exercises PDF if you want more.", source: "https://web.stanford.edu/~boyd/vmls/vmls-additional-exercises.pdf", minutes: 25 },
  ],
  implement: {
    spec: "least_squares.py: (1) derive the normal equations from b − Ax̂ ⟂ col(A) on paper first; (2) fit a line, then a cubic, to noisy data with your own normal-equations solver (no lstsq), and compare against np.linalg.lstsq; (3) build a rank-deficient A (duplicate a column), watch AᵀA go singular, repair with np.linalg.pinv, and write in the comments WHY pinv still returns an answer (§11.5).",
    checks: [
      "Your x̂ matches np.linalg.lstsq to numerical tolerance on both fits",
      "The rank-deficient case actually breaks solve/inv before pinv repairs it",
      "The pinv comment explains the minimum-norm solution, not just 'it works'",
    ],
    minutes: 75,
  },
  stuck: {
    alternateRead: {
      title: "3blue1brown.com change-of-basis text lesson",
      url: "https://www.3blue1brown.com/lessons/change-of-basis/",
      sections: "text version with embedded check questions",
      minutes: 15,
    },
    note: "Want a second written take on Gram–Schmidt? Gundersen, 'Linear Independence, Basis, and the Gram–Schmidt algorithm' (https://gregorygundersen.com/blog/2021/04/24/linear-independence/). If the derivation still slips, re-watch the Khan video at 0.75× with a pencil.",
  },
  deepen: [
    { title: "MML book", url: "https://mml-book.github.io/book/mml-book.pdf", resourceId: "mml-book", sections: "§3.8 (orthogonal projections, formal operators) + §2.5–2.6 (linear independence; basis and rank, formally)", minutes: 50 },
    { title: "MIT 18.06 (Strang), orthogonality, projection, least-squares lectures", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", resourceId: "mit-1806", sections: "only if the geometry still feels thin, 3–4 lectures ≈ 3 h", minutes: 180 },
    { title: "VMLS §13.3 Feature engineering", url: "https://vmls-book.stanford.edu/vmls.pdf", resourceId: "vmls", sections: "skim, the bridge from data fitting toward ML proper", minutes: 15 },
  ],
  prove: {
    task: "Blank page, no references. Derive the normal equations from the orthogonality condition b − Ax̂ ⟂ col(A), then write polynomial-fit code from scratch. Both have to run and check on your first honest attempt, or the node is not Gold.",
    criteria: [
      "The derivation goes from 'residual ⟂ every column' to AᵀAx̂ = Aᵀb with no memorized jump",
      "You can say when (AᵀA)⁻¹ exists and name the rank-safe repair when it does not (pseudo-inverse)",
      "The fit code is written cold and matches np.linalg.lstsq on the first run",
      "The plotted fit looks right on the data you generated",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Servo calibration: given 20 noisy (commanded_angle, measured_angle) pairs, fit measured = a·commanded + b and report the bias. Then explain in 3 sentences why a 9th-degree polynomial drops the residual but is actually WORSE, using the §13.2 validation language.",
    criteria: [
      "Design matrix set up correctly (column of ones for the bias term)",
      "Bias reported with a physical interpretation",
      "The argument names generalization to unseen data, not 'it looks wiggly'",
    ],
    minutes: 15,
  },
  retention: "Cold, +7–10 days: state the normal equations, the condition for their validity, and the pseudo-inverse fallback; re-derive x̂ for the 3-point line fit from the diagnostic (≤10 min).",
  researchRecord: "docs/curation/l2-linear-maps.md",
  minutes: 330,
};
