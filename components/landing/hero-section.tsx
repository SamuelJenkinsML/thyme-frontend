"use client";

import { motion } from "motion/react";
import { ThymeMascot } from "./thyme-mascot";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-thyme-cream">
      <div className="absolute top-20 right-[10%] w-[400px] h-[400px] rounded-full bg-thyme-leaf/10 blur-3xl" />
      <div className="absolute bottom-20 left-[5%] w-[300px] h-[300px] rounded-full bg-thyme-ink-2/8 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-thyme-ink/10 text-thyme-ink px-5 py-2 rounded-full mb-6 font-[var(--font-dm-sans)] text-[0.95rem] font-medium">
              <span className="w-2 h-2 bg-thyme-leaf rounded-full animate-pulse" />
              The real-time feature platform for machine learning
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-thyme-ink mb-6 font-display font-normal leading-[1.1] tracking-[-0.02em]"
            style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)" }}
          >
            Every feature,{" "}
            <span className="text-thyme-ink-2">right on</span>
            <br />
            <span className="relative inline-block">
              <span className="text-thyme-leaf">thyme</span>
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
                  stroke="#6B9B37"
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
            className="text-thyme-ink/75 max-w-xl mb-10 font-body text-[1.25rem] leading-[1.7]"
          >
            Define ML features once in Python. Thyme compiles them to a high-throughput Rust streaming engine — real-time serving, point-in-time correct training, zero skew between the two.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a href="mailto:support@realthyme.io" className="group bg-thyme-ink text-thyme-cream px-8 py-4 rounded-full flex items-center gap-2 hover:bg-thyme-ink-2 transition-all hover:shadow-lg hover:shadow-thyme-ink/25 font-body text-lg font-semibold">
              Book a Demo
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/docs" className="group border border-thyme-rule text-thyme-ink-2 px-8 py-4 rounded-full flex items-center gap-2 hover:border-thyme-ink/40 hover:bg-thyme-ink/5 transition-all font-body text-lg font-semibold">
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
            <circle cx="200" cy="200" r="180" fill="none" stroke="#2E5A1C" strokeWidth="1" strokeDasharray="8 12" opacity="0.3" />
          </svg>
          <svg viewBox="0 0 400 400" className="absolute w-[90%] h-[90%] animate-[spin_30s_linear_infinite_reverse]">
            <circle cx="200" cy="200" r="180" fill="none" stroke="#1f3d13" strokeWidth="1" strokeDasharray="4 16" opacity="0.2" />
          </svg>

          <span className="text-thyme-ink relative z-10 inline-flex items-center justify-center">
            <ThymeMascot size={480} />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
