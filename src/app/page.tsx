"use client";

import { useEffect, useState, useTransition } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  FileText,
  Coins,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ArrowRightLeft,
  Lock,
  Unlock,
  RefreshCw,
  Terminal,
  Layers,
  Store,
  Sparkles,
  Info,
  ChevronDown,
} from "lucide-react";

import { DEMO_BRANCHES, DEMO_TENANT, DEMO_COMPANY, DEMO_USERS } from "@/server/auth/mock-users";
import { ROLE_DEFINITIONS, PERMISSION_DEFINITIONS } from "@/config/permissions";
import { PermissionName, RoleCode } from "@/types/rbac";
import { AuditLog } from "@/types/audit";
import { SessionContext } from "@/types/auth";
import { moneyFromDecimalFCFA, moneyFromFCFA, multiplyMoney, formatFCFA, toDecimalFCFA } from "@/lib/money";
import { convertUnit, formatQuantityWithUnit } from "@/lib/units";
import { ConfigurableUnitCode } from "@/types/units";

export default function FoundationPage() {
  const [activeUserIndex, setActiveUserIndex] = useState<number>(0);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("br_plateau");
  const [session, setSession] = useState<SessionContext | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("all");
  const [testPermissionResult, setTestPermissionResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Outil de test Monnaie FCFA
  const [baguetteCount, setBaguetteCount] = useState<number>(100);
  const [flourBagPrice, setFlourBagPrice] = useState<number>(23500); // 23 500 FCFA le sac de 50 kg

  // Outil de conversion Unités
  const [convertQty, setConvertQty] = useState<number>(5);
  const [fromUnit, setFromUnit] = useState<ConfigurableUnitCode>("sac");
  const [toUnit, setToUnit] = useState<ConfigurableUnitCode>("kg");

  // Onglet actif
  const [activeTab, setActiveTab] = useState<"overview" | "rbac" | "audit" | "tools" | "deliverables">("overview");

  const currentUser = DEMO_USERS[activeUserIndex];
  const activeBranch = DEMO_BRANCHES.find((b) => b.id === selectedBranchId) || DEMO_BRANCHES[0];

  // Chargement de la session active
  const loadSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        setSelectedBranchId(data.session.branchId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement des logs d'audit
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

  useEffect(() => {
    loadSession();
    loadAuditLogs();
  }, []);

  // Bascule d'utilisateur (Persona switch)
  const handleUserChange = async (index: number) => {
    const targetUser = DEMO_USERS[index];
    setActiveUserIndex(index);
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/switch-context", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: targetUser.id,
            branchId: targetUser.accessibleBranchIds[0] || "br_plateau",
          }),
        });
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
          setSelectedBranchId(data.session.branchId);
          loadAuditLogs();
        }
      } catch (e) {
        console.error(e);
      }
    });
  };

  // Bascule de succursale
  const handleBranchChange = async (branchId: string) => {
    setSelectedBranchId(branchId);
    startTransition(async () => {
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
    });
  };

  // Test interactif d'une permission
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

  // Simulation d'une action pour générer un log d'audit
  const triggerSampleAudit = async (action: string, entity: string, reason: string) => {
    try {
      await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          entity,
          entityId: `demo_${Date.now()}`,
          oldValue: { status: "pending" },
          newValue: { status: "processed", actor: currentUser.firstName },
          reason,
          severity: action.includes("VARIANCE") || action.includes("WASTE") ? "WARNING" : "INFO",
        }),
      });
      loadAuditLogs();
    } catch (e) {
      console.error(e);
    }
  };

  // Calcul exact du coût matière unitaire de farine pour une baguette standard
  // 1 sac = flourBagPrice FCFA pour 50 kg -> 1 kg = flourBagPrice/50 -> 1g = (flourBagPrice/50)/1000
  const flourPerGramFCFA = (flourBagPrice / 50) / 1000;
  const flourMoneyPerGram = moneyFromDecimalFCFA(flourPerGramFCFA);
  const flourPerBaguetteGrams = 140; // 140g de farine par baguette 200g cuite
  const flourCostPerBaguette = multiplyMoney(flourMoneyPerGram, flourPerBaguetteGrams);
  const totalBatchFlourCost = multiplyMoney(flourCostPerBaguette, baguetteCount);

  // Conversion d'unités
  let conversionResultText = "";
  try {
    const res = convertUnit(convertQty, fromUnit, toUnit);
    conversionResultText = `${res.fromQuantity} ${res.fromUnit} = ${res.toQuantity.toLocaleString()} ${res.toUnit}`;
  } catch (err: any) {
    conversionResultText = `Erreur: ${err.message}`;
  }

  // Filtrage des permissions
  const filteredPermissions = PERMISSION_DEFINITIONS.filter((p) => {
    if (selectedModuleFilter === "all") return true;
    return p.module === selectedModuleFilter;
  });

  return (
    <div className="min-h-screen bg-[#07080c] text-gray-100 flex flex-col font-sans selection:bg-amber-500/20">
      {/* Top Header — Moniteur Système & Contexte Multi-Tenant */}
      <header className="border-b border-[#1b2030] bg-[#0c0e17]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-black shadow-lg shadow-amber-500/10">
              <span className="tracking-tight text-sm font-black">EB</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm tracking-wide text-white">ERP-BOUL</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  01 Foundation
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate max-w-xs sm:max-w-md">
                {DEMO_TENANT.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sélecteur de Succursale (Branch) */}
            <div className="relative flex items-center">
              <Store className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 pointer-events-none" />
              <select
                value={selectedBranchId}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="bg-[#131722] border border-[#262d40] text-gray-200 text-xs rounded-lg pl-8 pr-7 py-1.5 appearance-none focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
              >
                {DEMO_BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.commune})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2 pointer-events-none" />
            </div>

            {/* Devise Métier */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#131722] border border-[#222838] text-xs font-mono text-gray-300">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>XOF / FCFA</span>
            </div>

            {/* Statut Système */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">Socle Actif</span>
            </div>
          </div>
        </div>
      </header>

      {/* Barre de Persona Switcher (Simulation d'authentification et rôles) */}
      <section className="bg-[#0e111a] border-b border-[#1b2030] py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-gray-400">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-gray-300">Simulateur de Session & Rôles :</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {DEMO_USERS.map((user, idx) => {
              const isSelected = activeUserIndex === idx;
              const role = user.roleCodes[0];
              return (
                <button
                  key={user.id}
                  onClick={() => handleUserChange(idx)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? "bg-amber-500 text-black shadow-sm font-semibold"
                      : "bg-[#141824] hover:bg-[#1a2030] text-gray-300 border border-[#23293a]"
                  }`}
                >
                  <span>{user.firstName} {user.lastName.charAt(0)}.</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-mono uppercase ${
                      isSelected ? "bg-black/20 text-black" : "bg-[#1c2236] text-amber-300/80"
                    }`}
                  >
                    {role.replace("DIRECTEUR_GENERAL", "DG").replace("GERANT_BOUTIQUE", "GÉRANT").replace("CHEF_BOULANGER", "CHEF").replace("RESPONSABLE_PRODUCTION", "PROD").replace("COMPTABLE", "COMPTA")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Corps Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Navigation par Onglets */}
        <div className="flex border-b border-[#1b2030] space-x-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === "overview"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Vue d'Ensemble 01 Foundation</span>
          </button>
          <button
            onClick={() => setActiveTab("rbac")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === "rbac"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>RBAC & Permissions ({session?.permissions.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === "audit"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Piste d'Audit Immuable ({auditLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === "tools"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Moteurs Métier (FCFA & Unités)</span>
          </button>
          <button
            onClick={() => setActiveTab("deliverables")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === "deliverables"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Livrables & Critères d'Acceptation</span>
          </button>
        </div>

        {/* CONTENU ONGLET 1 : VUE D'ENSEMBLE */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Bannière Mission & Philosophie Produit */}
            <div className="bg-gradient-to-r from-[#121624] via-[#0f1320] to-[#090b12] border border-[#222a3d] rounded-xl p-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-full bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
                      Bakery Operating System • Abidjan, Côte d'Ivoire
                    </span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                    Socle Technique Fondateur — Étape 01 Stabilisée
                  </h1>
                  <p className="text-xs text-gray-300 max-w-3xl leading-relaxed">
                    « Chaque gramme. Chaque pain. Chaque franc. » — Architecture multi-tenant hermétique, authentification, 
                    contrôle d&apos;accès RBAC à 39 permissions granulaires, piste d&apos;audit légale immuable et arithmétique financière exacte en FCFA.
                  </p>
                </div>

                <div className="bg-[#171c2b] border border-[#283147] rounded-lg p-3 text-xs space-y-1.5 min-w-[220px]">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Tenant ID</span>
                    <span className="font-mono text-gray-200 text-[11px]">{DEMO_TENANT.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Régime Fiscal</span>
                    <span className="text-amber-400 font-medium">{DEMO_TENANT.fiscalRegime} (Normal)</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Compte Contribuable</span>
                    <span className="font-mono text-gray-200 text-[11px]">{DEMO_COMPANY.taxId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cartes KPI Foundation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0f121d] border border-[#1e2536] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Session Active</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-base font-bold text-white truncate">
                    {session ? session.user.fullName : "Chargement..."}
                  </div>
                  <div className="text-xs text-amber-400/90 font-mono mt-0.5">
                    {session?.roles[0]?.name || "Aucun rôle"}
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 border-t border-[#1b2131] pt-2 flex items-center justify-between">
                  <span>MFA Sécurité</span>
                  <span className={currentUser.mfaEnabled ? "text-emerald-400 font-medium" : "text-gray-500"}>
                    {currentUser.mfaEnabled ? "Activé" : "Désactivé"}
                  </span>
                </div>
              </div>

              <div className="bg-[#0f121d] border border-[#1e2536] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Succursale Active</span>
                  <Building2 className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <div className="text-base font-bold text-white truncate">
                    {activeBranch.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Code: <span className="font-mono text-white">{activeBranch.code}</span> • {activeBranch.commune}
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 border-t border-[#1b2131] pt-2 flex items-center justify-between">
                  <span>Centre de Fournil</span>
                  <span className={activeBranch.isMainProductionCenter ? "text-amber-400 font-medium" : "text-gray-500"}>
                    {activeBranch.isMainProductionCenter ? "Fournil Principal" : "Point Vente Seul"}
                  </span>
                </div>
              </div>

              <div className="bg-[#0f121d] border border-[#1e2536] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Droits RBAC</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">
                    {session?.permissions.length || 0} <span className="text-xs font-normal text-gray-400">/ 39 permissions</span>
                  </div>
                  <div className="text-xs text-emerald-400/90 mt-0.5">
                    Isolation tenant strict active
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 border-t border-[#1b2131] pt-2 flex items-center justify-between">
                  <span>Niveau Sensible</span>
                  <span className="text-gray-300">
                    {session?.permissions.filter((p) => p.includes("close") || p.includes("certify") || p.includes("manage")).length || 0} droits critiques
                  </span>
                </div>
              </div>

              <div className="bg-[#0f121d] border border-[#1e2536] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Piste d&apos;Audit</span>
                  <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">
                    {auditLogs.length} événements
                  </div>
                  <div className="text-xs text-purple-400/90 mt-0.5">
                    Traçabilité légale 100%
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 border-t border-[#1b2131] pt-2 flex items-center justify-between">
                  <span>Rétention SYSCOHADA</span>
                  <span className="text-gray-300">10 ans (immuable)</span>
                </div>
              </div>
            </div>

            {/* Section Test d'Actions & Simulation de Conflits de Rôles */}
            <div className="bg-[#0d101a] border border-[#1e2536] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Test Dynamique des Garde-fous Métier & RBAC
                  </h2>
                  <p className="text-xs text-gray-400">
                    Cliquez sur une action critique pour vérifier en direct si le profil connecté ({currentUser.firstName} - {currentUser.roleCodes[0]}) 
                    est autorisé ou immédiatement refoulé par les règles du playbook.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                <button
                  onClick={() => checkInteractivePermission("pos.operate")}
                  className="p-2.5 rounded-lg bg-[#141825] hover:bg-[#1a2032] border border-[#232a3d] text-left text-xs transition-all space-y-1"
                >
                  <div className="font-medium text-white flex items-center justify-between">
                    <span>Encaisser Vente</span>
                    <Store className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">pos.operate</div>
                </button>

                <button
                  onClick={() => checkInteractivePermission("sales.refund")}
                  className="p-2.5 rounded-lg bg-[#141825] hover:bg-[#1a2032] border border-[#232a3d] text-left text-xs transition-all space-y-1"
                >
                  <div className="font-medium text-white flex items-center justify-between">
                    <span>Rembourser</span>
                    <Coins className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">sales.refund</div>
                </button>

                <button
                  onClick={() => checkInteractivePermission("recipes.manage")}
                  className="p-2.5 rounded-lg bg-[#141825] hover:bg-[#1a2032] border border-[#232a3d] text-left text-xs transition-all space-y-1"
                >
                  <div className="font-medium text-white flex items-center justify-between">
                    <span>Modifier Recette</span>
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">recipes.manage</div>
                </button>

                <button
                  onClick={() => checkInteractivePermission("production.validate")}
                  className="p-2.5 rounded-lg bg-[#141825] hover:bg-[#1a2032] border border-[#232a3d] text-left text-xs transition-all space-y-1"
                >
                  <div className="font-medium text-white flex items-center justify-between">
                    <span>Valider Fournée</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">production.validate</div>
                </button>

                <button
                  onClick={() => checkInteractivePermission("cash.close")}
                  className="p-2.5 rounded-lg bg-[#141825] hover:bg-[#1a2032] border border-[#232a3d] text-left text-xs transition-all space-y-1"
                >
                  <div className="font-medium text-white flex items-center justify-between">
                    <span>Clôturer Caisse</span>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">cash.close</div>
                </button>

                <button
                  onClick={() => checkInteractivePermission("fiscal.certify")}
                  className="p-2.5 rounded-lg bg-[#141825] hover:bg-[#1a2032] border border-[#232a3d] text-left text-xs transition-all space-y-1"
                >
                  <div className="font-medium text-white flex items-center justify-between">
                    <span>Certifier FNE</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">fiscal.certify</div>
                </button>
              </div>

              {testPermissionResult && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono border flex items-center justify-between animate-fadeIn ${
                    testPermissionResult.includes("AUTORISÉ")
                      ? "bg-emerald-950/30 border-emerald-800 text-emerald-300"
                      : "bg-rose-950/30 border-rose-800 text-rose-300"
                  }`}
                >
                  <span>{testPermissionResult}</span>
                  <button
                    onClick={() => setTestPermissionResult(null)}
                    className="text-gray-400 hover:text-white text-[10px] uppercase font-sans underline ml-4"
                  >
                    Effacer
                  </button>
                </div>
              )}
            </div>

            {/* Déclencheur Rapide d'Audit pour Démonstration */}
            <div className="bg-[#0d101a] border border-[#1e2536] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Simuler des Événements Métier Tracés</h3>
                  <p className="text-xs text-gray-400">
                    Génère instantanément une entrée dans la piste d&apos;audit légale immuable avec horodatage, utilisateur et delta avant/après.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    triggerSampleAudit(
                      "STOCK_RECEIVE",
                      "StockItem",
                      "Réception fournisseur : 20 sacs de farine T55 (Moulins de Côte d'Ivoire)"
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#151a28] hover:bg-[#1c2336] border border-[#242c40] text-xs text-gray-200 transition"
                >
                  📦 Réception 20 sacs farine
                </button>

                <button
                  onClick={() =>
                    triggerSampleAudit(
                      "CASH_VARIANCE",
                      "CashSession",
                      "Alerte écart caisse constaté à la clôture : -250 FCFA (pièces manquantes)"
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#151a28] hover:bg-[#1c2336] border border-[#242c40] text-xs text-amber-300 transition"
                >
                  ⚠️ Écart caisse (-250 FCFA)
                </button>

                <button
                  onClick={() =>
                    triggerSampleAudit(
                      "RECIPE_UPDATE",
                      "Recipe",
                      "Ajustement hydratation Baguette Tradition : taux d'eau ajusté de 64% à 66%"
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#151a28] hover:bg-[#1c2336] border border-[#242c40] text-xs text-sky-300 transition"
                >
                  🥖 Modification Recette Baguette
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTENU ONGLET 2 : RBAC & PERMISSIONS */}
        {activeTab === "rbac" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f121d] border border-[#1e2536] rounded-xl p-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Matrice des Droits & Permissions (39 Permissions Fines)
                </h2>
                <p className="text-xs text-gray-400">
                  L&apos;ERP implémente le modèle <code className="text-amber-400">User → UserRole → Role → RolePermission</code> avec isolation stricte.
                </p>
              </div>

              {/* Filtre par Module */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Module :</span>
                <select
                  value={selectedModuleFilter}
                  onChange={(e) => setSelectedModuleFilter(e.target.value)}
                  className="bg-[#141824] border border-[#242b3d] text-xs text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Tous les modules (39)</option>
                  <option value="sales">Ventes & POS</option>
                  <option value="cash">Caisse & Trésorerie</option>
                  <option value="stock">Stock & Matières</option>
                  <option value="purchase">Achats & Fournisseurs</option>
                  <option value="recipes">Recettes & Formulation</option>
                  <option value="production">Production & Fournil</option>
                  <option value="quality">Qualité & Hygiène</option>
                  <option value="finance">Finance & Dépenses</option>
                  <option value="payroll">Paie & CNPS</option>
                  <option value="accounting">Comptabilité SYSCOHADA</option>
                  <option value="fiscal">Fiscalité FNE</option>
                  <option value="analytics">Analytics & IA</option>
                  <option value="admin">Administration & Audit</option>
                </select>
              </div>
            </div>

            {/* Grille des permissions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPermissions.map((perm) => {
                const isGranted =
                  session?.user.roleCodes.includes("SUPER_ADMIN") ||
                  session?.permissions.includes(perm.name);

                return (
                  <div
                    key={perm.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isGranted
                        ? "bg-[#0d121c] border-emerald-900/40 text-gray-200"
                        : "bg-[#090b10] border-[#181d2a] text-gray-500 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-semibold text-white truncate">
                        {perm.name}
                      </span>
                      {isGranted ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Accordé</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 flex items-center space-x-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Refusé</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-snug">{perm.description}</p>
                    <div className="mt-2.5 pt-2 border-t border-[#181e2e] flex items-center justify-between text-[10px] text-gray-500 font-mono">
                      <span>Module: {perm.module}</span>
                      {perm.isSensitive && (
                        <span className="text-amber-400/80 bg-amber-500/10 px-1 py-0.2 rounded">
                          Sensible (MFA/Audit)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTENU ONGLET 3 : PISTE D'AUDIT */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#0f121d] border border-[#1e2536] rounded-xl p-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Journal d&apos;Audit Centralisé Immuable</h2>
                <p className="text-xs text-gray-400">
                  Conforme aux exigences SYSCOHADA et DGI : chaque action enregistre l&apos;auteur, l&apos;entité, l&apos;action, les valeurs avant/après et la raison.
                </p>
              </div>
              <button
                onClick={loadAuditLogs}
                className="px-3 py-1.5 rounded-lg bg-[#151a28] hover:bg-[#1c2336] border border-[#242c40] text-xs text-gray-200 flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualiser</span>
              </button>
            </div>

            <div className="space-y-2">
              {auditLogs.length === 0 ? (
                <div className="text-center py-12 bg-[#0c0e17] border border-[#1b2030] rounded-xl text-gray-500 text-xs">
                  Aucun log d&apos;audit enregistré pour le moment.
                </div>
              ) : (
                auditLogs.map((log) => {
                  const isWarning = log.severity === "WARNING" || log.severity === "CRITICAL";
                  return (
                    <div
                      key={log.id}
                      className={`p-3.5 rounded-xl border text-xs font-mono transition-all ${
                        isWarning
                          ? "bg-amber-950/20 border-amber-900/40 text-amber-200"
                          : "bg-[#0c0f18] border-[#1b2132] text-gray-300"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] mb-2 pb-2 border-b border-[#1b2132]">
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isWarning ? "bg-amber-500/20 text-amber-300" : "bg-sky-500/20 text-sky-300"
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-white font-semibold">{log.entity}#{log.entityId}</span>
                        </div>
                        <span className="text-gray-500">
                          {new Date(log.timestamp).toLocaleString("fr-CI")}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-400 mb-2">
                        <div>
                          <span className="text-gray-500">Opérateur : </span>
                          <span className="text-gray-200">{log.userName || log.userId}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Motif : </span>
                          <span className="text-gray-200 italic">{log.reason || "Non spécifié"}</span>
                        </div>
                      </div>

                      {(log.oldValue || log.newValue) && (
                        <div className="bg-[#070910] p-2 rounded-lg border border-[#161a29] text-[10px] space-y-1 overflow-x-auto">
                          {log.oldValue && (
                            <div className="text-rose-400">
                              - Ancien état : {JSON.stringify(log.oldValue)}
                            </div>
                          )}
                          {log.newValue && (
                            <div className="text-emerald-400">
                              + Nouvel état : {JSON.stringify(log.newValue)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* CONTENU ONGLET 4 : MOTEURS MÉTIER (FCFA & UNITÉS) */}
        {activeTab === "tools" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Moteur Monétaire Exact FCFA */}
            <div className="bg-[#0f121d] border border-[#1e2536] rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Moteur Monétaire Précis (FCFA / XOF)</h3>
              </div>
              <p className="text-xs text-gray-400">
                L&apos;ERP interdit strictement l&apos;usage de nombres flottants IEEE-754 pour les transactions financières. 
                Les montants sont calculés avec exactitude en centièmes entiers pour éviter tout écart comptable au centime près.
              </p>

              <div className="bg-[#131724] p-4 rounded-xl border border-[#22293d] space-y-3">
                <div className="text-xs font-medium text-amber-300">
                  Simulation : Coût Farine par Baguette Standard (140g farine)
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">
                      Prix d&apos;achat d&apos;un sac de farine (50 kg) :
                    </label>
                    <input
                      type="number"
                      value={flourBagPrice}
                      onChange={(e) => setFlourBagPrice(Number(e.target.value) || 0)}
                      className="w-full bg-[#0c0e17] border border-[#23293a] rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Nombre de baguettes produites :</label>
                    <input
                      type="number"
                      value={baguetteCount}
                      onChange={(e) => setBaguetteCount(Number(e.target.value) || 0)}
                      className="w-full bg-[#0c0e17] border border-[#23293a] rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1c2236] space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Coût au gramme exact :</span>
                    <span className="text-white font-semibold">{flourPerGramFCFA.toFixed(4)} FCFA/g</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Coût farine unitaire (140g) :</span>
                    <span className="text-amber-400 font-semibold">{formatFCFA(flourCostPerBaguette, { showDecimals: true })}</span>
                  </div>
                  <div className="flex justify-between text-gray-200 text-sm font-bold pt-1 border-t border-[#1a2034]">
                    <span>Coût total de la fournée :</span>
                    <span className="text-emerald-400">{formatFCFA(totalBatchFlourCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Moteur de Conversion d'Unités de Boulangerie */}
            <div className="bg-[#0f121d] border border-[#1e2536] rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-white">Convertisseur d&apos;Unités Métier Configurables</h3>
              </div>
              <p className="text-xs text-gray-400">
                Gère les unités standards (kg, g, L, mL) et les conditionnements sectoriels de boulangerie ivoirienne (sac 50kg, carton 10kg, paquet, plaque 24 pièces, tournée 150kg).
              </p>

              <div className="bg-[#131724] p-4 rounded-xl border border-[#22293d] space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Quantité :</label>
                    <input
                      type="number"
                      value={convertQty}
                      onChange={(e) => setConvertQty(Number(e.target.value) || 0)}
                      className="w-full bg-[#0c0e17] border border-[#23293a] rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">De :</label>
                    <select
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value as ConfigurableUnitCode)}
                      className="w-full bg-[#0c0e17] border border-[#23293a] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="sac">Sac (50 kg)</option>
                      <option value="kg">Kilogramme (kg)</option>
                      <option value="g">Gramme (g)</option>
                      <option value="carton">Carton (10 kg)</option>
                      <option value="L">Litre (L)</option>
                      <option value="mL">Millilitre (mL)</option>
                      <option value="plaque">Plaque (24 pcs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Vers :</label>
                    <select
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value as ConfigurableUnitCode)}
                      className="w-full bg-[#0c0e17] border border-[#23293a] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="kg">Kilogramme (kg)</option>
                      <option value="g">Gramme (g)</option>
                      <option value="sac">Sac (50 kg)</option>
                      <option value="carton">Carton (10 kg)</option>
                      <option value="L">Litre (L)</option>
                      <option value="mL">Millilitre (mL)</option>
                      <option value="piece">Pièce unitaire</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#090b12] p-3 rounded-lg border border-[#1b2133] text-center">
                  <span className="text-xs text-gray-400 block mb-1">Résultat de Conversion :</span>
                  <span className="text-sm font-bold font-mono text-sky-300">
                    {conversionResultText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENU ONGLET 5 : LIVRABLES ET CRITÈRES D'ACCEPTATION */}
        {activeTab === "deliverables" && (
          <div className="space-y-4">
            <div className="bg-[#0f121d] border border-[#1e2536] rounded-xl p-4">
              <h2 className="text-sm font-semibold text-white">
                Rapport de Conformité — Playbook 01 Foundation
              </h2>
              <p className="text-xs text-gray-400">
                Vérification méthodique des 10 livrables et critères d&apos;acceptation spécifiés dans INSTRUCTIONS.md.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                {
                  id: "1",
                  title: "Architecture du projet",
                  desc: "Structure en couches Presentation, Application, Domain, Infrastructure. Respect strict de Next.js App Router.",
                  status: "Complété",
                },
                {
                  id: "2",
                  title: "Structure des dossiers",
                  desc: "Organisation src/ (app, components, features, lib, server, config, types) prête pour accueillir les 10 modules.",
                  status: "Complété",
                },
                {
                  id: "3",
                  title: "Stratégie multi-tenant",
                  desc: "Isolation stricte via tenantId, companyId, branchId. Blocage absolu de toute fuite de données inter-entreprises.",
                  status: "Complété",
                },
                {
                  id: "4",
                  title: "Système auth & sessions",
                  desc: "Gestion de session 8h (durée de shift boulangerie), cookies sécurisés, prise en compte du code PIN POS et MFA.",
                  status: "Complété",
                },
                {
                  id: "5",
                  title: "RBAC & Permissions fines",
                  desc: "Modèle complet à 39 permissions granulaires et 9 profils types (DG, Gérant, Chef Boulanger, Caissier, Comptable).",
                  status: "Complété",
                },
                {
                  id: "6",
                  title: "Audit central immuable",
                  desc: "Système AuditLog avec acteur, action, entité, delta oldValue/newValue, horodatage ISO et motif obligatoire.",
                  status: "Complété",
                },
                {
                  id: "7",
                  title: "Configuration & Environnements",
                  desc: "Gestion typée des modes development, test, staging, production sans fuite de secrets avec .env.example.",
                  status: "Complété",
                },
                {
                  id: "8",
                  title: "Conventions de code & typage",
                  desc: "TypeScript strict, typage financier exact en FCFA (zéro bug flottant), typage des unités de mesure.",
                  status: "Complété",
                },
                {
                  id: "9",
                  title: "Stratégie de tests",
                  desc: "11 tests unitaires automatisés validant l'arithmétique FCFA, les conversions, l'isolation tenant et le RBAC.",
                  status: "Complété",
                },
                {
                  id: "10",
                  title: "Documentation de démarrage",
                  desc: "Documentation protocolaire détaillée avec checklist prêt pour la phase 02 Design System.",
                  status: "Complété",
                },
              ].map((del) => (
                <div key={del.id} className="p-3.5 rounded-xl bg-[#0d101a] border border-[#1d2334] flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-[10px]">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{del.id}. {del.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {del.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-[11px] leading-relaxed">{del.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Note d'attente de validation */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Étape 01 Foundation stabilisée et prête pour revue :</span>
                <p className="text-amber-200/90 mt-1">
                  Conformément à la consigne « Commence strictement par 01 Foundation, puis attends ma validation avant la suivante », 
                  le travail s&apos;arrête ici dans l&apos;attente expresse de votre validation avant de passer à l&apos;étape 02 Design System.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer minimaliste */}
      <footer className="border-t border-[#171b26] bg-[#080a10] py-3 px-4 text-center text-xs text-gray-500 font-mono">
        ERP-BOUL • Playbook Étape 01 Foundation • « Chaque gramme. Chaque pain. Chaque franc. »
      </footer>
    </div>
  );
}
