"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { caseStudies } from "@/lib/case-studies";

export function SolutionsDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-thyme-ink/70 hover:text-thyme-ink transition-colors text-[0.95rem]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Solutions
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[380px] bg-thyme-cream/95 backdrop-blur-md rounded-2xl border border-thyme-rule shadow-xl shadow-thyme-ink/10 p-3 z-50"
          >
            <div className="px-2 pb-2 pt-1 mb-1 border-b border-thyme-rule">
              <span className="text-thyme-leaf font-body text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
                By use case
              </span>
            </div>
            {caseStudies.map((study) => {
              const Icon = study.icon;
              return (
                <Link
                  key={study.slug}
                  href={`/solutions/${study.slug}`}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-thyme-cream-2 transition-colors group"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${study.accentColor}15` }}
                  >
                    <Icon size={16} style={{ color: study.accentColor }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-thyme-ink font-[var(--font-space-grotesk)] text-[0.95rem] font-semibold group-hover:text-thyme-ink-2 transition-colors leading-tight">
                      {study.title}
                    </div>
                    <div className="text-thyme-ink/60 font-body text-[0.8rem] leading-[1.5] mt-0.5">
                      {study.category}
                    </div>
                  </div>
                </Link>
              );
            })}
            <Link
              href="/solutions"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-3 mt-1 border-t border-thyme-rule text-thyme-ink-2 hover:text-thyme-ink font-body text-[0.9rem] font-semibold transition-colors"
            >
              View all solutions
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
