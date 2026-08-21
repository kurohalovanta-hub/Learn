# l2-integrals — Integration Essentials

Concept: Integral as accumulated change / area, anti-derivative, FTC, u-substitution, definite integrals, trapezoid rule as the practical numerical fallback. Deliberately minimal (silver gate): just enough to read ∫p(x)dx = 1, expectations, and value functions. Technique-grinding (trig sub, partial fractions, series) is explicitly banned.

Learner prerequisites: l2-derivatives at gold — u-substitution is the chain rule run backwards, and the FTC only lands if derivatives are automatic.

What beginners commonly misunderstand:
- "Integral = antiderivative" memorized as a definition, skipping the accumulation-of-small-changes picture — which is the ONLY picture that transfers to 𝔼[X]=∫x p(x)dx and to integrating velocity into position.
- FTC as an unexplained coincidence rather than "slope of the area function is the height" (3B1B Ch 8's entire point).
- u-substitution as pattern-matching roulette instead of "spot the inner-function/derivative pair" (chain rule in reverse).
- Over-investing here: the standard university Calc II mistake. The repo's foundations report names Calc-II-style integration-technique grinding a top time-sink; this node's skip list is a feature, not a gap.

Candidate videos:
1. Integration and the fundamental theorem of calculus — Chapter 8, Essence of calculus — 3Blue1Brown — duration unverified (~20 min) — https://www.youtube.com/watch?v=rfG8ce4nNh0 (correctness 5, intuition 5, time efficiency 5 — builds FTC from the car-velocity accumulation problem; lesson page https://www.3blue1brown.com/lessons/integration/)
2. What does area have to do with slope? — Chapter 9, Essence of calculus — 3Blue1Brown — in the series playlist https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr [individual URL not separately verified this session] (average-of-a-function view — the exact mental model of expectations; strong optional second watch)
3. Full Essence of Calculus playlist (repo 3b1b-calculus) — same playlist URL — only ch 8–9 belong to this node.

Candidate written resources:
1. Paul's Online Notes, Calc I Integrals chapter — https://tutorial.math.lamar.edu/classes/calci/integralsintro.aspx — chapter covers indefinite/definite integrals, computing each, substitution rule, and FTC. Sections verified live this session: Computing Definite Integrals — FTC Part II treatment (https://tutorial.math.lamar.edu/classes/calci/computingdefiniteintegrals.aspx), Substitution Rule for Indefinite Integrals (https://tutorial.math.lamar.edu/classes/calci/substitutionruleindefinite.aspx), Substitution Rule for Definite Integrals (https://tutorial.math.lamar.edu/classes/calci/SubstitutionRuleDefinite.aspx). "Indefinite Integrals" / "Computing Indefinite Integrals" / "Definition of the Definite Integral" sections are reached from the chapter page (exact URLs not independently verified this session). (clarity 4, exercise compatibility 5, rigor 4)
2. Paul's practice sets with full solutions — Substitution Rule Indefinite (https://tutorial.math.lamar.edu/problems/calci/substitutionruleindefinite.aspx), Substitution Rule Definite (https://tutorial.math.lamar.edu/Problems/CalcI/SubstitutionRuleDefinite.aspx).
3. Khan Academy integral calculus units (via khan-math) — adaptive backup practice (beginner fit 5, time efficiency 3).
4. OpenStax Calculus Vol 1 ch 5 — standard free-textbook alternative per 2026 roundup (https://www.straighterline.com/blog/affordable-13-best-free-educational-resources-for-students-2026-guide); slower than Paul's for a subset-reader; reference only.

Community evidence:
- Paul's Notes remains instructor-recommended for exactly this use (self-study patching with solved problems): https://dcc.libguides.com/mathematics/web, https://math.colorado.edu/~sebo2151/for_students.html — no 2025–2026 displacement signal found.
- The 2026 free-resource consensus path for full calculus is OpenStax Vol 1 + Khan + MIT 18.01 psets (StraighterLine guide, url above) — confirms our sources are the ecosystem standards; we deviate only by subsetting aggressively, which the repo's own feasibility research mandates.
- 3B1B Ch 8 is the single most-cited FTC explainer; third-party chapter summaries exist for it specifically (https://opentools.ai/youtube-summary/integration-and-the-fundamental-theorem-of-calculus-or-chapter-8-essence-of-calculus) — learner-engagement signal.

Primary technical authority:
- Paul Dawkins, Calc I Integrals chapter (URLs above) — worked u-substitution and FTC-II computations.
- NumPy docs (repo numpy-docs) for the trapezoid implementation check (numpy.trapezoid) once your own loop version works.

Selected shortest-sufficient packet:
- DIAGNOSTIC: ∫₀¹3x²dx in your head + "what is d/dx ∫₀ˣ f(t)dt?" + one u-sub ∫2x·cos(x²)dx (4 min; clean pass ⇒ jump to IMPLEMENT + PROVE IT)
- ORIENT: —
- CORE WATCH: 3B1B Ch 8 (~20 min), pausing at the FTC reveal to state it yourself first
- CORE READ: Paul's Calc I Integrals — Indefinite Integrals → Computing Indefinite Integrals → Substitution Rule (indefinite) → Definition of the Definite Integral → Computing Definite Integrals (FTC II) → Substitution Rule (definite), reading worked examples only, skipping every technique on the node's skip list (~60 min)
- INTERACTIVE: —
- PRACTICE: Paul's Substitution Rule practice sets, indefinite + definite (odd-numbered problems, self-check against full solutions), ~45–60 min; stop at fluency, not completion
- IMPLEMENT/DERIVE: trapezoid integrator from scratch; verify against exact ∫₀¹3x²dx=1; then integrate the standard Gaussian numerically on [−1,1] and discover ≈0.683 — your first contact with "±1σ contains 68%" (45 min)
- STUCK PATH: 3B1B Ch 9 (area↔slope, average value) from the playlist; Khan integral-calculus unit for adaptive remediation
- DEEPEN: MIT 18.01SC Unit 3 (repo-designated backup) only if FTC still feels like magic after the packet
- PROVE IT: node masteryTest — evaluate ∫x e^{x²}dx by substitution AND explain in writing why 𝔼[X]=∫x p(x)dx is "weighted average, continuum edition" (20 min)
- TRANSFER: odometry: given v(t)=sin(t) for a wheeled robot over [0,π], get position by exact integral and by your trapezoid code; halve the step size, watch the error quarter — name why (2nd-order accuracy) (25 min)
- RETENTION: day+10 — one cold u-sub, state both parts of the FTC from memory, and answer "why does the trapezoid error drop 4× when h halves?"

Why this won: This is a silver-gated 5-hour utility node; the packet (~3.5 h core) pairs the one video that makes FTC inevitable (Ch 8) with the exact three Paul's sections that cover the node's whole objective list, then spends the saved time on the numerical integrator — the skill actually used downstream (probability, value functions). The Gaussian-0.68 exercise front-loads intuition for l2-random-variables.

What was rejected (and why): All Calc II technique machinery (trig sub, partial fractions, IBP-heavy tracks) — repo research names it the canonical time-sink and no downstream node needs it; Professor Leonard / full lecture courses (hours-per-section pacing on a 5 h node); OpenStax ch 5 as spine (textbook completeness where a subset is specified); Khan as primary (adaptive loop is slower than Paul's worked examples for a learner who already has derivatives at gold — kept as stuck path).

Risk of superficial understanding: MODERATE — lower stakes than the chain rule, but two traps: (1) u-sub pattern-matching that collapses on ∫x e^{x²}dx variants — mitigated by the practice sets' mixed forms; (2) never connecting area to expectation — mitigated by PROVE IT's explanation requirement and the Gaussian exercise. Honest silver here is fine; do not gold-plate this node.

Required active work: two Paul's practice sets; trapezoid integrator + Gaussian discovery; masteryTest derivation + written expectation explanation; odometry transfer task.

Last verified: 2026-08-21
