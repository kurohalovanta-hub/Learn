"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  BossAttempt, DayPlan, DefenseResult, ExperimentRecord, Idea, Independence,
  NodeProgress, PaperStatus, ProgressData, ProjectStatus, SessionLog, Settings, Tier, WeeklyReview,
} from "@/lib/types";
import { initialReview, nextReview, type ReviewOutcome } from "@/lib/engine/review";
import { NODE_MAP } from "@/content/nodes";
import { tierAtLeast } from "@/lib/types";

export const SCHEMA_VERSION = 2;

const emptyData = (): ProgressData => ({
  schema: SCHEMA_VERSION,
  rev: 0,
  nodes: {},
  logs: [],
  papers: {},
  projects: {},
  experiments: [],
  ideas: [],
  bossAttempts: [],
  weeklies: {},
  lessons: {},
  dayPlans: {},
  settings: { dailyHoursTarget: 6, gpuTier: "24", updatedAt: 0 },
});

export interface StoreState extends ProgressData {
  hydrated: boolean;
  /** Username this local cache belongs to (accounts mode); null = local-only. */
  owner: string | null;
  lastSync?: { at: number; ok: boolean; message: string };
  // node actions
  startNode: (id: string) => void;
  claimTier: (id: string, tier: Tier, evidence?: string, independence?: Independence, confidence?: 1 | 2 | 3 | 4 | 5) => void;
  resetNode: (id: string) => void;
  reviewNode: (id: string, outcome: ReviewOutcome) => void;
  // logs
  addLog: (log: Omit<SessionLog, "id" | "updatedAt">) => void;
  deleteLog: (id: string) => void;
  // papers / projects
  setPaperStatus: (id: string, status: PaperStatus, notes?: string) => void;
  recordDefense: (paperId: string, result: DefenseResult) => void;
  setProjectStatus: (id: string, status: ProjectStatus, notes?: string) => void;
  // lessons + mission
  setLessonPosition: (nodeId: string, section: number) => void;
  gradeLessonCheck: (nodeId: string, checkId: string, result: "got" | "missed") => void;
  completeLesson: (nodeId: string) => void;
  toggleMissionStep: (date: string, stepId: string, done: boolean) => void;
  // experiments / ideas / bosses / weeklies
  upsertExperiment: (e: Partial<ExperimentRecord> & { id?: string }) => void;
  deleteExperiment: (id: string) => void;
  upsertIdea: (i: Partial<Idea> & { id?: string }) => void;
  deleteIdea: (id: string) => void;
  recordBossAttempt: (a: Omit<BossAttempt, "id" | "updatedAt">) => void;
  saveWeekly: (w: WeeklyReview) => void;
  // settings / data management
  updateSettings: (s: Partial<Settings>) => void;
  setOwner: (owner: string | null) => void;
  importData: (data: ProgressData) => void;
  exportData: () => ProgressData;
  mergeRemote: (remote: ProgressData) => void;
  setLastSync: (s: StoreState["lastSync"]) => void;
  resetAll: () => void;
  _setHydrated: () => void;
}

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const touch = (s: { rev: number }) => ({ rev: s.rev + 1 });

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...emptyData(),
      hydrated: false,
      owner: null,

      startNode: (id) =>
        set((s) => {
          const prev = s.nodes[id];
          if (prev?.status === "mastered") return s;
          const startDate = s.settings.startDate ?? new Date().toISOString().slice(0, 10);
          return {
            ...touch(s),
            settings: s.settings.startDate ? s.settings : { ...s.settings, startDate, updatedAt: Date.now() },
            nodes: {
              ...s.nodes,
              [id]: {
                ...prev,
                status: "learning",
                tier: prev?.tier ?? "none",
                startedAt: prev?.startedAt ?? Date.now(),
                updatedAt: Date.now(),
              } satisfies NodeProgress,
            },
          };
        }),

      claimTier: (id, tier, evidence, independence, confidence) =>
        set((s) => {
          const node = NODE_MAP.get(id);
          const prev = s.nodes[id];
          const mastered = node ? tierAtLeast(tier, node.masteryGate) : tier !== "none";
          const now = Date.now();
          return {
            ...touch(s),
            settings: s.settings.startDate ? s.settings : { ...s.settings, startDate: new Date().toISOString().slice(0, 10), updatedAt: now },
            nodes: {
              ...s.nodes,
              [id]: {
                status: mastered ? "mastered" : "learning",
                tier,
                evidence: evidence ?? prev?.evidence,
                independence: independence ?? prev?.independence,
                confidence: confidence ?? prev?.confidence,
                startedAt: prev?.startedAt ?? now,
                masteredAt: mastered ? (prev?.masteredAt ?? now) : prev?.masteredAt,
                review: mastered ? (prev?.review ?? initialReview(now)) : prev?.review,
                updatedAt: now,
              },
            },
          };
        }),

      resetNode: (id) =>
        set((s) => {
          const nodes = { ...s.nodes };
          delete nodes[id];
          return { ...touch(s), nodes };
        }),

      reviewNode: (id, outcome) =>
        set((s) => {
          const p = s.nodes[id];
          if (!p?.review) return s;
          const now = Date.now();
          const review = nextReview(p.review, outcome, now);
          const demote = outcome === "failed";
          return {
            ...touch(s),
            nodes: {
              ...s.nodes,
              [id]: {
                ...p,
                review,
                confidence: demote ? (Math.max(1, (p.confidence ?? 3) - 1) as 1 | 2 | 3 | 4 | 5) : p.confidence,
                updatedAt: now,
              },
            },
          };
        }),

      addLog: (log) =>
        set((s) => ({
          ...touch(s),
          settings: s.settings.startDate ? s.settings : { ...s.settings, startDate: log.date, updatedAt: Date.now() },
          logs: [...s.logs, { ...log, id: uid(), updatedAt: Date.now() }],
        })),
      deleteLog: (id) => set((s) => ({ ...touch(s), logs: s.logs.filter((l) => l.id !== id) })),

      setPaperStatus: (id, status, notes) =>
        set((s) => ({
          ...touch(s),
          papers: { ...s.papers, [id]: { ...s.papers[id], status, notes: notes ?? s.papers[id]?.notes, updatedAt: Date.now() } },
        })),
      recordDefense: (paperId, result) =>
        set((s) => ({
          ...touch(s),
          papers: {
            ...s.papers,
            [paperId]: { ...(s.papers[paperId] ?? { status: "reading" as const }), defense: result, updatedAt: Date.now() },
          },
        })),
      setProjectStatus: (id, status, notes) =>
        set((s) => ({
          ...touch(s),
          projects: { ...s.projects, [id]: { status, notes: notes ?? s.projects[id]?.notes, updatedAt: Date.now() } },
        })),

      setLessonPosition: (nodeId, section) =>
        set((s) => {
          const prev = s.lessons[nodeId];
          if (prev?.section === section) return s;
          return {
            ...touch(s),
            lessons: {
              ...s.lessons,
              [nodeId]: { ...(prev ?? { checks: {} }), section, updatedAt: Date.now() },
            },
          };
        }),
      gradeLessonCheck: (nodeId, checkId, result) =>
        set((s) => {
          const prev = s.lessons[nodeId] ?? { section: 0, checks: {}, updatedAt: 0 };
          return {
            ...touch(s),
            lessons: {
              ...s.lessons,
              [nodeId]: { ...prev, checks: { ...prev.checks, [checkId]: result }, updatedAt: Date.now() },
            },
          };
        }),
      completeLesson: (nodeId) =>
        set((s) => {
          const prev = s.lessons[nodeId] ?? { section: 0, checks: {}, updatedAt: 0 };
          return {
            ...touch(s),
            lessons: {
              ...s.lessons,
              [nodeId]: { ...prev, completedAt: prev.completedAt ?? Date.now(), updatedAt: Date.now() },
            },
          };
        }),
      toggleMissionStep: (date, stepId, done) =>
        set((s) => {
          const prev: DayPlan = s.dayPlans[date] ?? { steps: {}, updatedAt: 0 };
          return {
            ...touch(s),
            dayPlans: {
              ...s.dayPlans,
              [date]: { steps: { ...prev.steps, [stepId]: done }, updatedAt: Date.now() },
            },
          };
        }),

      upsertExperiment: (e) =>
        set((s) => {
          const now = Date.now();
          const existing = e.id ? s.experiments.find((x) => x.id === e.id) : undefined;
          if (existing) {
            return {
              ...touch(s),
              experiments: s.experiments.map((x) => (x.id === e.id ? { ...x, ...e, updatedAt: now } : x)),
            };
          }
          const fresh: ExperimentRecord = {
            id: uid(), title: "", hypothesis: "", baseline: "", independentVar: "", dependentVar: "",
            controls: "", seeds: "", status: "planned", createdAt: now, updatedAt: now, ...e,
          };
          return { ...touch(s), experiments: [...s.experiments, fresh] };
        }),
      deleteExperiment: (id) => set((s) => ({ ...touch(s), experiments: s.experiments.filter((e) => e.id !== id) })),

      upsertIdea: (i) =>
        set((s) => {
          const now = Date.now();
          const existing = i.id ? s.ideas.find((x) => x.id === i.id) : undefined;
          if (existing) {
            return { ...touch(s), ideas: s.ideas.map((x) => (x.id === i.id ? { ...x, ...i, updatedAt: now } : x)) };
          }
          const fresh: Idea = { id: uid(), title: "", status: "inbox", createdAt: now, updatedAt: now, ...i };
          return { ...touch(s), ideas: [...s.ideas, fresh] };
        }),
      deleteIdea: (id) => set((s) => ({ ...touch(s), ideas: s.ideas.filter((i) => i.id !== id) })),

      recordBossAttempt: (a) =>
        set((s) => ({ ...touch(s), bossAttempts: [...s.bossAttempts, { ...a, id: uid(), updatedAt: Date.now() }] })),

      saveWeekly: (w) =>
        set((s) => ({ ...touch(s), weeklies: { ...s.weeklies, [w.week]: { ...w, updatedAt: Date.now() } } })),

      updateSettings: (patch) =>
        set((s) => ({ ...touch(s), settings: { ...s.settings, ...patch, updatedAt: Date.now() } })),

      setOwner: (owner) => set({ owner }),

      importData: (data) =>
        set((s) => ({ ...migrate(data), hydrated: s.hydrated, owner: s.owner, rev: Math.max(s.rev, data.rev ?? 0) + 1 })),

      exportData: () => {
        const s = get();
        return {
          schema: s.schema, rev: s.rev, nodes: s.nodes, logs: s.logs, papers: s.papers,
          projects: s.projects, experiments: s.experiments, ideas: s.ideas,
          bossAttempts: s.bossAttempts, weeklies: s.weeklies, lessons: s.lessons,
          dayPlans: s.dayPlans, settings: s.settings,
        };
      },

      mergeRemote: (remote) =>
        set((s) => {
          const r = migrate(remote);
          const lww = <T extends { updatedAt: number }>(a: T | undefined, b: T | undefined): T | undefined =>
            !a ? b : !b ? a : a.updatedAt >= b.updatedAt ? a : b;
          const mergeMap = <T extends { updatedAt: number }>(
            local: Record<string, T>, rem: Record<string, T>,
          ): Record<string, T> => {
            const out: Record<string, T> = { ...local };
            for (const [k, v] of Object.entries(rem)) out[k] = lww(out[k], v)!;
            return out;
          };
          const mergeList = <T extends { id: string; updatedAt: number }>(local: T[], rem: T[]): T[] => {
            const m = new Map(local.map((x) => [x.id, x]));
            for (const x of rem) {
              const cur = m.get(x.id);
              if (!cur || x.updatedAt > cur.updatedAt) m.set(x.id, x);
            }
            return [...m.values()];
          };
          return {
            ...touch(s),
            nodes: mergeMap(s.nodes, r.nodes),
            papers: mergeMap(s.papers, r.papers),
            projects: mergeMap(s.projects, r.projects),
            weeklies: mergeMap(s.weeklies, r.weeklies),
            lessons: mergeMap(s.lessons, r.lessons),
            dayPlans: mergeMap(s.dayPlans, r.dayPlans),
            logs: mergeList(s.logs, r.logs),
            experiments: mergeList(s.experiments, r.experiments),
            ideas: mergeList(s.ideas, r.ideas),
            bossAttempts: mergeList(s.bossAttempts, r.bossAttempts),
            settings: (lww(s.settings, r.settings) ?? s.settings),
          };
        }),

      setLastSync: (lastSync) => set({ lastSync }),
      resetAll: () => set((s) => ({ ...emptyData(), hydrated: s.hydrated, owner: s.owner, rev: s.rev + 1 })),
      _setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "embodied-os-progress",
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      migrate: (persisted) => {
        // v1 → v2: new maps default to empty; owner defaults to null
        const p = (persisted ?? {}) as Partial<StoreState>;
        return { ...p, lessons: p.lessons ?? {}, dayPlans: p.dayPlans ?? {}, owner: p.owner ?? null } as StoreState;
      },
      partialize: (s) => ({
        schema: SCHEMA_VERSION, rev: s.rev, owner: s.owner, nodes: s.nodes, logs: s.logs,
        papers: s.papers, projects: s.projects, experiments: s.experiments, ideas: s.ideas,
        bossAttempts: s.bossAttempts, weeklies: s.weeklies, lessons: s.lessons,
        dayPlans: s.dayPlans, settings: s.settings,
      }),
      onRehydrateStorage: () => (state) => state?._setHydrated(),
    },
  ),
);

export function migrate(data: ProgressData): ProgressData {
  const base = emptyData();
  return {
    ...base,
    ...data,
    schema: SCHEMA_VERSION,
    lessons: data.lessons ?? {},
    dayPlans: data.dayPlans ?? {},
    settings: { ...base.settings, ...data.settings },
  };
}
