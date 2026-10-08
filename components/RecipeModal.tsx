'use client';

import React from 'react';
import { X, ChefHat, Flame, Scale, Clock, AlertCircle, PlayCircle, Euro } from 'lucide-react';
import { Recipe } from '@/lib/types';

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchBatch: (recipe: Recipe) => void;
}

export function RecipeModal({ recipe, isOpen, onClose, onLaunchBatch }: RecipeModalProps) {
  if (!isOpen || !recipe) return null;

  const grossMargin = recipe.sellingPrice - recipe.costPricePerPiece;
  const marginPct = Math.round((grossMargin / recipe.sellingPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-amber-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{recipe.name}</h2>
                <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-semibold">
                  {recipe.category}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Fiche technique professionnelle • Pâton unitaire {recipe.unitWeightGrams}g
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Key metrics overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block uppercase font-medium">Fournée Standard</span>
              <span className="text-lg font-bold text-slate-900">{recipe.portionYield} pcs</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block uppercase font-medium">Cuisson Four</span>
              <span className="text-lg font-bold text-amber-700 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-amber-600" />
                {recipe.bakingTempC}°C ({recipe.bakingDurationMin}m)
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block uppercase font-medium">Coût Matière / pc</span>
              <span className="text-lg font-bold text-rose-700">{recipe.costPricePerPiece.toFixed(2)} €</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-[11px] text-emerald-700 block uppercase font-medium">Marge Brute</span>
              <span className="text-lg font-bold text-emerald-800">
                {grossMargin.toFixed(2)} € ({marginPct}%)
              </span>
            </div>
          </div>

          {/* Allergens warning */}
          {recipe.allergens && recipe.allergens.length > 0 && (
            <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Allergènes déclarés (Règlement INCO) :</strong>{' '}
                {recipe.allergens.join(', ')}
              </span>
            </div>
          )}

          {/* Ingredients table with Baker's Percentage */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-600" />
              Composition & Pourcentage du Boulanger (Base Farine 100%)
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Matière Première</th>
                    <th className="py-2.5 px-3 font-semibold text-center">% Boulanger</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Grammes / Pâton</th>
                    <th className="py-2.5 px-3 font-semibold text-right text-amber-300">
                      Pesée Fournée ({recipe.portionYield} pcs)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {recipe.ingredients.map((ing) => {
                    const totalGrams = ing.quantityGramsPerPiece * recipe.portionYield;
                    const displayTotal =
                      totalGrams >= 1000
                        ? `${(totalGrams / 1000).toFixed(2)} kg`
                        : `${Math.round(totalGrams)} g`;

                    return (
                      <tr key={ing.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-medium text-slate-900">{ing.name}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-amber-700">
                          {ing.bakerPercentage}%
                        </td>
                        <td className="py-2 px-3 text-right text-slate-600">{ing.quantityGramsPerPiece} g</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {displayTotal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Process steps */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Protocole Opératoire du Fournil
            </h3>
            <div className="space-y-2">
              {recipe.steps.map((st, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-900">{st.step}</strong>
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                        {st.durationMin} min {st.temperatureC ? `• ${st.temperatureC}°C` : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{st.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Prix de vente conseillé en boutique :{' '}
            <strong className="text-slate-900 text-sm">{recipe.sellingPrice.toFixed(2)} € TTC</strong>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onLaunchBatch(recipe);
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition shadow-md shadow-amber-600/20 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              Lancer une Fournée au Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
