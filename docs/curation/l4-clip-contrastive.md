# l4-clip-contrastive — CLIP, SigLIP & Contrastive Multimodality

Concept: Two encoders (image ViT, text transformer) trained so matched pairs land close and mismatched pairs land far in one shared embedding space. CLIP's objective: an N×N cosine-similarity matrix per batch, temperature-scaled, with symmetric cross-entropy against the diagonal. Zero-shot classification = embedding class-name prompts and taking the nearest text vector. SigLIP replaces the batch-softmax with per-pair sigmoid, removing the large-batch requirement. Practically for robotics: these backbones stay FROZEN and policies consume their features — "frozen backbone + probe" practiced here is exactly how π0-class VLAs use SigLIP.

Learner prerequisites: l4-vit at gold (the image tower IS a ViT); l4-transformer (the text tower); cross-entropy + softmax + temperature from l3/l4-embeddings-lm; cosine similarity/normalization from L2; the linear-probe idea (logistic regression on features) from L3 classic ML.

What beginners commonly misunderstand:
- Where the negatives come from: there is no negatives dataset — every OTHER pair in the batch is a negative, which is exactly why contrastive training wants huge batches (32k for CLIP) and why SigLIP's per-pair sigmoid relaxes it (the node diagnostic).
- Temperature τ is not a detail: it scales similarity logits before softmax; CLIP LEARNS it (as a clamped log-parameter). Too high ⇒ uniform gradients; too low ⇒ hardest-negative dominance. Toy-implementation sweeps make this visible.
- The loss is symmetric — CE over rows (image→text) AND columns (text→image), averaged; implementing only one direction is the classic toy-CLIP bug (the equation in the node encodes both).
- Embeddings must be L2-normalized before the dot product — unnormalized similarity silently changes the geometry.
- Zero-shot ≠ magic: the text encoder turns prompt strings into a classifier weight matrix; prompt wording therefore IS model surgery ("a photo of a {label}" exists because it measurably helps).
- CLIP features are semantic, not spatial: counting, precise localization, and fine spatial relations are weak — exactly why VLAs add action experts and why DINO-family features complement CLIP-family ones for control.
- Linear probe ≥ zero-shot with even ~50 labels is the expected result, not a disappointment — it is the workflow lesson of the node.

Candidate videos:
- None live-verified this session: the session's shared WebSearch budget was exhausted before this node's video-candidate pass, and video-hosting/aggregator domains are egress-blocked from this sandbox. Fallback per brief: no CORE WATCH — this is deliberately a paper+code node; the repo's research phase (2026-08-21) likewise selected no video for it. Optional lecture-form alternative if wanted later: CS231n Spring 2025 Lecture 16 "Vision & Language" — the Spring-2025 playlist itself is live-verified (https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16 [live ✓]); the L16-specific video URL is [unverified this session — locate inside that playlist].

Candidate written resources:
1. CLIP paper — Radford et al. 2021, "Learning Transferable Visual Models From Natural Language Supervision" — arXiv 2103.00020 per repo paper ladder (paper-clip, READ, spine) [repo research-phase verified 2026-08-21 [F-id]] (§2 method incl. Fig 3 pseudocode — the 15-line numpy-style pseudocode of the loss is the single highest-value figure; prompt-engineering discussion; SKIM the eval avalanche)
2. SigLIP paper — Zhai et al. 2023, "Sigmoid Loss for Language Image Pre-Training" — arXiv 2303.15343 per repo paper ladder (paper-siglip, SKIM) [repo-verified] (read §1 + the loss definition; the point is WHAT constraint the sigmoid removes)
3. OpenCLIP repo docs/README — mlfoundations — github.com/mlfoundations/open_clip per repo resources.ts [repo research-phase verified 2026-08-21 [F], 14.1k★, active through 2026 incl. SigLIP models] (the working stack for zero-shot inference + frozen-feature probing; the repo's chosen primary — keep)
4. DINOv3 paper skim — per repo paper ladder (paper-dinov3, listed on the node) [repo-verified] (context only at this node: self-supervised features exist and complement contrastive ones; depth belongs to l8-repr-learning)

Community evidence:
- None live-gathered this session (search budget exhausted before the community pass for this node — recorded honestly per brief). Pedagogy signals carried from the repo's research phase [repo, verified 2026-08-21]: open_clip is the community-standard open implementation lineage (14.1k★, actively maintained with SigLIP/RoPE additions), and "training CLIP from scratch is out of scope — zero-shot + probe is the right learner interaction" (docs/research/reports/dl-ml-resources.md §8).

Primary technical authority:
- Radford et al. 2021 (arXiv 2103.00020) — the loss, Fig 3 pseudocode, prompt ensembling [repo paper ladder]
- Zhai et al. 2023 (arXiv 2303.15343) — the sigmoid variant [repo paper ladder]
- mlfoundations/open_clip — reference implementation + pretrained SigLIP/CLIP weights [repo resources.ts]

Selected shortest-sufficient packet:
- DIAGNOSTIC: 6 min, cold: "Why does contrastive training need large batches, and how does SigLIP relax that? What does temperature control? Write the shape of the similarity matrix for batch 32 and mark which entries are positives." Fluent ⇒ jump to IMPLEMENT.
- ORIENT: — (no video; the CLIP paper's Fig 3 pseudocode, read first, IS the orientation — 10 min on that one figure before anything else)
- CORE WATCH: —
- CORE READ: CLIP paper §1–2 + Fig 3 pseudocode + §3.1.4 prompt engineering (~40 min, second real paper read); SigLIP §1 + loss section (~15 min). Read with the question "what would I have to change in my toy loss?" open on paper.
- INTERACTIVE: — (no in-app widget for contrastive space; the toy implementation below is the interaction)
- PRACTICE: node exercises: (1) implement the CLIP loss on toy embeddings (random 8×d image + text vectors, planted matches) and verify the diagonal-target structure — reproduce Fig 3's pseudocode from memory first, then check against the paper; (2) zero-shot classify 20 of your own photos with open_clip using three prompt phrasings; measure the swing; then beat zero-shot with a linear probe on ~50 labeled examples. Add: sweep τ ∈ {0.01, 0.07, 0.5, 1.0} on the toy loss and plot gradient magnitude on hardest vs easiest negatives.
- IMPLEMENT/DERIVE: derive on paper that the symmetric CE gradient pulls matched pairs together and pushes batch-mates apart (2 short derivations, rows and columns); implement both CLIP-softmax and SigLIP-sigmoid losses side-by-side on the same toy batch and show they rank pairs consistently but scale differently with batch size (batch 4 vs 64).
- STUCK PATH: open_clip's actual loss implementation as the readable oracle (repo primary) — diff your toy loss against it line-by-line; if the geometry itself is unclear, revisit the l2 cosine-similarity material with two hand-drawn 2-D towers.
- DEEPEN: SigLIP full read + DINOv3 skim (repo ladder) for the self-supervised complement; CS231n 2025 L16 (Vision & Language) from the verified playlist if a lecture treatment is wanted; open_clip's zero-shot ImageNet evaluation script as engineering reference.
- PROVE IT: node mastery test: build a tiny two-tower contrastive model on a synthetic paired dataset (procedurally generated shape images ↔ caption strings), train it with YOUR loss, demonstrate zero-shot transfer to unseen shape/color combinations, and report the probe-vs-zero-shot gap.
- TRANSFER: robotics framing: embed 5 task-instruction strings ("pick up the red block", …) and 15 scene images with frozen open_clip weights; retrieve the matching instruction per scene by cosine similarity; then write one paragraph on where this retrieval breaks (spatial relations, counting) and why VLAs therefore need more than a frozen CLIP — connecting to paper-clip's ladder question.
- RETENTION: +7 days: rewrite Fig 3 pseudocode from memory incl. both CE directions and the learned τ; +30 days: cold-answer the node diagnostic and name which loss (softmax vs sigmoid) the 2026 VLA backbones use and why (SigLIP — batch-size decoupling; π0's PaliGemma lineage per paper-siglip note).
- Total packet: ~4.5–5 h core (reads 55m + toy losses/derivations ~2h + open_clip zero-shot/probe ~1.5h), inside the node's 6 h with PROVE IT.

Why this won: For a mechanism whose entire content is one loss function, papers-plus-implementation beats any explainer: CLIP's own Fig 3 pseudocode is shorter than a video's cold-open and is the authority itself. The existing repo selection (open_clip primary; CLIP READ / SigLIP SKIM on the ladder) survives as the spine; this pass adds the granularity that turns it into active work — the τ sweep, the symmetric-gradient derivation, the CLIP-vs-SigLIP side-by-side at two batch sizes, and the instruction-retrieval transfer that lands the "semantic substrate of VLAs" claim in the learner's own hands. No video slot is filled because none could be live-verified this session and none is needed — recorded per the brief's fallback rule.

What was rejected (and why): training any real CLIP (out of scope per research phase — compute and data are prohibitive and teach nothing extra over the toy); paper-explainer videos from memory (would violate URL-integrity — not verifiable this session); DINO-family depth here (l8-repr-learning owns it; this node needs only "self-supervised complements contrastive"); OpenAI's original CLIP repo as the workbench (open_clip is the maintained lineage with SigLIP weights, per research phase).

Risk of superficial understanding: The loss looks trivial in pseudocode, so the learner may "get it" in 10 minutes and skip the parts that carry the understanding: WHERE negatives come from, WHY τ is learned, WHY two CE directions. The batch-4-vs-64 experiment and the τ-sweep exist to force those into observation. Second risk: treating zero-shot accuracy as the point — the node's actual robotics payload is the frozen-features workflow (probe beats prompts with tiny labels), so the probe exercise is mandatory, not optional.

Required active work: Fig-3 pseudocode reproduced from memory; toy CLIP + SigLIP losses with diagonal-target verification; τ sweep with gradient plots; symmetric-gradient paper derivation; open_clip zero-shot with prompt-swing measurement + linear probe beating it; two-tower synthetic build with zero-shot transfer (mastery); instruction-retrieval transfer with written failure analysis.

Last verified: 2026-08-21
