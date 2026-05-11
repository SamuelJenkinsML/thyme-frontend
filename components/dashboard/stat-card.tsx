import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatColor = "emerald" | "purple" | "indigo" | "green" | "amber";

const COLOR_CLASSES: Record<StatColor, { iconBg: string; iconFg: string; glow: string }> = {
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconFg: "text-emerald-400",
    glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.10)]",
  },
  purple: {
    iconBg: "bg-purple-500/10",
    iconFg: "text-purple-400",
    glow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.10)]",
  },
  indigo: {
    iconBg: "bg-indigo-500/10",
    iconFg: "text-indigo-400",
    glow: "hover:shadow-[0_0_20px_rgba(99,102,241,0.10)]",
  },
  green: {
    iconBg: "bg-green-500/10",
    iconFg: "text-green-400",
    glow: "hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconFg: "text-amber-400",
    glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.10)]",
  },
};

interface StatCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  href: string;
  color?: StatColor;
}

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  href,
  color = "emerald",
}: StatCardProps) {
  const c = COLOR_CLASSES[color];
  return (
    <Link href={href}>
      <Card className={`transition-all hover:bg-accent/20 cursor-pointer ${c.glow}`}>
        <CardContent className="flex items-center gap-4 pt-0">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${c.iconBg}`}>
            <Icon className={`h-5 w-5 ${c.iconFg}`} />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
