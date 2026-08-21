import type { SkillNode } from "@/lib/types";
import type { LearningPacket, ReadingItem } from "@/lib/packet-types";
import { resourceById } from "@/content/resources";

/**
 * Nodes without a curated packet render the SAME academy flow, assembled from
 * their existing authority bindings (Δ8: role labels + "study only the listed
 * sections" — thinner, never different). Packet coverage grows tranche by
 * tranche; this keeps the experience uniform meanwhile.
 */
export function fallbackPacket(node: SkillNode): LearningPacket {
  const reads: ReadingItem[] = [];
  if (node.primary) {
    const r = resourceById(node.primary.resourceId);
    reads.push({
      title: r?.title ?? node.primary.resourceId,
      url: r?.url,
      resourceId: node.primary.resourceId,
      sections: `${node.primary.sections} — study ONLY these sections`,
      minutes: Math.min(120, Math.round((node.hours * 60) / 3)),
      whySelected: r?.why,
    });
  }
  if (node.backup) {
    const r = resourceById(node.backup.resourceId);
    reads.push({
      title: `${r?.title ?? node.backup.resourceId} (backup — only if the primary doesn't land)`,
      url: r?.url,
      resourceId: node.backup.resourceId,
      sections: node.backup.sections,
      minutes: 30,
    });
  }
  const deepen: ReadingItem[] = (node.references ?? []).map((ref) => {
    const r = resourceById(ref.resourceId);
    return {
      title: r?.title ?? ref.resourceId,
      url: r?.url,
      resourceId: ref.resourceId,
      sections: ref.sections,
      minutes: 30,
    };
  });

  return {
    nodeId: node.id,
    whyNow: node.why + (node.intuition ? ` ${node.intuition}` : ""),
    diagnostic: { prompt: node.diagnostic, minutes: 10 },
    coreRead: reads.length ? reads : undefined,
    practice: node.exercises.map((e) => ({ prompt: e })),
    implement: node.implementation ? { spec: node.implementation } : undefined,
    derive: node.derivation ? { spec: node.derivation } : undefined,
    deepen: deepen.length ? deepen : undefined,
    prove: {
      task: node.masteryTest,
      criteria: ["Produced closed-book, matching the stated bar", "You could defend every step to a skeptical examiner"],
      minutes: 25,
    },
    retention: node.diagnostic,
    researchRecord: "",
    minutes: Math.round(node.hours * 60),
  };
}
