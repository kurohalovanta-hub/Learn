import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l10-mdp.md (live-verified 2026-08-21).
// §15 resequencing: visual S&B companion first, S&B Ch 3 as the only theory
// source — this node deliberately contains zero CS285 (first contact: l10-ppo).

export const packet: LearningPacket = {
  nodeId: "l10-mdp",
  whyNow:
    "Everything from Q-learning to VLA fine-tuning is phrased in one vocabulary: states, actions, returns, values. This node buys that vocabulary exactly — reward vs return vs value kept distinct, the Bellman equation produced as the conditional-expectation identity it is, and reward design understood as problem specification with real hazards. Every node in L10–L14 speaks this language; get it exact once.",
  diagnostic: {
    prompt:
      "Cold, before any reading: formalize a robot vacuum as an MDP — write S, A, r, γ explicitly — and compute a 3-step discounted return for a made-up reward sequence with γ=0.9. Then: what does γ trade? Why is Q more directly useful than V for control? Write V in terms of Q. Expected to partially fail — that failure is the hook.",
    minutes: 10,
  },
  orient: {
    title: "Reinforcement Learning, by the Book — Part 1",
    creator: "Mutual Information (DJ Rich)",
    url: "https://www.youtube.com/watch?v=NFo9v_yKQXA",
    embedUrl: ytEmbed("https://www.youtube.com/watch?v=NFo9v_yKQXA"),
    minutes: 13,
    whySelected:
      "Built for first exposure and follows Sutton & Barto's notation exactly — the visual on-ramp that removes the notation-switching stall of a cold Ch 3 read.",
    leaveWith: [
      "the agent–environment loop as (S, A, P, r, γ)",
      "reward is one step; return is the cumulative random variable",
      "a policy is a distribution over actions, not a plan",
    ],
    unverified: true,
  },
  coreWatch: [
    {
      title: "Reinforcement Learning, by the Book — Part 2 (Bellman equations)",
      creator: "Mutual Information (DJ Rich)",
      url: "https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr",
      minutes: 20,
      whySelected:
        "The same S&B-notation series, now for the node's central objects: V and Q defined, then the Bellman expectation and optimality equations visualized on gridworlds. Locate Part 2 in the playlist (exact title/duration not re-verifiable at curation time).",
      leaveWith: [
        "V and Q are DEFINED as expectations — algorithms come next node",
        "the Bellman equation is a one-step self-consistency identity",
        "optimality swaps the expectation over π's action for a max",
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
        "Ch 3 complete: agent–environment interface → returns → policies and value functions → Bellman optimality → summary. Slow and exact — derive each boxed equation by hand as you meet it.",
      minutes: 110,
      whySelected:
        "The field's definitional source (2024 Turing Award). Every equation this program will cite traces here; the videos exist so this read is exact instead of drowning.",
    },
  ],
  recall: [
    {
      q: "Reward, return, value — one phrase each, and which is a random variable?",
      a: "Reward r is one step's scalar, given by the MDP; return G_t is the cumulative discounted sum — a random variable; value V^π(s) is the EXPECTED return from s under π — a deterministic function of state.",
    },
    {
      q: "Is V^π computed or defined in Ch 3?",
      a: "Defined: V^π(s) = E_π[G_t | s_t = s]. Algorithms that compute it (DP, TD) are the next node's job.",
    },
    {
      q: "The Bellman expectation equation is an instance of which probability facts?",
      a: "The law of total (conditional) expectation applied to G_t = r_{t+1} + γG_{t+1}, plus the Markov property to condition only on the current state.",
    },
    {
      q: "What changes between the Bellman expectation and optimality equations?",
      a: "The expectation over the policy's action becomes a max over actions — self-consistency of the best achievable value instead of a given policy's value.",
    },
    {
      q: "γ = 0 vs γ → 1 — what does each buy and cost?",
      a: "γ=0: myopic one-step optimization, easy and low-variance. γ→1: long effective horizon at the price of higher-variance returns and slower convergence. γ is a modeling choice, not a technicality.",
    },
  ],
  interactiveIds: ["gridworld-value"],
  lessonId: "l10-mdp",
  practice: [
    {
      prompt:
        "The modeling drill: formalize gridworld, cart-pole, and pick-and-place as MDPs — explicit S, A, r, γ for each — plus one sentence per task on what your reward choice gets wrong.",
      minutes: 30,
    },
    {
      prompt:
        "S&B Ch 3 end-of-chapter exercises on return and Bellman manipulation — the γ-recursion ones and 'write V in terms of Q / Q in terms of V' (exercise numbering varies by printing). At least 4, on paper.",
      source: "http://incompleteideas.net/book/RLbook2020.pdf",
      minutes: 35,
    },
    {
      prompt:
        "Hand-compute V for a 4-state chain MDP under two different policies (γ=0.9). Keep your numbers — the derive step verifies them by simulation. In the gridworld-value instrument: set a policy and commit predictions for three cell values before each reveal.",
      minutes: 25,
    },
  ],
  derive: {
    spec: "On paper: derive the Bellman expectation equation from the definition G_t = r_{t+1} + γG_{t+1}, justifying every expectation step — name the law of total expectation and the Markov property where each is used. Then write a ~20-line Monte-Carlo simulation of your 4-state chain and verify both hand-computed value functions.",
    checks: [
      "Each derivation step cites the identity it uses — no silent swaps of expectation and sum",
      "Simulation estimates match your hand-computed V within Monte-Carlo error for both policies",
      "You can point to the exact line where the Markov property is load-bearing",
    ],
    minutes: 45,
  },
  stuck: {
    alternate: {
      title: "Mathematical Foundations of RL — Ch 2 lectures (Bellman equation, gridworld-worked)",
      creator: "Shiyu Zhao (Westlake University)",
      url: "https://www.youtube.com/playlist?list=PLEhdbSEZZbDaFWPX4gehhwB9vJZJ1DNm8",
      minutes: 60,
      whySelected:
        "Rigor-first and gridworld-worked throughout (2.1M+ view series) — the best second pass when S&B's prose-style derivations don't click.",
      unverified: true,
    },
    alternateRead: {
      title: "Spinning Up — Key Concepts in RL",
      url: "https://spinningup.openai.com/en/latest/",
      resourceId: "spinningup-essays",
      sections: "Intro to RL, Part 1 — the compact notation-first glossary",
      minutes: 30,
    },
    note: "Expectation-over-trajectories vs expectation-over-next-state is exactly where first-time Ch 3 readers stall. If that is the block, do Spinning Up's glossary first, then re-read the section — do not push forward with fuzzy notation.",
  },
  deepen: [
    {
      title: "Shiyu Zhao, Mathematical Foundation of Reinforcement Learning (free PDF in repo)",
      url: "https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning",
      sections:
        "Ch 2 (State Values and Bellman Equation), Ch 3 (Optimal State Values and Bellman Optimality) — the contraction-mapping, fixed-point view. Only if you want the proof; NOT required for Gold.",
      minutes: 90,
    },
  ],
  prove: {
    task: "Unseen, closed book: (1) design the MDP and reward for 'battery-constrained inspection drone must photograph 3 checkpoints' — explicit S, A, r, γ and episode termination; (2) critique your own reward for hackability — two concrete exploits an optimizer would find — and fix one; (3) derive the Bellman expectation equation from the return definition, every step justified (the node's mastery test).",
    criteria: [
      "MDP fully specified — S, A, r, γ, termination — with the battery constraint genuinely in the state, not hand-waved",
      "Two real exploits (behaviors that score high while failing the intent), one actually fixed",
      "Bellman derivation complete and correct, with the Markov property invoked at the right step",
      "You can write V in terms of Q and state in one line what γ trades",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Show that one-step supervised learning is a degenerate MDP (γ=0, single-step episodes) and state precisely what structure RL adds. Then map 'a VLA executes a language command' onto (S, A, r) and identify which element is hardest to specify — and why that matters when you reach L12.",
    criteria: [
      "The degenerate-MDP argument is exact: what S, A, r are, and why the Bellman equation collapses",
      "The VLA mapping names concrete S and A and defends why r is the hard element",
    ],
    minutes: 20,
  },
  retention:
    "+7 days, from memory: write G_t, V^π, Q^*, and the Bellman optimality equation for Q^*; two sentences on what γ trades. Self-grade against Ch 3.",
  researchRecord: "docs/curation/l10-mdp.md",
  minutes: 338,
};
