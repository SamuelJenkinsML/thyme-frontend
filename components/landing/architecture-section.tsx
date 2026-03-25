"use client";

import { motion } from "motion/react";

const layers = [
  { label: "Python SDK", color: "#9C27B0", items: ["Datasets", "Pipelines", "Featuresets", "Extractors", "Sources"] },
  { label: "Control Plane", color: "#6B9B37", items: ["Definition Service", "Graph Validation", "Blueprint Planning", "Job Scheduling"] },
  { label: "Data Plane", color: "#2196F3", items: ["Rust Streaming Engine", "Windowed Aggregations", "RocksDB State", "Kafka Transport"] },
  { label: "Query Layer", color: "#FF9800", items: ["Online Serving", "Point-in-Time Lookups", "Extractor DAG", "Feature API"] },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-28 bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#6B9B37] mb-3 font-[var(--font-dm-sans)] text-[0.9rem] font-semibold tracking-[0.1em] uppercase">
            Architecture
          </span>
          <h2
            className="text-[#1a1a1a] mb-4 font-[var(--font-space-grotesk)] font-bold"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Built for the modern ML stack
          </h2>
          <p className="text-[#777] max-w-2xl mx-auto font-[var(--font-dm-sans)] text-[1.1rem] leading-[1.7]">
            Define features in Python, commit them with the CLI, and Thyme compiles them
            through a four-layer architecture — from SDK to serving — all powered by Rust.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              <div className="flex items-stretch gap-4 rounded-2xl border border-[#eee] bg-white overflow-hidden hover:shadow-lg transition-shadow">
                <div
                  className="w-44 shrink-0 flex items-center justify-center py-6"
                  style={{ backgroundColor: `${layer.color}12` }}
                >
                  <span className="font-[var(--font-space-grotesk)] text-[0.95rem] font-semibold" style={{ color: layer.color }}>
                    {layer.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 py-6 px-4 flex-wrap">
                  {layer.items.map((item) => (
                    <span
                      key={item}
                      className="px-4 py-2 rounded-xl bg-[#f5f5f5] text-[#555] font-[var(--font-dm-sans)] text-[0.85rem]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {i < layers.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-px h-4 bg-[#ddd]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
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
