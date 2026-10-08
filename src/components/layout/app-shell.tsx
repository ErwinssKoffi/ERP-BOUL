"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { CommandMenu, CommandItem } from "./command-menu";
import { ToastProvider, useToast } from "../ui/toast";
import { SessionContext } from "@/types/auth";
import {
  Store,
  Box,
  Layers,
  Coins,
  ShieldCheck,
  FileText,
  Activity,
  PlusCircle,
} from "lucide-react";

export interface AppShellProps {
  children: React.ReactNode;
  activeNavId: string;
  onNavSelect: (id: string) => void;
  session: SessionContext | null;
  onBranchChange: (branchId: string) => void;
  onUserChange: (userId: string) => void;
}

export function AppShell({
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

  // Command palette items
  const commandItems: CommandItem[] = [
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
      id: "cmd_recipes",
      title: "Fiches Techniques & Ratios Boulangers",
      category: "Navigation",
      icon: <Layers className="w-4 h-4" />,
      shortcut: "R",
      onSelect: () => onNavSelect("recipes"),
    },
    {
      id: "cmd_prod",
      title: "Planifier un Ordre de Fabrication",
      category: "Production",
      icon: <Activity className="w-4 h-4" />,
      shortcut: "F",
      onSelect: () => onNavSelect("production"),
    },
    {
      id: "cmd_ds",
      title: "Explorer le Design System 02",
      category: "Système",
      icon: <ShieldCheck className="w-4 h-4" />,
      onSelect: () => onNavSelect("design-system"),
    },
    {
      id: "cmd_audit",
      title: "Consulter la Piste d'Audit",
      category: "Sécurité",
      icon: <FileText className="w-4 h-4" />,
      onSelect: () => onNavSelect("foundation"),
    },
  ];

  return (
    <ToastProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#07080c] text-gray-100 font-sans">
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
            <div className="relative z-10 w-64 h-full bg-[#090b12]">
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
    </ToastProvider>
  );
}
