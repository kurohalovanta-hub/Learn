# 07 — Ten-Pass Adversarial Critique of the Rebuild Plan
Date: 2026-08-21 · Target: `06-rebuild-plan.md` as originally drafted. Rule (§46): each pass must
find failures and force modifications — passes that found real defects list them and the adopted
fix; the plan in 06 §A–H is to be read **as amended by the Δ items below**.

## Pass 1 — Beginner reality (zero-coding learner, day 1)

**Failures found.**
- The packet flow opened with DIAGNOSTIC for every node. A person who has never seen a terminal
  gains nothing from a cold challenge on `l0-terminal` except intimidation; diagnostics exist for
  *repair* topics (test-out) not greenfield ones.
- State vocabulary ("evidence", "provisional", "competency dimensions") is designer jargon a
  beginner cannot act on.
- Forced independence selection with five options is unexplained friction on first contact.

**Δ adopted:** Diagnostic step is prominent only on repair-class nodes (math repair, anything the
learner may already know); greenfield nodes show a quiet "already know this? test out" link and
default to WHY→WATCH. UI copy uses plain words everywhere: *claimed — not yet verified*,
*verified*, *needs review*. First three independence prompts carry a one-line inline explainer;
options collapse to three (myself / with hints / AI did much of it) mapping onto the five-level
internal scale.

## Pass 2 — Academic-break reality (forgotten study habits)

**Failures found.** PROVE IT as typed closed-book prose from day 1 assumes retrieval habits the
learner is explicitly rebuilding (§40). Early L0/L1 packets demanding essay-style attempts will
produce avoidance, not honesty. The re-entry sweep (01/F8) risked feeling like a punishment exam.

**Δ adopted:** Prove-it format scales by level: L0–L1 prove-its are *do-tasks* ("run this, paste
what happened", "write this file, paste the output") — production, but concrete; derivation-style
attempts phase in with L2 math. Re-entry sweep is capped at 3 items, framed as recalibration,
and can only *lower confidence*, never lecture.

## Pass 3 — Dopamine / novelty (can the user binge apparent progress?)

**Failures found in the new design itself.**
- Exposure events are spammable — but exposure never advances state past *exposed*; harmless. ✓
- Recall/self-grades can be gamed by revealing then claiming pass — mitigated (commit-first UI,
  gibberish attempts remain inspectable) but not eliminated. Accepted, disclosed.
- **Real hole:** the diagnostic test-out path is one typed answer + self-grade → a binger could
  skip entire levels in an afternoon, recreating the old failure with extra steps.
- **Real hole:** nothing stops assessment-spam across many nodes in one sitting from *looking*
  like progress on the tree even while unverified.

**Δ adopted:** A diagnostic pass records a provisional assessment **and schedules an early
retention check (~2 days)** — binge-skipping gets audited automatically; diagnostic passes also
require the independence prompt. The binge detector (≥3 gate assessments/24 h with practice
evidence < 30% of declared hours) now also switches the tree's provisional styling to a distinct
"unverified streak" treatment and downgrades celebrations until a retention pass lands.

## Pass 4 — Mastery validity (unlock without competence?)

**Failures found.** Provisional unlocks fire on self-graded assessment (by design, §41 — honest
speed must not wait on the calendar). That means a determined self-deceiver can still walk deep
into the tree unverified. Blocking would be calendar-gating; not blocking hides the pretense.

**Δ adopted:** Pretense is made *visible where it hurts*: any node whose prerequisites include
provisional/legacy-override claims renders a quiet "built on unverified: <nodes>" line on its
packet header, and the weekly review lists the oldest unverified claims first. The dashboard's
readiness score counts **verified** state only (provisional shown as a separate, dimmer figure).

## Pass 5 — Resource efficiency (hours wasted on long courses)

**Failures found.** The fallback skeleton for not-yet-packeted nodes still surfaces course-grain
bindings (the exact §2.2 defect) for ~79 nodes; node pages displayed research-phase `hours`
(e.g. "14h") as the headline, which reads as an assignment.

**Δ adopted:** Fallback views render bindings with role labels and *"study only the listed
sections"* framing; packet pages headline **packet minutes** (sum of step estimates), with node
hours demoted to metadata. Packet-coverage debt is tracked in 06 §G as an explicit next tranche
(L3–L6), not silently.

## Pass 6 — Anti-shortcut (shortest-sufficient becoming shallow)

**Failures found.** Agent-curated records could select short videos for deep topics (the §9 item-7
failure); a packet consisting of watch+recall only would pass a naive validator.

**Δ adopted:** The packet validator **requires** ≥1 PRACTICE item and (IMPLEMENT or DERIVE) and a
PROVE IT task on every core packet; depth-flagged topics (Lie/SE(3), backprop, Kalman, PPO-class)
must carry a DEEPEN entry pointing at the authoritative long source. Flagship packets are
hand-reviewed against their curation records' "risk of superficial understanding" section before
shipping.

## Pass 7 — Research trajectory (does everything serve the target?)

**Failures found.** The plan front-loads packets on L0–L2 while the months-4–7 thinness (01/F6)
— the region nearest the research target — receives only debt tracking this cycle. That is a real
imbalance, partially defensible by §34 (scaffolding *should* thin) and §68 Risk 2 (usable academy
first), but §34 requires a *designed* hand-off, not an accident.

**Δ adopted:** The research-mode Today (06 §C) ships **this cycle** (real experiment/writing
targets, not template lines), and L10–L12 flagship packets (mdp, bc-dagger, vla-anatomy + the
§15-resequenced RL entries) are included in the first packet tranche so the far end of the spine
has exemplars, not just the near end.

## Pass 8 — AI dependency (can Claude do all the cognition?)

**Failures found.** The tutor packet contains the node's prove-it task — inviting "solve this for
me"; session-summary ingestion can be socially engineered (ask the tutor to write
`independent_successes`).

**Δ adopted:** The packet's mode contract explicitly instructs the tutor to *refuse to solve the
prove-it task and say so if asked*; prove-it attempts remain gated by the learner's own forced
independence declaration regardless of any tutor summary; tutor-reported successes are recorded as
`tutor` evidence (supporting, lower weight) and can never by themselves produce
*independently-verified*; `full_solution_exposures` raises aiDependence which surfaces weekly.
Residual risk (a learner lying to both instruments) is disclosed, not hidden.

## Pass 9 — Operational durability

**Failures found.** The append-only events array grows inside one Redis value (fine at expected
volume, but unbounded); a malicious/buggy client could PUT enormous event batches; export existed
in the plan but no size telemetry.

**Δ adopted:** Server caps events per PUT (500) and total value size (reject > 4 MB with a clear
error); Settings shows current data size and prompts an export beyond 2 MB; the recovery runbook
(05) covers the lockout case via `ADMIN_RESET_TOKEN`. Three-store independence (repo / Redis /
user exports) re-verified in 05.

## Pass 10 — Human mentor test (would I stake the learner's 7 months on this?)

**Honest verdict.** As amended: **yes for months 1–3** — the academy path is curated, evidenced,
verified, and calm. **Qualified for months 4–7**: packet coverage debt remains, and the product's
deepest limitation is structural and permanent — it is an *instrument*, not an *examiner*. It can
make honesty cheap, lies visible, and forgetting consequential; it cannot administer truth. The
examiner role belongs to the tutor protocols (§21–23) and, terminally, to reality (§55's
unfamiliar-paper test). The product now says exactly this on its mastery surfaces instead of
performing certainty it doesn't have. That is the standard a human mentor would accept — and the
one the previous build failed.

## Consolidated Δ register (all adopted into 06 before implementation)

Δ1 repair-only diagnostics + test-out link · Δ2 plain-language states + 3-way independence UI ·
Δ3 scaled L0/L1 prove-its · Δ4 gentle re-entry sweep · Δ5 early retention audit on diagnostic
skips · Δ6 binge → unverified-streak styling + celebration downgrade · Δ7 "built on unverified"
surfacing + verified-only readiness · Δ8 fallback role labels + packet-minutes headline ·
Δ9 validator-enforced practice/implement/prove + DEEPEN on depth-flagged nodes · Δ10 research-mode
Today in-cycle + far-end flagship packets · Δ11 tutor contract prove-it refusal + tutor-evidence
weighting · Δ12 PUT/event/size caps + export telemetry.
