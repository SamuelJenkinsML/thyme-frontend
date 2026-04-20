"use client";

import { Fragment } from "react";
import { Database, Sparkles, Radio, Workflow } from "lucide-react";
import type { ArchitectureNode } from "@/lib/case-studies/types";

export const nodeConfig = {
  source: {
    borderClass: "border-emerald-500/30",
    bgClass: "bg-emerald-950/40",
    labelClass: "text-emerald-100",
    sublabelClass: "text-emerald-300/70",
    iconColor: "text-emerald-400/80",
    kindLabel: "Source",
    kindClass: "text-emerald-400/60",
    shadow: "0 0 24px rgba(16,185,129,0.12)",
    Icon: Radio,
  },
  transform: {
    borderClass: "border-purple-500/30",
    bgClass: "bg-purple-950/40",
    labelClass: "text-purple-100",
    sublabelClass: "text-purple-300/70",
    iconColor: "text-purple-400/80",
    kindLabel: "Pipeline",
    kindClass: "text-purple-400/60",
    shadow: "0 0 24px rgba(168,85,247,0.12)",
    Icon: Workflow,
  },
  store: {
    borderClass: "border-indigo-500/30",
    bgClass: "bg-indigo-950/40",
    labelClass: "text-indigo-100",
    sublabelClass: "text-indigo-300/70",
    iconColor: "text-indigo-400/80",
    kindLabel: "Dataset",
    kindClass: "text-indigo-400/60",
    shadow: "0 0 24px rgba(99,102,241,0.12)",
    Icon: Database,
  },
  serve: {
    borderClass: "border-emerald-400/40",
    bgClass: "bg-emerald-900/50",
    labelClass: "text-emerald-50",
    sublabelClass: "text-emerald-200/70",
    iconColor: "text-emerald-300",
    kindLabel: "Featureset",
    kindClass: "text-emerald-300/70",
    shadow: "0 0 28px rgba(52,211,153,0.18)",
    Icon: Sparkles,
  },
} as const;

export const EDGE_STROKE = "rgba(139,195,74,0.85)";
export const EDGE_TRACK = "rgba(139,195,74,0.18)";
export const EDGE_ARROW = "rgba(139,195,74,0.7)";

export function StraightEdge() {
  return (
    <div className="flex justify-center">
      <svg
        width="40"
        height="36"
        viewBox="0 0 40 36"
        aria-hidden
        className="overflow-visible"
      >
        <line x1="20" y1="0" x2="20" y2="28" stroke={EDGE_TRACK} strokeWidth="1.5" />
        <line
          x1="20"
          y1="0"
          x2="20"
          y2="28"
          stroke={EDGE_STROKE}
          strokeWidth="1.5"
          strokeDasharray="3 7"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-20"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </line>
        <path
          d="M 15 24 L 20 32 L 25 24"
          stroke={EDGE_ARROW}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function JoinEdge() {
  const paths = [
    "M 50 0 Q 50 28 100 44 L 100 54",
    "M 150 0 Q 150 28 100 44 L 100 54",
  ];
  return (
    <div className="relative w-full h-14">
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        {paths.map((d, i) => (
          <Fragment key={i}>
            <path
              d={d}
              stroke={EDGE_TRACK}
              strokeWidth="1.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={d}
              stroke={EDGE_STROKE}
              strokeWidth="1.5"
              strokeDasharray="3 7"
              strokeLinecap="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-20"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </path>
          </Fragment>
        ))}
        <path
          d="M 92 48 L 100 58 L 108 48"
          stroke={EDGE_ARROW}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export function LineageNode({ node }: { node: ArchitectureNode }) {
  const cfg = nodeConfig[node.kind];
  const { Icon } = cfg;
  const isDataset = node.kind === "store";

  return (
    <div
      className={`group relative rounded-xl border ${cfg.borderClass} ${cfg.bgClass} backdrop-blur-sm px-4 py-3 transition-all`}
      style={{ boxShadow: cfg.shadow }}
    >
      {isDataset && (
        <div className="absolute -top-1 left-3 right-3 h-2 rounded-t-full border-t border-x border-indigo-500/20 bg-indigo-500/5" />
      )}
      <div className={`flex items-center gap-3 ${isDataset ? "pt-1" : ""}`}>
        <Icon size={18} className={`${cfg.iconColor} shrink-0`} />
        <div className="min-w-0 flex-1">
          <div
            className={`font-[var(--font-dm-sans)] text-[0.62rem] uppercase tracking-[0.14em] ${cfg.kindClass}`}
          >
            {cfg.kindLabel}
          </div>
          <div
            className={`font-[var(--font-space-grotesk)] text-[0.92rem] font-semibold leading-tight truncate ${cfg.labelClass}`}
            title={node.label}
          >
            {node.label}
          </div>
          {node.sublabel && (
            <div
              className={`font-mono text-[0.68rem] mt-0.5 leading-tight ${cfg.sublabelClass}`}
            >
              {node.sublabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
