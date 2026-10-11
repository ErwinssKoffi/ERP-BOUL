"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChartTrend, FlourSiloGauge, CategoryDistributionBar } from "@/components/ui/chart";
import { DateRangeDropdown, DateRangePeriod } from "@/components/ui/date-range-dropdown";
import { PdfReportModal, PdfReportData } from "@/components/ui/pdf-report-modal";
import { useToast } from "@/components/ui/toast";
import { formatNumber } from "@/lib/format";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Store,
  Box,
  CookingPot,
  Clock,
  RefreshCw,
  Flame,
  ArrowRight,
  ShoppingBag,
  BellRing,
  BarChart3,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  FileText,
} from "lucide-react";

// Données 30 jours pour l'analyse financière & anticipation de trésorerie
const THIRTY_DAYS_DATA = [
  { day: "12/09", date: "12 Sep", revenue: 310000, cost: 96000, margin: 214000, cumulative: 310000 },
  { day: "13/09", date: "13 Sep", revenue: 395000, cost: 122000, margin: 273000, cumulative: 705000 },
  { day: "14/09", date: "14 Sep", revenue: 380000, cost: 118000, margin: 262000, cumulative: 1085000 },
  { day: "15/09", date: "15 Sep", revenue: 298000, cost: 92000, margin: 206000, cumulative: 1383000 },
  { day: "16/09", date: "16 Sep", revenue: 315000, cost: 98000, margin: 217000, cumulative: 1698000 },
  { day: "17/09", date: "17 Sep", revenue: 330000, cost: 102000, margin: 228000, cumulative: 2028000 },
  { day: "18/09", date: "18 Sep", revenue: 305000, cost: 95000, margin: 210000, cumulative: 2333000 },
  { day: "19/09", date: "19 Sep", revenue: 360000, cost: 112000, margin: 248000, cumulative: 2693000 },
  { day: "20/09", date: "20 Sep", revenue: 420000, cost: 130000, margin: 290000, cumulative: 3113000 },
  { day: "21/09", date: "21 Sep", revenue: 390000, cost: 121000, margin: 269000, cumulative: 3503000 },
  { day: "22/09", date: "22 Sep", revenue: 302000, cost: 94000, margin: 208000, cumulative: 3805000 },
  { day: "23/09", date: "23 Sep", revenue: 325000, cost: 101000, margin: 224000, cumulative: 4130000 },
  { day: "24/09", date: "24 Sep", revenue: 340000, cost: 105000, margin: 235000, cumulative: 4470000 },
  { day: "25/09", date: "25 Sep", revenue: 312000, cost: 97000, margin: 215000, cumulative: 4782000 },
  { day: "26/09", date: "26 Sep", revenue: 375000, cost: 116000, margin: 259000, cumulative: 5157000 },
  { day: "27/09", date: "27 Sep", revenue: 435000, cost: 135000, margin: 300000, cumulative: 5592000 },
  { day: "28/09", date: "28 Sep", revenue: 395000, cost: 122000, margin: 273000, cumulative: 5987000 },
  { day: "29/09", date: "29 Sep", revenue: 308000, cost: 96000, margin: 212000, cumulative: 6295000 },
  { day: "30/09", date: "30 Sep", revenue: 335000, cost: 104000, margin: 231000, cumulative: 6630000 },
  { day: "01/10", date: "01 Oct", revenue: 360000, cost: 112000, margin: 248000, cumulative: 6990000 },
  { day: "02/10", date: "02 Oct", revenue: 320000, cost: 99000, margin: 221000, cumulative: 7310000 },
  { day: "03/10", date: "03 Oct", revenue: 385000, cost: 119000, margin: 266000, cumulative: 7695000 },
  { day: "04/10", date: "04 Oct", revenue: 445000, cost: 138000, margin: 307000, cumulative: 8140000 },
  { day: "05/10", date: "05 Oct", revenue: 295000, cost: 91000, margin: 204000, cumulative: 8435000 },
  { day: "06/10", date: "06 Oct", revenue: 312500, cost: 97000, margin: 215500, cumulative: 8747500 },
  { day: "07/10", date: "07 Oct", revenue: 328000, cost: 102000, margin: 226000, cumulative: 9075500 },
  { day: "08/10", date: "08 Oct", revenue: 305000, cost: 95000, margin: 210000, cumulative: 9380500 },
  { day: "09/10", date: "09 Oct", revenue: 362400, cost: 112000, margin: 250400, cumulative: 9742900 },
  { day: "10/10", date: "10 Oct", revenue: 418000, cost: 129000, margin: 289000, cumulative: 10160900 },
  { day: "11/10", date: "11 Oct", revenue: 384500, cost: 119000, margin: 265500, cumulative: 10545400 },
];

// Données 7 jours
const SEVEN_DAYS_DATA = [
  { day: "Lun 05", fullDate: "Lundi 05 Octobre", sales: 295000, baguettes: 980, viennoiseries: 380, avgTicket: 951 },
  { day: "Mar 06", fullDate: "Mardi 06 Octobre", sales: 312500, baguettes: 1040, viennoiseries: 410, avgTicket: 961 },
  { day: "Mer 07", fullDate: "Mercredi 07 Octobre", sales: 328000, baguettes: 1100, viennoiseries: 430, avgTicket: 964 },
  { day: "Jeu 08", fullDate: "Jeudi 08 Octobre", sales: 305000, baguettes: 1020, viennoiseries: 390, avgTicket: 968 },
  { day: "Ven 09", fullDate: "Vendredi 09 Octobre", sales: 362400, baguettes: 1190, viennoiseries: 480, avgTicket: 966 },
  { day: "Sam 10", fullDate: "Samedi 10 Octobre", sales: 418000, baguettes: 1380, viennoiseries: 560, avgTicket: 995 },
  { day: "Dim 11", fullDate: "Dimanche 11 Octobre", sales: 384500, baguettes: 1260, viennoiseries: 510, avgTicket: 985 },
];

// Données horaires (Aujourd'hui)
const HOURLY_DATA = [
  { label: "05h", value: 12500, formatted: "12 500 FCFA" },
  { label: "06h", value: 38000, formatted: "38 000 FCFA" },
  { label: "07h", value: 72400, formatted: "72 400 FCFA" },
  { label: "08h", value: 54000, formatted: "54 000 FCFA" },
  { label: "09h", value: 24500, formatted: "24 500 FCFA" },
  { label: "10h", value: 18200, formatted: "18 200 FCFA" },
  { label: "11h", value: 22000, formatted: "22 000 FCFA" },
  { label: "12h", value: 35000, formatted: "35 000 FCFA" },
  { label: "13h", value: 19500, formatted: "19 500 FCFA" },
  { label: "14h", value: 14000, formatted: "14 000 FCFA" },
  { label: "15h", value: 21000, formatted: "21 000 FCFA" },
  { label: "16h", value: 48500, formatted: "48 500 FCFA" },
  { label: "17h", value: 65000, formatted: "65 000 FCFA" },
  { label: "18h", value: 42000, formatted: "42 000 FCFA" },
  { label: "19h", value: 28500, formatted: "28 500 FCFA" },
];

// Tooltip 30 jours Vercel monochrome
function VercelTooltip30Days({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a]/95 backdrop-blur-md p-3.5 shadow-2xl text-xs font-mono space-y-2 min-w-[220px] select-none">
        <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-1.5">
          <span className="font-semibold text-white">{data.date}</span>
          <span className="text-[10px] text-[#888888] bg-[#171717] px-1.5 py-0.5 rounded border border-[#262626]">
            {data.day}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-[#888888] text-[11px]">Revenu encaissé :</span>
            <span className="text-sm font-bold text-white">{formatNumber(data.revenue)} FCFA</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#a1a1aa]">
            <span>Charges matières (31%) :</span>
            <span className="font-medium text-[#ededed]">-{formatNumber(data.cost)} FCFA</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#a1a1aa]">
            <span>Marge d'exploitation :</span>
            <span className="font-medium text-[#ededed]">+{formatNumber(data.margin)} FCFA</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#888888] pt-1.5 border-t border-[#1f1f1f]">
            <span>Cumul à date :</span>
            <span className="text-white font-bold">{formatNumber(data.cumulative)} FCFA</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// Tooltip 7 jours Vercel monochrome
function VercelTooltip7Days({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a]/95 backdrop-blur-md p-3.5 shadow-2xl text-xs font-mono space-y-2 min-w-[210px] select-none">
        <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-1.5">
          <span className="font-semibold text-white">{data.fullDate}</span>
          <span className="text-[10px] text-[#888888] bg-[#171717] px-1.5 py-0.5 rounded border border-[#262626]">
            {data.day}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-[#888888] text-[11px]">Chiffre d'Affaires :</span>
            <span className="text-sm font-bold text-white">{formatNumber(data.sales)} FCFA</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#a1a1aa]">
            <span>Baguettes écoulées :</span>
            <span className="font-medium text-white">{formatNumber(data.baguettes)} pcs</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#a1a1aa]">
            <span>Viennoiseries :</span>
            <span className="font-medium text-white">{formatNumber(data.viennoiseries)} pcs</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function GlobalDashboardView({ onNavigate }: { onNavigate?: (module: string) => void }) {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = React.useState<DateRangePeriod>("7days");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculs dynamiques selon la période sélectionnée
  const kpiData = React.useMemo(() => {
    switch (selectedPeriod) {
      case "today":
        return {
          periodLabel: "Aujourd'hui (05h - 19h)",
          totalRevenue: "348 750",
          revenueUnit: "FCFA",
          salesTrend: "+14.2% vs hier",
          salesHint: "1 840 pièces écoulées",
          flourReserve: "51",
          flourReserveSub: "sacs (2 550 kg)",
          flourTrend: "6 sacs consommés ce jour",
          flourHint: "~8.5 jours d'autonomie",
          batchesCount: "4",
          batchesSub: "tournées actives",
          batchesTrend: "1 défournage imminent",
          batchesHint: "585 pièces en cuisson/pousse",
          marginRate: "69.4 %",
          marginSub: "Taux Réel",
          marginTrend: "+2.1% objectif",
          marginHint: "Marge brute : 241 800 FCFA",
          cashFlowOperating: "+241 800 FCFA",
          chartTitle: "Courbe d'Affluence & Chiffre d'Affaires Horaire (Aujourd'hui)",
          chartDesc: "Débit enregistré au comptoir boutique (Plateau) de 05h à 19h.",
          chartTotalBadge: "348 750 FCFA (Jour)",
          cashSplit: {
            cash: "226 700 FCFA (65%)",
            wave: "80 200 FCFA (23%)",
            orange: "41 850 FCFA (12%)",
          },
          categoryDistribution: [
            { label: "Pains & Baguettes", percentage: 62, amount: "216 200 FCFA", color: "#ffffff" },
            { label: "Viennoiseries", percentage: 23, amount: "80 200 FCFA", color: "#a1a1aa" },
            { label: "Pâtisseries & Gâteaux", percentage: 10, amount: "34 850 FCFA", color: "#71717a" },
            { label: "Boissons & Épicerie", percentage: 5, amount: "17 500 FCFA", color: "#3f3f46" },
          ],
        };
      case "30days":
      case "month":
        return {
          periodLabel: selectedPeriod === "month" ? "Ce Mois-ci (Octobre 2026)" : "30 Derniers Jours",
          totalRevenue: "10 842 500",
          revenueUnit: "FCFA",
          salesTrend: "+14.8% vs M-1",
          salesHint: "Moyenne : 361 417 FCFA/j",
          flourReserve: "51",
          flourReserveSub: "sacs en réserve",
          flourTrend: "186 sacs consommés sur 30j",
          flourHint: "Consommation : 9 300 kg",
          batchesCount: "420",
          batchesSub: "fournées réalisées",
          batchesTrend: "98.8% taux conformité",
          batchesHint: "Rebuts maîtrisés à 0.38%",
          marginRate: "68.8 %",
          marginSub: "Marge Brute",
          marginTrend: "Projection +4.2%",
          marginHint: "Excédent : 7 459 640 FCFA",
          cashFlowOperating: "+7 459 640 FCFA",
          chartTitle: "Tendance des Revenus sur les 30 Derniers Jours (Anticipation de Trésorerie)",
          chartDesc: "Évolution quotidienne du chiffre d'affaires et projection des décaissements meuniers.",
          chartTotalBadge: "10 842 500 FCFA (30j)",
          cashSplit: {
            cash: "7 047 625 FCFA (65%)",
            wave: "2 493 775 FCFA (23%)",
            orange: "1 301 100 FCFA (12%)",
          },
          categoryDistribution: [
            { label: "Pains & Baguettes", percentage: 62, amount: "6 722 350 FCFA", color: "#ffffff" },
            { label: "Viennoiseries", percentage: 23, amount: "2 493 775 FCFA", color: "#a1a1aa" },
            { label: "Pâtisseries & Gâteaux", percentage: 10, amount: "1 084 250 FCFA", color: "#71717a" },
            { label: "Boissons & Épicerie", percentage: 5, amount: "542 125 FCFA", color: "#3f3f46" },
          ],
        };
      case "7days":
      default:
        return {
          periodLabel: "7 Derniers Jours",
          totalRevenue: "2 405 400",
          revenueUnit: "FCFA",
          salesTrend: "+16.8% vs semaine N-1",
          salesHint: "Moyenne : 343 628 FCFA/j",
          flourReserve: "51",
          flourReserveSub: "sacs en réserve",
          flourTrend: "42 sacs consommés sur 7j",
          flourHint: "~8.5 jours d'autonomie",
          batchesCount: "98",
          batchesSub: "fournées produites",
          batchesTrend: "Cadence nominale",
          batchesHint: "Pic de vente le Samedi",
          marginRate: "69.1 %",
          marginSub: "Taux Réel",
          marginTrend: "+1.9% vs cible",
          marginHint: "Marge brute : 1 662 130 FCFA",
          cashFlowOperating: "+1 662 130 FCFA",
          chartTitle: "Tendance des Ventes sur les 7 Derniers Jours (Recharts)",
          chartDesc: "Dynamique hebdomadaire des ventes avec volumes de baguettes et viennoiseries.",
          chartTotalBadge: "2 405 400 FCFA (7j)",
          cashSplit: {
            cash: "1 563 510 FCFA (65%)",
            wave: "553 242 FCFA (23%)",
            orange: "288 648 FCFA (12%)",
          },
          categoryDistribution: [
            { label: "Pains & Baguettes", percentage: 62, amount: "1 491 348 FCFA", color: "#ffffff" },
            { label: "Viennoiseries", percentage: 23, amount: "553 242 FCFA", color: "#a1a1aa" },
            { label: "Pâtisseries & Gâteaux", percentage: 10, amount: "240 540 FCFA", color: "#71717a" },
            { label: "Boissons & Épicerie", percentage: 5, amount: "120 270 FCFA", color: "#3f3f46" },
          ],
        };
    }
  }, [selectedPeriod]);

  // Gestion du rafraîchissement
  const handlePeriodChange = (period: DateRangePeriod) => {
    setSelectedPeriod(period);
    toast({
      type: "info",
      title: "Période Actualisée",
      message: `Télémétrie et graphiques recalculés pour : ${
        period === "today"
          ? "Aujourd'hui"
          : period === "7days"
          ? "7 Derniers Jours"
          : period === "30days"
          ? "30 Derniers Jours"
          : "Ce Mois-ci"
      }.`,
    });
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        type: "success",
        title: "Télémétrie Synchronisée",
        message: "Tous les indicateurs clés et courbes Recharts ont été mis à jour.",
      });
    }, 500);
  };

  // Fournées actives au fournil
  const activeBatches = [
    {
      id: "OF-2026-104",
      product: "Baguette Standard (200g)",
      quantity: 240,
      step: "Cuisson Four Sole (Sole #1)",
      temp: "230°C",
      timeLeft: "3 min restantes",
      progress: 88,
      status: "critical" as const,
    },
    {
      id: "OF-2026-105",
      product: "Pain au Chocolat (2 Barres)",
      quantity: 120,
      step: "Chambre de Pousse / Apprêt",
      temp: "26°C · 75% H.",
      timeLeft: "18 min restantes",
      progress: 60,
      status: "normal" as const,
    },
    {
      id: "OF-2026-106",
      product: "Baguette Traditionnelle T55",
      quantity: 180,
      step: "Pétrin à Spirale (2ème vitesse)",
      temp: "T° pâte : 23.8°C",
      timeLeft: "6 min de pétrissage",
      progress: 25,
      status: "normal" as const,
    },
    {
      id: "OF-2026-107",
      product: "Brioche Tressée Pur Beurre",
      quantity: 45,
      step: "Défourné / Ressuage",
      temp: "Zone Grille",
      timeLeft: "Prêt pour mise en rayon",
      progress: 100,
      status: "ready" as const,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Tableau de Bord Global"
        description="Vue de commandement opérationnelle & financière de la boulangerie : volume de vente, silos de farine, cadence du fournil et flux de trésorerie."
        breadcrumbs={[
          { label: "ERP-BOUL" },
          { label: "Pilotage Stratégique" },
          { label: "Tableau de Bord Global" },
        ]}
        actions={
          <div className="flex items-center space-x-2.5">
            {/* Dropdown de sélection de période temporelle */}
            <DateRangeDropdown
              value={selectedPeriod}
              onChange={handlePeriodChange}
            />

            {/* Bouton Exporter Rapport PDF (A4) */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPdfModalOpen(true)}
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Exporter Rapport PDF
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              isLoading={isRefreshing}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Actualiser
            </Button>
          </div>
        }
      />

      {/* KPI CARDS VERCEL TEMPLATE (Monochrome haute précision) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={`Chiffre d'Affaires (${kpiData.periodLabel})`}
          value={kpiData.totalRevenue}
          subValue={kpiData.revenueUnit}
          accent
          change={{ value: kpiData.salesTrend, trend: "up" }}
          hint={kpiData.salesHint}
          icon={<ShoppingBag className="w-4 h-4 text-[#ededed]" />}
        />

        <StatCard
          label="Stocks Farine & Réserves"
          value={kpiData.flourReserve}
          subValue={kpiData.flourReserveSub}
          change={{ value: kpiData.flourTrend, trend: "neutral" }}
          hint={kpiData.flourHint}
          icon={<Box className="w-4 h-4 text-[#ededed]" />}
        />

        <StatCard
          label="Activité & Fournées"
          value={kpiData.batchesCount}
          subValue={kpiData.batchesSub}
          change={{ value: kpiData.batchesTrend, trend: "up" }}
          hint={kpiData.batchesHint}
          icon={<CookingPot className="w-4 h-4 text-[#ededed]" />}
        />

        <StatCard
          label="Marge d'Exploitation"
          value={kpiData.marginRate}
          subValue={kpiData.marginSub}
          change={{ value: kpiData.marginTrend, trend: "up" }}
          hint={kpiData.marginHint}
          icon={<TrendingUp className="w-4 h-4 text-[#ededed]" />}
        />
      </div>

      {/* SECTION 1 : VISUALISATION DES VENTES (RECHARTS AREA CHART SYNCHRONISÉ) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#1f1f1f]">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#ededed]" />
                <span>{kpiData.chartTitle}</span>
              </CardTitle>
              <CardDescription>{kpiData.chartDesc}</CardDescription>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#0070f3] inline-block shadow-[0_0_8px_rgba(0,112,243,0.5)]" />
              <span className="text-[#ededed] font-medium">{kpiData.chartTotalBadge}</span>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Graphique Recharts 30 Jours */}
            {(selectedPeriod === "30days" || selectedPeriod === "month") && (
              <div className="w-full h-72 pt-2">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={THIRTY_DAYS_DATA}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="vercelBlueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0070f3" stopOpacity={0.35} />
                          <stop offset="60%" stopColor="#0070f3" stopOpacity={0.08} />
                          <stop offset="95%" stopColor="#0070f3" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.05)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="date"
                        stroke="#666666"
                        tick={{ fill: "#888888", fontSize: 10, fontFamily: "monospace" }}
                        axisLine={{ stroke: "#262626" }}
                        tickLine={{ stroke: "#262626" }}
                        interval={4}
                      />

                      <YAxis
                        stroke="#666666"
                        tick={{ fill: "#888888", fontSize: 10, fontFamily: "monospace" }}
                        axisLine={{ stroke: "#262626" }}
                        tickLine={{ stroke: "#262626" }}
                        tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                        domain={[250000, 480000]}
                      />

                      <Tooltip content={<VercelTooltip30Days />} />

                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenu Quotidien"
                        stroke="#0070f3"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#vercelBlueGradient)"
                        activeDot={{
                          r: 5,
                          fill: "#ffffff",
                          stroke: "#0070f3",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#888888] font-mono">
                    Chargement Recharts...
                  </div>
                )}
              </div>
            )}

            {/* Graphique Recharts 7 Jours */}
            {selectedPeriod === "7days" && (
              <div className="w-full h-72 pt-2">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={SEVEN_DAYS_DATA}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="vercelBlue7DaysGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0070f3" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#0070f3" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                      <XAxis dataKey="day" stroke="#666666" tick={{ fill: "#888888", fontSize: 11, fontFamily: "monospace" }} axisLine={{ stroke: "#262626" }} />
                      <YAxis stroke="#666666" tick={{ fill: "#888888", fontSize: 10, fontFamily: "monospace" }} axisLine={{ stroke: "#262626" }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                      <Tooltip content={<VercelTooltip7Days />} />
                      <Area type="monotone" dataKey="sales" stroke="#0070f3" strokeWidth={2} fill="url(#vercelBlue7DaysGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : null}
              </div>
            )}

            {/* Graphique Horaire (Aujourd'hui) */}
            {selectedPeriod === "today" && (
              <AreaChartTrend data={HOURLY_DATA} height={160} strokeColor="#0070f3" />
            )}

            {/* Ventilation par rayon Vercel monochrome */}
            <div className="pt-3 border-t border-[#1f1f1f]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">
                  Répartition des Ventes par Famille ({kpiData.periodLabel})
                </span>
                <span className="text-[11px] font-mono text-[#888888]">
                  Total : 100% encaissé
                </span>
              </div>
              <CategoryDistributionBar items={kpiData.categoryDistribution} />
            </div>
          </CardContent>
        </Card>

        {/* Encaissement & Canaux de Paiement */}
        <Card className="lg:col-span-4 flex flex-col justify-between">
          <CardHeader className="pb-2 border-b border-[#1f1f1f]">
            <CardTitle>Canaux d'Encaissement & Caisse</CardTitle>
            <CardDescription>Rapprochement monétaire {kpiData.periodLabel}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#888888] flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ededed]" />
                  <span>Espèces (Tiroir Cash) :</span>
                </span>
                <span className="font-mono font-bold text-white">{kpiData.cashSplit.cash}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#888888] flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#888888]" />
                  <span>Wave Côte d'Ivoire :</span>
                </span>
                <span className="font-mono font-bold text-white">{kpiData.cashSplit.wave}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#888888] flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#666666]" />
                  <span>Orange Money :</span>
                </span>
                <span className="font-mono font-bold text-white">{kpiData.cashSplit.orange}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#222222] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[#888888]">
                <span>Fond de caisse :</span>
                <span className="text-[#ededed]">50 000 FCFA</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Écart de caisse :</span>
                <span className="text-white font-bold">0 FCFA (Conforme)</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Certification FNE :</span>
                <span className="text-white font-bold">100% Télé-certifié</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate?.("pos")}
              className="w-full text-xs font-medium"
            >
              <Store className="w-3.5 h-3.5 mr-1.5" />
              Ouvrir le Point de Vente (POS)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 2 : ÉTAT DES STOCKS DE FARINE & SILOS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center space-x-2">
              <Box className="w-4 h-4 text-[#ededed]" />
              <span>État Actuel des Stocks de Farine & Réserves (FEFO)</span>
            </h3>
            <p className="text-xs text-[#888888]">
              Surveillance continue des réserves physiques de farine pour prévenir tout arrêt de production au pétrin.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.("inventory")}
            className="text-xs shrink-0"
          >
            Consulter l'Inventaire Complet
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FlourSiloGauge
            name="Farine de Blé T55 Moulins de CI"
            code="FAR-T55-MCI"
            currentBags={32}
            maxBags={45}
            minAlertThreshold={12}
            daysAutonomy={9}
          />

          <FlourSiloGauge
            name="Farine de Tradition Française"
            code="FAR-TRD-IMP"
            currentBags={14}
            maxBags={20}
            minAlertThreshold={6}
            daysAutonomy={7}
          />

          <FlourSiloGauge
            name="Farine Complète T150 (GMA)"
            code="FAR-CMP-T150"
            currentBags={5}
            maxBags={15}
            minAlertThreshold={8}
            daysAutonomy={2}
          />
        </div>
      </div>

      {/* SECTION 3 : FOURNÉES EN COURS AU FOURNIL */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center space-x-2">
              <Flame className="w-4 h-4 text-[#ededed]" />
              <span>Fournées en Cours & Cadence de Production (4 Actives)</span>
            </h3>
            <p className="text-xs text-[#888888]">
              Flux temps réel des ordres de fabrication : pétrin spirale, pointage bac, chambre de pousse et sole du four.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.("production")}
            className="text-xs shrink-0"
          >
            Ouvrir le Fournil
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeBatches.map((batch) => (
            <div
              key={batch.id}
              className={`p-4 rounded-xl border bg-[#0a0a0a] flex flex-col justify-between space-y-3 transition-colors ${
                batch.status === "critical"
                  ? "border-[#0070f3] shadow-[0_0_12px_rgba(0,112,243,0.15)]"
                  : "border-[#222222]"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-white">{batch.id}</span>
                  {batch.status === "critical" ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0070f3]/20 text-[#0070f3] font-semibold border border-[#0070f3]/40 animate-pulse">
                      Défournage !
                    </span>
                  ) : batch.status === "ready" ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-white font-medium border border-white/20">
                      Prêt Magasin
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#888888]">{batch.temp}</span>
                  )}
                </div>

                <div className="text-xs font-semibold text-white line-clamp-1">{batch.product}</div>
                <div className="text-[11px] text-[#888888] font-mono">
                  {batch.quantity} pièces · {batch.step}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#1f1f1f]">
                {/* Barre de progression monochrome Vercel */}
                <div className="w-full bg-[#171717] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      batch.status === "critical" ? "bg-[#0070f3]" : "bg-[#888888]"
                    }`}
                    style={{ width: `${batch.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#888888]">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-[#888888]" />
                    <span>{batch.timeLeft}</span>
                  </span>
                  <span>{batch.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BANDEAU D'ACTION RAPIDE VERCEL AVEC BOUTON BLEU */}
      <div className="p-3.5 rounded-xl border border-[#222222] bg-[#0a0a0a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white shrink-0">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white">Anticipation Meunier : Réapprovisionnement Farine T150</div>
            <div className="text-[11px] text-[#888888]">
              Stock de Farine Complète (5 sacs) sous le seuil d'alerte de 8 sacs. Émission d'un bon de commande de 15 sacs préparée.
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              toast({
                type: "success",
                title: "Bon de Commande Validé",
                message: "Commande de 15 sacs de Farine T150 transmise aux Grands Moulins d'Abidjan.",
              });
            }}
          >
            Valider Bon de Commande
          </Button>
        </div>
      </div>

      {/* Fenêtre Modale de Génération de Rapport PDF Exécutif (A4) */}
      <PdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        data={{
          periodLabel: kpiData.periodLabel,
          totalRevenue: kpiData.totalRevenue,
          revenueUnit: kpiData.revenueUnit,
          salesTrend: kpiData.salesTrend,
          marginRate: kpiData.marginRate,
          marginAmount: kpiData.marginHint.replace("Marge brute : ", "").replace("Excédent : ", ""),
          flourReserve: kpiData.flourReserve,
          flourConsumed: kpiData.flourTrend,
          batchesCount: kpiData.batchesCount,
          conformityRate: kpiData.batchesTrend,
          generatedDate: "11/10/2026 à 18:12 GMT",
          generatedBy: "Jean Kouassi (Directeur Général)",
          branchName: "Plateau Vente Boutique & Fournil",
          cashSplit: kpiData.cashSplit,
        }}
      />
    </PageContainer>
  );
}
