"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Store,
  Layers,
  Box,
  Truck,
  CookingPot,
  Scale,
  Receipt,
  FileCheck2,
  LineChart,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { SessionContext } from "@/types/auth";
import { Avatar } from "../ui/avatar";

export interface NavItem {
  id: string;
  label: string;
  module: string;
  icon: React.ReactNode;
  badge?: string;
}

export const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: "Vente & Caisse",
    items: [
      { id: "pos", label: "Point de Vente (POS)", module: "pos", icon: <Store className="w-4 h-4" />, badge: "Direct" },
      { id: "finance", label: "Trésorerie & Caisse", module: "finance", icon: <LineChart className="w-4 h-4" /> },
    ],
  },
  {
    group: "Fournil & Recettes",
    items: [
      { id: "production", label: "Production & Fournil", module: "production", icon: <CookingPot className="w-4 h-4" />, badge: "Pétrin" },
    ],
  },
  {
    group: "Stocks & Matières",
    items: [
      { id: "inventory", label: "Stock Farines & FEFO", module: "stock", icon: <Box className="w-4 h-4" /> },
    ],
  },
  {
    group: "Système & Design",
    items: [
      { id: "design-system", label: "Design System 02", module: "design", icon: <Sparkles className="w-4 h-4" />, badge: "Actif" },
      { id: "foundation", label: "Socle 01 Foundation", module: "foundation", icon: <ShieldCheck className="w-4 h-4" /> },
    ],
  },
];

export function Sidebar({
  activeNavId,
  onNavSelect,
  session,
  isCollapsed,
  onToggleCollapse,
  className,
}: {
  activeNavId: string;
  onNavSelect: (id: string) => void;
  session: SessionContext | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col border-r border-white/[0.08] bg-[#07080c] text-gray-200 transition-all duration-300 z-30 select-none",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand & Logo */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-white/[0.08]">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-black font-black flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.25)] text-xs">
            EB
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-bold text-xs tracking-wider text-white block">ERP-BOUL</span>
              <span className="text-[10px] text-gray-400 block truncate">Bakery Operating System</span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer"
          title={isCollapsed ? "Agrandir le menu" : "Réduire le menu"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groupes */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {NAV_GROUPS.map((grp) => (
          <div key={grp.group} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-2 text-[10px] font-mono uppercase text-gray-400 font-semibold tracking-wider">
                {grp.group}
              </h4>
            )}
            {grp.items.map((item) => {
              const isActive = activeNavId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavSelect(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "w-full flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all group cursor-pointer",
                    isActive
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-xs"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent",
                    isCollapsed ? "justify-center px-0" : "justify-between"
                  )}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span
                      className={cn(
                        "transition-colors shrink-0",
                        isActive ? "text-amber-400" : "text-gray-400 group-hover:text-gray-200"
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Profil Utilisateur */}
      {session && (
        <div className="p-3 border-t border-white/[0.08] bg-[#090b12]">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <Avatar name={session.user.fullName} size="sm" />
            {!isCollapsed && (
              <div className="truncate flex-1">
                <span className="text-xs font-semibold text-white block truncate">
                  {session.user.fullName}
                </span>
                <span className="text-[10px] font-mono text-amber-400/90 block truncate">
                  {session.roles[0]?.name || "Utilisateur"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
