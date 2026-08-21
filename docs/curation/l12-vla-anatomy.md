# l12-vla-anatomy — VLA Anatomy: The Convergent Recipe

Concept: The shared skeleton of 2026 VLAs: VLM backbone (kept close to language
pretraining) fusing [image patches + instruction tokens + proprio token] → an action
decoder producing chunked actions — with the decoder as the main design axis (discrete
tokens vs continuous regression vs diffusion/flow expert), plus knowledge insulation,
dual-system splits, and latency/control-rate constraints. Learned once as a template so
every VLA paper reads as a diff.

Learner prerequisites: l11-act gold (chunking, action heads on real observations),
l4-clip-contrastive gold (ViT patches, image-text embedding), l4-transformer (tokens,
attention, KV). The flow-vs-token contrast leans on l11-diffusion-policy intuition; full
flow-matching depth arrives later (l11-flow-matching precedes l12-pi0-flow, not this node).

What beginners commonly misunderstand:
- Treating each VLA paper as a new architecture. The convergent recipe means ~80% is shared;
  fluency = knowing the invariant and diffing the rest. (The in-app vla-flow widget's
  decoder toggle is built on exactly this invariance.)
- Why proprio is its own token rather than "in the image" — lossless, direct attention
  access; the tokens-as-universal-interface pattern (already a lesson quiz item).
- Why the VLM is kept close to its language pretraining: naive action fine-tuning erodes
  web-scale semantics — the motivation for knowledge insulation and for separate action
  experts (π0-style) vs in-VLM action tokens (RT-2/FAST-style).
- Latency arithmetic: 3 cameras × 224² at 50 Hz does not fit synchronous per-step
  inference; chunking + async execution are *forced* by the budget, not stylistic. (The HF
  SmolVLA writeup quantifies async: ~30% faster response, ~2× task throughput.)
- Assuming "action expert" implies a huge module — SmolVLA's is ~100M params attending to
  only the first half of VLM layers (layer skipping) — the anatomy scales down.

Candidate videos:
1. none verifiable this session (web-search budget exhausted before VLA-video discovery;
   YouTube egress blocked). Fallback: the in-app lesson (90 min, with the vla-flow widget)
   already IS this node's guided walkthrough — it was built to replace an orientation
   lecture — and the two HF engineering writeups below are the best current prose
   explanations.

Candidate written resources:
1. Survey — "A Survey on VLA Models: An Action Tokenization Perspective" (Zhong et al.) —
   https://arxiv.org/abs/2507.01925 (URL verified via awesome-vla-2026 index) — CORE: the
   organizing taxonomy (what the 'action token' is: language plan / trajectory / latent /
   raw action families) (rigor 4, map value 5, beginner fit 3 — read AFTER the widget)
2. HF blog: "π0 and π0-FAST: Vision-Language-Action Models for General Robot Control"
   (source verified: https://github.com/huggingface/blog/blob/main/pi0.md) — explains how
   VLAs differ from VLMs, attention layout in robot policies, and FAST tokenization — the
   flow-expert vs autoregressive-token contrast in plain engineering prose (clarity 5)
3. HF blog: SmolVLA (source verified:
   https://github.com/huggingface/blog/blob/main/smolvla.md) — a complete small-scale
   instance of the anatomy: SmolVLM2 backbone + ~100M flow-matching action expert, layer
   skipping (attend to VLM features up to layer N = half), async inference (+~30% response,
   ~2× throughput) — the "anatomy with concrete numbers" read (beginner fit 5)
4. openpi repo — https://github.com/Physical-Intelligence/openpi (verified: π0 flow VLA /
   π0-FAST autoregressive / π0.5 with knowledge insulation; LeRobot-format data;
   norm-stats step; policy-server inference) — the frontier instantiation to skim, not
   study (that's l12-pi0-flow)
5. awesome-vla-2026 — https://github.com/miracle-techlink/awesome-vla-2026 (verified:
   250+ papers, 15 categories, organized foundations→architectures→action representations)
   — the index; repo-existing primary, confirmed live.

Community evidence:
- LeRobot `src/lerobot/policies/` directory (verified today) now ships 20+ policy families
  (act, diffusion, pi0/pi05/pi0_fast, smolvla, groot, molmoact2, vla_jepa, xvla, wall_x,
  eo1…) — the convergence is visible as code layout: one interface, many decoders; skimming
  this listing is itself a 5-minute anatomy lesson
  (https://github.com/huggingface/lerobot/tree/main/src/lerobot/policies)
- lerobot #3264/#2354 (open): even *official* VLA checkpoints resist benchmark reproduction
  — supports this node's insistence on anatomy-level understanding over leaderboard
  literalism (https://github.com/huggingface/lerobot/issues?q=smolvla+finetune)

Primary technical authority:
- Survey 2507.01925 as the map (node's existing primary, confirmed); π0 paper
  https://arxiv.org/abs/2410.24164, RT-2 https://arxiv.org/abs/2307.15818, OpenVLA
  https://arxiv.org/abs/2406.09246, SmolVLA https://arxiv.org/abs/2506.01844 (all URLs
  verified via awesome-vla-2026) as the systems the anatomy is annotated against.

Selected shortest-sufficient packet:
- DIAGNOSTIC: cold: "Why keep the VLM close to its language pretraining? Name the three
  action-representation families and one system using each." — 5 min written.
- ORIENT: in-app lesson §why + §drive: vla-flow widget — tap every block, read every tensor
  shape, flip the flow-expert ↔ FAST-tokens toggle until the invariance registers — 15 min.
- CORE WATCH: — (no verified video; lesson + widget fill the slot)
- CORE READ: (a) HF π0 blog post for the two decoder families in prose — 20 min; (b) survey
  2507.01925: taxonomy sections + system tables, actively filling your own "design axes"
  table (tokenization × head × co-training) for π0, OpenVLA, RT-2, SmolVLA, GR00T as you
  read — 90 min. STUDY the survey as the map, skim its per-paper detail.
- INTERACTIVE: vla-flow (in-app).
- PRACTICE: node exercises — (1) redraw the generic block diagram from memory with tensor
  shapes at every arrow; annotate where π0, OpenVLA, GR00T deviate; (2) the latency-budget
  exercise (3×224² @ 50 Hz — where does the time go; why chunking + async exist), checked
  against the SmolVLA async numbers.
- IMPLEMENT/DERIVE: the filled design-axes table for 5 named systems + a one-page "the
  convergent recipe" memo in your own words (these are the node's artifacts; ~1.5 h).
- STUCK PATH: HF SmolVLA blog — the anatomy at 450M with every component small enough to
  hold in your head; then re-attempt the generic diagram.
- DEEPEN: openpi source skim (config → model classes) to see the anatomy as code; the
  survey's related-work graph for whichever axis felt thinnest. RT-2/OpenVLA/π0 papers are
  NOT this node — they are l12-rt-lineage / l12-openvla-code / l12-pi0-flow; no AI summary
  substitutes for reading them there.
- PROVE IT: node masteryTest — whiteboard reconstruction of the full π0-class anatomy with
  tensor shapes at every arrow + the 5-system design-axes table, from memory.
- TRANSFER: pick one system NOT in your table from the LeRobot policies listing (e.g.
  molmoact2 or vla_jepa) and place it in the taxonomy from its docs/README alone, in ≤15
  minutes — the "every paper is a diff" skill exercised on an unseen system.
- RETENTION: +10 days (during l12-pi0-flow): rebuild the design-axes table blind and diff
  against your original; +1 month: the latency-budget numbers from memory.

Why this won: the existing primary (survey-as-map) survives verification and is exactly
right pedagogically; what the research adds is the two HF engineering writeups (both
verified via the blog's GitHub source) as the missing plain-prose CORE layer between the
in-app widget and the survey's formality — highest understanding-per-minute for a learner
who has just left ACT/DP. Packet ≈ 2.5 h read + ~1.5 h artifact work + widget ≈ node's 6 h.

What was rejected (and why): explainer videos (none verifiable this session; the widget was
purpose-built for this node's visual layer); reading RT-2/π0/OpenVLA papers *inside* this
node (belongs to the dedicated lineage nodes — this node buys the template that makes those
reads fast); other 2025–26 VLA surveys in the awesome list (the action-tokenization lens is
the one that matches this node's objectives; more maps = less territory).

Risk of superficial understanding: the highest in the cluster — anatomy diagrams are
extremely recognizable; nothing here trains a loss curve. Guards: tensor SHAPES at every
arrow (recognition can't fake arithmetic), the from-memory whiteboard test, the timed
unseen-system placement, and the latency budget with real numbers.

Required active work: the design-axes table (5 systems), from-memory shape-annotated
diagram, latency-budget worksheet, convergent-recipe memo, and the timed placement of an
unseen system.

Last verified: 2026-08-21
