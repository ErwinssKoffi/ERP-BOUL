"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  LineChart,
  Coins,
  ShieldCheck,
  FileCheck2,
  Receipt,
  Download,
  AlertCircle,
} from "lucide-react";

export function FinancePreview() {
  const { toast } = useToast();

  const transactions = [
    { id: "TX-2026-981", type: "Vente Boutique", client: "Comptoir Client", amount: "+ 2 450 FCFA", method: "Espèces", time: "14:22", fneStatus: "certifié" },
    { id: "TX-2026-980", type: "Vente B2B Hôtellerie", client: "Hôtel Ivoire Sofitel", amount: "+ 45 000 FCFA", method: "Virement", time: "13:50", fneStatus: "certifié" },
    { id: "TX-2026-979", type: "Dépense Exploitation", client: "SODEBO (Levure & Sel)", amount: "- 18 500 FCFA", method: "Wave", time: "11:15", fneStatus: "visé" },
    { id: "TX-2026-978", type: "Vente Boutique", client: "Comptoir Client", amount: "+ 8 200 FCFA", method: "Orange Money", time: "10:04", fneStatus: "certifié" },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Financiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">CA Journalier Encaissé</div>
          <div className="text-xl font-bold font-mono text-white">285 450 FCFA</div>
          <div className="text-[11px] text-emerald-400 font-mono">+12.4% vs semaine précédente</div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Taux de Marge Brute</div>
          <div className="text-xl font-bold font-mono text-amber-400">68.2 %</div>
          <div className="text-[11px] text-emerald-400 font-mono">Conforme aux objectifs (≥65%)</div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Espèces en Tiroir Caisse</div>
          <div className="text-xl font-bold font-mono text-white">195 000 FCFA</div>
          <div className="text-[11px] text-gray-400 font-mono">Dont fond de caisse 50 000</div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-1">
          <div className="text-xs text-gray-400">Conformité FNE / DGI</div>
          <div className="text-xl font-bold font-mono text-emerald-400">100 %</div>
          <div className="text-[11px] text-gray-500 font-mono">Toutes ventes télé-certifiées</div>
        </div>
      </div>

      {/* Rapprochement & Ventilation des flux */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Journal des Flux Financiers (Grand Livre Pré-SYSCOHADA)
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ type: "info", title: "Export", message: "Génération du grand livre SYSCOHADA..." })}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Exporter
            </Button>
          </div>

          <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-[#0c0e17] overflow-hidden">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-[#121624] text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-semibold text-amber-400">{tx.id}</span>
                    <span className="font-medium text-white">{tx.type}</span>
                    <span className="text-gray-500">· {tx.client}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono">
                    {tx.time} · Règlement : {tx.method} · Statut DGI : <span className="text-emerald-400">{tx.fneStatus}</span>
                  </div>
                </div>

                <div className={`font-mono font-bold text-sm ${tx.amount.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne Droite : Ventilation Encaissements */}
        <div className="lg:col-span-4 space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Ventilation des Encaissements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-gray-400 font-mono">
                  <span>Espèces (Cash) :</span>
                  <span className="text-white font-bold">195 000 FCFA (68%)</span>
                </div>
                <div className="w-full bg-[#161a29] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[68%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-gray-400 font-mono">
                  <span>Wave Côte d'Ivoire :</span>
                  <span className="text-white font-bold">62 450 FCFA (22%)</span>
                </div>
                <div className="w-full bg-[#161a29] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full w-[22%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-gray-400 font-mono">
                  <span>Orange Money :</span>
                  <span className="text-white font-bold">28 000 FCFA (10%)</span>
                </div>
                <div className="w-full bg-[#161a29] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-400 h-full w-[10%]" />
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] text-[11px] text-gray-500 font-mono">
                Compte bancaire rattaché : Société Générale CI Plateau
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
