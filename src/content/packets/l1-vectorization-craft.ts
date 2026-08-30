import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l1-vectorization-craft.md (live-verified 2026-08-21).
// Curation correction carried through: From Python to NumPy has NO gradient-descent case
//, the worked cases are Game of Life, Mandelbrot, boids.

export const packet: LearningPacket = {
  nodeId: "l1-vectorization-craft",
  whyNow:
    "You know the NumPy rules. Now you build the habit of thinking in arrays, so you can reshape a problem until the loops fall away and read einsum like plain text. That habit is what lets you write your own batched PyTorch code instead of copying someone else's.",
  diagnostic: {
    prompt:
      "Read np.einsum('ij,jk->ik', A, B) aloud. Now read np.einsum('bij,bjk->bik', A, B); what does it do? Then, in under 3 minutes, vectorize [x*x for x in xs] and a running sum.",
    minutes: 8,
  },
  coreRead: [
    {
      title: "From Python to NumPy, ch. 4 Code vectorization",
      url: "https://www.labri.fr/perso/nrougier/from-python-to-numpy/",
      resourceId: "py2numpy",
      sections: "Introduction + Uniform vectorization: THE Game of Life build (Python impl → NumPy impl), worked line-by-line AT THE KEYBOARD (~45 min) · Temporal vectorization: Mandelbrot + faster variant, as a read (~15 min) · Spatial vectorization: boids, as a skim (~5 min)",
      minutes: 65,
      whySelected:
        "The one resource that teaches the reformulation move through full, honest case studies. Its own chapter split (code versus problem vectorization) names exactly the gap this node closes.",
    },
    {
      title: "A basic introduction to NumPy's einsum, ajcr",
      url: "https://ajcr.net/Basic-guide-to-einsum/",
      sections: "Full guide, label-the-axes pedagogy, building from ('i,i->i') upward; note the closing point on einsum's speed/memory edge over temporary-array broadcasting",
      minutes: 15,
      whySelected: "The go-to einsum starting point. It turns cryptic-looking magic into three plain rules in 15 minutes.",
    },
  ],
  recall: [
    { q: "Rougier's split: code vectorization vs problem vectorization?", a: "Code vectorization translates an existing loop structure into array ops; problem vectorization rethinks the problem itself so an array formulation exists, the hard move, and the valuable one." },
    { q: "How does the Game of Life count neighbors with zero loops?", a: "Sum eight shifted slices of the grid over the interior (Z[:-2,:-2] + Z[:-2,1:-1] + …), neighbor access becomes whole-array shifted addition." },
    { q: "The three einsum rules?", a: "A repeated index across inputs means multiply along it; an index omitted from the output means sum over it; an index kept in the output is a preserved axis." },
    { q: "np.einsum('ij,ij->i', A, A) computes what?", a: "Row-wise squared norms: elementwise multiply (ij on both inputs), sum over j, keep i." },
    { q: "Why can einsum beat broadcasting-then-sum on memory?", a: "Broadcast-then-sum materializes the full intermediate (e.g. (n,n,n)) before reducing; einsum fuses the multiply and the sum without the giant temporary." },
  ],
  practice: [
    {
      prompt:
        "Node exercise, closed book. Write one Conway's Game of Life step with zero loops, without reopening the book (your own notes are fine). Check it against a plain loop version on random grids.",
      minutes: 25,
    },
    {
      prompt: "Node exercise. Evaluate many polynomials at many points at once using a Vandermonde matrix, with no loops.",
      minutes: 20,
    },
    {
      prompt:
        "numpy-100 exercises #58 (subtract row means), #64/#65 (index accumulation with np.add.at, where naive vectorization quietly fails), #67 (sum over last two axes at once), #71 ((5,5,3)×(5,5)), #78 (point-to-lines distances), #87 (4×4 block-sum), #97 (einsum versions of inner/outer/sum/mul).",
      source: "https://github.com/rougier/numpy-100",
      minutes: 40,
    },
    {
      prompt: "%timeit every solution above against its loop version and write down the ratio. A speed claim with no measurement does not count.",
      minutes: 10,
    },
  ],
  implement: {
    spec: "matmul_three_ways.py, the node's centerpiece. Write matrix multiply three ways: (1) triple loop; (2) broadcasting+sum, (A[:,:,None]*B[None,:,:]).sum(axis=1); (3) np.einsum('ij,jk->ik', A, B). assert np.allclose across all three, then %timeit all three at n in {50, 200, 500} and record the table.",
    checks: [
      "np.allclose agreement across all three at every size",
      "Timing table recorded; the trend across n explained in one sentence",
      "You can point at the exact expression that allocates the (n,n,n) temporary",
    ],
    minutes: 35,
  },
  derive: {
    spec: "On paper, work out why the broadcast version builds an (n,n,n) intermediate while einsum('ij,jk->ik') does not. Write the shapes of A[:,:,None], B[None,:,:], their product, and the summed axis. Name the einsum rule that fuses the multiply and the sum. Estimate the temporary's size in MB at n=500, float64.",
    checks: [
      "Shape chain written explicitly, ending at (n,n) both ways",
      "Memory estimate correct to the order of magnitude (n=500 float64 ⇒ ~1 GB)",
    ],
    minutes: 10,
  },
  stuck: {
    alternate: {
      title: "Einsum Is All You Need: NumPy, PyTorch and TensorFlow",
      creator: "Aladdin Persson",
      url: "https://www.youtube.com/watch?v=pkVwUVEHmfI",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=pkVwUVEHmfI"),
      minutes: 20,
      whySelected: "A visual walkthrough of the notation across all three frameworks, for when the written guide doesn't land. Duration unverified at curation.",
      unverified: true,
    },
    note: "If the Game of Life shifted slices are not clicking, count the neighbors on a 4×4 grid by hand, then reread the book's NumPy section (alternate rendering of ch. 4: lhoupert.fr/test-jbook/04-code-vectorization.html).",
  },
  deepen: [
    {
      title: "From Python to NumPy, ch. 5 Problem vectorization",
      url: "https://www.labri.fr/perso/nrougier/from-python-to-numpy/",
      resourceId: "py2numpy",
      sections: "Path finding (Bellman-Ford, foreshadows value iteration at L10) · fluid dynamics · blue noise sampling; plus ch. 4's Gray-Scott reaction-diffusion exercise if the itch exists",
      minutes: 90,
    },
    {
      title: "Einsum is All you Need, Einstein Summation in Deep Learning (Rocktäschel, 2018)",
      url: "https://rockt.ai/2018/04/30/einsum",
      sections: "einsum in numpy/PyTorch/TF with deep-learning model examples, the bridge from this node to L3+; wait until DL context exists",
      minutes: 25,
    },
  ],
  prove: {
    task: "Node mastery test. Take an unseen simulation kernel (loop version provided) and vectorize it to a ≥50× speedup with allclose-identical output. Say the reformulation out loud first (which axes exist, what each dimension means), before you write any code.",
    criteria: [
      "Reformulation said aloud before the first line of code",
      "np.allclose against the provided loop version on random inputs",
      "≥50× speedup measured with %timeit and recorded",
      "No reference material open; your own notes only",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Two transfers into new problem families. (1) Vectorize the P1 projectile parameter sweep: all K launch angles as one axis, states integrated together as (K,2) arrays, with no Python loop over angles. (2) Rewrite l1-control-flow's 10,000-dice-rolls histogram with zero loops (np.random + np.bincount).",
    criteria: [
      "Sweep results allclose-match the one-angle-at-a-time loop version",
      "Both solved as fresh reformulations, different problem families from the ones you practiced",
    ],
    minutes: 25,
  },
  retention:
    "Day +10, from memory: pairwise distance matrix via broadcasting AND via einsum (the 'ij,ij->i' squared-norm trick), allclose-checked against each other; then read 3 unseen einsum strings aloud, one of them batched.",
  researchRecord: "docs/curation/l1-vectorization-craft.md",
  minutes: 280,
};
