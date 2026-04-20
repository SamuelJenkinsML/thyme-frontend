"use client";

import { motion } from "motion/react";
import type { CaseStudy } from "@/lib/case-studies/types";

export function PersonasTable({
  personas,
}: {
  personas: NonNullable<CaseStudy["personas"]>;
}) {
  return (
    <section className="py-24 bg-[#fafcf7]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-10 max-w-3xl"
        >
          <span className="inline-block text-[#6B9B37] mb-3 font-[var(--font-dm-sans)] text-[0.85rem] font-semibold tracking-[0.1em] uppercase">
            Smoke test personas
          </span>
          <h2
            className="text-[#1a1a1a] font-[var(--font-space-grotesk)] font-bold leading-[1.2]"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
          >
            What the features look like in production
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#eee] overflow-hidden"
        >
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fafcf7] border-b border-[#eee]">
                <th className="px-6 py-4 font-[var(--font-space-grotesk)] text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[#555]">
                  Entity
                </th>
                <th className="px-6 py-4 font-[var(--font-space-grotesk)] text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[#555]">
                  Behavior
                </th>
                <th className="px-6 py-4 font-[var(--font-space-grotesk)] text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[#555]">
                  Expected features
                </th>
              </tr>
            </thead>
            <tbody>
              {personas.map((p, i) => (
                <tr
                  key={p.entity}
                  className={
                    i < personas.length - 1 ? "border-b border-[#f4f4f4]" : ""
                  }
                >
                  <td className="px-6 py-4 font-mono text-[0.9rem] text-[#2E5A1C]">
                    {p.entity}
                  </td>
                  <td className="px-6 py-4 font-[var(--font-dm-sans)] text-[0.95rem] text-[#555]">
                    {p.behavior}
                  </td>
                  <td className="px-6 py-4 font-[var(--font-dm-sans)] text-[0.95rem] text-[#1a1a1a]">
                    {p.expected}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
