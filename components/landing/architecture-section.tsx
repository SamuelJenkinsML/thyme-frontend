"use client";

import { motion } from "motion/react";
import { ReadWriteDiagram } from "@/components/diagrams/read-write-diagram";
import { ThymeMascot } from "./thyme-mascot";

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-28 bg-thyme-cream relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#1f3d13 1px, transparent 1px), linear-gradient(90deg, #1f3d13 1px, transparent 1px)",
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
          <span className="inline-block text-thyme-leaf mb-3 font-body text-[0.9rem] font-semibold tracking-[0.1em] uppercase">
            Architecture
          </span>
          <h2
            className="text-thyme-ink mb-4 font-display font-normal tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Two paths, one definition
          </h2>
          <p className="text-thyme-ink/70 max-w-2xl mx-auto font-body text-[1.1rem] leading-[1.7]">
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
          className="w-full"
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
          <div className="inline-flex items-center gap-2 bg-thyme-ink text-thyme-cream px-6 py-3 rounded-full shadow-lg shadow-thyme-ink/20">
            <span className="inline-flex items-center justify-center text-thyme-cream">
              <ThymeMascot size={20} />
            </span>
            <span className="font-[var(--font-space-grotesk)] text-[0.9rem] font-semibold">
              Powered by Thyme
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
