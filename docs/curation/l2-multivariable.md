# l2-multivariable — Gradients, Jacobians & Hessians

Concept: Partial derivatives; gradient as steepest-ascent vector and its relation to level sets; Jacobian of vector-valued functions; multivariable chain rule as matrix product; Hessian as curvature; directional derivatives. One object, two careers: ∇L drives training, J drives robot-arm velocity. Partials, gradient, Jacobian, and the multivariable chain rule are LOAD-BEARING for the entire program (backprop at L3, manipulator Jacobians at L5, Lagrange/optimization at l2-optimization).

Learner prerequisites: l2-derivatives at gold (scalar chain rule automatic) AND l2-matrices (matrix×vector, composition-as-product — the multivariable chain rule is literally matrix multiplication of Jacobians).

What beginners commonly misunderstand:
- The total-derivative gap: applying the scalar chain rule where paths must be SUMMED (f(x, g(x))) — documented as the root of backprop confusion in a May 2025 Towards Data Science article (https://towardsdatascience.com/the-total-derivative-correcting-the-misconception-of-backpropagations-chain-rule/). This is the single most important misconception to kill in this node.
- Why the gradient points steepest-ascent and sits perpendicular to level curves — usually memorized, not derived from the directional derivative ∇f·u.
- Jacobian shape confusion (rows=outputs, columns=inputs; f:ℝ⁵→ℝ³ gives 3×5) — breaks every later shape-trace in backprop and manipulator code.
- Partial-derivative notation ∂ read as "some new operation" instead of "ordinary derivative with the other variables frozen".
- Hessian treated as a formula rather than curvature; not knowing a negative eigenvalue means "downhill direction exists" (saddle).

Candidate videos:
1. Khan Academy Multivariable Calculus, unit "Derivatives of multivariable functions" (Grant Sanderson-authored videos: partial derivatives, gradient, directional derivatives, and the Jacobian subsection incl. "local linearization" view) — course https://www.khanacademy.org/math/multivariable-calculus (correctness 5, beginner fit 5, intuition 5 — the closest thing to an "Essence of multivariable calculus"; Sanderson authorship confirmed in repo research phase, unit named per repo record) (score: winner)
2. Khan Academy YouTube playlist "Partial derivatives, gradient, divergence, curl | Multivariable Calculus" — https://www.youtube.com/playlist?list=PLSQl0a2vh4HCHBrSa1YErcRXpiz_BQRDS (same content as raw playlist for offline/speed-watching; lacks the site's embedded practice)
3. Second partial derivative test — Khan Academy — https://www.khanacademy.org/math/multivariable-calculus/applications-of-multivariable-derivatives/optimizing-multivariable-functions-videos/v/second-partial-derivative-test (Hessian-as-curvature payoff; DEEPEN slot)
4. Gradient descent, how neural networks learn — 3Blue1Brown — 21 min, gradient-vector segment 11:18–12:19 — https://www.youtube.com/watch?v=IHZwWFHWa-w (shows ∇ meaning "which nudge matters most" in 13,002 dimensions — watch the segment here, full video belongs to l2-optimization)
5. Math Academy multivariable course exists (https://www.mathacademy.com/courses/multivariable-calculus) — paid adaptive alternative, noted for completeness, not selected.

Candidate written resources:
1. Paul's Online Notes, Calc III Partial Derivatives chapter — https://tutorial.math.lamar.edu/classes/calciii/partialderivsintro.aspx — sections verified live this session: Partial Derivatives (notes: tutorial.math.lamar.edu/Classes/CalcIII/PartialDerivatives.aspx [via search snippet], practice: https://tutorial.math.lamar.edu/problems/calciii/partialderivsintro.aspx), Chain Rule — the multivariable/tree-diagram treatment (https://tutorial.math.lamar.edu/Classes/CalcIII/ChainRule.aspx, practice: https://tutorial.math.lamar.edu/problems/calciii/ChainRule.aspx), Directional Derivatives — defines the gradient and proves steepest ascent (https://tutorial.math.lamar.edu/Classes/CalcIII/DirectionalDeriv.aspx, practice: https://tutorial.math.lamar.edu/problems/calciii/directionalderiv.aspx). (rigor 4, exercise compatibility 5, clarity 4)
2. Paul's Calc III Applications chapter — https://tutorial.math.lamar.edu/classes/calciii/partialderivappsintro.aspx — Gradient Vector/Tangent Planes section (https://tutorial.math.lamar.edu/Classes/CalcIII/GradientVectorTangentPlane.aspx, practice: https://tutorial.math.lamar.edu/problems/calciii/gradientvectortangentplane.aspx) — the geometric ∇⊥level-set payoff.
3. MML book §5.1–5.7 (repo mml-book, https://mml-book.github.io/) — the ML-dialect consolidation incl. Jacobian-shape conventions and Hessian; terse; consolidation pass, not first exposure.
4. TDS "The Total Derivative: Correcting the Misconception of Backpropagation's Chain Rule" (May 2025) — https://towardsdatascience.com/the-total-derivative-correcting-the-misconception-of-backpropagations-chain-rule/ — targeted misconception repair.

Community evidence:
- Beginner confusion between scalar chain rule and total derivative is the documented backprop stumbling block (TDS May 2025, url above) — justifies extra practice specifically on multi-path chain-rule problems, which Paul's Calc III Chain Rule section's tree-diagram method drills directly.
- Paul's Notes still instructor-recommended in 2025–2026 for Calc III self-study (https://dcc.libguides.com/mathematics/web; https://math.colorado.edu/~sebo2151/for_students.html); site live with notes+practice+assignment tiers for every section used here.
- Adult self-learners in 2025–2026 increasingly bought Math Academy for drill (HN: https://news.ycombinator.com/item?id=43135664, balanced review https://newsletter.ozwrites.com/p/a-balanced-review-of-math-academy) — its noted procedural-over-conceptual skew is the opposite of what the gradient/Jacobian needs first, so free Sanderson-visuals + Paul's stays the better fit.
- The Khan multivariable unit (Sanderson-era) remains the standard free video path; third-party course indexes track it (https://opencourser.com/course/fqktil/khanacademy-derivatives-of-multivariable-functions).

Primary technical authority:
- Paul Dawkins Calc III (URLs above) for worked partials/chain-rule/directional-derivative computations; MML §5.1–5.7 for the notation and Jacobian/Hessian conventions actually used in ML papers.

Selected shortest-sufficient packet:
- DIAGNOSTIC: node diagnostic cold — gradient of x·y at (2,3); Jacobian shape of f:ℝ⁵→ℝ³; meaning of a negative Hessian eigenvalue (5 min)
- ORIENT: 3B1B gradient segment of https://www.youtube.com/watch?v=IHZwWFHWa-w, 11:18–12:19 + surrounding minute (~4 min)
- CORE WATCH: Khan "Derivatives of multivariable functions" unit — partial-derivative videos, gradient, directional derivatives, Jacobian subsection (~60–75 min at 1.25–1.5×; do the unit's embedded exercises as you go)
- CORE READ: Paul's Calc III — Partial Derivatives → Chain Rule (tree diagrams; do NOT skip — this is the total-derivative vaccine) → Directional Derivatives (gradient + steepest-ascent proof) (~90 min)
- INTERACTIVE: gradient-descent (in-app 2D loss surface — use it here purely to READ the gradient field: predict arrow directions from level sets before revealing)
- PRACTICE: Paul's practice sets for all three sections (~15 problems total, full solutions), emphasizing every multi-path chain-rule problem in the set; then the node's exercises: gradient field plot + 5 hand GD steps; polar→cartesian Jacobian by hand (~2 h — the mandated extra-practice protection for partials/gradient/Jacobian/chain rule)
- IMPLEMENT/DERIVE: numerical_jacobian(f, x) via central differences (generalizing l2-derivatives' check_grad); verify your polar→cartesian Jacobian; visualize Hessian eigenvalues at a saddle vs a bowl (~75 min)
- STUCK PATH: TDS total-derivative article (targeted repair for chain-rule confusion); Khan unit's text articles for gradient/directional derivative re-explanation
- DEEPEN: MML §5.1–5.7 consolidation read once everything computes; Khan second-partial-derivative-test video (Hessian payoff); Paul's Gradient Vector/Tangent Planes section for the ∇⊥level-sets geometry
- PROVE IT: node masteryTest — derive ∇f=2Aᵀ(Ax−b) for f=‖Ax−b‖² by components once, then by matrix calculus, then verify with numerical_jacobian (45 min)
- TRANSFER: 2-link arm FK f(θ₁,θ₂)=(x,y): compute the 2×2 Jacobian by hand via chain rule on the angle sums, verify numerically, and answer "which joint moves the fingertip more right now?" — this is l5-jacobians three levels early (30 min)
- RETENTION: day+7 — cold-write the multivariable chain rule as Jacobian product for h=f∘g with g:ℝ⁵→ℝ², f:ℝ²→ℝ³, stating every shape; one multi-path ∂/∂x of f(x, g(x))

Why this won: The repo's existing Khan-primary choice survives scrutiny — it is the only free resource where the gradient/Jacobian videos were authored by Sanderson himself with embedded practice — but the cluster pattern demanded an exact-worked-section procedure layer, which Khan's articles alone under-supply: Paul's Calc III Partial Derivatives chapter adds tree-diagram multivariable chain rule with full-solution practice sets (all URLs verified live today). Khan(concept+light practice) → Paul's(worked procedure) → NumPy Jacobian checker gives the load-bearing quartet (partials, gradient, Jacobian, chain rule) three independent passes in ~7.5 of the node's 10 h.

What was rejected (and why): MIT 18.02 as spine (board-paced semester; completionism trap); MML §5.1–5.7 as first exposure (repo research already ruled it consolidation-only — terse/proof-forward; kept as DEEPEN); Math Academy (paid; procedural skew); full Khan multivariable course (curl/divergence/integrals units are out of scope — only the derivatives unit is assigned); raw YouTube playlist as primary (loses embedded exercises; kept as alternate access).

Risk of superficial understanding: VERY HIGH — the classic failure is computing partials correctly while holding no geometric model (gradient direction memorized, Jacobian as "a matrix of partials" with no local-linear-map meaning), which then collapses at backprop and at manipulator Jacobians. Mitigations: predict-the-arrows widget drill, steepest-ascent derivation required in CORE READ, shape-stating forced in RETENTION, and both PROVE IT routes (components AND matrix calculus) must agree with the numerical check.

Required active work: three Paul's practice sets + Khan embedded exercises; numerical_jacobian implementation; gradient-field walk; masteryTest double derivation; FK-Jacobian transfer task.

Last verified: 2026-08-21
