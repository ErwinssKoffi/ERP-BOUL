"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Box,
  Truck,
  AlertTriangle,
  Calendar,
  Layers,
  PlusCircle,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

export function InventoryPreview() {
  const { toast } = useToast();

  const inventoryItems = [
    {
      id: "stk_01",
      name: "Farine de Blé T55 (MCI)",
      category: "Farines",
      currentQty: 45,
      unit: "sac (50kg)",
      totalWeight: "2 250 kg",
      minThreshold: 20,
      dluo: "15/04/2027",
      status: "optimal" as const,
      lot: "LOT-MCI-2026-081",
    },
    {
      id: "stk_02",
      name: "Farine Complète T150",
      category: "Farines",
      currentQty: 6,
      unit: "sac (50kg)",
      totalWeight: "300 kg",
      minThreshold: 10,
      dluo: "10/02/2027",
      status: "warning" as const,
      lot: "LOT-GMA-2026-042",
    },
    {
      id: "stk_03",
      name: "Levure Fraîche Saf-Instant",
      category: "Levures",
      currentQty: 14,
      unit: "carton (10kg)",
      totalWeight: "140 kg",
      minThreshold: 5,
      dluo: "30/11/2026",
      status: "optimal" as const,
      lot: "LOT-LES-2026-119",
    },
    {
      id: "stk_04",
      name: "Beurre de Tourage Pâtissier 82%",
      category: "Matières Grasses",
      currentQty: 3,
      unit: "carton (10kg)",
      totalWeight: "30 kg",
      minThreshold: 5,
      dluo: "20/12/2026",
      status: "warning" as const,
      lot: "LOT-EUR-2026-004",
    },
    {
      id: "stk_05",
      name: "Sel Fin Raffiné Iodé",
      category: "Épicerie",
      currentQty: 25,
      unit: "paquet (1kg)",
      totalWeight: "25 kg",
      minThreshold: 10,
      dluo: "01/01/2028",
      status: "optimal" as const,
      lot: "LOT-SAL-2026-090",
    },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Stock & Valeur Réserve */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Valeur Stock Actuel</div>
          <div className="text-xl font-bold font-mono text-white">1 425 000 FCFA</div>
          <div className="text-[11px] text-gray-500 font-mono">Évalué au PAMP (Prix Moyen)</div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Stock Farine T55</div>
          <div className="text-xl font-bold font-mono text-amber-400">45 sacs</div>
          <div className="text-[11px] text-emerald-400 font-mono">Autonomie : ~9 jours fournil</div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Alertes Seuil d'Appro</div>
          <div className="text-xl font-bold font-mono text-rose-400">2 références</div>
          <div className="text-[11px] text-rose-400/80 font-mono">Farine Complète, Beurre</div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Rotation FEFO</div>
          <div className="text-xl font-bold font-mono text-emerald-400">100 %</div>
          <div className="text-[11px] text-gray-500 font-mono">Zéro sac périmé</div>
        </div>
      </div>

      {/* Liste des Matières Premières & Rapprochement */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Inventaire Farines & Ingrédients (Magasin & Réserve)
          </h3>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              toast({ type: "success", title: "Bon de Réception", message: "Ouverture du formulaire de pesée..." });
            }}
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            Nouvelle Réception Meunier
          </Button>
        </div>

        <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-[#0c0e17] overflow-hidden">
          {inventoryItems.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#121624] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-semibold text-white">{item.name}</span>
                  <span className="text-[10px] font-mono text-gray-500">[{item.category}]</span>
                  {item.status === "warning" ? (
                    <StatusIndicator status="warning" label="Seuil Bas" />
                  ) : (
                    <StatusIndicator status="active" label="Optimal" />
                  )}
                </div>

                <div className="text-xs text-gray-400 font-mono flex flex-wrap gap-x-4">
                  <span>Stock : <strong className="text-white">{item.currentQty} {item.unit}</strong> ({item.totalWeight})</span>
                  <span>Seuil sécurité : {item.minThreshold}</span>
                  <span>Lot : {item.lot}</span>
                  <span>DLUO : <strong className="text-amber-400">{item.dluo}</strong></span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      type: "info",
                      title: "Sortie Fournil",
                      message: `1 sac de ${item.name} débité vers le pétrin`,
                    });
                  }}
                >
                  <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  Sortie Pétrin
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    toast({
                      type: "info",
                      title: "Ajustement Inventaire",
                      message: `Ajustement de stock initié pour ${item.name}`,
                    });
                  }}
                >
                  Ajuster
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
