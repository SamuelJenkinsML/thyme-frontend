"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CodeBlock } from "@/components/ui/code-block";

interface LineageCodePanelProps {
  open: boolean;
  title: string;
  code: string;
  onClose: () => void;
}

export function LineageCodePanel({
  open,
  title,
  code,
  onClose,
}: LineageCodePanelProps) {
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
            <h3 className="text-sm font-medium text-zinc-200">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <CodeBlock code={code} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
