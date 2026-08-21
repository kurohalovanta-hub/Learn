import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-matrices.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-matrices",
  whyNow:
    "A matrix is a machine that moves space — and every neural layer, camera model and robot pose you will ever touch is one. This node turns 'table of numbers' into 'transformation you can see', which is the difference between reading formulas and reading systems.",
  diagnostic: {
    prompt:
      "Cold, on paper: write the 2×2 matrix that rotates the plane by 90° CCW, then compute det and explain what your det value means geometrically. Then: for A=[[2,0],[0,0]], what does A do to the plane, and why does A⁻¹ not exist?",
    minutes: 10,
  },
  coreWatch: [
    {
      title: "Linear transformations and matrices — Essence of Linear Algebra Ch. 3",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=kYB8IZa5AuE",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kYB8IZa5AuE"),
      minutes: 11,
      whySelected: "The load-bearing video of the cluster: columns are where the basis lands — the node's central misconception, dissolved visually.",
      leaveWith: ["a matrix IS a transformation", "columns = images of î and ĵ", "grid lines stay parallel and evenly spaced"],
    },
    {
      title: "Matrix multiplication as composition — Ch. 4",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=XkY2DOUCWMU",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=XkY2DOUCWMU"),
      minutes: 10,
      whySelected: "Order-matters made visceral — AB means B first, and why that is geometry, not convention.",
      leaveWith: ["AB = 'do B, then A'", "why AB ≠ BA"],
    },
    {
      title: "The determinant — Ch. 6",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=Ip3X9LOh2dk",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=Ip3X9LOh2dk"),
      minutes: 10,
      whySelected: "det as signed area scale; det = 0 as 'space collapsed, information destroyed'.",
      leaveWith: ["det = area scale factor", "sign = orientation flip", "det 0 ⇒ no inverse"],
    },
  ],
  recall: [
    { q: "The columns of a matrix are…?", a: "Where the basis vectors î and ĵ land under the transformation." },
    { q: "AB applied to x — which acts first?", a: "B (rightmost first): ABx = A(Bx)." },
    { q: "det A = 0 means what, geometrically and practically?", a: "The map squashes space onto a line/point — area is destroyed, the map is not invertible." },
    { q: "Why is np.linalg.solve(A, b) preferred over inv(A) @ b?", a: "Solving is more stable and cheaper than forming the inverse explicitly." },
  ],
  interactiveIds: ["matrix-transform"],
  lessonId: "l2-matrices",
  coreRead: [
    {
      title: "VMLS (Boyd & Vandenberghe)",
      url: "https://vmls-book.stanford.edu/vmls.pdf",
      resourceId: "vmls",
      sections: "§6.1–6.4 (matrices, matrix–vector as column mix), §8.3 (systems), §10.1–10.2 (matmul/composition), §11.1–11.3 (inverses)",
      minutes: 75,
      whySelected: "Proof-light, exercise-rich formalization of exactly what the videos showed.",
    },
  ],
  practice: [
    { prompt: "Hand-write the matrix for each: rotate 90° CW · reflect across y=x · project onto the x-axis · scale x by 3, y by ½. Check each in the matrix-transform instrument.", minutes: 25 },
    { prompt: "For each of your four matrices: compute det by hand and state which are invertible and why.", minutes: 15 },
    { prompt: "Compute (RS)x and (SR)x by hand for R = rotate 90°, S = scale(2,1), x = (1,0); explain the difference in one sentence.", minutes: 10 },
    { prompt: "VMLS exercises for §6/§10/§11 — at least 6 problems, on paper, answers checked in NumPy.", source: "https://vmls-book.stanford.edu/vmls.pdf", minutes: 45 },
  ],
  implement: {
    spec: "transforms.py: rot(theta) building the 2×2 rotation from cos/sin; verify rot(a)@rot(b) ≈ rot(a+b) and rot(t).T@rot(t) ≈ I for 100 random angles; det ≈ 1; compose rotate+stretch both orders and print both images of (1,0).",
    checks: [
      "All numeric verifications pass (np.allclose, atol 1e-9)",
      "The two composition orders visibly differ on (1,0)",
      "You can say aloud why rot(a)@rot(b)=rot(a+b) is geometrically obvious",
    ],
    minutes: 40,
  },
  stuck: {
    alternateRead: {
      title: "3blue1brown.com text lessons (with built-in interactive questions)",
      url: "https://www.3blue1brown.com/lessons/linear-transformations",
      sections: "linear-transformations · matrix-multiplication · determinant · inverse-matrices",
      minutes: 30,
    },
    note: "If the geometry isn't landing, do the text lesson's inline questions before re-watching anything.",
  },
  deepen: [
    { title: "MML book", url: "https://mml-book.github.io/book/mml-book.pdf", resourceId: "mml-book", sections: "§4.1 (determinants formally — VMLS deliberately omits them)", minutes: 40 },
    { title: "MIT 18.06 (Strang) Lectures 1–3", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", resourceId: "mit-1806", sections: "only if the applied treatment leaves you wanting proofs", minutes: 150 },
  ],
  prove: {
    task: "Closed book: (1) construct the matrix for 'reflect across the x-axis, then rotate 45°' — as ONE matrix, stating which factor acts first; (2) compute its det and interpret it; (3) predict what it does to (1,1) and verify by hand-multiplication.",
    criteria: [
      "Matrix built from columns-as-basis-images, not memorized formulas",
      "Composition order correct (and you can defend it)",
      "det computed and interpreted (sign included)",
      "Prediction matches the hand computation",
    ],
    minutes: 20,
  },
  transfer: {
    task: "A robot camera reports a detection at (0.4, 0.8) in a frame rotated 30° from base. Using only what this node built, write the matrix that converts camera coordinates to base coordinates and apply it. (No lookup — derive the direction of the rotation.)",
    criteria: ["Correct R(30°) with the right sign convention", "Correct application and a sane sanity-check of the result"],
    minutes: 15,
  },
  retention: "Write, from nothing, the 2×2 rotation matrix R(θ) and state the two defining properties of any rotation matrix (RᵀR = I, det = +1).",
  researchRecord: "docs/curation/l2-matrices.md",
  minutes: 280,
};
