# l6-state-space — State-Space Models & Stability

Concept: ẋ = Ax + Bu (and x_{t+1} = Ax_t + Bu_t) as the universal system description; linearization of nonlinear dynamics about equilibria; stability read off eigenvalues (Re(λ)<0 continuous, |λ|<1 discrete); controllability as "can inputs reach the whole state space".
Learner prerequisites: l2-eigen-svd at Gold (eigensolves are assumed fluent), l6-feedback-pid. The learner has already integrated plants in MuJoCo (l5) — state vectors are concrete, not abstract.
What beginners commonly misunderstand: (1) Mixing up the continuous and discrete stability conditions — applying Re(λ)<0 to a discretized A is the classic silent bug. (2) Thinking linearization is an approximation trick rather than a local statement — then being surprised LQR-style controllers fail far from the equilibrium. (3) Treating controllability as a rank incantation instead of "which directions can u push the state, including through coupling". (4) Believing the state is God-given rather than a modeling choice (positions AND velocities; leaving out velocity is the #1 beginner modeling error). (5) Expecting pole placement to be magic — not realizing K just moves closed-loop eigenvalues of (A−BK).

Candidate videos:
1. Control Bootcamp: Overview — Steve Brunton — ~19 min [Class Central snippet: "19 minutes"] — https://www.youtube.com/watch?v=Pi7l8mMjYVE (types of control, why feedback; sets up the whole x'=Ax+Bu program. Correctness 5, clarity 5, intuition 5, rigor 4.)
2. Stability and Eigenvalues [Control Bootcamp] — Steve Brunton — 19:30 [Class Central] — https://www.youtube.com/watch?v=h7nJ6ZL4Lf0 (exactly objective 2: continuous vs discrete stability from eigenvalues. The node's core video.)
3. Linearizing Around Fixed Points — Steve Brunton — duration [unverified] — via playlist https://www.youtube.com/playlist?list=PLMrJAkhIeNNR20Mz-VpzgfQs5zrYi085m (title verified from community lecture-notes repo github.com/CEN-Control-Systems-Lab/Controls-BootCamp; exactly objective 1 — Jacobian linearization at equilibria with the pendulum.)
4. Controllability [Control Bootcamp] — Steve Brunton — duration [unverified] — via same playlist (Class Central catalogs it as a standalone free video: https://www.classcentral.com/course/youtube-controllability-control-bootcamp-177932; objective 3.)
5. Inverted Pendulum on a Cart [Control Bootcamp] — Steve Brunton — duration [unverified, ~17 min] — https://www.youtube.com/watch?v=qjhAAQexzLg (derives cart-pole nonlinear dynamics + linearization — the exact system the mastery test demands.)
6. Pole Placement for the Inverted Pendulum on a Cart [Control Bootcamp] — Steve Brunton — duration [unverified] — via same playlist (title verified in search results; choosing K to move closed-loop eigenvalues — feeds the pole-placement exercise directly.)
7. Linear Systems [Control Bootcamp] — Steve Brunton — duration [unverified] — via same playlist (Class Central page https://www.classcentral.com/course/youtube-linear-systems-control-bootcamp-177934; solution e^{At}, eigen-coordinates. Watch if #2 feels fast.)

Candidate written resources:
1. Data-Driven Science & Engineering (Brunton & Kutz), Ch 8 — free at databookuw.com [repo-verified resource; not re-fetched this session] (the bootcamp's own companion text; same notation as the videos.)
2. Underactuated Robotics, Ch 2 "The Simple Pendulum" (pend = chapter 2 per the book's chapters.json, fetched this session from github.com/RussTedrake/underactuated) — rigorous linearization-at-equilibria treatment when wanted.
3. Community MATLAB/Python code-alongs of the bootcamp — https://github.com/bertozzijr/Control_Bootcamp_S_Brunton and https://github.com/CEN-Control-Systems-Lab/Controls-BootCamp (reference implementations to check your own against; NOT to copy from.)

Community evidence:
- Multiple independent learner repos re-implementing every bootcamp lecture in code — strong "implement-along works" signal (https://github.com/bertozzijr/Control_Bootcamp_S_Brunton, https://github.com/cen-labs/Control_System_BootCamp)
- Class Central catalogs the bootcamp and its individual lectures as a free University of Washington course — sustained learner demand (https://www.classcentral.com/course/youtube-control-bootcamp-53182)
- The bootcamp gets repackaged commercially — popularity signal only (https://researcherstore.com/courses/control-bootcamp/)
- Learner blog building LQR/state-feedback after this style of intro, showing the pipeline sticks (https://rrwiyatn.github.io/blog/robotik/2020/07/19/lqr.html)

Primary technical authority:
- Brunton & Kutz, *Data-Driven Science & Engineering* Ch 8 (the lectures follow it), with Underactuated (Tedrake, underactuated.csail.mit.edu) as the rigor backstop; your own eigensolve + simulation confirms every stability claim numerically.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold: where must eigenvalues of a stable DISCRETE system live, and why is it different from continuous? Linearize ẍ = −sin(x) about x=0 and x=π; which is stable? What, intuitively, makes an (A,B) pair uncontrollable? 10 min on paper.
- ORIENT: 5 min replaying matrix-transform (in-app) — watch repeated application of a 2×2 A shrink/blow up vectors along eigendirections; that IS discrete stability.
- CORE WATCH: Bootcamp segment, in order, implementing along in Python: Overview (~19) → Linearizing Around Fixed Points [unverified] → Stability and Eigenvalues (19:30) → Controllability [unverified] → Inverted Pendulum on a Cart (~17 [unverified]) → Pole Placement for the Inverted Pendulum on a Cart [unverified]. ≈ 100–120 min of video at 1×; ~90 min at 1.25×. SKIP the Transfer Functions and Frequency Response lectures that sit between Stability and Controllability in the playlist (curriculum cut; community repo confirms they're a separable block).
- CORE READ: — (implement-along replaces reading; databookuw Ch 8 is DEEPEN).
- INTERACTIVE: matrix-transform (eigen intuition under iteration); pid-tuner revisited once: your tuned PD loop IS an (A−BK) — say which entries the gains changed.
- PRACTICE: Node exercises — linearize the pendulum about both equilibria, eigencheck, simulate to confirm upright is unstable; pole placement by hand on the double integrator, verify closed-loop eigenvalues moved.
- IMPLEMENT/DERIVE: Python: build A,B for pendulum + cart-pole from your own Jacobians; np.linalg.eig stability audit continuous AND after Euler discretization (show a stable continuous system going unstable under coarse Δt); state-feedback u=−Kx stabilizing the linearized pendulum in your own integrator.
- STUCK PATH: Linear Systems [Control Bootcamp] (slower eigen-coordinates walkthrough), then the community playlist "State space control Brian Douglas" (https://www.youtube.com/playlist?list=PLurQiP9GPPBFVGUEVl7iMhJO1IZfR5dIn — user-compiled; gentler pace) for a second voice.
- DEEPEN: databookuw.com Ch 8 sections matching the watched lectures; Underactuated Ch 2 (pendulum) for honest nonlinear phase-portrait context.
- PROVE IT: Node mastery test — derive cart-pole linearization about upright from the nonlinear equations, assemble (A,B), demonstrate a stabilizing K in simulation (Gold gate).
- TRANSFER: Latent-dynamics reading: given someone else's learned world-model matrix A (x_{t+1}=Ax_t+Bu_t), audit |λ_i| and predict rollout blow-up before running it — the L9+ world-model connection made literal.
- RETENTION: +10 days: from memory, write both stability conditions and explain via λ ↦ e^{λΔt} why the continuous condition maps to the discrete one; name one system that is stable but uncontrollable.

Why this won: The bootcamp is already the repo's verified primary; this session sharpened it into an exact six-video path (~90 focused minutes) with the skip-block confirmed (Transfer Functions + Frequency Response form a separable group between Stability and Controllability — verified via the community lecture-repo structure), so the learner never wonders "do I need the other 30 videos?" (No — LQR/Kalman videos belong to later nodes; H∞ tail stays cut.) Brunton derives the exact cart-pole (A,B) the mastery test requires, which no shorter alternative found does.
What was rejected (and why): Whole-bootcamp watch-through (≈36 videos; violates shortest-sufficient — only ~6 serve this node). Brian Douglas transfer-function state-space videos (his classic series reaches state-space via Laplace — clashes with the curriculum's no-frequency-domain path; kept only as stuck-path second voice). MIT OCW full linear-systems courses (never candidates: whole-course ban). MATLAB Tech Talk state-space series (could not verify titles/URLs this session — search budget exhausted; bootcamp suffices).
Risk of superficial understanding: Nodding along to eigenvalue talk without ever computing one — every stability claim in the packet must be confirmed by the learner's own np.linalg.eig + simulation pair. Second trap: memorizing ctrb-rank without the "directions u can push" intuition; the uncontrollable-system example in RETENTION guards it.
Required active work: Both-equilibria pendulum linearization with eigencheck + simulation; Euler-discretization stability flip demo; hand pole-placement on double integrator; cart-pole (A,B) derivation + stabilizing K (mastery); latent-A audit transfer task.
Last verified: 2026-08-21
