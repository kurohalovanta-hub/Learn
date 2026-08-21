# l6-feedback-pid — Feedback & PID

Concept: Closed-loop feedback control — measure error, push against it. P/I/D terms, what each contributes, each term's failure mode (steady-state error, windup, noise amplification), saturation and anti-windup, manual tuning on realistic second-order plants.
Learner prerequisites: l5-mujoco-basics, l2-derivatives (both already gated). Needs: derivative-as-slope, integral-as-accumulation, second-order ODE behavior at intuition level only. No Laplace, no frequency domain (deliberate curriculum cut — see docs/research/reports/robotics-theory.md §4).
What beginners commonly misunderstand: (1) That P-gain alone can reach the setpoint — under any constant load (gravity), pure P settles below target and learners think the code is buggy. (2) That I "just fixes offset" — they discover windup only when the actuator saturates and the system massively overshoots. (3) That D acts on the setpoint too — derivative kick surprises everyone. (4) That tuning is folklore (Ziegler–Nichols tables) rather than steering damping ratio ζ and bandwidth deliberately. (5) Confusing simulation-tuned gains with noise-robust gains — D amplifies sensor noise and this only shows up when noise is injected.

Candidate videos:
1. PID Control - A brief introduction — Brian Douglas — 7:44 — https://www.youtube.com/watch?v=UR0hOmjaHp0 (correctness 5, prereq fit 5, clarity 5, intuition 5, rigor 2, time-eff 5. The canonical seven-minute mental model; cited in O'Reilly's Learn Robotics Programming further-reading. Zero math burden.)
2. Simple Examples of PID Control — Brian Douglas — ~13 min [approx, search snippet says "approximately 13 minutes"] — https://www.youtube.com/watch?v=XfAt6hNV8XM (walks one system through P→PI→PID, visualizing which problem each term solves "using very little math because PID is fundamentally intuitive". Perfect bridge to the pid-tuner widget labs.)
3. Control Systems Lectures - Closed Loop Control — Brian Douglas — duration [unverified, ~9 min] — https://www.youtube.com/watch?v=O-OqgFE9SD4 (open- vs closed-loop; the series opener per IAPCT forum. Covers objective 1 exactly.)
4. Anti-windup for PID control | Understanding PID Control, Part 2 — Brian Douglas (MATLAB Tech Talk) — duration [unverified, ~11 min] — https://www.youtube.com/watch?v=NVLXCwc8HzM (the only short video found that treats saturation + windup + clamping/back-calculation head-on; official page https://www.mathworks.com/videos/understanding-pid-control-part-2-expanding-beyond-a-simple-integral-1528310418260.html. Simulink visuals but concepts transfer 1:1 to the Python implementation.)
5. What Is PID Control? | Understanding PID Control, Part 1 — Brian Douglas (MATLAB Tech Talk) — duration [unverified, ~11 min] — https://www.mathworks.com/videos/understanding-pid-control-part-1-what-is-pid-control--1527089264373.html (redundant with #1+#2 for CORE; kept as stuck-path re-explanation from a different angle.)

Candidate written resources:
1. PID-101 — Joshua A. Marshall (Queen's University, Ingenuity Labs) — Jupyter notebooks — https://github.com/botprof/PID-101 (fetched this session: Part I "Basics" = time-domain SISO PID on a 1D mobile robot, explicitly NO Laplace — matches this curriculum's frequency-domain cut; Part II "Tuning" = bandwidth-parameter tuning with cruise-control and DC-motor examples. MIT license. Prereq fit 5, rigor 3, exercise compatibility 5.)
2. The Fundamentals of Control Theory — Brian Douglas — free book (his video content in prose) — index at https://engineeringmedia.com/videos [URL appeared in search results; fetch egress-blocked this session] (alternate written form of the same intuition; not required.)
3. Åström & Murray, *Feedback Systems*, PID chapter — no URL claimed this session (already cited in the in-app lesson's sources note as the honest-math backstop).

Community evidence:
- Hackaday: recommends Douglas's ~50-video series as "an excellent set... a great introduction to the topic of control theory" (https://hackaday.com/2017/10/17/control-system-fundamentals-by-video/)
- All About Circuits Engineer Spotlight: interview on why the Douglas lectures became the de-facto YouTube controls curriculum (https://www.allaboutcircuits.com/news/brian-douglas-control-systems-lectures-engineering-education-YouTube/)
- O'Reilly *Learn Robotics Programming* further-reading points beginners at Douglas's PID intro specifically (https://www.oreilly.com/library/view/learn-robotics-programming/9781789340747/b8392b1d-6eac-4e5a-a365-e8bbed56f205.xhtml)
- A2C2 (control-community education catalog) indexes the exact PID videos selected here (https://a2c2.org/presentation/online/pid-control-brief-introduction)
- IAPCT forum: Douglas's series is the standard community answer to "where do I start with control" (http://discourse.iapct.org/t/open-loop-versus-closed-loop-control/7992)

Primary technical authority:
- The implementation itself against the real integrated plant (240 Hz pid-tuner widget + MuJoCo), with Åström & Murray's PID treatment as the equations-of-record. Douglas is intuition delivery, not the authority.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, on paper: sketch the response of a P-only controller holding a mass against gravity (where does it settle?); state what D does to overshoot and to sensor noise; predict what happens when u saturates while I keeps integrating. 8 min. (Matches node diagnostic.)
- ORIENT: Closed Loop Control — Brian Douglas (O-OqgFE9SD4), ~9 min [unverified] at 1.25× ≈ 7 min.
- CORE WATCH: PID Control - A brief introduction (7:44) + Simple Examples of PID Control (~13 min) + Anti-windup, Understanding PID Control Part 2 (~11 min) — ≈ 32 min at 1×, ~25 min at 1.25×.
- CORE READ: PID-101 Part I notebook, run top-to-bottom (~15–20 min) — reinforces the time-domain framing in Python before writing your own class.
- INTERACTIVE: pid-tuner (in-lesson labs 1–5: P overshoot, D damping, constant-load steady-state error, I killing it, kick disturbance + derivative-kick observation).
- PRACTICE: Node exercises — deliberately produce all three pathologies (P-only offset, I windup overshoot, D noise amplification) with plots; write your hand-tuning procedure as an explicit algorithm.
- IMPLEMENT/DERIVE: PID class with anti-windup (clamping); tune to (1) hold MuJoCo pendulum at 45°, (2) point-mass step then sine reference. Derive the PD closed-loop ζ relation the lesson uses: ζ=1 ⟺ Kd = 2√(mKp) − c.
- STUCK PATH: What Is PID Control? Part 1 (MATLAB Tech Talk) — same ideas, different visuals; then PID-101 Part I again slowly.
- DEEPEN: Åström & Murray PID chapter (only if the ζ-based tuning or anti-windup variants feel hand-wavy); PID-101 Part II (bandwidth-parameter tuning method).
- PROVE IT: Node mastery test — unseen second-order MuJoCo system, tune to rise-time/overshoot spec, justify every gain change (Gold gate).
- TRANSFER: PID-101 Part II cruise-control example: tune a system you didn't build, where the plant model is given in words, and map each spec violation to the responsible gain.
- RETENTION: +7 days: from memory, write u(t) = Kp e + Ki ∫e + Kd ė, name each term's failure mode, and re-derive the ζ=1 gain relation.

Why this won: Douglas is the community-consensus intuition source (Hackaday, O'Reilly, A2C2, IAPCT all point at him) and his three shortest PID videos plus one anti-windup Tech Talk cover every node objective in ~40 focused minutes — the rest of the 6 h budget goes to the widget labs and the MuJoCo implementation, which is where mastery actually forms. PID-101 was added (new this session) because it is the only found written source that teaches PID exactly the way this curriculum decided to (time-domain, no Laplace, robotics examples, runnable notebooks).
What was rejected (and why): Full Douglas classical-control playlist (transfer functions, root locus, Bode — curriculum explicitly cut frequency domain; only vocabulary needed). Ziegler–Nichols-centric tutorials (folklore tables; the lesson derives gains from ζ instead). MATLAB Tech Talk Parts 3–7 (noise filtering/derivative filtering is touched in exercises; full series is redundant with the widget labs). Long university lectures (an hour of lecture buys less than 20 min of widget lab here).
Risk of superficial understanding: Watching Douglas feels like mastery — recognition risk is highest on this node because the videos are so clear. Gains meaning is only cashed out by the pathology triptych and the unseen-system tune-to-spec test. Also: tuning only in noise-free sim hides D's noise cost; the noise exercise is mandatory.
Required active work: pid-tuner labs 1–5; three-pathology demonstration with plots; PID class with anti-windup; pendulum 45° hold + point-mass step/sine tracking; written tuning algorithm; ζ-relation derivation; unseen-system mastery tune.
Last verified: 2026-08-21
