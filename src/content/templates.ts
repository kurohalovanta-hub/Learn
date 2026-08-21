import type { ResearchTemplate, TutorPrompt } from "@/lib/types";

// Research templates (HANDOVER §19) — used by the Experiments page and Weekly review.
export const TEMPLATES: ResearchTemplate[] = [
  {
    id: "t-experiment-plan", title: "Experiment Plan",
    description: "Fill BEFORE any GPU-hour is spent. A plan someone else could execute.",
    fields: ["Hypothesis (falsifiable prediction)", "Baseline (what existing method, whose code, at what scale)", "Independent variable (the ONE thing changed)", "Dependent variable (exactly what is measured, how many episodes/seeds)", "Controls (what must stay constant)", "Success criterion (pre-registered threshold/tolerance)", "Seeds & analysis plan (CIs, comparisons)", "Compute budget (GPU-hours, storage)", "Abort criteria (what result stops this line)"],
  },
  {
    id: "t-experiment-log", title: "Experiment Log Entry",
    description: "One per run or run-group. The decision trail is the product.",
    fields: ["Date / experiment ID", "Commit hash + config diff", "What I expected", "What happened (numbers, curves)", "Surprises / anomalies", "Decision (keep / kill / iterate) and why", "Next action"],
  },
  {
    id: "t-paper-notes", title: "Paper Notes (3-pass)",
    description: "Pass 1: 10 min triage. Pass 2: the sections below. Pass 3: re-derivation (spine papers only).",
    fields: ["One-sentence claim", "Evidence offered (experiments, scale, baselines)", "Assumptions (stated and hidden)", "Key equations (each symbol named)", "What would break this", "Questions for the authors", "Relevance to my direction (1–5) and why"],
  },
  {
    id: "t-reproduction-report", title: "Reproduction Report",
    description: "The Month-6 centerpiece format. Honesty over heroics.",
    fields: ["Claim reproduced (exact number, exact setting)", "Pre-registered tolerance", "Environment capture (versions, hardware, seeds)", "Result vs claim (table with CIs)", "Deviation log (every difference, when discovered)", "Failure analysis (what broke, what it taught)", "What I'd tell the authors", "Cost accounting (hours, GPU-hours)"],
  },
  {
    id: "t-ablation-table", title: "Ablation Table",
    description: "One axis at a time; the credit-assignment instrument.",
    fields: ["Full system score (seeds × episodes, CI)", "− component A", "− component B", "− A − B (interaction check)", "Reading: which component carries the gain?", "Confound audit (what else changed with each removal?)"],
  },
  {
    id: "t-failure-taxonomy", title: "Failure Taxonomy",
    description: "Watch the rollouts. Count the ways they die. Let counts drive the next experiment.",
    fields: ["Category definitions (≤6, mutually exclusive)", "Counts per category (n=50+ rollouts)", "Exemplar clip/screenshot per category", "Pareto reading: the dominant failure", "The experiment the dominant failure implies"],
  },
  {
    id: "t-weekly-memo", title: "Weekly Research Memo",
    description: "Every 7th day (HANDOVER §23). Written to future-you.",
    fields: ["What I truly learned (could rebuild cold)", "What I merely recognized", "What I forgot (review-queue evidence)", "Blockers for next week", "What should be removed from the plan", "What should be accelerated", "Hours audit (planned vs actual, by block)", "AI-dependence audit (independence mix this week)"],
  },
];

// AI tutoring prompt templates (HANDOVER §11) — copy-paste into any assistant.
export const TUTOR_PROMPTS: TutorPrompt[] = [
  {
    id: "tp-socratic", title: "Socratic gap-finder",
    when: "When stuck on a concept and tempted to ask for the answer.",
    prompt: "Do not solve this or explain it yet. Ask me one question at a time until you identify the exact prerequisite I am missing. Then tell me only the name of the missing concept and where it sits in my curriculum — not the solution.",
  },
  {
    id: "tp-derive", title: "Derivation trainer",
    when: "For every equation marked 'derive' in a node.",
    prompt: "Make me derive this equation myself. State the starting point, then wait. After each step I attempt, respond only with 'correct', 'error in step N', or one minimal hint. Never show the next step until I have attempted it.",
  },
  {
    id: "tp-defend", title: "Paper defense",
    when: "After pass 2 of any READ paper.",
    prompt: "Quiz me on this paper as if I am defending it to the authors. Attack the assumptions, the baselines, and the statistics. If my answer is vague, say 'vague' and re-ask. Score me at the end on: claims, method, evidence, limitations.",
  },
  {
    id: "tp-prove-task", title: "Minimal proof-of-understanding task",
    when: "Before marking any node Gold.",
    prompt: "Give me a minimal implementation task that proves I understand this concept — something that takes under an hour, cannot be completed by pattern-matching tutorials, and has a verifiable output. Do not include solution code.",
  },
  {
    id: "tp-review-code", title: "Conceptual code review",
    when: "After completing an implementation exercise.",
    prompt: "Review my code for conceptual errors — places where it works but for the wrong reason, hidden assumptions, or numerical hazards. Do not rewrite it or produce corrected code unless I explicitly ask for the solution. Rank findings by severity.",
  },
  {
    id: "tp-transfer", title: "Transfer problem generator",
    when: "For Platinum-tier attempts.",
    prompt: "Give me a new problem that requires transferring this concept to an unfamiliar setting — not a variation of the exercises I've done. It should feel unrelated on the surface. After I solve it (or fail), reveal the mapping.",
  },
  {
    id: "tp-committee", title: "Research committee",
    when: "Month 7: proposal review and the Final Boss defense.",
    prompt: "Act as a skeptical three-person research committee (methods expert, statistician, domain veteran). I will present my hypothesis/results. Cross-examine me one question at a time, hardest first. Do not soften. End with: accept / major revision / reject, with reasons.",
  },
  {
    id: "tp-eli-feynman", title: "Feynman check",
    when: "Weekly review explain-backs.",
    prompt: "I will explain a concept as if to a smart 15-year-old. Interrupt the moment I use a term I haven't earned, hand-wave a step, or hide behind jargon. The explanation fails if any sentence couldn't be cashed out into something concrete.",
  },
];
