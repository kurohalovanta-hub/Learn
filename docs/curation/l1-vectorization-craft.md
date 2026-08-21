# l1-vectorization-craft — Vectorization Craft (Thinking in Arrays)

Concept: The jump from "knows NumPy functions" to "thinks in arrays": translating problem statements into array formulations (uniform/temporal/spatial vectorization), reading einsum/tensordot fluently, and profiling before optimizing. This is the exact cognitive skill behind writing (not copying) batched PyTorch code.

Learner prerequisites: l1-numpy at gold-track fluency — broadcasting rules predictable cold, axis semantics solid, views vs copies understood. timeit/%timeit from the notebook workflow.

What beginners commonly misunderstand:
- Vectorization treated as syntax substitution ("replace `for` with np.something") when the hard step is REFORMULATING the problem — Rougier's own chapter split (code vectorization vs problem vectorization) exists to name this gap, and his book warns problem vectorization "means you fundamentally have to rethink your problem".
- Neighbor-dependent updates (Game of Life, convolutions) look "inherently sequential" until the shifted-slices trick is seen once.
- einsum read as cryptic magic instead of three mechanical rules (repeated index ⇒ multiply along it; omitted output index ⇒ sum it; kept index ⇒ preserved axis).
- Optimizing without measuring — micro-"vectorizing" the wrong 5% while the real loop dominates; or trusting speed while silently changing outputs (no allclose check).
- Memory blindness: broadcasting temporaries like (N,N,2) can dwarf the arithmetic cost; fast ≠ free.

Candidate videos:
1. Einsum Is All You Need: NumPy, PyTorch and TensorFlow — Aladdin Persson — duration [unverified] — https://www.youtube.com/watch?v=pkVwUVEHmfI (published 2020-07-18 per search record; walks the notation across all three frameworks — exactly the transfer story this curriculum wants; concepts not dated; visual walkthrough suits notation-anxiety; kept as stuck-path since the written guide is faster)
2. Einsum Operator as used in Numpy, TensorFlow and PyTorch — creator [unverified] — duration [unverified] — https://m.youtube.com/watch?v=lr4RvdMOI4w (alternate einsum walkthrough; not evaluated beyond search record)
3. no broader vectorization-craft video shortlisted: the skill is worked-case-study-shaped, and the definitive worked case studies are Rougier's text (below); search budget also ended before a wider video pass.

Candidate written resources:
1. From Python to NumPy — Nicolas P. Rougier, 2017, open access — https://www.labri.fr/perso/nrougier/from-python-to-numpy/ (existing repo primary; URL confirmed in search results; site egress-blocked here so structure verified via source repo https://github.com/rougier/from-python-to-numpy). Ch. 4 "Code vectorization" — verified sections: Uniform vectorization (THE Game of Life build: Python impl → NumPy impl → Gray-Scott reaction-diffusion exercise), Temporal vectorization (Mandelbrot + faster variant + fractal-dimension exercise), Spatial vectorization (boids). Ch. 5 "Problem vectorization" — verified sections: path finding (Bellman-Ford), fluid dynamics, blue noise sampling. NOTE — correction to the node record: there is NO "gradient descent case" chapter in this book; the node's `primary.sections` text should read "(Game of Life; Mandelbrot; boids)".
2. A basic introduction to NumPy's einsum — ajcr — https://ajcr.net/Basic-guide-to-einsum/ (~15 min; label-the-axes pedagogy, builds from `('i,i->i')` upward; notes einsum's speed/memory edge over temporary-array broadcasting; the standard first einsum read)
3. Einsum is All you Need — Einstein Summation in Deep Learning — Tim Rocktäschel, 2018 — https://rockt.ai/2018/04/30/einsum (einsum in numpy/PyTorch/TF with DL model examples; the bridge from this node to L3+; deepen, not core)
4. Shape Rotation 101: An Intro to Einsum and Jax Transformers — https://huggingface.co/blog/dejavucoder/einsum (2020s framing, transformer-flavored; alternate deepen)
5. 100 NumPy exercises — Rougier — https://github.com/rougier/numpy-100 (verified; graded drill pool with hints+solutions variants; exercise numbers below verified against the file this session)

Community evidence:
- HN threads on From Python to NumPy (https://news.ycombinator.com/item?id=13355034, and 2022 repost https://news.ycombinator.com/item?id=31688667): sustained multi-year practitioner endorsement of the case-study approach; commenters pair it with numba for the cases vectorization can't reach — a useful boundary to know exists (thread bodies not readable this session — egress-blocked; existence + reception via search records)
- fast.ai forums recommend the book for array programming (https://forums.fast.ai/t/from-python-to-numpy/97818) — DL-practitioner audience confirming the numpy→DL transfer claim
- HN thread on the ajcr einsum guide (https://news.ycombinator.com/item?id=30972389) — the guide is the community's canonical einsum on-ramp
- Jessica Stringham's einsum study notes (https://gist.github.com/jessstringham/5483028423c350d7b771d5c0482be246) — learners independently converge on "small examples first" for this notation

Primary technical authority:
- Rougier, From Python to NumPy (open-access book, source repo verified this session) for vectorization method; NumPy 2.5 docs (einsum reference & broadcasting, see l1-numpy record) for semantics ground truth.

Selected shortest-sufficient packet:
- DIAGNOSTIC: node diagnostic — read `np.einsum('ij,jk->ik', A, B)` aloud, then `('bij,bjk->bik', ...)`; plus: vectorize `[x*x for x in xs]` and a running sum in 3 minutes. ~8 min.
- ORIENT: — (l1-numpy just ended; go straight to the case study)
- CORE WATCH: — (text + typing beats video for notation and case studies; einsum video reserved below)
- CORE READ: From Python to NumPy ch. 4 "Code vectorization": Introduction + Uniform vectorization/Game of Life worked line-by-line at the keyboard (~45 min with typing), then Temporal vectorization/Mandelbrot as a read (~15 min), boids as a skim (~5 min) → ajcr einsum guide (~15 min). ≈80 min total.
- INTERACTIVE: — (no in-app widget for array programming)
- PRACTICE: (1) node exercise — Conway's Game of Life step with zero loops, WITHOUT reopening the book (allowed: your notes), verified against a 5-loop reference on random grids; (2) node exercise — batch polynomial evaluation via Vandermonde matrix; (3) numpy-100 (https://github.com/rougier/numpy-100) verified exercises: #58 subtract row means, #64/#65 index-accumulation (np.add.at — where naive vectorization silently fails), #67 sum over last two axes at once, #71 (5,5,3)×(5,5), #78 point-to-lines distances, #87 4×4 block-sum, #97 einsum equivalents of inner/outer/sum/mul; (4) %timeit every solution against its loop version and record the ratio.
- IMPLEMENT/DERIVE: node exercise as the centerpiece — matmul three ways: triple loop, broadcasting+sum (`(A[:,:,None]*B[None,:,:]).sum(axis=1)`), and `np.einsum('ij,jk->ik')`; assert allclose across all three, time all three at n∈{50,200,500}, and DERIVE on paper why the broadcast version allocates an (n,n,n) temporary while einsum doesn't.
- STUCK PATH: einsum not clicking from text → Aladdin Persson video (https://www.youtube.com/watch?v=pkVwUVEHmfI, duration [unverified]); Game of Life shifted-slices not clicking → re-derive neighbor counts on a 4×4 grid by hand, then the book's NumPy section again (alt rendering of ch. 4: https://lhoupert.fr/test-jbook/04-code-vectorization.html).
- DEEPEN: ch. 5 "Problem vectorization" (path finding case → foreshadows value iteration at L10); Rocktäschel's einsum post for the PyTorch bridge; Gray-Scott reaction-diffusion exercise from ch. 4 if the itch exists.
- PROVE IT: node masteryTest — vectorize an unseen simulation kernel (loop version provided) to ≥50× speedup with allclose-identical output, narrating the reformulation before writing code.
- TRANSFER: vectorize the P1 projectile parameter sweep — all launch angles as one (K,) axis integrated simultaneously as (K,2) state arrays, no Python loop over angles; and rewrite l1-control-flow's 10,000-dice-rolls histogram with zero loops (np.random + bincount).
- RETENTION: day +10 — from memory: pairwise distance matrix via broadcasting AND via einsum (`'ij,ij->i'` trick for squared norms), allclose-checked; read 3 unseen einsum strings aloud including a batched one.

Why this won: Rougier ch. 4 is the only resource that teaches the reformulation move itself through complete honest case studies rather than isolated tricks — and it is the repo's existing verified primary; this pass adds precise section-level granularity (which sections, in what mode: work/read/skim) and corrects its section note (no gradient-descent case exists in the book). The ajcr guide turns einsum from folklore into 15 minutes of mechanics, unlocking the node's reading-fluency objective and the diagnostic. The packet spends ~80 minutes consuming and reserves the node's remaining ~2.5 h for timed, allclose-verified implementation — the only place this skill actually forms.

What was rejected (and why): Making the einsum video CORE WATCH — the written guide is faster, and duration couldn't be verified; video demoted to stuck-path. Rocktäschel as core — assumes DL context the learner won't have until L3; deepen. From Python to NumPy ch. 5 as core — problem vectorization's cases (fluids, blue noise) are heavier than a 4-hour L1 node supports; the masteryTest exercises the same muscle at the right scale, ch. 5 kept as deepen with the path-finding case flagged for its L10 payoff. Full numpy-100 sweep — the seven verified exercises above map one-to-one onto this node's objectives; bulk drilling would displace the timed kernel work.

Risk of superficial understanding: The signature failure is memorizing THE Game of Life solution instead of the move that produced it — recognition-as-mastery in its purest form, and this learner's known risk. Mitigations built in: the practice re-derivation is closed-book, the mastery kernel is unseen, the transfer tasks (angle sweep, dice histogram) come from different problem families, and every claimed speedup must carry an allclose proof so correctness is never traded silently for speed.

Required active work: closed-book Game of Life; matmul-three-ways with timings and the temporary-array derivation; 7 targeted numpy-100 exercises with loop-version timings; unseen-kernel mastery sprint; two cross-family transfer vectorizations.

Last verified: 2026-08-21
