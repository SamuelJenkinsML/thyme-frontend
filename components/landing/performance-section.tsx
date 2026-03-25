"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref}>
      <span
        className="font-[var(--font-space-grotesk)] font-bold text-[#2E5A1C]"
        style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
      >
        {prefix}{value}{suffix}
      </span>
    </div>
  );
}

const stats = [
  { value: 5, suffix: "ms", prefix: "<", label: "P99 Online Latency" },
  { value: 1, suffix: "", prefix: "", label: "Definition for Online & Offline" },
  { value: 0, suffix: "", prefix: "", label: "Training/Serving Skew" },
  { value: 3, suffix: "", prefix: "", label: "Commands to Deploy" },
];

export function PerformanceSection() {
  return (
    <section id="performance" className="py-28 bg-gradient-to-b from-[#f0f7e6] to-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#6B9B37] mb-3 font-[var(--font-dm-sans)] text-[0.9rem] font-semibold tracking-[0.1em] uppercase">
            Performance
          </span>
          <h2
            className="text-[#1a1a1a] mb-4 font-[var(--font-space-grotesk)] font-bold"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Built for simplicity and speed
          </h2>
          <p className="text-[#777] max-w-2xl mx-auto font-[var(--font-dm-sans)] text-[1.1rem] leading-[1.7]">
            Thyme compiles Python feature definitions to a Rust streaming engine.
            Low latency, zero skew, and a three-command deployment workflow.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center bg-white rounded-3xl p-8 border border-[#eee] hover:border-[#8BC34A]/40 transition-all hover:shadow-lg"
            >
              <AnimatedNumber target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <p className="text-[#777] mt-2 font-[var(--font-dm-sans)] text-[0.95rem]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-white/40 text-[0.75rem] font-mono">features.py</span>
            </div>
            <pre className="p-6 text-[0.85rem] overflow-x-auto font-mono leading-[1.8]">
              <code>
                <span className="text-[#c792ea]">from</span>
                <span className="text-[#eee]"> thyme </span>
                <span className="text-[#c792ea]">import</span>
                <span className="text-[#eee]"> *{"\n"}</span>
                <span className="text-[#eee]">{"\n"}</span>
                <span className="text-[#ffcb6b]">@dataset</span>
                <span className="text-[#eee]">(index=True){"\n"}</span>
                <span className="text-[#c792ea]">class</span>
                <span className="text-[#ffcb6b]"> UserStats</span>
                <span className="text-[#eee]">:{"\n"}</span>
                <span className="text-[#eee]">{"    "}user_id: str = field(key=True){"\n"}</span>
                <span className="text-[#eee]">{"    "}ts: datetime = field(timestamp=True){"\n"}</span>
                <span className="text-[#eee]">{"    "}avg_spend_7d: </span>
                <span className="text-[#ffcb6b]">float</span>
                <span className="text-[#eee]">{"\n"}</span>
                <span className="text-[#eee]">{"\n"}</span>
                <span className="text-[#eee]">{"    "}</span>
                <span className="text-[#ffcb6b]">@pipeline</span>
                <span className="text-[#eee]">(version=</span>
                <span className="text-[#f78c6c]">1</span>
                <span className="text-[#eee]">){"\n"}</span>
                <span className="text-[#eee]">{"    "}</span>
                <span className="text-[#ffcb6b]">@inputs</span>
                <span className="text-[#eee]">(Transaction){"\n"}</span>
                <span className="text-[#eee]">{"    "}</span>
                <span className="text-[#c792ea]">def</span>
                <span className="text-[#82aaff]"> compute</span>
                <span className="text-[#eee]">(cls, t):{"\n"}</span>
                <span className="text-[#eee]">{"        "}</span>
                <span className="text-[#c792ea]">return</span>
                <span className="text-[#eee]"> t.groupby(</span>
                <span className="text-[#c3e88d]">&quot;user_id&quot;</span>
                <span className="text-[#eee]">).aggregate({"\n"}</span>
                <span className="text-[#eee]">{"            "}avg_spend_7d=</span>
                <span className="text-[#82aaff]">Avg</span>
                <span className="text-[#eee]">(of=</span>
                <span className="text-[#c3e88d]">&quot;amount&quot;</span>
                <span className="text-[#eee]">, window=</span>
                <span className="text-[#c3e88d]">&quot;7d&quot;</span>
                <span className="text-[#eee]">){"\n"}</span>
                <span className="text-[#eee]">{"        "}){"\n"}</span>
              </code>
            </pre>
          </div>
          <p className="text-center text-[#999] mt-4 font-[var(--font-dm-sans)] text-[0.85rem]">
            Define features in Python. Deploy with thyme commit. Serve in milliseconds.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
