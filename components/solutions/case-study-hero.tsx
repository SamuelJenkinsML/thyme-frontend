"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/lib/case-studies/types";

export function CaseStudyHero({ study }: { study: CaseStudy }) {
  const Icon = study.icon;
  return (
    <section className="pt-36 pb-20 bg-white relative overflow-hidden">
      {/* Aurora backdrop */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none rounded-full blur-3xl"
        style={{
          backgroundColor: study.accentColor,
          width: "480px",
          height: "480px",
          top: "-120px",
          left: "-140px",
        }}
        initial={{ opacity: 0.15, scale: 0.9 }}
        animate={{ opacity: [0.12, 0.22, 0.12], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute pointer-events-none rounded-full blur-3xl"
        style={{
          backgroundColor: "#8BC34A",
          width: "360px",
          height: "360px",
          top: "40px",
          right: "-120px",
        }}
        initial={{ opacity: 0.1, scale: 1 }}
        animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="relative">
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-2xl blur-xl"
              style={{ backgroundColor: study.accentColor }}
              animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.95, 1.15, 0.95] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${study.accentColor}15` }}
            >
              <Icon size={22} style={{ color: study.accentColor }} />
            </div>
          </div>
          <span
            className="font-[var(--font-dm-sans)] text-[0.85rem] font-semibold tracking-[0.1em] uppercase"
            style={{ color: study.accentColor }}
          >
            {study.category}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-[#1a1a1a] font-[var(--font-space-grotesk)] font-bold leading-[1.15] mb-6"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}
        >
          {study.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#555] font-[var(--font-dm-sans)] text-[1.2rem] leading-[1.7] mb-10 max-w-3xl"
        >
          {study.summary}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {study.heroMetrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-[#fafcf7] border border-[#e9f2d9] rounded-2xl px-5 py-3"
            >
              <div className="text-[#2E5A1C] font-[var(--font-space-grotesk)] text-[1.4rem] font-bold leading-none">
                {metric.value}
              </div>
              <div className="text-[#777] font-[var(--font-dm-sans)] text-[0.8rem] mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="mailto:support@realthyme.io"
            className="group bg-[#2E5A1C] text-white px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-[#3d7425] transition-all font-[var(--font-dm-sans)] text-[1rem] font-semibold"
          >
            Book a demo
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
