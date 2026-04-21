"use client";

import { motion } from "motion/react";
import type { CaseStudy } from "@/lib/case-studies/types";
import { CaseStudyCard } from "./case-study-card";

export function RelatedCaseStudies({ studies }: { studies: CaseStudy[] }) {
  if (studies.length === 0) return null;
  return (
    <section className="py-24 bg-white border-t border-[#eee]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-10"
        >
          <span className="inline-block text-[#2E5A1C] mb-3 font-[var(--font-dm-sans)] text-[0.85rem] font-semibold tracking-[0.1em] uppercase">
            Keep reading
          </span>
          <h2
            className="text-[#1a1a1a] font-[var(--font-space-grotesk)] font-bold leading-[1.2]"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}
          >
            More ways teams use Thyme
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {studies.map((study, i) => (
            <CaseStudyCard key={study.slug} study={study} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
