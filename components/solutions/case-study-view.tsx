"use client";

import { notFound } from "next/navigation";
import { ApproachBlock } from "./approach-block";
import { AudienceSplit } from "./audience-split";
import { CapabilitiesGrid } from "./capabilities-grid";
import { CaseStudyHero } from "./case-study-hero";
import { CodeBlock } from "./code-block";
import { CTASection } from "@/components/landing/cta-section";
import { FeaturesGrid } from "./features-grid";
import { PersonasTable } from "./personas-table";
import { ProblemBlock } from "./problem-block";
import { RelatedCaseStudies } from "./related-case-studies";
import {
  getCaseStudy,
  getRelatedCaseStudies,
} from "@/lib/case-studies";

export function CaseStudyView({
  slug,
  highlightedCode,
}: {
  slug: string;
  highlightedCode?: string;
}) {
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const related = getRelatedCaseStudies(slug);

  return (
    <>
      <CaseStudyHero study={study} />
      {study.audiences && <AudienceSplit audiences={study.audiences} />}
      <ProblemBlock problem={study.problem} />
      <ApproachBlock approach={study.approach} />
      <CodeBlock code={study.code} highlightedHtml={highlightedCode} />
      <FeaturesGrid features={study.features} />
      <CapabilitiesGrid capabilities={study.capabilities} />
      {study.personas && study.personas.length > 0 && (
        <PersonasTable personas={study.personas} />
      )}
      <RelatedCaseStudies studies={related} />
      <CTASection />
    </>
  );
}
