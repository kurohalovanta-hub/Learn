// Canonical schemas for EMBODIED // OS.
// Content types mirror HANDOVER.md §27 (resources), §28 (curriculum items), §29 (papers).

export const TIERS = ["none", "bronze", "silver", "gold", "platinum", "research"] as const;
export type Tier = (typeof TIERS)[number];
export const tierRank = (t: Tier) => TIERS.indexOf(t);
export const tierAtLeast = (t: Tier, min: Tier) => tierRank(t) >= tierRank(min);

export type Track = "math" | "code" | "core" | "project" | "research";
export type Lab = "math" | "code" | "robotics" | "ml" | "embodied";
export type Block =
  | "math"
  | "implementation"
  | "specialization"
  | "project"
  | "review"
  | "papers"
  | "research";

export interface Prereq {
  id: string;
  /** Minimum tier the prerequisite must reach before this node unlocks. Default: silver. */
  tier?: Tier;
}

export interface ResourceBinding {
  resourceId: string;
  /** Exact chapters / lectures / sections to consume. */
  sections: string;
  note?: string;
}

export interface SkillNode {
  id: string;
  level: number; // 0..16
  title: string;
  track: Track;
  labs: Lab[];
  /** Why this exists — what it unlocks downstream (one or two sentences). */
  why: string;
  objectives: string[];
  intuition?: string;
  /** KaTeX strings of the equations that must be understood. */
  equations?: string[];
  prereqs: Prereq[];
  hours: number;
  optional?: boolean; // stretch node — not counted in core totals
  primary?: ResourceBinding;
  backup?: ResourceBinding;
  references?: ResourceBinding[];
  /** Explicit permission to skip. */
  skip?: string[];
  derivation?: string;
  implementation?: string;
  exercises: string[];
  /** Minimum tier for this node to count as complete for dependents/XP. */
  masteryGate: Tier;
  /** The gold-level test: what must be produced without copying. */
  masteryTest: string;
  /** Diagnostic: pass this cold and the node is marked mastered immediately. */
  diagnostic: string;
  misconceptions?: string[];
  projectIds?: string[];
  paperIds?: string[];
  computeNote?: string;
}

export interface Resource {
  id: string;
  title: string;
  authors: string;
  institution?: string;
  year?: number;
  type:
    | "course"
    | "book"
    | "video"
    | "paper"
    | "docs"
    | "repo"
    | "tool"
    | "interactive"
    | "notes";
  url: string;
  cost: "free" | "paid" | "freemium";
  difficulty: 1 | 2 | 3 | 4 | 5;
  study?: string;
  skim?: string;
  skipParts?: string;
  hours?: number;
  role: "primary" | "backup" | "reference";
  why?: string;
  unlocks?: string;
  lastVerified: string;
  notes?: string;
}

export type PaperArea =
  | "foundations"
  | "vision"
  | "rl"
  | "imitation"
  | "robotics"
  | "vla"
  | "world-models"
  | "sim2real"
  | "evaluation";

export interface Paper {
  id: string;
  order: number;
  rung: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  authors: string;
  year: number;
  venue?: string;
  area: PaperArea;
  url: string;
  codeUrl?: string;
  verdict: "READ" | "READ+RUN" | "SKIM";
  spine?: boolean;
  whyItMatters: string;
  prereqNodeIds: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  keyIdeas: string[];
  keyEquations?: string[];
  questions: string[];
  reproduction?: {
    feasibility: "full" | "component" | "eval-only" | "none";
    plan?: string;
    compute?: string;
  };
  followUpIds?: string[];
}

export interface Project {
  id: string;
  num: number;
  title: string;
  purpose: string;
  levelWindow: [number, number];
  prereqNodeIds: string[];
  minimum: string[];
  stretch: string[];
  metrics: string[];
  failureModes: string[];
  researchConnection: string;
  artifact: string;
  computeNote?: string;
  hours: number;
}

export interface Boss {
  id: string;
  level: number;
  title: string;
  scenario: string;
  passCriteria: string[];
  remediation: { weakness: string; nodeIds: string[] }[];
  hours: number;
}

export interface FrontierEntry {
  id: string;
  date: string; // YYYY-MM
  title: string;
  org: string;
  kind: "model" | "paper" | "dataset" | "benchmark" | "tool" | "event" | "debate";
  url?: string;
  whatChanged: string;
  roadmapImpact: "none" | "watch" | "minor" | "major";
  verdict: string;
  studyWhen: "now" | "at-level" | "later" | "skip";
  relatedLevel?: number;
}

export interface Level {
  id: number;
  slug: string;
  title: string;
  codename: string;
  goal: string;
  exitCriteria: string[];
  bossId?: string;
  /** Expected day window (pacing overlay only — never a lock). */
  phase: { startDay: number; endDay: number };
  accent: string; // css color token
}

export interface RankDef {
  index: number;
  title: string;
  /** Human-readable evidence requirement. */
  requires: string;
  bossIds?: string[];
  /** [level, fraction of core nodes at >= gate tier] */
  levelCompletion?: [number, number][];
  minXp?: number;
}

export interface ResearchTemplate {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

export interface TutorPrompt {
  id: string;
  title: string;
  prompt: string;
  when: string;
}

// ---------- progress (client state; every entity carries updatedAt for sync merge) ----------

export type Independence = "independent" | "hints" | "heavy_ai" | "copied";

export interface ReviewState {
  due: number; // epoch ms
  interval: number; // days
  ease: number;
  reps: number;
  lapses: number;
}

export interface NodeProgress {
  status: "not_started" | "learning" | "mastered";
  tier: Tier;
  confidence?: 1 | 2 | 3 | 4 | 5;
  independence?: Independence;
  evidence?: string;
  startedAt?: number;
  masteredAt?: number;
  review?: ReviewState;
  updatedAt: number;
}

export interface SessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  block: Block;
  nodeId?: string;
  independence?: Independence;
  note?: string;
  updatedAt: number;
}

export type PaperStatus =
  | "queue"
  | "triaged"
  | "reading"
  | "deriving"
  | "reproducing"
  | "reproduced"
  | "modified"
  | "research-lead";

export interface DefenseResult {
  date: string;
  score: number;
  total: number;
  verdict: "defended" | "partial" | "undefended";
}

export interface PaperProgress {
  status: PaperStatus;
  notes?: string;
  defense?: DefenseResult;
  updatedAt: number;
}

/** Position + retrieval results inside an in-app lesson. */
export interface LessonProgress {
  section: number;
  /** checkId -> honest self-grade. Missed items are review fuel, not shame. */
  checks: Record<string, "got" | "missed">;
  completedAt?: number;
  updatedAt: number;
}

/** Per-day mission step completion (YYYY-MM-DD -> stepId -> done). */
export interface DayPlan {
  steps: Record<string, boolean>;
  updatedAt: number;
}

export type ProjectStatus = "todo" | "active" | "done";

export interface ProjectProgress {
  status: ProjectStatus;
  notes?: string;
  updatedAt: number;
}

export interface ExperimentRecord {
  id: string;
  title: string;
  hypothesis: string;
  baseline: string;
  independentVar: string;
  dependentVar: string;
  controls: string;
  seeds: string;
  commit?: string;
  config?: string;
  dataset?: string;
  metrics?: string;
  result?: string;
  conclusion?: string;
  next?: string;
  status: "planned" | "running" | "done" | "negative" | "abandoned";
  createdAt: number;
  updatedAt: number;
}

export interface Idea {
  id: string;
  title: string;
  note?: string;
  /** HANDOVER §16 scoring dimensions, 1–5 each. */
  scores?: Record<string, number>;
  status: "inbox" | "scored" | "promoted" | "dropped";
  createdAt: number;
  updatedAt: number;
}

export interface BossAttempt {
  id: string;
  bossId: string;
  date: string;
  passed: boolean;
  notes?: string;
  weaknesses?: string[];
  updatedAt: number;
}

export interface WeeklyReview {
  week: string; // YYYY-Www
  answers: Record<string, string>;
  done: boolean;
  updatedAt: number;
}

export interface Settings {
  startDate?: string; // YYYY-MM-DD — Day 1
  dailyHoursTarget: number;
  gpuTier: "none" | "12" | "16" | "24" | "32+";
  researchModeOverride?: boolean;
  syncSecret?: string;
  updatedAt: number;
}

export interface ProgressData {
  schema: number;
  rev: number;
  nodes: Record<string, NodeProgress>;
  logs: SessionLog[];
  papers: Record<string, PaperProgress>;
  projects: Record<string, ProjectProgress>;
  experiments: ExperimentRecord[];
  ideas: Idea[];
  bossAttempts: BossAttempt[];
  weeklies: Record<string, WeeklyReview>;
  lessons: Record<string, LessonProgress>;
  dayPlans: Record<string, DayPlan>;
  settings: Settings;
}

export type NodeState =
  | "locked"
  | "available"
  | "learning"
  | "review-due"
  | "mastered"
  | "research-level";
