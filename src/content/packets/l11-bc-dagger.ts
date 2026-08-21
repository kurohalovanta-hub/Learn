import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l11-bc-dagger.md (live-verified 2026-08-21).
// First legitimate CS285 contact in the imitation line: Lecture 2 + Spring-2026 HW1.

export const packet: LearningPacket = {
  nodeId: "l11-bc-dagger",
  whyNow:
    "Imitation is how most robot skills are actually trained in 2026, and covariate shift is its original sin: the policy's own small errors manufacture states the demonstrations never covered, and the failure compounds — O(εT²) worst case — while every offline metric stays green. This node produces that failure, measures it, and repairs it with DAgger. ACT, Diffusion Policy, and every VLA you meet next are answers to what you break here.",
  diagnostic: {
    prompt:
      "Cold, in writing: why does a 1% per-step error rate destroy a 200-step episode? What exactly does DAgger change about the data distribution?",
    minutes: 5,
  },
  coreWatch: [
    {
      title: "CS 285 Lecture 2: Imitation Learning — Part 1 (start here, continue through Part 4)",
      creator: "Sergey Levine (UC Berkeley RAIL)",
      url: "https://www.youtube.com/watch?v=tbLaFtYpWWU",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=tbLaFtYpWWU"),
      minutes: 45,
      whySelected:
        "The canonical treatment, by the field's central figure. Watch Parts 1–4 in sequence at 1.25–1.5×, with 'where does the εT² come from?' held in hand — the tightrope-walker and the distribution-shift diagrams are the pictures everyone cites. Per-part durations not re-verifiable at curation time.",
      leaveWith: [
        "p_π(s) ≠ p_data(s) — and why validation loss cannot see it",
        "errors compound because each mistake carries you further off-distribution",
        "BC is supervised learning evaluated on the wrong distribution",
      ],
      unverified: true,
    },
    {
      title: "CS 285 Lecture 2 — Part 5 (DAgger and the theory)",
      creator: "Sergey Levine (UC Berkeley RAIL)",
      url: "https://www.youtube.com/watch?v=awfrsjYnJmw",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=awfrsjYnJmw"),
      minutes: 25,
      whySelected:
        "The DAgger and εT-vs-εT² part of the same lecture. Per-part topic split not re-verifiable — if the content doesn't match, locate the DAgger/theory part from the playlist index.",
      leaveWith: [
        "DAgger relabels the LEARNER's states with expert actions",
        "same model, same loss — different data distribution",
        "the worst-case bound drops from O(εT²) to O(εT)",
      ],
      unverified: true,
    },
  ],
  coreRead: [
    {
      title: "Ross, Gordon & Bagnell 2011 — A Reduction of Imitation Learning to No-Regret Online Learning",
      url: "https://arxiv.org/abs/1011.0686",
      sections:
        "§§1–3 plus the theorem statements; skip the no-regret machinery proofs on first pass. Read εT² as a worst-case bound, not a prediction — see §2's tightness discussion.",
      minutes: 25,
      whySelected:
        "The primary source of both bounds — short, readable, and the paper your +7-day blank-page derivation must reproduce.",
    },
    {
      title: "CS285 Lecture 2 slides — Supervised Learning of Behaviors",
      url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-2.pdf",
      resourceId: "cs285",
      sections: "Full deck as a re-scan after the videos — these are the diagrams you will redraw from memory.",
      minutes: 10,
    },
    {
      title: "CS285 Spring-2026 HW1 handout",
      url: "https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf",
      resourceId: "cs285",
      sections: "Read fully before touching code — deliverables, env list, and evaluation targets.",
      minutes: 10,
    },
  ],
  recall: [
    {
      q: "Your BC policy's validation loss is excellent. Why can deployment still fail completely?",
      a: "Validation states come from the expert's distribution; at deployment the policy visits its OWN state distribution p_π, which drifts off-support as errors accumulate — no offline metric computed on expert states can see that.",
    },
    {
      q: "Where does the T² in O(εT²) come from?",
      a: "The policy errs with probability ~ε per step; once off the expert's distribution it can keep incurring worst-case cost for the remaining ~T steps. Summing that over T steps gives O(εT²).",
    },
    {
      q: "What does DAgger change — model, loss, or data?",
      a: "Only the data distribution: roll out the current learner, have the expert label the states the LEARNER visited, aggregate, retrain. Same architecture, same supervised loss.",
    },
    {
      q: "Why doesn't collecting 10× more expert demos fix compounding error?",
      a: "More demos only widen the covered band around expert trajectories; the learner's random walk out of the band still compounds. What's missing is coverage of learner-visited states — hence the scaling curve plateaus.",
    },
    {
      q: "What is DAgger's practical cost, and where is it cheap vs expensive?",
      a: "It requires an expert queryable on arbitrary learner states — cheap in sim (scripted/planner expert), expensive with humans, who must label states they never chose to visit.",
    },
  ],
  interactiveIds: ["bc-drift"],
  lessonId: "l11-bc-dagger",
  practice: [
    {
      prompt:
        "Before the lecture: the in-app lesson's why/drive sections with the bc-drift instrument — the η sweep, band-width, and DAgger-toggle labs, committing a prediction for the mean-|offset| strip before each reveal.",
      minutes: 12,
    },
    {
      prompt:
        "The scaling exercise: on HW1's BC, vary demonstration count 5 → 500; plot return vs demo count and write one paragraph on where and WHY the curve plateaus (drift, not capacity).",
      source: "https://github.com/berkeleydeeprlcourse/homework_spring2026",
      minutes: 45,
    },
  ],
  implement: {
    spec: "CS285 Spring-2026 HW1 (hw1_imitation), using its uv-based workflow — never run pip directly, always uv run — with W&B logging: (1) BC on expert MuJoCo demos, measuring the performance gap vs the expert; (2) DAgger, with the recovery-across-iterations plot. Setup friction is real and is itself curriculum. No solution repos — they poison the mastery claim.",
    checks: [
      "BC gap vs expert measured on at least two envs, not asserted",
      "DAgger's per-iteration return curve visibly closes (most of) the gap",
      "You can point to the exact line where learner-visited states receive expert labels",
      "Every run logged; every plot regenerable from config",
    ],
    minutes: 210,
  },
  derive: {
    spec: "Blank page: reproduce the compounding-error argument — the O(εT²) bound for BC and the O(εT) bound for DAgger — stating the assumptions (per-step error ε on-distribution, bounded per-step cost) and showing where each factor of T enters.",
    checks: [
      "Both bounds derived without the paper open",
      "You can name which assumption DAgger relaxes and which new cost it adds (a queryable expert)",
    ],
    minutes: 30,
  },
  stuck: {
    alternateRead: {
      title: "Imitation learning 101: behavior cloning and DAgger (RobotForge)",
      url: "https://robotforge.org/tutorials/learning/imitation-learning-basics",
      sections: "The full gentler walk: state/action recording, MSE/CE losses, the T²ε argument, DAgger-as-recovery",
      minutes: 25,
    },
    note: "If the bound still won't reproduce after RobotForge, the EmergentMind DAgger topic page (kept in deepen) gives a second compact statement of the theorems.",
  },
  deepen: [
    {
      title: "Imitation Learning Review (Branton DeMoss, Oxford)",
      url: "https://www.robots.ox.ac.uk/~bdemoss/research_notes/ImitationLearning.pdf",
      sections: "The BC → DAgger → IRL arc — where this node sits in the wider imitation landscape",
      minutes: 40,
    },
    {
      title: "Dataset Aggregation (DAgger) — EmergentMind topic page",
      url: "https://www.emergentmind.com/topics/dataset-aggregation-dagger",
      sections: "Concise reference with paper links — a second compact statement of the theory, for after the HW",
      minutes: 10,
    },
  ],
  prove: {
    task: "The node's mastery test — an HW1-grade artifact: BC and DAgger both implemented, the compounding-error story told with YOUR plots (scaling curve + recovery curve), and the T vs T² argument reproduced on paper with no notes. Close with one cold sentence: why can't validation loss see the failure?",
    criteria: [
      "Both algorithms are yours and working, with the expert gap and its DAgger recovery quantified",
      "The scaling-curve paragraph correctly attributes the plateau to drift, not capacity",
      "εT² vs εT reproduced closed-book with assumptions stated",
      "The validation-loss sentence names the distribution mismatch precisely",
    ],
    minutes: 25,
  },
  transfer: {
    task: "Read LeRobot's il_robots docs section on rollout strategies (base / sentry / highlight / dagger) and write 10 lines mapping rollout-dagger onto Ross et al.'s loop: who is the expert, whose states get labeled, what replaces β-mixing. Optional spice: skim 'Revisiting DAgger in the Era of LLM-Agents' (arXiv 2605.12913) to watch the same fix reappear outside robotics.",
    criteria: [
      "All three mappings are explicit and correct",
      "You identify what the human-in-the-loop version pays that a scripted-sim expert doesn't",
    ],
    minutes: 20,
  },
  retention:
    "+7 days: blank-page derivation of both bounds, plus one sentence on why validation loss can't see the failure. +30 days, during L12: explain why action chunking and DAgger attack the same T from opposite ends.",
  researchRecord: "docs/curation/l11-bc-dagger.md",
  minutes: 462,
};
