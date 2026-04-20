"use client";

import { motion } from "motion/react";
import type { CaseStudy } from "@/lib/case-studies/types";

export function FeaturesGrid({
  features,
}: {
  features: CaseStudy["features"];
}) {
  return (
    <section className="py-24 bg-[#fafcf7]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-12 max-w-3xl"
        >
          <span className="inline-block text-[#6B9B37] mb-3 font-[var(--font-dm-sans)] text-[0.85rem] font-semibold tracking-[0.1em] uppercase">
            What it uses
          </span>
          <h2
            className="text-[#1a1a1a] font-[var(--font-space-grotesk)] font-bold leading-[1.2]"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
          >
            Operators and primitives
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-[#eee] hover:border-[#8BC34A]/40 transition-colors"
            >
              <code className="inline-block bg-[#0f2a1f] text-[#8BC34A] px-3 py-1 rounded-md font-mono text-[0.85rem] mb-3">
                {feature.name}
              </code>
              <p className="text-[#555] font-[var(--font-dm-sans)] text-[0.95rem] leading-[1.7]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
