'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  Percent,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Printer,
  Moon,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { POSProduct, CartItem, CategoryType } from '@/lib/types';

interface POSRegisterProps {
  products: POSProduct[];
  onSaleComplete: (totalAmount: number, items: CartItem[], paymentMethod: string) => void;
  onRecordWaste: (productId: string, quantity: number, reason: string) => void;
}

export function POSRegister({ products, onSaleComplete, onRecordWaste }: POSRegisterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARTE' | 'ESPECES' | 'TICKET_RESTO'>('CARTE');
  const [cashGiven, setCashGiven] = useState<number>(20);
  const [completedReceipt, setCompletedReceipt] = useState<{
    items: CartItem[];
    subtotal: number;
    discountAmount: number;
    total: number;
    vat55: number;
    vat10: number;
    paymentMethod: string;
    cashGiven?: number;
    changeDue?: number;
    date: string;
    ticketNumber: string;
  } | null>(null);

  // Waste registration modal state
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [wasteProductId, setWasteProductId] = useState(products[0]?.id || '');
  const [wasteQuantity, setWasteQuantity] = useState(5);
  const [wasteReason, setWasteReason] = useState('Invendu fin de journée (dépassement fraîcheur)');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'TOUS' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Cart operations
  function addToCart(product: POSProduct) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function clearCart() {
    setCart([]);
    setAppliedDiscount(0);
  }

  // Calculations
  const rawTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedDiscount > 0 ? (rawTotal * appliedDiscount) / 100 : 0;
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  // Approximate VAT calculations
  const vat55 = Math.round((finalTotal * 0.055) * 100) / 100;
  const vat10 = Math.round((finalTotal * 0.10) * 100) / 100;
  const changeDue = Math.max(0, Math.round((cashGiven - finalTotal) * 100) / 100);

  function handleProcessPayment() {
    if (cart.length === 0) return;

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // safe fallback
    }

    const receipt = {
      items: [...cart],
      subtotal: rawTotal,
      discountAmount,
      total: finalTotal,
      vat55,
      vat10,
      paymentMethod,
      cashGiven: paymentMethod === 'ESPECES' ? cashGiven : undefined,
      changeDue: paymentMethod === 'ESPECES' ? changeDue : undefined,
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      ticketNumber: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setCompletedReceipt(receipt);
    onSaleComplete(finalTotal, cart, paymentMethod);
    setIsCheckoutModalOpen(false);
    clearCart();
  }

  function handleRecordWasteSubmit(e: React.FormEvent) {
    e.preventDefault();
    onRecordWaste(wasteProductId, wasteQuantity, wasteReason);
    setIsWasteModalOpen(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT 2 COLS: Product Catalog & Touch Buttons */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Top Control Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-600" />
            <h2 className="font-black text-slate-900 text-base">
              Caisse Tactile de Vente en Boutique
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWasteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-lg border border-rose-200 transition cursor-pointer"
              title="Enregistrer des invendus, pertes ou démarque"
            >
              <Moon className="w-3.5 h-3.5 text-rose-600" />
              Invendus / Démarque
            </button>
          </div>
        </div>

        {/* Filter categories & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Recherche rapide (baguette, croissant, formule...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto bg-white p-1 rounded-xl border border-slate-200 text-xs">
            {['TOUS', 'Boulangerie', 'Viennoiserie', 'Pâtisserie', 'Snacking', 'Boissons'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map((prod) => (
            <button
              key={prod.id}
              onClick={() => addToCart(prod)}
              className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition text-left flex flex-col justify-between group active:scale-98 cursor-pointer relative overflow-hidden"
            >
              {prod.badge && (
                <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  {prod.badge}
                </span>
              )}

              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  {prod.category}
                </span>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5 group-hover:text-amber-800 transition line-clamp-2">
                  {prod.name}
                </h4>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-black text-slate-900 font-mono text-sm">
                  {prod.price.toFixed(2)} €
                </span>
                <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-amber-600 group-hover:text-white text-slate-700 flex items-center justify-center transition">
                  <Plus className="w-4 h-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT 1 COL: Live Cart & Touch Checkout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 flex flex-col justify-between h-fit sticky top-20 space-y-4">
        
        {/* Cart Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Ticket en cours ({cart.reduce((s, i) => s + i.quantity, 0)} articles)
            </h3>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Vider
            </button>
          )}
        </div>

        {/* Cart items list */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <ShoppingCart className="w-10 h-10 mx-auto text-slate-200 mb-2" />
              Panier vide. Touchez un produit pour l ajouter au ticket.
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <strong className="text-slate-900 block truncate">
                    {item.product.name}
                  </strong>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {item.product.price.toFixed(2)} € / u
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-black text-slate-900 w-5 text-center font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right min-w-[50px]">
                  <strong className="text-slate-900 font-mono">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </strong>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Discounts & Summary */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          {/* Quick discounts */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1 font-semibold">
              <Percent className="w-3.5 h-3.5 text-amber-600" /> Remise :
            </span>
            <div className="flex gap-1">
              {[0, 10, 20, 50].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setAppliedDiscount(pct)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                    appliedDiscount === pct
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pct === 0 ? '0%' : `-${pct}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Subtotals */}
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Sous-total brut</span>
              <span className="font-mono">{rawTotal.toFixed(2)} €</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Remise appliquée (-{appliedDiscount}%)</span>
                <span className="font-mono">-{discountAmount.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>TVA (5.5% et 10% incluse)</span>
              <span>{(vat55 + vat10).toFixed(2)} €</span>
            </div>
          </div>

          {/* Final Total Big Display */}
          <div className="p-3 bg-slate-900 rounded-xl text-white flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-300">Total à Payer</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {finalTotal.toFixed(2)} €
            </span>
          </div>

          {/* Checkout action button */}
          <button
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutModalOpen(true)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-sm tracking-wide shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Encaisser Maintenant</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CHECKOUT MODAL: Payment choice & Cash Change */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-amber-600/30">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base">Règlement du Ticket</h3>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="text-center p-4 bg-slate-100 rounded-xl">
                <span className="text-xs text-slate-500 uppercase font-bold block">Montant Net TTC</span>
                <span className="text-3xl font-black font-mono text-slate-900">
                  {finalTotal.toFixed(2)} €
                </span>
              </div>

              {/* Payment method selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARTE')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'CARTE'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span className="text-xs">Carte CB</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ESPECES')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'ESPECES'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs">Espèces</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('TICKET_RESTO')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'TICKET_RESTO'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Receipt className="w-5 h-5 text-purple-600" />
                  <span className="text-xs">Titres Resto</span>
                </button>
              </div>

              {/* Cash given & Change calculator */}
              {paymentMethod === 'ESPECES' && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-950">Espèces reçues :</label>
                    <div className="flex items-center gap-1 font-mono text-sm">
                      <input
                        type="number"
                        step="0.5"
                        value={cashGiven}
                        onChange={(e) => setCashGiven(Number(e.target.value))}
                        className="w-24 p-1.5 bg-white border border-emerald-300 rounded-lg text-right font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <span>€</span>
                    </div>
                  </div>

                  <div className="flex gap-1 justify-end">
                    {[5, 10, 20, 50].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCashGiven(amt)}
                        className="px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-bold cursor-pointer"
                      >
                        {amt}€
                      </button>
                    ))}
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-emerald-300 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Rendu de monnaie :</span>
                    <strong className="text-xl font-black font-mono text-emerald-700">
                      {changeDue.toFixed(2)} €
                    </strong>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleProcessPayment}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Valider l Encaissement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 p-4 text-white text-center border-b border-amber-600/30">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                ERP-BOUL • Ticket de Caisse
              </span>
              <strong className="text-base font-bold">Artisans Boulangers & Pâtissiers</strong>
              <p className="text-[11px] text-slate-400">{completedReceipt.ticketNumber} • {completedReceipt.date}</p>
            </div>

            <div className="p-5 space-y-3 font-mono text-xs text-slate-800">
              <div className="divide-y divide-slate-200 border-b border-slate-200 pb-2">
                {completedReceipt.items.map((it, idx) => (
                  <div key={idx} className="py-1 flex justify-between">
                    <span>
                      {it.quantity}x {it.product.name}
                    </span>
                    <strong>{(it.product.price * it.quantity).toFixed(2)} €</strong>
                  </div>
                ))}
              </div>

              {completedReceipt.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Remise accordée :</span>
                  <span>-{completedReceipt.discountAmount.toFixed(2)} €</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold pt-1">
                <span>TOTAL TTC :</span>
                <span>{completedReceipt.total.toFixed(2)} €</span>
              </div>

              <div className="text-[10px] text-slate-500 pt-1">
                Mode de règlement : <strong>{completedReceipt.paymentMethod}</strong>
                {completedReceipt.cashGiven !== undefined && (
                  <div>
                    Reçu : {completedReceipt.cashGiven.toFixed(2)} € | Rendu :{' '}
                    {completedReceipt.changeDue?.toFixed(2)} €
                  </div>
                )}
              </div>

              <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-slate-100">
                Merci pour votre fidélité ! Pain chaud et viennoiseries artisanales cuits sur place.
              </div>
            </div>

            <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setCompletedReceipt(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Fermer Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WASTE / INVENDUS MODAL */}
      {isWasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-rose-950 px-6 py-4 flex items-center justify-between text-white border-b border-rose-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Moon className="w-4 h-4 text-rose-400" />
                Démarque & Invendus de Fin de Journée
              </h3>
              <button
                onClick={() => setIsWasteModalOpen(false)}
                className="text-rose-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordWasteSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Produit concerné
                </label>
                <select
                  value={wasteProductId}
                  onChange={(e) => setWasteProductId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantité invendue / écartée
                </label>
                <input
                  type="number"
                  min="1"
                  value={wasteQuantity}
                  onChange={(e) => setWasteQuantity(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination / Motif
                </label>
                <select
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Panier Anti-Gaspi (Too Good To Go / Phénix)">
                    Panier Anti-Gaspi (Too Good To Go / Phénix)
                  </option>
                  <option value="Recyclage Fournil (Chapelure / Croûtons dorés)">
                    Recyclage Fournil (Chapelure / Croûtons dorés)
                  </option>
                  <option value="Don association caritative / Secours">
                    Don association caritative / Secours
                  </option>
                  <option value="Défaut cuisson / casse au transport">
                    Défaut cuisson / casse au transport
                  </option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWasteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Enregistrer la Démarque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
