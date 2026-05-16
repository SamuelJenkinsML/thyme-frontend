import { KIND_COLORS, type CatalogKind } from "@/lib/catalog/kind-colors";
import { KIND_META } from "@/lib/catalog/kind-meta";
import { cn } from "@/lib/utils";

interface KindIconProps {
  kind: CatalogKind;
  className?: string;
  iconClassName?: string;
}

export function KindIcon({ kind, className, iconClassName }: KindIconProps) {
  const { icon: Icon } = KIND_META[kind];
  const colors = KIND_COLORS[kind];
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded",
        colors.iconBg,
        className,
      )}
    >
      <Icon className={cn("size-3", colors.iconFg, iconClassName)} />
    </span>
  );
}
