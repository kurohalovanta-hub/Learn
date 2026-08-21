import { LEVELS } from "@/content/levels";
import { LevelView } from "./LevelView";

export function generateStaticParams() {
  return LEVELS.map((l) => ({ id: String(l.id) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/levels/[id]">) {
  const { id } = await params;
  const level = LEVELS.find((l) => l.id === Number(id));
  return { title: level ? `L${level.id} ${level.title}` : "Level" };
}

export default async function Page({ params }: PageProps<"/levels/[id]">) {
  const { id } = await params;
  return <LevelView id={id} />;
}
