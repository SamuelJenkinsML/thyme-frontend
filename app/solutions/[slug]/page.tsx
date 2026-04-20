import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/solutions/case-study-view";
import { getAllSlugs, getCaseStudy } from "@/lib/case-studies";
import { highlightSource } from "@/lib/case-studies/highlight";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Solution — Thyme" };
  return {
    title: `${study.title} — Thyme`,
    description: study.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const highlightedCode = await highlightSource(
    study.code.source,
    study.code.language,
  );

  return <CaseStudyView slug={slug} highlightedCode={highlightedCode} />;
}
