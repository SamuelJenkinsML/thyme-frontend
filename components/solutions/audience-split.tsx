"use client";

import { motion } from "motion/react";
import { Code2, LineChart } from "lucide-react";
import type { CaseStudy } from "@/lib/case-studies/types";

export function AudienceSplit({ audiences }: { audiences: NonNullable<CaseStudy["audiences"]> }) {
  return (
    <section className="py-16 bg-[#f4efe2] relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-[#e9f2d9] rounded-2xl p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#1f3d13]/10 flex items-center justify-center">
                <Code2 size={18} className="text-[#1f3d13]" />
              </div>
              <span className="font-[var(--font-dm-sans)] text-[0.8rem] font-semibold tracking-[0.1em] uppercase text-[#1f3d13]">
                For the ML engineer
              </span>
            </div>
            <p className="text-[#333] font-[var(--font-dm-sans)] text-[1rem] leading-[1.7]">
              {audiences.forEngineer}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="bg-white border border-[#e9f2d9] rounded-2xl p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#6B9B37]/10 flex items-center justify-center">
                <LineChart size={18} className="text-[#2E5A1C]" />
              </div>
              <span className="font-[var(--font-dm-sans)] text-[0.8rem] font-semibold tracking-[0.1em] uppercase text-[#2E5A1C]">
                For the business
              </span>
            </div>
            <p className="text-[#333] font-[var(--font-dm-sans)] text-[1rem] leading-[1.7]">
              {audiences.forBusiness}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
