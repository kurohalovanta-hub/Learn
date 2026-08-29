"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  BossAttempt, DayPlan, DefenseResult, EvidenceRecord, ExperimentRecord, Idea, Independence,
  IndependenceLevel, NodeProgress, PaperStatus, ProgressData, ProjectStatus, SessionLog,
  Settings, Tier, TutorChat, TutorChatMessage, WeeklyReview,
} from "@/lib/types";
import { initialReview, nextReview, type ReviewOutcome } from "@/lib/engine/review";
import { deriveNode } from "@/lib/engine/competency";

export const SCHEMA_VERSION = 3;

/** Client-side event-log cap; oldest info-only events are dropped first past this. */
const EVENT_CAP = 8000;

const emptyData = (): ProgressData => ({
  schema: SCHEMA_VERSION,
  rev: 0,
  nodes: {},
  events: [],
  tutorChats: {},
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

export type NewEvidence = Omit<EvidenceRecord, "id" | "at"> & { at?: number };

export interface StoreState extends ProgressData {
  hydrated: boolean;
  /** Username this local cache belongs to (accounts mode); null = local-only. */
  owner: string | null;
  lastSync?: { at: number; ok: boolean; message: string };
  // node actions — evidence only; tier/status are DERIVED (HANDOVERFINAL §26)
  startNode: (id: string) => void;
  recordEvidence: (ev: NewEvidence) => EvidenceRecord;
  /** The PROVE-IT / diagnostic path: typed attempt + self-verdict + explicit independence. */
  recordAssessment: (nodeId: string, a: {
    attempt: string;
    passed: boolean;
    independence: IndependenceLevel;
    diagnostic?: boolean;
    note?: string;
  }) => void;
  /** Legacy/admin only — always rendered as an unverified override. */
  recordManualOverride: (id: string, tier: Tier, note?: string) => void;
  resetNode: (id: string) => void;
  reviewNode: (id: string, outcome: ReviewOutcome, sketch?: string) => void;
  // tutor chat log — synced per account, capped so it can never wedge the 4MB sync doc
  saveTutorChat: (nodeId: string, messages: TutorChatMessage[]) => void;
  clearTutorChat: (nodeId: string) => void;
  // logs
  addLog: (log: Omit<SessionLog, "id" | "updatedAt">) => void;
  deleteLog: (id: string) => void;
  // papers / projects
  setPaperStatus: (id: string, status: PaperStatus, notes?: string) => void;
  recordDefense: (paperId: string, result: DefenseResult, nodeIds?: string[]) => void;
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

/** Re-derive one node's cached progress from the event log, preserving live-state fields. */
function recomputeNode(
  nodes: Record<string, NodeProgress>,
  events: EvidenceRecord[],
  id: string,
  now: number,
): Record<string, NodeProgress> {
  const d = deriveNode(id, events);
  const prev = nodes[id];
  const next = { ...nodes };
  if (d.status === "not_started" && !prev?.review) {
    delete next[id];
    return next;
  }
  next[id] = {
    status: d.status,
    tier: d.tier,
    confidence: d.confidence,
    independence: prev?.independence,
    evidence: prev?.evidence,
    startedAt: prev?.startedAt ?? d.startedAt,
    masteredAt: d.masteredAt ?? prev?.masteredAt,
    review: prev?.review,
    verified: d.verified,
    provisional: d.provisional,
    legacy: d.legacy,
    semantic: d.semantic,
    updatedAt: now,
  };
  return next;
}

function capEvents(events: EvidenceRecord[]): EvidenceRecord[] {
  if (events.length <= EVENT_CAP) return events;
  // drop oldest info-only events first, then oldest overall
  const info = events.filter((e) => e.outcome === "info");
  const drop = new Set(info.slice(0, events.length - EVENT_CAP).map((e) => e.id));
  let out = events.filter((e) => !drop.has(e.id));
  if (out.length > EVENT_CAP) out = out.slice(out.length - EVENT_CAP);
  return out;
}

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

      recordEvidence: (ev) => {
        const rec: EvidenceRecord = { ...ev, id: uid(), at: ev.at ?? Date.now() };
        set((s) => {
          const events = capEvents([...s.events, rec]);
          const now = Date.now();
          let nodes = recomputeNode(s.nodes, events, rec.nodeId, now);
          // assessment pass ⇒ schedule the early retention audit (Δ5): due ≤ now + 2d
          if (rec.kind === "assessment" && rec.outcome === "pass") {
            const p = nodes[rec.nodeId];
            if (p) {
              const early = now + 2 * 24 * 3600 * 1000;
              const review = p.review && p.review.due < early ? p.review : { ...(p.review ?? initialReview(now)), due: early };
              nodes = { ...nodes, [rec.nodeId]: { ...p, review, updatedAt: now } };
            }
          }
          return {
            ...touch(s),
            settings: s.settings.startDate ? s.settings : { ...s.settings, startDate: new Date().toISOString().slice(0, 10), updatedAt: now },
            events,
            nodes,
          };
        });
        return rec;
      },

      recordAssessment: (nodeId, a) => {
        get().recordEvidence({
          nodeId,
          kind: "assessment",
          outcome: a.passed ? "pass" : "fail",
          independence: a.independence,
          attempt: a.attempt,
          note: a.diagnostic ? `diagnostic${a.note ? ` · ${a.note}` : ""}` : a.note,
        });
      },

      recordManualOverride: (id, tier, note) => {
        get().recordEvidence({ nodeId: id, kind: "manual-override", outcome: "info", tier, note });
      },

      resetNode: (id) =>
        set((s) => {
          // reset = boundary event; history is kept, derivation restarts after it
          const rec: EvidenceRecord = { id: uid(), nodeId: id, kind: "manual-override", outcome: "info", tier: "none", note: "reset", at: Date.now() };
          const events = capEvents([...s.events, rec]);
          const nodes = { ...s.nodes };
          delete nodes[id];
          return { ...touch(s), events, nodes };
        }),

      saveTutorChat: (nodeId, messages) =>
        set((s) => {
          // caps: last 30 messages, 2500 chars each, 12 most-recent nodes
          const trimmed: TutorChatMessage[] = messages.slice(-30).map((m) => ({
            role: m.role,
            content: m.content.length > 2500 ? `${m.content.slice(0, 2500)}…` : m.content,
          }));
          const chats: Record<string, TutorChat> = {
            ...s.tutorChats,
            [nodeId]: { nodeId, messages: trimmed, updatedAt: Date.now() },
          };
          const ids = Object.keys(chats);
          if (ids.length > 12) {
            for (const id of ids.sort((a, b) => chats[a].updatedAt - chats[b].updatedAt).slice(0, ids.length - 12)) {
              delete chats[id];
            }
          }
          return { ...touch(s), tutorChats: chats };
        }),

      clearTutorChat: (nodeId) =>
        set((s) => {
          const chats = { ...s.tutorChats };
          delete chats[nodeId];
          return { ...touch(s), tutorChats: chats };
        }),

      reviewNode: (id, outcome, sketch) =>
        set((s) => {
          const p = s.nodes[id];
          if (!p?.review) return s;
          const now = Date.now();
          const review = nextReview(p.review, outcome, now);
          const rec: EvidenceRecord = {
            id: uid(), nodeId: id, kind: "retention",
            outcome: outcome === "failed" ? "fail" : outcome === "hard" ? "partial" : "pass",
            attempt: sketch, at: now,
          };
          const events = capEvents([...s.events, rec]);
          let nodes = recomputeNode(s.nodes, events, id, now);
          const cur = nodes[id];
          if (cur) nodes = { ...nodes, [id]: { ...cur, review, updatedAt: now } };
          return { ...touch(s), events, nodes };
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
      recordDefense: (paperId, result, nodeIds) => {
        set((s) => ({
          ...touch(s),
          papers: {
            ...s.papers,
            [paperId]: { ...(s.papers[paperId] ?? { status: "reading" as const }), defense: result, updatedAt: Date.now() },
          },
        }));
        // a defended paper is integration evidence for its prerequisite nodes
        if (result.verdict === "defended" && nodeIds?.length) {
          for (const nodeId of nodeIds) {
            get().recordEvidence({
              nodeId, kind: "paper", outcome: "pass",
              note: `defended ${paperId} (${result.score}/${result.total})`,
            });
          }
        }
      },
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
      gradeLessonCheck: (nodeId, checkId, result) => {
        set((s) => {
          const prev = s.lessons[nodeId] ?? { section: 0, checks: {}, updatedAt: 0 };
          return {
            ...touch(s),
            lessons: {
              ...s.lessons,
              [nodeId]: { ...prev, checks: { ...prev.checks, [checkId]: result }, updatedAt: Date.now() },
            },
          };
        });
        // lesson checks are retrieval evidence — the lesson layer now feeds mastery honestly
        get().recordEvidence({
          nodeId, kind: "retrieval", outcome: result === "got" ? "pass" : "fail", note: checkId, minutes: 2,
        });
      },
      completeLesson: (nodeId) => {
        const already = get().lessons[nodeId]?.completedAt;
        set((s) => {
          const prev = s.lessons[nodeId] ?? { section: 0, checks: {}, updatedAt: 0 };
          return {
            ...touch(s),
            lessons: {
              ...s.lessons,
              [nodeId]: { ...prev, completedAt: prev.completedAt ?? Date.now(), updatedAt: Date.now() },
            },
          };
        });
        if (!already) {
          get().recordEvidence({ nodeId, kind: "exposure", outcome: "info", note: "lesson completed", minutes: 10 });
        }
      },
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
          schema: s.schema, rev: s.rev, nodes: s.nodes, events: s.events, tutorChats: s.tutorChats, logs: s.logs, papers: s.papers,
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
          // events: append-only union by id (never LWW — history merges losslessly)
          const evMap = new Map(s.events.map((e) => [e.id, e]));
          for (const e of r.events ?? []) if (!evMap.has(e.id)) evMap.set(e.id, e);
          const events = capEvents([...evMap.values()].sort((a, b) => a.at - b.at));

          let nodes = mergeMap(s.nodes, r.nodes);
          // re-derive every node touched by the merged log so caches agree with evidence
          const touched = new Set(events.map((e) => e.nodeId));
          const now = Date.now();
          for (const id of touched) nodes = recomputeNode(nodes, events, id, now);

          return {
            ...touch(s),
            events,
            nodes,
            tutorChats: mergeMap(s.tutorChats, r.tutorChats),
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
        const p = (persisted ?? {}) as Partial<StoreState>;
        const base: Partial<StoreState> = { ...p, lessons: p.lessons ?? {}, dayPlans: p.dayPlans ?? {}, tutorChats: p.tutorChats ?? {}, owner: p.owner ?? null };
        return migrateEvents(base) as StoreState;
      },
      partialize: (s) => ({
        schema: SCHEMA_VERSION, rev: s.rev, owner: s.owner, nodes: s.nodes, events: s.events, tutorChats: s.tutorChats, logs: s.logs,
        papers: s.papers, projects: s.projects, experiments: s.experiments, ideas: s.ideas,
        bossAttempts: s.bossAttempts, weeklies: s.weeklies, lessons: s.lessons,
        dayPlans: s.dayPlans, settings: s.settings,
      }),
      onRehydrateStorage: () => (state) => state?._setHydrated(),
    },
  ),
);

const LEGACY_INDEP: Record<Independence, IndependenceLevel> = {
  independent: "independent",
  hints: "minor_hints",
  heavy_ai: "full_solution_seen",
  copied: "full_solution_seen",
};

/** v2 → v3: tiers that predate the evidence log become flagged manual-override events. */
function migrateEvents<T extends Partial<ProgressData>>(data: T): T {
  if (data.events && data.events.length > 0) return { ...data, events: data.events };
  const nodes = data.nodes ?? {};
  const events: EvidenceRecord[] = [];
  for (const [nodeId, p] of Object.entries(nodes)) {
    if (!p || p.tier === "none") continue;
    events.push({
      id: `legacy-${nodeId}`,
      nodeId,
      kind: "manual-override",
      outcome: "info",
      tier: p.tier,
      independence: p.independence ? LEGACY_INDEP[p.independence] : undefined,
      note: p.evidence ? `legacy claim · ${p.evidence}` : "legacy claim (pre-evidence schema)",
      at: p.masteredAt ?? p.updatedAt ?? Date.now(),
    });
  }
  // refresh derived flags on the cached nodes
  let out: Record<string, NodeProgress> = { ...nodes };
  const now = Date.now();
  for (const id of Object.keys(nodes)) out = recomputeNode(out, events, id, now);
  return { ...data, events, nodes: out };
}

export function migrate(data: ProgressData): ProgressData {
  const base = emptyData();
  const merged: ProgressData = {
    ...base,
    ...data,
    schema: SCHEMA_VERSION,
    events: data.events ?? [],
    tutorChats: data.tutorChats ?? {},
    lessons: data.lessons ?? {},
    dayPlans: data.dayPlans ?? {},
    settings: { ...base.settings, ...data.settings },
  };
  return migrateEvents(merged);
}
