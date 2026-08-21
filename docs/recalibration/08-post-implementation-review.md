# 08 — Post-implementation review (HANDOVERFINAL §47–48)
Date: 2026-08-21 · against commits `27bb416..8b5ff44` + this commit · method: production
build (`next build`, 334 pages) served locally; Playwright walkthroughs at 1600×1000 and
390×844; interactive end-to-end runs of the exact abuse paths the pre-recalibration
critics executed; engine unit checks via tsx; validator + eslint + build green.
(Environment note: this container blocks most egress, so YouTube iframes render as dead
frames here — behavior under embed failure is itself a finding, see P4.)

## 0. The five confirmed failures of the old system — re-tested

| Old failure (doc 02) | Status now | Evidence |
|---|---|---|
| All 149 nodes claimable at max tier in ~40 min | **Dead.** No control sets a tier anywhere. A claim = typed closed-book attempt (min 20/40 chars) → commit → declared honesty → self-verdict; yields *provisional* only | E2E: claim on `l0-terminal` → header "MASTERED · GOLD · claimed — not yet verified" |
| Reset→claim infinite celebration loop | **Dead.** Celebration fires only on `becameVerified` (and never during a binge). Claims render a quiet "Recorded." line | E2E: celebration overlay count after claim = 0 |
| One-click bosses | **Dead.** Boss pass requires per-criterion checkboxes + ≥30-char notes + honesty declaration, and lands as assessment evidence | code path `BossAttemptBox` → `recordBossAttempt` + `assessWithMoment` |
| Fake mastery permanent | **Dead.** Assessment pass schedules a ~2-day early retention audit; review requires a typed sketch before self-grading; failures demote semantic state (history preserved) | store: `review.due = min(existing, now+2d)`; review page gate |
| Product static after day ~95 | **Structurally addressed, debt remains.** Research-mode Today, frontier watchlist, packet fallback keep every node in the same flow; packet tranche 2 (L3–L9 depth, L13–L16) is the open debt | P10 |

## 1. Ten passes against the actual product

**P1 — Can mastery still be faked?** By deliberate lying, yes — that is the accepted
§25 boundary (self-grading is the only scalable gate for one learner). What changed:
faking now requires *repeated, explicit* dishonesty (typed attempt + honesty declaration
+ later retention pass), every lie is recorded as evidence the learner re-reads, AI-heavy
work caps at Silver, and the dashboard/exports keep claimed ≠ verified visible. The
system makes lying visible and effortful, not impossible. **Accepted per spec.**

**P2 — Dopamine surface sweep.** Walkthrough found one leak: the shell sidebar still
showed `0 XP`. **Fixed** (now `N verified capabilities`). Grep confirms no XP renders
anywhere; ranks remain as slow boss-derived milestones; streak stat remains on the
dashboard (weekly-cadence framing, no celebration attached) — judged acceptable.

**P3 — Evidence engine correctness.** tsx unit runs: v2→v3 migration converts a bare
`gold` tier into a `legacy-*` manual-override event deriving to
`{gold, provisional, legacy, verified:false, semantic:"claimed-provisional"}` — old
claims are honestly demoted to unverified, never erased. Reset = boundary event;
derivation restarts after it. Validator green over 149 nodes / 16 lessons / 42 packets.

**P4 — Packet integrity.** 42 packets all trace to `docs/curation/` records
(`researchRecord` existence validator-enforced); per-step minutes sum honestly
(agent-reported deviations documented in the records); unverifiable media carries
`unverified: true`. Embed-blocked environments show a dead iframe frame — cross-origin
iframes expose no reliable failure signal, and the card still carries why-text,
"open original ↗" and the active-watch log, so the flow survives. **Accepted with note.**

**P5 — Bottleneck choice.** Fresh user: Today picks *Algebra Repair (test-out loop)*
with Terminal & Shell as the implementation slot and parallel track — matches §15
(diagnose-and-repair before lectures; survival tools in parallel). After evidence
exists, most-recent-incomplete-node wins (E2E confirmed). The "why now" panel explains
the pick on both Today and the node page.

**P6 — Tutor bridge round-trip.** `buildTutorPacket` (2.1 KB) carries goal, node state
incl. "claimed-unverified", prereq verification state, AI-assistance history, the
non-negotiable rules (never solve the mastery task; end with the JSON block).
`parseTutorSummary` tolerates fenced/prose-wrapped JSON, rejects garbage and unknown
node ids. Evidence weighting per Δ11: session → `tutor/info` (score 1 on any full
solution exposure), independent successes → `problem/pass/socratic`, hint-assisted →
`minor_hints`, exposures → `partial/full_solution_seen`, weaknesses → retrieval fails.

**P7 — Uncurated nodes.** `l7-launch-tf-urdf` renders the identical academy flow from
its bindings: honest "assembled from its verified sources" note, exact study sections,
tier-marked prerequisites, test-out, stuck path. No second-class experience.

**P8 — Mobile (390×844).** All ten surfaces render clean, zero console/page errors;
bottleneck card and steps fully legible; bottom tab bar fixed. (Full-page screenshots
show the fixed bar mid-scroll — a capture artifact, not a layout bug.)

**P9 — Durability.** Server-side event-id union merge + caps (4 MB, 500/PUT, 20 k)
are code-complete; live PUT exercise requires Redis, absent in this environment —
**deferred to first production smoke** (runbook: RECOVERY.md). Export produces the
4-file batch (backup + tutor-readable state ×2 + handoff); learner state never touches
the repo.

**P10 — Honest open debts.** (a) Packet tranche 2: L3–L9 remaining core + L13–L16
research spine (fallback flow covers them meanwhile); (b) Supabase stays deferred
behind the recorded triggers in doc 05; (c) no off-app retention nudges (no email
infra by design — the Review queue is in-app only); (d) `endSeconds` on embeds is a
player parameter, advisory not enforced; (e) single-learner assumptions throughout
(fine for the stated user; revisit at >~20 users per doc 05).

## 2. §48 scenario walkthroughs executed

1. **Fresh day 0** — dashboard (BOOT state, 3-step orientation, verified 0) → guide →
   Today (one bottleneck, 5 steps, stuck path, ship line). ✓
2. **Honest claim** — l0-terminal test-out: typed attempt → "I did this myself" →
   "It held" → "Recorded. Gate reached — verifies at your next review (≈2 days).
   Unlocks are live now." → reload persists → l0-editor flips AVAILABLE. ✓
3. **AI-assisted claim** — l0-git with "AI produced much of it" → Silver-cap warning
   shown before verdict. ✓
4. **Honest failure** — l0-github "It didn't hold" → "the gap you just found is the
   syllabus" — no penalty theater, evidence recorded. ✓
5. **Claim ≠ verified everywhere** — dashboard "+N claimed, unverified", sidebar counts
   only verified, review page explains pass→verified. ✓
6. **Curated vs fallback node** — l0-terminal/l2-matrices/l6-kalman full packet flow;
   l7 fallback identical shape. ✓
7. **Mobile** — all of the above at 390 px. ✓

## 3. Fixes applied during this review

- Sidebar XP → verified-capabilities count (P2).
- Today packet loading: sync `setState` in effect replaced with id-keyed loaded state +
  derived packet (react-hooks compiler compliance; stale-packet flash impossible).
- Dead imports removed (`totalXp`, `resourceById`, `NODE_MAP`, `hasLesson`, `SectionTitle`).

## 4. Verdict

The §69 test — *"What can he now do independently that he could not do 30 days ago?"* —
now has a first-class answer surface (verified capabilities, each named by its node's
mastery bar), and the two mandates of the final directive hold in the running product:
starting is easier (one bottleneck, one path, designed exits), and faking mastery is
strictly harder than doing the work honestly at every point we could reach.
