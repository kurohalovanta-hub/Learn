import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-eigen-svd.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-eigen-svd",
  whyNow:
    "Av = λv finds the directions a matrix only stretches, never turns. That one idea explains stability in control, covariance and PCA in statistics, and why deep-network training either blows up or dies out. SVD is the decomposition behind every low-rank trick, LoRA's ΔW = BA included, and since 3B1B never made an SVD chapter, this packet fills the gap: Ch 14 for the geometry, Brunton for the SVD anatomy, MML Ch 4 for the formal backbone.",
  diagnostic: {
    prompt:
      "Cold, no notes. (1) What are the eigenvalues of a 90° rotation matrix, and what does the answer mean? (2) Give the eigenvalues and eigenvectors of diag(3, ½) and of [[3,1],[0,2]]. (3) What does σ₁/σₙ, the condition number, tell you about solving Ax = b? Get all three clean and you can skim §4.5–4.6, then jump to PROVE.",
    minutes: 10,
  },
  orient: {
    title: "Eigenvectors and Eigenvalues Explained Visually",
    creator: "Setosa (Powell & Lehe)",
    url: "https://setosa.io/ev/eigenvectors-and-eigenvalues/",
    minutes: 10,
    whySelected: "Do this before any video. Drag the matrix and find the invariant directions of a symmetric matrix and a shear matrix by eye. Ten minutes of feel to hang Ch 14 on.",
    leaveWith: ["an eigenvector is an invariant DIRECTION, not a special output", "some matrices (rotations) have none to find"],
  },
  coreWatch: [
    {
      title: "Eigenvectors and eigenvalues, Essence of Linear Algebra Ch. 14",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=PFDu9oVAE-g",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=PFDu9oVAE-g"),
      minutes: 17,
      whySelected: "The classic geometric intro. It builds det(A−λI)=0 from the idea of a collapse instead of just stating it, and ends on the eigenbasis payoff you will use for powers of A.",
      leaveWith: ["Av = λv: the direction survives, only the scale changes", "det(A−λI) = 0 because A−λI must crush some direction to zero", "an eigenbasis makes powers of A trivial"],
      unverified: true,
    },
    {
      title: "Singular Value Decomposition (SVD): Mathematical Overview",
      creator: "Steve Brunton",
      url: "https://www.youtube.com/watch?v=nbBvuuNVfco",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=nbBvuuNVfco"),
      minutes: 12,
      whySelected: "The community's stand-in for 3B1B's missing SVD chapter. It breaks UΣVᵀ into rotate, stretch, rotate, from the author of Data-Driven Science and Engineering.",
      leaveWith: ["A = UΣVᵀ: U and V rotate, Σ stretches", "SVD exists for EVERY matrix; eigendecomposition does not"],
      unverified: true,
    },
    {
      title: "Singular Value Decomposition (SVD): Matrix Approximation",
      creator: "Steve Brunton",
      url: "https://www.youtube.com/watch?v=xy3QyyhiuY4",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=xy3QyyhiuY4"),
      minutes: 14,
      whySelected: "Truncated SVD and Eckart–Young. This is exactly the image-compression and LoRA low-rank picture the mastery test asks for.",
      leaveWith: ["A_k = Σσᵢuᵢvᵢᵀ is the BEST rank-k approximation", "the σ-spectrum ranks importance and tells you where to truncate"],
      unverified: true,
    },
  ],
  recall: [
    { q: "Why must det(A−λI) = 0 for an eigenvalue λ?", a: "Av = λv with v ≠ 0 means (A−λI)v = 0 has a nonzero solution, A−λI crushes a direction to zero, so it is singular, and singular means determinant zero." },
    { q: "Which matrices lack real eigenvectors, the classic counterexample?", a: "A rotation matrix: no real direction is invariant, its eigenvalues are complex. Symmetric matrices are the privileged case, real eigenvalues, orthogonal eigenvectors (the spectral theorem PCA relies on)." },
    { q: "In A = UΣVᵀ, what does each factor DO?", a: "Vᵀ rotates to the input's principal axes, Σ stretches along those axes by the singular values, U rotates the result into the output space." },
    { q: "Eigendecomposition vs SVD, which exists for every matrix?", a: "SVD: every matrix, any shape. Eigendecomposition needs a square matrix with a full set of eigenvectors, and orthogonal eigenvectors only when symmetric." },
    { q: "What does the elbow in the σ-spectrum mean for A_k?", a: "Past the elbow the σᵢ contribute little, truncating there keeps most of A's action at a fraction of the rank (Eckart–Young: A_k is optimal)." },
  ],
  interactiveIds: ["matrix-transform"],
  lessonId: "l2-eigen-svd",
  coreRead: [
    {
      title: "MML book (Deisenroth, Faisal, Ong)",
      url: "https://mml-book.github.io/book/mml-book.pdf",
      resourceId: "mml-book",
      sections: "§4.2 (eigenvalues/eigenvectors, pp.105–114) → §4.4 (eigendecomposition and diagonalization) → §4.5 (SVD, pp.119–129) → §4.6 (matrix approximation, pp.129–134); §4.1 determinant/trace as a 10-min skim only (earned geometrically in l2-matrices); SKIP §4.3 Cholesky, it returns with Gaussians",
      minutes: 135,
      whySelected: "The formal backbone, written in the exact ML dialect you will keep meeting. §4.6 is in core because it carries the LoRA and compression payoff.",
    },
  ],
  practice: [
    { prompt: "By hand, find the eigenpairs of [[3,1],[0,2]], the symmetric [[2,1],[1,2]], and diag(3, ½), and check Av = λv for every pair. Then load [[3,1],[0,2]] into the matrix-transform instrument, find both invariant directions by eye, and compare with your hand answers. Load a rotation and watch the search come up empty.", minutes: 30 },
    { prompt: "Run three steps of power iteration by hand on [[2,1],[1,2]], starting from (1,0) and normalizing each step. Watch the ratio settle toward λ₁.", minutes: 10 },
    { prompt: "MML Ch 4 exercises (p.137): 2 eigen, 1 SVD. Optional afterward: 3B1B Ch 15's mean-product trick, a quick way to check your 2×2 eigenvalues.", source: "https://mml-book.github.io/book/mml-book.pdf", minutes: 20 },
  ],
  implement: {
    spec: "Build three things. (1) Truncated-SVD image compression: plot reconstruction quality against k, find the elbow, annotate the σ-spectrum. (2) Stability: iterate x ← Ax for eigenvalues inside and outside the unit circle, plot the trajectories, and answer 'will this system blow up?'. (3) PCA on a 2D point cloud from scratch (covariance → eigenvectors → projection), checked against the official MML tutorial_pca notebook only AFTER your own version runs.",
    checks: [
      "The elbow in quality-vs-k is identified and matches the σ-spectrum annotation",
      "Trajectories diverge/decay exactly as |λ| predicted, and you predicted BEFORE running",
      "Your PCA axes match the covariance eigenvectors from np.linalg.eigh (up to sign)",
    ],
    minutes: 90,
  },
  stuck: {
    alternate: {
      title: "Singular Value Decomposition (the SVD)",
      creator: "Gilbert Strang (MIT OCW)",
      url: "https://www.youtube.com/watch?v=mBcLRGuAFUk",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=mBcLRGuAFUk"),
      minutes: 7,
      whySelected: "A short second take on SVD from Gilbert Strang.",
      unverified: true,
    },
    alternateRead: {
      title: "3blue1brown.com eigenvalues text lesson",
      url: "https://www.3blue1brown.com/lessons/eigenvalues/",
      sections: "text version of Ch 14 with embedded check questions",
      minutes: 20,
    },
    note: "Still stuck on how SVD is built? Read Gundersen's 'Singular Value Decomposition as Simply as Possible' (https://gregorygundersen.com/blog/2018/12/10/svd/).",
  },
  deepen: [
    { title: "MIT 18.06 (Strang) L21–22 (eigen) + L29 (SVD)", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", resourceId: "mit-1806", sections: "full-rigor fallback, or RES.18-010 'A 2020 Vision of Linear Algebra' as a 2 h capstone", minutes: 150 },
    { title: "Brunton's full SVD playlist", url: "https://www.youtube.com/playlist?list=PLMrJAkhIeNNSVjnsviglFoY2nXildDCcv", sections: "toward data-driven methods, beyond this node's scope", minutes: 120 },
    { title: "The Art of Linear Algebra (Hiranabe)", url: "https://github.com/kenjihiranabe/The-Art-of-Linear-Algebra", sections: "one-page EVD and SVD diagrams, print as a wall-chart retention artifact", minutes: 15 },
    { title: "A quick trick for computing eigenvalues, Ch. 15", url: "https://www.youtube.com/watch?v=e50Bj7jn9IQ", sections: "the 2×2 mean/product trick, a speed tool AFTER the concept holds, never before", minutes: 13 },
  ],
  prove: {
    task: "From scratch, write power iteration to find the top eigenvector of a fresh symmetric matrix, and prove to yourself it converged with a ratio test. Then, in one page or less, explain LoRA's ΔW = BA using the truncated-SVD picture of low-rank structure. Use §4.6 language: what you keep, what you drop, and why r ≪ n is enough.",
    criteria: [
      "Convergence is shown, not eyeballed: successive ratio or Rayleigh estimates settle",
      "Result matches np.linalg.eigh's top eigenvector up to sign",
      "The LoRA page says what you keep, what you drop, and why rank r ≪ n is enough, in σ-spectrum language with no hand-waving",
      "Written without reopening the videos or the book",
    ],
    minutes: 40,
  },
  transfer: {
    task: "Control preview: for x ← Ax with A = R(10°)·diag(0.98, 0.95), predict the long-run behavior from the eigenvalue magnitudes BEFORE you simulate, then simulate. In 2 sentences, say why 'training explodes or dies' is the same spectral statement about repeated linear maps. Second, explain why the covariance matrix's top eigenvector IS the direction of maximum variance (tie it back to l2-linear-maps projections).",
    criteria: [
      "Prediction (decaying spiral) committed before running and confirmed by the plot",
      "The variance argument uses projection, variance along unit u is uᵀΣu, maximized by the top eigenvector",
    ],
    minutes: 20,
  },
  retention: "Cold, +7–10 days: state which matrices admit eigendecomposition vs SVD; write A = UΣVᵀ and say what each factor DOES geometrically; sketch x ← Ax for |λ|max = 1.03 vs 0.97 (≤8 min).",
  researchRecord: "docs/curation/l2-eigen-svd.md",
  minutes: 405,
};
