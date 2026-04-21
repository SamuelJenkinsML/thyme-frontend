"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { AlertTriangle, GitBranch, TrendingDown, ArrowRight } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Training/serving skew",
    desc: "Offline metrics look great. Production accuracy drops within weeks — not because the model is wrong, but because the features it sees in production are computed differently than the features it trained on.",
    color: "#E67E22",
  },
  {
    icon: GitBranch,
    title: "Diverging pipelines",
    desc: "Batch jobs (Spark, dbt) compute training features. Streaming systems (Flink, microservices) compute serving features. A bug fix in one doesn't propagate to the other. The logic drifts.",
    color: "#9C27B0",
  },
  {
    icon: TrendingDown,
    title: "Silent accuracy drops",
    desc: "Batch pipelines run on schedules — hourly, daily. A user's last transaction was 4 minutes ago, but your model sees yesterday's aggregate. You're serving predictions on stale data.",
    color: "#E91E63",
  },
];

function ProblemCard({ problem, index }: { problem: (typeof problems)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-thyme-cream-2 rounded-3xl p-8 border border-thyme-rule hover:border-thyme-ink/30 transition-all hover:shadow-xl hover:shadow-thyme-ink/5 cursor-default"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: `${problem.color}15` }}
      >
        <problem.icon size={22} style={{ color: problem.color }} />
      </div>
      <h3 className="text-thyme-ink mb-3 font-[var(--font-space-grotesk)] text-[1.2rem] font-semibold">
        {problem.title}
      </h3>
      <p className="text-thyme-ink/70 font-body text-[0.95rem] leading-[1.7]">
        {problem.desc}
      </p>
    </motion.div>
  );
}

export function ProblemSection() {
  return (
    <section id="problem" className="py-28 relative bg-thyme-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-thyme-leaf mb-3 font-body text-[0.9rem] font-semibold tracking-[0.1em] uppercase">
            The Problem
          </span>
          <h2
            className="text-thyme-ink mb-4 font-display font-normal tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            ML infrastructure is painful
          </h2>
          <p className="text-thyme-ink/70 max-w-2xl mx-auto font-body text-[1.1rem] leading-[1.7]">
            Every team building real-time ML hits the same wall. Training features and
            serving features drift apart, and accuracy quietly erodes in production.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <ProblemCard key={p.title} problem={p} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-thyme-ink font-body text-[1.15rem] leading-[1.7] mb-4">
            Thyme runs one pipeline. Training and serving read the same state — skew is
            structurally impossible, not a convention you enforce in review.
          </p>
          <Link
            href="/docs/why-thyme"
            className="inline-flex items-center gap-2 text-thyme-ink-2 hover:text-thyme-ink font-body text-[1rem] font-semibold transition-colors"
          >
            Read the full story
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
