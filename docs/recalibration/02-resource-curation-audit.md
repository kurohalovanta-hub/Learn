# 02 — Resource Curation Audit
Date: 2026-08-21 · Authority: HANDOVERFINAL §2.2, §6–18.

## What exists

`src/content/resources.ts` holds 93 records, live-verified 2026-08-21 during the research phase.
Quality of *selection* is high — the spine (Missing Semester, Think Python, Exercism, Khan
diagnostics, 3B1B, VMLS, MML, MIT 18.05, Karpathy, CS231n, Modern Robotics, Tedrake,
Douglas/Brunton, Labbe, MuJoCo, CS285, LeRobot, openpi) matches what HANDOVERFINAL §11–16
independently names as canonical. Records carry exact section strings (`study`, `skim`,
`skipParts`), roles, hours, and `lastVerified` dates. This research is preserved.

## The defect: course-grain, not concept-grain

A representative record assigns *"2026: L1 Shell · L2 Command-line Environment · L3 Dev
Environment & Tools · L5 Version Control & Git · L4 Debugging (first half)… 14 hours"* to a node.
That is a **reading list, not a learning packet**. The daily learner still has to answer for
himself: what do I open *right now*, for how many minutes, and what must I do immediately after?
Per §2.2 this granularity is the core curation gap:

- Bindings point at courses/books with section strings; none point at a specific 12–25 minute
  video with a timestamp and an expected-minutes figure.
- No record distinguishes ORIENT from CORE WATCH from DEEPEN roles *within* a node's materials —
  the `role` field ranks whole resources (primary/backup/reference) at node level only.
- No node has a stuck-path (a designated alternate explanation for when the primary doesn't land).
- No community-evidence trail exists: selections were verified for availability and authority,
  not against documented learner failure reports ("what confused beginners", "what made it click").
- Video is under-used relative to the learner's stated preference; where videos exist they are
  whole-course pointers (e.g. "3B1B Essence of Linear Algebra"), the exact §2.2 anti-example.

## What is being done about it

A live curation research pass (14 parallel research agents, WebSearch + WebFetch, run
2026-08-21) is producing `docs/curation/<node-id>.md` records for ~70 core critical-path nodes
across: L0 survival, Python core, NumPy/tooling, math repair, linear algebra, calculus,
probability, ML foundations, DL/transformers, robotics geometry, control/estimation, RL
(with the §15 resequencing correction), imitation/VLA, and ROS/perception.

Each record follows the §17 template: candidate pool (3–8 videos, 2–4 written, authority,
alternates), 1–5 scores on the §7 rubric, community evidence with URLs, a selected
shortest-sufficient packet (DIAGNOSTIC → ORIENT → CORE WATCH → CORE READ → INTERACTIVE →
PRACTICE → IMPLEMENT/DERIVE → STUCK PATH → DEEPEN → PROVE IT → TRANSFER → RETENTION), explicit
rejection rationale, and a superficiality-risk note. URL integrity rule: only URLs surfaced by
actual search/fetch during the pass; unverifiable metadata is marked, never fabricated.

Two known upstream corrections are enforced in the research briefs:

1. **RL sequencing (§15):** the current repo binds CS285 as primary for early RL nodes;
   community evidence says CS285-first is wrong for beginners. New sequence: intuitive MDP
   material + Sutton & Barto + gridworld first; CS285 selected lectures later. Records must
   state where they override the repo.
2. **ROS distro (§14):** verify Jazzy vs newer releases as of Aug 2026 before the packet is
   authored; docs-only learning is rejected in favor of tutorial→tiny task→real package→modify.

## Disposition of the existing database

- `resources.ts` remains the **authority layer** (what the canonical sources are); packets become
  the **assignment layer** (what to open now, for how long, in which role). Packets reference
  resources rather than replacing them.
- Nodes outside the core critical path (optional/stretch, and L13–L16 research-craft nodes whose
  "resource" is mostly practice) get the lighter process per §68 Risk 2: existing binding +
  role annotation, upgraded opportunistically.
- Freshness policy (§44): fast-moving records (ROS, simulators, LeRobot, VLA repos, benchmarks)
  carry re-verification obligations; stable math/control records do not get replaced for recency.

## Acceptance bar for each packet (from §45)

Correct · no hidden prerequisites · no shorter equally-good option unexamined · no dramatically
clearer slightly-longer option unexamined · addresses the documented confusion point · mandatory
active work after every passive element · mastery task tests transfer, not recognition ·
concept belongs on the path · nothing removable remains.
