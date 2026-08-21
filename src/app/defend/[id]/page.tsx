import { notFound } from "next/navigation";
import { PAPERS, paperById } from "@/content/papers";
import { DefenseRunner } from "./DefenseRunner";

export function generateStaticParams() {
  return PAPERS.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/defend/[id]">) {
  const { id } = await params;
  const p = paperById(id);
  return { title: p ? `Defend · ${p.title}` : "Defense Mode" };
}

export default async function DefendPage({ params }: PageProps<"/defend/[id]">) {
  const { id } = await params;
  if (!paperById(id)) notFound();
  return <DefenseRunner paperId={id} />;
}
