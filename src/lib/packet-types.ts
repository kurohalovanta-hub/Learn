// Learning-packet content model (HANDOVERFINAL §8, §19, §50, §60–61).
// A packet is the ASSIGNMENT layer for one node: exactly what to open now,
// for how many minutes, in which role, and what must be produced after.
// The authority layer stays in src/content/resources.ts; every packet traces
// to a live-researched record in docs/curation/<node-id>.md.

export interface MediaItem {
  title: string;
  creator: string;
  url: string;
  /** youtube-nocookie embed URL; omit when not embeddable (renders as link card). */
  embedUrl?: string;
  startSeconds?: number;
  endSeconds?: number;
  /** Expected relevant minutes (the segment, not the whole video). */
  minutes: number;
  whySelected: string;
  /** "You need to leave with" bullets shown on the card. */
  leaveWith?: string[];
  /** Duration/url not re-verifiable at curation time — rendered with a note. */
  unverified?: boolean;
}

export interface ReadingItem {
  title: string;
  url?: string;
  /** Link into the authority layer instead of (or as well as) a raw url. */
  resourceId?: string;
  sections: string;
  minutes: number;
  whySelected?: string;
}

export interface PracticeItem {
  prompt: string;
  /** Where the problems live (url or source name). */
  source?: string;
  minutes?: number;
}

export interface ArtifactTask {
  spec: string;
  checks?: string[];
  minutes?: number;
}

export interface AssessmentSpec {
  task: string;
  criteria: string[];
  minutes?: number;
}

export interface RecallItem {
  q: string;
  a: string;
}

export interface LearningPacket {
  nodeId: string;
  /** 30–90 second "why now" — not an essay (§19 screen 1). */
  whyNow: string;
  /** Test-out. `repair: true` renders it prominently (math-repair-class nodes, Δ1). */
  diagnostic?: { prompt: string; minutes: number; repair?: boolean };
  orient?: MediaItem;
  coreWatch?: MediaItem[];
  coreRead?: ReadingItem[];
  /** 2–5 retrieval questions immediately after watch/read (§10). */
  recall?: RecallItem[];
  /** In-app instruments (must exist in widgets/ids.ts). */
  interactiveIds?: string[];
  /** In-app lesson that slots into the INTERACT/FORMALIZE step. */
  lessonId?: string;
  practice: PracticeItem[];
  implement?: ArtifactTask;
  derive?: ArtifactTask;
  stuck?: { alternate?: MediaItem; alternateRead?: ReadingItem; note?: string };
  /** Authoritative longer material — only-if-needed (mandatory on depth-flagged nodes, Δ9). */
  deepen?: ReadingItem[];
  prove: AssessmentSpec;
  transfer?: AssessmentSpec;
  /** Delayed-check prompt override; node.diagnostic is used when absent. */
  retention?: string;
  /** docs/curation/<node-id>.md — the research record this packet was selected from. */
  researchRecord: string;
  /** Honest headline total (sum of step estimates incl. active work), minutes. */
  minutes: number;
}

export interface PacketMeta {
  nodeId: string;
  minutes: number;
}

/** Build a youtube-nocookie embed URL. Returns undefined for non-YouTube urls. */
export function ytEmbed(url: string, startSeconds?: number, endSeconds?: number): string | undefined {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  if (!m) return undefined;
  const params = new URLSearchParams();
  if (startSeconds) params.set("start", String(Math.floor(startSeconds)));
  if (endSeconds) params.set("end", String(Math.floor(endSeconds)));
  const q = params.toString();
  return `https://www.youtube-nocookie.com/embed/${m[1]}${q ? `?${q}` : ""}`;
}
