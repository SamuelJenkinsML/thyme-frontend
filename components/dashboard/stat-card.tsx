import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  href: string;
}

export function StatCard({ label, value, subtitle, icon: Icon, href }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-accent/20 cursor-pointer">
        <CardContent className="flex items-center gap-4 pt-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
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
