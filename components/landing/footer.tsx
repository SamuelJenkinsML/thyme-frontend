import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#111] text-white/60 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 32 32" className="w-7 h-7">
                <circle cx="16" cy="16" r="15" fill="#6B9B37" />
                <path d="M16 6 Q14 14 10 18 Q16 15 16 6Z" fill="#B5E655" />
                <path d="M16 6 Q18 14 22 18 Q16 15 16 6Z" fill="#8BC34A" />
              </svg>
              <span className="text-white font-[var(--font-space-grotesk)] text-[1.2rem] font-bold">thyme</span>
            </div>
            <p className="font-[var(--font-dm-sans)] text-[0.9rem] leading-[1.7]">
              The real-time feature platform for machine learning teams.
            </p>
          </div>
          {[
            { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Architecture", href: "#architecture" }, { label: "Performance", href: "#performance" }, { label: "Pricing", href: "#" }] },
            { title: "Resources", links: [{ label: "Documentation", href: "/catalog" }, { label: "API Reference", href: "#" }, { label: "Tutorials", href: "#" }, { label: "Blog", href: "#" }] },
            { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Contact", href: "#" }, { label: "Security", href: "#" }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white mb-4 font-[var(--font-space-grotesk)] text-[0.95rem] font-semibold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white transition-colors font-[var(--font-dm-sans)] text-[0.9rem]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-[var(--font-dm-sans)] text-[0.85rem]">&copy; 2026 Thyme. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors font-[var(--font-dm-sans)] text-[0.85rem]">Privacy</a>
            <a href="#" className="hover:text-white transition-colors font-[var(--font-dm-sans)] text-[0.85rem]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
