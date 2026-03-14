"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Search, Activity, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/catalog", label: "Catalog", icon: BookOpen },
  { href: "/inspect", label: "Inspect", icon: Search },
  { href: "/jobs", label: "Jobs", icon: Activity },
  { href: "/sources", label: "Sources", icon: Database },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-border bg-card px-3 py-4">
      <div className="mb-6 px-2">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          thyme
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1.5 px-2 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          definition-service :8080
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          query-server :8081
        </div>
      </div>
    </aside>
  );
}
