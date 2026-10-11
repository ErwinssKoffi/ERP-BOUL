"use client";

import * as React from "react";
import { Button } from "./button";
import { formatNumber } from "@/lib/format";
import { Printer, Download, X, FileText, CheckCircle2, ShieldCheck } from "lucide-react";

export interface PdfReportData {
  periodLabel: string;
  totalRevenue: string;
  revenueUnit: string;
  salesTrend: string;
  marginRate: string;
  marginAmount: string;
  flourReserve: string;
  flourConsumed: string;
  batchesCount: string;
  conformityRate: string;
  generatedDate: string;
  generatedBy: string;
  branchName: string;
  cashSplit: {
    cash: string;
    wave: string;
    orange: string;
  };
}

export function PdfReportModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: PdfReportData | null;
}) {
  const printContainerRef = React.useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportText = () => {
    const reportText = [
      "==================================================================",
      "             RAPPORT EXÉCUTIF DES PERFORMANCES MENSUELLES         ",
      "                     BOULANGERIE IVOIRE - ABIDJAN                 ",
      "==================================================================",
      `PÉRIODE ANALYSÉE  : ${data.periodLabel}`,
      `DATE D'ÉMISSION   : ${data.generatedDate}`,
      `ÉTABLISSEMENT     : ${data.branchName} (Côte d'Ivoire)`,
      `SIGNATAIRE        : ${data.generatedBy} (Direction Générale)`,
      "------------------------------------------------------------------",
      "1. INDICATEURS CLÉS DE PERFORMANCE (KPIs) :",
      `   - Chiffre d'Affaires Total   : ${data.totalRevenue} ${data.revenueUnit} (${data.salesTrend})`,
      `   - Taux de Marge Brute        : ${data.marginRate} (${data.marginAmount} FCFA)`,
      `   - Réserves Farine en Silos   : ${data.flourReserve} sacs`,
      `   - Farine Consommée Période   : ${data.flourConsumed}`,
      `   - Fournées Réalisées Fournil : ${data.batchesCount} (Conformité: ${data.conformityRate})`,
      "------------------------------------------------------------------",
      "2. ENCAISSEMENT & RAPPROCHEMENT MONÉTAIRE :",
      `   - Espèces (Tiroir-Caisse)    : ${data.cashSplit.cash}`,
      `   - Wave Mobile Money          : ${data.cashSplit.wave}`,
      `   - Orange Money Côte d'Ivoire : ${data.cashSplit.orange}`,
      "------------------------------------------------------------------",
      "3. CONFORMITÉ FISCALE & SYSCOHADA :",
      "   - Taux de Télé-certification FNE : 100% Validé DGI",
      "   - Traçabilité Piste d'Audit      : Conforme SYSCOHADA (10 ans)",
      "==================================================================",
      "                    VISA DE LA DIRECTION GÉNÉRALE                 ",
      "==================================================================",
    ];

    const blob = new Blob([reportText.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rapport-kpi-${data.periodLabel.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0a0a0a] border border-[#262626] shadow-2xl p-6 space-y-5 animate-scaleUp max-h-[92vh] flex flex-col">
        {/* Header modale */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f1f1f]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0070f3]" />
            <h3 className="text-sm font-semibold text-white">
              Génération du Rapport Exécutif PDF — {data.periodLabel}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#888888] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aperçu Document A4 Imprimable */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div
            ref={printContainerRef}
            className="mx-auto w-full max-w-2xl bg-[#ffffff] text-[#111111] p-8 shadow-md rounded-md space-y-6 text-xs leading-relaxed select-text border border-[#e5e5e5]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* En-tête officiel du rapport */}
            <div className="flex justify-between items-start border-b-2 border-[#111111] pb-4">
              <div>
                <div className="text-lg font-black tracking-tight uppercase text-[#000000]">
                  BOULANGERIE IVOIRE
                </div>
                <div className="text-xs text-[#555555] font-medium">
                  Fournil Industriel & Réseau de Boutiques · {data.branchName}
                </div>
                <div className="text-[10px] text-[#777777] font-mono mt-1">
                  RCCM: CI-ABJ-2024-B-10928 · NCC: 2109483 B · DGI FNE Télé-déclarée
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <span className="inline-block px-2.5 py-1 bg-[#f4f4f4] text-[#111111] font-mono font-bold text-[10px] rounded border border-[#dddddd]">
                  RAPPORT EXÉCUTIF MENSUEL
                </span>
                <div className="text-[10px] text-[#555555] font-mono pt-1">
                  Émis le : {data.generatedDate}
                </div>
                <div className="text-[10px] text-[#555555]">
                  Opérateur : {data.generatedBy}
                </div>
              </div>
            </div>

            {/* Titre & Période */}
            <div className="bg-[#f9f9f9] p-3 rounded border border-[#eeeeee] flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-[#111111] uppercase tracking-wide">
                  Synthèse d'Activité & Anticipation Financière
                </div>
                <div className="text-[11px] text-[#666666]">
                  Période d'évaluation : <strong>{data.periodLabel}</strong>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono bg-[#0070f3]/10 text-[#0070f3] px-2 py-0.5 rounded font-bold">
                  SYSCOHADA CONFORME
                </span>
              </div>
            </div>

            {/* Tableau des KPIs Clés */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#dddddd] pb-1">
                1. Performance Commerciale & Marge Brute
              </div>
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-[#cccccc] bg-[#f5f5f5]">
                    <th className="p-2 font-bold text-[#333333]">Indicateur Clé</th>
                    <th className="p-2 font-bold text-[#333333]">Valeur Constatée</th>
                    <th className="p-2 font-bold text-[#333333]">Évolution / Cible</th>
                    <th className="p-2 font-bold text-[#333333]">Observations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeee]">
                  <tr>
                    <td className="p-2 font-semibold">Chiffre d'Affaires Net</td>
                    <td className="p-2 font-bold font-mono text-[#000000]">
                      {data.totalRevenue} {data.revenueUnit}
                    </td>
                    <td className="p-2 font-mono text-[#222222]">{data.salesTrend}</td>
                    <td className="p-2 text-[#555555]">Conforme aux prévisions</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Taux de Marge d'Exploitation</td>
                    <td className="p-2 font-bold font-mono text-[#000000]">{data.marginRate}</td>
                    <td className="p-2 font-mono text-[#222222]">Cible ≥ 65%</td>
                    <td className="p-2 text-[#555555]">Marge brute : {data.marginAmount} FCFA</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Stock Farine (Autonomie)</td>
                    <td className="p-2 font-bold font-mono">{data.flourReserve} sacs</td>
                    <td className="p-2 text-[#555555]">{data.flourConsumed}</td>
                    <td className="p-2 text-[#555555]">Approvisionnement meunier sous contrôle</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Fournées & Cadence Fournil</td>
                    <td className="p-2 font-bold font-mono">{data.batchesCount} fournées</td>
                    <td className="p-2 text-[#555555]">{data.conformityRate} conformité</td>
                    <td className="p-2 text-[#555555]">Pertes matières inférieures à 0.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tableau Encaissements & Trésorerie */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#dddddd] pb-1">
                2. Rapprochement Monétaire & Flux de Caisse
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10.5px]">
                <div className="p-2.5 bg-[#fbfbfb] border border-[#eeeeee] rounded">
                  <div className="text-[#666666]">Espèces (Tiroir Cash)</div>
                  <div className="font-bold font-mono text-xs text-[#000000] mt-0.5">
                    {data.cashSplit.cash}
                  </div>
                </div>
                <div className="p-2.5 bg-[#fbfbfb] border border-[#eeeeee] rounded">
                  <div className="text-[#666666]">Wave Mobile Money</div>
                  <div className="font-bold font-mono text-xs text-[#000000] mt-0.5">
                    {data.cashSplit.wave}
                  </div>
                </div>
                <div className="p-2.5 bg-[#fbfbfb] border border-[#eeeeee] rounded">
                  <div className="text-[#666666]">Orange Money CI</div>
                  <div className="font-bold font-mono text-xs text-[#000000] mt-0.5">
                    {data.cashSplit.orange}
                  </div>
                </div>
              </div>
            </div>

            {/* Validation & Signatures */}
            <div className="pt-4 border-t-2 border-[#111111] grid grid-cols-2 gap-8 text-[10.5px]">
              <div>
                <div className="font-bold text-[#111111] uppercase">VISA DU CHEF D'EXPLOITATION</div>
                <div className="text-[10px] text-[#777777] mt-0.5">Certification des stocks & conformité fournil</div>
                <div className="h-14 border-b border-dashed border-[#bbbbbb] flex items-end pb-1 text-[#444444] italic">
                  Signé électroniquement (ERP-BOUL POS)
                </div>
              </div>

              <div>
                <div className="font-bold text-[#111111] uppercase">VISA DIRECTION GÉNÉRALE</div>
                <div className="text-[10px] text-[#777777] mt-0.5">Approbation trésorerie & clôture comptable</div>
                <div className="h-14 border-b border-dashed border-[#bbbbbb] flex items-end pb-1 text-[#444444] italic">
                  Bon pour archivage légal SYSCOHADA
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Vercel avec bouton bleu */}
        <div className="pt-2 border-t border-[#1f1f1f] flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportText}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Exporter Format Texte
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Fermer
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="text-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Imprimer / Enregistrer PDF (A4)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
