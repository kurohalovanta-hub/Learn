import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l6-kalman.md (live-verified 2026-08-21).
// Implementation-first by curriculum decision: no core watch, the kalman-1d
// widget is the orientation, Labbe's executable book is the core.

export const packet: LearningPacket = {
  nodeId: "l6-kalman",
  whyNow:
    "The Kalman filter runs in more robots than any other algorithm, and you already own its parts. It is your Bayes filter with Gaussian beliefs, using your state-space model to predict motion. You will build it from scratch, 1D to multivariate, and learn the consistency test (NEES/NIS) that tells a filter that works apart from one that draws smooth plots while lying about how sure it is.",
  diagnostic: {
    prompt:
      "Before any reading, open the kalman-1d widget and run labs 1–5 (predict-only spread; single-update snap; R↑ makes updates timid; Q↑ makes the filter lean on measurements; σ's steady rhythm). Then on paper: what do K→0 and K→1 each say about how much you trust the sensor? Write the innovation and its covariance in symbols.",
    minutes: 12,
  },
  coreRead: [
    {
      title: "Kalman and Bayesian Filters in Python, Ch 4, 5, 6, 8",
      resourceId: "labbe-kalman",
      url: "https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python",
      sections:
        "04-One-Dimensional-Kalman-Filters.ipynb → 05-Multivariate-Gaussians.ipynb → 06-Multivariate-Kalman-Filters.ipynb → 08-Designing-Kalman-Filters.ipynb, run and MODIFY every notebook; every filter re-written from scratch into your own est.py as you go (07-Kalman-Filter-Math waits until the 'why' itches)",
      minutes: 270,
      whySelected:
        "The go-to way to learn the Kalman filter by building it (19.2k stars). The notebooks run, the exercises come with answers, and they go 1D to multivariate in this node's exact order. Chapter 8's NEES/NIS method is the honest-filter test no video course teaches.",
    },
    {
      title: "Ch 3 Gaussians, conditional refresher only",
      resourceId: "labbe-kalman",
      url: "https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python",
      sections:
        "03-Gaussians.ipynb, a 15-minute skim ONLY if Gaussian algebra feels rusty after the gaussian-explorer warm-up; l2-random-variables Gold should make this skippable",
      minutes: 15,
      whySelected: "Kept optional on purpose. Do not spend an hour re-reading what you already proved you know.",
    },
  ],
  recall: [
    {
      q: "Which KF step spreads P and which shrinks it?",
      a: "Predict spreads (P̄ = FPFᵀ + Q); update shrinks (measurement information arrives). The same rhythm as the corridor Bayes filter, the KF is that loop with Gaussian belief.",
    },
    {
      q: "The Kalman gain in one phrase?",
      a: "Precision-weighted trust: K balances prediction against measurement by inverse variance, in 1D, K = P̄/(P̄ + R).",
    },
    {
      q: "Write the innovation and its covariance.",
      a: "y = z − Hx̄ (actual minus predicted measurement); S = HP̄Hᵀ + R.",
    },
    {
      q: "Q vs R, what does each encode?",
      a: "Q: per-step distrust of your motion model (process noise). R: sensor noise. Raising Q leans the filter on measurements; raising R makes updates timid.",
    },
    {
      q: "Why do smooth plots not prove your filter works?",
      a: "An overconfident filter LOOKS great while its covariance lies. Only NEES/NIS checked against chi-square bounds certify that the claimed uncertainty matches the actual errors.",
    },
    {
      q: "Does σ shrink forever as measurements accumulate?",
      a: "No, predict re-injects Q every step, so P settles to a steady state where injected uncertainty balances measurement information. The steady-state P surprises everyone once.",
    },
  ],
  interactiveIds: ["gaussian-explorer", "kalman-1d"],
  lessonId: "l6-kalman",
  practice: [
    {
      prompt:
        "Mis-tune R by 100× in both directions on your 1D filter. Show the overconfident filter (R too small, so the state is jumpy and NIS blows through the chi-square bounds) and the sluggish one (R too large, so it runs smooth and late with NIS collapsed below the band). Keep both NIS plots; this is what a lying filter looks like.",
      minutes: 30,
    },
    {
      prompt:
        "Do Labbe's in-notebook exercises for Ch 4–8, and commit before you reveal: write your own answer down before opening his. Every exercise you skip is a hole the mastery test finds.",
      source: "https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python",
      minutes: 45,
    },
  ],
  derive: {
    spec: "On paper, multiply two 1D Gaussians N(μ₁, σ₁²)·N(μ₂, σ₂²), complete the square, and show the posterior mean is the precision-weighted average μ = (σ₂²μ₁ + σ₁²μ₂)/(σ₁² + σ₂²) with variance below both inputs. Then map the result symbol by symbol onto the KF update: identify the gain K = P̄/(P̄ + R) and the innovation, and show that x = x̄ + K(z − x̄) is the same formula in disguise.",
    checks: [
      "The square is actually completed, not quoted from a table",
      "Posterior variance shown smaller than BOTH priors, and you can say why the update can never widen the belief",
      "K identified and the 'trust ∝ 1/variance' reading stated in one sentence, the gain is no longer a mysterious formula",
    ],
    minutes: 40,
  },
  implement: {
    spec: "est.py: a 2D constant-velocity tracker from noisy position measurements. Write predict and update from scratch in matrix form (F, H, Q, R, P explicit). Run FilterPy alongside as a test oracle only, asserting your x and P match its every step. Compute NEES and NIS over Monte-Carlo runs and plot them against the chi-square bounds.",
    checks: [
      "Per-step state and covariance match FilterPy to numerical precision",
      "NEES within the 95% chi-square band over 100 Monte-Carlo runs (4-dim state)",
      "NIS within its band (2-dim measurement) on the same runs",
      "FilterPy appears nowhere inside the filter itself, oracle only, per the curriculum's from-scratch discipline",
    ],
    minutes: 120,
  },
  stuck: {
    alternateRead: {
      title: "Labbe Ch 7, Kalman Filter Math",
      resourceId: "labbe-kalman",
      url: "https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python",
      sections: "07-Kalman-Filter-Math.ipynb, the slower, fully explicit pass at the same equations; pull it in the moment a step's 'why' itches",
      minutes: 60,
    },
    note: "Another voice: Cyrill Stachniss's Kalman/EKF lecture (via www.ipb.uni-bonn.de/teaching/, not re-verified this session). If local Jupyter fights you, the repo README links nbviewer and binder so you can run it with no install.",
  },
  deepen: [
    {
      title: "Control Bootcamp, estimation segment (Steve Brunton)",
      resourceId: "brunton-bootcamp",
      url: "https://www.youtube.com/playlist?list=PLMrJAkhIeNNR20Mz-VpzgfQs5zrYi085m",
      sections:
        "'Full State Estimation' → 'Data Fusion' → 'Data Fusion and LQG', the control-theoretic dual: observability, estimator eigenvalues, LQG = LQR + KF. Watch after P9's estimator-in-the-loop work makes the question real (segment titles verified via a community lecture repo; durations unverified this session)",
      minutes: 45,
      whySelected: "A different angle from this node's Bayes-first build. Parked here, not in core, so it lands once the duality question actually matters to you.",
    },
    {
      title: "Probabilistic Robotics (Thrun, Burgard, Fox), Gaussian filters chapter",
      sections: "the KF derivation of record, read when you want the full rigor under Labbe's build; rigor-first ordering is why it is deepen, not core",
      minutes: 90,
    },
  ],
  prove: {
    task: "Gold gate, two parts, both cold. (1) From a blank file, rebuild the 2D constant-velocity tracker without opening est.py or Labbe, run 100 Monte-Carlo runs, and get NEES inside the chi-square bounds. (2) On paper, derive the 1D Kalman update as a product of two Gaussians, complete the square, and identify the gain.",
    criteria: [
      "Written from a blank file (transcription is the exact failure this rule exists to catch)",
      "NEES within the 95% bounds over 100 runs (an overconfident or copy-pasted filter fails this structurally)",
      "The derivation reaches the precision-weighted mean with the square completed, and identifies K = P̄/(P̄ + R)",
      "You can state, unprompted, what Q and R each encode",
    ],
    minutes: 60,
  },
  transfer: {
    task: "Two-sensor fusion: add a second position sensor to the same tracker with a 10× different R and a different update rate. Update on each measurement as it arrives, with its own H and R. Show that (a) the fused posterior beats either sensor alone on RMSE, and (b) NIS stays inside its bounds for both sensors, so precision-weighting holds up beyond the textbook setting.",
    criteria: [
      "Asynchronous updates handled correctly, update on arrival, no batching hack",
      "Fused RMSE beats each single-sensor filter",
      "Per-sensor NIS honest for both sensors",
      "One sentence on why the fusion weights follow 1/R automatically, with no fusion logic written by you",
    ],
    minutes: 45,
  },
  retention:
    "+14 days: cold-derive the Kalman gain from the product of two 1D Gaussians; then one sentence each: what Q encodes, what R encodes, what NEES certifies, what NIS certifies.",
  researchRecord: "docs/curation/l6-kalman.md",
  minutes: 707,
};
