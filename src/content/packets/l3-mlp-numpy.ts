import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l3-mlp-numpy.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l3-mlp-numpy",
  whyNow:
    "The rite of passage: a 2-layer neural network where you wrote every line — vectorized forward AND backward, minibatch loop, your own Adam, gradient-checked before the first real training run. You can backprop scalars; this node is where you survive the scalar→vector leap (Xᵀδ vs δXᵀ, batch-axis sums, silent broadcasting) that drowns most learners. Gold here honestly unlocks PyTorch: after this, frameworks are a convenience, not a mystery.",
  diagnostic: {
    prompt:
      "Cold, on paper: for a 2-layer net (affine → ReLU → affine → softmax-CE), write every parameter gradient with shapes for batch size B, input d, hidden h, classes k; state how you would verify them numerically. There is no skip here — everyone builds this once. (Prior deep-learning veterans certify by rebuilding it in under 90 minutes instead.)",
    minutes: 12,
  },
  coreWatch: [
    {
      title: "Building makemore Part 2: MLP",
      creator: "Andrej Karpathy",
      url: "https://youtu.be/TCH_1BHY58I",
      embedUrl: ytEmbed("https://youtu.be/TCH_1BHY58I"),
      minutes: 76,
      whySelected:
        "Watched as a COMPANION for training discipline — train/dev/test splits, learning-rate sweeps, reading under- vs overfitting — typing along in his idiom. His tensors, your NumPy: the implementation source for this node is you.",
      leaveWith: ["train/dev/test discipline and why the split order matters", "what an lr sweep actually looks like", "under- vs overfitting read straight off the curves"],
    },
  ],
  coreRead: [
    {
      title: "CS231n notes: Minimal neural network case study",
      url: "https://cs231n.github.io/neural-networks-case-study/",
      resourceId: "cs231n",
      sections: "The full case study, pencil + REPL: spiral data, the softmax-CE backward spelled out, the complete vectorized 2-layer NumPy net",
      minutes: 40,
      whySelected: "The closest existing text to this node's exact deliverable — then CLOSE it before implementing. The build must come from you, not from an open reference.",
    },
  ],
  recall: [
    { q: "δ = ŷ − y is the gradient of what, with respect to what?", a: "Softmax-CE loss w.r.t. the logits, per example — divided by batch size when the loss is the batch mean." },
    { q: "With hidden activations H (B×h) and upstream δ (B×k), ∂L/∂W2 is…?", a: "Hᵀδ — shape (h×k) matches W2, and the batch axis contracts away in the matmul." },
    { q: "Why do bias gradients SUM over the batch axis?", a: "b is broadcast to every row in the forward pass — a value used B times sums its B upstream gradients (fan-out summation again)." },
    { q: "Train loss keeps falling, dev loss rises. What is this and what is it not?", a: "Overfitting — a capacity/regularization problem, not an optimization one; if both are high and close you are underfitting instead." },
  ],
  interactiveIds: ["backprop-graph", "gradient-descent"],
  practice: [
    {
      prompt:
        "Re-warm before anything new: skim your own l3-backprop-theory artifacts — the paper matrix derivation and your Value class. No new video needed; this node reuses them.",
      minutes: 10,
    },
    {
      prompt:
        "Instruments: in backprop-graph, run the saturation check — see why zeros or too-large init kills σ/ReLU nets before training starts. In gradient-descent, ride the ravine while choosing the range for your lr sweep.",
      minutes: 10,
    },
    {
      prompt:
        "Node exercise verbatim — the sabotage lab: break the working net five ways on purpose (lr too high; unscaled inputs; dead-ReLU init; wrong CE; transposed W) and write down each failure's signature (loss curve + accuracy + gradient norms) until each is recognizable on sight.",
      minutes: 60,
    },
  ],
  implement: {
    spec:
      "Node implementation verbatim: 2-layer MLP on make_moons → digits/MNIST-class data, all NumPy — forward, vectorized backward, YOUR l3-sgd-optimizers Adam, minibatches, accuracy tracking. Centered finite-difference gradient check on EVERY parameter tensor (rel. err < 1e-6 in float64) BEFORE the first real training run. Train to >95%. Then add L2 + early stopping and show the generalization gap closing (feeds l3-generalization).",
    checks: [
      "Gradient check passes on every parameter tensor before any training happens",
      ">95% accuracy on held-out data",
      "The Adam is your own l3-sgd-optimizers implementation, reused not rewritten",
      "Generalization-gap plot shows L2 + early stopping closing the gap",
    ],
    minutes: 180,
  },
  stuck: {
    alternate: {
      title: "Neural Networks Pt. 3: ReLU In Action!!! (via the StatQuest playlist)",
      creator: "StatQuest (Josh Starmer)",
      url: "https://www.youtube.com/playlist?list=PLjUC8HjyxGTSrn4cZEw9Uw8R0STaRcbYY",
      minutes: 10,
      whySelected: "Only if the piecewise-linear ReLU picture is the blocker — find it in the playlist (direct URL not surfaced at curation time).",
      unverified: true,
    },
    alternateRead: {
      title: "micrograd demo.ipynb — the 2-layer-MLP-on-moons reference at tiny scale",
      url: "https://github.com/karpathy/micrograd",
      sections: "demo.ipynb — reproduce your bug at tiny scale with scalar autograd, isolating logic errors from vectorization errors",
      minutes: 20,
    },
    note:
      "Init/preprocessing bugs: dip into the CS231n neural-networks-2 notes (data preprocessing, weight initialization). Karpathy makemore Part 3 (activations/BatchNorm) is L4 material — do not pull it forward.",
  },
  deepen: [
    {
      title: "Nielsen, Neural Networks and Deep Learning, ch. 1–2",
      url: "http://neuralnetworksanddeeplearning.com",
      sections: "ch. 1–2 — the classic long-form narrative. Read for the story; never run the Python 2 code.",
      minutes: 120,
    },
    {
      title: "CS231n notes: neural-networks-2 and neural-networks-3",
      resourceId: "cs231n",
      sections: "neural-networks-2 (preprocessing, initialization, regularization) as targeted dip-ins for the sabotage lab; neural-networks-3 (training dynamics) ahead of L4",
      minutes: 50,
    },
  ],
  prove: {
    task:
      "Node masteryTest verbatim: blank file → trained 2-layer MLP with gradient-checked backward pass, in one sitting — no AI, no reference open. This node Gold-gates all of PyTorch. (Prior-DL-veteran certification variant: under 90 minutes.)",
    criteria: [
      "Written in one sitting from an empty file — no tutorial, no AI, no old code open",
      "Gradient check passes on every parameter tensor before the first training step",
      "Trains to >95% on your dataset",
      "You can name, for each of the five sabotage signatures, what you would check first",
    ],
    minutes: 90,
  },
  transfer: {
    task:
      "Re-point the SAME code at a different task shape within 15 minutes: 4-class synthetic 'gripper outcome' data (d=6 features → k=4 classes), allowing only dimension/config changes — proving the implementation is a machine, not a script. Then swap tanh ↔ ReLU and re-derive + re-check the one changed backward line.",
    criteria: [
      "Re-pointing needed only config/dimension edits — no surgery on the machinery",
      "The swapped activation's backward line re-derived on paper and gradient-checked fresh",
    ],
    minutes: 25,
  },
  retention:
    "+7 days: re-write the softmax-CE backward (δ = ŷ − y, then Xᵀδ with the batch mean) from memory and gradient-check it fresh. +30 days: the blank-file rebuild again, timed — this certificate is what admits PyTorch (L4).",
  researchRecord: "docs/curation/l3-mlp-numpy.md",
  minutes: 500,
};
