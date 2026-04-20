"use client";

import { motion } from "motion/react";
import type { CaseStudy } from "@/lib/case-studies/types";

export function CodeBlock({
  code,
  highlightedHtml,
}: {
  code: CaseStudy["code"];
  highlightedHtml?: string;
}) {
  return (
    <section className="py-24 bg-[#0f2a1f]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-8"
        >
          <span className="inline-block text-[#8BC34A] mb-3 font-[var(--font-dm-sans)] text-[0.85rem] font-semibold tracking-[0.1em] uppercase">
            The definition
          </span>
          <h2
            className="text-white font-[var(--font-space-grotesk)] font-bold leading-[1.2]"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
          >
            One file. Python in, Rust out.
          </h2>
          {code.caption && (
            <p className="text-white/60 mt-3 font-[var(--font-dm-sans)] text-[1rem] leading-[1.7]">
              {code.caption}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.1 }}
          className="bg-[#0a1a12] rounded-2xl overflow-hidden shadow-2xl border border-white/5"
        >
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-white/40 text-[0.75rem] font-mono">
              {code.filename}
            </span>
          </div>
          {highlightedHtml ? (
            <div
              className="shiki-wrapper text-[0.85rem] leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <pre className="p-6 text-[0.85rem] overflow-x-auto font-mono leading-[1.7] text-white/90">
              <code>{code.source}</code>
            </pre>
          )}
        </motion.div>
      </div>
    </section>
  );
}
