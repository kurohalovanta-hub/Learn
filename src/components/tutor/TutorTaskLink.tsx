"use client";

import { openTutorTask, type TutorTask } from "@/lib/tutor-task";

/** Small link that opens the page's LiveTutor with this task loaded. */
export function TutorTaskLink({ mode, text, label }: TutorTask & { label: string }) {
  return (
    <button
      type="button"
      className="font-mono text-[11px] text-acc underline-offset-2 hover:underline"
      onClick={() => openTutorTask({ mode, text })}
    >
      {label}
    </button>
  );
}
