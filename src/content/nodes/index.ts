import type { SkillNode } from "@/lib/types";
import { L0_NODES } from "./L0";
import { L1_NODES } from "./L1";
import { L2_NODES } from "./L2";
import { L3_NODES } from "./L3";
import { L4_NODES } from "./L4";
import { L5_NODES } from "./L5";
import { L6_NODES } from "./L6";
import { L7_NODES } from "./L7";
import { L8_NODES } from "./L8";
import { L9_NODES } from "./L9";
import { L10_NODES } from "./L10";
import { L11_NODES } from "./L11";
import { L12_NODES } from "./L12";
import { L13_NODES } from "./L13";
import { L14_NODES } from "./L14";
import { L15_NODES } from "./L15";
import { L16_NODES } from "./L16";

export const NODES: SkillNode[] = [
  ...L0_NODES,
  ...L1_NODES,
  ...L2_NODES,
  ...L3_NODES,
  ...L4_NODES,
  ...L5_NODES,
  ...L6_NODES,
  ...L7_NODES,
  ...L8_NODES,
  ...L9_NODES,
  ...L10_NODES,
  ...L11_NODES,
  ...L12_NODES,
  ...L13_NODES,
  ...L14_NODES,
  ...L15_NODES,
  ...L16_NODES,
];

export const NODE_MAP: Map<string, SkillNode> = new Map(NODES.map((n) => [n.id, n]));
export const nodeById = (id: string) => NODE_MAP.get(id);
export const nodesForLevel = (level: number) => NODES.filter((n) => n.level === level);
