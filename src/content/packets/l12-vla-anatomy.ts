import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l12-vla-anatomy.md (live-verified 2026-08-21).
// No verified explainer video exists for this node; the in-app lesson + vla-flow
// widget were purpose-built to fill the visual slot. HF blog posts are linked by
// their verified GitHub sources.

export const packet: LearningPacket = {
  nodeId: "l12-vla-anatomy",
  whyNow:
    "By 2026 almost every VLA shares one skeleton. A VLM backbone stays close to its language pretraining, takes in image patches, instruction tokens, and a proprio token, then feeds an action decoder that emits chunks of actions. The decoder is where systems really differ. Learn this template once, with real tensor shapes, and every later VLA paper reads as a small change on top of it. Most of it is shared, so fluency means knowing the shared part cold and spotting what each paper swaps.",
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
        "Complete: how VLAs differ from VLMs, the attention layout of robot policies, and FAST tokenization, the flow-expert vs autoregressive-token contrast in plain engineering prose.",
      minutes: 20,
      whySelected:
        "The plain-prose layer that sits between the widget and the survey's formality. It explains the two decoder families, written by the team that shipped both.",
    },
    {
      title: "A Survey on VLA Models: An Action Tokenization Perspective (Zhong et al.)",
      url: "https://arxiv.org/abs/2507.01925",
      resourceId: "awesome-vla-2026",
      sections:
        "Taxonomy sections + system tables, STUDY as the map, skim the per-paper detail. As you read, actively fill your own design-axes table (tokenization × head × co-training) for π0, OpenVLA, RT-2, SmolVLA, GR00T.",
      minutes: 90,
      whySelected:
        "The taxonomy that organizes everything: what the 'action token' is, across the language-plan, trajectory, latent, and raw-action families. Read it after the widget so the map lands on ground you have already walked.",
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
      q: "Chunking and async inference, style or necessity?",
      a: "Necessity: 3 cameras at 224² with 50 Hz control cannot be served by synchronous per-step VLM inference. One forward pass amortized over a chunk, plus async execution, is forced by the latency budget (SmolVLA: ~30% faster response, ~2× task throughput).",
    },
  ],
  interactiveIds: ["vla-flow"],
  lessonId: "l12-vla-anatomy",
  practice: [
    {
      prompt:
        "Start with the in-app lesson's why and drive sections using the vla-flow tool. Tap every block, read every tensor shape, and flip the flow-expert to FAST-tokens toggle back and forth until the pattern sinks in. The decoder swaps out; the skeleton stays the same.",
      minutes: 15,
    },
    {
      prompt:
        "Redraw the generic VLA block diagram from memory with tensor shapes at every arrow; then annotate where π0, OpenVLA, and GR00T each deviate from it.",
      minutes: 30,
    },
    {
      prompt:
        "Work the latency-budget worksheet: 3 cameras at 224² inputs with 50 Hz control. Count the tokens, estimate the per-step forward cost, show where the time goes, and work out why chunking and async execution have to exist. Check your arithmetic against SmolVLA's published async numbers (~30% response, ~2× throughput).",
      minutes: 25,
    },
  ],
  implement: {
    spec: "You will produce two things. (1) A filled design-axes table (tokenization, action head, co-training) for π0, OpenVLA, RT-2, SmolVLA, GR00T, with one line of evidence in each cell. (2) A one-page memo in your own words on the convergent recipe: the skeleton that stays fixed, the decoder as the one real place systems differ, and what knowledge insulation, dual-system splits, and latency limits each protect.",
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
    note: "If the generic diagram won't come from memory, study this smallest complete instance (every part fits in your head), then try the diagram again before you go back to the survey.",
  },
  deepen: [
    {
      title: "openpi source skim",
      url: "https://github.com/Physical-Intelligence/openpi",
      resourceId: "openpi",
      sections:
        "Config → model classes only: the anatomy as code (π0 flow / π0-FAST autoregressive / π0.5 with knowledge insulation; note the norm-stats step and the policy-server split). A skim, studying it is l12-pi0-flow's job.",
      minutes: 45,
    },
    {
      title: "Survey 2507.01925, related-work graph",
      url: "https://arxiv.org/abs/2507.01925",
      resourceId: "awesome-vla-2026",
      sections:
        "The related-work graph for whichever design axis felt thinnest. The RT-2 / OpenVLA / π0 papers themselves are NOT this node, they are l12-rt-lineage, l12-openvla-code, l12-pi0-flow, and no AI summary substitutes for reading them there.",
      minutes: 30,
    },
  ],
  prove: {
    task: "The mastery test: on a whiteboard, from memory, reconstruct the full π0-class anatomy. Draw every block with a concrete tensor shape at every arrow, then rebuild your 5-system design-axes table blind.",
    criteria: [
      "Every arrow carries a shape, and the shapes compose (you can't fake that by recognizing the arithmetic)",
      "The decoder is drawn as the swap point, with all three families able to sit there",
      "The table is correct from memory for all 5 systems across all three axes",
      "Two sentences, cold: what knowledge insulation protects, and what forces chunking",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Pick one system that's not in your table from LeRobot's policies directory listing (for example molmoact2 or vla_jepa) and place it in the taxonomy using only its docs or README, in 15 minutes or less. This is the 'every paper is a diff' skill, run on a system you have not seen.",
    criteria: [
      "Placed on all three axes with evidence quoted from its own docs",
      "Done inside the 15-minute box, this is fluency, not research",
    ],
    minutes: 15,
  },
  retention:
    "+10 days, during l12-pi0-flow: rebuild the design-axes table blind and diff against your original. +1 month: the latency-budget numbers from memory.",
  researchRecord: "docs/curation/l12-vla-anatomy.md",
  minutes: 320,
};
