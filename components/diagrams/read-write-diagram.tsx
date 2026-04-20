"use client";

import { Fragment } from "react";
import {
  JoinEdge,
  LineageNode,
  StraightEdge,
} from "@/components/diagrams/primitives";
import { readWritePath } from "@/lib/diagrams/read-write-path";

const DOTTED_GRID = {
  backgroundImage:
    "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
};

function SectionHeader({
  label,
  caption,
  arrow,
}: {
  label: string;
  caption: string;
  arrow: "▾" | "▴";
}) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 bg-black/20">
      <span className="font-mono text-[0.7rem] tracking-[0.18em] text-emerald-400/70">
        {label} {arrow}
      </span>
      <span className="font-mono text-[0.7rem] tracking-[0.12em] text-zinc-500">
        {caption}
      </span>
    </div>
  );
}

function HingeNode() {
  const { hinge } = readWritePath;
  return (
    <div className="relative my-6">
      {/* hairline rails */}
      <div className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent" />
      <div
        className="relative mx-auto max-w-md rounded-xl border border-indigo-400/40 bg-indigo-950/60 backdrop-blur-sm px-5 py-4"
        style={{ boxShadow: "0 0 48px rgba(99,102,241,0.22)" }}
      >
        <div className="absolute -top-1 left-3 right-3 h-2 rounded-t-full border-t border-x border-indigo-400/30 bg-indigo-400/10" />
        <div className="pt-1 flex items-center justify-between gap-4">
          <div>
            <div className="font-[var(--font-dm-sans)] text-[0.62rem] uppercase tracking-[0.18em] text-indigo-300/80">
              Shared state
            </div>
            <div className="font-[var(--font-space-grotesk)] text-[1.05rem] font-semibold text-indigo-50">
              {hinge.label}
            </div>
            <div className="font-mono text-[0.7rem] text-indigo-200/70 mt-0.5">
              {hinge.sublabel}
            </div>
          </div>
          <div className="shrink-0 rounded-md border border-indigo-300/30 bg-indigo-400/10 px-2 py-1 font-mono text-[0.65rem] tracking-[0.1em] text-indigo-100/80">
            one definition
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReadWriteDiagram() {
  const { writeSources, writeFlow, readFlow } = readWritePath;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0a1a12] overflow-hidden shadow-2xl shadow-black/30 my-6">
      <SectionHeader
        label="WRITE PATH"
        caption="continuous ingestion"
        arrow="▾"
      />

      {/* Write canvas */}
      <div className="relative p-5" style={DOTTED_GRID}>
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-3">
            {writeSources.map((node, i) => (
              <LineageNode key={`ws-${i}`} node={node} />
            ))}
          </div>
          <JoinEdge />
          {writeFlow.map((node, i) => (
            <Fragment key={`wf-${i}`}>
              {i > 0 && <StraightEdge />}
              <LineageNode node={node} />
            </Fragment>
          ))}
          <StraightEdge />
        </div>
      </div>

      {/* Hinge */}
      <div className="relative bg-black/30 border-y border-white/5 px-5" style={DOTTED_GRID}>
        <HingeNode />
      </div>

      {/* Read canvas */}
      <div className="relative p-5" style={DOTTED_GRID}>
        <div className="flex flex-col">
          <StraightEdge />
          {readFlow.map((node, i) => (
            <Fragment key={`rf-${i}`}>
              {i > 0 && <StraightEdge />}
              <LineageNode node={node} />
            </Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/5 bg-black/20">
        <span className="font-mono text-[0.7rem] tracking-[0.18em] text-emerald-400/70">
          READ PATH ▴
        </span>
        <span className="font-mono text-[0.7rem] tracking-[0.12em] text-zinc-500">
          on query
        </span>
      </div>
    </div>
  );
}
