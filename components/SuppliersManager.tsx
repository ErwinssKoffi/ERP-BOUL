'use client';

import React, { useState } from 'react';
import {
  Truck,
  Phone,
  Mail,
  Clock,
  Euro,
  FileSpreadsheet,
  Plus,
  Send,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { Supplier, StockItem } from '@/lib/types';

interface SuppliersManagerProps {
  suppliers: Supplier[];
  stocks: StockItem[];
}

export function SuppliersManager({ suppliers, stocks }: SuppliersManagerProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSentSuccess, setOrderSentSuccess] = useState(false);

  // Simple purchase order lines
  const [orderLines, setOrderLines] = useState<Array<{ name: string; quantity: number; unit: string }>>([
    { name: 'Farine T65 Tradition Label Rouge', quantity: 20, unit: 'sacs 25kg' },
  ]);

  function handleOpenOrderModal(supplier: Supplier) {
    setSelectedSupplier(supplier);
    // Find stocks related to this supplier to prefill
    const matchingStocks = stocks.filter((s) => s.supplierName.includes(supplier.name.split(' ')[0]));
    if (matchingStocks.length > 0) {
      setOrderLines(
        matchingStocks.map((s) => ({
          name: s.name,
          quantity: Math.max(1, Math.round(s.minAlertThreshold * 1.5 - s.quantity)),
          unit: s.unit,
        }))
      );
    } else {
      setOrderLines([{ name: 'Commande courante réassort', quantity: 10, unit: 'unités' }]);
    }
    setOrderSentSuccess(false);
    setIsOrderModalOpen(true);
  }

  function handleSendOrder(e: React.FormEvent) {
    e.preventDefault();
    setOrderSentSuccess(true);
    setTimeout(() => {
      setIsOrderModalOpen(false);
      setOrderSentSuccess(false);
    }, 1500);
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Fournisseurs Agréés & Achats Matières
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Meuniers régionaux, coopératives laitières, maisons de chocolat et cartonnerie
          </p>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((sup) => (
          <div
            key={sup.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 transition shadow-xs hover:shadow-md flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{sup.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{sup.specialty}</p>
                </div>
                <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <Building className="w-5 h-5" />
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Interlocuteur</span>
                  <strong className="text-slate-800">{sup.contactPerson}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Délai Livraison</span>
                  <strong className="text-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" /> {sup.leadTimeDays} jours ouvrés
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Téléphone</span>
                  <span className="text-slate-800 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {sup.phone}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Franco de Port</span>
                  <strong className="text-slate-800 font-mono">Min. {sup.minOrderEur} €</strong>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{sup.email}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Partenaire certifié</span>
              <button
                onClick={() => handleOpenOrderModal(sup)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                Générer Bon de Commande
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PURCHASE ORDER MODAL */}
      {isOrderModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-amber-600/30">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                Bon de Commande : {selectedSupplier.name}
              </h3>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendOrder} className="p-6 space-y-4">
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span>Délai habituel : <strong>{selectedSupplier.leadTimeDays} jours</strong> • Envoi direct à <strong>{selectedSupplier.email}</strong></span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Lignes de commande réapprovisionnement :
                </label>

                <div className="space-y-2">
                  {orderLines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        value={line.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setOrderLines((prev) => prev.map((l, i) => (i === idx ? { ...l, name: val } : l)));
                        }}
                        className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setOrderLines((prev) => prev.map((l, i) => (i === idx ? { ...l, quantity: val } : l)));
                        }}
                        className="w-16 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                      />
                      <span className="text-slate-500 w-12 text-[11px]">{line.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {orderSentSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Bon de commande généré et expédié avec succès au meunier/fournisseur !
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={orderSentSuccess}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  Transmettre la Commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
