import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l10-tabular.md (live-verified 2026-08-21).
// §15 resequencing: S&B + gridworld implementation BEFORE any deep-RL course —
// CS285's own syllabus presupposes this node; zero CS285 here by design.

export const packet: LearningPacket = {
  nodeId: "l10-tabular",
  whyNow:
    "Where the ideas are visible: value iteration you can watch converge, TD errors you can print, Q-tables where every number is inspectable. This is the Gold gate before ANY deep-RL library — the L3 rule, RL edition — and the gridworld-implementation stage that must precede lecture courses, because they presuppose it. Most of this node happens at the keyboard, from blank files.",
  diagnostic: {
    prompt:
      "Cold: draw a 3-state MDP with known P and r (γ=0.9) and execute one full value-iteration sweep by hand. Then: what would you do if P were unknown? What is bootstrapping? Why does Q-learning learn the greedy policy's values while behaving ε-greedy?",
    minutes: 10,
  },
  coreWatch: [
    {
      title: "Reinforcement Learning, by the Book — Monte Carlo methods",
      creator: "Mutual Information (DJ Rich)",
      url: "https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr",
      minutes: 20,
      whySelected:
        "S&B's own notation, animated (companion code verified in the channel's repo). Watch AFTER reading the matching Ch 5 sections — consolidation, not substitute. Locate in the playlist; duration not re-verifiable at curation time.",
      leaveWith: [
        "MC targets are full returns — so MC needs episode ends",
        "first-visit vs every-visit estimation",
        "MC does not bootstrap; that is the contrast TD exploits",
      ],
      unverified: true,
    },
    {
      title: "Reinforcement Learning, by the Book — TD learning, SARSA & Q-learning",
      creator: "Mutual Information (DJ Rich)",
      url: "https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr",
      minutes: 20,
      whySelected:
        "The series' strongest episode for this node — the TD error made visual. Watch after the Ch 6 read, with your own implementation open.",
      leaveWith: [
        "the TD target r + γV(s') contains the current estimate — bootstrapping",
        "SARSA updates toward the action actually taken; Q-learning toward the max",
        "that one-term difference IS on-policy vs off-policy",
      ],
      unverified: true,
    },
  ],
  coreRead: [
    {
      title: "Sutton & Barto, Reinforcement Learning: An Introduction (2nd ed.)",
      url: "http://incompleteideas.net/book/RLbook2020.pdf",
      resourceId: "sutton-barto",
      sections:
        "Ch 4 (policy evaluation → policy improvement → policy/value iteration; skip async-DP fine print), Ch 5 (first-visit MC and why MC needs episode ends; off-policy importance sampling at concept level only), Ch 6 through Q-learning (TD(0), its advantages, SARSA, Q-learning, the cliff-walking example; skim expected SARSA). Implement as you read.",
      minutes: 150,
      whySelected:
        "The only theory source needed: definitions, convergence claims, and the cliff-walking on/off-policy result all trace here.",
    },
  ],
  recall: [
    {
      q: "What is bootstrapping, and why isn't it circular?",
      a: "Updating toward a target that contains your own current estimate (r + γV(s')). It is a fixed-point iteration — the same contraction value iteration runs with the model known — not circular reasoning.",
    },
    {
      q: "Value iteration vs Q-learning, one sentence each.",
      a: "Value iteration SWEEPS a known model, applying the Bellman optimality backup to every state; Q-learning SAMPLES transitions and applies the same backup stochastically to the (s,a) pairs it visits.",
    },
    {
      q: "Why do SARSA and Q-learning walk different paths on the cliff?",
      a: "Q-learning learns the greedy, cliff-hugging policy's values while behaving ε-greedy — so its behavior keeps falling in; SARSA learns the value of the ε-greedy policy it actually follows, which makes the edge look bad, so it detours.",
    },
    {
      q: "α=1 is exact on a deterministic gridworld but diverges into noise on a slippery one — why?",
      a: "Deterministic: the sampled target equals the true backup, so a full overwrite is correct. Stochastic: each target is one noisy sample; α must be small (or shrink) so the table averages over transition noise.",
    },
    {
      q: "Why can TD(0) learn online while MC cannot?",
      a: "MC's target is the complete return, only available at episode end; TD bootstraps a one-step target from the current estimate and updates every step.",
    },
  ],
  interactiveIds: ["gridworld-value"],
  practice: [
    {
      prompt:
        "Karpathy's REINFORCEjs gridworld_dp, then gridworld_td: change the reward layout, commit a predicted V-field on paper BEFORE pressing run, then diff against what converges. Two layouts each. Same discipline in the gridworld-value instrument: predict which cells update first in a sweep.",
      source: "http://cs.stanford.edu/people/karpathy/reinforcejs",
      minutes: 30,
    },
    {
      prompt:
        "S&B Ch 6 exercises contrasting TD vs MC targets (exercise numbering varies by printing) — at least 3, on paper.",
      source: "http://incompleteideas.net/book/RLbook2020.pdf",
      minutes: 25,
    },
    {
      prompt:
        "The exploration study: your tabular Q-learning on FrozenLake with ε ∈ {0.01, 0.1, 0.3}, 5 seeds each; plot learning curves with seed spread. One paragraph: what ε actually changes about the data distribution the agent learns from.",
      source: "https://gymnasium.farama.org/",
      minutes: 35,
    },
  ],
  implement: {
    spec: "Blank file, no reference code — non-negotiable: (1) gridworld value iteration with a V-heatmap animation of convergence (the mental model behind the gridworld-value instrument); (2) tabular Q-learning solving FrozenLake-v1 AND CliffWalking-v0 (Gymnasium), TD-error curve logged; (3) SARSA on CliffWalking and the SARSA-vs-Q-learning path/return comparison plot, explained in writing from YOUR figure. Run at least one FrozenLake config with is_slippery=True — α=1 must visibly fail there.",
    checks: [
      "Value iteration's greedy policy matches Q-learning's on the same gridworld",
      "The cliff plot shows the two algorithms taking different paths, and your paragraph explains why from on/off-policy",
      "TD-error curve decays, and you can say what residual noise remains and why",
      "The slippery run demonstrates why α must be small (or decay) under stochastic transitions",
    ],
    minutes: 240,
  },
  stuck: {
    alternate: {
      title: "Mathematical Foundations of RL — Ch 4 (VI/PI) and Ch 7 (TD) lectures",
      creator: "Shiyu Zhao (Westlake University)",
      url: "https://www.youtube.com/playlist?list=PLEhdbSEZZbDaFWPX4gehhwB9vJZJ1DNm8",
      minutes: 90,
      whySelected:
        "VI/PI convergence worked numerically on gridworlds, then TD — the best 'show me the sweeps' resource when your own implementation stalls.",
      unverified: true,
    },
    alternateRead: {
      title: "Shiyu Zhao, Mathematical Foundation of Reinforcement Learning (free PDF in repo)",
      url: "https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning",
      sections: "Ch 4 (Value Iteration and Policy Iteration), Ch 7 (Temporal-Difference Methods) — the written version of the lectures",
      minutes: 60,
    },
    note: "Two different kinds of stuck: 'why does this converge at all?' is the contraction story in deepen; 'my code doesn't work' is best debugged by diffing your gridworld's behavior against the REINFORCEjs demos.",
  },
  deepen: [
    {
      title: "Zhao book — value-iteration convergence proof",
      url: "https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning",
      sections: "Ch 4's contraction-mapping convergence proof of value iteration — the honest 'why this converges'. Curiosity-only; not gate material.",
      minutes: 45,
    },
    {
      title: "Sutton & Barto — off-policy MC",
      url: "http://incompleteideas.net/book/RLbook2020.pdf",
      resourceId: "sutton-barto",
      sections: "Ch 5's off-policy prediction via importance sampling, in full — only if curiosity demands. Eligibility-trace machinery and Dyna stay skipped (audited cut).",
      minutes: 40,
    },
  ],
  prove: {
    task: "The node's mastery test, verbatim: from a blank file, value iteration + Q-learning both solving a gridworld, TD-error curve plotted, plus a written paragraph deriving — at intuition level — why Q-learning converges to the greedy policy's values while behaving ε-greedy. The implement step built the artifacts; here you certify them closed-book: re-write the Q-learning update from the Bellman optimality equation and defend your cliff figure aloud.",
    criteria: [
      "Both solvers were produced from blank files, no reference code open",
      "Q-learning update written from memory with each term named: target, TD error, step size",
      "The off-policy paragraph correctly separates behavior policy from target policy",
      "You can explain, from your own cliff plot, why SARSA detours from the edge",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Design your own 1-D line-following-robot MDP (position × heading states, noisy transitions) and solve it with your Q-learning code UNCHANGED. One paragraph: which parts of your code were environment-specific vs algorithm-generic? Optional second transfer: Taxi-v3.",
    criteria: [
      "Your tabular code runs on the new MDP with zero algorithm changes",
      "The env-specific vs generic boundary is drawn correctly (spaces, P, r vs the update rule)",
    ],
    minutes: 30,
  },
  retention:
    "+10 days: re-derive the Q-learning update from the Bellman optimality equation; two lines on what bootstrapping means and why α must shrink (or stay small) under stochastic transitions.",
  researchRecord: "docs/curation/l10-tabular.md",
  minutes: 590,
};
