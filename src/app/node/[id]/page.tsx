import { NODES, NODE_MAP } from "@/content/nodes";
import { PACKET_REGISTRY } from "@/content/packets/registry";
import { NodeView } from "./NodeView";

export function generateStaticParams() {
  return NODES.map((n) => ({ id: n.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/node/[id]">) {
  const { id } = await params;
  return { title: NODE_MAP.get(id)?.title ?? "Node" };
}

export default async function Page({ params }: PageProps<"/node/[id]">) {
  const { id } = await params;
  const load = PACKET_REGISTRY[id];
  const packet = load ? (await load()).packet : null;
  return <NodeView id={id} packet={packet} />;
}
