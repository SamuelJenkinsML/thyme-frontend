"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Node } from "@xyflow/react";

const TYPE_LABEL: Record<string, string> = {
  lineageSource: "Source",
  lineageDataset: "Dataset",
  lineagePipeline: "Pipeline",
  lineageFeature: "Featureset",
  restApi: "REST API",
};

const TYPE_CHIP: Record<string, string> = {
  lineageSource: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  lineageDataset: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  lineagePipeline: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  lineageFeature: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  restApi: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
};

interface NodeDetailPanelProps {
  node: Node | null;
  onClose: () => void;
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  const open = node !== null;
  const type = node?.type ?? "";
  const data = node?.data ?? {};
  const label = (data.label as string) ?? "";
  const href = data.href as string | undefined;
  const version = data.version as number | undefined;
  const connectorType = data.connectorType as string | undefined;
  const featureCount = data.featureCount as number | undefined;
  const typeLabel = TYPE_LABEL[type] ?? type;
  const chipClass =
    TYPE_CHIP[type] ?? "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute top-0 right-0 bottom-0 z-20 w-[420px] border-l border-zinc-800 bg-zinc-950/95 backdrop-blur-md flex flex-col"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <h3 className="text-sm font-medium text-zinc-200">Node detail</h3>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              aria-label="Close detail panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-5 space-y-4">
            <div>
              <span
                className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${chipClass}`}
              >
                {typeLabel}
              </span>
              <h2 className="mt-2 text-lg font-semibold text-zinc-100 break-all">
                {label}
              </h2>
            </div>

            <dl className="space-y-2 text-sm">
              {connectorType && (
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Connector</dt>
                  <dd className="text-zinc-200 font-mono text-xs">
                    {connectorType}
                  </dd>
                </div>
              )}
              {version != null && (
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Version</dt>
                  <dd className="text-zinc-200 font-mono text-xs">
                    v{version}
                  </dd>
                </div>
              )}
              {featureCount != null && (
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Features</dt>
                  <dd className="text-zinc-200 font-mono text-xs">
                    {featureCount}
                  </dd>
                </div>
              )}
            </dl>

            {href && (
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800 transition-colors"
              >
                Open detail page
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
