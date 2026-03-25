"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ThymeMascot } from "./thyme-mascot";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E5A1C] to-[#1a3a10]" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <ThymeMascot className="w-32 h-40 mb-8" />

          <h2
            className="text-white mb-4 font-[var(--font-space-grotesk)] font-bold leading-[1.2]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            It&apos;s about <span className="text-[#B5E655]">thyme</span> you upgraded
            <br />your feature platform
          </h2>
          <p className="text-white/60 max-w-xl mb-10 font-[var(--font-dm-sans)] text-[1.1rem] leading-[1.7]">
            Join the teams shipping ML features faster with Thyme.
            Get up and running in minutes, not months.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="group bg-white text-[#2E5A1C] px-8 py-4 rounded-full flex items-center gap-2 hover:bg-[#f0f7e6] transition-all shadow-lg shadow-black/20 font-[var(--font-dm-sans)] text-[1.05rem] font-semibold">
              Book a Demo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/docs">
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full hover:border-white/60 hover:bg-white/10 transition-all font-[var(--font-dm-sans)] text-[1.05rem] font-semibold">
                Read the Docs
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
