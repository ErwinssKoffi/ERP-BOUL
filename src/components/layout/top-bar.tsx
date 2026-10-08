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
} from "lucide-react";
import { DEMO_BRANCHES, DEMO_USERS } from "@/server/auth/mock-users";
import { SessionContext } from "@/types/auth";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Avatar } from "../ui/avatar";

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

  return (
    <header
      className={cn(
        "h-16 border-b border-[#1a2032] bg-[#0c0e17]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#151926]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Bouton de recherche rapide Linear (Cmd+K) */}
        <button
          onClick={onOpenCommandMenu}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#121624] border border-[#21283a] text-xs text-gray-400 hover:text-gray-200 hover:border-[#2f3952] transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span className="hidden sm:inline">Rechercher ou exécuter...</span>
          <span className="text-[10px] font-mono bg-[#181d2e] px-1.5 py-0.5 rounded border border-[#283248] text-gray-400">
            ⌘K
          </span>
        </button>
      </div>

      <div className="flex items-center space-x-3">
        {/* Sélecteur de Succursale */}
        <DropdownMenu
          trigger={
            <button className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#121624] border border-[#21283a] text-xs text-gray-200 hover:border-amber-500/40 transition-colors">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium max-w-[140px] truncate">{currentBranch.name}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          }
        >
          <div className="px-2.5 py-1 text-[10px] font-mono text-gray-400 uppercase">
            Succursales Disponibles
          </div>
          {DEMO_BRANCHES.map((b) => (
            <DropdownMenuItem
              key={b.id}
              onClick={() => onBranchChange(b.id)}
              className="flex items-center justify-between"
            >
              <span>{b.name}</span>
              {b.id === session?.branchId && <Check className="w-3 h-3 text-amber-400 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>

        {/* Indicateur Devise XOF */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#121624] border border-[#21283a] text-xs font-mono text-gray-300">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>XOF</span>
        </div>

        {/* Menu Profil et Bascule Persona */}
        {session && (
          <DropdownMenu
            align="right"
            trigger={
              <button className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-amber-500/40 transition-all">
                <Avatar name={session.user.fullName} size="sm" />
              </button>
            }
          >
            <div className="px-2.5 py-1.5 border-b border-[#1b2132]">
              <div className="font-semibold text-xs text-white truncate">{session.user.fullName}</div>
              <div className="text-[10px] font-mono text-amber-400 truncate">{session.roles[0]?.name}</div>
            </div>

            <div className="px-2.5 py-1 text-[10px] font-mono text-gray-400 uppercase">
              Changer de Profil (Démo)
            </div>

            {DEMO_USERS.map((u) => (
              <DropdownMenuItem
                key={u.id}
                onClick={() => onUserChange(u.id)}
                className="flex items-center justify-between"
              >
                <span>{u.firstName} ({u.roleCodes[0].split("_")[0]})</span>
                {u.id === session.userId && <Check className="w-3 h-3 text-amber-400 ml-2" />}
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
