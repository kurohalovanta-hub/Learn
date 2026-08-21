import type { Lesson } from "@/lib/lesson-types";

// Heavy content — dynamic imports keep each lesson in its own chunk.
export const LESSON_REGISTRY: Record<string, () => Promise<{ lesson: Lesson }>> = {
  "l1-python-basics": () => import("./l1-python-basics"),
  "l2-vectors": () => import("./l2-vectors"),
  "l2-matrices": () => import("./l2-matrices"),
  "l2-eigen-svd": () => import("./l2-eigen-svd"),
  "l2-derivatives": () => import("./l2-derivatives"),
  "l2-optimization": () => import("./l2-optimization"),
  "l3-backprop-theory": () => import("./l3-backprop-theory"),
  "l4-attention": () => import("./l4-attention"),
  "l5-frames-rotations": () => import("./l5-frames-rotations"),
  "l5-lie-se3": () => import("./l5-lie-se3"),
  "l5-jacobians": () => import("./l5-jacobians"),
  "l6-feedback-pid": () => import("./l6-feedback-pid"),
  "l6-kalman": () => import("./l6-kalman"),
  "l10-mdp": () => import("./l10-mdp"),
  "l11-bc-dagger": () => import("./l11-bc-dagger"),
  "l12-vla-anatomy": () => import("./l12-vla-anatomy"),
};
