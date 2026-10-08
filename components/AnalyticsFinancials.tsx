'use client';

import React from 'react';
import {
  TrendingUp,
  PieChart,
  Percent,
  Euro,
  Scale,
  Download,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { Recipe, POSProduct } from '@/lib/types';

interface AnalyticsFinancialsProps {
  todayRevenue: number;
  recipes: Recipe[];
  products: POSProduct[];
  wasteValue: number;
}

export function AnalyticsFinancials({
  todayRevenue,
  recipes,
  products,
  wasteValue,
}: AnalyticsFinancialsProps) {
  // Estimated metrics based on artisanal bakery standard ratios
  const estimatedFoodCostPct = 26.5; // Coût matière 26.5%
  const foodCostEur = Math.round(((todayRevenue * estimatedFoodCostPct) / 100) * 100) / 100;
  const grossMarginEur = Math.round((todayRevenue - foodCostEur) * 100) / 100;
  const grossMarginPct = 100 - estimatedFoodCostPct;

  const categoriesShare = [
    { name: 'Boulangerie (Pains & Baguettes)', sharePct: 44, color: 'bg-amber-600', text: 'text-amber-800' },
    { name: 'Viennoiserie & Feuilletage', sharePct: 24, color: 'bg-orange-500', text: 'text-orange-800' },
    { name: 'Pâtisserie Fine', sharePct: 18, color: 'bg-purple-600', text: 'text-purple-800' },
    { name: 'Snacking & Déjeuner', sharePct: 14, color: 'bg-emerald-600', text: 'text-emerald-800' },
  ];

  function handleExportReport() {
    const reportText = `ERP-BOUL - RAPPORT FINANCIER & RENTABILITE
Date: ${new Date().toLocaleDateString('fr-FR')}
--------------------------------------------------
Chiffre d'Affaires du Jour : ${todayRevenue.toFixed(2)} € TTC
Coût Matières Premières Estimé : ${foodCostEur.toFixed(2)} € (${estimatedFoodCostPct}%)
Marge Brute Globale : ${grossMarginEur.toFixed(2)} € (${grossMarginPct.toFixed(1)}%)
Pertes / Invendus constatés : ${wasteValue.toFixed(2)} €
Taux de Perte : ${todayRevenue > 0 ? ((wasteValue / todayRevenue) * 100).toFixed(2) : '0.00'}%
--------------------------------------------------
Produits Phares & Marges :
${recipes
  .map(
    (r) =>
      `- ${r.name}: Vente ${r.sellingPrice.toFixed(2)} € | Coût ${r.costPricePerPiece.toFixed(2)} € | Marge ${((r.sellingPrice - r.costPricePerPiece) / r.sellingPrice * 100).toFixed(1)}%`
  )
  .join('\n')}
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-financier-boulangerie-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Rentabilité, Marges & Food Cost
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyse des coefficients multiplicateurs, coûts de revient matières et freinte
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-amber-400" />
          Exporter le Bilan Financier
        </button>
      </div>

      {/* 4 Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 block">
            Chiffre d Affaires Réalisé
          </span>
          <span className="text-2xl font-black font-mono text-slate-900 mt-2 block">
            {todayRevenue.toFixed(2)} €
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> En progression régulière
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 block">
            Food Cost (Coût Matières)
          </span>
          <span className="text-2xl font-black font-mono text-amber-700 mt-2 block">
            {foodCostEur.toFixed(2)} €
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Ratio : <strong className="text-slate-800">{estimatedFoodCostPct}%</strong> (Cible artisanale : 25-28%)
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 block">
            Marge Brute Dégagée
          </span>
          <span className="text-2xl font-black font-mono text-emerald-700 mt-2 block">
            {grossMarginEur.toFixed(2)} €
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            Taux de marge : {grossMarginPct.toFixed(1)}%
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 block">
            Pertes & Démarque Invendus
          </span>
          <span className={`text-2xl font-black font-mono mt-2 block ${
            wasteValue > 0 ? 'text-rose-600' : 'text-slate-900'
          }`}>
            {wasteValue.toFixed(2)} €
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Recyclé en chapelure & dons
          </span>
        </div>
      </div>

      {/* Sales share & profitability table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Col: Category Revenue Shares */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-600" />
            Répartition des Ventes par Rayon
          </h3>

          <div className="space-y-3">
            {categoriesShare.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                  <strong className="font-mono text-slate-900">{cat.sharePct}%</strong>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${cat.color} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${cat.sharePct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2 mt-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Règle d Or du Compagnon</span>
            </div>
            <p className="leading-relaxed">
              La <strong>Boulangerie de Tradition</strong> génère le flux client quotidien (marge 75%), tandis que la <strong>Viennoiserie</strong> et la <strong>Pâtisserie</strong> boostent le panier moyen avec des marges supérieures à 78%.
            </p>
          </div>
        </div>

        {/* Right 2 Cols: Unit Economics & Recipe Cost Margins */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              Coût de Revient Matière & Coefficient Multiplicateur
            </h3>
            <span className="text-xs text-slate-400">Calcul sur recettes réelles</span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-slate-200 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Produit Artisan</th>
                    <th className="py-2.5 px-3 text-right">Prix Vente TTC</th>
                    <th className="py-2.5 px-3 text-right">Coût Matière</th>
                    <th className="py-2.5 px-3 text-right text-emerald-300">Marge Brute</th>
                    <th className="py-2.5 px-3 text-center">Coeff. Multiplicateur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {recipes.map((rec) => {
                    const grossMargin = rec.sellingPrice - rec.costPricePerPiece;
                    const marginPct = Math.round((grossMargin / rec.sellingPrice) * 100);
                    const coeff = (rec.sellingPrice / rec.costPricePerPiece).toFixed(1);

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3">
                          <strong className="text-slate-900 block">{rec.name}</strong>
                          <span className="text-[10px] text-slate-400">{rec.category}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {rec.sellingPrice.toFixed(2)} €
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-rose-700">
                          {rec.costPricePerPiece.toFixed(2)} €
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                          +{grossMargin.toFixed(2)} € ({marginPct}%)
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200">
                            x{coeff}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
