"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Store,
  Box,
  CookingPot,
  LineChart,
  ChevronLeft,
  ChevronRight,
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
    group: "Pilotage Stratégique",
    items: [
      { id: "dashboard", label: "Tableau de Bord Global", module: "dashboard", icon: <LayoutDashboard className="w-4 h-4" />, badge: "Live" },
    ],
  },
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
        "flex flex-col border-r border-[#1f1f1f] bg-[#000000] text-[#ededed] transition-all duration-300 z-30 select-none",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand & Logo Vercel Monochrome */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#1f1f1f]">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center shrink-0 shadow-xs text-xs tracking-tighter">
            EB
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-bold text-xs tracking-wider text-white block">ERP-BOUL</span>
              <span className="text-[10px] text-[#888888] block truncate">Bakery Operating System</span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="text-[#888888] hover:text-white p-1 rounded-md hover:bg-white/[0.08] transition-all cursor-pointer"
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
              <h4 className="px-2 text-[10px] font-mono uppercase text-[#71717a] font-semibold tracking-wider">
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
                    "w-full flex items-center rounded-lg px-2.5 py-2 text-xs font-medium transition-all group cursor-pointer",
                    isActive
                      ? "bg-white/[0.12] text-white border border-white/15 font-semibold shadow-xs"
                      : "text-[#888888] hover:text-white hover:bg-white/[0.08] hover:border-white/10 hover:shadow-xs border border-transparent",
                    isCollapsed ? "justify-center px-0" : "justify-between"
                  )}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span
                      className={cn(
                        "transition-colors shrink-0",
                        isActive ? "text-white" : "text-[#71717a] group-hover:text-white"
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.08] text-[#ededed] border border-white/15 shrink-0">
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
        <div className="p-3 border-t border-[#1f1f1f] bg-[#0a0a0a]">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <Avatar name={session.user.fullName} size="sm" />
            {!isCollapsed && (
              <div className="truncate flex-1">
                <span className="text-xs font-semibold text-white block truncate">
                  {session.user.fullName}
                </span>
                <span className="text-[10px] font-mono text-[#888888] block truncate">
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
