import { NODE_MAP } from "@/content/nodes";
import { PAPERS } from "@/content/papers";
import type { ProgressData, SessionLog } from "@/lib/types";
import { reviewQueue } from "./review";
import { pacingStatus, DESCOPE_LEVERS } from "./pacing";

const DAY = 86_400_000;
const dstr = (t: number) => new Date(t).toISOString().slice(0, 10);

export function logsInLastDays(logs: SessionLog[], days: number, now = Date.now()): SessionLog[] {
  const cutoff = dstr(now - days * DAY);
  return logs.filter((l) => l.date >= cutoff);
}

export function totalFocusedHours(logs: SessionLog[]): number {
  return Math.round(logs.reduce((s, l) => s + l.minutes, 0) / 6) / 10;
}

/** Streak: consecutive active days; a single-day gap doesn't break it (6-day-week design). */
export function streak(logs: SessionLog[], now = Date.now()): number {
  const days = new Set(logs.map((l) => l.date));
  let n = 0;
  let gaps = 0;
  for (let i = 0; i < 400; i++) {
    const d = dstr(now - i * DAY);
    if (days.has(d)) {
      n++;
      gaps = 0;
    } else {
      if (i === 0) continue; // today not logged yet doesn't break
      gaps++;
      if (gaps >= 2) break;
    }
  }
  return n;
}

export function independencePct(logs: SessionLog[]): number | null {
  const rated = logs.filter((l) => l.independence);
  if (rated.length === 0) return null;
  const good = rated.filter((l) => l.independence === "independent" || l.independence === "hints").length;
  return Math.round((100 * good) / rated.length);
}

export interface Warning {
  id: string;
  severity: "info" | "warn" | "alert";
  title: string;
  detail: string;
}

/** Failure-mode detectors (HANDOVER §26), computed from actual behavior. */
export function warnings(data: ProgressData, now = Date.now()): Warning[] {
  const out: Warning[] = [];
  const recent = logsInLastDays(data.logs, 7, now);
  const recent14 = logsInLastDays(data.logs, 14, now);
  const min = (blocks: string[]) =>
    recent.filter((l) => blocks.includes(l.block)).reduce((s, l) => s + l.minutes, 0);

  // Tutorial hell: consumption vs creation
  const consume = min(["math", "specialization", "papers"]);
  const create = min(["implementation", "project", "research"]);
  if (consume + create > 300 && create > 0 && consume / create > 2.5) {
    out.push({
      id: "tutorial-hell", severity: "warn", title: "Tutorial hell forming",
      detail: `Last 7 days: ${Math.round(consume / 60)}h consuming vs ${Math.round(create / 60)}h creating. Every hour of input needs an hour of retrieval or code.`,
    });
  }
  if (consume + create > 300 && create === 0) {
    out.push({ id: "no-creation", severity: "alert", title: "Zero creation this week", detail: "Nothing implemented or built in 7 days. Stop consuming; open the editor." });
  }

  // AI dependency
  const rated = recent14.filter((l) => l.independence);
  const heavy = rated.filter((l) => l.independence === "heavy_ai" || l.independence === "copied").length;
  if (rated.length >= 6 && heavy / rated.length > 0.4) {
    out.push({
      id: "ai-dependency", severity: "alert", title: "AI dependency rising",
      detail: `${Math.round((100 * heavy) / rated.length)}% of rated sessions were heavily AI-assisted. Mastery scores discount this; switch to the Socratic tutor prompts.`,
    });
  }

  // Math avoidance while L2 incomplete
  const l2Done = Object.entries(data.nodes).filter(([id, p]) => id.startsWith("l2-") && p.status === "mastered").length;
  const mathMin = min(["math"]);
  const allMin = recent.reduce((s, l) => s + l.minutes, 0);
  if (l2Done < 12 && allMin > 600 && mathMin / allMin < 0.2) {
    out.push({ id: "math-avoidance", severity: "warn", title: "Math avoidance", detail: "Under 20% of this week went to math while the bootloader is incomplete. The debt compounds at Level 3." });
  }

  // Review debt
  const due = reviewQueue(data.nodes, now).length;
  if (due > 10) out.push({ id: "review-debt", severity: "warn", title: `Review debt: ${due} due`, detail: "Spaced retrieval only works when it happens. Clear the queue before new material." });

  // Premature frontier obsession
  const maxMasteredLevel = Math.max(0, ...Object.entries(data.nodes).filter(([, p]) => p.status === "mastered").map(([id]) => NODE_MAP.get(id)?.level ?? 0));
  const frontierPapers = Object.entries(data.papers).filter(([id, p]) => {
    const paper = PAPERS.find((x) => x.id === id);
    return paper && p.status !== "queue" && paper.rung >= 4 && maxMasteredLevel < 10;
  });
  if (frontierPapers.length > 2) {
    out.push({ id: "premature-frontier", severity: "warn", title: "Premature frontier reading", detail: `${frontierPapers.length} VLA/WM-rung papers opened before the robot-learning levels. Paper tourism is a failure mode; the ladder orders itself.` });
  }

  // Stalled project
  const active = Object.entries(data.projects).find(([, p]) => p.status === "active");
  if (active) {
    const projMin = logsInLastDays(data.logs, 7, now).filter((l) => l.block === "project").reduce((s, l) => s + l.minutes, 0);
    if (projMin === 0 && recent.length > 0)
      out.push({ id: "stalled-project", severity: "warn", title: "Active project untouched for 7 days", detail: "Projects integrate everything — a week without one is breadth addiction in disguise." });
  }

  // Pacing
  const pace = pacingStatus(data.settings, data.nodes, now);
  if (pace?.verdict === "far-behind") {
    out.push({
      id: "pacing", severity: "alert", title: `~${-pace.drift} days behind the 210-day overlay`,
      detail: `${pace.behindLevels.map((b) => `L${b.level} at ${Math.round(b.completion * 100)}%`).join(", ")}. Pre-agreed levers: ${DESCOPE_LEVERS[0]}`,
    });
  } else if (pace?.verdict === "behind") {
    out.push({ id: "pacing", severity: "info", title: "Slightly behind pace", detail: "Mastery beats calendar — but check the weekly review for what to cut, not what to rush." });
  }

  return out;
}

export interface DashboardStats {
  focusedHoursTotal: number;
  focusedHours7d: number;
  streakDays: number;
  independence: number | null;
  papersRead: number;
  papersReproduced: number;
  experimentsDone: number;
  nodesMastered: number;
  goldPlus: number;
}

export function dashboardStats(data: ProgressData, now = Date.now()): DashboardStats {
  const mastered = Object.values(data.nodes).filter((p) => p.status === "mastered");
  return {
    focusedHoursTotal: totalFocusedHours(data.logs),
    focusedHours7d: totalFocusedHours(logsInLastDays(data.logs, 7, now)),
    streakDays: streak(data.logs, now),
    independence: independencePct(logsInLastDays(data.logs, 30, now)),
    papersRead: Object.values(data.papers).filter((p) => ["reading", "deriving", "reproducing", "reproduced", "modified", "research-lead"].includes(p.status)).length,
    papersReproduced: Object.values(data.papers).filter((p) => ["reproduced", "modified", "research-lead"].includes(p.status)).length,
    experimentsDone: data.experiments.filter((e) => e.status === "done" || e.status === "negative").length,
    nodesMastered: mastered.length,
    goldPlus: mastered.filter((p) => ["gold", "platinum", "research"].includes(p.tier)).length,
  };
}
