"use client";

import * as React from "react";
import { Button } from "./button";
import { formatNumber } from "@/lib/format";
import { Printer, Download, Check, X, ShieldCheck, QrCode } from "lucide-react";

export interface ReceiptItem {
  name: string;
  code: string;
  price: number;
  quantity: number;
}

export interface SaleReceiptData {
  ticketNumber: string;
  dateStr: string;
  timeStr: string;
  branchName: string;
  branchAddress: string;
  cashierName: string;
  items: ReceiptItem[];
  totalAmount: number;
  paymentMode: "cash" | "wave" | "orange";
  amountTendered: number;
  changeDue: number;
  fneRef: string;
}

export function ThermalReceiptModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: SaleReceiptData | null;
}) {
  const receiptRef = React.useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Génère un fichier texte brut ESC/POS
    const lines = [
      "========================================",
      "           BOULANGERIE IVOIRE           ",
      "      Fournil & Pâtisserie d'Abidjan     ",
      `     ${data.branchName} · ${data.branchAddress}`,
      "     RCCM: CI-ABJ-2024-B-10928           ",
      "     NCC: 2109483 B · DGI FNE            ",
      "========================================",
      `TICKET : ${data.ticketNumber}`,
      `DATE   : ${data.dateStr} à ${data.timeStr}`,
      `CAISSE : Caisse #01 (${data.cashierName})`,
      "----------------------------------------",
      "QTE  ARTICLE                    TOTAL   ",
      "----------------------------------------",
      ...data.items.map(
        (it) =>
          `${it.quantity.toString().padEnd(4)} ${(it.name.length > 20 ? it.name.slice(0, 19) + "." : it.name).padEnd(22)} ${formatNumber(it.price * it.quantity).padStart(8)} F`
      ),
      "----------------------------------------",
      `TOTAL A PAYER :      ${formatNumber(data.totalAmount)} FCFA`,
      `MODE REGLEMENT:      ${data.paymentMode.toUpperCase()}`,
      data.paymentMode === "cash"
        ? `ESPECES RECUES:      ${formatNumber(data.amountTendered)} FCFA\nMONNAIE RENDUE:      ${formatNumber(data.changeDue)} FCFA`
        : `REF TRANSACTION:     TX-${data.ticketNumber}`,
      "----------------------------------------",
      `CERTIFICATION FNE :  ${data.fneRef}`,
      "SIG: DGI-CI-SYSCOHADA-OK                ",
      "========================================",
      "   MERCI DE VOTRE VISITE - A BIENTOT !  ",
      "========================================",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ticket-${data.ticketNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      {/* Conteneur modale */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-[#262626] shadow-2xl p-6 space-y-5 animate-scaleUp max-h-[90vh] flex flex-col">
        {/* Header modale */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f1f1f]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0070f3]" />
            <h3 className="text-sm font-semibold text-white">
              Ticket de Caisse Imprimable (Format 80mm)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#888888] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aperçu Ticket Thermique 80mm (Style caisse enregistreuse EPSON / Star Micronics) */}
        <div className="flex-1 overflow-y-auto px-1 py-1">
          <div
            ref={receiptRef}
            className="mx-auto w-[320px] bg-[#ffffff] text-[#111111] p-5 shadow-lg rounded-sm font-mono text-[11px] leading-tight select-text border border-[#e5e5e5]"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            {/* Ligne de découpe papier haute */}
            <div className="text-center text-[10px] text-[#999999] border-b border-dashed border-[#cccccc] pb-2 mb-3">
              - - - - - - - - - DÉCOUPE PAPIER - - - - - - - - -
            </div>

            {/* En-tête de la boulangerie */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-[#888888]">
              <div className="font-bold text-sm tracking-widest uppercase">
                BOULANGERIE IVOIRE
              </div>
              <div className="text-[10px] text-[#444444]">
                Pains Traditionnels & Viennoiseries
              </div>
              <div className="text-[10px] text-[#444444]">
                {data.branchName} · {data.branchAddress}
              </div>
              <div className="text-[9px] text-[#666666] pt-1">
                RCCM: CI-ABJ-2024-B-10928 · NCC: 2109483 B
              </div>
            </div>

            {/* Métadonnées de la transaction */}
            <div className="py-2.5 border-b border-dashed border-[#888888] space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>TICKET N°:</span>
                <span className="font-bold">{data.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE :</span>
                <span>{data.dateStr} - {data.timeStr}</span>
              </div>
              <div className="flex justify-between">
                <span>CAISSE :</span>
                <span>Caisse #01 ({data.cashierName})</span>
              </div>
            </div>

            {/* Liste des articles */}
            <div className="py-2.5 border-b border-dashed border-[#888888] space-y-2">
              <div className="flex justify-between font-bold text-[10px] border-b border-[#eeeeee] pb-1">
                <span>QTE ARTICLE</span>
                <span>TOTAL</span>
              </div>
              {data.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-start text-[10.5px]">
                  <div className="flex-1 pr-2">
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-[9.5px] text-[#666666]">
                      {it.quantity} x {formatNumber(it.price)} FCFA
                    </div>
                  </div>
                  <div className="font-bold whitespace-nowrap">
                    {formatNumber(it.price * it.quantity)} F
                  </div>
                </div>
              ))}
            </div>

            {/* Récapitulatif Financier */}
            <div className="py-2.5 border-b-2 border-solid border-[#111111] space-y-1.5">
              <div className="flex justify-between text-xs font-bold pt-1">
                <span>TOTAL NET TTC :</span>
                <span className="text-sm">{formatNumber(data.totalAmount)} FCFA</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#555555]">
                <span>RÈGLEMENT :</span>
                <span className="font-bold uppercase">{data.paymentMode}</span>
              </div>
              {data.paymentMode === "cash" && (
                <>
                  <div className="flex justify-between text-[10px] text-[#555555]">
                    <span>ESPÈCES REÇUES :</span>
                    <span>{formatNumber(data.amountTendered)} FCFA</span>
                  </div>
                  <div className="flex justify-between text-[10.5px] font-bold">
                    <span>MONNAIE RENDUE :</span>
                    <span>{formatNumber(data.changeDue)} FCFA</span>
                  </div>
                </>
              )}
            </div>

            {/* Certification FNE Télé-déclarée DGI */}
            <div className="pt-3 pb-2 text-center space-y-1.5">
              <div className="flex items-center justify-center space-x-1 text-[10px] font-bold text-[#111111]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
                <span>FACTURE NORMALISÉE ÉLECTRONIQUE (FNE)</span>
              </div>
              <div className="text-[9px] text-[#555555]">
                REF: <strong className="text-[#111111]">{data.fneRef}</strong>
              </div>
              {/* Simulation Code-barres / QR Code */}
              <div className="py-1 flex justify-center">
                <div className="w-24 h-6 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_5px,#fff_5px,#fff_7px)] border border-[#000]" />
              </div>
              <div className="text-[9px] text-[#777777] uppercase">
                {data.fneRef}
              </div>
              <div className="text-[10px] font-bold pt-2 border-t border-dashed border-[#cccccc]">
                MERCI DE VOTRE VISITE · À BIENTÔT !
              </div>
            </div>

            {/* Ligne de découpe papier basse */}
            <div className="text-center text-[10px] text-[#999999] border-t border-dashed border-[#cccccc] pt-2 mt-2">
              - - - - - - - - - FORMAT 80 MM - - - - - - - - -
            </div>
          </div>
        </div>

        {/* Boutons d'Action (Bleu Vercel + Secondaire) */}
        <div className="pt-2 border-t border-[#1f1f1f] flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Exporter Fichier
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Fermer (Nouvelle Vente)
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="text-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Imprimer Reçu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
