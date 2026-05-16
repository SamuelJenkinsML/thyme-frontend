"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null,
);

export function useCommandPalette(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error(
      "useCommandPalette must be used inside <CommandPaletteProvider>",
    );
  }
  return ctx;
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const isPaletteShortcut =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (!isPaletteShortcut) return;
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const stableSetOpen = useCallback((next: boolean) => setOpen(next), []);
  const value = useMemo(
    () => ({ open, setOpen: stableSetOpen }),
    [open, stableSetOpen],
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}
