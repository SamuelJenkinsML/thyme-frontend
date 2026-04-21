"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/lib/case-studies/types";

export function CaseStudyCard({
  study,
  index = 0,
}: {
  study: CaseStudy;
  index?: number;
}) {
  const Icon = study.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/solutions/${study.slug}`}
        className="group relative flex flex-col h-full bg-white rounded-3xl p-8 border border-[#eee] hover:border-[#6B9B37]/40 transition-all hover:shadow-xl hover:shadow-[#6B9B37]/5"
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${study.accentColor}15` }}
          >
            <Icon size={22} style={{ color: study.accentColor }} />
          </div>
          <span
            className="font-[var(--font-dm-sans)] text-[0.8rem] font-semibold tracking-[0.1em] uppercase"
            style={{ color: study.accentColor }}
          >
            {study.category}
          </span>
        </div>

        <h3 className="text-[#1a1a1a] mb-3 font-[var(--font-space-grotesk)] text-[1.35rem] font-semibold leading-[1.3]">
          {study.title}
        </h3>
        <p className="text-[#777] font-[var(--font-dm-sans)] text-[0.95rem] leading-[1.7] mb-6">
          {study.tagline}
        </p>

        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {study.heroMetrics.map((metric) => (
            <span
              key={metric.label}
              className="inline-flex items-baseline gap-1.5 bg-[#f4efe2] border border-[#e9f2d9] rounded-full px-3 py-1.5 font-[var(--font-dm-sans)] text-[0.8rem]"
            >
              <span className="font-semibold text-[#1f3d13]">{metric.value}</span>
              <span className="text-[#777]">{metric.label}</span>
            </span>
          ))}
        </div>

        <span className="inline-flex items-center gap-2 text-[#2E5A1C] group-hover:text-[#1f3d13] font-[var(--font-dm-sans)] text-[0.95rem] font-semibold transition-colors">
          Read the case study
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </span>
      </Link>
    </motion.div>
  );
}
