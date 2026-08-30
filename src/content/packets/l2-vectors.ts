import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l2-vectors.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l2-vectors",
  whyNow:
    "Almost everything in machine learning is a vector: states, actions, gradients, embeddings. Attention scores are just dot products. Here you learn to see a vector two ways at once (an arrow in space and an ordered list of numbers) and to read the dot product in its three forms: Σaᵢbᵢ, ‖a‖‖b‖cosθ, and similarity or projection. This is the operation you will use most, and it is your first real NumPy work.",
  diagnostic: {
    prompt:
      "No notes. For a=(3,4), b=(1,0), compute a·b, ‖a‖, and cosθ. Say when a·b is zero, when it is negative, and when it is largest. Show that ‖a‖ = √(a·a). If all of that comes fast and correct, skip ahead to PROVE.",
    minutes: 8,
  },
  coreWatch: [
    {
      title: "Vectors, Essence of Linear Algebra Ch. 1",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=fNk_zzaMoSs"),
      minutes: 10,
      whySelected: "The clearest take on seeing a vector as both an arrow and a list, and it clears up the main confusion in about ten minutes. Answer the recall questions from memory before you move on.",
      leaveWith: ["a vector is ONE object with two views: arrow and coordinate list", "addition = tip-to-tail; scaling = stretch/flip", "coordinates are the recipe in terms of basis vectors"],
    },
    {
      title: "Linear combinations, span, and basis vectors, Ch. 2",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=k7RM-ot2NWY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=k7RM-ot2NWY"),
      minutes: 10,
      whySelected: "The span and basis words that every later node leans on. Ten minutes now, and it sets up l2-linear-maps.",
      leaveWith: ["span of {a,b} = all combinations c₁a + c₂b", "two vectors fail to span the plane exactly when they line up"],
    },
    {
      title: "Dot products and duality, Ch. 9",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=LyGKycYT2v0",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=LyGKycYT2v0"),
      minutes: 15,
      whySelected: "Save this for after the practice below, not before. It shows why the algebraic and geometric dot products give the same number, through the idea of duality. It leans on the transformation view, so if it only half-clicks, re-watch it after l2-matrices.",
      leaveWith: ["why Σaᵢbᵢ and ‖a‖‖b‖cosθ are the same number", "dotting with b IS projecting onto b's line (times ‖b‖)"],
      unverified: true,
    },
  ],
  recall: [
    { q: "State both views of a vector and what connects them.", a: "An arrow from the origin AND an ordered list of numbers; the coordinates are the arrow's components along the basis vectors, addition and scaling work identically in both views." },
    { q: "Define the span of {a, b}. When do two vectors fail to span the plane?", a: "All linear combinations c₁a + c₂b; they fail when linearly dependent, one is a scalar multiple of the other, and the span collapses to a line." },
    { q: "a·b < 0 tells you what, instantly?", a: "The vectors point more than 90° apart (cosθ < 0)." },
    { q: "Write proj_b a and name the two classic traps.", a: "proj_b a = ((a·b)/(b·b)) b, a vector ALONG b. Traps: swapping the roles of a and b, and dropping the b·b denominator." },
  ],
  interactiveIds: ["vector-playground"],
  lessonId: "l2-vectors",
  coreRead: [
    {
      title: "VMLS (Boyd & Vandenberghe)",
      url: "https://vmls-book.stanford.edu/vmls.pdf",
      resourceId: "vmls",
      sections: "§1.1–1.4 (vectors, addition, scalar multiplication, inner product) + §3.1–3.4 (norm, distance, angle), work the inline examples by hand; skip §1.5 and §3.3 on a fast pass (complexity, stdev, they return in l2-random-variables)",
      minutes: 50,
      whySelected: "The one beginner-friendly written source that speaks in plain applied-ML terms (norm, distance, and angle as things you do to data) and comes with exercises.",
    },
  ],
  practice: [
    { prompt: "By hand, for 5 vector pairs, compute the dot product, both norms, and the angle. Write each answer on paper before you check it in NumPy.", minutes: 15 },
    { prompt: "VMLS exercises on inner products, norms, and angle: pick 6 from Ch 1 and Ch 3, plus 2 from the additional-exercises PDF.", source: "https://web.stanford.edu/~boyd/vmls/vmls-additional-exercises.pdf", minutes: 25 },
  ],
  implement: {
    spec: "In vectors.py, write dot, norm, cosine_similarity, and project(a, b) in NumPy from scratch. Do not use @ until you have hand-rolled each one at least once. Check that a·b = ‖a‖‖b‖cosθ on 20 random pairs. Then a small word-vector toy: rank 10 vectors by cosine similarity to a query.",
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
      sections: "vectors · span, same argument, self-paced, embedded quiz blocks",
      minutes: 25,
    },
    note: "If the geometry isn't clicking, work the text lessons' inline questions before you re-watch anything. For a version you can drag around, see Immersive Linear Algebra ch 2–3 (http://immersivemath.com/ila/index.html).",
  },
  deepen: [
    { title: "VMLS (Boyd & Vandenberghe)", url: "https://vmls-book.stanford.edu/vmls.pdf", resourceId: "vmls", sections: "Ch 2 §2.1–2.2 (linear functions), only if hungry; it bridges directly into l2-matrices", minutes: 30 },
    { title: "Dot products and duality, Ch. 9, second pass", url: "https://www.youtube.com/watch?v=LyGKycYT2v0", sections: "re-watch after l2-matrices, the duality argument fully clicks once the transformation view is in place", minutes: 15 },
  ],
  prove: {
    task: "On paper, starting from nothing, derive proj_b a = ((a·b)/(b·b)) b using one condition: the error a − cb is at a right angle to b. Then implement project(a, b) and test it. In 5 sentences or fewer, explain why attention scores are dot products (query and key similarity).",
    criteria: [
      "Your derivation starts from (a − cb)·b = 0 and solves for c, without recalling the formula",
      "Implementation passes (a − project(a, b))·b ≈ 0 on random pairs",
      "The attention explanation names query and key similarity, and reads large, zero, and negative scores correctly",
      "No notes, no videos, first honest attempt",
    ],
    minutes: 25,
  },
  transfer: {
    task: "A robotics problem, no hints. A robot at heading h (a unit vector) sees an obstacle in direction d, moving with velocity v. Using only the sign of the dot product and the projection of v onto d, decide two things: is it moving toward or away from the obstacle, and how fast?",
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
