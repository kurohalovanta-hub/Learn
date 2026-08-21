import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-vectors.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-vectors",
  whyNow:
    "States, actions, observations, gradients, embeddings — everything in this field is a vector, and attention scores are dot products. This node fuses the two views of a vector — arrow in space, ordered data — and makes the dot product mean something in all three of its forms: Σaᵢbᵢ, ‖a‖‖b‖cosθ, and similarity/projection. It is the single most-used operation in ML, and your first real NumPy work.",
  diagnostic: {
    prompt:
      "Cold, no notes: for a=(3,4), b=(1,0) compute a·b, ‖a‖, and cosθ. State when a·b is zero, negative, maximal. Prove ‖a‖ = √(a·a). Clean sweep with instant answers → jump straight to PROVE.",
    minutes: 8,
  },
  coreWatch: [
    {
      title: "Vectors — Essence of Linear Algebra Ch. 1",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=fNk_zzaMoSs"),
      minutes: 10,
      whySelected: "The canonical arrow-vs-list fusion — the node's central misconception dissolved in ten minutes. Answer the recall questions from memory before moving on.",
      leaveWith: ["a vector is ONE object with two views: arrow and coordinate list", "addition = tip-to-tail; scaling = stretch/flip", "coordinates are the recipe in terms of basis vectors"],
    },
    {
      title: "Linear combinations, span, and basis vectors — Ch. 2",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=k7RM-ot2NWY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=k7RM-ot2NWY"),
      minutes: 10,
      whySelected: "Span/basis vocabulary every later node leans on — cheap at 10 minutes and pre-loads l2-linear-maps.",
      leaveWith: ["span of {a,b} = all combinations c₁a + c₂b", "two vectors fail to span the plane exactly when they line up"],
    },
    {
      title: "Dot products and duality — Ch. 9",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=LyGKycYT2v0",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=LyGKycYT2v0"),
      minutes: 15,
      whySelected: "Capstone — watch AFTER the practice below, not before: the WHY of algebraic = geometric via duality. It leans on the transformation view, so if it half-clicks, re-watch after l2-matrices.",
      leaveWith: ["why Σaᵢbᵢ and ‖a‖‖b‖cosθ are the same number", "dotting with b IS projecting onto b's line (times ‖b‖)"],
      unverified: true,
    },
  ],
  recall: [
    { q: "State both views of a vector and what connects them.", a: "An arrow from the origin AND an ordered list of numbers; the coordinates are the arrow's components along the basis vectors — addition and scaling work identically in both views." },
    { q: "Define the span of {a, b}. When do two vectors fail to span the plane?", a: "All linear combinations c₁a + c₂b; they fail when linearly dependent — one is a scalar multiple of the other — and the span collapses to a line." },
    { q: "a·b < 0 tells you what, instantly?", a: "The vectors point more than 90° apart (cosθ < 0)." },
    { q: "Write proj_b a and name the two classic traps.", a: "proj_b a = ((a·b)/(b·b)) b — a vector ALONG b. Traps: swapping the roles of a and b, and dropping the b·b denominator." },
  ],
  interactiveIds: ["vector-playground"],
  lessonId: "l2-vectors",
  coreRead: [
    {
      title: "VMLS (Boyd & Vandenberghe)",
      url: "https://vmls-book.stanford.edu/vmls.pdf",
      resourceId: "vmls",
      sections: "§1.1–1.4 (vectors, addition, scalar multiplication, inner product) + §3.1–3.4 (norm, distance, angle) — work the inline examples by hand; skip §1.5 and §3.3 on a fast pass (complexity, stdev — they return in l2-random-variables)",
      minutes: 50,
      whySelected: "The only beginner-fit written treatment in the exact applied-ML dialect (norm/distance/angle as data operations) that ships exercises.",
    },
  ],
  practice: [
    { prompt: "Compute dot product, both norms, and the angle for 5 vector pairs by hand — commit each answer on paper BEFORE checking it in NumPy.", minutes: 15 },
    { prompt: "VMLS exercises on inner products, norms, and angle: pick 6 from Ch 1 and Ch 3, plus 2 from the additional-exercises PDF.", source: "https://web.stanford.edu/~boyd/vmls/vmls-additional-exercises.pdf", minutes: 25 },
  ],
  implement: {
    spec: "vectors.py: dot, norm, cosine_similarity, project(a, b) in NumPy from primitives — no @ until each is hand-rolled once. Verify a·b = ‖a‖‖b‖cosθ numerically on 20 random pairs. Then the word-vector toy: rank 10 vectors by cosine similarity to a query.",
    checks: [
      "The cosθ identity holds to numerical tolerance on all 20 random pairs",
      "project(a, b) returns a vector along b, and (a − project(a, b)) · b ≈ 0",
      "The cosine ranking is correctly ordered and you can defend the top hit in one sentence",
    ],
    minutes: 40,
  },
  stuck: {
    alternateRead: {
      title: "3blue1brown.com text lessons (with built-in check questions)",
      url: "https://www.3blue1brown.com/lessons/vectors/",
      sections: "vectors · span — same argument, self-paced, embedded quiz blocks",
      minutes: 25,
    },
    note: "If the geometry isn't landing, do the text lessons' inline questions before re-watching anything; for a draggable geometric view, Immersive Linear Algebra ch 2–3 (http://immersivemath.com/ila/index.html).",
  },
  deepen: [
    { title: "VMLS (Boyd & Vandenberghe)", url: "https://vmls-book.stanford.edu/vmls.pdf", resourceId: "vmls", sections: "Ch 2 §2.1–2.2 (linear functions) — only if hungry; it bridges directly into l2-matrices", minutes: 30 },
    { title: "Dot products and duality — Ch. 9, second pass", url: "https://www.youtube.com/watch?v=LyGKycYT2v0", sections: "re-watch after l2-matrices — the duality argument fully clicks once the transformation view is in place", minutes: 15 },
  ],
  prove: {
    task: "On paper, from nothing: derive proj_b a = ((a·b)/(b·b)) b from the single condition 'the error a − cb is orthogonal to b'. Implement project(a, b) and test it. Then, in ≤5 sentences, explain why attention scores are dot products (query–key similarity).",
    criteria: [
      "Derivation starts from (a − cb)·b = 0 and solves for c — no formula recall",
      "Implementation passes (a − project(a, b))·b ≈ 0 on random pairs",
      "The attention explanation names query–key similarity and reads large/zero/negative scores correctly",
      "No notes, no videos, first honest attempt",
    ],
    minutes: 25,
  },
  transfer: {
    task: "Robotics, no scaffold: a robot at heading h (unit vector) sees an obstacle in direction d, moving with velocity v. Using only dot-product signs and the projection of v onto d, decide: moving toward or away from the obstacle, and how fast?",
    criteria: [
      "Dot-product sign read correctly as toward/away",
      "Closing speed extracted as the scalar component of v along d, with a sane sanity check",
    ],
    minutes: 15,
  },
  retention: "Cold, +7 days: re-derive the projection formula and re-implement cosine_similarity from an empty file (≤10 min). If either stalls, redo the hand-calculation practice set.",
  researchRecord: "docs/curation/l2-vectors.md",
  minutes: 210,
};
