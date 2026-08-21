import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l12-vla-anatomy.md (live-verified 2026-08-21).
// No verified explainer video exists for this node; the in-app lesson + vla-flow
// widget were purpose-built to fill the visual slot. HF blog posts are linked by
// their verified GitHub sources.

export const packet: LearningPacket = {
  nodeId: "l12-vla-anatomy",
  whyNow:
    "In 2026 the field converged on one skeleton: a VLM backbone kept close to its language pretraining, fusing image patches + instruction tokens + a proprio token, feeding an action decoder that emits chunked actions — with the decoder as the main design axis. Learn that template once, with tensor shapes rather than vibes, and every VLA paper for the rest of the program reads as a diff: roughly 80% is shared, and fluency is knowing the invariant and spotting the rest.",
  diagnostic: {
    prompt:
      "Cold, 5 minutes, written: why keep the VLM close to its language pretraining? Name the three action-representation families and one system using each.",
    minutes: 5,
  },
  coreRead: [
    {
      title: "π0 and π0-FAST: Vision-Language-Action Models for General Robot Control (HF blog)",
      url: "https://github.com/huggingface/blog/blob/main/pi0.md",
      sections:
        "Complete: how VLAs differ from VLMs, the attention layout of robot policies, and FAST tokenization — the flow-expert vs autoregressive-token contrast in plain engineering prose.",
      minutes: 20,
      whySelected:
        "The missing plain-prose layer between the widget and the survey's formality — the two decoder families explained by the team that shipped both.",
    },
    {
      title: "A Survey on VLA Models: An Action Tokenization Perspective (Zhong et al.)",
      url: "https://arxiv.org/abs/2507.01925",
      resourceId: "awesome-vla-2026",
      sections:
        "Taxonomy sections + system tables — STUDY as the map, skim the per-paper detail. As you read, actively fill your own design-axes table (tokenization × head × co-training) for π0, OpenVLA, RT-2, SmolVLA, GR00T.",
      minutes: 90,
      whySelected:
        "The organizing taxonomy: what the 'action token' is — language plan, trajectory, latent, or raw-action families. Read AFTER the widget so the map lands on territory you have touched.",
    },
  ],
  recall: [
    {
      q: "The three action-representation families, with one system each?",
      a: "Discrete action tokens in the VLM (RT-2, OpenVLA, π0-FAST), continuous regression heads (OpenVLA-OFT's L1 head), and diffusion/flow action experts (π0, SmolVLA, GR00T).",
    },
    {
      q: "Why does proprio enter as its own token instead of being drawn into the image?",
      a: "Lossless and directly attendable: every layer can read exact joint state without decoding it from pixels. Tokens are the universal interface.",
    },
    {
      q: "Why keep the VLM close to its language pretraining?",
      a: "Naive action fine-tuning erodes web-scale semantics. Knowledge insulation and separate action experts exist precisely to add control without overwriting what the VLM knows.",
    },
    {
      q: "π0 vs π0-FAST in one line?",
      a: "Same backbone, different decoder: π0 samples continuous action chunks from a flow-matching action expert; π0-FAST autoregressively emits discrete FAST tokens from the VLM itself.",
    },
    {
      q: "Chunking and async inference — style or necessity?",
      a: "Necessity: 3 cameras at 224² with 50 Hz control cannot be served by synchronous per-step VLM inference. One forward pass amortized over a chunk, plus async execution, is forced by the latency budget (SmolVLA: ~30% faster response, ~2× task throughput).",
    },
  ],
  interactiveIds: ["vla-flow"],
  lessonId: "l12-vla-anatomy",
  practice: [
    {
      prompt:
        "First, the in-app lesson's why/drive sections with the vla-flow instrument: tap every block, read every tensor shape, and flip the flow-expert ↔ FAST-tokens toggle until the invariance registers — the decoder swaps, the skeleton doesn't.",
      minutes: 15,
    },
    {
      prompt:
        "Redraw the generic VLA block diagram from memory with tensor shapes at every arrow; then annotate where π0, OpenVLA, and GR00T each deviate from it.",
      minutes: 30,
    },
    {
      prompt:
        "The latency-budget worksheet: 3 cameras × 224² inputs at 50 Hz control — count tokens, estimate the per-step forward cost, show where the time goes, and conclude why chunking + async execution exist. Check your arithmetic against SmolVLA's published async numbers (~30% response, ~2× throughput).",
      minutes: 25,
    },
  ],
  implement: {
    spec: "The node's two artifacts: (1) the filled design-axes table — tokenization × action head × co-training — for π0, OpenVLA, RT-2, SmolVLA, GR00T, with one line of evidence per cell; (2) a one-page 'convergent recipe' memo in your own words: the invariant skeleton, the decoder as the one real design axis, and what knowledge insulation, dual-system splits, and latency constraints each protect.",
    checks: [
      "Every table cell cites where it came from (survey table or blog post)",
      "The memo names the invariant without leaning on any single paper's trivia",
      "A reader of your memo could place a new system in your table unaided",
    ],
    minutes: 90,
  },
  stuck: {
    alternateRead: {
      title: "SmolVLA (HF blog)",
      url: "https://github.com/huggingface/blog/blob/main/smolvla.md",
      sections:
        "The whole anatomy at 450M: SmolVLM2 backbone + ~100M flow-matching action expert, layer skipping (attend to VLM features up to ~half depth), async inference",
      minutes: 25,
    },
    note: "If the generic diagram won't come from memory, study this smallest complete instance — every component fits in your head — then re-attempt the diagram before returning to the survey.",
  },
  deepen: [
    {
      title: "openpi source skim",
      url: "https://github.com/Physical-Intelligence/openpi",
      resourceId: "openpi",
      sections:
        "Config → model classes only: the anatomy as code (π0 flow / π0-FAST autoregressive / π0.5 with knowledge insulation; note the norm-stats step and the policy-server split). A skim — studying it is l12-pi0-flow's job.",
      minutes: 45,
    },
    {
      title: "Survey 2507.01925 — related-work graph",
      url: "https://arxiv.org/abs/2507.01925",
      resourceId: "awesome-vla-2026",
      sections:
        "The related-work graph for whichever design axis felt thinnest. The RT-2 / OpenVLA / π0 papers themselves are NOT this node — they are l12-rt-lineage, l12-openvla-code, l12-pi0-flow, and no AI summary substitutes for reading them there.",
      minutes: 30,
    },
  ],
  prove: {
    task: "The node's mastery test: whiteboard reconstruction, from memory, of the full π0-class anatomy — every block, with a concrete tensor shape at every arrow — plus your 5-system design-axes table rebuilt blind.",
    criteria: [
      "Every arrow carries a shape and the shapes compose — arithmetic recognition can't fake",
      "The decoder is drawn as the swap point, with all three families placeable there",
      "The table is correct from memory for all 5 systems across all three axes",
      "Two sentences, cold: what knowledge insulation protects, and what forces chunking",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Pick one system NOT in your table from LeRobot's policies directory listing (e.g. molmoact2 or vla_jepa) and place it in the taxonomy from its docs/README alone, in at most 15 minutes — the 'every paper is a diff' skill exercised on an unseen system.",
    criteria: [
      "Placed on all three axes with evidence quoted from its own docs",
      "Done inside the 15-minute box — this is fluency, not research",
    ],
    minutes: 15,
  },
  retention:
    "+10 days, during l12-pi0-flow: rebuild the design-axes table blind and diff against your original. +1 month: the latency-budget numbers from memory.",
  researchRecord: "docs/curation/l12-vla-anatomy.md",
  minutes: 320,
};
