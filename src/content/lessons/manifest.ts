import type { LessonMeta } from "@/lib/lesson-types";

// Light metadata only — safe to import anywhere (nav badges, node pages, tree).
// The validator cross-checks every entry against the actual lesson module.
export const LESSON_META: LessonMeta[] = [
  { nodeId: "l2-vectors", title: "Vectors & Dot Products", minutes: 70, widgets: ["vector-playground"], sections: 9 },
];

export const LESSON_IDS = LESSON_META.map((m) => m.nodeId);
export const hasLesson = (nodeId: string) => LESSON_IDS.includes(nodeId);
export const lessonMeta = (nodeId: string) => LESSON_META.find((m) => m.nodeId === nodeId);
