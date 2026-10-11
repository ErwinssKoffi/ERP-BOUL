"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlobalDashboardView } from "@/features/dashboard/global-dashboard-view";
import { PosPreview } from "@/features/pos/pos-preview";
import { ProductionPreview } from "@/features/production/production-preview";
import { InventoryPreview } from "@/features/inventory/inventory-preview";
import { FinancePreview } from "@/features/finance/finance-preview";
import { DEMO_BRANCHES, DEMO_USERS } from "@/server/auth/mock-users";
import { SessionContext } from "@/types/auth";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";

export default function RootPage() {
  const [activeNavId, setActiveNavId] = React.useState<string>("dashboard");
  const [session, setSession] = React.useState<SessionContext | null>(null);

  // Charger session active
  const loadSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    loadSession();
  }, []);

  // Bascule de succursale
  const handleBranchChange = async (branchId: string) => {
    try {
      const res = await fetch("/api/auth/switch-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchId }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Bascule d'utilisateur (Persona switch)
  const handleUserChange = async (userId: string) => {
    try {
      const res = await fetch("/api/auth/switch-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppShell
      activeNavId={activeNavId}
      onNavSelect={setActiveNavId}
      session={session}
      onBranchChange={handleBranchChange}
      onUserChange={handleUserChange}
    >
      {/* 1. TABLEAU DE BORD GLOBAL (Dashboard exécutif temps réel) */}
      {activeNavId === "dashboard" && (
        <GlobalDashboardView onNavigate={(mod) => setActiveNavId(mod)} />
      )}

      {/* 2. POINT DE VENTE (POS / Vente Comptoir) */}
      {activeNavId === "pos" && (
        <PageContainer>
          <PageHeader
            title="Point de Vente (POS) & Encaissement"
            description="Interface de caisse rapide tactile et clavier : encaissement espèces, Wave, Orange Money et émission ticket thermique 80mm."
            breadcrumbs={[
              { label: "ERP-BOUL" },
              { label: "Vente & Caisse" },
              { label: "Terminal POS" },
            ]}
          />
          <PosPreview />
        </PageContainer>
      )}

      {/* 3. PRODUCTION & FOURNIL */}
      {activeNavId === "production" && (
        <PageContainer>
          <PageHeader
            title="Production & Fournil (Pétrin & Fours)"
            description="Pilotage des tournées de pétrissage, ratios d'hydratation (64% - 68%), températures de coulée et défournage."
            breadcrumbs={[
              { label: "ERP-BOUL" },
              { label: "Fournil & Recettes" },
              { label: "Ordres de Fabrication" },
            ]}
          />
          <ProductionPreview />
        </PageContainer>
      )}

      {/* 4. STOCK & FARINES */}
      {activeNavId === "inventory" && (
        <PageContainer>
          <PageHeader
            title="Gestion des Stocks & Farines (FEFO)"
            description="Contrôle des silos et sacs de farine, seuils de sécurité meuniers, rotation First Expired First Out et fiches de pesée."
            breadcrumbs={[
              { label: "ERP-BOUL" },
              { label: "Stocks & Matières" },
              { label: "Farinier & Ingrédients" },
            ]}
          />
          <InventoryPreview />
        </PageContainer>
      )}

      {/* 5. FINANCE & TRÉSORERIE */}
      {activeNavId === "finance" && (
        <PageContainer>
          <PageHeader
            title="Trésorerie, Caisse & Conformité FNE"
            description="Rapprochement journalier des espèces, ventilation Wave / Orange Money, marge brute d'exploitation et journal pré-SYSCOHADA."
            breadcrumbs={[
              { label: "ERP-BOUL" },
              { label: "Finance & Fiscal" },
              { label: "Trésorerie" },
            ]}
          />
          <FinancePreview />
        </PageContainer>
      )}
    </AppShell>
  );
}
