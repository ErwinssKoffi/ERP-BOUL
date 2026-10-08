'use client';

import React, { useState } from 'react';
import {
  ChefHat,
  Flame,
  Plus,
  PlayCircle,
  Clock,
  Sparkles,
  Calculator,
  Search,
  CheckCircle2,
  Filter,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Recipe, ProductionBatch, CategoryType, BatchStatus } from '@/lib/types';

interface ProductionBakehouseProps {
  recipes: Recipe[];
  batches: ProductionBatch[];
  onOpenRecipe: (recipe: Recipe) => void;
  onOpenDoughCalc: () => void;
  onOpenAiAdvisor: () => void;
  onUpdateBatchStatus: (batchId: string, newStatus: BatchStatus) => void;
  onAddBatch: (batch: Omit<ProductionBatch, 'id' | 'createdAt'>) => void;
}

export function ProductionBakehouse({
  recipes,
  batches,
  onOpenRecipe,
  onOpenDoughCalc,
  onOpenAiAdvisor,
  onUpdateBatchStatus,
  onAddBatch,
}: ProductionBakehouseProps) {
  const [activeCategory, setActiveCategory] = useState<string>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilterStatus, setBatchFilterStatus] = useState<string>('TOUS');
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);

  // New batch form state
  const [selectedRecipeId, setSelectedRecipeId] = useState(recipes[0]?.id || '');
  const [plannedPieces, setPlannedPieces] = useState(150);
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [bakerName, setBakerName] = useState('Maxime (Chef Boulanger)');
  const [ovenNumber, setOvenNumber] = useState(1);
  const [batchNotes, setBatchNotes] = useState('');

  // Filter recipes
  const filteredRecipes = recipes.filter((r) => {
    const matchesCat = activeCategory === 'TOUS' || r.category === activeCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filter batches
  const filteredBatches = batches.filter((b) => {
    if (batchFilterStatus === 'TOUS') return true;
    return b.status === batchFilterStatus;
  });

  function handleCreateBatchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const recipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0];
    if (!recipe) return;

    const newBatchNumber = `FOU-2026-${Math.floor(100 + Math.random() * 900)}`;

    onAddBatch({
      batchNumber: newBatchNumber,
      recipeId: recipe.id,
      recipeName: recipe.name,
      category: recipe.category,
      plannedPieces,
      status: 'PLANIFIE',
      scheduledTime,
      bakerName,
      ovenNumber,
      notes: batchNotes,
    });

    setIsNewBatchModalOpen(false);
    setBatchNotes('');
  }

  return (
    <div className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Fournil & Fiches Techniques
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilotage des pétrissées, formules au % du boulanger et planning des cuissons
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenDoughCalc}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-amber-600" />
            Calculateur TB Fournil
          </button>
          <button
            onClick={onOpenAiAdvisor}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs rounded-xl border border-purple-200 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Assistant Recette IA
          </button>
          <button
            onClick={() => setIsNewBatchModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Planifier une Fournée
          </button>
        </div>
      </div>

      {/* SECTION 1: Active Production Batches (Planning du jour) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" />
              Planning des Fournées du Jour ({batches.length})
            </h3>
            <p className="text-xs text-slate-500">
              Flux continu : Pétrissage ➔ Pousse ➔ Four ➔ Prêt pour mise en rayon
            </p>
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {['TOUS', 'PLANIFIE', 'PETRISSAGE', 'POUSSE', 'FOUR', 'TERMINE'].map((st) => (
              <button
                key={st}
                onClick={() => setBatchFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                  batchFilterStatus === st
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'TOUS' ? 'Toutes' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Batches Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBatches.map((batch) => {
            const statusConfig: Record<BatchStatus, { label: string; border: string; bg: string; text: string }> = {
              PLANIFIE: { label: 'Planifié', border: 'border-slate-200', bg: 'bg-slate-100', text: 'text-slate-700' },
              PETRISSAGE: { label: 'Pétrissage', border: 'border-blue-300', bg: 'bg-blue-100', text: 'text-blue-800' },
              POUSSE: { label: 'En Pousse', border: 'border-amber-300', bg: 'bg-amber-100', text: 'text-amber-800' },
              FOUR: { label: 'Au Four (Cuisson)', border: 'border-orange-500 bg-orange-50/40', bg: 'bg-orange-500 text-white animate-pulse', text: 'text-white' },
              TERMINE: { label: 'Terminé / En Rayon', border: 'border-emerald-300 bg-emerald-50/20', bg: 'bg-emerald-100', text: 'text-emerald-800' },
            };

            const conf = statusConfig[batch.status] || statusConfig.PLANIFIE;

            return (
              <div
                key={batch.id}
                className={`p-4 rounded-xl border ${conf.border} bg-white shadow-2xs hover:shadow-md transition flex flex-col justify-between gap-3`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {batch.batchNumber}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${conf.bg} ${conf.text}`}>
                      {conf.label}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{batch.recipeName}</h4>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Quantité</span>
                      <strong className="text-slate-800">{batch.plannedPieces} pièces</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Heure four</span>
                      <strong className="text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> {batch.scheduledTime}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Équipement</span>
                      <strong className="text-slate-800">Four à Soles #{batch.ovenNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Responsable</span>
                      <strong className="text-slate-800 truncate block">{batch.bakerName}</strong>
                    </div>
                  </div>

                  {batch.notes && (
                    <p className="mt-2 text-xs text-slate-500 italic bg-amber-50/50 p-1.5 rounded border border-amber-100">
                      "{batch.notes}"
                    </p>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Étape suivante :</span>
                  {batch.status === 'PLANIFIE' && (
                    <button
                      onClick={() => onUpdateBatchStatus(batch.id, 'PETRISSAGE')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition"
                    >
                      Pétrissage ➔
                    </button>
                  )}
                  {batch.status === 'PETRISSAGE' && (
                    <button
                      onClick={() => onUpdateBatchStatus(batch.id, 'POUSSE')}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg cursor-pointer transition"
                    >
                      Mettre en Pousse ➔
                    </button>
                  )}
                  {batch.status === 'POUSSE' && (
                    <button
                      onClick={() => onUpdateBatchStatus(batch.id, 'FOUR')}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg cursor-pointer transition"
                    >
                      Enfourner (Cuire) ➔
                    </button>
                  )}
                  {batch.status === 'FOUR' && (
                    <button
                      onClick={() => onUpdateBatchStatus(batch.id, 'TERMINE')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Défourner / Terminé
                    </button>
                  )}
                  {batch.status === 'TERMINE' && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Disponible en boutique
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Catalog of Recipes & Technical Sheets */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-amber-600" />
              Catalogue des Recettes & Fiches Techniques ({recipes.length})
            </h3>
            <p className="text-xs text-slate-500">
              Formules certifiées avec pourcentage du boulanger, temps de pointage et calcul de marge
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 w-48 sm:w-60"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {['TOUS', 'Boulangerie', 'Viennoiserie', 'Pâtisserie', 'Snacking'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => {
            const margin = recipe.sellingPrice - recipe.costPricePerPiece;
            const marginPct = Math.round((margin / recipe.sellingPrice) * 100);

            return (
              <div
                key={recipe.id}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-400 transition shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {recipe.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Pâton : <strong className="text-slate-800">{recipe.unitWeightGrams} g</strong>
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition">
                    {recipe.name}
                  </h4>

                  <div className="mt-3 grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-lg text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Fournée</span>
                      <strong className="text-slate-800">{recipe.portionYield} pcs</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Cuisson</span>
                      <strong className="text-slate-800">{recipe.bakingTempC}°C</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Marge</span>
                      <strong className="text-emerald-700">{marginPct}%</strong>
                    </div>
                  </div>

                  {/* Ingredients highlight preview */}
                  <div className="mt-2.5 text-xs text-slate-500">
                    <span className="text-[11px] font-medium text-slate-400 block mb-1">
                      Ingrédients principaux :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded">
                          {ing.name} ({ing.bakerPercentage}%)
                        </span>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <span className="text-[10px] text-slate-400 px-1 py-0.5">
                          +{recipe.ingredients.length - 3} autres
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">Prix Vente</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {recipe.sellingPrice.toFixed(2)} €
                    </strong>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onOpenRecipe(recipe)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                      title="Voir la fiche technique complète"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRecipeId(recipe.id);
                        setPlannedPieces(recipe.portionYield);
                        setIsNewBatchModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      Lancer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: Planifier une nouvelle fournée */}
      {isNewBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-amber-600/30">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Planifier une Nouvelle Fournée
              </h3>
              <button
                onClick={() => setIsNewBatchModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatchSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recette à lancer
                </label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantité de pièces
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1500"
                    value={plannedPieces}
                    onChange={(e) => setPlannedPieces(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Heure prévue enfournement
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Responsable de la fournée
                  </label>
                  <input
                    type="text"
                    value={bakerName}
                    onChange={(e) => setBakerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Four assigné
                  </label>
                  <select
                    value={ovenNumber}
                    onChange={(e) => setOvenNumber(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value={1}>Four à Soles #1 (Baguettes & Pains)</option>
                    <option value={2}>Four Ventilé #2 (Viennoiserie)</option>
                    <option value={3}>Four Pâtisserie #3 (Choux & Biscuits)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes opératoires / Hydratation spéciale
                </label>
                <textarea
                  rows={2}
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  placeholder="ex: Augmenter le pointage de 10 min suite à température fraîche."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewBatchModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
                >
                  Valider et Intégrer au Planning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
