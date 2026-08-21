import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-linear-maps.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-linear-maps",
  whyNow:
    "Least squares is your first real ML model — 'training' is born here, as pure geometry: project b onto the column space of A. Basis and rank are the capacity language that explains what maps (and later, networks) can and cannot represent. This is where the cluster's center of gravity shifts from video to text: least squares has no adequate short-video treatment, so VMLS carries the node.",
  diagnostic: {
    prompt:
      "Cold: (1) argue BOTH directions of 'AᵀA invertible ⇔ columns of A independent'; (2) fit y = mx + c to (0,1), (1,2), (2,2) via the normal equations by hand; (3) state what 'residual ⟂ col(A)' means in one sentence. Clean → skim §12 and jump to PROVE.",
    minutes: 12,
  },
  orient: {
    title: "Inverse matrices, column space and null space — Ch. 7 (second half re-watch)",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=uQhTuRlWMxw",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=uQhTuRlWMxw"),
    minutes: 5,
    whySelected: "Re-watch only the column-space/rank half: 'rank = dimensions that survive the map' is the language every step below leans on.",
    leaveWith: ["rank = dimension of the column space", "null space = what the map crushes to zero"],
    unverified: true,
  },
  coreWatch: [
    {
      title: "Nonsquare matrices as transformations between dimensions — Ch. 8",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=v8VSDg_WQlA",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=v8VSDg_WQlA"),
      minutes: 5,
      whySelected: "Skip if already watched in l2-matrices. The ℝⁿ→ℝᵐ picture that makes a tall A geometric — tiny and load-bearing for least squares.",
      leaveWith: ["a 3×2 matrix maps the plane onto a plane inside 3-space", "b generically lies OFF that plane — hence approximation"],
      unverified: true,
    },
    {
      title: "Change of basis — Ch. 13",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=P2LTAUO1TdA",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=P2LTAUO1TdA"),
      minutes: 13,
      whySelected: "Coordinates are a choice — makes 'basis' operational rather than ceremonial.",
      leaveWith: ["columns of the change-of-basis matrix = the new basis vectors in the old language", "same vector, different coordinates"],
      unverified: true,
    },
    {
      title: "Least squares approximation",
      creator: "Khan Academy (Sal Khan)",
      url: "https://www.youtube.com/watch?v=MC7l96tW8V8",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=MC7l96tW8V8"),
      minutes: 15,
      whySelected: "The only verified free video that walks the actual projection → normal-equations derivation. Slower production — keep the pencil moving.",
      leaveWith: ["x̂ solves AᵀAx̂ = Aᵀb", "the residual must be orthogonal to EVERY column of A"],
      unverified: true,
    },
  ],
  recall: [
    { q: "What do the columns of a change-of-basis matrix mean?", a: "They are the new basis vectors written in the old coordinates — the matrix translates the new language into ours." },
    { q: "Why must the least-squares residual be orthogonal to EVERY column of A?", a: "b − Ax̂ ⟂ col(A) means no direction inside the column space can reduce the error further; per-column orthogonality is exactly Aᵀ(b − Ax̂) = 0, which IS the normal equations." },
    { q: "A is 3×2 (tall). What does it do as a map, and why can Ax = b fail?", a: "It maps ℝ² onto a 2-D plane inside ℝ³; b generically lies off that plane, so you project b onto col(A) and solve the nearest problem instead." },
    { q: "Rank, in one geometric sentence?", a: "The number of dimensions that survive the map — dim(col(A))." },
  ],
  interactiveIds: ["matrix-transform"],
  coreRead: [
    {
      title: "VMLS (Boyd & Vandenberghe)",
      url: "https://vmls-book.stanford.edu/vmls.pdf",
      resourceId: "vmls",
      sections: "§5.1–5.4 (independence, basis, orthonormal vectors, Gram–Schmidt) → §11.5 (pseudo-inverse) → §12.1–12.4 (least squares: problem, solution, solving, examples) → §13.1–13.2 (data fitting, validation) — work the examples by hand as you go",
      minutes: 100,
      whySelected: "The precise authority: the book's own thesis is that linear independence + least squares carry all of applied linear algebra. Deliberately the read-heaviest node in the cluster.",
    },
  ],
  practice: [
    { prompt: "Gram–Schmidt on three vectors in ℝ³ — once, fully, by hand, saying 'subtract the projection onto what came before' at every step. Never to be repeated, never to be skipped.", minutes: 25 },
    { prompt: "Rank of three small matrices by inspection, then verify with np.linalg.matrix_rank. In the matrix-transform instrument, set a singular/near-singular matrix and narrate what happens to rank and column space, and why solve() must fail.", minutes: 10 },
    { prompt: "VMLS exercises: 2 from Ch 5, 2 from Ch 12, 1 from Ch 13 — additional-exercises PDF as extra pool.", source: "https://web.stanford.edu/~boyd/vmls/vmls-additional-exercises.pdf", minutes: 25 },
  ],
  implement: {
    spec: "least_squares.py: (1) derive the normal equations from b − Ax̂ ⟂ col(A) on paper first; (2) fit a line, then a cubic, to noisy data with your own normal-equations solver — no lstsq — and compare against np.linalg.lstsq; (3) build a rank-deficient A (duplicate a column), watch AᵀA go singular, repair with np.linalg.pinv, and write in comments WHY pinv still returns an answer (§11.5).",
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
    note: "Second written voice for Gram–Schmidt: Gundersen, 'Linear Independence, Basis, and the Gram–Schmidt algorithm' (https://gregorygundersen.com/blog/2021/04/24/linear-independence/). If the derivation still slides, re-watch the Khan video at 0.75× with a pencil.",
  },
  deepen: [
    { title: "MML book", url: "https://mml-book.github.io/book/mml-book.pdf", resourceId: "mml-book", sections: "§3.8 (orthogonal projections, formal operators) + §2.5–2.6 (linear independence; basis and rank, formally)", minutes: 50 },
    { title: "MIT 18.06 (Strang) — orthogonality, projection, least-squares lectures", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", resourceId: "mit-1806", sections: "only if the geometry still feels thin — 3–4 lectures ≈ 3 h", minutes: 180 },
    { title: "VMLS §13.3 Feature engineering", url: "https://vmls-book.stanford.edu/vmls.pdf", resourceId: "vmls", sections: "skim — the bridge from data fitting toward ML proper", minutes: 15 },
  ],
  prove: {
    task: "Blank page, no references: derive the normal equations from the orthogonality condition b − Ax̂ ⟂ col(A), then write polynomial-fit code from scratch. Both must run/check on the first honest attempt or the node is not Gold.",
    criteria: [
      "Derivation flows from 'residual ⟂ every column' to AᵀAx̂ = Aᵀb with no memorized jump",
      "You can state when (AᵀA)⁻¹ exists and name the rank-safe repair when it does not (pseudo-inverse)",
      "The fit code is written cold and matches np.linalg.lstsq on first run",
      "The plotted fit is sane on the data you generated",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Servo calibration: given 20 noisy (commanded_angle, measured_angle) pairs, fit measured = a·commanded + b and report the bias. Then explain in 3 sentences why adding a 9th-degree polynomial drops the residual but is WORSE — in §13.2 validation language.",
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
