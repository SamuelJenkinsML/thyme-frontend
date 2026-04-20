"use client";

import { motion } from "motion/react";
import type { CaseStudy } from "@/lib/case-studies/types";

export function CapabilitiesGrid({
  capabilities,
}: {
  capabilities: CaseStudy["capabilities"];
}) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-12 max-w-3xl"
        >
          <span className="inline-block text-[#6B9B37] mb-3 font-[var(--font-dm-sans)] text-[0.85rem] font-semibold tracking-[0.1em] uppercase">
            At a glance
          </span>
          <h2
            className="text-[#1a1a1a] font-[var(--font-space-grotesk)] font-bold leading-[1.2]"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
          >
            What's in the pipeline
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-[#fafcf7] border border-[#e9f2d9] rounded-2xl p-6"
            >
              <div className="text-[#2E5A1C] font-[var(--font-space-grotesk)] text-[1.25rem] font-bold leading-tight">
                {c.value}
              </div>
              <div className="text-[#777] font-[var(--font-dm-sans)] text-[0.9rem] mt-2">
                {c.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
