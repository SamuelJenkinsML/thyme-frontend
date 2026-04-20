"use client";

import { motion } from "motion/react";
import { ReadWriteDiagram } from "@/components/diagrams/read-write-diagram";

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-28 bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-[#6B9B37] mb-3 font-[var(--font-dm-sans)] text-[0.9rem] font-semibold tracking-[0.1em] uppercase">
            Architecture
          </span>
          <h2
            className="text-[#1a1a1a] mb-4 font-[var(--font-space-grotesk)] font-bold"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Two paths, one definition
          </h2>
          <p className="text-[#777] max-w-2xl mx-auto font-[var(--font-dm-sans)] text-[1.1rem] leading-[1.7]">
            A streaming write path keeps features fresh; a query-time read path composes
            them for your model. Both paths read the same event-time-keyed state, so
            training and serving cannot drift.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <ReadWriteDiagram />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-8"
        >
          <div className="inline-flex items-center gap-2 bg-[#2E5A1C] text-white px-6 py-3 rounded-full shadow-lg shadow-[#2E5A1C]/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 4 Q11 9 8 12 Q12 10 12 4Z" fill="#8BC34A" />
              <path d="M12 4 Q13 9 16 12 Q12 10 12 4Z" fill="#B5E655" />
            </svg>
            <span className="font-[var(--font-space-grotesk)] text-[0.9rem] font-semibold">
              Powered by Thyme
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
