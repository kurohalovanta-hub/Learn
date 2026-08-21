import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l3-backprop-theory.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l3-backprop-theory",
  whyNow:
    "Backprop is the one derivation you must own before frameworks are allowed to hide it: the chain rule organized as bookkeeping over a graph — forward values, local gradient × upstream gradient at every edge, SUM at fan-out. Nothing more, nothing mystical. Every .backward() you will ever call is this. Warning: backprop explanations are so good in 2026 that 'I get it' arrives about two hours before 'I can do it' — this packet is sequenced so the manual derivation happens before the lecture can hand you the answer.",
  diagnostic: {
    prompt:
      "Cold: for L = (σ(wx+b) − y)², draw the computational graph and compute ∂L/∂w at (w,b,x,y) = (0.8, −0.5, 1.5, 1) numerically. Then: why does a node used twice SUM its gradients, and what is ∂L/∂W's shape for W (m×n)?",
    minutes: 10,
  },
  orient: {
    title: "The Essential Main Ideas of Neural Networks (Pt. 1)",
    creator: "StatQuest (Josh Starmer)",
    url: "https://www.youtube.com/watch?v=CqOfi41LfDw",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=CqOfi41LfDw"),
    minutes: 16,
    whySelected:
      "Pt. 2 builds directly on this video's running example — watching Pt. 2 without it strands you. Run at 1.5× if the L2 lessons already built the picture.",
    leaveWith: ["a tiny network as a concrete function you can evaluate by hand", "the running example Pt. 2 will differentiate"],
    unverified: true,
  },
  coreWatch: [
    {
      title: "Neural Networks Pt. 2: Backpropagation Main Ideas",
      creator: "StatQuest (Josh Starmer)",
      url: "https://www.youtube.com/watch?v=IN2XmBhILt4",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=IN2XmBhILt4"),
      minutes: 16,
      whySelected:
        "The mental unlock: the derivative of the loss with respect to ONE parameter, chain-rule link by link on a visible tiny network, then gradient descent actually using it.",
      leaveWith: ["loss → parameter derivative as a product of local links", "gradient descent consumes exactly this number", "backprop is exact bookkeeping, not approximation"],
      unverified: true,
    },
    {
      title: "The spelled-out intro to neural networks and backpropagation: building micrograd",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=VMj-3S1tku0",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=VMj-3S1tku0"),
      minutes: 145,
      whySelected:
        "Open ONLY after the manual-derivation practice below is done — this is the implementation phase, not a lecture to watch passively. Eight years of distilling how to teach backprop, per the author; you type every line, never letting it play past code you have not typed.",
      leaveWith: ["a Value class with backward() you typed yourself", "local gradient × upstream gradient, summed at fan-out — now in code", "a trained tiny net whose gradients you can defend"],
    },
  ],
  recall: [
    { q: "At any edge of the graph, the backward rule is…?", a: "Gradient flowing down = local gradient (of that node's output w.r.t. that input) × upstream gradient (of the loss w.r.t. the node's output)." },
    { q: "A forward value feeds two consumers. What happens on the way back?", a: "Its gradients from both paths ADD — the multivariable chain rule sums over paths; gradients add at forks." },
    { q: "Why must the forward pass cache its values?", a: "Local gradients are functions of them — e.g. sigmoid's σ′ = a(1−a) — so the backward pass is only cheap if forward values are stored." },
    { q: "StatQuest derives the loss derivative for one parameter with the rest frozen. What does that buy?", a: "The chain rule visible link by link — one clean product from loss back to the parameter — and the exact number gradient descent then steps with." },
  ],
  interactiveIds: ["backprop-graph"],
  lessonId: "l3-backprop-theory",
  coreRead: [
    {
      title: "CS231n notes: Backpropagation, Intuitions (optimization-2)",
      url: "https://cs231n.github.io/optimization-2/",
      resourceId: "cs231n",
      sections: "Full notes, with pencil: real-valued circuits, gate-level local gradients, gradients-add-at-forks, the staged sigmoid example",
      minutes: 35,
      whySelected: "The only short written source teaching the exact local-gradient × upstream + sum-at-forks discipline this node's exercises and widget encode.",
    },
  ],
  practice: [
    {
      prompt:
        "Node exercise verbatim, BEFORE the micrograd lecture: draw the full graph for L = (σ(wx+b) − y)², annotate EVERY edge's local gradient symbolically, backprop concrete numbers through it by hand, then verify against a finite-difference checker you write yourself.",
      minutes: 45,
    },
    {
      prompt:
        "Rebuild the same one-neuron graph in the backprop-graph instrument and check every edge against your hand derivation. Then set z > 4 and watch ∂L/∂w die through σ′ = a(1−a) — saturation, seen live. The widget checks your derivation; it never replaces it.",
      minutes: 15,
    },
  ],
  implement: {
    spec:
      "Node implementation verbatim, with the micrograd lecture typed line-for-line: Value class with +, ×, tanh and backward(). Do the lecture-description exercises, then CLOSE the video and rebuild engine.py blind. Train the 2-neuron net from the node spec with your own engine and verify every parameter gradient against your finite-difference checker.",
    checks: [
      "engine.py rebuilt blind — video closed, micrograd repo not open",
      "Your engine's gradients match centered finite differences on random small graphs",
      "The 2-neuron net's loss demonstrably falls using only your backward()",
    ],
    minutes: 95,
  },
  stuck: {
    alternate: {
      title: "Backpropagation, intuitively | Deep Learning Chapter 3",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=Ilg3gGewQ5U"),
      minutes: 15,
      whySelected: "Watch AFTER a failed manual attempt, then re-attempt — it must explain a derivation you tried, not replace one. Ch. 4 'Backpropagation calculus' follows via the series playlist.",
      unverified: true,
    },
    alternateRead: {
      title: "micrograd written walkthrough (step-by-step text companion to the lecture)",
      url: "https://medium.com/@nico_X/micrograd-the-spelled-out-intro-to-neural-networks-and-backprop-written-walkthrough-a7a6532ff3a4",
      sections: "The sections covering the step you are stuck on — read alongside your own typed code",
      minutes: 25,
    },
    note:
      "3B1B ch. 4 'Backpropagation calculus' is reached via the series playlist: https://www.youtube.com/playlist?list=PLZZWrBYkx7Otcjr3eCLZDCgfpqnxMY29s. If the DIAGNOSTIC's chain-rule step stumbled, repair first with StatQuest 'The Chain Rule, Clearly Explained!!!' (~18 min): https://www.youtube.com/watch?v=wl1myxrtQHQ.",
  },
  deepen: [
    {
      title: "Nielsen, Neural Networks and Deep Learning, ch. 2",
      url: "http://neuralnetworksanddeeplearning.com",
      sections: "How the backpropagation algorithm works — the four-equation δ-form that bridges to this node's vectorized masteryTest. Read the math; ignore the Python 2 code.",
      minutes: 40,
    },
    {
      title: "StatQuest Backpropagation Details Pt. 2: Going bonkers with The Chain Rule",
      url: "https://www.youtube.com/watch?v=GKZoOHXGcLo",
      sections: "The full numeric grind across ALL parameters (Pt. 1, 'Optimizing 3 parameters simultaneously', precedes it in the same playlist)",
      minutes: 30,
    },
    {
      title: "micrograd repository: trace_graph.ipynb",
      url: "https://github.com/karpathy/micrograd",
      sections: "trace_graph.ipynb — render your own Value graphs and inspect every stored gradient",
      minutes: 15,
    },
  ],
  prove: {
    task:
      "Node masteryTest verbatim: on paper, backprop a 2-layer network in matrix form from loss to ALL parameters — produce ∂L/∂W1, ∂L/∂b1, ∂L/∂W2, ∂L/∂b2 with correct shapes. Then make your scalar autograd reproduce the same numbers on a tiny instance. No AI.",
    criteria: [
      "Every gradient's shape stated before computing it, and each matches its parameter's shape",
      "The δ recursion derived on the spot from the scalar chain rule — not recalled",
      "Your engine's numbers agree with the paper derivation on the tiny instance",
      "No AI assistance at any step — heavy-AI work caps this claim below Gold",
    ],
    minutes: 40,
  },
  transfer: {
    task:
      "Add a NEW op to your Value class that the lecture never implemented (e.g. ReLU and division, or log): write forward + backward and prove them with your finite-difference checker. Then explain, using a shared-weight two-path example, why fan-out MUST sum — this is the residual-connection / weight-tying question in disguise.",
    criteria: [
      "The new op's backward passes the finite-difference check, not an eyeball test",
      "The two-path example makes summation necessary, and you connect it explicitly to weight sharing and residual wiring",
    ],
    minutes: 30,
  },
  retention:
    "+7 days: cold-answer the node diagnostic — why fan-out sums, and ∂L/∂W's shape for W (m×n). +30 days: re-derive δ^(l) = (W^(l+1)ᵀ δ^(l+1)) ⊙ f′(z^(l)) from the scalar chain rule in under 15 minutes.",
  researchRecord: "docs/curation/l3-backprop-theory.md",
  minutes: 445,
};
