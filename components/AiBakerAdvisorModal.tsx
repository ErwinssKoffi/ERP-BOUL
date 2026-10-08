'use client';

import React, { useState } from 'react';
import { X, Sparkles, ChefHat, CloudSun, Loader2, Plus, Check, Lightbulb } from 'lucide-react';
import { Recipe } from '@/lib/types';

interface AiBakerAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeCreated: (recipe: Recipe) => void;
}

export function AiBakerAdvisorModal({ isOpen, onClose, onRecipeCreated }: AiBakerAdvisorModalProps) {
  const [activeMode, setActiveMode] = useState<'create_recipe' | 'optimize_weather' | 'custom_advice'>('create_recipe');
  const [recipeName, setRecipeName] = useState('');
  const [recipeCategory, setRecipeCategory] = useState<'Boulangerie' | 'Viennoiserie' | 'Pâtisserie' | 'Snacking'>('Boulangerie');
  const [yieldPieces, setYieldPieces] = useState(60);
  const [weatherCondition, setWeatherCondition] = useState('Pluvieux et frais (14°C, 85% humidité ambiante)');
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [parsedRecipe, setParsedRecipe] = useState<Recipe | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleGenerate() {
    setLoading(true);
    setAiResponse(null);
    setParsedRecipe(null);
    setAddedSuccess(false);

    try {
      let payload: Record<string, unknown> = {};

      if (activeMode === 'create_recipe') {
        payload = {
          action: 'create_recipe',
          recipeParams: {
            name: recipeName || 'Pain aux Noix & Miel du Gâtinais',
            category: recipeCategory,
            yieldPieces,
          },
        };
      } else if (activeMode === 'optimize_weather') {
        payload = {
          action: 'optimize_weather',
          prompt: weatherCondition,
        };
      } else {
        payload = {
          action: 'custom_advice',
          prompt: customQuestion || 'Comment optimiser le coût matière de ma gamme viennoiserie ?',
        };
      }

      const res = await fetch('/api/bakery-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.text) {
        setAiResponse(data.text);

        // Try to parse recipe JSON if in create_recipe mode
        if (activeMode === 'create_recipe') {
          try {
            // Clean markdown code blocks if any
            let clean = data.text.trim();
            if (clean.startsWith('```json')) clean = clean.slice(7);
            if (clean.startsWith('```')) clean = clean.slice(3);
            if (clean.endsWith('```')) clean = clean.slice(0, -3);
            clean = clean.trim();

            const parsed = JSON.parse(clean);
            if (parsed.name && parsed.ingredients) {
              const fullRecipe: Recipe = {
                id: `rec-ai-${Date.now()}`,
                name: parsed.name,
                category: parsed.category || recipeCategory,
                portionYield: parsed.portionYield || yieldPieces,
                unitWeightGrams: parsed.unitWeightGrams || 400,
                flourBaseKg: parsed.flourBaseKg || 15,
                bakingTempC: parsed.bakingTempC || 240,
                bakingDurationMin: parsed.bakingDurationMin || 25,
                costPricePerPiece: parsed.costPricePerPiece || 0.45,
                sellingPrice: parsed.sellingPrice || 2.50,
                allergens: parsed.allergens || ['Gluten'],
                ingredients: (parsed.ingredients || []).map((ing: any, idx: number) => ({
                  id: `ing-ai-${idx}`,
                  name: ing.name,
                  bakerPercentage: ing.bakerPercentage || 50,
                  quantityGramsPerPiece: ing.quantityGramsPerPiece || 100,
                  unit: ing.unit || 'kg',
                  costPerUnit: 1.0,
                })),
                steps: (parsed.steps || []).map((st: any) => ({
                  step: st.step,
                  durationMin: st.durationMin || 15,
                  description: st.description || '',
                  temperatureC: st.temperatureC,
                })),
              };
              setParsedRecipe(fullRecipe);
            }
          } catch {
            // Text response without valid JSON - displayed as rich advice text
          }
        }
      }
    } catch (err) {
      console.error(err);
      setAiResponse("Erreur de connexion avec l'assistant de fournil. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  function handleAddGeneratedRecipe() {
    if (parsedRecipe) {
      onRecipeCreated(parsedRecipe);
      setAddedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Compagnon de Fournil & IA Artisanale</h2>
                <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded font-mono">
                  Gemini Flash 2.5
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Génération de recettes au % du boulanger, ajustement météo & conseils de rentabilité
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

        {/* Tab buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveMode('create_recipe')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeMode === 'create_recipe'
                ? 'border-purple-600 text-purple-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            Créer une Nouvelle Recette Pro
          </button>
          <button
            onClick={() => setActiveMode('optimize_weather')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeMode === 'optimize_weather'
                ? 'border-purple-600 text-purple-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            Ajustement Météo & Étuve
          </button>
          <button
            onClick={() => setActiveMode('custom_advice')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeMode === 'custom_advice'
                ? 'border-purple-600 text-purple-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Conseil & Réduction Pertes
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {activeMode === 'create_recipe' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom du pain ou de la création (ex: Brioche feuilletée aux pralines, Focaccia romarin...)
                </label>
                <input
                  type="text"
                  placeholder="ex: Pain de Meule aux Figues & Noix du Périgord"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={recipeCategory}
                    onChange={(e) => setRecipeCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  >
                    <option value="Boulangerie">Boulangerie (Pains & Baguettes)</option>
                    <option value="Viennoiserie">Viennoiserie & Feuilletage</option>
                    <option value="Pâtisserie">Pâtisserie Fine</option>
                    <option value="Snacking">Snacking & Traiteur Salé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rendement visé</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={yieldPieces}
                      onChange={(e) => setYieldPieces(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">pièces</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMode === 'optimize_weather' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Conditions météo et ambiance du fournil aujourd hui
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Pluvieux et frais (14°C, 85% humidité ambiante)',
                  'Canicule estivale (32°C, 35% humidité, fournil à 28°C)',
                  'Matin glacial d hiver (2°C extérieur, 17°C fournil)',
                  'Temps doux de printemps (20°C, 50% humidité)',
                ].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeatherCondition(w)}
                    className={`p-2.5 text-xs text-left rounded-lg border font-medium transition cursor-pointer ${
                      weatherCondition === w
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeMode === 'custom_advice' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Posez une question technique ou financière
              </label>
              <textarea
                rows={3}
                placeholder="ex: Comment valoriser 15 baguettes d'hier pour créer une nouvelle référence snacking rentable ?"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calcul des formules artisanales...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  Générer l expertise
                </>
              )}
            </button>
          </div>

          {/* AI Response Display */}
          {aiResponse && (
            <div className="mt-4 p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Recommandation Maître Artisan
                </span>
                {parsedRecipe && !addedSuccess && (
                  <button
                    onClick={handleAddGeneratedRecipe}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter à l ERP
                  </button>
                )}
                {addedSuccess && (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                    <Check className="w-4 h-4" /> Recette importée avec succès !
                  </span>
                )}
              </div>

              {parsedRecipe ? (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-lg">
                    <div>
                      <strong className="text-white text-sm block">{parsedRecipe.name}</strong>
                      <span className="text-slate-400">
                        {parsedRecipe.portionYield} pièces de {parsedRecipe.unitWeightGrams}g • Cuisson {parsedRecipe.bakingTempC}°C ({parsedRecipe.bakingDurationMin} min)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">
                        Coût : {parsedRecipe.costPricePerPiece.toFixed(2)} € / pièce
                      </span>
                      <span className="text-amber-300 font-semibold">
                        Prix vente suggéré : {parsedRecipe.sellingPrice.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-300 block mb-1">Ingrédients & % du boulanger :</span>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {parsedRecipe.ingredients.map((ing, i) => (
                        <div key={i} className="flex justify-between text-slate-300">
                          <span>{ing.name}</span>
                          <span className="text-amber-400 font-mono font-bold">
                            {ing.bakerPercentage}% ({ing.quantityGramsPerPiece}g)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-300 block mb-1">Protocole de fabrication :</span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {parsedRecipe.steps.map((st, i) => (
                        <li key={i}>
                          <strong className="text-white">{st.step} ({st.durationMin} min)</strong>: {st.description}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {aiResponse}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
