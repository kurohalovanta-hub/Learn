import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l4-transformer.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l4-transformer",
  whyNow:
    "This is where everything so far comes together: token and position embeddings, then N blocks of x += MHA(LN(x)); x += MLP(LN(x)), then a final LN and the LM head. Hold onto the residual stream picture. Blocks read from a persistent vector and write small additive updates back into it. You build nanoGPT-class code, train it on Shakespeare, check it with two rituals (init loss near ln vocab, overfit one batch), then rebuild it from a blank file. It is the same skeleton behind π0, GR00T, and Gemini Robotics policies. Ten hours is nominal, but the grade is about what you can do: a rebuild that needed the video open is Silver, not Gold.",
  diagnostic: {
    prompt:
      "On paper, draw the full decoder-only forward pass for batch 4, block_size 8, d=32, 4 heads, 2 blocks. Show every module and every shape, from embeddings through the LM head. Then say what loss you expect at init for vocab 65, and why (−ln(1/65) ≈ 4.17). If this comes out fluent, skip straight to PROVE IT, the microgpt cold-read exam.",
    minutes: 10,
  },
  coreWatch: [
    {
      title: "Let's build GPT, P1: setup through bigram baseline (00:00–42:13, at 1.5–2×)",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kCc8FmEb1nY", 0, 2533),
      endSeconds: 2533,
      minutes: 22,
      whySelected:
        "Recap only. Tokenization, the data loader, and the bigram baseline are l4-embeddings-lm material, so run it fast. Afterwards, rebuild get_batch and the bigram loss from memory before you move on.",
      leaveWith: ["get_batch rebuilt from memory", "the bigram loss as the floor your transformer must beat"],
    },
    {
      title: "Let's build GPT, P3: assembling the block (1:19:11–1:37:49, at 1×)",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kCc8FmEb1nY", 4751, 5869),
      startSeconds: 4751,
      endSeconds: 5869,
      minutes: 19,
      whySelected:
        "The assembly, step by step: a single self-attention block (1:19:11) → multi-head (1:21:59) → feedforward (1:24:25) → residual connections (1:26:48) → LayerNorm (1:32:51). Before this, skim your l4-attention notes. The 42:13–1:19:11 middle is already yours, so do not rewatch it. After it, build Block (MHA + FFN + pre-LN residuals) from a blank file.",
      leaveWith: [
        "pre-LN wiring: norm INSIDE the residual branch, so x += MHA(LN(x)); x += MLP(LN(x))",
        "the MLP is position-wise: attention is the only cross-token mixer",
        "why residuals make depth trainable",
      ],
    },
    {
      title: "Let's build GPT, P4: scaling up, dropout, nanoGPT tour (1:37:49–end)",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kCc8FmEb1nY", 5869),
      startSeconds: 5869,
      minutes: 18,
      whySelected:
        "Dropout and the scaling knobs, then his nanoGPT walkthrough. Watch it with your own code open beside it, and map his file onto yours line by line.",
      leaveWith: ["where dropout attaches and why", "your code mapped onto the nanoGPT lineage"],
    },
  ],
  coreRead: [
    {
      title: "microgpt, GPT in ~200 dependency-free lines",
      url: "https://karpathy.github.io/2026/02/12/microgpt/",
      resourceId: "microgpt",
      sections: "All ~200 lines, cold, line by line, AFTER your blank-file rebuild. Note where his choices differ from yours (RMSNorm, KV-cache) and say why each is equivalent-or-better.",
      minutes: 60,
      whySelected: "This is the exit exam, not prep. You cannot pass it by pattern-matching, because the implementation choices are made to differ from the lecture's.",
    },
  ],
  recall: [
    { q: "In a pre-LN block, where does LayerNorm sit, and what does each block do to the residual stream?", a: "Norm INSIDE the residual branch: x += MHA(LN(x)); x += MLP(LN(x)), blocks read from the stream and write small additive updates into it." },
    { q: "Which sublayer mixes information across positions?", a: "Only attention. The feed-forward MLP is position-wise, applied to each token independently, no cross-token mixing." },
    { q: "Expected loss at init for vocab 65?", a: "≈ −ln(1/65) ≈ 4.17, a uniform prediction over the vocab. If you do not see it, the wiring or the loss is wrong." },
    { q: "Per-block parameter count in terms of d?", a: "≈ 4d² for attention (Q, K, V, output projections) + 8d² for the MLP (4× expansion up and back) = 12d² per block, plus embeddings." },
    { q: "Why 'overfit a single batch first'?", a: "A wiring test, not a failure: any correctly wired GPT can memorize one batch to ~0 loss. If it cannot, debug the architecture, not the hyperparameters." },
  ],
  interactiveIds: ["attention-vis"],
  practice: [
    {
      prompt:
        "Between P1 and P3, skim your l4-attention notes and your own attention module instead of rewatching 42:13–1:19:11. You earned that segment at l4-attention.",
      minutes: 10,
    },
    {
      prompt:
        "Node exercise: count your model's parameters by hand from the config (embeddings + per-block 4d² attention + 8d² MLP), then check it against sum(p.numel()). Track any mismatch down to the exact tensor.",
      minutes: 25,
    },
    {
      prompt:
        "Node exercise: remove the residual connections at depth 6, train, and watch it collapse. Then write out why, following the gradient flow through six stacked blocks.",
      minutes: 40,
    },
    {
      prompt:
        "Make these two a habit, said out loud before every training run from now on: the predicted init loss (≈ ln vocab, computed for YOUR vocab) and the overfit-one-batch wiring test.",
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
      "Node implementation, verbatim: a nanoGPT-style decoder-only transformer trained on Shakespeare. Sequence: predict and confirm init loss (≈ ln 65) → overfit ONE batch to ~0 loss (the debugging ritual) → full training with sampling checkpoints → save the loss curves. The second pass ('twice') means you REBUILD ALONE from a blank file under PROVE IT conditions, never re-watching.",
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
      title: "Let's build GPT, residuals + LayerNorm placement only (1:26:48–1:37:49)",
      creator: "Andrej Karpathy",
      url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=kCc8FmEb1nY", 5208, 5869),
      startSeconds: 5208,
      endSeconds: 5869,
      minutes: 11,
      whySelected: "For residual and LN placement confusion, the pre-LN vs post-LN trap. Re-watch just this, then re-wire.",
    },
    alternateRead: {
      title: "Decoder-Only Transformers: The Workhorse of Generative LLMs (Cameron R. Wolfe)",
      url: "https://cameronrwolfe.substack.com/p/decoder-only-transformers-the-workhorse",
      sections: "The decoder-only architecture end to end, a thorough prose re-derivation in a different voice",
      minutes: 40,
    },
    note:
      "If the residual-stream picture has faded BEFORE you start, get your bearings with a 1.5× rewatch of 3Blue1Brown ch. 5 (Transformers/GPT) from the 3b1b-nn series. Otherwise skip straight in.",
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
      title: "UvA Tutorial 6, warmup and optimizer sections",
      url: "https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial6/Transformers_and_MHAttention.html",
      resourceId: "uva-notebooks",
      sections: "Why transformer training wants learning-rate warmup, read before your first big run misbehaves",
      minutes: 30,
    },
  ],
  prove: {
    task:
      "Node masteryTest, verbatim: rebuild the full GPT from memory in one sitting, helped only by shapes on paper; train it to coherent Shakespeare; then take the microgpt cold-read as the oral exit exam. Explain what every line does, including the choices that differ from yours (RMSNorm, KV-cache, no nn.Module).",
    criteria: [
      "The rebuild needed no video and no old code, shapes on paper only",
      "Init-loss prediction and overfit-one-batch both pass on the rebuilt model",
      "Samples are recognizably Shakespeare-shaped",
      "Every microgpt line accounted for, and differences explained as equivalent-or-better, not hand-waved",
      "Graded honestly: a rebuild that needed the video open is Silver, not Gold",
    ],
    minutes: 120,
  },
  transfer: {
    task:
      "Point your UNCHANGED architecture at action tokens: discretize a synthetic 2-DOF trajectory dataset (sine/cosine joint waveforms) into 256 bins, train the same GPT to autoregress motor tokens, and sample a trajectory. Then say in three sentences why RT-2-style VLAs are 'this same machinery pointed at motors'.",
    criteria: [
      "Architecture untouched, only tokenizer/vocab/data swapped",
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
