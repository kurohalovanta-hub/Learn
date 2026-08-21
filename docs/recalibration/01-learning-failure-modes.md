# 01 — Learning Failure Modes
Date: 2026-08-21 · Grounded in the five-critic audit; mapped to the real learner (HANDOVERFINAL §3).

The learner this product serves: 2–3 year academic break, zero programming, Grade-10 math
baseline, novelty-stimulated, sprint-capable, heavy AI use, at risk of confusing recognition
with mastery. Each failure mode below is stated as *mechanism → why this learner specifically
falls into it → evidence in the current product → recalibration answer*.

## F1. Binge-and-abandon (the dominant risk)

- **Mechanism:** novelty-rich interface + frictionless reward → consume all apparent progress in
  a sprint → nothing left to withhold → abandonment.
- **This learner:** explicitly novelty-stimulated and sprint-capable; returning learners get their
  strongest dopamine from *appearing* to catch up fast.
- **Evidence:** all 149 nodes claimable at max tier in ~40 min with celebrations; 63 papers
  DEFENDED in ~45 min; MISSION COMPLETE in 7 clicks; reset→re-claim re-fires celebrations
  infinitely (00 §Headline 2, 7).
- **Answer:** evidence-derived state (no direct tier writes), verification-conditioned
  celebration, binge detector wired into warnings and the celebration path, provisional
  states pending retention (06).

## F2. Recognition–mastery confusion (fluency illusion)

- **Mechanism:** consuming a lucid explanation produces the *feeling* of understanding; the
  feeling does not survive a blank page.
- **This learner:** named in his own spec as the specific risk ("risk of consuming many
  explanations and confusing recognition with mastery").
- **Evidence:** derivations are click-to-reveal with sanity checks performed for the reader;
  lesson "completion" triggers by paging to the last section; free-text answers are never
  compared to anything; write-mode acceptance checks render as static text.
- **Answer:** every packet ends in an independent PROVE-IT and a TRANSFER task; retrieval
  questions immediately after every video; typed attempts required before self-grading;
  retention checks that can demote state (06).

## F3. Tutorial hell (consumption without creation)

- **Mechanism:** watching/reading feels like work; artifacts are the only proof.
- **Evidence:** the current product *warns* about tutorial hell but cannot see it — hours,
  claims and reviews are all self-typed. 133/149 nodes offer only "go read this" + a claim button.
- **Answer:** packets put PRACTICE/IMPLEMENT before PROVE IT; evidence events distinguish
  exposure from implementation; the bottleneck view refuses to advance on exposure alone.

## F4. AI dependency (Claude does the cognition)

- **Mechanism:** the slide from "explain" to "fix this" to "write this" is frictionless; the
  learner ships working code he cannot explain.
- **This learner:** will use Claude/ChatGPT heavily by his own statement.
- **Evidence:** independence is a self-reported dropdown defaulting to "independent"; tutoring
  is 8 static copy-paste prompts; no session record ever returns to the app.
- **Answer:** contextual tutor modes defaulting to Socratic/diagnostic; full-solution exposure is
  an explicit choice recorded as reduced independence; structured session summaries ingested as
  evidence with `full_solution_exposures` counting against independence (06; HANDOVERFINAL §21–23).

## F5. Overwhelm and sequencing paralysis (re-entry failure)

- **Mechanism:** 149 nodes + 63 papers + 22 projects + 8 surfaces read as an exam he hasn't
  studied for; paralysis or random grazing follows.
- **Evidence:** the current dashboard shows counts everywhere ("giant node counts" — the exact
  anti-pattern HANDOVERFINAL §28 names); `/today` presents seven parallel categories daily.
- **Answer:** the default surface shows ONE bottleneck, one capability target, 3–5 steps,
  progressive reveal; counts and XP demoted from primary surfaces (§28, §30).

## F6. Structural collapse in the back half

- **Mechanism:** motivation systems built on novelty die when novelty does; the hardest material
  (months 4–7) currently has the least product support.
- **Evidence:** last lesson ~day 148; L7–L9 and L13–L16 have zero guided experiences; research
  month renders a static 4-line template (00 §Headline 5).
- **Answer (scoped honestly):** packets extend guided structure to every core node at far lower
  cost than lessons; scaffolding *deliberately* thins by design (§34) — but thinning must be a
  designed hand-off to raw sources and projects, not an accidental cliff. The research month gets
  a real loop (experiment tracker integration + daily writing target) in the rebuild plan.

## F7. Fake-completion pressure from the calendar

- **Mechanism:** "day 130 of 210" plus visible drift metrics pressures marking things done.
- **Evidence:** pacing verdicts ("behind (−9d)") render on the dashboard header area.
- **Answer:** calendar becomes a quiet overlay; drift shown weekly, not daily; the spec's rule
  restated in-product: the calendar is a target, never evidence (§25, §41).

## F8. Lapse and re-entry (unmodeled by the original spec)

- **Mechanism:** the learner misses 4 days; the system's state is stale; shame-driven avoidance
  compounds. The original HANDOVER assumed unconditional 5–7 h/day and modeled zero lapse paths —
  a blind spot the audit flagged.
- **Answer:** returning after a gap triggers a re-entry flow: a short retention sweep of recent
  nodes recalibrates state *downward where forgetting shows*, then re-plans the bottleneck.
  No guilt UI, no broken-streak theater (§40; scenario G in §48).

## Non-failure to preserve

The learner's sprint capacity is an asset, not a pathology. Nothing in the recalibration may
rate-limit *honest* speed: a diagnostic passed cold still skips a node immediately; verification
gates are evidence-shaped (typed attempts, delayed retention), never wall-clock-shaped
(HANDOVERFINAL §41: allow acceleration).
