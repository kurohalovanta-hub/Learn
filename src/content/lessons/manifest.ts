import type { LessonMeta } from "@/lib/lesson-types";

// Light metadata only — safe to import anywhere (nav badges, node pages, tree).
// The validator cross-checks every entry against the actual lesson module.
export const LESSON_META: LessonMeta[] = [
  { nodeId: "l1-python-basics", title: "Variables, Types & Expressions", minutes: 75, widgets: [], sections: 9 },
  { nodeId: "l2-vectors", title: "Vectors & Dot Products", minutes: 70, widgets: ["vector-playground"], sections: 9 },
  { nodeId: "l2-matrices", title: "Matrices as Machines", minutes: 80, widgets: ["matrix-transform"], sections: 8 },
  { nodeId: "l2-eigen-svd", title: "Eigenvectors & the SVD", minutes: 85, widgets: ["matrix-transform"], sections: 7 },
  { nodeId: "l2-derivatives", title: "Derivatives & the Chain Rule", minutes: 80, widgets: ["derivative-explorer"], sections: 7 },
  { nodeId: "l2-optimization", title: "Gradient Descent", minutes: 75, widgets: ["gradient-descent"], sections: 6 },
  { nodeId: "l3-backprop-theory", title: "Backpropagation", minutes: 90, widgets: ["backprop-graph"], sections: 7 },
  { nodeId: "l4-attention", title: "Attention", minutes: 85, widgets: ["attention-vis"], sections: 7 },
  { nodeId: "l5-frames-rotations", title: "Frames & Rotations", minutes: 85, widgets: ["rotation-2d", "so3-explorer"], sections: 7 },
  { nodeId: "l5-lie-se3", title: "SE(3) & Lie Basics", minutes: 90, widgets: ["so3-explorer"], sections: 7 },
  { nodeId: "l5-jacobians", title: "The Jacobian", minutes: 90, widgets: ["planar-arm"], sections: 8 },
  { nodeId: "l6-feedback-pid", title: "Feedback & PID", minutes: 80, widgets: ["pid-tuner"], sections: 6 },
  { nodeId: "l6-kalman", title: "The Kalman Filter", minutes: 85, widgets: ["gaussian-explorer", "kalman-1d"], sections: 6 },
  { nodeId: "l10-mdp", title: "MDPs & Value Functions", minutes: 85, widgets: ["gridworld-value"], sections: 6 },
  { nodeId: "l11-bc-dagger", title: "Behavior Cloning & DAgger", minutes: 80, widgets: ["bc-drift"], sections: 6 },
  { nodeId: "l12-vla-anatomy", title: "VLA Anatomy", minutes: 90, widgets: ["vla-flow"], sections: 7 },
];

export const LESSON_IDS = LESSON_META.map((m) => m.nodeId);
export const hasLesson = (nodeId: string) => LESSON_IDS.includes(nodeId);
export const lessonMeta = (nodeId: string) => LESSON_META.find((m) => m.nodeId === nodeId);
