"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, BookOpen, Search, Activity, Database, Monitor, LogOut, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/catalog", label: "Catalog", icon: BookOpen },
  { href: "/inspect", label: "Inspect", icon: Search },
  { href: "/jobs", label: "Jobs", icon: Activity },
  { href: "/query-runs", label: "Query Runs", icon: Play },
  { href: "/sources", label: "Sources", icon: Database },
  { href: "/monitoring", label: "Monitoring", icon: Monitor },
];

interface ServiceHealth {
  name: string;
  port: number;
  url: string;
  healthy: boolean | null;
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [services, setServices] = useState<ServiceHealth[]>([
    { name: "definition-service", port: 8080, url: "/api/proxy/featuresets", healthy: null },
    { name: "query-server", port: 8081, url: "/api/proxy/features", healthy: null },
  ]);

  useEffect(() => {
    async function check() {
      const results = await Promise.all(
        services.map(async (svc) => {
          try {
            const res = await fetch(svc.url, { method: "HEAD" });
            return { ...svc, healthy: res.ok || res.status === 405 };
          } catch {
            return { ...svc, healthy: false };
          }
        })
      );
      setServices(results);
    }
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-border bg-card px-3 py-4">
      <div className="mb-6 px-2">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          thyme
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");
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
        {services.map((svc) => (
          <div key={svc.name} className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                svc.healthy === null
                  ? "bg-muted-foreground animate-pulse"
                  : svc.healthy
                    ? "bg-green-500"
                    : "bg-red-500"
              )}
            />
            {svc.name} :{svc.port}
          </div>
        ))}
      </div>

      {session?.user && (
        <div className="flex items-center gap-2 border-t border-border px-2 pt-3 mt-3">
          {session.user.image && (
            <img
              src={session.user.image}
              alt=""
              className="size-6 rounded-full"
            />
          )}
          <span className="truncate text-xs text-foreground">
            {session.user.name}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ml-auto cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
}
