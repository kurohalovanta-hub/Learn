# l4-transformer — The Transformer, Built & Trained

Concept: The decoder-only transformer as assembly of already-mastered parts: token+position embeddings → N× [x += MHA(LN(x)); x += MLP(LN(x))] → LN → LM head. The residual stream is the load-bearing mental model (blocks READ from and WRITE small updates into a persistent vector highway). The learner builds nanoGPT-class code, trains it on Shakespeare, and debugs it — the same architecture skeleton as π0, GR00T, and Gemini Robotics policies.

Learner prerequisites: l4-attention at GOLD (blank-file multi-head causal attention); l4-embeddings-lm (bigram/MLP LMs, sampling, train/val loss); l4-training-loop (owns the five-line loop, checkpointing); LayerNorm exposure from l4-training-dynamics is helpful but the block-level treatment here is self-contained.

What beginners commonly misunderstand:
- Residuals are additive updates to a persistent stream, not "skip wires for gradients" only — removing them at depth 6 collapses training (node ablation makes this visceral).
- Pre-LN vs post-LN: Karpathy builds pre-LN (norm INSIDE the residual branch), which is the 2026 default; the original paper's post-LN diagram misleads learners who read it first.
- The feed-forward MLP is per-token (position-wise) — no cross-token mixing happens there; all communication is in attention. Learners routinely draw the MLP as another mixer.
- "Overfit a single batch first" is a debugging ritual, not a failure — if your GPT cannot memorize 1 batch, the wiring is broken; many learners skip this and debug blind.
- Parameter count intuition: embeddings + per-block (4d² attention + 8d² MLP) — most first hand-counts forget the 4× MLP expansion or double-count tied weights.
- Loss ≈ ln(vocab) at init is a checkable prediction, not a coincidence — the standard sanity check learners don't know to run.

Candidate videos:
1. Let's build GPT: from scratch, in code, spelled out. — Andrej Karpathy — 1h56m (author-announced "New (1h56m) video lecture", https://x.com/karpathy/status/1615398117683388417 [live ✓]) — video id kCc8FmEb1nY (transcript mirror https://ytscribe.com/v/kCc8FmEb1nY [live ✓]); course listing https://karpathy.ai/zero-to-hero.html [live ✓ in results]. Full chapter map [live ✓ across two search result sets]: 00:00 intro/setup · 07:52 data exploration · 09:28 tokenization, train/val · 14:27 data loader · 22:11 bigram baseline · 34:53 training it · 38:00 port to script · 42:13–1:19:11 attention build (consumed by l4-attention) · 1:19:11 inserting a single self-attention block · 1:21:59 multi-headed self-attention · 1:24:25 feedforward · 1:26:48 residual connections · 1:32:51 layernorm (+ batchnorm relation) · 1:37:49 scaling up, dropout · then nanoGPT walkthrough + conclusions to 1:56. (correctness 5, prereq fit 5 given this curriculum's sequencing, clarity 5, intuition 5, rigor 4 — every line typed and motivated, time-efficiency 5 when packetized, exercise pairing 5, future relevance 5 — still the consensus 2026 entry per learner retrospectives below, production 4, community signal 5, datedness low — architecture unchanged; only positional scheme is updated later by l4-rope-tokenization)
2. CS231n Spring 2025 Lecture 8: Attention and Transformers — Stanford — [duration unverified] — https://www.youtube.com/watch?v=RQowiOF_FvQ [live ✓] (lecture-form recap with vision framing; REJECT as core — redundant after building; its ViT slides serve l4-vit)
3. 3Blue1Brown ch 5 "Transformers/GPT" — Grant Sanderson — [duration unverified, ~25 min class] — series page per repo resources.ts (3b1b-nn) [repo research-phase verified 2026-08-21] (high-level GPT tour; useful REWATCH after building per the repo's study note — kept as optional orient)

Candidate written resources:
1. microgpt — GPT in ~200 dependency-free lines — Andrej Karpathy (Feb 2026) — url per repo resources.ts (karpathy.github.io/2026/02/12/microgpt/) [repo research-phase verified 2026-08-21 [S]; not re-fetched this session] (the designated exit exam: cold-read + re-derive every line; instantly canonical per research report)
2. Decoder-Only Transformers: The Workhorse of Generative LLMs — Cameron R. Wolfe — https://cameronrwolfe.substack.com/p/decoder-only-transformers-the-workhorse [live ✓ in search results] (thorough prose treatment of exactly the decoder-only architecture; strong alternate explanation with different voice — STUCK-PATH read)
3. The Annotated Transformer (2022 rewrite) — Harvard NLP — url per repo resources.ts [repo-verified] (the encoder–decoder completion; one pass AFTER the decoder-only build, per node backup)
4. Building a Transformer (Cross-Attention and MHA Explained) — Eva Koroleva — https://xmarva.github.io/blog/2025/building-a-transformer/ [live ✓] (community build-along with encoder–decoder and cross-attention diagrams; secondary alternate)
5. UvA DL Notebooks Tutorial 6 — https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial6/Transformers_and_MHAttention.html [live ✓] (already consumed in l4-attention; its encoder/warmup sections remain reference here)

Community evidence:
- Learner retrospective (Sep 2025) of doing exactly this lecture: emphasizes that value came from typing and re-building, not watching — and that the video "still holds up" as the from-scratch path (https://aayushgarg.dev/posts/2025-09-08-building-gpt-from-scratch.html) [live ✓]
- Multi-part learner blog (Nov 2025) still working through v7 concept-by-concept — evidence the lecture rewards slow packetized study, and that the matmul/attention middle is where effort concentrates (https://philippeadjiman.com/blog/2025/11/14/gpt-from-scratch-4-the-mathematical-trick-behind-self-attention/) [live ✓]
- Follow-along repos and companion sites keep appearing (org-mode rebuild https://github.com/gs-101/nanoGPT-from-scratch; community companion app https://zero-to-hero.app/; walkthrough notes https://swe-to-mle.pages.dev/posts/lets-build-nanogpt/; Kaggle mirror notebook https://www.kaggle.com/code/chizkidd/let-s-build-gpt-from-scratch-in-code-spelled-out) [all live ✓] — an unusually deep ecosystem of learner scaffolding, and a signal that "code it yourself" is the community-converged usage mode.
- GeekNews thread on Z2H as the standard self-study series (https://news.hada.io/topic?id=8322) [live ✓]

Primary technical authority:
- Vaswani et al. 2017 (arXiv 1706.03762) read TWICE after building, per paper ladder (paper-attention, spine) [repo-verified]
- GPT-2 report (paper-gpt2, SKIM) for the decoder-only + scale bet [repo-verified]
- Karpathy's nanoGPT / ng-video-lecture code as the reference implementation lineage [repo research-phase verified: repos alive, nanoGPT 62.3k★, README marks it legacy in favor of nanochat — fine: the teaching value is unchanged]

Selected shortest-sufficient packet:
- DIAGNOSTIC: 10 min, on paper: draw the full decoder-only forward pass for batch 4, block_size 8, d=32, 4 heads, 2 blocks — every module and every shape, plus "what loss do you expect at init for vocab 65 and why?" (−ln(1/65)≈4.17). Fluent pass ⇒ jump to PROVE IT.
- ORIENT: optional 3B1B ch 5 rewatch at 1.5× if the residual-stream picture has faded (repo resource) — otherwise —
- CORE WATCH: Karpathy v7 in four packets with mandatory reconstruction between (total new watching ~55 min, since 42:13–1:19:11 was done in l4-attention): P1 00:00–42:13 at 1.5–2× as recap ONLY (bigram/dataloader are l4-embeddings-lm material) — reconstruct get_batch + bigram loss from memory; P2 skim your l4-attention notes, do not rewatch; P3 1:19:11–1:37:49 at 1× — after it, build Block (MHA + FFN + pre-LN residuals) blank-file; P4 1:37:49–end — then add dropout/scaling knobs and read his nanoGPT tour with your code open side-by-side.
- CORE READ: microgpt (repo resource, ~200 lines) as the exit exam — cold line-by-line read AFTER your rebuild; note where his choices differ from yours (RMSNorm, KV-cache) and say why they're equivalent-or-better.
- INTERACTIVE: attention-vis (revisit from l4-attention) — predict what head 0 vs head 3 of your TRAINED Shakespeare model attends to before inspecting real maps from your checkpoints.
- PRACTICE: node exercises: hand parameter-count from config then verify vs numel(); ablate residuals at depth 6 and explain the collapse via gradient flow; PLUS the init-loss sanity check (≈ln vocab) and the overfit-one-batch ritual as standing habits.
- IMPLEMENT/DERIVE: nanoGPT-style decoder-only transformer on Shakespeare (node implementation): overfit 1 batch → full training with sampling checkpoints → loss curves. Second pass = REBUILD ALONE from a blank file (this is what "twice" means — not re-watching).
- STUCK PATH: Cameron Wolfe's decoder-only article (https://cameronrwolfe.substack.com/p/decoder-only-transformers-the-workhorse) for a prose re-derivation; or Karpathy 1:26:48–1:37:49 rewatch for residual/LN placement specifically.
- DEEPEN: The Annotated Transformer once, for the encoder–decoder completion (repo backup); UvA T6 warmup/optimizer sections for why transformer training needs LR warmup.
- PROVE IT: node mastery test: rebuild the full GPT from memory in one sitting (aided only by shapes on paper), train to coherent Shakespeare, then the microgpt cold-read line-by-line as the oral exit exam.
- TRANSFER: retarget your unchanged architecture at ACTION tokens: discretize a synthetic 2-DOF trajectory dataset (sine/cosine joint waveforms) into 256 bins, train the same GPT to autoregress motor tokens, and sample a trajectory — then state in three sentences why RT-2-style VLAs are "this machinery pointed at motors."
- RETENTION: +7 days: parameter-count a NEW config cold and predict init loss; +30 days (pre-BOSS): blank-file Block class in ≤15 min, and re-answer the four Karpathy "notes" on attention from memory.

Why this won: v7 is the only resource where the learner types every line of a working GPT with a live loss curve — and this curriculum has already paid for its prerequisites, so the marginal cost here is ~55 min of new video + rebuild time. The chapter map (live-verified this session) turns the 1h56 monolith into four reconstruction-gated packets, honoring the "never passive binging" directive; the attention middle is explicitly delegated to l4-attention so no minute is watched twice. microgpt (Feb 2026) as cold-read exit exam upgrades "I followed the video" into "I can read someone else's minimal GPT and account for every line."

What was rejected (and why): CS231n L8 as core (recap-shaped, vision-framed, redundant after building); The Annotated Transformer as core (encoder–decoder first is the wrong order for a decoder-only-first curriculum — kept as the single backup pass); nanochat/CS336 (post-curriculum scale, flagged in research report as the NEXT stage); any "transformer explained" explainer video beyond 3B1B (the learner is past explanation and into construction).

Risk of superficial understanding: The classic failure is "my loss went down because I typed what he typed." Counters: the blank-file rebuild (not optional), the sabotage-resistant habits (overfit-1-batch, init-loss prediction), the residual-ablation exercise producing an explained failure, and the microgpt cold read — which cannot be passed on pattern-matching because the implementation choices differ (RMSNorm, KV-cache, no nn.Module). Watch also for calendar-brain: the node is 10 h nominal but gates on capability; a rushed rebuild that needed the video open is a Silver, not a Gold.

Required active work: two full builds (guided, then blank-file), Shakespeare training run with checkpoint sampling, hand parameter-count + numel verification, residual ablation with gradient-flow explanation, action-token transfer run, microgpt cold read.

Last verified: 2026-08-21
