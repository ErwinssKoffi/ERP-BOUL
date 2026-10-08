'use client';

import React, { useState } from 'react';
import { X, Calculator, Droplets, Thermometer, Flame, Scale, Check, AlertTriangle } from 'lucide-react';
import { Recipe } from '@/lib/types';

interface DoughCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
}

export function DoughCalculatorModal({ isOpen, onClose, recipes }: DoughCalculatorModalProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || 'rec-1');
  const [targetPieces, setTargetPieces] = useState<number>(150);
  
  // Base Temperature variables
  const [targetBaseTemp, setTargetBaseTemp] = useState<number>(54); // Recommandé: 54°C
  const [roomTemp, setRoomTemp] = useState<number>(21.5); // T° air
  const [flourTemp, setFlourTemp] = useState<number>(20.0); // T° farine

  if (!isOpen) return null;

  const currentRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0];
  
  // Water temperature calculation
  const calculatedWaterTemp = Math.round((targetBaseTemp - roomTemp - flourTemp) * 10) / 10;
  
  // Batch calculations
  const unitWeight = currentRecipe ? currentRecipe.unitWeightGrams : 350;
  const totalDoughKg = Math.round(((targetPieces * unitWeight) / 1000) * 10) / 10;
  
  // Scaling ratio compared to original portion yield
  const scaleRatio = targetPieces / (currentRecipe?.portionYield || 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-amber-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Calculateur de Pétrissée & Température de Base (TB)</h2>
              <p className="text-xs text-slate-300">Formule artisanale du fournil selon le pourcentage du boulanger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Température de Base */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                  Calcul de la Température de Coulée de l Eau (Règle TB)
                </h3>
              </div>
              <span className="text-xs bg-amber-200/70 text-amber-900 px-2.5 py-0.5 rounded-full font-semibold">
                T° de Pâte Visée : 24°C
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Formule des Compagnons : <strong className="text-slate-900">T° Eau = TB - T° Fournil - T° Farine</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Température de Base (TB visée)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetBaseTemp}
                    onChange={(e) => setTargetBaseTemp(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">°C</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Spirale: 52-54°C • Oblique: 56°C</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  T° Ambiante du Fournil
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={roomTemp}
                    onChange={(e) => setRoomTemp(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">°C</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Thermomètre d ambiance</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  T° de la Farine (Silo / Sac)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={flourTemp}
                    onChange={(e) => setFlourTemp(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">°C</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Sonde au cœur du sac</span>
              </div>
            </div>

            {/* Result callout */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-xs text-slate-600 block">Température requise de l eau de coulée :</span>
                  <strong className="text-lg font-black text-slate-900 font-mono">
                    {calculatedWaterTemp} °C
                  </strong>
                </div>
              </div>

              {calculatedWaterTemp < 10 ? (
                <div className="flex items-center gap-1.5 text-xs text-blue-800 bg-blue-100 px-3 py-1.5 rounded-md font-medium">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                  <span>Utiliser de l eau réfrigérée ou 15% de glace pilée</span>
                </div>
              ) : calculatedWaterTemp > 24 ? (
                <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-100 px-3 py-1.5 rounded-md font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Eau tiédie requise (risque de fermentation lente sinon)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-md font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Eau du réseau tempérée prête pour coulage direct</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Recette & Dimensionnement de Pétrissée */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-600" />
                Dimensionnement de Pétrissée Dynamique
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sélectionner la fiche technique
                </label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de pièces souhaitées
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    value={targetPieces}
                    onChange={(e) => setTargetPieces(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex gap-1">
                    {[50, 100, 200].map((quick) => (
                      <button
                        key={quick}
                        onClick={() => setTargetPieces(quick)}
                        className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium border border-slate-300 cursor-pointer"
                      >
                        {quick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary statistics */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-100 rounded-xl text-center">
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-medium">Poids unitaire pâte</span>
                <span className="text-base font-bold text-slate-900">{unitWeight} g</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-medium">Masse totale pâte</span>
                <span className="text-base font-bold text-amber-700">{totalDoughKg} kg</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-medium">Coût matière estimé</span>
                <span className="text-base font-bold text-emerald-700">
                  {((currentRecipe?.costPricePerPiece || 0.3) * targetPieces).toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Calculated ingredient breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">
                Pesée précise des ingrédients au pétrin :
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-200">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Ingrédient</th>
                      <th className="py-2 px-3 font-semibold text-center">% Boulanger</th>
                      <th className="py-2 px-3 font-semibold text-right">Grammes / Pièce</th>
                      <th className="py-2 px-3 font-semibold text-right text-amber-300">Pesée Totale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {currentRecipe?.ingredients.map((ing) => {
                      const totalGrams = ing.quantityGramsPerPiece * targetPieces;
                      const formattedWeight =
                        totalGrams >= 1000
                          ? `${(totalGrams / 1000).toFixed(2)} kg`
                          : `${Math.round(totalGrams)} g`;

                      return (
                        <tr key={ing.id} className="hover:bg-amber-50/50">
                          <td className="py-2.5 px-3 font-medium text-slate-900">{ing.name}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                            {ing.bakerPercentage}%
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-500">
                            {ing.quantityGramsPerPiece} g
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                            {formattedWeight}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Baking notes */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                Cuisson recommandée : <strong className="font-bold">{currentRecipe?.bakingTempC}°C</strong> pendant <strong className="font-bold">{currentRecipe?.bakingDurationMin} min</strong>.
              </span>
              <span className="text-slate-600 italic text-[11px]">
                Informer le tourier & chef de four
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Fermer le Calculateur
          </button>
        </div>
      </div>
    </div>
  );
}
