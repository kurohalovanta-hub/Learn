import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l1-numpy.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l1-numpy",
  whyNow:
    "Every tensor you feed a network follows the rules you learn here. A NumPy array is the PyTorch tensor model with a different import. Learn to predict shapes, broadcasting, axes, and views vs copies cold now, and batched deep-learning code stops being something you copy and starts being something you write.",
  diagnostic: {
    prompt:
      "Cold, on paper first: shape of (3,1)+(1,4)? Shape of (3,)+(3,1)? What does A[boolean mask] return? Does a[2:5] copy? Commit to answers, then prove each in the REPL.",
    minutes: 8,
  },
  orient: {
    title: "NumPy Explained in 8 Minutes | ndarrays, Vectorization, Broadcasting & Memory",
    creator: "Channel unverified",
    url: "https://www.youtube.com/watch?v=miOWA8VHkt0",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=miOWA8VHkt0"),
    minutes: 8,
    whySelected:
      "It shows why NumPy is fast by walking through memory layout, and it is short. Prefer reading? Skim Jay Alammar's picture-first Visual Intro instead (jalammar.github.io/visual-numpy, ~10 min).",
    leaveWith: [
      "an ndarray is one homogeneous typed block, not a list of lists",
      "shape/dtype/strides are the whole mental model",
      "vectorization = whole-array operations in C, not a syntax trick",
    ],
    unverified: true,
  },
  coreRead: [
    {
      title: "NumPy: the absolute basics for beginners",
      url: "https://numpy.org/doc/stable/user/absolute_beginners.html",
      resourceId: "numpy-docs",
      sections: "Full page (28 sections incl. indexing/slicing, broadcasting, axis in reductions, newaxis/expand_dims), type and vary every snippet",
      minutes: 60,
      whySelected: "First-party and current (v2.5); covers every node objective. Reading alone builds recognition; typing and varying builds prediction.",
    },
    {
      title: "Broadcasting",
      url: "https://numpy.org/doc/stable/user/basics.broadcasting.html",
      resourceId: "numpy-docs",
      sections: "Full page, including the closing vector-quantization/distance worked example",
      minutes: 10,
      whySelected: "The authority on the two rules. Its closing example is exactly this node's k-nearest mastery pattern, and you will have to reproduce the move cold.",
    },
    {
      title: "Indexing on ndarrays",
      url: "https://numpy.org/doc/stable/user/basics.indexing.html",
      resourceId: "numpy-docs",
      sections: "Basic indexing (views) · Integer array indexing · Boolean array indexing. Defer 'Combining advanced and basic', flat iterator, field access.",
      minutes: 15,
    },
    {
      title: "Copies and views",
      url: "https://numpy.org/doc/stable/user/basics.copies.html",
      resourceId: "numpy-docs",
      sections: "Full page, basic index ⇒ view, advanced index ⇒ copy, and the .base test",
      minutes: 4,
      whySelected: "Shortest highest-value read in the packet; kills mutation-at-a-distance bugs before they happen.",
    },
    {
      title: "NumPy quickstart",
      url: "https://numpy.org/doc/stable/user/quickstart.html",
      resourceId: "numpy-docs",
      sections: "Shape manipulation only (reshape/ravel/stacking), the rest duplicates absolute basics",
      minutes: 10,
    },
  ],
  recall: [
    { q: "np.sum(A, axis=0) on a (3,4) array, result shape, and which way does the operation move?", a: "(4,). The named axis DISAPPEARS from the shape: you collapse along rows, i.e. operate down each column, not 'on each row'." },
    { q: "State the broadcasting procedure exactly.", a: "Align shapes right-to-left (missing dims count as 1); two dims are compatible iff equal or one is 1; the result takes the larger along each axis." },
    { q: "a[2:5] vs a[[2,3,4]], which is a view, which a copy, and how do you prove it?", a: "Basic slicing a[2:5] is a view; integer (fancy) indexing copies. Check .base, a view's .base is the original array, or mutate and watch." },
    { q: "Shape of (3,) + (3,1), and why is it a classic silent bug?", a: "(3,3): the (3,) acts as (1,3) and broadcasts against (3,1) into an outer-product-shaped result, no error, wrong answer." },
    { q: "What does keepdims=True buy you in x.mean(axis=1)?", a: "Result shape (n,1) instead of (n,), so it broadcasts straight back against x for centering/standardizing without a reshape." },
  ],
  practice: [
    {
      prompt:
        "The node's 15 predict-then-run broadcasting expressions. For each, write the predicted result shape (or 'error') before running (mix (n,), (n,1), (1,n) and 3-D operands), then verify in the REPL and pick apart every miss.",
      minutes: 25,
    },
    {
      prompt:
        "numpy-100 exercises #25 (in-place boolean negate), #37 (5×5 row values, broadcasting), #44 (cartesian→polar), #52 (point-by-point distances), #58 (subtract row means, axis + keepdims), #64 (add via index vector), #71 ((5,5,3)×(5,5), the newaxis test). Predict shapes before running; hints and solution variants live in the repo.",
      source: "https://github.com/rougier/numpy-100",
      minutes: 60,
    },
    {
      prompt: "Image as array: load a picture, then crop, flip, and channel-swap it with pure indexing, no loops.",
      minutes: 25,
    },
  ],
  implement: {
    spec: "distances.py: pairwise distance matrix of N random 2-D points three ways: double loop, single loop over rows, fully broadcast ((N,1,2)−(1,N,2), square, sum, sqrt). assert np.allclose across all three, then %timeit each at N=1000 and write the ratios into a comment.",
    checks: [
      "All three agree via np.allclose",
      "Timings recorded; you can state the loop→broadcast speedup ratio from memory",
      "You can say where the (N,N,2) temporary comes from and what it costs in memory",
    ],
    minutes: 45,
  },
  derive: {
    spec: "On paper, using only the two broadcasting rules: show why (N,1,2)−(1,N,2) has shape (N,N,2), writing the right-to-left alignment explicitly. Then state the shapes after **2, .sum(axis=-1), and sqrt.",
    checks: [
      "Each rule application written out, not asserted",
      "The full chain (N,1,2)→(N,N,2)→(N,N) reproduced without running code",
    ],
    minutes: 10,
  },
  stuck: {
    alternate: {
      title: "Learn NumPy broadcasting in 6 minutes!",
      creator: "Channel unverified",
      url: "https://www.youtube.com/watch?v=P67wiuTx7l0",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=P67wiuTx7l0"),
      minutes: 6,
      whySelected: "Single-topic refresher for when the rules read fine but don't stick.",
      unverified: true,
    },
    alternateRead: {
      title: "Numpy Sum Axis Intuition, Aerin Kim",
      url: "https://medium.com/intuitionmath/numpy-sum-axis-intuition-6eb94926a5d1",
      sections: "Full article, the classic 'axis collapses the named dimension' reframe, written against the exact wrong prior",
      minutes: 8,
    },
    note: "Axis still fuzzy: read Kim's collapse framing, then draw a (2,3) array and physically cross out the collapsed dimension. Broadcasting still fuzzy: the 6-minute video, then Sharp Sight's axes-are-directions article (sharpsight.ai/blog/numpy-axes-explained).",
  },
  deepen: [
    {
      title: "From Python to NumPy, Anatomy of an array",
      url: "https://www.labri.fr/perso/nrougier/from-python-to-numpy/",
      resourceId: "py2numpy",
      sections: "'Anatomy of an array' chapter: strides, why views are free (source mirror: github.com/rougier/from-python-to-numpy)",
      minutes: 30,
    },
    {
      title: "Indexing on ndarrays, deferred sections",
      url: "https://numpy.org/doc/stable/user/basics.indexing.html",
      resourceId: "numpy-docs",
      sections: "'Combining advanced and basic indexing', flat iterator, field access, the day a real use case appears",
      minutes: 15,
    },
  ],
  prove: {
    task: "Node mastery test, references closed: vectorize three loop-based routines (moving average, standardize-by-column, k-nearest by distance matrix) with zero Python loops and outputs matching the loop versions. The broadcasting doc's vector-quantization example is the same pattern, so do this without reopening it.",
    criteria: [
      "Zero Python loops: no for/while, no comprehensions over array data",
      "np.allclose match against straight loop implementations for all three",
      "Every intermediate shape predicted aloud before running",
      "Done without reopening the broadcasting doc or any reference",
    ],
    minutes: 40,
  },
  transfer: {
    task: "Given an (H,W,3) image array, standardize each channel to zero mean and unit std using only broadcasting, taking per-channel stats via axis=(0,1) with keepdims. New data, same rules. Predict every intermediate shape before running.",
    criteria: [
      "Per-channel mean ≈ 0 and std ≈ 1 verified with a reduction afterward",
      "Every intermediate shape written down before execution, no guess-and-check",
    ],
    minutes: 20,
  },
  retention:
    "Day +7: 10 fresh shape-prediction expressions mixing (n,), (n,1), (1,n) and 3-D; explain axis=0 with a drawing; answer 'does a[2:5] copy? does a[[2,3,4]]?', all from memory, then verify with .base.",
  researchRecord: "docs/curation/l1-numpy.md",
  minutes: 340,
};
