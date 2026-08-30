import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l3-mlp-numpy.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l3-mlp-numpy",
  whyNow:
    "Here you build a 2-layer neural network where you write every line: vectorized forward and backward, a minibatch loop, your own Adam, gradient-checked before the first real training run. You can already backprop scalars. This is where you make the jump to vectors (Xᵀδ vs δXᵀ, batch-axis sums, quiet broadcasting), the step that trips up most people. Get this right and PyTorch stops being a mystery; frameworks become a convenience you actually understand.",
  diagnostic: {
    prompt:
      "Cold, on paper: for a 2-layer net (affine → ReLU → affine → softmax-CE), write every parameter gradient with shapes for batch size B, input d, hidden h, classes k, and say how you would check them numerically. There is no skipping this; everyone builds it once. (If you have done deep learning before, you can certify instead by rebuilding it in under 90 minutes.)",
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
        "Watch this as a companion for training discipline: train/dev/test splits, learning-rate sweeps, and reading under- vs overfitting, typing along in his idiom. He uses tensors; you write NumPy. The implementation for this node comes from you.",
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
      whySelected: "This is the closest existing text to what you have to build here. Read it, then CLOSE it before you implement. The build has to come from you, not from an open reference.",
    },
  ],
  recall: [
    { q: "δ = ŷ − y is the gradient of what, with respect to what?", a: "Softmax-CE loss w.r.t. the logits, per example, divided by batch size when the loss is the batch mean." },
    { q: "With hidden activations H (B×h) and upstream δ (B×k), ∂L/∂W2 is…?", a: "Hᵀδ, shape (h×k) matches W2, and the batch axis contracts away in the matmul." },
    { q: "Why do bias gradients SUM over the batch axis?", a: "b is broadcast to every row in the forward pass, a value used B times sums its B upstream gradients (fan-out summation again)." },
    { q: "Train loss keeps falling, dev loss rises. What is this and what is it not?", a: "Overfitting, a capacity/regularization problem, not an optimization one; if both are high and close you are underfitting instead." },
  ],
  interactiveIds: ["backprop-graph", "gradient-descent"],
  practice: [
    {
      prompt:
        "Warm up before anything new: skim your own l3-backprop-theory artifacts, the paper matrix derivation and your Value class. No new video needed; this node reuses them.",
      minutes: 10,
    },
    {
      prompt:
        "In backprop-graph, run the saturation check and see why all-zero or too-large init kills σ/ReLU nets before training even starts. In gradient-descent, ride the ravine while you pick the range for your lr sweep.",
      minutes: 10,
    },
    {
      prompt:
        "The sabotage lab: take the working net and break it five ways on purpose (lr too high; unscaled inputs; dead-ReLU init; wrong CE; transposed W). Write down each failure's signature (loss curve, accuracy, gradient norms) until you can recognize each one on sight.",
      minutes: 60,
    },
  ],
  implement: {
    spec:
      "Build a 2-layer MLP on make_moons, then on digits/MNIST-class data, all in NumPy: forward, vectorized backward, YOUR l3-sgd-optimizers Adam, minibatches, accuracy tracking. Run a centered finite-difference gradient check on EVERY parameter tensor (rel. err < 1e-6 in float64) BEFORE the first real training run. Train to >95%. Then add L2 and early stopping and show the generalization gap closing (this feeds l3-generalization).",
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
      whySelected: "Only if the piecewise-linear ReLU picture is what's blocking you. Find it in the playlist (the direct URL wasn't surfaced at curation time).",
      unverified: true,
    },
    alternateRead: {
      title: "micrograd demo.ipynb, the 2-layer-MLP-on-moons reference at tiny scale",
      url: "https://github.com/karpathy/micrograd",
      sections: "demo.ipynb, reproduce your bug at tiny scale with scalar autograd, isolating logic errors from vectorization errors",
      minutes: 20,
    },
    note:
      "For init or preprocessing bugs, dip into the CS231n neural-networks-2 notes (data preprocessing, weight initialization). Karpathy makemore Part 3 (activations/BatchNorm) is L4 material; do not pull it forward.",
  },
  deepen: [
    {
      title: "Nielsen, Neural Networks and Deep Learning, ch. 1–2",
      url: "http://neuralnetworksanddeeplearning.com",
      sections: "ch. 1–2, the classic long-form narrative. Read for the story; never run the Python 2 code.",
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
      "From a blank file to a trained 2-layer MLP with a gradient-checked backward pass, in one sitting, with no AI and no reference open. Getting Gold here is what opens all of PyTorch. (If you have done deep learning before, the certification variant is under 90 minutes.)",
    criteria: [
      "Written in one sitting from an empty file, with no tutorial, no AI, and no old code open",
      "Gradient check passes on every parameter tensor before the first training step",
      "Trains to >95% on your dataset",
      "For each of the five sabotage signatures, you can name what you would check first",
    ],
    minutes: 90,
  },
  transfer: {
    task:
      "Point the SAME code at a different task shape within 15 minutes: 4-class synthetic 'gripper outcome' data (d=6 features → k=4 classes), changing only dimensions and config. If it works, you built a machine, not a one-off script. Then swap tanh for ReLU and re-derive and re-check the one backward line that changed.",
    criteria: [
      "Re-pointing needed only config/dimension edits, no surgery on the machinery",
      "The swapped activation's backward line re-derived on paper and gradient-checked fresh",
    ],
    minutes: 25,
  },
  retention:
    "+7 days: re-write the softmax-CE backward (δ = ŷ − y, then Xᵀδ with the batch mean) from memory and gradient-check it fresh. +30 days: the blank-file rebuild again, timed, this certificate is what admits PyTorch (L4).",
  researchRecord: "docs/curation/l3-mlp-numpy.md",
  minutes: 500,
};
