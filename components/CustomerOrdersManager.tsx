'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Cake,
  FileText,
  User,
} from 'lucide-react';
import { CustomerOrder, OrderStatus, POSProduct } from '@/lib/types';

interface CustomerOrdersManagerProps {
  orders: CustomerOrder[];
  products: POSProduct[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddOrder: (order: Omit<CustomerOrder, 'id' | 'createdAt'>) => void;
}

export function CustomerOrdersManager({
  orders,
  products,
  onUpdateOrderStatus,
  onAddOrder,
}: CustomerOrdersManagerProps) {
  const [statusFilter, setStatusFilter] = useState<string>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // New Order Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupDate, setPickupDate] = useState('2026-10-08');
  const [pickupTime, setPickupTime] = useState('11:00');
  const [orderItems, setOrderItems] = useState<Array<{ name: string; quantity: number; unitPrice: number }>>([
    { name: 'Gâteau Fraisier Personnalisé (8 pers.)', quantity: 1, unitPrice: 38.0 },
  ]);
  const [depositPaid, setDepositPaid] = useState<number>(20.0);
  const [orderNotes, setOrderNotes] = useState('');
  const [customDesignDetails, setCustomDesignDetails] = useState('');

  // Filtering
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'TOUS' || o.status === statusFilter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const totalSum = orderItems.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);

  function handleCreateOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName || orderItems.length === 0) return;

    const orderNumber = `CMD-2026-${Math.floor(100 + Math.random() * 900)}`;

    onAddOrder({
      orderNumber,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      pickupDate,
      pickupTime,
      items: orderItems,
      totalAmount: totalSum,
      depositPaid,
      status: 'CONFIRME',
      notes: orderNotes || undefined,
      customDesignDetails: customDesignDetails || undefined,
    });

    setIsNewOrderModalOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setOrderNotes('');
    setCustomDesignDetails('');
  }

  function addItemRow() {
    setOrderItems((prev) => [...prev, { name: 'Baguette Tradition', quantity: 5, unitPrice: 1.30 }]);
  }

  function removeItemRow(index: number) {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItemRow(index: number, field: string, val: any) {
    setOrderItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: val } : it))
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Commandes Spéciales & Retraits Comptoir
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gâteaux d anniversaire, plateaux réceptions d entreprise, pains de fête et acomptes
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-purple-200" />
          Enregistrer une Commande
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par client, téléphone ou n° commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {['TOUS', 'CONFIRME', 'EN_PREPARATION', 'PRET', 'RETIRE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st === 'TOUS' ? 'Toutes' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((ord) => {
          const remainingDue = Math.max(0, ord.totalAmount - ord.depositPaid);

          const statusBadges: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
            CONFIRME: { label: 'Confirmée', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            EN_PREPARATION: { label: 'En Labo Pâtisserie', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
            PRET: { label: 'Prêt au Comptoir', bg: 'bg-emerald-50 text-emerald-800', text: 'text-emerald-800', border: 'border-emerald-300 ring-2 ring-emerald-400/20' },
            RETIRE: { label: 'Retiré par le client', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
            ANNULE: { label: 'Annulée', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
          };

          const badge = statusBadges[ord.status] || statusBadges.CONFIRME;

          return (
            <div
              key={ord.id}
              className={`p-4 bg-white rounded-xl border ${badge.border} shadow-2xs hover:shadow-md transition flex flex-col justify-between gap-3`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {ord.orderNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  <strong className="text-sm text-slate-900">{ord.customerName}</strong>
                </div>

                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" /> {ord.customerPhone}
                  </span>
                </div>

                {/* Pickup badge */}
                <div className="mt-2.5 p-2 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-between text-xs text-purple-950">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-purple-600" /> Retrait prévu :
                  </span>
                  <strong className="font-mono font-bold">
                    {ord.pickupDate} à {ord.pickupTime}
                  </strong>
                </div>

                {/* Items */}
                <div className="mt-3 space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Articles commandés :
                  </span>
                  <ul className="divide-y divide-slate-100">
                    {ord.items.map((it, idx) => (
                      <li key={idx} className="py-1 flex justify-between text-slate-800">
                        <span>
                          {it.quantity}x {it.name}
                        </span>
                        <strong className="font-mono">{(it.quantity * it.unitPrice).toFixed(2)} €</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cake custom design notes */}
                {ord.customDesignDetails && (
                  <div className="mt-2 text-xs p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 flex items-start gap-1.5">
                    <Cake className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px]">Personnalisation :</strong>
                      {ord.customDesignDetails}
                    </div>
                  </div>
                )}

                {ord.notes && (
                  <p className="mt-2 text-xs text-slate-600 italic bg-slate-50 p-1.5 rounded">
                    "{ord.notes}"
                  </p>
                )}
              </div>

              {/* Financial summary & Workflow status buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total TTC</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {ord.totalAmount.toFixed(2)} €
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">
                      Acompte reçu: {ord.depositPaid.toFixed(2)} €
                    </span>
                    <span className={`font-bold font-mono ${remainingDue > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {remainingDue > 0 ? `Reste : ${remainingDue.toFixed(2)} €` : 'Soldé à 100%'}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 pt-1">
                  {ord.status === 'CONFIRME' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'EN_PREPARATION')}
                      className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Transmettre au Labo Pâtisserie
                    </button>
                  )}
                  {ord.status === 'EN_PREPARATION' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'PRET')}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Marquer Prêt au Comptoir
                    </button>
                  )}
                  {ord.status === 'PRET' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'RETIRE')}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Client a Retiré sa Commande
                    </button>
                  )}
                  {ord.status === 'RETIRE' && (
                    <span className="w-full text-center text-xs font-semibold text-slate-400 py-1">
                      Commande terminée et archivée
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW ORDER MODAL */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-purple-600/30">
              <h3 className="text-base font-bold flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-purple-400" />
                Enregistrer une Commande Spéciale
              </h3>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Customer info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom du client / Entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mme Dupont"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Téléphone contact *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Pickup timing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date de retrait
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Heure précise
                  </label>
                  <input
                    type="time"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Order items */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Articles commandés
                  </label>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter un article
                  </button>
                </div>

                <div className="space-y-2">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nom du produit"
                        value={item.name}
                        onChange={(e) => updateItemRow(idx, 'name', e.target.value)}
                        className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qté"
                        value={item.quantity}
                        onChange={(e) => updateItemRow(idx, 'quantity', Number(e.target.value))}
                        className="w-16 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Prix unitaire"
                        value={item.unitPrice}
                        onChange={(e) => updateItemRow(idx, 'unitPrice', Number(e.target.value))}
                        className="w-20 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
                      />
                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total and deposit */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
                <div>
                  <span className="text-[11px] text-purple-900 block font-semibold">Total calculé :</span>
                  <span className="text-base font-black text-purple-950 font-mono">
                    {totalSum.toFixed(2)} €
                  </span>
                </div>
                <div>
                  <label className="text-[11px] text-purple-900 block font-semibold mb-1">
                    Acompte versé à la commande :
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(Number(e.target.value))}
                    className="w-full p-1.5 bg-white border border-purple-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Custom decoration instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructions gâteau & personnalisation (écriture, allergies)
                </label>
                <input
                  type="text"
                  placeholder="ex: Inscription 'Joyeux Anniversaire Thomas 30 ans' en chocolat noir"
                  value={customDesignDetails}
                  onChange={(e) => setCustomDesignDetails(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes internes</label>
                <textarea
                  rows={2}
                  placeholder="ex: Le client viendra avec un grand carton pour le transport."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
                >
                  Enregistrer et Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
