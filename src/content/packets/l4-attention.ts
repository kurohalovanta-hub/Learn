import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l4-attention.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l4-attention",
  whyNow:
    "The mechanism of the decade. softmax(QKᵀ/√d)V is content-based routing: every token asks (query), offers (key), and carries (value), and the values mix by query–key match. It powers every VLA, world model and LLM you will touch — and it is the most-watched, least-implemented topic in deep learning. This packet's standing rule: not one video minute past an unreconstructed segment. You leave producing attention from raw tensors, not recognizing it in a library.",
  diagnostic: {
    prompt:
      "Cold, on paper: batch 8, 64 tokens, d=512, 8 heads — write the shape at every intermediate step of multi-head attention (Q/K/V projections, per-head split, logits, weights, per-head outputs, concat, output projection). Why must the causal mask be applied BEFORE softmax? Any shape error routes you into the full packet.",
    minutes: 8,
  },
  coreWatch: [
    {
      title: "Attention in transformers, step-by-step (Deep Learning Ch. 6)",
      creator: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=eMlx5fFNoYc",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=eMlx5fFNoYc"),
      minutes: 26,
      whySelected:
        "The consensus watch-first: real QKᵀ/√d matrices animated, Q/K/V as three learned projections of the SAME x. Commit-before-reveal: pause at the Q/K introduction and predict what the third matrix must do before he names V.",
      leaveWith: [
        "attention = content-based routing: query asks, key offers, value carries",
        "attention weights are activations recomputed per input — not parameters",
        "why /√d exists at all",
      ],
    },
    {
      title: "Let's build GPT — the attention segment (42:13–1:19:11)",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kCc8FmEb1nY", 2533, 4751),
      startSeconds: 2533,
      endSeconds: 4751,
      minutes: 37,
      whySelected:
        "Open only after Part 1 AND a first blank-file attempt. The single best derivation of attention as generalized weighted averaging — v1 for-loop averaging → matmul trick → softmax → v4 self-attention. Watch in three packets (42:13–54:42, 54:42–1:11:38, 1:11:38–1:19:11), reconstructing each blind before playing on: the lower-triangular masked-softmax trick from an empty cell; then single-head attention without the video; then the four notes + why √(head_size), from memory. Never play past an unreconstructed packet.",
      leaveWith: [
        "the lower-triangular masked-softmax averaging trick, reproduced blind",
        "single-head attention (k/q/v linears, wei = q@kᵀ/√d, mask, softmax, @v) written without the video",
        "the four notes: communication · no notion of space · no cross-batch talk · encoder vs decoder",
        "why scale by √(head_size)",
      ],
    },
  ],
  coreRead: [
    {
      title: "UvA Deep Learning Notebooks, Tutorial 6: Transformers and Multi-Head Attention",
      url: "https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial6/Transformers_and_MHAttention.html",
      resourceId: "uva-notebooks",
      sections: "'What is Attention?' through 'Multi-Head Attention' ONLY — read AFTER your implementation works",
      minutes: 45,
      whySelected: "Consolidation, not preparation: fills in the encoder view, masking variants, and the permutation-equivariance framing your build quietly assumed.",
    },
  ],
  recall: [
    { q: "In self-attention, where do Q, K and V come from?", a: "Three learned linear projections of the SAME input x — a soft dictionary lookup, not three mysterious separate inputs." },
    { q: "Where is 'the attention matrix' in a trained model's state_dict?", a: "Nowhere — attention weights are activations recomputed per input; only the Q/K/V/output projection weights are parameters." },
    { q: "Why divide the logits by √d before softmax?", a: "Dot-product variance grows with d; at d≈256+ unscaled logits saturate softmax toward one-hot and gradients die. /√d keeps logit variance near 1 — checkable, not folklore." },
    { q: "Why mask with −∞ logits BEFORE softmax instead of zeroing probabilities after?", a: "Softmax normalizes: exp(−∞) = 0 keeps each row a distribution over the allowed past. Zeroing after softmax breaks normalization — rows no longer sum to 1." },
    { q: "Multi-head is not the same attention h times on full vectors. What is it?", a: "h attentions on learned d/h-dimensional projections, concatenated then projected — parallel routing in subspaces, not an ensemble." },
  ],
  interactiveIds: ["attention-vis"],
  lessonId: "l4-attention",
  practice: [
    {
      prompt:
        "Work the in-app lesson end to end with the attention-vis instrument: predict every attention map BEFORE revealing it. Commit-before-reveal is the point — the widget is this node's committed practice surface.",
      minutes: 85,
    },
    {
      prompt:
        "Node exercise 1: hand-compute scaled dot-product attention for a 3-token example on paper — QKᵀ, /√d, softmax rows, mixed values — then match your code to 6 decimals.",
      minutes: 40,
    },
    {
      prompt:
        "Node exercise 2: ablate the /√d scaling at d=256 — plot attention-weight entropy and gradient norms with and without it; show the softmax saturating toward one-hot and the gradients dying.",
      minutes: 30,
    },
    {
      prompt:
        "Node exercise 3: visualize causal-mask attention maps evolving over training of a small model; describe what structure appears, and when.",
      minutes: 30,
    },
  ],
  implement: {
    spec:
      "Node implementation verbatim: (1) single-head attention from raw tensors — no nn.MultiheadAttention — with every shape hand-verified on a 4-token example before running; (2) batched multi-head causal attention as a clean nn.Module: Q/K/V projections, split to d/h per head, logits masked to −∞, softmax, weighted values, concat, output projection.",
    checks: [
      "The 4-token example's shapes written down BEFORE running, then confirmed exactly",
      "Mask applied to logits before softmax; every weight row sums to 1 over allowed positions",
      "Heads are d/h-dimensional projections concatenated — not h full-width copies",
    ],
    minutes: 90,
  },
  stuck: {
    alternate: {
      title: "Let's build GPT — the matmul trick alone (47:11–54:42)",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kCc8FmEb1nY", 2831, 3282),
      startSeconds: 2831,
      endSeconds: 3282,
      minutes: 8,
      whySelected: "Matrix-multiply-as-weighted-aggregation — the community-attested unstick point. Re-watch just this, then re-attempt.",
    },
    note: "After the trick re-watch, take the in-app lesson's derivation section again at half speed before touching more video.",
  },
  deepen: [
    {
      title: "UvA Tutorial 6 — the remaining sections",
      url: "https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial6/Transformers_and_MHAttention.html",
      resourceId: "uva-notebooks",
      sections: "Positional encodings, learning-rate warmup, experiments — the parts deliberately held back from CORE READ",
      minutes: 45,
    },
    {
      title: "Visualizing transformers and attention (TNG Big Tech Day '24 talk)",
      url: "https://www.youtube.com/watch?v=KJtZARuO3JY",
      sections: "Grant Sanderson's live-talk remix of the series — only if the mechanism still feels unmotivated (duration unverified at curation)",
      minutes: 60,
    },
  ],
  prove: {
    task:
      "Node masteryTest verbatim: blank file → batched multi-head causal self-attention with correct masking, verified numerically against nn.MultiheadAttention outputs on a fixed seed. Shapes narrated aloud at every line as you write it.",
    criteria: [
      "Written from a blank file — no reference, no AI, no peeking at your earlier module",
      "Matches nn.MultiheadAttention numerically on the fixed seed — matching, not 'close'",
      "The shape narration never stalls: each tensor's shape said before its line runs",
      "Direct inspection of the weight matrix confirms zero attention to any future position",
    ],
    minutes: 45,
  },
  transfer: {
    task:
      "Implement CROSS-attention: queries from a 3-token 'instruction' sequence, keys/values from a 9-token 'image patch' sequence — changing only the projection inputs. Explain why a causal mask is meaningless here, and what this layer becomes inside a VLA.",
    criteria: [
      "Only the projection INPUTS changed — the attention machinery is untouched",
      "You state why causality has no meaning across two different sequences (there is no 'future' to hide)",
      "You name what this layer is inside a VLA: instruction/state tokens querying perception tokens",
    ],
    minutes: 30,
  },
  retention:
    "+7 days: re-do the shape diagnostic cold and hand-compute a fresh 3-token example. +21 days: explain /√d and mask-before-softmax in two written paragraphs, no notes.",
  researchRecord: "docs/curation/l4-attention.md",
  minutes: 465,
};
