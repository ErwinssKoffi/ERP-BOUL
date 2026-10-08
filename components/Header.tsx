'use client';

import React from 'react';
import {
  Wheat,
  LayoutDashboard,
  ChefHat,
  ShoppingCart,
  CalendarCheck,
  PackageCheck,
  Truck,
  TrendingUp,
  Sparkles,
  Calculator,
  Bell,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'production' | 'pos' | 'orders' | 'stocks' | 'suppliers' | 'analytics';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openDoughCalc: () => void;
  openAiAdvisor: () => void;
  stockAlertsCount: number;
  ordersPendingCount: number;
  todayRevenue: number;
}

export function Header({
  activeTab,
  setActiveTab,
  openDoughCalc,
  openAiAdvisor,
  stockAlertsCount,
  ordersPendingCount,
  todayRevenue,
}: HeaderProps) {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'production' as NavTab, label: 'Fournil & Recettes', icon: ChefHat },
    { id: 'pos' as NavTab, label: 'Caisse Tactile POS', icon: ShoppingCart, highlight: true },
    { id: 'orders' as NavTab, label: 'Commandes Retrait', icon: CalendarCheck, badge: ordersPendingCount },
    { id: 'stocks' as NavTab, label: 'Stocks Ingrédients', icon: PackageCheck, alert: stockAlertsCount },
    { id: 'suppliers' as NavTab, label: 'Fournisseurs', icon: Truck },
    { id: 'analytics' as NavTab, label: 'Rentabilité & Coûts', icon: TrendingUp },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-amber-900/30 sticky top-0 z-30 shadow-md">
      {/* Top micro-bar with status information */}
      <div className="px-4 py-1.5 bg-slate-950/80 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between text-slate-300">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-amber-400 font-semibold tracking-wide">
            <Wheat className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            FOURNIL ACTIF : Soles 1 & 2 (245°C) • Étuve A (26.5°C / 82% HR)
          </span>
          <span className="hidden md:inline-block text-slate-500">|</span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Session Vente Ouverte • Caisse 01
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">CA du Jour:</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">
              {todayRevenue.toFixed(2)} €
            </span>
          </div>
          <button
            onClick={openDoughCalc}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-800/60 transition text-xs font-medium cursor-pointer"
            title="Calculateur de température de base et de pétrissée"
          >
            <Calculator className="w-3 h-3 text-amber-400" />
            Calculateur TB
          </button>
          <button
            onClick={openAiAdvisor}
            className="flex items-center gap-1 text-purple-300 hover:text-purple-200 bg-purple-950/60 hover:bg-purple-900/60 px-2 py-0.5 rounded border border-purple-800/60 transition text-xs font-medium cursor-pointer"
            title="Assistant de création de recette et optimisation de production"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            Conseil Fournil IA
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black">
            <Wheat className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg tracking-tight bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent">
                ERP-BOUL
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Artisan Pro
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gestion de Boulangerie, Pâtisserie & Fournil
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold'
                    : tab.highlight
                    ? 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-600/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="ml-1 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full px-1.5 py-0.2">
                    {tab.badge}
                  </span>
                ) : null}
                {tab.alert && tab.alert > 0 ? (
                  <span className="ml-1 bg-rose-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.2 animate-bounce">
                    {tab.alert}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
