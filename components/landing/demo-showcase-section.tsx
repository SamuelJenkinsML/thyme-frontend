"use client";

import { motion } from "motion/react";
import { DemoVideo } from "./demo-video";

export function DemoShowcaseSection() {
  return (
    <section id="demo" className="py-28 relative bg-thyme-cream overflow-hidden">
      {/* Ambient brand-green glow behind the mockup (same trick as the hero orbs) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[420px] rounded-full bg-thyme-leaf/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-thyme-leaf mb-3 font-body text-[0.9rem] font-semibold tracking-[0.1em] uppercase">
            See it in action
          </span>
          <h2
            className="text-thyme-ink mb-4 font-display font-normal tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            From Python to fresh features, in one command
          </h2>
          <p className="text-thyme-ink/70 max-w-2xl mx-auto font-body text-[1.1rem] leading-[1.7]">
            Define a feature, ship it with{" "}
            <span className="font-mono text-thyme-ink">thyme commit</span>, and query
            live values in milliseconds — then explore lineage and monitoring in the app.
          </p>
        </motion.div>

        {/* Browser-chrome mockup framing the looping demo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-thyme-ink rounded-2xl overflow-hidden shadow-2xl shadow-thyme-ink/20 border border-thyme-ink/10">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-thyme-cream/10">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <div className="flex-1 flex justify-center">
                <span className="rounded-md bg-thyme-cream/[0.06] px-3 py-1 text-white/40 text-[0.72rem] font-[var(--font-space-grotesk)] tracking-wide">
                  app.realthyme.io
                </span>
              </div>
              {/* spacer balances the three dots so the URL sits centered */}
              <div className="w-[52px]" />
            </div>
            <DemoVideo />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
