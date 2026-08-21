import type { Boss } from "@/lib/types";

// Boss fights (HANDOVER §22). Each is also a node (gating); this file carries the
// extended scenario + remediation maps (failure → nodes to revisit).
export const BOSSES: Boss[] = [
  {
    id: "boss-programming", level: 1, title: "Programming Boss", hours: 6,
    scenario: "One sitting, from a two-page written spec: a predator–prey grid-world simulation with config file, CLI, plots, and 3 required tests. Docs allowed; AI code generation forbidden.",
    passCriteria: ["Runs correctly on the spec's three scenarios", "Tests green; code decomposed into functions", "Committed with clear history"],
    remediation: [
      { weakness: "Couldn't decompose the spec", nodeIds: ["l1-functions", "l1-classes"] },
      { weakness: "Data-structure fumbling", nodeIds: ["l1-data-structures"] },
      { weakness: "Debugging spiral", nodeIds: ["l0-debug-mindset"] },
      { weakness: "Slow loops everywhere", nodeIds: ["l1-numpy", "l1-vectorization-craft"] },
    ],
  },
  {
    id: "boss-math", level: 2, title: "Math Boss", hours: 8,
    scenario: "Closed book, one sitting: (1) derive ∇‖Ax−b‖² and implement GD; (2) chain-rule a two-layer scalar network by hand + finite-difference verify; (3) Gaussian MLE from scratch; (4) power-iterate a top eigenvector and interpret; (5) a two-stage Bayes sensor update.",
    passCriteria: ["All five artifacts correct (derivation pages + running code)", "No references beyond a blank sheet"],
    remediation: [
      { weakness: "Chain rule shaky", nodeIds: ["l2-derivatives", "l2-multivariable"] },
      { weakness: "Matrix calculus", nodeIds: ["l2-linear-maps", "l2-multivariable"] },
      { weakness: "Eigen intuition", nodeIds: ["l2-eigen-svd"] },
      { weakness: "Probability mechanics", nodeIds: ["l2-probability", "l2-random-variables"] },
      { weakness: "MLE logic", nodeIds: ["l2-stats-mle"] },
    ],
  },
  {
    id: "boss-dl", level: 4, title: "Deep Learning Boss", hours: 8,
    scenario: "Three parts: (1) implement a specified small transformer variant from a blank file; (2) rescue a sabotaged training run (three planted bugs: mask, LR, norm placement) using diagnostics only; (3) oral defense — trace shapes/gradients from memory, then settle one design question (heads vs width) with a 30-minute experiment.",
    passCriteria: ["Variant trains to spec", "All three bugs found via instrumentation (not guessing)", "Defense answers grounded in your own runs"],
    remediation: [
      { weakness: "Attention mechanics", nodeIds: ["l4-attention"] },
      { weakness: "Training diagnostics", nodeIds: ["l4-training-dynamics"] },
      { weakness: "Loop mechanics", nodeIds: ["l4-training-loop"] },
      { weakness: "Shape fluency", nodeIds: ["l4-transformer", "l4-vit"] },
    ],
  },
  {
    id: "boss-robotics", level: 5, title: "Robotics Boss", hours: 6,
    scenario: "A NEW Menagerie arm you haven't used: parameterize its screws from the model file, FK matching MuJoCo to 1e-6, your IK benchmark green, then a smooth square-tracing end-effector trajectory — recorded, tests green, your library only.",
    passCriteria: ["Oracle deltas within tolerance on the unseen arm", "IK benchmark ≥95%/<1mm/<0.5°", "Square trace video with continuous velocity"],
    remediation: [
      { weakness: "Frame errors", nodeIds: ["l5-frames-rotations"] },
      { weakness: "exp/log confusion", nodeIds: ["l5-lie-se3"] },
      { weakness: "Jacobian bugs", nodeIds: ["l5-jacobians", "l2-multivariable"] },
      { weakness: "IK divergence", nodeIds: ["l5-ik"] },
    ],
  },
  {
    id: "boss-autonomy", level: 9, title: "Autonomy Boss", hours: 5,
    scenario: "The Tabletop Butler: on 'clean up', perceive 3 randomized objects by language prompt, plan collision-free motions, grasp and sort into bins, and recover from one induced failure — ≥80% completion over 10 episodes.",
    passCriteria: ["Completion target met with per-stage failure attribution", "Recovery demonstrated on video", "Architecture diagram matches the running system"],
    remediation: [
      { weakness: "Perception misses", nodeIds: ["l8-pose-estimation", "l8-modern-tools"] },
      { weakness: "Planning failures", nodeIds: ["l9-sampling-planning"] },
      { weakness: "Grasp failures", nodeIds: ["l9-grasping", "l9-manipulation-pipeline"] },
      { weakness: "Integration chaos", nodeIds: ["l7-ros-robot-project", "l7-bags-debugging"] },
    ],
  },
  {
    id: "boss-robot-learning", level: 11, title: "Robot Learning Boss", hours: 10,
    scenario: "The PushT Study: BC (yours) vs ACT vs Diffusion Policy (yours) on identical data — 3 seeds × 50 episodes each, Wilson CIs, chunk ablation, and a distribution-shift probe. The report is the artifact; defensible conclusions are the pass.",
    passCriteria: ["No underpowered claims (CIs throughout)", "Shift probe reveals and explains a real difference", "A reviewer could rerun it from the repo"],
    remediation: [
      { weakness: "Diffusion head shaky", nodeIds: ["l11-diffusion", "l11-diffusion-policy"] },
      { weakness: "Statistics gaps", nodeIds: ["l11-eval-statistics"] },
      { weakness: "Covariate-shift story", nodeIds: ["l11-bc-dagger"] },
      { weakness: "Tooling friction", nodeIds: ["l11-lerobot"] },
    ],
  },
  {
    id: "boss-vla", level: 12, title: "VLA Boss", hours: 12,
    scenario: "Fine-tune the frontier lineage (π0-LoRA on 24 GB; SmolVLA + cloud-PEFT path otherwise), run the 400-episode LIBERO protocol plus your perturbation suite, and reproduce one paper-claimed number within pre-registered tolerance — reported like a reproduction study.",
    passCriteria: ["Fine-tune completes with tracked config", "Protocol + perturbation results with CIs", "Deviation log + failure gallery; the report survives a lab-meeting grilling"],
    remediation: [
      { weakness: "Architecture gaps", nodeIds: ["l12-vla-anatomy", "l12-pi0-flow"] },
      { weakness: "Fine-tune mechanics", nodeIds: ["l12-smolvla-finetune"] },
      { weakness: "Eval discipline", nodeIds: ["l12-vla-eval", "l11-eval-statistics"] },
      { weakness: "Repo literacy", nodeIds: ["l12-openvla-code"] },
    ],
  },
  {
    id: "boss-final", level: 16, title: "Final Boss: The Research Defense", hours: 14,
    scenario: "15-minute presentation of your original research + 45 minutes of adversarial cross-examination (AI-as-committee + any recruitable human) covering method, statistics, alternatives, and significance — then the written next-experiments memo.",
    passCriteria: ["Every claim defended or honestly conceded", "Statistics survive scrutiny", "A credible research agenda exits the room"],
    remediation: [
      { weakness: "Method holes", nodeIds: ["l15-experiment-design", "l16-proposal"] },
      { weakness: "Statistical gaps", nodeIds: ["l15-ablation-stats"] },
      { weakness: "Writing/claims mismatch", nodeIds: ["l15-writing", "l16-writing-release"] },
    ],
  },
];

export const bossById = (id: string) => BOSSES.find((b) => b.id === id);
