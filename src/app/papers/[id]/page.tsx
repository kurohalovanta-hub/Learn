import { notFound } from "next/navigation";
import { PAPERS, paperById } from "@/content/papers";
import { PaperView } from "./PaperView";

export function generateStaticParams() {
  return PAPERS.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/papers/[id]">) {
  const { id } = await params;
  return { title: paperById(id)?.title ?? "Paper" };
}

export default async function PaperPage({ params }: PageProps<"/papers/[id]">) {
  const { id } = await params;
  const paper = paperById(id);
  if (!paper) notFound();
  return <PaperView paperId={id} />;
}
