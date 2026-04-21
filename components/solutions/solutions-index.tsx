"use client";

import { CaseStudyCard } from "./case-study-card";
import { caseStudies } from "@/lib/case-studies";

export function SolutionsIndex() {
  const [featured, ...rest] = caseStudies;

  return (
    <>
      <section className="pt-36 pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <span className="inline-block text-[#2E5A1C] mb-4 font-[var(--font-dm-sans)] text-[0.9rem] font-semibold tracking-[0.1em] uppercase">
            By use case
          </span>
          <h1
            className="text-[#1a1a1a] font-[var(--font-space-grotesk)] font-bold leading-[1.15] mb-5"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
          >
            Built for real-time ML, wherever features live
          </h1>
          <p className="text-[#555] font-[var(--font-dm-sans)] text-[1.15rem] leading-[1.75] max-w-3xl">
            Teams ship Thyme into fraud scoring, marketplace trust &amp; safety,
            personalization, and more. Each case study is a production-validated
            walkthrough: the problem, the pipeline definition, and the numbers.
          </p>
        </div>
      </section>

      <section className="pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-1 gap-6 mb-6">
            <CaseStudyCard study={featured} index={0} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((study, i) => (
              <CaseStudyCard key={study.slug} study={study} index={i + 1} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
