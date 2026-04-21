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
  QueryEdge,
  StraightEdge,
} from "@/components/diagrams/primitives";
import { readWritePath } from "@/lib/diagrams/read-write-path";

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

function HingeNode() {
  const { hinge } = readWritePath;
  return (
    <div className="relative flex items-center px-2 shrink-0">
      <div
        className="relative w-[180px] rounded-xl border border-indigo-400/50 bg-indigo-950/70 backdrop-blur-sm px-4 py-3"
        style={{ boxShadow: "0 0 48px rgba(99,102,241,0.3)" }}
      >
        <div className="absolute -top-1 left-3 right-3 h-2 rounded-t-full border-t border-x border-indigo-400/30 bg-indigo-400/10" />
        <div className="pt-1">
          <div className="font-[var(--font-dm-sans)] text-[0.62rem] uppercase tracking-[0.14em] text-indigo-300/80">
            Shared state
          </div>
          <div className="font-[var(--font-space-grotesk)] text-[0.92rem] font-semibold leading-tight text-indigo-50">
            {hinge.label}
          </div>
          <div className="font-mono text-[0.68rem] mt-0.5 leading-tight text-indigo-200/70">
            {hinge.sublabel}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReadWriteDiagram() {
  const { writeSources, writeFlow, readFlow } = readWritePath;

  return (
    <div className="my-6">
      <AutoFit>
        <div className="rounded-2xl border border-zinc-800 bg-[#0a1a12] overflow-hidden shadow-2xl shadow-black/30">
        {/* Split header demarcates write vs read at the hinge */}
        <div className="flex items-stretch border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-between flex-1 px-5 py-2.5">
            <span className="font-mono text-[0.7rem] tracking-[0.18em] text-emerald-400/70">
              WRITE PATH ▸
            </span>
            <span className="font-mono text-[0.7rem] tracking-[0.12em] text-zinc-500">
              continuous ingestion
            </span>
          </div>
          <div className="w-px bg-indigo-400/40" />
          <div className="flex items-center justify-between flex-1 px-5 py-2.5">
            <span className="font-mono text-[0.7rem] tracking-[0.12em] text-zinc-500">
              on query
            </span>
            <span className="font-mono text-[0.7rem] tracking-[0.18em] text-emerald-400/70">
              ▸ READ PATH
            </span>
          </div>
        </div>

        {/* Single horizontal canvas: sources → write → hinge (demarcation) → read */}
        <div className="relative p-4" style={DOTTED_GRID}>
          <div className="flex flex-row items-stretch">
            <div className="flex flex-col justify-center gap-3 w-[140px] shrink-0">
              {writeSources.map((node, i) => (
                <LineageNode key={`ws-${i}`} node={node} />
              ))}
            </div>
            <JoinEdge direction="horizontal" />
            <div className="flex flex-row items-center">
              {writeFlow.map((node, i) => (
                <Fragment key={`wf-${i}`}>
                  {i > 0 && <StraightEdge direction="horizontal" />}
                  <div className="w-[150px] shrink-0">
                    <LineageNode node={node} />
                  </div>
                </Fragment>
              ))}
            </div>
            <StraightEdge direction="horizontal" />
            <HingeNode />
            <QueryEdge />
            <div className="flex flex-row items-center">
              {readFlow.map((node, i) => (
                <Fragment key={`rf-${i}`}>
                  {i > 0 && <StraightEdge direction="horizontal" />}
                  <div className="w-[155px] shrink-0">
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
