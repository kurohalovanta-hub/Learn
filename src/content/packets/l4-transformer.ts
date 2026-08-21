import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l4-transformer.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l4-transformer",
  whyNow:
    "Assembly of everything so far: token+position embeddings → N× [x += MHA(LN(x)); x += MLP(LN(x))] → LN → LM head. The load-bearing mental model is the residual stream — blocks READ from and WRITE small additive updates into a persistent vector highway. You build nanoGPT-class code, train it on Shakespeare, debug it with checkable rituals (init loss ≈ ln vocab; overfit one batch), and then rebuild it from a blank file. This is the same architecture skeleton as π0, GR00T and Gemini Robotics policies. The node is 10 h nominal but gates on capability: a rushed rebuild that needed the video open is Silver, not Gold.",
  diagnostic: {
    prompt:
      "On paper: draw the full decoder-only forward pass for batch 4, block_size 8, d=32, 4 heads, 2 blocks — every module and every shape, embeddings through LM head. Then: what loss do you expect at init for vocab 65, and why? (−ln(1/65) ≈ 4.17.) A fluent pass jumps you straight to PROVE IT — the microgpt cold-read exam.",
    minutes: 10,
  },
  coreWatch: [
    {
      title: "Let's build GPT — P1: setup through bigram baseline (00:00–42:13, at 1.5–2×)",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kCc8FmEb1nY", 0, 2533),
      endSeconds: 2533,
      minutes: 22,
      whySelected:
        "Recap ONLY — tokenization, data loader and the bigram baseline are l4-embeddings-lm material, so run it fast. Afterwards: reconstruct get_batch and the bigram loss from memory before moving on.",
      leaveWith: ["get_batch reconstructed from memory", "the bigram loss as the floor your transformer must beat"],
    },
    {
      title: "Let's build GPT — P3: assembling the block (1:19:11–1:37:49, at 1×)",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kCc8FmEb1nY", 4751, 5869),
      startSeconds: 4751,
      endSeconds: 5869,
      minutes: 19,
      whySelected:
        "The assembly: inserting a single self-attention block (1:19:11) → multi-head (1:21:59) → feedforward (1:24:25) → residual connections (1:26:48) → LayerNorm (1:32:51). Before this, skim your l4-attention notes — the 42:13–1:19:11 middle is already yours; do not rewatch it. After it: build Block (MHA + FFN + pre-LN residuals) from a blank file.",
      leaveWith: [
        "pre-LN wiring: norm INSIDE the residual branch — x += MHA(LN(x)); x += MLP(LN(x))",
        "the MLP is position-wise: attention is the only cross-token mixer",
        "why residuals make depth trainable",
      ],
    },
    {
      title: "Let's build GPT — P4: scaling up, dropout, nanoGPT tour (1:37:49–end)",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kCc8FmEb1nY", 5869),
      startSeconds: 5869,
      minutes: 18,
      whySelected:
        "Dropout and the scaling knobs, then his nanoGPT walkthrough — watch it with your own code open side-by-side, mapping his file onto yours line by line.",
      leaveWith: ["where dropout attaches and why", "your code mapped onto the nanoGPT lineage"],
    },
  ],
  coreRead: [
    {
      title: "microgpt — GPT in ~200 dependency-free lines",
      url: "https://karpathy.github.io/2026/02/12/microgpt/",
      resourceId: "microgpt",
      sections: "All ~200 lines, cold, line by line — AFTER your blank-file rebuild. Note where his choices differ from yours (RMSNorm, KV-cache) and say why each is equivalent-or-better.",
      minutes: 60,
      whySelected: "The exit exam, not preparation: it cannot be passed on pattern-matching because the implementation choices deliberately differ from the lecture's.",
    },
  ],
  recall: [
    { q: "In a pre-LN block, where does LayerNorm sit, and what does each block do to the residual stream?", a: "Norm INSIDE the residual branch: x += MHA(LN(x)); x += MLP(LN(x)) — blocks read from the stream and write small additive updates into it." },
    { q: "Which sublayer mixes information across positions?", a: "Only attention. The feed-forward MLP is position-wise — applied to each token independently, no cross-token mixing." },
    { q: "Expected loss at init for vocab 65?", a: "≈ −ln(1/65) ≈ 4.17 — a uniform prediction over the vocab. If you do not see it, the wiring or the loss is wrong." },
    { q: "Per-block parameter count in terms of d?", a: "≈ 4d² for attention (Q, K, V, output projections) + 8d² for the MLP (4× expansion up and back) = 12d² per block, plus embeddings." },
    { q: "Why 'overfit a single batch first'?", a: "A wiring test, not a failure: any correctly wired GPT can memorize one batch to ~0 loss. If it cannot, debug the architecture, not the hyperparameters." },
  ],
  interactiveIds: ["attention-vis"],
  practice: [
    {
      prompt:
        "Between P1 and P3: skim your l4-attention notes and your own attention module instead of rewatching 42:13–1:19:11 — that segment was earned at l4-attention.",
      minutes: 10,
    },
    {
      prompt:
        "Node exercise: parameter-count your model by hand from the config (embeddings + per-block 4d² attention + 8d² MLP), then verify against sum(p.numel()); reconcile any mismatch down to the exact tensor.",
      minutes: 25,
    },
    {
      prompt:
        "Node exercise: ablate the residual connections at depth 6 — train and watch the collapse, then explain it in writing via gradient flow through six stacked blocks.",
      minutes: 40,
    },
    {
      prompt:
        "Adopt as standing habits, stated before every training run from now on: the predicted init loss (≈ ln vocab — compute it for YOUR vocab) and the overfit-one-batch wiring test.",
      minutes: 10,
    },
    {
      prompt:
        "attention-vis revisit: predict what head 0 vs head 3 of your TRAINED Shakespeare model attend to, then inspect the real maps from your checkpoints; write one sentence per head on what it learned.",
      minutes: 15,
    },
  ],
  implement: {
    spec:
      "Node implementation verbatim: nanoGPT-style decoder-only transformer trained on Shakespeare. Sequence: predict and confirm init loss (≈ ln 65) → overfit ONE batch to ~0 loss (the debugging ritual) → full training with sampling checkpoints → loss curves saved. The second pass — 'twice' — means REBUILD ALONE from a blank file under PROVE IT conditions, never re-watching.",
    checks: [
      "Init loss lands within a few percent of ln(vocab) before any training",
      "One batch driven to ~0 loss before full training is allowed to start",
      "Sampling checkpoints show progression from noise toward Shakespeare-shaped text",
      "Blocks are pre-LN: norm inside the residual branch, additive updates to the stream",
    ],
    minutes: 150,
  },
  stuck: {
    alternate: {
      title: "Let's build GPT — residuals + LayerNorm placement only (1:26:48–1:37:49)",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kCc8FmEb1nY", 5208, 5869),
      startSeconds: 5208,
      endSeconds: 5869,
      minutes: 11,
      whySelected: "For residual/LN placement confusion specifically — the pre-LN vs post-LN trap. Re-watch just this, then re-wire.",
    },
    alternateRead: {
      title: "Decoder-Only Transformers: The Workhorse of Generative LLMs (Cameron R. Wolfe)",
      url: "https://cameronrwolfe.substack.com/p/decoder-only-transformers-the-workhorse",
      sections: "The decoder-only architecture end to end — a thorough prose re-derivation in a different voice",
      minutes: 40,
    },
    note:
      "If the residual-stream picture has faded BEFORE starting, orient with a 1.5× rewatch of 3Blue1Brown ch. 5 (Transformers/GPT) from the 3b1b-nn series — otherwise skip straight in.",
  },
  deepen: [
    {
      title: "The Annotated Transformer (2022 rewrite)",
      url: "http://nlp.seas.harvard.edu/annotated-transformer/",
      resourceId: "annotated-transformer",
      sections: "One pass, for the encoder–decoder completion of your decoder-only picture",
      minutes: 90,
    },
    {
      title: "UvA Tutorial 6 — warmup and optimizer sections",
      url: "https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial6/Transformers_and_MHAttention.html",
      resourceId: "uva-notebooks",
      sections: "Why transformer training wants learning-rate warmup — read before your first big run misbehaves",
      minutes: 30,
    },
  ],
  prove: {
    task:
      "Node masteryTest verbatim: rebuild the full GPT from memory in one sitting, aided only by shapes on paper; train it to coherent Shakespeare; then take the microgpt cold-read as the oral exit exam — explain every line's purpose, including the choices that differ from yours (RMSNorm, KV-cache, no nn.Module).",
    criteria: [
      "The rebuild needed no video and no old code — shapes on paper only",
      "Init-loss prediction and overfit-one-batch both pass on the rebuilt model",
      "Samples are recognizably Shakespeare-shaped",
      "Every microgpt line accounted for; differences explained as equivalent-or-better, not hand-waved",
      "Graded honestly: a rebuild that needed the video open is Silver, not Gold",
    ],
    minutes: 120,
  },
  transfer: {
    task:
      "Retarget your UNCHANGED architecture at action tokens: discretize a synthetic 2-DOF trajectory dataset (sine/cosine joint waveforms) into 256 bins, train the same GPT to autoregress motor tokens, and sample a trajectory — then state in three sentences why RT-2-style VLAs are 'this machinery pointed at motors'.",
    criteria: [
      "Architecture untouched — only tokenizer/vocab/data swapped",
      "The sampled trajectory plots as recognizably sinusoidal joint motion",
      "The three-sentence VLA statement names tokens-in/tokens-out explicitly",
    ],
    minutes: 60,
  },
  retention:
    "+7 days: parameter-count a NEW config cold and predict its init loss. +30 days (pre-BOSS): blank-file Block class in ≤15 minutes, and re-answer Karpathy's four attention notes from memory.",
  researchRecord: "docs/curation/l4-transformer.md",
  minutes: 560,
};
