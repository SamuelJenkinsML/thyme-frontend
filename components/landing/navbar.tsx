"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { caseStudies } from "@/lib/case-studies";
import { SolutionsDropdown } from "./solutions-dropdown";
import { ThymeMascot } from "./thyme-mascot";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-thyme-cream/80 border-b border-thyme-rule">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-thyme-ink">
          <ThymeMascot size={32} />
          <span className="font-[var(--font-space-grotesk)] tracking-tight text-thyme-ink text-[1.4rem] font-bold">
            thyme
          </span>
        </Link>

        <div className="max-md:hidden flex items-center gap-8 font-body">
          <a href="/#features" className="text-thyme-ink/70 hover:text-thyme-ink transition-colors text-[0.95rem]">Features</a>
          <SolutionsDropdown />
          <a href="/#architecture" className="text-thyme-ink/70 hover:text-thyme-ink transition-colors text-[0.95rem]">Architecture</a>
          <a href="/#performance" className="text-thyme-ink/70 hover:text-thyme-ink transition-colors text-[0.95rem]">Performance</a>
          <Link href="/docs" className="text-thyme-ink/70 hover:text-thyme-ink transition-colors text-[0.95rem]">Docs</Link>
          <a href="https://github.com/SamuelJenkinsML/thyme-sdk" target="_blank" rel="noopener noreferrer" className="text-thyme-ink/70 hover:text-thyme-ink transition-colors text-[0.95rem]">SDK</a>
          <a href="mailto:support@realthyme.io" className="bg-thyme-ink text-thyme-cream px-5 py-2 rounded-full hover:bg-thyme-ink-2 transition-colors text-[0.95rem]">
            Book a Demo
          </a>
        </div>

        <button className="hidden max-md:block text-thyme-ink" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="hidden max-md:flex flex-col gap-4 bg-thyme-cream/95 backdrop-blur-md border-b border-thyme-rule px-6 pb-6 pt-2 font-body">
          <a href="/#features" className="text-thyme-ink/70 py-2" onClick={() => setOpen(false)}>Features</a>
          <div className="py-2">
            <div className="text-thyme-leaf text-[0.75rem] font-semibold tracking-[0.12em] uppercase mb-2">Solutions</div>
            <div className="flex flex-col gap-3 pl-1">
              {caseStudies.map((study) => (
                <Link
                  key={study.slug}
                  href={`/solutions/${study.slug}`}
                  className="text-thyme-ink/70"
                  onClick={() => setOpen(false)}
                >
                  {study.title}
                </Link>
              ))}
              <Link href="/solutions" className="text-thyme-ink-2 font-semibold" onClick={() => setOpen(false)}>
                View all solutions →
              </Link>
            </div>
          </div>
          <a href="/#architecture" className="text-thyme-ink/70 py-2" onClick={() => setOpen(false)}>Architecture</a>
          <a href="/#performance" className="text-thyme-ink/70 py-2" onClick={() => setOpen(false)}>Performance</a>
          <Link href="/docs" className="text-thyme-ink/70 py-2" onClick={() => setOpen(false)}>Docs</Link>
          <a href="https://github.com/SamuelJenkinsML/thyme-sdk" target="_blank" rel="noopener noreferrer" className="text-thyme-ink/70 py-2" onClick={() => setOpen(false)}>SDK</a>
          <a href="mailto:support@realthyme.io" className="bg-thyme-ink text-thyme-cream px-5 py-3 rounded-full mt-2 text-center">Book a Demo</a>
        </div>
      )}
    </nav>
  );
}
