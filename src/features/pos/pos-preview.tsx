"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusIndicator } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
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
    toast({
      type: "success",
      title: "Encaissement Réussi !",
      message: `Vente de ${subtotal.toLocaleString()} FCFA certifiée FNE. Monnaie à rendre : ${changeDue.toLocaleString()} FCFA.`,
    });
    setCart([]);
  };

  const filteredProducts = BAKERY_PRODUCTS.filter((p) =>
    selectedCategory === "all" ? true : p.category === selectedCategory
  );

  return (
    <div className="space-y-4">
      {/* Session Caisse Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-[#0c0e17] text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white">Terminal POS #01 — Plateau Vente Boutique</div>
            <div className="text-[11px] text-gray-400 font-mono">
              Opérateur : Estelle Yao (Caissière) · Session : csh_shift_matin_08
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <StatusIndicator status="active" label="Tiroir-Caisse Ouvert" />
          <div className="h-4 w-px bg-white/[0.1] hidden sm:block" />
          <div className="font-mono text-gray-300">
            Fond : <strong className="text-white">50 000 FCFA</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Colonne Gauche : Catalogue Produits */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filtres Catégories */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {["all", "Boulangerie", "Viennoiserie", "Boissons"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-black font-semibold shadow-xs"
                    : "bg-[#111420] text-gray-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                {cat === "all" ? "Tous les Rayons" : cat}
              </button>
            ))}
          </div>

          {/* Grille Produits */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="group relative p-3.5 rounded-xl border border-white/[0.08] bg-[#0c0e17] hover:bg-[#121624] hover:border-amber-500/30 cursor-pointer transition-all duration-150 flex flex-col justify-between select-none shadow-xs active:scale-[0.98]"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{product.code}</span>
                    <span className="text-[10px] font-mono text-emerald-400/90">{product.stock} dispo</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {product.name}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-white">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  <div className="w-6 h-6 rounded-md bg-white/[0.04] group-hover:bg-amber-500 group-hover:text-black flex items-center justify-center text-gray-400 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne Droite : Ticket Actif & Encaissement */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <CardTitle>Ticket de Caisse en Cours</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCart([])}
                className="text-gray-400 hover:text-rose-400 text-[11px] h-7 px-2"
              >
                Vider
              </Button>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-xs">
                  Aucun article sélectionné dans le ticket
                </div>
              ) : (
                <div className="divide-y divide-white/[0.05] max-h-56 overflow-y-auto pr-1 space-y-1">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="pt-2 pb-2 flex items-center justify-between text-xs">
                      <div className="flex-1 pr-2">
                        <div className="font-medium text-white truncate">{product.name}</div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          {product.price} FCFA × {quantity}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-[#121624] border border-white/[0.08] rounded-md p-0.5">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono font-semibold text-white text-xs">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="w-16 text-right font-mono font-bold text-white text-xs">
                          {(product.price * quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Totaux & Rendu de monnaie */}
              <div className="pt-3 border-t border-white/[0.08] space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Articles</span>
                  <span>{cart.reduce((s, i) => s + i.quantity, 0)} pièces</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-1">
                  <span>Total Net :</span>
                  <span className="text-amber-400">{subtotal.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Modes de Règlement */}
              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <span className="text-[11px] text-gray-400 font-medium block">Mode d'Encaissement :</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMode("cash")}
                    className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      paymentMode === "cash"
                        ? "bg-amber-500/15 border-amber-500 text-amber-300 font-semibold"
                        : "bg-[#111420] border-white/[0.08] text-gray-400 hover:text-white"
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Espèces</span>
                  </button>

                  <button
                    onClick={() => setPaymentMode("wave")}
                    className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      paymentMode === "wave"
                        ? "bg-sky-500/15 border-sky-400 text-sky-300 font-semibold"
                        : "bg-[#111420] border-white/[0.08] text-gray-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    <span>Wave CI</span>
                  </button>

                  <button
                    onClick={() => setPaymentMode("orange")}
                    className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      paymentMode === "orange"
                        ? "bg-orange-500/15 border-orange-400 text-orange-300 font-semibold"
                        : "bg-[#111420] border-white/[0.08] text-gray-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-orange-400" />
                    <span>Orange M.</span>
                  </button>
                </div>
              </div>

              {/* Calculateur de Rendu Espèces */}
              {paymentMode === "cash" && (
                <div className="p-2.5 rounded-lg bg-[#07080d] border border-white/[0.06] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Montant Reçu :</span>
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        value={tenderCash}
                        onChange={(e) => setTenderCash(Number(e.target.value) || 0)}
                        className="w-24 h-7 text-right font-mono font-bold"
                      />
                      <span className="text-gray-500 text-[10px]">FCFA</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono pt-1 border-t border-white/[0.05]">
                    <span className="text-gray-400">Monnaie à Rendre :</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {changeDue.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              )}

              {/* Bouton Validation Finale */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleCompleteSale}
                disabled={cart.length === 0}
                className="w-full mt-2 font-bold"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Valider & Imprimer Ticket (FNE)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
