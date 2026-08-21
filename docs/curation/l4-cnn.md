# l4-cnn — Convolutions & CNNs

Concept: Convolution as weight sharing over space — the same small kernel slid across the image, giving translation equivariance and parameter counts independent of image size. From that primitive: stride/padding shape arithmetic, channels as learned feature banks, pooling and receptive-field growth, feature hierarchies, and ResNet's identity shortcut (y = F(x) + x) as the fix that made depth trainable. Target fluency: predict every layer's output shape and parameter count on paper before running.

Learner prerequisites: l4-training-loop (owns train.py, DataLoader, checkpointing); matrix/vector fluency (L2); trained MLPs (L3) — so the learner already knows fully-connected nets and can feel what weight sharing buys; NumPy indexing for the by-hand conv implementation.

What beginners commonly misunderstand:
- Shape arithmetic: out = ⌊(n + 2p − k)/s⌋ + 1 is memorized but not owned — off-by-one errors at stride 2 are the #1 beginner bug; the node's 10-stack paper drill exists for exactly this.
- Channels: a "3×3 conv" on a 16-channel input is a 3×3×16 kernel — one filter spans ALL input channels; params = (k·k·C_in + 1)·C_out. Most first counts miss the C_in factor or the bias.
- Pooling has no parameters and stride-2 conv can replace it — learners conflate "downsampling" with "pooling layer."
- Receptive field grows with depth; two stacked 3×3 convs see 5×5 with fewer params and more nonlinearity than one 5×5 — the "why 3×3 stacks beat 7×7" diagnostic.
- Deep plain nets degrade even on TRAINING error (not overfitting!) — the precise observation ResNet's shortcut fixes; learners who miss this think residuals are a regularizer.
- DL libraries implement cross-correlation and call it convolution (no kernel flip) — a trap when the learner meets true convolution in signal processing or the 3B1B video.

Candidate videos:
1. Stanford CS231N Spring 2025, Lecture 5: Image Classification with CNNs — Stanford (10th-anniversary edition, taught Apr 15 2025) — duration [unverified, typical ~1h15] — https://www.youtube.com/watch?v=f3g1zGdxptI [live ✓ in search results]; slides https://cs231n.stanford.edu/slides/2025/lecture_5.pdf [live ✓] (correctness 5, prereq fit 5 — assumes exactly linear-classifier+MLP background, clarity 4, intuition 4, rigor 4, time-efficiency 3 full / 4 as segments at 1.25×, exercise compatibility 5 — feeds assignment A1/A2, future relevance 4, production 4, community signal 5 — CS231n remains the canonical vision course per csdiy.wiki review, datedness low)
2. Stanford CS231N Spring 2025, Lecture 6: CNN Architectures (BatchNorm, transfer learning, AlexNet/VGG/ResNet) — Stanford — duration [unverified] — https://www.youtube.com/watch?v=aVJy4O5TOk8 [live ✓]; slides https://cs231n.stanford.edu/slides/2025/lecture_6.pdf [live ✓] (correctness 5, clarity 4, time-efficiency for THIS node 3 — the BatchNorm/training half belongs to l4-training-dynamics; the architecture/ResNet half is this node's payload — use as segment)
3. But what is a convolution? — 3Blue1Brown — 23 min — https://www.youtube.com/watch?v=KuXjwB4LzSA [live ✓; duration 23 min per result snippet; lesson page https://www.3blue1brown.com/lessons/convolutions/ [live ✓]] (correctness 5, intuition 5 — sliding-window/weighted-average imagery incl. image blurring/edge kernels, prereq fit 5, BUT scope is math-convolution: the back half is probability + FFT, off-node — use the image-processing segment only, ~first 13 min [segment boundary approx])
4. CS231n 2025 Lecture 9 (Object Detection, Segmentation, Visualizing) — https://www.youtube.com/watch?v=PTypu6GqEd4 [live ✓] (REJECT for this node — downstream tasks; noted so the learner knows where detection lives when P4 tempts scope creep)

Candidate written resources:
1. CS231n course notes, "Convolutional Networks" module — cs231n.github.io [site live ✓ in search results; module path not individually verified this session] (the classic written treatment of conv/pool/shape arithmetic with worked numbers; CORE READ companion to L5)
2. Dive into Deep Learning, CNN chapters — d2l.ai per repo resources.ts (node backup) [repo research-phase verified 2026-08-21] (implementation-first alternate explanation; the corr2d-from-scratch section pairs with the node's loop-conv exercise)
3. Deep Residual Learning (ResNet) — He, Zhang, Ren, Sun 2015 — arXiv 1512.03385 per repo paper ladder (paper-resnet, READ) [repo-verified] (read after the build; figures 1–4 + table 1 are the payload)
4. Community lecture notes for CS231n 2025 (https://github.com/raimbekovm/cs231n-2025-notes [live ✓]; independent note set https://www.studocu.com/en-us/document/stanford-university/computer-vision/lecture-6/126804323 [live ✓]) — secondary; useful as post-lecture recall checks

Community evidence:
- csdiy.wiki (the largest self-study curriculum wiki) still routes vision learners through CS231n and singles out the assignments as the lasting value — supports "lectures selectively, assignments seriously" (https://csdiy.wiki/en/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS231/) [live ✓]
- Multiple independent 2025-cohort note repos and note sites for L5/L6 exist within months of the lectures (raimbekovm repo, studocu L6 notes, YYZhang2025 solutions repo https://github.com/YYZhang2025/Stanford-CS231N) [all live ✓] — active-cohort signal for the Spring 2025 run specifically
- 3B1B's convolution video is the standard "what does sliding a kernel mean" reference (Class Central listing https://www.classcentral.com/course/youtube-but-what-is-a-convolution-133379) [live ✓]

Primary technical authority:
- CS231n (Stanford) lecture slides + notes for conv mechanics (slides lecture_5.pdf / lecture_6.pdf [live ✓]); He et al. 2015 (arXiv 1512.03385) for residual learning [repo paper ladder]; torch.nn.Conv2d documented semantics as the numerical oracle for the by-hand implementation [PyTorch docs per repo resources.ts]

Selected shortest-sufficient packet:
- DIAGNOSTIC: 6 min, cold: "Params in Conv2d(16→32, k=3)? Output shape of 64×64 input through [conv k5 s2 p2 → pool 2 → conv k3 s1 p1]? Why do two 3×3 convs beat one 5×5?" (node diagnostic + one shape chain). All three fluent ⇒ skip to IMPLEMENT + PROVE IT.
- ORIENT: 3Blue1Brown "But what is a convolution?" — first ~13 min only (discrete convolution + image kernels; stop before FFT) — https://www.youtube.com/watch?v=KuXjwB4LzSA — noting aloud the flip: DL's "conv" is cross-correlation.
- CORE WATCH: CS231n 2025 Lecture 5 (https://www.youtube.com/watch?v=f3g1zGdxptI) at 1.25× with slides open (~60 min effective), pausing at every shape example to compute it BEFORE the reveal; then Lecture 6 (https://www.youtube.com/watch?v=aVJy4O5TOk8) — the architectures/ResNet portion only, ~25 min [segment: locate via slides lecture_6.pdf AlexNet→VGG→ResNet run; timestamps unverified] — skip its BatchNorm/training half (l4-training-dynamics owns it).
- CORE READ: cs231n.github.io "Convolutional Networks" module note (~30 min) for the worked shape-arithmetic examples; ResNet paper (arXiv 1512.03385) §1, §3.1–3.3 + Fig 2/Table 1 (~30 min) after the build.
- INTERACTIVE: — (no conv widget exists; the by-hand conv implementation is the interaction)
- PRACTICE: node exercises: (1) implement conv2d with explicit loops on a 6×6 input, verify against nn.Conv2d to 1e-6; (2) the 10-stack shape-arithmetic paper drill before running each; (3) visualize first-layer filters + feature maps of a small trained CNN. Add: count params of VGG-11's first three blocks by hand.
- IMPLEMENT/DERIVE: a residual block class (y = F(x) + x with the 1×1-projection shortcut case), then a ≤500k-param CNN for 64×64 input with every shape and param count predicted on paper first — trained to sane accuracy (mastery-test rehearsal; the real test uses a fresh budget/spec).
- STUCK PATH: d2l.ai CNN chapters (repo backup) — its corr2d-from-scratch code is the gentlest re-derivation; or re-run the ORIENT segment and hand-slide a 3×3 edge kernel over a 6×6 grid on paper.
- DEEPEN: full CS231n Lecture 6 (BatchNorm half — as preview of l4-training-dynamics) and Lecture 9 later for detection/segmentation context; CS231n assignment A2 conv parts (repo cs231n resource) as the heavyweight forcing function if shapes still wobble.
- PROVE IT: node mastery test: design a CNN for 64×64 under <500k params, predict every layer's shape + param count on paper, verify with code, train it — plus a cold param-count of a config you've never seen.
- TRANSFER: 1-D convolution over a 240 Hz joint-torque time series (kernel 9, stride 4, causal padding): compute output lengths on paper, implement with nn.Conv1d, and explain why weight sharing over TIME is the same inductive bias as over space — the TCN encoder pattern in robot policies.
- RETENTION: +7 days: three cold shape/param drills (new configs); +30 days: sketch a residual block from memory and state, in two sentences, what problem it solved (training-error degradation, not overfitting).

Why this won: The node's existing CS231n L5–6 selection survives contact with live verification — the Spring 2025 videos are public and individually URL-confirmed this session — but is tightened from "CNN lectures (L5–6)" to exact usage: L5 in full at speed, L6 architectures-segment only, with the BatchNorm half explicitly rerouted to l4-training-dynamics (removing ~35 min of double-coverage). The 3B1B convolution segment (session-verified) is added as a 13-min ORIENT because this learner builds from geometric intuition, and the written cs231n module + ResNet paper give authority and rigor. Everything funnels into paper-first shape prediction, the node's real skill.

What was rejected (and why): running CS231n linearly (the 210-day budget bans course-completionism; the repo already scopes it "selective"); CNN-explainer-style interactive sites and misc YouTube explainers (could not be live-verified this session under the exhausted search budget, and the packet is already sufficient without them — none found: fallback is the ORIENT segment above); Lecture 9 detection/segmentation (downstream of this node's job); d2l as core (kept in its repo role: backup voice).

Risk of superficial understanding: Recognition risk is highest in shape arithmetic — nodding at ⌊(n+2p−k)/s⌋+1 while being unable to run a 6-layer chain cold. The paper-BEFORE-run drill discipline is non-negotiable, and the mastery test's param budget forces real design tradeoffs (channel widths vs depth) instead of copying a known net. Second risk: treating ResNet as trivia ("skip connections help") without the training-error-degradation observation — the paper read + diagnostic question guard it.

Required active work: loop-conv2d implementation matched to nn.Conv2d; 10+ paper shape drills; hand param counts (Conv2d(16→32,k=3) = 4,640 — verify); residual block build; budgeted-CNN design/train; 1-D torque-series transfer; filter/feature-map visualization.

Last verified: 2026-08-21
