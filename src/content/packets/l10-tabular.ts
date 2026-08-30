import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l10-tabular.md (live-verified 2026-08-21).
// §15 resequencing: S&B + gridworld implementation BEFORE any deep-RL course, 
// CS285's own syllabus presupposes this node; zero CS285 here by design.

export const packet: LearningPacket = {
  nodeId: "l10-tabular",
  whyNow:
    "This is where the ideas are still visible. You can watch value iteration converge and print the TD error at every step. Clear this before you touch any deep-RL library; the lecture courses already assume you built it. You will write most of it at the keyboard, from blank files.",
  diagnostic: {
    prompt:
      "Cold, no notes: draw a 3-state MDP with known P and r (γ=0.9) and run one full value-iteration sweep by hand. Then answer: what would you do if P were unknown? What is bootstrapping? Why does Q-learning learn the greedy policy's values while it behaves ε-greedy?",
    minutes: 10,
  },
  coreWatch: [
    {
      title: "Reinforcement Learning, by the Book, Monte Carlo methods",
      creator: "Mutual Information (DJ Rich)",
      url: "https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr",
      minutes: 20,
      whySelected:
        "S&B's own notation, animated (the companion code is in the channel's repo). Watch it after you read the matching Ch 5 sections. It backs up the reading; it does not replace it. Find it in the playlist; the duration was not re-verifiable at curation time.",
      leaveWith: [
        "MC targets are full returns, so MC needs episodes to end",
        "first-visit vs every-visit estimation",
        "MC does not bootstrap; that is the contrast TD exploits",
      ],
      unverified: true,
    },
    {
      title: "Reinforcement Learning, by the Book, TD learning, SARSA & Q-learning",
      creator: "Mutual Information (DJ Rich)",
      url: "https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr",
      minutes: 20,
      whySelected:
        "The strongest episode in the series for this node; it makes the TD error visual. Watch it after the Ch 6 read, with your own code open.",
      leaveWith: [
        "the TD target r + γV(s') contains the current estimate; that is bootstrapping",
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
        "The one theory source you need. Every definition, convergence claim, and the cliff-walking on/off-policy result traces back here.",
    },
  ],
  recall: [
    {
      q: "What is bootstrapping, and why isn't it circular?",
      a: "Updating toward a target that contains your own current estimate (r + γV(s')). It is a fixed-point iteration, the same contraction value iteration runs with the model known, not circular reasoning.",
    },
    {
      q: "Value iteration vs Q-learning, one sentence each.",
      a: "Value iteration SWEEPS a known model, applying the Bellman optimality backup to every state; Q-learning SAMPLES transitions and applies the same backup stochastically to the (s,a) pairs it visits.",
    },
    {
      q: "Why do SARSA and Q-learning walk different paths on the cliff?",
      a: "Q-learning learns the greedy, cliff-hugging policy's values while behaving ε-greedy, so its behavior keeps falling in; SARSA learns the value of the ε-greedy policy it actually follows, which makes the edge look bad, so it detours.",
    },
    {
      q: "α=1 is exact on a deterministic gridworld but diverges into noise on a slippery one, why?",
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
        "Open Karpathy's REINFORCEjs gridworld_dp, then gridworld_td. Change the reward layout, write down your predicted V-field on paper before you press run, then compare it to what converges. Do two layouts for each. Use the same habit in the gridworld-value instrument: predict which cells update first in a sweep.",
      source: "http://cs.stanford.edu/people/karpathy/reinforcejs",
      minutes: 30,
    },
    {
      prompt:
        "S&B Ch 6 exercises that contrast TD vs MC targets (the exercise numbers vary by printing). Do at least 3, on paper.",
      source: "http://incompleteideas.net/book/RLbook2020.pdf",
      minutes: 25,
    },
    {
      prompt:
        "An exploration study. Run your tabular Q-learning on FrozenLake with ε ∈ {0.01, 0.1, 0.3}, 5 seeds each, and plot the learning curves with their seed spread. Then write one paragraph on what ε actually changes about the data the agent learns from.",
      source: "https://gymnasium.farama.org/",
      minutes: 35,
    },
  ],
  implement: {
    spec: "Blank file, no reference code open. This part is not optional. (1) gridworld value iteration with a V-heatmap animation of the convergence (the mental model behind the gridworld-value instrument); (2) tabular Q-learning solving FrozenLake-v1 AND CliffWalking-v0 (Gymnasium), with the TD-error curve logged; (3) SARSA on CliffWalking, plus the SARSA-vs-Q-learning path and return comparison plot, explained in writing from YOUR own figure. Run at least one FrozenLake config with is_slippery=True, where α=1 must visibly fail.",
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
      title: "Mathematical Foundations of RL, Ch 4 (VI/PI) and Ch 7 (TD) lectures",
      creator: "Shiyu Zhao (Westlake University)",
      url: "https://www.youtube.com/playlist?list=PLEhdbSEZZbDaFWPX4gehhwB9vJZJ1DNm8",
      minutes: 90,
      whySelected:
        "VI/PI convergence worked out numerically on gridworlds, then TD. The best 'show me the sweeps' resource when your own code stalls.",
      unverified: true,
    },
    alternateRead: {
      title: "Shiyu Zhao, Mathematical Foundation of Reinforcement Learning (free PDF in repo)",
      url: "https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning",
      sections: "Ch 4 (Value Iteration and Policy Iteration), Ch 7 (Temporal-Difference Methods), the written version of the lectures",
      minutes: 60,
    },
    note: "There are two kinds of stuck here. 'Why does this converge at all?' is the contraction story in deepen. 'My code doesn't work' is best fixed by comparing your gridworld's behavior against the REINFORCEjs demos.",
  },
  deepen: [
    {
      title: "Zhao book, value-iteration convergence proof",
      url: "https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning",
      sections: "Ch 4's contraction-mapping convergence proof of value iteration, the honest 'why this converges'. Curiosity-only; not gate material.",
      minutes: 45,
    },
    {
      title: "Sutton & Barto, off-policy MC",
      url: "http://incompleteideas.net/book/RLbook2020.pdf",
      resourceId: "sutton-barto",
      sections: "Ch 5's off-policy prediction via importance sampling, in full, only if curiosity demands. Eligibility-trace machinery and Dyna stay skipped (audited cut).",
      minutes: 40,
    },
  ],
  prove: {
    task: "The node's mastery test. From a blank file: value iteration and Q-learning both solving a gridworld, the TD-error curve plotted, plus a written paragraph on why Q-learning converges to the greedy policy's values while it behaves ε-greedy (intuition level is fine). The implement step built these; here you certify them closed-book. Re-write the Q-learning update from the Bellman optimality equation, and defend your cliff figure out loud.",
    criteria: [
      "Both solvers came from blank files, with no reference code open",
      "You wrote the Q-learning update from memory and named each term: target, TD error, step size",
      "The off-policy paragraph keeps the behavior policy and the target policy separate",
      "You can explain, from your own cliff plot, why SARSA detours from the edge",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Design your own 1-D line-following-robot MDP (position × heading states, noisy transitions) and solve it with your Q-learning code left UNCHANGED. Then write one paragraph: which parts of your code were specific to the environment, and which were generic to the algorithm? Optional second transfer: Taxi-v3.",
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
