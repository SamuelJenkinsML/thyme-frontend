"use client";

import { motion } from "motion/react";
import { ThymeMascot } from "./thyme-mascot";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f7e6] via-white to-[#e8f5e0] z-0" />

      <div className="absolute top-20 right-[10%] w-[400px] h-[400px] rounded-full bg-[#8BC34A]/10 blur-3xl" />
      <div className="absolute bottom-20 left-[5%] w-[300px] h-[300px] rounded-full bg-[#6B9B37]/8 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#2E5A1C]/10 text-[#2E5A1C] px-5 py-2 rounded-full mb-6 font-[var(--font-dm-sans)] text-[0.95rem] font-medium">
              <span className="w-2 h-2 bg-[#8BC34A] rounded-full animate-pulse" />
              Defined in Python. Computed in Rust.
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#1a1a1a] mb-6 font-[var(--font-space-grotesk)] font-bold leading-[1.1]"
            style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)" }}
          >
            Every feature,{" "}
            <span className="text-[#2E5A1C]">right on</span>
            <br />
            <span className="relative inline-block">
              <span className="text-[#6B9B37]">thyme</span>
              <motion.svg
                viewBox="0 0 200 12"
                className="absolute -bottom-2 left-0 w-full"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <motion.path
                  d="M 5 8 Q 50 2 100 6 Q 150 10 195 4"
                  fill="none"
                  stroke="#8BC34A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </motion.svg>
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#666] max-w-xl mb-10 font-[var(--font-dm-sans)] text-[1.25rem] leading-[1.7]"
          >
            Thyme is the streaming feature platform that serves features ultra-fresh. Define features once in Python - Thyme compiles them to a
            high-throughput Rust engine for real-time serving and point-in-time
            correct offline training. 
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a href="mailto:support@realthyme.io" className="group bg-[#2E5A1C] text-white px-8 py-4 rounded-full flex items-center gap-2 hover:bg-[#3d7425] transition-all hover:shadow-lg hover:shadow-[#2E5A1C]/25 font-[var(--font-dm-sans)] text-lg font-semibold">
              Book a Demo
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/docs" className="group border-2 border-[#2E5A1C]/20 text-[#2E5A1C] px-8 py-4 rounded-full flex items-center gap-2 hover:border-[#2E5A1C]/40 hover:bg-[#2E5A1C]/5 transition-all font-[var(--font-dm-sans)] text-lg font-semibold">
              <BookOpen size={16} />
              Read the Docs
            </Link>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <svg viewBox="0 0 400 400" className="absolute w-[110%] h-[110%] animate-[spin_20s_linear_infinite]">
            <circle cx="200" cy="200" r="180" fill="none" stroke="#8BC34A" strokeWidth="1" strokeDasharray="8 12" opacity="0.3" />
          </svg>
          <svg viewBox="0 0 400 400" className="absolute w-[90%] h-[90%] animate-[spin_30s_linear_infinite_reverse]">
            <circle cx="200" cy="200" r="180" fill="none" stroke="#6B9B37" strokeWidth="1" strokeDasharray="4 16" opacity="0.2" />
          </svg>

          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-8 right-4 bg-white shadow-lg shadow-black/5 rounded-2xl px-4 py-3 flex items-center gap-2 z-20"
          >
            <div className="w-8 h-8 rounded-full bg-[#8BC34A]/20 flex items-center justify-center text-[#2E5A1C] text-[0.75rem] font-bold">⚡</div>
            <div>
              <div className="text-[0.7rem] text-[#999] font-[var(--font-dm-sans)]">P99 Latency</div>
              <div className="text-[#1a1a1a] text-[0.85rem] font-[var(--font-space-grotesk)] font-bold">&lt;5ms</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="absolute bottom-16 left-0 bg-white shadow-lg shadow-black/5 rounded-2xl px-4 py-3 flex items-center gap-2 z-20"
          >
            <div className="w-8 h-8 rounded-full bg-[#6B9B37]/20 flex items-center justify-center text-[0.75rem]">🕐</div>
            <div>
              <div className="text-[0.7rem] text-[#999] font-[var(--font-dm-sans)]">Feature Freshness</div>
              <div className="text-[#1a1a1a] text-[0.85rem] font-[var(--font-space-grotesk)] font-bold">Real-time</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [-3, 7, -3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 right-0 bg-white shadow-lg shadow-black/5 rounded-2xl px-4 py-3 z-20"
          >
            <div className="text-[0.7rem] text-[#999] font-[var(--font-dm-sans)]">Training/Serving</div>
            <div className="text-[#1a1a1a] text-[0.85rem] font-[var(--font-space-grotesk)] font-bold">Zero Skew</div>
          </motion.div>

          <ThymeMascot className="w-80 h-96 relative z-10" />
        </motion.div>
      </div>
    </section>
  );
}
