import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l3-backprop-theory.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l3-backprop-theory",
  whyNow:
    "Backprop is the one derivation you should own before a framework hides it for you. It is the chain rule kept as bookkeeping over a graph: forward values, then local gradient × upstream gradient at every edge, summed wherever a value fans out. Every .backward() you will ever call is exactly this. One warning. Backprop explanations are so clear now that 'I get it' shows up about two hours before 'I can do it,' so this packet has you derive it by hand before any lecture can hand you the answer.",
  diagnostic: {
    prompt:
      "No notes. For L = (σ(wx+b) − y)², draw the computational graph and compute ∂L/∂w at (w,b,x,y) = (0.8, −0.5, 1.5, 1) as a number. Then answer two things: why does a node used twice SUM its gradients, and what is ∂L/∂W's shape for W (m×n)?",
    minutes: 10,
  },
  orient: {
    title: "The Essential Main Ideas of Neural Networks (Pt. 1)",
    creator: "StatQuest (Josh Starmer)",
    url: "https://www.youtube.com/watch?v=CqOfi41LfDw",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=CqOfi41LfDw"),
    minutes: 16,
    whySelected:
      "Pt. 2 builds straight on this video's running example, so skipping it leaves you lost there. Run it at 1.5× if the L2 lessons already gave you the picture.",
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
        "This is where it clicks. You take the derivative of the loss with respect to ONE parameter, chain-rule link by link on a tiny network you can see, then watch gradient descent use that number.",
      leaveWith: ["the loss-to-parameter derivative as a product of local links", "the exact number gradient descent then steps with", "backprop gives exact gradients, not estimates"],
      unverified: true,
    },
    {
      title: "The spelled-out intro to neural networks and backpropagation: building micrograd",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=VMj-3S1tku0",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=VMj-3S1tku0"),
      minutes: 145,
      whySelected:
        "Open this ONLY after you finish the manual-derivation practice below. It is the build phase, not a video to sit through. The author spent eight years working out how to teach backprop, and here you type every line, never letting it play past code you have not typed yourself.",
      leaveWith: ["a Value class with backward() you typed yourself", "local gradient × upstream gradient, summed at fan-out, now written in code", "a trained tiny net whose gradients you can defend"],
    },
  ],
  recall: [
    { q: "At any edge of the graph, the backward rule is…?", a: "Gradient flowing down = local gradient (of that node's output w.r.t. that input) × upstream gradient (of the loss w.r.t. the node's output)." },
    { q: "A forward value feeds two consumers. What happens on the way back?", a: "Its gradients from both paths ADD, the multivariable chain rule sums over paths; gradients add at forks." },
    { q: "Why must the forward pass cache its values?", a: "Local gradients are functions of them, e.g. sigmoid's σ′ = a(1−a), so the backward pass is only cheap if forward values are stored." },
    { q: "StatQuest derives the loss derivative for one parameter with the rest frozen. What does that buy?", a: "The chain rule visible link by link, one clean product from loss back to the parameter, and the exact number gradient descent then steps with." },
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
        "Do this BEFORE the micrograd lecture. Draw the full graph for L = (σ(wx+b) − y)², write EVERY edge's local gradient in symbols, backprop real numbers through it by hand, then check your answer against a finite-difference checker you write yourself.",
      minutes: 45,
    },
    {
      prompt:
        "Rebuild the same one-neuron graph in the backprop-graph widget and check every edge against your hand derivation. Then set z > 4 and watch ∂L/∂w die through σ′ = a(1−a); that is saturation, seen live. The widget checks your work; it never replaces it.",
      minutes: 15,
    },
  ],
  implement: {
    spec:
      "Type the micrograd lecture line for line: a Value class with +, ×, tanh and backward(). Do the exercises it describes, then CLOSE the video and rebuild engine.py from memory. Train the 2-neuron net from the node spec on your own engine, and check every parameter gradient against your finite-difference checker.",
    checks: [
      "engine.py rebuilt blind, video closed, micrograd repo not open",
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
      whySelected: "Watch this AFTER a manual attempt that failed, then try again. It should explain a derivation you already tried, not do it for you. Ch. 4 'Backpropagation calculus' follows in the series playlist.",
      unverified: true,
    },
    alternateRead: {
      title: "micrograd written walkthrough (step-by-step text companion to the lecture)",
      url: "https://medium.com/@nico_X/micrograd-the-spelled-out-intro-to-neural-networks-and-backprop-written-walkthrough-a7a6532ff3a4",
      sections: "The sections covering the step you are stuck on, read alongside your own typed code",
      minutes: 25,
    },
    note:
      "3B1B ch. 4 'Backpropagation calculus' lives in the series playlist: https://www.youtube.com/playlist?list=PLZZWrBYkx7Otcjr3eCLZDCgfpqnxMY29s. If the chain-rule step in the diagnostic tripped you up, fix that first with StatQuest 'The Chain Rule, Clearly Explained!!!' (~18 min): https://www.youtube.com/watch?v=wl1myxrtQHQ.",
  },
  deepen: [
    {
      title: "Nielsen, Neural Networks and Deep Learning, ch. 2",
      url: "http://neuralnetworksanddeeplearning.com",
      sections: "How the backpropagation algorithm works, the four-equation δ-form that bridges to this node's vectorized masteryTest. Read the math; ignore the Python 2 code.",
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
      sections: "trace_graph.ipynb, render your own Value graphs and inspect every stored gradient",
      minutes: 15,
    },
  ],
  prove: {
    task:
      "On paper, backprop a 2-layer network in matrix form from the loss back to ALL parameters. Produce ∂L/∂W1, ∂L/∂b1, ∂L/∂W2, ∂L/∂b2 with the right shapes. Then make your scalar autograd reproduce the same numbers on a tiny instance. No AI.",
    criteria: [
      "You state each gradient's shape before computing it, and each one matches its parameter's shape",
      "You derive the δ recursion on the spot from the scalar chain rule, not from memory",
      "Your engine's numbers agree with the paper derivation on the tiny instance",
      "No AI help at any step; leaning on AI caps this claim below Gold",
    ],
    minutes: 40,
  },
  transfer: {
    task:
      "Add a NEW op to your Value class that the lecture never built (say ReLU and division, or log). Write its forward and backward, then prove them with your finite-difference checker. Then, using a shared-weight two-path example, explain why fan-out MUST sum. This is the same question that sits behind residual connections and weight tying.",
    criteria: [
      "The new op's backward passes the finite-difference check, not an eyeball test",
      "The two-path example makes summation necessary, and you connect it explicitly to weight sharing and residual wiring",
    ],
    minutes: 30,
  },
  retention:
    "+7 days: cold-answer the node diagnostic, why fan-out sums, and ∂L/∂W's shape for W (m×n). +30 days: re-derive δ^(l) = (W^(l+1)ᵀ δ^(l+1)) ⊙ f′(z^(l)) from the scalar chain rule in under 15 minutes.",
  researchRecord: "docs/curation/l3-backprop-theory.md",
  minutes: 445,
};
