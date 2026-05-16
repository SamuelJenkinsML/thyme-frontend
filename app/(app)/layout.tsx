import { Sidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/shared/command-palette";
import { CommandPaletteProvider } from "@/lib/hooks/use-command-palette";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CommandPaletteProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
      <CommandPalette />
    </CommandPaletteProvider>
  );
}
