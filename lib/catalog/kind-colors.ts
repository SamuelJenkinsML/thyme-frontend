export type CatalogKind =
  | "featureset"
  | "dataset"
  | "pipeline"
  | "source"
  | "tag"
  | "owner";

export interface KindColor {
  border: string;
  iconBg: string;
  iconFg: string;
  hoverGlow: string;
  accentText: string;
  ringColor: string;
}

export const KIND_COLORS: Record<CatalogKind, KindColor> = {
  featureset: {
    border: "border-l-emerald-500/60",
    iconBg: "bg-emerald-500/10",
    iconFg: "text-emerald-400",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.10)]",
    accentText: "text-emerald-300",
    ringColor: "ring-emerald-500/20",
  },
  dataset: {
    border: "border-l-indigo-500/60",
    iconBg: "bg-indigo-500/10",
    iconFg: "text-indigo-400",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(99,102,241,0.10)]",
    accentText: "text-indigo-300",
    ringColor: "ring-indigo-500/20",
  },
  pipeline: {
    border: "border-l-purple-500/60",
    iconBg: "bg-purple-500/10",
    iconFg: "text-purple-400",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.10)]",
    accentText: "text-purple-300",
    ringColor: "ring-purple-500/20",
  },
  source: {
    border: "border-l-green-500/60",
    iconBg: "bg-green-500/10",
    iconFg: "text-green-400",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]",
    accentText: "text-green-300",
    ringColor: "ring-green-500/20",
  },
  tag: {
    border: "border-l-amber-500/60",
    iconBg: "bg-amber-500/10",
    iconFg: "text-amber-400",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.10)]",
    accentText: "text-amber-300",
    ringColor: "ring-amber-500/20",
  },
  owner: {
    border: "border-l-sky-500/60",
    iconBg: "bg-sky-500/10",
    iconFg: "text-sky-400",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(14,165,233,0.10)]",
    accentText: "text-sky-300",
    ringColor: "ring-sky-500/20",
  },
};
