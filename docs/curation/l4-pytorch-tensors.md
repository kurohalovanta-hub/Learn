# l4-pytorch-tensors — PyTorch: Tensors & Autograd

Concept: Tensors as NumPy arrays that (a) live on devices and (b) remember their computational history; autograd as the industrial version of the micrograd engine the learner built by hand in L3. The reverse-mode machinery is already understood — this node maps known ideas onto PyTorch's API surface (requires_grad, backward(), .grad, no_grad/detach, graph lifetime) and establishes device/dtype hygiene. Framed correctly, it is a translation exercise, not new theory.

Learner prerequisites: l3-mlp-numpy at GOLD (built an MLP + backprop in NumPy — the single fact this node's pedagogy leans on); micrograd lineage from the L3 spine (Value objects, topological backward pass); NumPy fluency incl. views-vs-copies and broadcasting (L1); chain rule owned (L2).

What beginners commonly misunderstand:
- .grad ACCUMULATES across backward() calls — it is +=, not = (deliberately, for grad accumulation) — hence optimizer.zero_grad(); the learner's own micrograd did the same thing, which is the teaching lever.
- Leaf vs non-leaf: only leaves (created by the user with requires_grad=True) retain .grad by default; intermediate tensors' grads are freed — "why is .grad None?" is the canonical first confusion.
- The graph is built dynamically on every forward and FREED on backward() — calling backward() twice without retain_graph errors; logging a raw loss tensor keeps the whole graph alive (the memory leak the node diagnostic targets: use .item() or .detach()).
- detach() vs no_grad(): detach cuts one tensor out of the graph; no_grad suspends recording in a scope — mixing them up produces silent non-training or crashes.
- In-place ops (x += …, x.relu_()) can invalidate saved activations — autograd raises the infamous "modified by an inplace operation" error; beginners read it as a bug in PyTorch.
- Device/dtype friction: PyTorch defaults to float32 (NumPy: float64); .numpy() shares memory on CPU with the tensor (mutation travels!) but requires .cpu() first from GPU; comparisons of CPU/GPU results need tolerances.
- torch.Tensor vs torch.tensor, and x.T on >2-D tensors, are small API traps that cost real time.

Candidate videos:
- None live-verified this session: the session-wide WebSearch budget was exhausted (200/200) before this node's candidate pass, and video domains are egress-blocked from this sandbox — recorded per the brief's integrity rule. Fallback: the node needs no CORE WATCH — the repo's research phase (2026-08-21) also selected none, and the micrograd→autograd bridge is stronger done as a re-derivation exercise than watched. (If a video slot is later wanted, re-verify candidates such as Karpathy Z2H v1's autograd sections — v1 "Building micrograd" 2h26 was duration-confirmed by the research phase — used as REWATCH-of-own-past-material, not new content.)

Candidate written resources:
1. PyTorch official "Learn the Basics" — PyTorch team — docs.pytorch.org/tutorials/beginner/basics/intro.html per repo resources.ts [repo research-phase verified 2026-08-21 [S], noted "updated 2026-01", PyTorch 2.13 era; not re-fetched this session — egress blocked] — sections for THIS node: Quickstart, Tensors, Autograd, typing everything (correctness 5, prereq fit 5, clarity 4, intuition 3 — API-first by design, which is fine AFTER micrograd, rigor 3, time-efficiency 5, exercise compatibility 4, future relevance 5 — first-party and current, community signal 4, datedness lowest possible: first-party docs)
2. Dive into Deep Learning, "Automatic Differentiation" section (preliminaries chapter) — d2l.ai per repo resources.ts [repo-verified; exact section path unverified this session] (alternate voice with runnable cells — STUCK PATH)
3. PyTorch autograd mechanics notes (docs.pytorch.org "Autograd mechanics") — [unverified this session; well-known first-party page — locate from pytorch docs index] (the authoritative leaf/graph-lifetime treatment — DEEPEN only)
4. microgpt — Karpathy 2026 — url per repo resources.ts [repo-verified] (its dependency-free autograd section is a future cross-check: at L4-exit the learner re-reads it and maps every line onto both their micrograd and torch autograd)

Community evidence:
- None live-gathered this session (budget exhausted — honest per brief). The misunderstanding list above is drawn from the node's own diagnostic design plus the research-phase pedagogy notes [repo, 2026-08-21]; the accumulate-grads / logging-leak / detach confusions are also exactly what the node's diagnostic question already encodes, indicating the repo's earlier community research reached the same signals.

Primary technical authority:
- PyTorch official documentation and tutorials (first-party, PyTorch 2.13) [repo resources.ts pytorch-tutorials]
- The learner's OWN micrograd + NumPy MLP as the semantic oracle: every PyTorch behavior in this node must be predicted from it before being observed.

Selected shortest-sufficient packet:
- DIAGNOSTIC: 8 min, cold: the node diagnostic — "What does loss.backward() do to leaf tensors? Why zero_grad()? What breaks if you forget detach in a logging line?" — answered from micrograd knowledge BEFORE touching the tutorial. Fluent conceptual answers ⇒ compress CORE READ to the Tensors + Autograd pages only (~45 min).
- ORIENT: 15-min self-task, no external source: open your L3 micrograd, write on paper the four things PyTorch must add to make it industrial (batched tensors, GPU kernels, operator library, memory management of the graph) — then read the tutorial hunting for each.
- CORE WATCH: —
- CORE READ: Learn the Basics: Quickstart → Tensors → Autograd (~90 min, typing every cell into your own fresh notebook, never copy-pasting; annotate each Autograd cell with the micrograd equivalent line in a comment).
- INTERACTIVE: backprop-graph (in-app widget) — rebuild the widget's graph in PyTorch and confirm .grad of every leaf matches the widget's displayed values.
- PRACTICE: node exercises: (1) recreate your finite-difference gradient checker and validate autograd on 5 functions (include one with detach planted mid-graph — predict the gradient before running); (2) time matmul CPU vs GPU across sizes 2⁶…2¹³, plot, find the crossover; (3) ∇‖Ax−b‖² via autograd matched to your L2 hand derivation (2Aᵀ(Ax−b)) to 1e-6.
- IMPLEMENT/DERIVE: the mastery-test rehearsal: linear regression three ways (manual grads / autograd / nn.Linear+optim) with identical fixed-seed losses, plus a one-paragraph note per abstraction on what it hid.
- STUCK PATH: d2l.ai automatic-differentiation section (repo backup voice); if graph-lifetime errors persist, deliberately trigger and read all three canonical errors (backward-twice, inplace-modified, grad-on-non-leaf) in a scratch notebook.
- DEEPEN: PyTorch "Autograd mechanics" doc note [unverified this session] only if leaf/retain semantics still surprise; Karpathy v1 rewatch of the backward() topological-sort segment as memory refresh (own past material).
- PROVE IT: node mastery test verbatim: three-way linear regression, identical losses on a fixed seed, with the explanation of what each abstraction hid — done days later, from a blank file.
- TRANSFER: differentiate through geometry: FK of a 2-link planar arm (x = l₁cos θ₁ + l₂cos(θ₁+θ₂), …) — autograd d(distance-to-target)/dθ, verified against your finite-difference checker; one gradient-descent loop that "reaches" the target. (Previews L5 Jacobians with zero forward-references — it is just the chain rule on sin/cos.)
- RETENTION: +7 days: cold-answer the diagnostic trio + hand-sketch what the graph of z = (x·y + x).sum() looks like and which tensors hold .grad; +30 days: the logging-leak question inside the l4-training-loop context (it recurs there naturally).
- Total packet: ~4 h core (orient 15m + read 90m + widget 15m + practice ~90m), leaving the node's 6 h budget room for PROVE IT + transfer.

Why this won: The existing primary (official Learn the Basics) is the correct spine — first-party, current (research-phase confirmed a 2026-01 update against PyTorch 2.13), and the only resource guaranteed to track API truth; no third-party video can beat docs-plus-own-micrograd for a learner who has ALREADY built backprop. The curation adds what the tutorial lacks: the micrograd-annotation discipline (every autograd behavior predicted before observed), the planted-detach gradient-check, the graph-lifetime error safari, and an FK transfer task that points the machinery at robotics. Video candidates were not fillable under this session's exhausted search budget — recorded honestly; the packet is sufficient without them.

What was rejected (and why): any "PyTorch in N hours" course video (redundant for someone with L3 gold — those courses re-teach backprop the learner owns); learnpytorch.io as core (research phase already scoped it backup-only for extra drilling); teaching nn.Module here (deliberately deferred to l4-training-loop so the abstraction ladder — manual → autograd → nn — is climbed in order).

Risk of superficial understanding: The API is easy enough to produce instant recognition ("it's just .backward()") while the graph-lifetime semantics stay fuzzy — precisely the gap the diagnostic's detach-in-logging question probes. Counters: predict-before-run annotations, the planted-detach exercise, deliberately triggering the three canonical errors, and the three-way regression where the learner must SAY what each layer of abstraction hid. Heavy Claude/ChatGPT assistance risk: generated boilerplate would hollow out exactly this node — the mastery rules (AI-assisted caps below Gold) apply with full force.

Required active work: typed-not-pasted tutorial pass with micrograd annotations; 5-function gradient-check incl. planted detach; CPU/GPU crossover measurement with plot; ∇‖Ax−b‖² match; widget-graph reproduction; three-way linear regression from blank file; 2-link FK autograd transfer.

Last verified: 2026-08-21
