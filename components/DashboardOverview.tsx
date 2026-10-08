'use client';

import React from 'react';
import {
  TrendingUp,
  Flame,
  PackageCheck,
  CalendarCheck,
  ShoppingCart,
  ChefHat,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Wheat,
  Plus,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ProductionBatch, CustomerOrder, StockItem, POSProduct, Recipe } from '@/lib/types';
import { NavTab } from './Header';

interface DashboardOverviewProps {
  todayRevenue: number;
  batches: ProductionBatch[];
  orders: CustomerOrder[];
  stocks: StockItem[];
  recipes: Recipe[];
  onNavigate: (tab: NavTab) => void;
  onUpdateBatchStatus: (batchId: string, newStatus: any) => void;
  onOpenDoughCalc: () => void;
  onOpenAiAdvisor: () => void;
}

export function DashboardOverview({
  todayRevenue,
  batches,
  orders,
  stocks,
  recipes,
  onNavigate,
  onUpdateBatchStatus,
  onOpenDoughCalc,
  onOpenAiAdvisor,
}: DashboardOverviewProps) {
  // Calculations
  const revenueTarget = 1450.0;
  const revenuePercent = Math.min(100, Math.round((todayRevenue / revenueTarget) * 100));

  const activeBatches = batches.filter((b) => b.status !== 'TERMINE');
  const finishedBatches = batches.filter((b) => b.status === 'TERMINE');

  const pendingOrders = orders.filter((o) => o.status !== 'RETIRE' && o.status !== 'ANNULE');
  const urgentOrders = pendingOrders.filter((o) => o.status === 'PRET' || o.status === 'EN_PREPARATION');

  const lowStockItems = stocks.filter((s) => s.quantity <= s.minAlertThreshold);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome message */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Wheat className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Fournil Artisanal en Production Continue
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Bonjour, Chef Boulanger & Gérant
            </h2>
            <p className="text-amber-100/90 text-sm mt-1 max-w-xl">
              Toutes les fournées du matin sont calibrées. Le taux d hydratation est optimisé et la caisse tactile enregistre les premières ventes au comptoir.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('pos')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-950/40 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-slate-950" />
              Ouvrir Caisse POS
            </button>
            <button
              onClick={() => onNavigate('production')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs backdrop-blur-sm border border-white/20 transition cursor-pointer"
            >
              <ChefHat className="w-4 h-4 text-amber-300" />
              Planning Fournil
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Chiffre d'Affaires */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition group">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wide">
            <span>CA du Jour</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {todayRevenue.toFixed(2)} €
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% vs J-1
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Objectif : {revenueTarget} €</span>
              <span className="font-bold text-slate-700">{revenuePercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${revenuePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 2: Fournées du Jour */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition group">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wide">
            <span>Fournil & Fournées</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {activeBatches.length} <span className="text-sm font-medium text-slate-500">actives</span>
            </span>
            <span className="text-xs text-amber-700 font-medium">
              / {finishedBatches.length} terminées
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Sole 1 : Baguettes (245°C)</span>
            <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
              En cours
            </span>
          </div>
        </div>

        {/* KPI 3: Commandes Retrait */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition group">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wide">
            <span>Commandes Spéciales</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition">
              <CalendarCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {pendingOrders.length}
            </span>
            <span className="text-xs text-purple-700 font-medium">
              retraits prévus aujourd hui
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span className="text-purple-900 font-semibold">
              {urgentOrders.length} prêtes ou en labo
            </span>
            <button
              onClick={() => onNavigate('orders')}
              className="text-purple-600 hover:text-purple-800 text-[11px] font-bold underline cursor-pointer"
            >
              Voir la liste
            </button>
          </div>
        </div>

        {/* KPI 4: Alertes Stock */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition group">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wide">
            <span>Stocks & DLUO</span>
            <span className={`p-2 rounded-xl transition group-hover:scale-110 ${
              lowStockItems.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <PackageCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${
              lowStockItems.length > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {lowStockItems.length}
            </span>
            <span className="text-xs text-slate-500">
              {lowStockItems.length > 0 ? 'matières sous le seuil' : 'stocks optimaux'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            {lowStockItems.length > 0 ? (
              <span className="text-rose-600 font-semibold text-[11px] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Réapprovisionner
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold text-[11px]">Tous ingrédients OK</span>
            )}
            <button
              onClick={() => onNavigate('stocks')}
              className="text-slate-600 hover:text-slate-900 text-[11px] font-bold underline cursor-pointer"
            >
              Inventaire
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Fournil Live Monitor & Urgent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Fournil en Direct & Fournées */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Suivi des Fournées & Production du Jour
                </h3>
                <p className="text-xs text-slate-500">
                  Progression du pétrin, pousse en étuve et passage aux fours
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDoughCalc}
                className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg border border-amber-200 transition cursor-pointer"
              >
                Calculateur TB
              </button>
              <button
                onClick={() => onNavigate('production')}
                className="text-xs font-bold px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition cursor-pointer"
              >
                Tout Gérer
              </button>
            </div>
          </div>

          {/* Batches List */}
          <div className="space-y-3">
            {batches.slice(0, 5).map((batch) => {
              const statusBadges: Record<string, { label: string; bg: string; text: string }> = {
                PLANIFIE: { label: 'Planifié', bg: 'bg-slate-100', text: 'text-slate-700' },
                PETRISSAGE: { label: 'Pétrissage', bg: 'bg-blue-100', text: 'text-blue-800' },
                POUSSE: { label: 'En Pousse', bg: 'bg-amber-100', text: 'text-amber-800' },
                FOUR: { label: 'Au Four (Cuisson)', bg: 'bg-orange-500 text-white animate-pulse', text: 'text-white' },
                TERMINE: { label: 'Cuit & Dispo', bg: 'bg-emerald-100', text: 'text-emerald-800' },
              };
              const badge = statusBadges[batch.status] || statusBadges.PLANIFIE;

              return (
                <div
                  key={batch.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-amber-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center border border-amber-500/20 flex-shrink-0">
                      {batch.ovenNumber ? `F${batch.ovenNumber}` : 'LAB'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-slate-900">{batch.recipeName}</strong>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                        <span className="font-mono text-slate-600">{batch.batchNumber}</span>
                        <span>•</span>
                        <span>{batch.plannedPieces} pièces prévues</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {batch.scheduledTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for batch */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {batch.status === 'PLANIFIE' && (
                      <button
                        onClick={() => onUpdateBatchStatus(batch.id, 'PETRISSAGE')}
                        className="px-2.5 py-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md border border-blue-200 cursor-pointer"
                      >
                        Démarrer Pétrissage
                      </button>
                    )}
                    {batch.status === 'PETRISSAGE' && (
                      <button
                        onClick={() => onUpdateBatchStatus(batch.id, 'POUSSE')}
                        className="px-2.5 py-1 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md border border-amber-200 cursor-pointer"
                      >
                        Mettre en Pousse
                      </button>
                    )}
                    {batch.status === 'POUSSE' && (
                      <button
                        onClick={() => onUpdateBatchStatus(batch.id, 'FOUR')}
                        className="px-2.5 py-1 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-md cursor-pointer"
                      >
                        Enfourner
                      </button>
                    )}
                    {batch.status === 'FOUR' && (
                      <button
                        onClick={() => onUpdateBatchStatus(batch.id, 'TERMINE')}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Sortir du Four
                      </button>
                    )}
                    {batch.status === 'TERMINE' && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        En Rayon ({batch.actualPieces || batch.plannedPieces} pcs)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Commandes Clients & Retraits du Jour */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Retraits du Jour
                </h3>
                <p className="text-xs text-slate-500">Commandes personnalisées</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
            >
              Toutes ({orders.length})
            </button>
          </div>

          <div className="space-y-3">
            {urgentOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Aucun retrait urgent en attente actuellement.
              </div>
            ) : (
              urgentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900">
                      {ord.customerName}
                    </strong>
                    <span className="text-xs font-bold font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {ord.pickupTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </p>

                  {ord.notes && (
                    <div className="text-[11px] bg-amber-50 text-amber-900 p-1.5 rounded border border-amber-200 italic">
                      "{ord.notes}"
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                    <span className="font-bold text-slate-800">{ord.totalAmount.toFixed(2)} €</span>
                    <span className="text-[10px] text-slate-500">
                      Acompte : {ord.depositPaid.toFixed(2)} € (Reste : {(ord.totalAmount - ord.depositPaid).toFixed(2)} €)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick advice box */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Conseil Anti-Gaspillage & Invendus</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Activez le mode <strong>"Invendus Fin de Journée"</strong> en caisse POS dès 18h30 pour proposer les paniers découverte à -40% et réduire le taux de perte sous les 2%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
