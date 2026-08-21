# 06 — Rebuild Plan
Date: 2026-08-21 · Maps HANDOVERFINAL §58 phases onto this repository. Preserves everything §57
lists; every change below traces to an audit finding in 00–05.

## A. Learner-state: evidence events replace self-awarded tiers (§24–26, fixes 03)

**New types** (`src/lib/evidence.ts` + `types.ts` extensions):

```ts
type EvidenceKind =
  | "exposure" | "retrieval" | "problem" | "implementation" | "debugging"
  | "derivation" | "assessment" | "transfer" | "retention"
  | "project" | "paper" | "research" | "tutor" | "manual-override";

type IndependenceLevel =
  | "independent" | "minor_hints" | "socratic" | "partial_solution" | "full_solution_seen";

interface EvidenceRecord {
  id: string; nodeId: string; kind: EvidenceKind;
  outcome: "pass" | "fail" | "partial" | "info";
  independence?: IndependenceLevel;   // REQUIRED (no default) for assessment/transfer
  score?: number;                     // 0..1 where applicable
  attempt?: string;                   // typed closed-book attempt (assessment/retention)
  artifact?: string;                  // repo/commit/url/description for implementation+
  note?: string; minutes?: number; at: number;
}
```

**Store (schema v3):** progress becomes `{snapshot, events[]}`; events are append-only and
merged server-side by id-union (closes the multi-device LWW hole for history). Actions:
`recordEvidence(...)` variants per kind. `claimTier` is deleted from normal UI; it survives as
`recordManualOverride` (admin/migration), rendered everywhere with an "unverified override" flag.
**Migration:** each existing `NodeProgress.tier` becomes one `manual-override` event; nothing
re-locks; legacy claims display as *claimed — unverified* until re-evidenced.

**Derived state** (`engine/competency.ts`, pure): dimensions (exposure, comprehension,
independentApplication, implementation, transfer, retention, integration, aiDependence,
confidence) computed from events; the simplified display tier and the §31 semantic state derive
from dimensions:

```
unknown → exposed → practicing → assessment-ready
→ claimed-provisional (independent assessment passed; unlocks fire NOW — honest speed is never delayed)
→ independently-verified (assessment + transfer or first delayed retention pass)
→ integrated (project/paper evidence) → research-level
plus: weak (failing practice), retention-risk (failed retention; unlocks persist, review prioritizes)
```

- Gate edges consume the derived tier; provisional counts for unlocking (§41), verification
  gates only the celebration and the "verified" badge.
- Retention failure lowers retention/confidence dimensions and the semantic state — never erases
  evidence (§27). Recovery = pass the next retention item.
- Boss pass = per-criterion checklist + typed outcome notes → assessment event; no one-click pass.
- **Binge detector** in `engine/metrics.ts`: ≥3 gate assessments/24 h with practice+minutes
  evidence < 30% of the nodes' declared hours → alert warning + celebrations downgrade to a flat
  acknowledgment while active.
- **Celebration:** MasteryMoment fires on `unknown→…→independently-verified` transitions (and
  verified boss/rank changes), with capability language ("You can now: <prove-it task>") and the
  unlock reveal; XP removed from the overlay.

## B. Learning packets: the academy layer (§6–20, §50, §60–61, fixes 02)

**Content model** (`src/lib/packet-types.ts`, packets in `src/content/packets/<node-id>.ts`,
manifest+registry pattern identical to lessons; validator extended):

```
LearningPacket { nodeId, diagnostic?, orient?, coreWatch[]?, coreRead[]?, recall[],
  interactiveIds?, practice[], implement?, derive?, stuck{alternate?, tutorModes},
  deepen[]?, prove{task, criteria[], minutes}, transfer?, retention?, researchRecord }
MediaItem { title, creator, url, embedUrl?, startSeconds?, endSeconds?, minutes, role,
  whySelected, leaveWith[] }
```

- Sources: the `docs/curation/<node-id>.md` records (live-researched 2026-08-21). `resources.ts`
  stays the authority layer; packets are the assignment layer and reference it.
- **Video cards** (§50): privacy-enhanced `youtube-nocookie` embed, `start`/`end` honored, no
  autoplay, expected minutes + "why this one" + "leave with", open-original link, and 2–5 recall
  questions immediately after — the card is not "watched" until recall is attempted (retrieval
  evidence, typed-then-self-graded or MCQ).
- **Packet runner** on the node page (§19 flow): DIAGNOSTIC (typed cold attempt; pass →
  assessment evidence and immediate skip honoring test-out) → WHY (30–90 s) → WATCH → RECALL →
  INTERACT (existing widgets/lessons slot here) → FORMALIZE/READ → PRACTICE → BUILD/DERIVE →
  STUCK? (tutor + alternate) → PROVE IT (typed, independence required) → UNLOCKED. Default view
  shows only the next step; everything else expands. Each step completion writes the matching
  evidence kind — the flow *is* the evidence trail.
- **Fallback:** nodes without packets render the same skeleton from their existing resource
  bindings (role-annotated), so the experience degrades to "thinner", never to "different".
- The 16 existing lessons plug into their packets' INTERACT/FORMALIZE step and now emit
  exposure/retrieval evidence instead of a dead completion flag.
- **Scope now vs later (§68 Risk 2):** typed packets ship first for the early critical path
  (L0 survival, Python core, NumPy, math repair, linear algebra, calculus — ~25 nodes) plus the
  flagship spine nodes (backprop, attention, frames, jacobians, kalman, mdp, bc-dagger,
  vla-anatomy); remaining core nodes follow from their curation records in subsequent passes.

## C. Today: one bottleneck (§28–30, fixes 01/F5)

Default mobile-first view: CURRENT BOTTLENECK (one node) · TODAY'S CAPABILITY TARGET (its
prove-it task) · WHY NOW (blocks-what) · the packet's next 3–5 steps with progressive reveal ·
STUCK? (tutor buttons) · NEXT UNLOCK. Review-due and active-project collapse into secondary rows.
Research-mode days keep the experiment loop but pull real targets (open experiment, paper in
flight, writing target) instead of static template lines. No frontier feed (§29). Pacing drift
moves to /weekly.

## D. Dopamine defense (§2.4, §28, fixes 01/F1)

XP leaves the dashboard hero, the mastery overlay, and Today entirely (survives as a small
Settings/weekly statistic); counts ("149 nodes") leave the primary surfaces; capability sentences
replace numbers; reset moves behind Settings→danger with typed confirmation (no longer adjacent
to assessment actions); celebration policy per A; deep-work hours remain quiet and honest.

## E. Tutor bridge (§21–23, §37, §39, §51, fixes 04)

`buildTutorPacket(mode, nodeId)` from live state; contextual buttons on packet steps; paste-box
ingestion of the §23 session JSON → typed evidence (full-solution exposures raise aiDependence);
`tutor/` handoff files + `SESSION_SCHEMA.json` in-repo; `learner-state/` exports generated
on demand, never auto-committed (public repo, §64–65).

## F. Data durability (per 05 decision)

Repository interface `server/progress-repo.ts` (Redis behind it); event-union merge server-side;
`.env.example`; Export Everything (JSON + Markdown) + import/restore; `ADMIN_RESET_TOKEN`
recovery path; `docs/recalibration/RECOVERY.md` runbook. Supabase deferred with recorded
triggers (05).

## G. Delivery order (each a separate commit, green build + validator before push)

1. **R1** Recalibration docs 00–07 + curation records.
2. **R2** Evidence engine: types, store v3 + migration, derived competency, binge detector,
   celebration rewire, validator updates.
3. **R3** Packet model + validator + typed packets (early path + flagships) + fallback skeleton.
4. **R4** Packet runner UI + video cards + recall + tutor bridge + boss/defense wiring.
5. **R5** Today rebuild + dashboard calm + XP demotion + tree semantic states.
6. **R6** Durability: repo interface, export/import, .env.example, handoff files, recovery docs.
7. **R7** Post-implementation ten-pass critique + §48 scenario walkthroughs + fixes + final push.

## H. Explicitly not built (§54)

No social/leaderboards/certificates/avatars/flashcard-empire/marketplace/motivational quotes;
no mandatory API tutoring; no auto-generated unlimited practice without validation; no Supabase
migration this cycle (triggered decision, 05); no per-checkbox git checkpoints (§38).
