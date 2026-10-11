"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  Store,
  ChevronDown,
  Coins,
  ShieldCheck,
  LogOut,
  Users,
  Menu,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import { DEMO_BRANCHES, DEMO_USERS } from "@/server/auth/mock-users";
import { SessionContext } from "@/types/auth";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Avatar } from "../ui/avatar";
import { useTheme } from "@/lib/theme";

export function TopBar({
  session,
  onOpenCommandMenu,
  onBranchChange,
  onUserChange,
  onToggleMobileMenu,
  className,
}: {
  session: SessionContext | null;
  onOpenCommandMenu: () => void;
  onBranchChange: (branchId: string) => void;
  onUserChange: (userId: string) => void;
  onToggleMobileMenu?: () => void;
  className?: string;
}) {
  const currentBranch = DEMO_BRANCHES.find((b) => b.id === session?.branchId) || DEMO_BRANCHES[0];
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={cn(
        "h-16 border-b border-[#1f1f1f] bg-[#000000]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-white/[0.06]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Bouton de recherche rapide Vercel (Cmd+K) */}
        <button
          onClick={onOpenCommandMenu}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#262626] text-xs text-[#888888] hover:text-white hover:border-[#444444] transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#888888]" />
          <span className="hidden sm:inline">Rechercher ou exécuter...</span>
          <span className="text-[10px] font-mono bg-[#141414] px-1.5 py-0.5 rounded border border-[#262626] text-[#888888]">
            ⌘K
          </span>
        </button>
      </div>

      <div className="flex items-center space-x-3">
        {/* Bouton Toggle Thème (Clair / Sombre) Vercel */}
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#262626] text-xs text-[#888888] hover:text-white hover:border-[#444444] transition-all cursor-pointer"
          title={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
          aria-label="Basculer le thème"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline text-[11px] font-mono">Clair</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline text-[11px] font-mono">Sombre</span>
            </>
          )}
        </button>

        {/* Sélecteur de Succursale */}
        <DropdownMenu
          trigger={
            <button className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#262626] text-xs text-[#ededed] hover:border-[#444444] transition-colors cursor-pointer">
              <Store className="w-3.5 h-3.5 text-[#888888]" />
              <span className="font-medium max-w-[140px] truncate">{currentBranch.name}</span>
              <ChevronDown className="w-3 h-3 text-[#888888]" />
            </button>
          }
        >
          <div className="px-2.5 py-1 text-[10px] font-mono text-[#888888] uppercase border-b border-[#1f1f1f] mb-1">
            Succursales Disponibles
          </div>
          {DEMO_BRANCHES.map((b) => (
            <DropdownMenuItem
              key={b.id}
              onClick={() => onBranchChange(b.id)}
              className="flex items-center justify-between"
            >
              <span>{b.name}</span>
              {b.id === session?.branchId && <Check className="w-3 h-3 text-[#0070f3] ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>

        {/* Indicateur Devise XOF */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#0a0a0a] border border-[#262626] text-xs font-mono text-[#888888]">
          <Coins className="w-3.5 h-3.5 text-[#888888]" />
          <span>XOF</span>
        </div>

        {/* Menu Profil et Bascule Persona */}
        {session && (
          <DropdownMenu
            align="right"
            trigger={
              <button className="flex items-center space-x-2 p-1 rounded-full hover:ring-1 hover:ring-[#444444] transition-all cursor-pointer">
                <Avatar name={session.user.fullName} size="sm" />
              </button>
            }
          >
            <div className="px-2.5 py-1.5 border-b border-[#1f1f1f]">
              <div className="font-semibold text-xs text-white truncate">{session.user.fullName}</div>
              <div className="text-[10px] font-mono text-[#888888] truncate">{session.roles[0]?.name}</div>
            </div>

            <div className="px-2.5 py-1 text-[10px] font-mono text-[#888888] uppercase">
              Changer de Profil (Démo)
            </div>

            {DEMO_USERS.map((u) => (
              <DropdownMenuItem
                key={u.id}
                onClick={() => onUserChange(u.id)}
                className="flex items-center justify-between"
              >
                <span>{u.firstName} ({u.roleCodes[0].split("_")[0]})</span>
                {u.id === session.userId && <Check className="w-3 h-3 text-[#0070f3] ml-2" />}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem destructive onClick={() => window.location.reload()}>
              <LogOut className="w-3.5 h-3.5 mr-2" />
              <span>Réinitialiser la session</span>
            </DropdownMenuItem>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
