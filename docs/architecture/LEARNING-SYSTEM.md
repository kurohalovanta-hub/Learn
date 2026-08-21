# The Learning System — Audit, Architecture & Quality Bar

**Status:** accepted · 2026-08-21 · governs Phase 3 ("teach inside the app")
**Prime directive:** EMBODIED // OS must *teach*, not link. Same scientific content authority
chain as ever (docs/research/); lessons are derived presentations of verified material, never
new curriculum decisions.

---

## 1. Audit of the Phase-2 application

### 1.1 Functional gaps (severity-ordered)

| # | Finding | Severity |
|---|---|---|
| A1 | **No mobile navigation exists.** Sidebar is `hidden md:flex`; below 768px there is no nav at all. | critical |
| A2 | **The app links out instead of teaching.** Node pages are specs (excellent ones), not learning experiences. | critical (the point of Phase 3) |
| A3 | No focus mode; studying happens amid dashboard chrome. | high |
| A4 | `/today` lists scheduler slots but has no narrative arc, no per-step completion, no progressive reveal. | high |
| A5 | Tree gives no "how far am I from X" insight; no zones; wheel-only zoom (unusable on touch); labels truncate. | high |
| A6 | Papers: `keyEquations` authored but never rendered; no lineage; no active comprehension check. | high |
| A7 | Mastery is silent — crossing a gate changes a badge; no capability moment, no unlock reveal. | high |
| A8 | No interactive mathematics anywhere; equations are static. | high |
| A9 | Code appears as prose strings; no code presentation system, no predict/trace/debug interactions. | high |
| A10 | `SearchPalette` statically imports the whole content DB into the shared layout bundle (every page pays). | med (perf) |
| A11 | No focus-visible styles, icon buttons lack labels, no reduced-motion handling. | med (a11y) |
| A12 | Identity/progress is device-local + shared-secret sync; user now requires accounts with admin approval. | req change |

### 1.2 Information architecture

14 flat nav items exceed mobile capacity and blur intent. Regrouped:

- **OPERATE:** Dashboard · Today · Skill Tree · Levels
- **BUILD:** Projects · Boss Fights · Labs
- **RESEARCH:** Paper Room · Experiments · Idea Inbox · Frontier
- **SYSTEM:** Review · Weekly · Settings (+ Admin when admin)

Mobile: top app bar (wordmark, day chip, search) + **bottom tab bar**: Today · Tree · Home ·
Review · More (drawer with the full grouped nav). `/learn/*` and Defense Mode suppress all
chrome (focus surfaces).

---

## 2. Lesson content architecture

### 2.1 Files

```
src/content/lessons/
  manifest.ts        # LESSON_META: id, nodeId, title, minutes, widgets — safe for any bundle
  registry.ts        # nodeId -> () => import("./<nodeId>")  (route-level code splitting)
  <nodeId>.ts        # one Lesson document per node (typed data, no JSX)
src/lib/lesson-types.ts   # schemas below
```

Lessons are **data, not components** — renderable by the runner, validatable by
`scripts/validate-content.ts` (which dynamic-imports every manifest entry and checks:
nodeId exists, widget ids registered, quiz answers coherent, section ids unique, referenced
node/paper/project ids valid).

### 2.2 Schema (essentials)

```ts
Lesson { nodeId, title, subtitle?, minutes, sections: LessonSection[] }
LessonSection { id, title, depth: Depth, blocks: LessonBlock[] }
Depth = intuition | formalism | derivation | implementation | application | research
LessonBlock =
 | prose        { md }                          // markdown + $inline$/$$display$$ math
 | equation     { tex, label?, note? }
 | derivation   { intro?, steps: {text, tex?}[] }      // stepper: reveal one at a time
 | widget       { id, caption?, params? }              // interactive visualization
 | code         { mode: read|predict|trace|missing|debug|write,
                  lang, source, prompt?, answer?, options?, explanation?, solution? }
 | quiz         { items: {q, options?, a, why}[] }     // retrieval; self-graded got/missed
 | exercise     { level: 1|2|3, prompt, hint?, solution? }   // progressive difficulty
 | misconception{ wrong, right }
 | connection   { md, nodeIds?, paperIds?, projectIds? }     // where this is used later
 | sources      {}                                     // renders the node's verified bindings
 | mastery      {}                                     // renders the node's gate claim
 | callout      { tone: info|warn|insight, title?, md }
```

### 2.3 The depth contract (requirement §2)

Every lesson is organized as an ascent: **INTUITION → FORMALISM → DERIVATION →
IMPLEMENTATION → APPLICATION → RESEARCH**. The runner renders a depth rail; any band is
one tap away, **and "Attempt mastery now" is always available from the first screen** —
diagnostics, not chapters, gate progress. Beginner bands are skippable, never watered down:
formal bands carry full mathematical weight.

### 2.4 The runner (`/learn/[nodeId]`)

Full-screen focus surface. One section at a time; progress rail (sections × depth); prev/next
via buttons, ←/→/j/k, and horizontal swipe; position + per-check results persisted
(`lessonProgress` in the store, synced). Derivation steppers reveal step-by-step. Retrieval
checks record got/missed (missed items feed the review system's honesty). Exit restores the
node page. Perceived speed: lesson modules and widgets load per-route via dynamic import.

### 2.5 Code-learning interaction set (requirement §4)

No fragile in-browser Python runtime (deliberate: research-verified priority is structured
practice over gimmick). Instead, six precise interaction modes on `CodeBlock`:

- **read** — annotated presentation (mini syntax highlighter, line emphasis).
- **predict** — "what does this print?" → commit an answer (type or choose) → reveal + why.
- **trace** — step through iterations via a revealed state table.
- **missing** — one/two masked lines; learner writes them; reveal canonical + variants.
- **debug** — planted bug; learner names line + fix; reveal.
- **write** — implementation-from-spec with acceptance checks listed; done in the real
  editor/notebook, then self-verified against the checks ("recognized ≠ can write" is
  enforced by requiring the independent-write claim on the mastery gate, not by the widget).

### 2.6 Quality rubric (every lesson must pass before merge)

1. **Grounded:** facts/equations traceable to the node's verified sources; no invented claims.
2. **Motivated:** opens with *why this exists here* and names the exact future consumer
   (node/paper/project ids), not "this is important".
3. **Ascending:** intuition never lies; formal band is complete; derivation is honest
   (no "it can be shown").
4. **Active ≥ 40%:** at least: 1 widget or worked interaction, 1 retrieval quiz (≥3 items),
   2 progressive exercises, 1 misconception.
5. **Embodied:** at least one robotics/embodied-AI instantiation of the concept.
6. **Exit-true:** final section = mastery gate + sources for depth; the lesson never claims
   completion it can't test.
7. **Terse:** no filler sentences; every paragraph earns its screen space on a phone.

---

## 3. Interactive widget catalog

Toolkit: hand-rolled SVG + pointer events + rAF; shared primitives (`Plot`, `useDrag`,
`Slider`, readout chips, KaTeX labels). Zero new runtime dependencies. All widgets work by
touch, respect reduced-motion, and show live mathematical readouts.

| id | Teaches | Used by |
|---|---|---|
| `vector-playground` | vectors, dot product, projection | l2-vectors |
| `matrix-transform` | matrices as maps, det, eigenvectors | l2-matrices, l2-eigen-svd |
| `derivative-explorer` | secant→tangent, sensitivity | l2-derivatives |
| `gradient-descent` | lr/momentum on 2D landscapes (bowl/ravine/saddle/Rosenbrock) | l2-optimization, l3 |
| `gaussian-explorer` | μ/σ, mass, sampling | l2-random-variables, l6 |
| `backprop-graph` | forward values / backward grads on σ(wx+b) loss | l3-backprop-theory |
| `attention-vis` | QKᵀ/√d heatmap, causal mask, value mixing | l4-attention |
| `rotation-2d` | frames, R(θ), composition order | l2-trig, l5-frames-rotations |
| `so3-explorer` | axis-angle, quaternion, Euler gimbal lock (projected 3D triad) | l5-quaternions, l5-lie-se3 |
| `planar-arm` | FK, IK (DLS iterations), Jacobian/manipulability ellipse, singularities | l5-fk, l5-ik, l5-jacobians |
| `pid-tuner` | Kp/Ki/Kd on a 2nd-order plant, disturbance | l6-feedback-pid |
| `kalman-1d` | predict/update belief Gaussians, K as trust | l6-bayes-filter, l6-kalman |
| `gridworld-value` | value iteration, γ, greedy policy | l10-mdp, l10-tabular |
| `bc-drift` | compounding error vs DAgger corrections | l11-bc-dagger |
| `vla-flow` | π0-class anatomy: tokens→backbone→action expert→chunk | l12-vla-anatomy |

Physical/mathematical fidelity rule: every widget implements the *real* equations (real DLS
iteration, real Riccati-free PID integration at fixed dt, real value iteration), simplified in
scope, never faked in dynamics.

## 4. Progression UX (competence, not confetti)

- **Mastery moment:** crossing a node's gate triggers a full-screen, restrained overlay:
  `NODE — MASTERED`, tier, +XP, then **UNLOCKED**: newly-available nodes, papers whose
  prerequisites just completed, projects now open, rank change if any. One keystroke to
  dismiss. Data from `masteryDelta()` (engine), truthful only — nothing lights up unless it
  actually unlocked.
- **Tree as map of becoming:** zone headers (FOUNDATIONS → ML → ROBOTICS → ROBOT LEARNING →
  FRONTIER → RESEARCH); locked branches faint but visible; selecting any node shows
  *distance* (count of incomplete ancestors) and highlights that exact subgraph as "your
  shortest mastery path".
- **Vocabulary escalates with rank** (labels only — content never dumbs down).

## 5. Papers as learnable objects

Spine papers gain: lineage (before/after), objective equation, dataset/benchmark/claim,
weaknesses, and a **Defense Mode**: sequential adversarial questions; learner answers
(typed or aloud), reveals the coverage rubric, self-grades; verdict recorded
(`papers[id].defense`). Honest by construction: the app can't judge free text, so it judges
*coverage against a rubric the learner confronts* — same self-assessment contract as tiers.

## 6. Milestones (each a separate commit)

M1 docs → M2 auth/accounts → M3 design system & shell → M4 lesson engine → M5 widgets →
M6 lessons → M7 today-mission → M8 tree → M9 papers/defense → M10 mastery moment →
M11 audit+fixes → M12 docs/README/final.

Non-negotiables preserved throughout: content validators, mastery/tier logic, verified
scientific content, zero-env deployability.

## 7. Delivery note — 2026-08-21

All twelve milestones shipped on `claude/embodied-intelligence-research-s48jrg`:
16 lessons (l1-python-basics → l12-vla-anatomy) passing the §5 rubric mechanically
via `validateLessons()`; 15 widgets on the hand-rolled SVG toolkit (real equations
throughout — eigensolves, DLS iterations, 240 Hz plant, value-iteration sweeps);
7-step mission `/today`; pathfinding tree; 63 paper study pages + Defense Mode;
`/guide` field manual + instrument bench in `/labs`. Build: 333 static pages, lint
clean under the react-hooks compiler rules. A Vercel project (`embodied-os`, VANTA
team) is git-linked to the repo — pushes build automatically; production follows
the default branch.
