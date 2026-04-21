"use client";

import { motion } from "motion/react";
import { Clock, Zap, Database, GitBranch, Shield, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Rust-Powered Engine",
    desc: "Features defined in Python are compiled to a high-throughput Rust streaming engine. Real-time aggregations with millisecond freshness.",
    color: "#FF9800",
  },
  {
    icon: Clock,
    title: "Time-Travel Queries",
    desc: "Point-in-time correct feature retrieval for training. Query any feature exactly as it was known at any past moment.",
    color: "#2196F3",
  },
  {
    icon: Database,
    title: "Zero Training/Serving Skew",
    desc: "One definition, two modes. The same feature logic runs in both streaming aggregation and offline point-in-time lookups — no divergence, no silent accuracy drops.",
    color: "#1f3d13",
  },
  {
    icon: GitBranch,
    title: "Datasets, Pipelines & Extractors",
    desc: "Composable abstractions: datasets define event streams, pipelines apply windowed aggregations, and extractors compute derived features on read.",
    color: "#9C27B0",
  },
  {
    icon: Shield,
    title: "Exactly-Once Semantics",
    desc: "Distributed leasing, checkpointing, and replay logs ensure exactly-once processing with no data loss or duplication.",
    color: "#E91E63",
  },
  {
    icon: BarChart3,
    title: "Declarative, Not Operational",
    desc: "No Kafka consumers to manage, no state stores to tune, no checkpoint recovery to handle. You own the feature logic — Thyme owns the infrastructure.",
    color: "#009688",
  },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
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
        style={{ backgroundColor: `${feature.color}15` }}
      >
        <feature.icon size={22} style={{ color: feature.color }} />
      </div>
      <h3 className="text-thyme-ink mb-3 font-[var(--font-space-grotesk)] text-[1.2rem] font-semibold">
        {feature.title}
      </h3>
      <p className="text-thyme-ink/70 font-body text-[0.95rem] leading-[1.7]">
        {feature.desc}
      </p>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 relative bg-thyme-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-thyme-leaf mb-3 font-body text-[0.9rem] font-semibold tracking-[0.1em] uppercase">
            Features
          </span>
          <h2
            className="text-thyme-ink mb-4 font-display font-normal tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Everything your ML pipeline needs
          </h2>
          <p className="text-thyme-ink/70 max-w-2xl mx-auto font-body text-[1.1rem] leading-[1.7]">
            From feature computation to serving, Thyme handles the entire lifecycle
            so your team can focus on building great models.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
