import Link from "next/link";
import { ThymeMascot } from "./thyme-mascot";

export function Footer() {
  return (
    <footer className="bg-thyme-ink text-thyme-cream/60 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4 text-thyme-cream">
              <ThymeMascot size={28} />
              <span className="text-thyme-cream font-[var(--font-space-grotesk)] text-[1.2rem] font-bold">thyme</span>
            </div>
            <p className="font-body text-[0.9rem] leading-[1.7]">
              The real-time feature platform for machine learning teams.
            </p>
          </div>
          {[
            { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Architecture", href: "#architecture" }, { label: "Performance", href: "#performance" }] },
            { title: "Resources", links: [{ label: "Documentation", href: "/docs" }] },
            { title: "Company", links: [{ label: "Contact", href: "mailto:sam@realthyme.io" }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-thyme-cream mb-4 font-[var(--font-space-grotesk)] text-[0.95rem] font-semibold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-thyme-cream transition-colors font-body text-[0.9rem]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-thyme-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-body text-[0.85rem]">&copy; 2026 Thyme. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
