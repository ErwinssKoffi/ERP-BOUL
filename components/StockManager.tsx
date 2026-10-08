'use client';

import React, { useState } from 'react';
import {
  PackageCheck,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Truck,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpDown,
  TrendingDown,
} from 'lucide-react';
import { StockItem } from '@/lib/types';

interface StockManagerProps {
  stocks: StockItem[];
  onUpdateStockQuantity: (id: string, delta: number) => void;
  onAddStockItem: (item: Omit<StockItem, 'id' | 'lastRestocked'>) => void;
}

export function StockManager({ stocks, onUpdateStockQuantity, onAddStockItem }: StockManagerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [quickRestockId, setQuickRestockId] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(25);

  // New Item Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<StockItem['category']>('Farines');
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState<StockItem['unit']>('kg');
  const [minAlertThreshold, setMinAlertThreshold] = useState(50);
  const [costPerUnit, setCostPerUnit] = useState(1.0);
  const [supplierName, setSupplierName] = useState('Moulins Viron');
  const [lotNumber, setLotNumber] = useState('LOT-2026-');
  const [dluoDate, setDluoDate] = useState('2026-12-31');

  // Filter
  const filteredStocks = stocks.filter((s) => {
    const matchesCat = activeCategory === 'TOUS' || s.category === activeCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lotNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Total inventory valuation
  const totalStockValue = stocks.reduce((acc, s) => acc + s.quantity * s.costPerUnit, 0);
  const alertCount = stocks.filter((s) => s.quantity <= s.minAlertThreshold).length;

  function handleCreateItemSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    onAddStockItem({
      name,
      category,
      quantity,
      unit,
      minAlertThreshold,
      costPerUnit,
      supplierName,
      lotNumber,
      dluoDate,
    });

    setIsAddItemModalOpen(false);
    setName('');
  }

  function handleQuickRestockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (quickRestockId && restockAmount > 0) {
      onUpdateStockQuantity(quickRestockId, restockAmount);
      setQuickRestockId(null);
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner & KPI summary */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Gestion des Stocks & Traçabilité Matières Premières
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des silos de farine, beurres AOP, chocolats, numéros de lots et dates DLUO
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">
              Valeur Totale du Stock
            </span>
            <span className="text-sm font-black text-slate-900 font-mono">
              {totalStockValue.toFixed(2)} €
            </span>
          </div>

          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Nouvel Ingrédient
          </button>
        </div>
      </div>

      {/* Low stock alert banner if any */}
      {alertCount > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>
              <strong>Alerte Réapprovisionnement :</strong> {alertCount} ingrédient(s) ont atteint ou dépassé le seuil minimum de sécurité.
            </span>
          </div>
          <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
            Commande fournisseur conseillée
          </span>
        </div>
      )}

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher un ingrédient, meunier, numéro de lot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {['TOUS', 'Farines', 'Matières Grasses', 'Levures & Levains', 'Chocolat & Pâtisserie', 'Emballages & Consommables'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Ingrédient & Catégorie</th>
                <th className="py-3 px-4">Fournisseur & Lot</th>
                <th className="py-3 px-4 text-center">DLUO / Expiration</th>
                <th className="py-3 px-4 text-right">Seuil Alerte</th>
                <th className="py-3 px-4 text-right">Stock Actuel</th>
                <th className="py-3 px-4 text-right">Valeur Stock</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStocks.map((item) => {
                const isUnderThreshold = item.quantity <= item.minAlertThreshold;
                const value = item.quantity * item.costPerUnit;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block text-xs">{item.name}</strong>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.category} • Coût : {item.costPerUnit.toFixed(2)} € / {item.unit}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-700 block font-medium">{item.supplierName}</span>
                      <span className="font-mono text-[10px] text-slate-400">Lot: {item.lotNumber}</span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {item.dluoDate}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right text-slate-500 font-mono">
                      {item.minAlertThreshold} {item.unit}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <strong className={`font-mono text-sm font-black ${
                          isUnderThreshold ? 'text-rose-600' : 'text-slate-900'
                        }`}>
                          {item.quantity} {item.unit}
                        </strong>
                        {isUnderThreshold && (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" title="Sous le seuil d alerte !" />
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                      {value.toFixed(2)} €
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onUpdateStockQuantity(item.id, -5)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold cursor-pointer"
                          title="Déduire 5 unités (utilisation fournil)"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => {
                            setQuickRestockId(item.id);
                            setRestockAmount(25);
                          }}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-bold transition cursor-pointer"
                          title="Entrée de stock réapprovisionnement"
                        >
                          + Réassort
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK RESTOCK MODAL */}
      {quickRestockId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-amber-600/30">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                Entrée de Réassort en Stock
              </h3>
              <button
                onClick={() => setQuickRestockId(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickRestockSubmit} className="p-6 space-y-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Matière sélectionnée :</span>
                <strong className="text-xs text-slate-900 block">
                  {stocks.find((s) => s.id === quickRestockId)?.name}
                </strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantité reçue du fournisseur
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex gap-1">
                    {[10, 25, 50, 100].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setRestockAmount(quick)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer"
                      >
                        +{quick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickRestockId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Valider la Réception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW ITEM MODAL */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-amber-600/30">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                Ajouter une Matière Première au Stock
              </h3>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItemSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom de l ingrédient / emballage *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Farine d Épeautre Non Hybridée Bio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                  >
                    <option value="Farines">Farines & Céréales</option>
                    <option value="Matières Grasses">Matières Grasses & Beurre</option>
                    <option value="Levures & Levains">Levures & Levains</option>
                    <option value="Chocolat & Pâtisserie">Chocolat & Pâtisserie</option>
                    <option value="Emballages & Consommables">Emballages & Consommables</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unité</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                  >
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="unités">unités</option>
                    <option value="sacs 25kg">sacs 25kg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantité Initiale</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seuil Alerte</label>
                  <input
                    type="number"
                    value={minAlertThreshold}
                    onChange={(e) => setMinAlertThreshold(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prix Achat (€)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fournisseur</label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Numéro de Lot</label>
                  <input
                    type="text"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date Limite (DLUO / DLC)
                </label>
                <input
                  type="date"
                  value={dluoDate}
                  onChange={(e) => setDluoDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Ajouter au Référentiel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
