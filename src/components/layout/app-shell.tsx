"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { CommandMenu, CommandItem } from "./command-menu";
import { ToastProvider, useToast } from "../ui/toast";
import { ThemeProvider, useTheme } from "@/lib/theme";
import { SessionContext } from "@/types/auth";
import {
  LayoutDashboard,
  Store,
  Box,
  Layers,
  Coins,
  ShieldCheck,
  FileText,
  Activity,
  PlusCircle,
  SunMoon,
} from "lucide-react";

export interface AppShellProps {
  children: React.ReactNode;
  activeNavId: string;
  onNavSelect: (id: string) => void;
  session: SessionContext | null;
  onBranchChange: (branchId: string) => void;
  onUserChange: (userId: string) => void;
}

function AppShellContent({
  children,
  activeNavId,
  onNavSelect,
  session,
  onBranchChange,
  onUserChange,
}: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = React.useState(false);
  const { toggleTheme } = useTheme();

  // Command palette items
  const commandItems: CommandItem[] = [
    {
      id: "cmd_dashboard",
      title: "Ouvrir le Tableau de Bord Global",
      category: "Pilotage",
      icon: <LayoutDashboard className="w-4 h-4" />,
      shortcut: "D",
      onSelect: () => onNavSelect("dashboard"),
    },
    {
      id: "cmd_pos",
      title: "Ouvrir le Point de Vente (POS)",
      category: "Navigation",
      icon: <Store className="w-4 h-4" />,
      shortcut: "P",
      onSelect: () => onNavSelect("pos"),
    },
    {
      id: "cmd_stock",
      title: "Consulter les Stocks & Farines",
      category: "Navigation",
      icon: <Box className="w-4 h-4" />,
      shortcut: "S",
      onSelect: () => onNavSelect("inventory"),
    },
    {
      id: "cmd_prod",
      title: "Planifier un Ordre de Fabrication (Fournil)",
      category: "Production",
      icon: <Activity className="w-4 h-4" />,
      shortcut: "F",
      onSelect: () => onNavSelect("production"),
    },
    {
      id: "cmd_finance",
      title: "Consulter la Trésorerie & Caisse",
      category: "Finance",
      icon: <Coins className="w-4 h-4" />,
      shortcut: "C",
      onSelect: () => onNavSelect("finance"),
    },
    {
      id: "cmd_theme",
      title: "Basculer Thème (Clair / Sombre)",
      category: "Système",
      icon: <SunMoon className="w-4 h-4" />,
      shortcut: "T",
      onSelect: () => toggleTheme(),
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050507] text-gray-100 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar
          activeNavId={activeNavId}
          onNavSelect={onNavSelect}
          session={session}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Backdrop & Drawer */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-[#07080c]">
            <Sidebar
              activeNavId={activeNavId}
              onNavSelect={(id) => {
                onNavSelect(id);
                setIsMobileSidebarOpen(false);
              }}
              session={session}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar
          session={session}
          onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
          onBranchChange={onBranchChange}
          onUserChange={onUserChange}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Command Menu Modal */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        items={commandItems}
      />
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppShellContent {...props} />
      </ToastProvider>
    </ThemeProvider>
  );
}
