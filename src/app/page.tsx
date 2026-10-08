"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { DesignSystemView } from "@/features/design-system/design-system-view";
import { PosPreview } from "@/features/pos/pos-preview";
import { ProductionPreview } from "@/features/production/production-preview";
import { InventoryPreview } from "@/features/inventory/inventory-preview";
import { FinancePreview } from "@/features/finance/finance-preview";
import { DEMO_BRANCHES, DEMO_USERS, DEMO_TENANT } from "@/server/auth/mock-users";
import { SessionContext } from "@/types/auth";
import { AuditLog } from "@/types/audit";
import { PERMISSION_DEFINITIONS } from "@/config/permissions";
import { PermissionName } from "@/types/rbac";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldCheck, Terminal, Sparkles } from "lucide-react";

export default function RootPage() {
  const [activeNavId, setActiveNavId] = React.useState<string>("design-system");
  const [session, setSession] = React.useState<SessionContext | null>(null);
  const [activeUserIndex, setActiveUserIndex] = React.useState<number>(0);
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);
  const [testPermissionResult, setTestPermissionResult] = React.useState<string | null>(null);

  // Charger session active
  const loadSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        const idx = DEMO_USERS.findIndex((u) => u.id === data.session.userId);
        if (idx !== -1) setActiveUserIndex(idx);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Charger logs d'audit
  const loadAuditLogs = async () => {
    try {
      const res = await fetch("/api/audit?limit=20");
      const data = await res.json();
      if (data.logs) {
        setAuditLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    loadSession();
    loadAuditLogs();
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
        loadAuditLogs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Bascule d'utilisateur (Persona switch)
  const handleUserChange = async (userId: string) => {
    const idx = DEMO_USERS.findIndex((u) => u.id === userId);
    if (idx !== -1) setActiveUserIndex(idx);

    try {
      const res = await fetch("/api/auth/switch-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        loadAuditLogs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Test de permission RBAC
  const checkInteractivePermission = (permission: PermissionName) => {
    if (!session) return;
    const isGranted = session.user.roleCodes.includes("SUPER_ADMIN") || session.permissions.includes(permission);
    if (isGranted) {
      setTestPermissionResult(`✅ AUTORISÉ : L'utilisateur [${session.user.fullName}] possède le droit [${permission}].`);
    } else {
      setTestPermissionResult(
        `⛔ REFUSÉ : Action bloquée par le système RBAC. Le profil [${session.user.roleCodes.join(", ")}] ne dispose pas de [${permission}].`
      );
    }
  };

  const activeBranch = DEMO_BRANCHES.find((b) => b.id === session?.branchId) || DEMO_BRANCHES[0];

  return (
    <AppShell
      activeNavId={activeNavId}
      onNavSelect={setActiveNavId}
      session={session}
      onBranchChange={handleBranchChange}
      onUserChange={handleUserChange}
    >
      {/* 1. VUE DESIGN SYSTEM (Master UI / UX Design System) */}
      {activeNavId === "design-system" && <DesignSystemView />}

      {/* 2. POINT DE VENTE (POS / Vente Comptoir) */}
      {activeNavId === "pos" && (
        <PageContainer>
          <PageHeader
            title="Point de Vente (POS) & Encaissement"
            description="Interface de caisse rapide optimisée pour écran tactile et clavier : encaissement espèces, Wave, Orange Money et certification FNE."
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

      {/* 6. SOCLE 01 FOUNDATION (Supervision RBAC & Audit) */}
      {activeNavId === "foundation" && (
        <PageContainer>
          <PageHeader
            title="Socle 01 Foundation — Console de Surveillance"
            description="Vérification de l'isolation multi-tenant, de la matrice des 39 permissions RBAC, de la piste d'audit légale et des moteurs monétaires XOF."
            breadcrumbs={[
              { label: "ERP-BOUL" },
              { label: "Socle Système" },
              { label: "01 Foundation" },
            ]}
          />

          {/* Cartes KPI Foundation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Session Utilisateur"
              value={session ? session.user.fullName : "Chargement..."}
              subValue={session?.roles[0]?.code}
              change={{ value: "Shift 8h Actif", trend: "up" }}
              hint={session?.branchId}
            />
            <StatCard
              label="Succursale Active"
              value={activeBranch.name}
              subValue={activeBranch.code}
              change={{ value: activeBranch.commune, trend: "neutral" }}
              hint={activeBranch.isMainProductionCenter ? "Fournil Principal" : "Point Vente"}
            />
            <StatCard
              label="Permissions Accordées"
              value={`${session?.permissions.length || 0} / 39`}
              subValue="RBAC Granulaire"
              change={{ value: "Isolation Active", trend: "up" }}
              hint="39 permissions définies"
            />
            <StatCard
              label="Piste d'Audit Immuable"
              value={auditLogs.length}
              subValue="Événements"
              change={{ value: "SYSCOHADA 10 ans", trend: "up" }}
              hint="Traçabilité légale 100%"
            />
          </div>

          {/* Simulateur Persona */}
          <Card>
            <CardHeader>
              <CardTitle>Bascule Rapide de Profil Opérateur (Persona Simulator)</CardTitle>
              <CardDescription>
                Permet de tester instantanément l'interface sous les différents rôles de la boulangerie ivoirienne.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {DEMO_USERS.map((user, idx) => {
                  const isSelected = activeUserIndex === idx;
                  return (
                    <Button
                      key={user.id}
                      variant={isSelected ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => handleUserChange(user.id)}
                    >
                      <span>{user.firstName} {user.lastName.charAt(0)}.</span>
                      <span className="text-[10px] font-mono opacity-80 ml-1">
                        ({user.roleCodes[0].replace("DIRECTEUR_GENERAL", "DG").replace("GERANT_BOUTIQUE", "GÉRANT").replace("CHEF_BOULANGER", "CHEF")})
                      </span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Test RBAC */}
          <Card>
            <CardHeader>
              <CardTitle>Test Dynamique des Droits RBAC</CardTitle>
              <CardDescription>
                Vérifie si le profil actuel est autorisé ou immédiatement bloqué.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <Button variant="outline" size="sm" onClick={() => checkInteractivePermission("pos.operate")}>
                  Encaisser Vente
                </Button>
                <Button variant="outline" size="sm" onClick={() => checkInteractivePermission("sales.refund")}>
                  Rembourser
                </Button>
                <Button variant="outline" size="sm" onClick={() => checkInteractivePermission("recipes.manage")}>
                  Modifier Recette
                </Button>
                <Button variant="outline" size="sm" onClick={() => checkInteractivePermission("production.validate")}>
                  Valider Fournée
                </Button>
                <Button variant="outline" size="sm" onClick={() => checkInteractivePermission("cash.close")}>
                  Clôturer Caisse
                </Button>
                <Button variant="outline" size="sm" onClick={() => checkInteractivePermission("fiscal.certify")}>
                  Certifier FNE
                </Button>
              </div>

              {testPermissionResult && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono border flex items-center justify-between ${
                    testPermissionResult.includes("AUTORISÉ")
                      ? "bg-emerald-950/30 border-emerald-800 text-emerald-300"
                      : "bg-rose-950/30 border-rose-800 text-rose-300"
                  }`}
                >
                  <span>{testPermissionResult}</span>
                  <button
                    onClick={() => setTestPermissionResult(null)}
                    className="text-gray-400 hover:text-white text-[10px] uppercase underline ml-4"
                  >
                    Effacer
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Piste d'audit live */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Journal d'Audit Centralisé (AuditLog)</CardTitle>
                <CardDescription>Événements enregistrés pour le tenant {DEMO_TENANT.id}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={loadAuditLogs}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Actualiser
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-white/[0.08] bg-[#090b12] text-xs font-mono space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        {log.action}
                      </span>
                      <span className="text-white font-semibold">{log.entity}#{log.entityId}</span>
                    </div>
                    <span className="text-gray-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString("fr-CI")}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 flex justify-between">
                    <span>Opérateur : <strong className="text-gray-200">{log.userName || log.userId}</strong></span>
                    <span className="italic text-gray-400">{log.reason}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </PageContainer>
      )}
    </AppShell>
  );
}
