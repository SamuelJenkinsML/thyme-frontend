"use client";

import { Fragment } from "react";
import type { ArchitectureGraph } from "@/lib/case-studies/types";
import {
  JoinEdge,
  LineageNode,
  StraightEdge,
} from "@/components/diagrams/primitives";

export function ArchitectureDiagram({ graph }: { graph: ArchitectureGraph }) {
  const { parallelSources, nodes } = graph;
  const hasJoin = parallelSources && parallelSources.length === 2;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0a1a12] overflow-hidden shadow-2xl shadow-black/30">
      {/* Annotation strip — mirrors the dashboard lineage header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 bg-black/20">
        <span className="font-mono text-[0.7rem] tracking-[0.18em] text-emerald-400/70">
          WRITE PATH ▾
        </span>
        <span className="font-mono text-[0.7rem] tracking-[0.12em] text-zinc-500">
          lineage
        </span>
      </div>

      {/* Dotted-grid canvas */}
      <div
        className="relative p-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="flex flex-col">
          {hasJoin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {parallelSources.map((node, i) => (
                  <LineageNode key={`ps-${i}`} node={node} />
                ))}
              </div>
              <JoinEdge />
            </>
          )}

          {nodes.map((node, i) => (
            <Fragment key={`n-${i}`}>
              {i > 0 && <StraightEdge />}
              <LineageNode node={node} />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
