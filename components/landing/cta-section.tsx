"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ThymeMascot } from "./thyme-mascot";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden bg-thyme-ink">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #f4efe2 1px, transparent 1px)",
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
          <span className="text-thyme-cream inline-flex items-center justify-center mb-8">
            <ThymeMascot size={128} />
          </span>

          <h2
            className="text-thyme-cream mb-4 font-display font-normal leading-[1.2] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            It&apos;s about <span className="text-thyme-pop italic">thyme</span> you upgraded
            <br />your feature platform
          </h2>
          <p className="text-thyme-cream/60 max-w-xl mb-10 font-body text-[1.1rem] leading-[1.7]">
            Join the teams shipping ML features faster with Thyme.
            Get up and running in minutes, not months.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:support@realthyme.io" className="group bg-thyme-cream text-thyme-ink px-8 py-4 rounded-full flex items-center gap-2 hover:bg-thyme-cream-2 transition-all shadow-lg shadow-black/20 font-body text-[1.05rem] font-semibold">
              Book a Demo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/docs">
              <button className="border border-thyme-cream/30 text-thyme-cream px-8 py-4 rounded-full hover:border-thyme-cream/60 hover:bg-thyme-cream/10 transition-all font-body text-[1.05rem] font-semibold">
                Read the Docs
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
