# l4-vit — Vision Transformers

Concept: An image becomes a token sequence: split into P×P patches, flatten each, linearly embed, add positional embeddings (+ optional [CLS]), and feed the SAME transformer encoder the learner already built. N = HW/P² tokens. The architectural content is deliberately small — the insight is the unification (patches-as-tokens is what lets one transformer consume vision + language + actions), plus the inductive-bias tradeoff: ViTs lack convolution's locality/translation priors and need pretraining scale to win, which is why robot stacks consume PRETRAINED ViTs (SigLIP, DINO) rather than training from scratch.

Learner prerequisites: l4-transformer at gold (owns transformer blocks — this node REUSES them); l4-cnn (inductive-bias contrast requires knowing what convolution buys); einops/reshape comfort from tensor work; CIFAR pipeline from l4-training-loop lineage.

What beginners commonly misunderstand:
- "ViT = new architecture." It is ~40 new lines on top of a stock transformer encoder: patchify + linear embed + position embeddings + a pooling/classification choice. Learners who missed this rebuild everything and learn nothing new.
- Patch embedding IS a strided convolution (Conv2d with kernel=stride=P) — the two implementations are identical; seeing this dissolves the CNN-vs-ViT mystique.
- No causal mask: encoders attend bidirectionally — learners fresh from GPT reflexively mask and silently cripple the model.
- Small-data reality: ViT-from-scratch on CIFAR-10 LOSES to a matched-param CNN — that's the correct experimental result, not a bug; the paper's point is that scale+pretraining reverses it. (UvA T15 is chosen partly because it is honest about the small-data tricks.)
- Token count drives compute quadratically: 224×224 at P=16 → 196 tokens; 336×336 at P=14 → 576 tokens — the arithmetic behind VLA latency budgets (the node diagnostic).
- [CLS] vs mean-pooling is a choice, not a law; modern backbones vary.

Candidate videos:
1. CS231n Spring 2025, Lecture 8 (Attention and Transformers) — ViT segment — Stanford — https://www.youtube.com/watch?v=RQowiOF_FvQ [live ✓ in search results]; ViT content confirmed at slides 100–109 of https://cs231n.stanford.edu/slides/2025/lecture_8.pdf [live ✓ — patchification, linear projection, positional encoding, no masking, average pooling + classifier] (correctness 5, prereq fit 5 — lands exactly after their transformer lecture like ours, clarity 4, time-efficiency 5 AS A SEGMENT (~15–20 min [video timestamps unverified — navigate by slides 100–109]), rigor 4, community signal 4, datedness low)
2. Learner-produced ViT walkthrough notes/videos (e.g., https://stevengong.co/notes/Vision-Transformer [live ✓ — notes, not video]) (community-grade; fine as recall check, not core)
3. Paper-explainer videos (Yannic Kilcher's ViT review et al.) — none found this session (search budget exhausted before video-candidate pass) — fallback: none needed; the segment in #1 + paper + code read cover explanation at lower time cost.

Candidate written resources:
1. An Image is Worth 16x16 Words (ViT) — Dosovitskiy et al., ICLR 2021 — arXiv 2010.11929 per repo paper ladder (paper-vit, READ, spine) [repo research-phase verified 2026-08-21 [F-id]] (the node's first REAL full paper read: method §3 + Fig 1 are self-explanatory to someone who built a transformer; results §4 carries the scale-vs-inductive-bias argument)
2. lucidrains/vit-pytorch, vit.py read line-by-line — Phil Wang — url per repo resources.ts (github.com/lucidrains/vit-pytorch) [repo research-phase verified 2026-08-21 [F], 25.5k★ active] (~150 lines; einops-first style is itself educational; the repo's chosen primary — keep)
3. UvA DL Notebooks, Tutorial 15: Vision Transformers — Phillip Lippe — rendered at uvadlc-notebooks.readthedocs.io [T6 sibling page live ✓ this session; the T15-specific URL not individually verified — locate via the readthedocs sidebar, same site] (honest about small-data ViT tricks — exactly the failure mode the CIFAR bake-off will hit; node backup — keep)
4. CS231n 2025 community notes covering the ViT lecture (https://github.com/raimbekovm/cs231n-2025-notes) [live ✓] (recall-check material)

Community evidence:
- Independent learner note sites treat ViT as "transformer + patch embedding," matching the reuse-your-blocks framing (https://stevengong.co/notes/Vision-Transformer) [live ✓]
- Active 2025-cohort CS231n note repos confirm the ViT material now sits inside the attention/transformers lecture — i.e., a segment, not a course unit (https://github.com/raimbekovm/cs231n-2025-notes) [live ✓]
- Research-phase pedagogy note [repo]: UvA T15 chosen over other tutorials specifically for honesty about why small-data ViTs underperform — protects the learner from interpreting the correct bake-off result as personal failure.

Primary technical authority:
- Dosovitskiy et al. 2021, arXiv 2010.11929 (the equation in the node — z₀ = [x_cls; x₁E; …; x_NE] + E_pos — is the paper's Eq. 1) [repo paper ladder]
- Reference implementation: lucidrains/vit-pytorch vit.py [repo-verified]

Selected shortest-sufficient packet:
- DIAGNOSTIC: 5 min, cold: "336×336 image, P=14 — how many tokens, and why does that number matter for VLA latency? What two inductive biases does a CNN have that a ViT lacks?" Fluent ⇒ go straight to IMPLEMENT.
- ORIENT: — (the transformer node IS the orientation; add nothing)
- CORE WATCH: CS231n 2025 L8 ViT segment (~15–20 min): https://www.youtube.com/watch?v=RQowiOF_FvQ navigating by slides 100–109 (patchify → linear projection → positions → NO mask → pool → classify). Watch AFTER attempting the patchify drill below, as confirmation rather than instruction.
- CORE READ: ViT paper arXiv 2010.11929 — §1, §3 (method + Eq. 1), Fig 1, then §4.5/Fig (data-scale crossover) — ~45 min with notes; then vit.py line-by-line (~45 min), annotating every einops rearrange with the shape it produces.
- INTERACTIVE: — (no patch/ViT widget exists; attention-vis already served the mechanism in l4-attention)
- PRACTICE: node exercises: patchify by hand with einops/reshape and verify N and dims for 224×224 P=16 (196 tokens, 768-dim flattened patches); CIFAR bake-off — your l4-cnn CNN vs a small ViT at matched params, 3 seeds each, and EXPLAIN the gap via inductive bias, citing the paper's Fig-scale argument.
- IMPLEMENT/DERIVE: patch embedding + full ViT forward from scratch REUSING your l4-transformer Block class (only new code: patchify, pos-embed, pooling head); prove your patch embed equals Conv2d(3, d, kernel_size=P, stride=P) numerically; train on CIFAR-10.
- STUCK PATH: UvA Tutorial 15 (readthedocs, node backup) — a second full implementation voice, including the small-data tricks (narrow ViT, more regularization) if your CIFAR ViT won't train.
- DEEPEN: paper-mae skim (masked autoencoders, repo ladder) for where ViT pretraining went next; DINO/SigLIP context defers to l4-clip-contrastive and l8-repr-learning — do not chase it here.
- PROVE IT: node mastery test: implement patch embedding + ViT forward from scratch and train it; trace shapes 224×224 → logits from memory at a whiteboard.
- TRANSFER: patchify a NON-RGB modality: take a 64×64 single-channel synthetic depth map, patchify at P=8, run it through your unchanged ViT trunk, and explain in three sentences why nothing needed to change — the modality-agnosticism that makes patches-as-tokens the substrate of multi-camera VLA encoders; compute the token budget for a 2-camera 224² P=14 robot setup.
- RETENTION: +7 days: token-count arithmetic cold for three new (H, W, P) configs + state the CNN-vs-ViT bias tradeoff in two sentences; +30 days (pre-BOSS): re-derive patchify-as-strided-conv on paper.

Why this won: This node is a REUSE node: the shortest sufficient path is paper + 150-line reference read + own-blocks implementation, with a single 15–20-min lecture segment as confirmation — no long-form video earns its minutes when the learner owns the transformer already. The CS231n L8 segment was pinned to slides 100–109 by live search evidence this session, converting "watch a vision lecture" into a surgical segment. vit-pytorch and UvA T15 keep their repo roles (both research-phase verified today); granularity added: the Conv2d-equivalence proof, the matched-param bake-off protocol, and the VLA token-budget arithmetic.

What was rejected (and why): a dedicated ViT lecture or explainer video as core (segment suffices; the architecture is 40 lines of delta); UvA T15 as primary (second implementation voice is redundant until stuck — demoted to STUCK PATH, matching its repo backup role); MAE/DINOv2/SigLIP depth here (owned by later nodes — scope discipline); timm's vision_transformer.py as the read (production-grade generality obscures the idea; vit.py's 150 lines teach more per minute).

Risk of superficial understanding: Two traps. (1) "ViT is easy" — true architecturally, false experimentally; the bake-off with seeds + explanation forces contact with the inductive-bias reality. (2) Reading vit.py while nodding at einops without shape-annotating every rearrange — the line-by-line annotation requirement and the whiteboard shape-trace in PROVE IT close it. Also guard against skipping the paper because the code is readable: §4's scale argument is the WHY that code cannot teach.

Required active work: patchify drill with verified counts; Conv2d-equivalence numerical proof; from-scratch ViT (own blocks) trained on CIFAR-10; matched-param bake-off over 3 seeds with written explanation; depth-map transfer; whiteboard shape trace 224×224→logits.

Last verified: 2026-08-21
