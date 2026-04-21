"use client";

import { motion } from "motion/react";
import type { CaseStudy } from "@/lib/case-studies/types";

export function ProblemBlock({ problem }: { problem: CaseStudy["problem"] }) {
  return (
    <section className="py-24 bg-[#f4efe2]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <span className="inline-block text-[#2E5A1C] mb-3 font-[var(--font-dm-sans)] text-[0.85rem] font-semibold tracking-[0.1em] uppercase">
            The challenge
          </span>
          <h2
            className="text-[#1a1a1a] mb-6 font-[var(--font-space-grotesk)] font-bold leading-[1.2]"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
          >
            {problem.heading}
          </h2>
          <p className="text-[#555] font-[var(--font-dm-sans)] text-[1.1rem] leading-[1.8] max-w-3xl">
            {problem.body}
          </p>

          {problem.bullets && problem.bullets.length > 0 && (
            <ul className="mt-8 grid md:grid-cols-3 gap-4">
              {problem.bullets.map((bullet, i) => (
                <motion.li
                  key={bullet}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-[#eee] text-[#555] font-[var(--font-dm-sans)] text-[0.95rem] leading-[1.6]"
                >
                  {bullet}
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}
