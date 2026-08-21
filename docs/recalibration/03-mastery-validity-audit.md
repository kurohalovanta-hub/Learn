# 03 — Mastery Validity Audit
Date: 2026-08-21 · Authority: HANDOVERFINAL §2.3–2.4, §24–26. Evidence verified by code read and
by executing the engine against simulated states.

## Verdict

**No mastery signal in the current product is valid.** Every gate reduces to an unvalidated
client-side write. The system records useful *fields* (tier, confidence, independence, evidence,
review state) but validates none of them, so downstream computations (unlocks, XP, ranks,
readiness, warnings, pacing) are arithmetic over assertions.

## Evidence chain (file:line at commit `ce75ebc`)

1. **The write is unconditional.** `src/lib/store.ts:102–126` — `claimTier(id, tier, evidence?,
   independence?)` sets `status`/`tier` immediately. No prerequisite check (locking is UI-only
   `disabled=` in `NodeView.tsx`), no evidence requirement (`evidence || undefined`), no cooldown,
   no rate limit, no server validation.
2. **Maximum tier is day-1 claimable and pays the most.** `src/lib/engine/mastery.ts:7–14` —
   TIER_XP gold 1.0 / platinum 1.25 / research 1.5; nothing gates platinum/research. Executed:
   all-149-at-research = 15,240 XP, Rank 10, readiness 100/100.
3. **Bosses are one click.** `NodeView.tsx:383–391` — "✓ Passed" records a passed attempt AND
   auto-claims the gate tier with the literal string "boss passed" as evidence. Pass criteria
   render as inert `□` bullets. Ranks derive from these tiers, so all rank-ups are purchasable.
4. **The one honest guard is defeated by adjacency.** `engine/delta.ts:43–46` fires the
   celebration only on a genuine gate crossing — but `NodeView.tsx:348–350` renders `reset`
   beside the claim buttons: reset→re-claim re-fires celebration + XP delta, infinitely.
5. **Fake mastery is permanent.** `store.ts:135–154` — review "failed" decrements only a cosmetic
   `confidence`; tier and status are never touched. The only mechanism that could catch a false
   claim cannot act on what it finds.
6. **Self-grades compare against nothing.** Review answers are never captured
   (`app/review/page.tsx`); defense answers accept a typing bypass ("answered on paper") and
   grade by button; lesson free-responses are revealed, never checked; lesson "completion" fires
   by paging to the last section (`LessonRunner.tsx:42`).
7. **The honesty mechanism defaults to the innocent answer.** `MasteryClaim.tsx:19` pre-selects
   `independence: "independent"`; the heavy-AI cap (claims below Gold) only binds on voluntary
   confession. HANDOVER §11's "mastery scores should penalize dependence on generated solutions"
   is implemented as an opt-in dropdown.
8. **Dead code where honesty was promised.** LEARNING-SYSTEM.md claims missed lesson checks
   "feed the review system"; `engine/review.ts` builds prompts solely from node diagnostics —
   the got/missed record is consumed by nothing.

## What §24–26 requires instead (design targets)

1. **Exposure ≠ competence, structurally.** Learner state becomes dimensions (exposure,
   comprehension, independent application, implementation, transfer, retention, integration,
   AI-dependence, confidence), each movable **only by a typed evidence event** —
   `recordExposure / recordPracticeAttempt / recordIndependentAssessment / recordTutorSession /
   recordImplementationEvidence / recordProjectEvidence / recordRetentionAttempt`.
   The displayed tier is **derived** from these dimensions, never written directly.
2. **A normal user action can no longer set a tier.** `claimTier` survives only as a clearly
   marked legacy/admin override (`kind: "manual-override"`, visibly flagged wherever shown, and
   excluded from "verified" styling). Migration maps existing tiers to override events so no
   user data is lost — but they render as *unverified legacy claims* until re-evidenced.
3. **Assessment requires production.** Gate-level assessment = typed, closed-book attempt at the
   node's mastery task, stored verbatim, then self-graded against stated criteria. Self-grading
   remains (client-only architecture cannot examine free text without a tutor), but it now grades
   a concrete produced artifact, and the artifact persists for later self-audit and tutor review.
4. **Retention has teeth, without erasing history.** A failed retention check drops the retention
   dimension and demotes the *derived* state below "verified" (per §27 it lowers confidence, not
   the evidence log). Verification is recoverable by passing the next check — state is honest in
   both directions.
5. **Celebration follows verification.** The mastery moment fires when a node first reaches
   *verified* (independent assessment + first retention pass), not on any click. A claim-shaped
   acknowledgment ("assessment recorded — verifies after retention") replaces day-of fireworks.
6. **Anti-gaming defaults.** Independence must be explicitly selected per assessment;
   full-solution exposure recorded from tutor sessions counts against the independence dimension;
   a binge detector (N assessments in 24 h vs. logged/practice evidence volume) feeds the
   warnings engine and downgrades celebrations while active.

## Honest limits (stated so nobody oversells the fix)

This remains a self-report system at the boundary: the app cannot run the learner's code or read
his paper answers without a tutor in the loop. The recalibration's claim is narrower and
achievable: **make honesty the cheapest path, make every assertion inspectable (typed attempts,
stored evidence, visible provenance), and make self-deception reversible** (retention demotion,
re-entry sweeps). The residual trust assumption is disclosed in-product on the mastery surface.
