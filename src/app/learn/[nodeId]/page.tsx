import { notFound } from "next/navigation";
import { LESSON_IDS, lessonMeta } from "@/content/lessons/manifest";
import { LESSON_REGISTRY } from "@/content/lessons/registry";
import { LessonRunner } from "@/components/lesson/LessonRunner";

export function generateStaticParams() {
  return LESSON_IDS.map((nodeId) => ({ nodeId }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/learn/[nodeId]">) {
  const { nodeId } = await params;
  return { title: lessonMeta(nodeId)?.title ?? "Lesson" };
}

export default async function LearnPage({ params }: PageProps<"/learn/[nodeId]">) {
  const { nodeId } = await params;
  const load = LESSON_REGISTRY[nodeId];
  if (!load) notFound();
  const { lesson } = await load();
  return <LessonRunner lesson={lesson} />;
}
