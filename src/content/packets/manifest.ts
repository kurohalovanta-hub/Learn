import type { PacketMeta } from "@/lib/packet-types";

// Light metadata, safe to import anywhere. The validator cross-checks every
// entry against the actual packet module (registry.ts must stay in sync).
export const PACKET_META: PacketMeta[] = [
  { nodeId: "l0-debug-mindset", minutes: 180 },
  { nodeId: "l0-editor", minutes: 119 },
  { nodeId: "l0-git", minutes: 240 },
  { nodeId: "l0-github", minutes: 177 },
  { nodeId: "l0-python-setup", minutes: 178 },
  { nodeId: "l0-terminal", minutes: 235 },
  { nodeId: "l1-classes", minutes: 260 },
  { nodeId: "l1-control-flow", minutes: 280 },
  { nodeId: "l1-data-structures", minutes: 335 },
  { nodeId: "l1-files-errors", minutes: 245 },
  { nodeId: "l1-functions", minutes: 270 },
  { nodeId: "l1-matplotlib", minutes: 235 },
  { nodeId: "l1-numpy", minutes: 340 },
  { nodeId: "l1-python-basics", minutes: 320 },
  { nodeId: "l1-testing-modules", minutes: 315 },
  { nodeId: "l1-vectorization-craft", minutes: 280 },
  { nodeId: "l2-algebra", minutes: 500 },
  { nodeId: "l2-derivatives", minutes: 385 },
  { nodeId: "l2-eigen-svd", minutes: 405 },
  { nodeId: "l2-functions-graphs", minutes: 300 },
  { nodeId: "l2-integrals", minutes: 224 },
  { nodeId: "l2-linear-maps", minutes: 330 },
  { nodeId: "l2-matrices", minutes: 280 },
  { nodeId: "l2-multivariable", minutes: 439 },
  { nodeId: "l2-optimization", minutes: 510 },
  { nodeId: "l2-probability", minutes: 360 },
  { nodeId: "l2-random-variables", minutes: 533 },
  { nodeId: "l2-stats-mle", minutes: 386 },
  { nodeId: "l2-trig", minutes: 285 },
  { nodeId: "l2-vectors", minutes: 210 },
  { nodeId: "l3-backprop-theory", minutes: 445 },
  { nodeId: "l3-mlp-numpy", minutes: 500 },
  { nodeId: "l4-attention", minutes: 465 },
  { nodeId: "l4-transformer", minutes: 560 },
  { nodeId: "l5-frames-rotations", minutes: 335 },
  { nodeId: "l5-jacobians", minutes: 403 },
  { nodeId: "l5-lie-se3", minutes: 665 },
  { nodeId: "l6-kalman", minutes: 707 },
  { nodeId: "l10-mdp", minutes: 338 },
  { nodeId: "l10-tabular", minutes: 590 },
  { nodeId: "l11-bc-dagger", minutes: 462 },
  { nodeId: "l12-vla-anatomy", minutes: 320 },
];

export const PACKET_IDS = PACKET_META.map((m) => m.nodeId);
export const hasPacket = (nodeId: string) => PACKET_IDS.includes(nodeId);
export const packetMeta = (nodeId: string) => PACKET_META.find((m) => m.nodeId === nodeId);
