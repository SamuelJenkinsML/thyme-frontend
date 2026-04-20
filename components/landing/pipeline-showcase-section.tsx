"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

const items = [
  {
    title: "Built-in streaming & windowed aggregations",
    body: "Time-windowed aggregations (1m, 24h, 7d) run on a continuous Rust streaming engine. Values are updated within milliseconds of new events arriving - a kappa based architecture that is constantly streaming fresh data.",
  },
  {
    title: "Point-in-time queries for training",
    body: "The same feature definition powers offline point-in-time lookups. Train on historically accurate features without maintaining a separate batch pipeline - the online and offline paths are guaranteed consistent.",
  },
  {
    title: "Declare your features, not your infrastructure",
    body: "Declare what a feature is, not how to run it. Thyme handles Kafka consumers, state stores, checkpointing, and replay. You own the feature logic and Thyme owns the infrastructure.",
  },
];

function AccordionRow({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: (typeof items)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="border-b border-white/10"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-white font-[var(--font-space-grotesk)] text-[1.15rem] font-semibold group-hover:text-[#8BC34A] transition-colors">
          {item.title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white/60 group-hover:text-[#8BC34A] group-hover:border-[#8BC34A]/40 transition-colors"
        >
          <Plus size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-10 text-white/70 font-[var(--font-dm-sans)] text-[0.95rem] leading-[1.7]">
              {item.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PipelineShowcaseSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="pipelines" className="py-28 bg-[#0f2a1f] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-[#8BC34A] mb-4 font-[var(--font-dm-sans)] text-[0.9rem] font-semibold tracking-[0.1em] uppercase">
              Developer Experience
            </span>
            <h2
              className="text-white mb-4 font-[var(--font-space-grotesk)] font-bold"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
            >
              Define your features in idiomatic Python
            </h2>
            <p className="text-white/70 font-[var(--font-dm-sans)] text-[1.05rem] leading-[1.7] mb-8">
              Powerful{" "}
              <span className="text-[#8BC34A]">data engineering workflows</span>,
              without the infrastructure headaches. Powered by Rust.
            </p>

            <div className="border-t border-white/10">
              {items.map((item, i) => (
                <AccordionRow
                  key={item.title}
                  item={item}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-[#0a1a12] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-white/40 text-[0.75rem] font-mono">
                  features.py
                </span>
              </div>
              <pre className="p-6 text-[0.85rem] overflow-x-auto font-mono leading-[1.8]">
                <code>
                  <span className="text-white/30 select-none pr-4">1</span>
                  <span className="text-[#c792ea]">from</span>
                  <span className="text-white/90"> thyme </span>
                  <span className="text-[#c792ea]">import</span>
                  <span className="text-white/90"> *{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">2</span>
                  <span className="text-white/90">{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">3</span>
                  <span className="text-[#ffcb6b]">@source</span>
                  <span className="text-white/90">(name=</span>
                  <span className="text-[#c3e88d]">&quot;transactions&quot;</span>
                  <span className="text-white/90">){"\n"}</span>
                  <span className="text-white/30 select-none pr-4">4</span>
                  <span className="text-[#c792ea]">class</span>
                  <span className="text-[#ffcb6b]"> Transaction</span>
                  <span className="text-white/90">:{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">5</span>
                  <span className="text-white/90">{"    "}user_id: </span>
                  <span className="text-[#ffcb6b]">str</span>
                  <span className="text-white/90"> = field(key=</span>
                  <span className="text-[#f78c6c]">True</span>
                  <span className="text-white/90">){"\n"}</span>
                  <span className="text-white/30 select-none pr-4">6</span>
                  <span className="text-white/90">{"    "}ts: </span>
                  <span className="text-[#ffcb6b]">datetime</span>
                  <span className="text-white/90"> = field(timestamp=</span>
                  <span className="text-[#f78c6c]">True</span>
                  <span className="text-white/90">){"\n"}</span>
                  <span className="text-white/30 select-none pr-4">7</span>
                  <span className="text-white/90">{"    "}amount: </span>
                  <span className="text-[#ffcb6b]">float</span>
                  <span className="text-white/90">{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">8</span>
                  <span className="text-white/90">{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">9</span>
                  <span className="text-[#ffcb6b]">@dataset</span>
                  <span className="text-white/90">(index=</span>
                  <span className="text-[#f78c6c]">True</span>
                  <span className="text-white/90">){"\n"}</span>
                  <span className="text-white/30 select-none pr-4">10</span>
                  <span className="text-[#c792ea]">class</span>
                  <span className="text-[#ffcb6b]"> UserSpend</span>
                  <span className="text-white/90">:{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">11</span>
                  <span className="text-white/90">{"    "}user_id: </span>
                  <span className="text-[#ffcb6b]">str</span>
                  <span className="text-white/90"> = field(key=</span>
                  <span className="text-[#f78c6c]">True</span>
                  <span className="text-white/90">){"\n"}</span>
                  <span className="text-white/30 select-none pr-4">12</span>
                  <span className="text-white/90">{"    "}avg_24h: </span>
                  <span className="text-[#ffcb6b]">float</span>
                  <span className="text-white/90">{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">13</span>
                  <span className="text-white/90">{"    "}avg_7d: </span>
                  <span className="text-[#ffcb6b]">float</span>
                  <span className="text-white/90">{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">14</span>
                  <span className="text-white/90">{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">15</span>
                  <span className="text-white/90">{"    "}</span>
                  <span className="text-[#ffcb6b]">@pipeline</span>
                  <span className="text-white/90">(version=</span>
                  <span className="text-[#f78c6c]">1</span>
                  <span className="text-white/90">){"\n"}</span>
                  <span className="text-white/30 select-none pr-4">16</span>
                  <span className="text-white/90">{"    "}</span>
                  <span className="text-[#ffcb6b]">@inputs</span>
                  <span className="text-white/90">(Transaction){"\n"}</span>
                  <span className="text-white/30 select-none pr-4">17</span>
                  <span className="text-white/90">{"    "}</span>
                  <span className="text-[#c792ea]">def</span>
                  <span className="text-[#82aaff]"> compute</span>
                  <span className="text-white/90">(cls, t):{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">18</span>
                  <span className="text-white/90">{"        "}</span>
                  <span className="text-[#c792ea]">return</span>
                  <span className="text-white/90"> t.groupby(</span>
                  <span className="text-[#c3e88d]">&quot;user_id&quot;</span>
                  <span className="text-white/90">).aggregate({"\n"}</span>
                  <span className="text-white/30 select-none pr-4">19</span>
                  <span className="text-white/90">{"            "}avg_24h=</span>
                  <span className="text-[#82aaff]">Avg</span>
                  <span className="text-white/90">(of=</span>
                  <span className="text-[#c3e88d]">&quot;amount&quot;</span>
                  <span className="text-white/90">, window=</span>
                  <span className="text-[#c3e88d]">&quot;24h&quot;</span>
                  <span className="text-white/90">),{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">20</span>
                  <span className="text-white/90">{"            "}avg_7d=</span>
                  <span className="text-[#82aaff]">Avg</span>
                  <span className="text-white/90">(of=</span>
                  <span className="text-[#c3e88d]">&quot;amount&quot;</span>
                  <span className="text-white/90">, window=</span>
                  <span className="text-[#c3e88d]">&quot;7d&quot;</span>
                  <span className="text-white/90">),{"\n"}</span>
                  <span className="text-white/30 select-none pr-4">21</span>
                  <span className="text-white/90">{"        "}){"\n"}</span>
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
