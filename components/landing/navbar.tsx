"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { caseStudies } from "@/lib/case-studies";
import { SolutionsDropdown } from "./solutions-dropdown";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-[#e0e0e0]/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className="w-8 h-8">
            <circle cx="16" cy="16" r="15" fill="#6B9B37" />
            <path d="M16 6 Q14 14 10 18 Q16 15 16 6Z" fill="#B5E655" />
            <path d="M16 6 Q18 14 22 18 Q16 15 16 6Z" fill="#8BC34A" />
            <circle cx="16" cy="22" r="5" fill="none" stroke="white" strokeWidth="1.5" />
            <line x1="16" y1="22" x2="16" y2="19" stroke="white" strokeWidth="1.2" />
            <line x1="16" y1="22" x2="18.5" y2="22" stroke="white" strokeWidth="1.2" />
          </svg>
          <span className="font-[var(--font-space-grotesk)] tracking-tight text-[#2E5A1C] text-[1.4rem] font-bold">
            thyme
          </span>
        </Link>

        <div className="max-md:hidden flex items-center gap-8 font-[var(--font-dm-sans)]">
          <a href="/#features" className="text-[#555] hover:text-[#2E5A1C] transition-colors text-[0.95rem]">Features</a>
          <SolutionsDropdown />
          <a href="/#architecture" className="text-[#555] hover:text-[#2E5A1C] transition-colors text-[0.95rem]">Architecture</a>
          <a href="/#performance" className="text-[#555] hover:text-[#2E5A1C] transition-colors text-[0.95rem]">Performance</a>
          <Link href="/docs" className="text-[#555] hover:text-[#2E5A1C] transition-colors text-[0.95rem]">Docs</Link>
          <a href="https://github.com/SamuelJenkinsML/thyme-sdk" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#2E5A1C] transition-colors text-[0.95rem]">SDK</a>
          <a href="mailto:support@realthyme.io" className="bg-[#2E5A1C] text-white px-5 py-2 rounded-full hover:bg-[#3d7425] transition-colors text-[0.95rem]">
            Book a Demo
          </a>
        </div>

        <button className="hidden max-md:block text-[#2E5A1C]" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="hidden max-md:flex flex-col gap-4 bg-white/95 backdrop-blur-md border-b border-[#e0e0e0] px-6 pb-6 pt-2 font-[var(--font-dm-sans)]">
          <a href="/#features" className="text-[#555] py-2" onClick={() => setOpen(false)}>Features</a>
          <div className="py-2">
            <div className="text-[#6B9B37] text-[0.75rem] font-semibold tracking-[0.12em] uppercase mb-2">Solutions</div>
            <div className="flex flex-col gap-3 pl-1">
              {caseStudies.map((study) => (
                <Link
                  key={study.slug}
                  href={`/solutions/${study.slug}`}
                  className="text-[#555]"
                  onClick={() => setOpen(false)}
                >
                  {study.title}
                </Link>
              ))}
              <Link href="/solutions" className="text-[#6B9B37] font-semibold" onClick={() => setOpen(false)}>
                View all solutions →
              </Link>
            </div>
          </div>
          <a href="/#architecture" className="text-[#555] py-2" onClick={() => setOpen(false)}>Architecture</a>
          <a href="/#performance" className="text-[#555] py-2" onClick={() => setOpen(false)}>Performance</a>
          <Link href="/docs" className="text-[#555] py-2" onClick={() => setOpen(false)}>Docs</Link>
          <a href="https://github.com/SamuelJenkinsML/thyme-sdk" target="_blank" rel="noopener noreferrer" className="text-[#555] py-2" onClick={() => setOpen(false)}>SDK</a>
          <a href="mailto:support@realthyme.io" className="bg-[#2E5A1C] text-white px-5 py-3 rounded-full mt-2 text-center">Book a Demo</a>
        </div>
      )}
    </nav>
  );
}
