"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusIndicator } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { formatNumber } from "@/lib/format";
import {
  ThermalReceiptModal,
  SaleReceiptData,
} from "@/components/ui/thermal-receipt-modal";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  RotateCcw,
  CheckCircle2,
  Store,
  Printer,
} from "lucide-react";

interface BakeryProduct {
  id: string;
  name: string;
  category: "Boulangerie" | "Viennoiserie" | "Pâtisserie" | "Boissons";
  price: number; // En FCFA
  stock: number;
  code: string;
}

const BAKERY_PRODUCTS: BakeryProduct[] = [
  { id: "p1", name: "Baguette Standard (200g)", category: "Boulangerie", price: 150, stock: 320, code: "BAG-STD" },
  { id: "p2", name: "Baguette Traditionnelle", category: "Boulangerie", price: 200, stock: 180, code: "BAG-TRD" },
  { id: "p3", name: "Pain Complet Céréales", category: "Boulangerie", price: 400, stock: 65, code: "PAI-CMP" },
  { id: "p4", name: "Croissant Pur Beurre", category: "Viennoiserie", price: 350, stock: 95, code: "CRO-BEU" },
  { id: "p5", name: "Pain au Chocolat (2 Barres)", category: "Viennoiserie", price: 400, stock: 85, code: "PAI-CHO" },
  { id: "p6", name: "Brioche Tressée Moelleuse", category: "Viennoiserie", price: 750, stock: 40, code: "BRI-TRE" },
  { id: "p7", name: "Pain de Mie Familial", category: "Boulangerie", price: 1000, stock: 30, code: "PAI-MIE" },
  { id: "p8", name: "Jus de Bissap Artisanal 33cl", category: "Boissons", price: 500, stock: 50, code: "JUS-BIS" },
];

export function PosPreview() {
  const { toast } = useToast();
  const [cart, setCart] = React.useState<{ product: BakeryProduct; quantity: number }[]>([
    { product: BAKERY_PRODUCTS[0], quantity: 3 },
    { product: BAKERY_PRODUCTS[3], quantity: 2 },
  ]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [paymentMode, setPaymentMode] = React.useState<"cash" | "wave" | "orange">("cash");
  const [tenderCash, setTenderCash] = React.useState<number>(2000);

  // État modale ticket thermique 80mm
  const [isReceiptModalOpen, setIsReceiptModalOpen] = React.useState(false);
  const [receiptData, setReceiptData] = React.useState<SaleReceiptData | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const changeDue = Math.max(0, tenderCash - subtotal);

  const addToCart = (product: BakeryProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: BakeryProduct; quantity: number }[]
    );
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    const saleData: SaleReceiptData = {
      ticketNumber: `TK-${now.getTime().toString().slice(-6)}`,
      dateStr: `${day}/${month}/${year}`,
      timeStr: `${hours}:${minutes}:${seconds}`,
      branchName: "Plateau Vente Boutique",
      branchAddress: "Rue du Commerce, Abidjan",
      cashierName: "Estelle Yao",
      items: cart.map((i) => ({
        name: i.product.name,
        code: i.product.code,
        price: i.product.price,
        quantity: i.quantity,
      })),
      totalAmount: subtotal,
      paymentMode: paymentMode,
      amountTendered: paymentMode === "cash" ? tenderCash : subtotal,
      changeDue: paymentMode === "cash" ? changeDue : 0,
      fneRef: `FNE-CI-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    };

    setReceiptData(saleData);
    setIsReceiptModalOpen(true);

    toast({
      type: "success",
      title: "Encaissement Réussi !",
      message: `Vente de ${formatNumber(subtotal)} FCFA certifiée FNE. Ticket 80mm généré.`,
    });

    setCart([]);
  };

  const filteredProducts = BAKERY_PRODUCTS.filter((p) =>
    selectedCategory === "all" ? true : p.category === selectedCategory
  );

  return (
    <div className="space-y-4">
      {/* Session Caisse Info Bar Vercel Monochrome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-[#222222] bg-[#0a0a0a] text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white">Terminal POS #01 — Plateau Vente Boutique</div>
            <div className="text-[11px] text-[#888888] font-mono">
              Opérateur : Estelle Yao (Caissière) · Session : csh_shift_matin_08
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <StatusIndicator status="active" label="Tiroir-Caisse Ouvert" />
          <div className="text-right font-mono text-xs">
            <span className="text-[#888888]">Fond de Caisse : </span>
            <span className="text-white font-bold">50 000 FCFA</span>
          </div>
        </div>
      </div>

      {/* Interface Caisse en 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Colonne Gauche : Catalogue Produits & Filtres */}
        <div className="lg:col-span-7 space-y-3">
          {/* Filtres par Catégorie */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#0a0a0a] border border-[#222222] rounded-lg">
            {["all", "Boulangerie", "Viennoiserie", "Boissons"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0070f3] text-white shadow-xs font-semibold"
                    : "text-[#888888] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {cat === "all" ? "Tous les Produits" : cat}
              </button>
            ))}
          </div>

          {/* Grille de Produits Touch-Friendly */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-3 rounded-xl border border-[#222222] bg-[#0a0a0a] hover:border-[#404040] transition-all cursor-pointer select-none group flex flex-col justify-between h-32 active:scale-98"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-[#71717a] uppercase">{product.code}</span>
                    <span className="text-[10px] font-mono text-[#888888]">{product.stock} dispo</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-white transition-colors line-clamp-2">
                    {product.name}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1f1f1f] flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-white">
                    {formatNumber(product.price)} FCFA
                  </span>
                  <div className="w-6 h-6 rounded-md bg-white/[0.06] group-hover:bg-[#0070f3] group-hover:text-white flex items-center justify-center text-[#888888] transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne Droite : Ticket de Caisse Actuel & Encaissement */}
        <div className="lg:col-span-5">
          <Card className="border-[#222222] bg-[#0a0a0a]">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#1f1f1f]">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-[#888888]" />
                <CardTitle>Panier & Encaissement Direct</CardTitle>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-[11px] font-mono text-[#888888] hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Vider</span>
                </button>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Lignes du panier */}
              {cart.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#71717a] space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto opacity-30 text-[#888888]" />
                  <p>Panier vide. Cliquez sur un article pour l'ajouter au ticket.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#121212] border border-[#222222] text-xs"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-medium text-white truncate">{product.name}</div>
                        <div className="text-[10px] font-mono text-[#888888]">
                          {formatNumber(product.price)} FCFA / pièce
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-[#1c1c1c] rounded-md border border-[#262626]">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-[#888888] hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-white text-xs">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#888888] hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="w-16 text-right font-mono font-bold text-white text-xs">
                          {formatNumber(product.price * quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Totaux & Rendu de monnaie */}
              <div className="pt-3 border-t border-[#1f1f1f] space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#888888]">
                  <span>Articles</span>
                  <span>{cart.reduce((s, i) => s + i.quantity, 0)} pièces</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-1">
                  <span>Total Net :</span>
                  <span className="text-white">{formatNumber(subtotal)} FCFA</span>
                </div>
              </div>

              {/* Modes de Règlement */}
              <div className="pt-3 border-t border-[#1f1f1f] space-y-2">
                <span className="text-[11px] text-[#888888] font-medium block">Mode d'Encaissement :</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMode("cash")}
                    className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      paymentMode === "cash"
                        ? "bg-white/[0.08] border-white text-white font-semibold"
                        : "bg-[#121212] border-[#222222] text-[#888888] hover:text-white"
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Espèces</span>
                  </button>

                  <button
                    onClick={() => setPaymentMode("wave")}
                    className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      paymentMode === "wave"
                        ? "bg-white/[0.08] border-white text-white font-semibold"
                        : "bg-[#121212] border-[#222222] text-[#888888] hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    <span>Wave CI</span>
                  </button>

                  <button
                    onClick={() => setPaymentMode("orange")}
                    className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      paymentMode === "orange"
                        ? "bg-white/[0.08] border-white text-white font-semibold"
                        : "bg-[#121212] border-[#222222] text-[#888888] hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-orange-400" />
                    <span>Orange M.</span>
                  </button>
                </div>
              </div>

              {/* Saisie Espèces & Rendu */}
              {paymentMode === "cash" && (
                <div className="p-3 rounded-xl bg-[#121212] border border-[#222222] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#888888]">Espèces reçues :</span>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="number"
                        value={tenderCash}
                        onChange={(e) => setTenderCash(Number(e.target.value))}
                        step="100"
                        className="w-24 px-2 py-1 text-right font-mono font-bold bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white text-xs focus:outline-none focus:border-[#0070f3]"
                      />
                      <span className="text-[#888888] text-[10px]">FCFA</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono pt-1 border-t border-[#1f1f1f]">
                    <span className="text-[#888888]">Monnaie à Rendre :</span>
                    <span className="text-sm font-bold text-white">
                      {formatNumber(changeDue)} FCFA
                    </span>
                  </div>
                </div>
              )}

              {/* Bouton Validation Finale (Bleu Vercel) */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleCompleteSale}
                disabled={cart.length === 0}
                className="w-full mt-2 font-bold"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Valider l'Achat & Générer Ticket 80mm
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fenêtre Modale Ticket Thermique 80mm pour exportation & impression */}
      <ThermalReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        data={receiptData}
      />
    </div>
  );
}
