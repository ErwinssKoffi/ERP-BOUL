"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  CookingPot,
  Flame,
  Scale,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export function ProductionPreview() {
  const { toast } = useToast();

  const [batches, setBatches] = React.useState([
    {
      id: "OF-2026-101",
      product: "Baguette Traditionnelle (200g)",
      targetQuantity: 300,
      flourBags: 2, // 2 sacs de 50 kg = 100 kg
      waterLiters: 66, // 66% hydratation
      saltGrams: 1800,
      yeastGrams: 1200,
      status: "kneading" as const, // kneading, proofing, baking, completed
      stageTime: "Pétrissage : 8 min restantes",
      wasteCount: 0,
    },
    {
      id: "OF-2026-102",
      product: "Croissant Pur Beurre",
      targetQuantity: 150,
      flourBags: 1, // 50 kg
      waterLiters: 28,
      saltGrams: 900,
      yeastGrams: 1000,
      status: "baking" as const,
      stageTime: "Four Sole : 14 min à 230°C",
      wasteCount: 2,
    },
    {
      id: "OF-2026-103",
      product: "Pain Complet Graines",
      targetQuantity: 80,
      flourBags: 0.5,
      waterLiters: 18,
      saltGrams: 450,
      yeastGrams: 400,
      status: "completed" as const,
      stageTime: "Terminé : 80 baguettes défournées",
      wasteCount: 1,
    },
  ]);

  const advanceStage = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        if (b.status === "kneading") {
          toast({ type: "info", title: "Fournil", message: `Tournée ${b.id} passée en pointage / façonnage` });
          return { ...b, status: "baking", stageTime: "Enfourné : 18 min restantes" };
        }
        if (b.status === "baking") {
          toast({ type: "success", title: "Fournil", message: `Tournée ${b.id} défournée avec succès ! Stock magasin alimenté.` });
          return { ...b, status: "completed", stageTime: "Défourné & Validé au comptoir" };
        }
        return b;
      })
    );
  };

  return (
    <div className="space-y-5">
      {/* KPI Production Matinale */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Objectif Production Jour</div>
          <div className="text-xl font-bold font-mono text-white">530 pièces</div>
          <div className="text-[11px] text-emerald-400 font-mono">380 déjà cuites (71%)</div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Farine Consommée</div>
          <div className="text-xl font-bold font-mono text-white">3,5 sacs</div>
          <div className="text-[11px] text-gray-400 font-mono">175 kg T55 MCI</div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Taux d'Hydratation Moyen</div>
          <div className="text-xl font-bold font-mono text-amber-400">66.2 %</div>
          <div className="text-[11px] text-emerald-400 font-mono">Optimal pour croustillant</div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Taux de Rebut Fournil</div>
          <div className="text-xl font-bold font-mono text-white">0.56 %</div>
          <div className="text-[11px] text-gray-400 font-mono">3 pains écartés / 530</div>
        </div>
      </div>

      {/* Ordres de Fabrication */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Ordres de Fabrication Actifs (Pétrin & Fours)
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              toast({ type: "info", title: "Nouvelle Tournée", message: "Génération fiche de pesée..." });
            }}
          >
            <Play className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Lancer Nouvelle Tournée
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-amber-400">{batch.id}</span>
                  <span className="text-xs font-semibold text-white">{batch.product}</span>
                  {batch.status === "kneading" && (
                    <StatusIndicator status="warning" label="Pétrin Actif" />
                  )}
                  {batch.status === "baking" && (
                    <StatusIndicator status="active" label="En Cuisson Four" />
                  )}
                  {batch.status === "completed" && (
                    <StatusIndicator status="active" label="Défourné" />
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 font-mono">
                  <span>Cible : <strong className="text-gray-200">{batch.targetQuantity} pcs</strong></span>
                  <span>Farine : <strong className="text-gray-200">{batch.flourBags} sacs ({(batch.flourBags * 50)}kg)</strong></span>
                  <span>Eau : <strong className="text-gray-200">{batch.waterLiters} L</strong></span>
                  <span>Sel : <strong className="text-gray-200">{batch.saltGrams} g</strong></span>
                  <span>Rebut : <strong className="text-rose-400">{batch.wasteCount}</strong></span>
                </div>

                <div className="text-[11px] text-gray-500 font-mono flex items-center space-x-1.5 pt-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{batch.stageTime}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {batch.status !== "completed" ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => advanceStage(batch.id)}
                  >
                    {batch.status === "kneading" ? "Enfourner" : "Valider Défournage"}
                  </Button>
                ) : (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Terminé</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
