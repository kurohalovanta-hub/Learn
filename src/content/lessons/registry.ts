import type { Lesson } from "@/lib/lesson-types";

// nodeId -> dynamic module import. Keeps each lesson in its own chunk;
// the /learn/[nodeId] route loads exactly one.
export const LESSON_REGISTRY: Record<string, () => Promise<{ lesson: Lesson }>> = {
  "l2-vectors": () => import("./l2-vectors"),
};
