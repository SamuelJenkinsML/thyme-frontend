"use client";

import { motion } from "motion/react";
import type { CaseStudy } from "@/lib/case-studies/types";
import { ArchitectureDiagram } from "./architecture-diagram";

export function ApproachBlock({ approach }: { approach: CaseStudy["approach"] }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <span className="inline-block text-[#2E5A1C] mb-3 font-[var(--font-dm-sans)] text-[0.85rem] font-semibold tracking-[0.1em] uppercase">
              The approach
            </span>
            <h2
              className="text-[#1a1a1a] mb-6 font-[var(--font-space-grotesk)] font-bold leading-[1.2]"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            >
              {approach.heading}
            </h2>
            <p className="text-[#555] font-[var(--font-dm-sans)] text-[1.05rem] leading-[1.8]">
              {approach.body}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.15 }}
          >
            <ArchitectureDiagram graph={approach.diagram} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
