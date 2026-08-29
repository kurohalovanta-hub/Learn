// Deep-link a packet task into the LiveTutor on the same page: any block can
// dispatch a task; the tutor panel picks it up, switches mode, and opens the
// conversation with it (tutor as guide or examiner — honesty rules unchanged).

import type { TutorMode } from "@/lib/tutor";

export interface TutorTask {
  mode: TutorMode;
  text: string;
}

export const TUTOR_TASK_EVENT = "halo-tutor-task";

export function openTutorTask(task: TutorTask): void {
  window.dispatchEvent(new CustomEvent<TutorTask>(TUTOR_TASK_EVENT, { detail: task }));
}
