# 210-Day Feasibility Analysis — Honest Math

**Date:** 2026-08-21 · Status: v1.0

The handover demands validation "that the workload can plausibly fit ~210 days at ~5–7
focused hours/day" and that anything that cannot fit is flagged. This is that analysis.

## 1. The budget

- 210 days = 30 weeks. 6 working days/week → **180 working days**.
- 5–7 focused h/day → **900–1,260 focused hours** (center: ~1,080).
- Weekly review day cost: 30 × ~3 h = **90 h** (retrieval, audits, planning).
- Realistic availability shocks (illness, life): reserve **–8%** → planning floor ≈ **830–1,160 h** for node work.

## 2. The load

| Block | Core h | Notes |
|---|---|---|
| L0–L2 foundations (survival, Python, math) | 186 | runs Days 1–45 in parallel tracks |
| L3–L4 ML + DL | 120 | overlaps tail of L2 |
| L5–L9 robotics core (geometry→autonomy) | 206 | overlaps L4 partially |
| L10–L11 robot learning | 90 | |
| L12–L14 VLA, world models, sim2real | 98 | |
| L15 research methodology + reproduction | 34 (+reproduction inside M6 budget) | starts Month 2 |
| L16 original research sprint | ~120 | Month 7, protected |
| **Core total** | **~854** | |
| Stretch pool (optional depth) | +128 | absorbed only if ahead |

**Core (854) + weekly reviews (90) = 944 h** → fits at **5.4 h/day average**; the 7 h/day
ceiling leaves ~300 h of headroom for stretch content, remediation, and overruns.

## 3. Why the parallel-track model is the load-bearing assumption

A university serializes: semester of calculus → semester of linear algebra → … Our learner
runs **Math (≈2 h) ∥ Implementation (≈1.5 h) ∥ Specialization (≈1.5 h) ∥ Project (≈1 h)**
daily. The strictly-serial critical path (algebra → … → VLA fine-tune → research) is only
≈ 420 h; at ≈3 h/day of critical-track time it completes ≈ Day 140. **210 days fails only
if tracks are serialized or mastery gates are ignored (debt compounds).**

## 4. Stress points (flagged, per handover §34.13)

1. **Math bootloader variance is the #1 risk.** Grade-10 → working multivariable calculus +
   linear algebra is budgeted 96 h. For a genuinely fast learner this is achievable (Khan
   Academy unit tests allow testing-out; the app's diagnostic-skip exists exactly for this).
   If it takes 150 h instead, the stretch pool absorbs it — but if it takes 250 h, Months 6–7
   compress and **reproduction scope must shrink (one deep reproduction, not several).** The
   dashboard's pacing overlay makes this visible by Week 4, when corrective re-planning is cheap.
2. **"Reproduce multiple meaningful results" (Month 6, handover §8) is the least certain
   promise.** One rigorous component-level reproduction + one lighter evaluation-level
   reproduction is the realistic target; a full π0-scale reproduction is out of reach of any
   solo learner and is explicitly de-scoped (see 04-compute-strategy.md).
3. **ROS 2 scope creep.** ROS is capped at 40 core hours (literacy, not mastery). The classic
   failure is a month lost in ROS plumbing; the curriculum's gate is a working pipeline, not
   framework fluency. C++ is capped at reading literacy (8 h + just-in-time).
4. **Level 9 (planning/autonomy) is the designated sacrifice.** If the schedule slips by
   >2 weeks at Day 120, the mobile-manipulation capstone shrinks to a fixed-base manipulation
   capstone (tabletop), and Nav2/SLAM drop to SKIM. This is pre-decided so the decision costs
   nothing in the moment. Rationale: the research target (manipulation-centric embodied
   learning) survives this cut; frontier VLA work is overwhelmingly tabletop/bimanual.
5. **Month-7 protection rule.** Original research (L16) begins no later than Day 180 with
   whatever level was reached. A smaller genuine research loop beats a bigger curriculum:
   this rule is enforced by the app (research mode activates on schedule regardless of
   curriculum completion, per handover §30).

## 5. What cannot fit (explicit non-promises)

- World-class researcher in 210 days: **no** (per handover §3 this was never the promise).
- Training a VLA from scratch: **no** — fine-tuning + component reproduction only.
- Deep SLAM, full classical control, dexterous-hand research, legged locomotion depth: **cut**
  to context-level; each is a documented "later branch" in the app.
- Real-hardware mastery: **optional branch**; the 210-day core is simulation-first.

## 6. Verdict

Fits with margin **iff** (a) tracks run in parallel, (b) diagnostics skip already-known
material, (c) the two pre-decided de-scope levers (L9 shrink; reproduction scope) are pulled
on schedule. The app's job is to make those three mechanics unavoidable.
