import { LEVELS } from "@/content/levels";
import { PHASES } from "@/content/schedule";
import type { NodeProgress, Settings } from "@/lib/types";
import { levelCompletion } from "./mastery";

const DAY = 86_400_000;

export function dayOfProgram(settings: Settings, now = Date.now()): number | null {
  if (!settings.startDate) return null;
  const start = new Date(settings.startDate + "T00:00:00").getTime();
  return Math.max(1, Math.floor((now - start) / DAY) + 1);
}

export function currentPhase(day: number) {
  return PHASES.find((p) => day >= p.days[0] && day <= p.days[1]) ?? PHASES[PHASES.length - 1];
}

/** Levels whose expected window contains this day (the pacing overlay). */
export function expectedLevels(day: number): number[] {
  return LEVELS.filter((l) => day >= l.phase.startDay && day <= l.phase.endDay).map((l) => l.id);
}

export interface PacingStatus {
  day: number;
  /** negative = behind by N days, positive = ahead. */
  drift: number;
  behindLevels: { level: number; title: string; completion: number; expectedBy: number }[];
  verdict: "ahead" | "on-pace" | "behind" | "far-behind";
}

/**
 * Drift = how many days ago the last level you SHOULD have finished was due,
 * for levels still incomplete. A pacing overlay, never a lock (HANDOVER §25).
 */
export function pacingStatus(
  settings: Settings,
  progress: Record<string, NodeProgress>,
  now = Date.now(),
): PacingStatus | null {
  const day = dayOfProgram(settings, now);
  if (day == null) return null;
  const behindLevels = LEVELS.filter((l) => l.phase.endDay < day)
    .map((l) => ({
      level: l.id,
      title: l.title,
      completion: levelCompletion(l.id, progress),
      expectedBy: l.phase.endDay,
    }))
    .filter((x) => x.completion < 0.8);
  const worst = behindLevels.reduce((m, x) => Math.max(m, day - x.expectedBy), 0);
  // ahead: completing levels whose window hasn't opened
  const aheadLevels = LEVELS.filter(
    (l) => l.phase.startDay > day && levelCompletion(l.id, progress) > 0.3,
  );
  const drift = behindLevels.length > 0 ? -worst : aheadLevels.length > 0 ? 7 : 0;
  const verdict =
    drift <= -14 ? "far-behind" : drift < 0 ? "behind" : drift > 0 ? "ahead" : "on-pace";
  return { day, drift, behindLevels, verdict };
}

/** The pre-agreed de-scope levers (docs/research/06-feasibility.md §4). */
export const DESCOPE_LEVERS = [
  "Lever 1 (pull at Day 120 if >2 weeks behind): shrink the Autonomy capstone to fixed-base tabletop; Nav2/SLAM drop to SKIM.",
  "Lever 2 (pull at Day 165 if behind): reproduction scope becomes one deep reproduction only; L13 world-model experiment shrinks to the DINO-WM planning reproduction.",
  "Protected: Month-7 research mode activates no later than Day 180 with whatever level was reached.",
];
