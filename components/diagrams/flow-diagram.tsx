"use client";

import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  JoinEdge,
  LineageNode,
  StraightEdge,
} from "@/components/diagrams/primitives";
import type { ArchitectureGraph } from "@/lib/case-studies/types";
import { conceptFlow } from "@/lib/diagrams/concept-flow";
import { systemFlow } from "@/lib/diagrams/system-flow";
import { experienceDiscoveryFlow } from "@/lib/diagrams/experience-discovery-flow";

const DOTTED_GRID = {
  backgroundImage:
    "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
};

function AutoFit({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const naturalW = inner.offsetWidth;
      const naturalH = inner.offsetHeight;
      if (naturalW === 0) return;
      const availableW = outer.clientWidth;
      const s = Math.min(1, availableW / naturalW);
      setScale(s);
      setHeight(Math.ceil(naturalH * s));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(update);
    }
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="w-full overflow-hidden" style={{ height }}>
      <div
        ref={innerRef}
        style={{
          width: "max-content",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const NODE_WIDTH = 170;

export function FlowDiagram({ graph }: { graph: ArchitectureGraph }) {
  const { parallelSources, nodes } = graph;

  return (
    <div className="my-6">
      <AutoFit>
        <div className="rounded-2xl border border-zinc-800 bg-[#0a1a12] overflow-hidden shadow-2xl shadow-black/30">
          <div className="relative p-5" style={DOTTED_GRID}>
            <div className="flex flex-row items-stretch">
              {parallelSources && parallelSources.length > 0 && (
                <>
                  <div className="flex flex-col justify-center gap-3 w-[150px] shrink-0">
                    {parallelSources.map((node, i) => (
                      <LineageNode key={`ps-${i}`} node={node} />
                    ))}
                  </div>
                  <JoinEdge direction="horizontal" />
                </>
              )}
              <div className="flex flex-row items-center">
                {nodes.map((node, i) => (
                  <Fragment key={`n-${i}`}>
                    {i > 0 && <StraightEdge direction="horizontal" />}
                    <div style={{ width: NODE_WIDTH }} className="shrink-0">
                      <LineageNode node={node} />
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AutoFit>
    </div>
  );
}

export function ConceptFlowDiagram() {
  return <FlowDiagram graph={conceptFlow} />;
}

export function SystemFlowDiagram() {
  return <FlowDiagram graph={systemFlow} />;
}

export function ExperienceDiscoveryDiagram() {
  return <FlowDiagram graph={experienceDiscoveryFlow} />;
}
