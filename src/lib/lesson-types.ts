// Lesson content model (docs/architecture/LEARNING-SYSTEM.md §2).
// Lessons are typed DATA derived from the node's verified sources — renderable
// by the runner, checkable by scripts/validate-content.ts.

export type Depth =
  | "intuition"
  | "formalism"
  | "derivation"
  | "implementation"
  | "application"
  | "research";

export const DEPTH_ORDER: Depth[] = [
  "intuition", "formalism", "derivation", "implementation", "application", "research",
];

export const DEPTH_COLORS: Record<Depth, string> = {
  intuition: "#4dd6e8",
  formalism: "#a78bfa",
  derivation: "#e8b34d",
  implementation: "#52d68a",
  application: "#f2934d",
  research: "#e86ea4",
};

export interface ProseBlock {
  kind: "prose";
  /** Markdown with $inline$ and $$display$$ math. */
  md: string;
}

export interface EquationBlock {
  kind: "equation";
  tex: string;
  label?: string;
  note?: string;
}

export interface DerivationBlock {
  kind: "derivation";
  title?: string;
  intro?: string;
  steps: { text: string; tex?: string }[];
}

export interface WidgetBlock {
  kind: "widget";
  id: string;
  caption?: string;
  params?: Record<string, unknown>;
}

export type CodeMode = "read" | "predict" | "trace" | "missing" | "debug" | "write";

export interface CodeBlockSpec {
  kind: "code";
  mode: CodeMode;
  lang?: string;
  title?: string;
  source: string;
  /** The task ("What does this print?", "Line 4 has a bug — name it."). */
  prompt?: string;
  /** MCQ options for predict/debug; omit for free-response. */
  options?: string[];
  /** Correct option index (MCQ) — auto-graded. */
  answerIndex?: number;
  /** Canonical answer / expected output / the missing line(s). */
  answer?: string;
  explanation?: string;
  /** 1-indexed lines to visually emphasize. */
  highlight?: number[];
  /** 1-indexed lines masked for `missing` mode. */
  masked?: number[];
  /** For `trace`: rows of the state table revealed step-by-step. */
  trace?: { step: string; state: string }[];
  /** For `write`: acceptance checks the learner verifies in their own editor. */
  checks?: string[];
}

export interface QuizBlock {
  kind: "quiz";
  title?: string;
  items: {
    q: string;
    /** MCQ options; omit for open retrieval questions. */
    options?: string[];
    /** Correct option index when options given. */
    answerIndex?: number;
    /** Canonical answer text (shown on reveal). */
    a: string;
    why?: string;
  }[];
}

export interface ExerciseBlock {
  kind: "exercise";
  level: 1 | 2 | 3;
  prompt: string;
  hint?: string;
  solution?: string;
}

export interface MisconceptionBlock {
  kind: "misconception";
  wrong: string;
  right: string;
}

export interface ConnectionBlock {
  kind: "connection";
  md: string;
  nodeIds?: string[];
  paperIds?: string[];
  projectIds?: string[];
}

export interface SourcesBlock {
  kind: "sources";
  note?: string;
}

export interface MasteryBlock {
  kind: "mastery";
}

export interface CalloutBlock {
  kind: "callout";
  tone: "info" | "warn" | "insight";
  title?: string;
  md: string;
}

export type LessonBlock =
  | ProseBlock
  | EquationBlock
  | DerivationBlock
  | WidgetBlock
  | CodeBlockSpec
  | QuizBlock
  | ExerciseBlock
  | MisconceptionBlock
  | ConnectionBlock
  | SourcesBlock
  | MasteryBlock
  | CalloutBlock;

export interface LessonSection {
  id: string;
  title: string;
  depth: Depth;
  blocks: LessonBlock[];
}

export interface Lesson {
  nodeId: string;
  title: string;
  subtitle?: string;
  /** Honest total including interactions. */
  minutes: number;
  sections: LessonSection[];
}

export interface LessonMeta {
  nodeId: string;
  title: string;
  minutes: number;
  widgets: string[];
  sections: number;
}
