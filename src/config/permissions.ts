import { Permission, PermissionName, Role, RoleCode } from "@/types/rbac";

export const PERMISSION_DEFINITIONS: Permission[] = [
  // Sales & POS
  { id: "perm_sales_view", name: "sales.view", module: "sales", description: "Consulter l'historique des ventes et tickets", isSensitive: false },
  { id: "perm_sales_create", name: "sales.create", module: "sales", description: "Enregistrer une vente au comptoir ou commande client", isSensitive: false },
  { id: "perm_sales_cancel", name: "sales.cancel", module: "sales", description: "Annuler une vente avant encaissement", isSensitive: true },
  { id: "perm_sales_refund", name: "sales.refund", module: "sales", description: "Effectuer un remboursement client", isSensitive: true },
  { id: "perm_sales_discount", name: "sales.discount", module: "sales", description: "Appliquer une remise exceptionnelle", isSensitive: true },
  { id: "perm_pos_operate", name: "pos.operate", module: "pos", description: "Utiliser le terminal de point de vente", isSensitive: false },
  { id: "perm_pos_override", name: "pos.override_price", module: "pos", description: "Modifier manuellement un prix de vente au POS", isSensitive: true },

  // Caisse
  { id: "perm_cash_view", name: "cash.view", module: "cash", description: "Consulter l'état et le solde du tiroir-caisse", isSensitive: false },
  { id: "perm_cash_open", name: "cash.open", module: "cash", description: "Ouvrir une session de caisse avec fond de roulement", isSensitive: false },
  { id: "perm_cash_close", name: "cash.close", module: "cash", description: "Clôturer la caisse et déclarer le comptage d'espèces", isSensitive: true },
  { id: "perm_cash_adjust", name: "cash.adjust", module: "cash", description: "Régulariser un écart de caisse", isSensitive: true },
  { id: "perm_cash_transfer", name: "cash.transfer", module: "cash", description: "Effectuer un versement de caisse vers la banque ou coffre", isSensitive: true },

  // Stock
  { id: "perm_stock_view", name: "stock.view", module: "stock", description: "Consulter les niveaux de stocks et fiches matières", isSensitive: false },
  { id: "perm_stock_receive", name: "stock.receive", module: "stock", description: "Réceptionner les livraisons fournisseurs", isSensitive: false },
  { id: "perm_stock_adjust", name: "stock.adjust", module: "stock", description: "Ajuster manuellement les quantités en stock", isSensitive: true },
  { id: "perm_stock_transfer", name: "stock.transfer", module: "stock", description: "Transférer du stock entre magasins ou succursales", isSensitive: false },
  { id: "perm_stock_count", name: "stock.count", module: "stock", description: "Effectuer un inventaire physique", isSensitive: false },
  { id: "perm_stock_waste", name: "stock.waste", module: "stock", description: "Déclarer une casse ou matière périmée", isSensitive: true },

  // Achats
  { id: "perm_purch_view", name: "purchase.view", module: "purchase", description: "Consulter les commandes fournisseurs", isSensitive: false },
  { id: "perm_purch_create", name: "purchase.create", module: "purchase", description: "Créer un bon de commande fournisseur", isSensitive: false },
  { id: "perm_purch_approve", name: "purchase.approve", module: "purchase", description: "Approuver et valider un achat financier", isSensitive: true },
  { id: "perm_purch_receive", name: "purchase.receive", module: "purchase", description: "Pointer et valider la facture fournisseur", isSensitive: false },

  // Recettes & Formulation
  { id: "perm_rec_view", name: "recipes.view", module: "recipes", description: "Consulter les fiches techniques des recettes", isSensitive: false },
  { id: "perm_rec_manage", name: "recipes.manage", module: "recipes", description: "Créer et modifier les recettes et ratios boulangers", isSensitive: true },
  { id: "perm_rec_cost", name: "recipes.cost", module: "recipes", description: "Consulter le coût de revient unitaire théorique", isSensitive: true },

  // Production
  { id: "perm_prod_view", name: "production.view", module: "production", description: "Consulter le planning et les ordres de pétrissage", isSensitive: false },
  { id: "perm_prod_plan", name: "production.plan", module: "production", description: "Planifier les fournées journalières", isSensitive: false },
  { id: "perm_prod_start", name: "production.start", module: "production", description: "Lancer un ordre de fabrication en fournil", isSensitive: false },
  { id: "perm_prod_validate", name: "production.validate", module: "production", description: "Valider la sortie fournil et le comptage des pièces", isSensitive: true },
  { id: "perm_prod_waste", name: "production.waste", module: "production", description: "Déclarer les rebuts de cuisson et pains brûlés", isSensitive: true },

  // Qualité
  { id: "perm_qual_check", name: "quality.check", module: "quality", description: "Consigner les contrôles d'hygiène et température", isSensitive: false },
  { id: "perm_qual_reject", name: "quality.reject", module: "quality", description: "Déclasser ou rejeter une fournée non conforme", isSensitive: true },

  // Finance & Paie
  { id: "perm_fin_view", name: "finance.view", module: "finance", description: "Consulter les flux financiers et marges", isSensitive: true },
  { id: "perm_fin_expenses", name: "finance.expenses", module: "finance", description: "Saisir et imputer une dépense d'exploitation", isSensitive: true },
  { id: "perm_fin_treasury", name: "finance.treasury", module: "finance", description: "Gérer les comptes bancaires et le coffre", isSensitive: true },
  { id: "perm_pay_view", name: "payroll.view", module: "payroll", description: "Consulter la masse salariale", isSensitive: true },
  { id: "perm_pay_run", name: "payroll.run", module: "payroll", description: "Calculer et valider la paie CNPS / Impôt sur Salaire", isSensitive: true },

  // Comptabilité SYSCOHADA
  { id: "perm_acc_view", name: "accounting.view", module: "accounting", description: "Consulter les écritures comptables", isSensitive: true },
  { id: "perm_acc_post", name: "accounting.post", module: "accounting", description: "Valider et verrouiller le journal comptable", isSensitive: true },
  { id: "perm_acc_export", name: "accounting.export", module: "accounting", description: "Générer la balance et le grand livre SYSCOHADA", isSensitive: true },

  // Fiscalité FNE (Facture Normalisée Électronique)
  { id: "perm_fisc_view", name: "fiscal.view", module: "fiscal", description: "Consulter le registre des factures normalisées FNE", isSensitive: false },
  { id: "perm_fisc_cert", name: "fiscal.certify", module: "fiscal", description: "Certifier une vente auprès de l'API DGI / FNE", isSensitive: true },
  { id: "perm_fisc_cancel", name: "fiscal.cancel", module: "fiscal", description: "Émettre un avoir FNE certifié", isSensitive: true },
  { id: "perm_fisc_manage", name: "fiscal.manage", module: "fiscal", description: "Configurer les clés et certificats fiscaux DGI", isSensitive: true },

  // Analytics & AI
  { id: "perm_ana_view", name: "analytics.view", module: "analytics", description: "Visualiser les dashboards analytiques", isSensitive: false },
  { id: "perm_ai_query", name: "ai.query", module: "analytics", description: "Interroger le copilote IA sur les métriques", isSensitive: false },

  // Administration & Audit
  { id: "perm_aud_view", name: "audit.view", module: "admin", description: "Consulter la piste d'audit immuable", isSensitive: true },
  { id: "perm_set_manage", name: "settings.manage", module: "admin", description: "Configurer les paramètres généraux de l'ERP", isSensitive: true },
  { id: "perm_usr_manage", name: "users.manage", module: "admin", description: "Créer, modifier et désactiver des utilisateurs", isSensitive: true },
  { id: "perm_rol_manage", name: "roles.manage", module: "admin", description: "Gérer les rôles et permissions", isSensitive: true },
  { id: "perm_br_manage", name: "branch.manage", module: "admin", description: "Gérer les succursales et points de vente", isSensitive: true },
];

export const ROLE_DEFINITIONS: Record<RoleCode, Role> = {
  SUPER_ADMIN: {
    id: "role_super_admin",
    code: "SUPER_ADMIN",
    name: "Super Administrateur",
    description: "Accès universel à l'ensemble du tenant, configuration et audit",
    isSystem: true,
    permissions: PERMISSION_DEFINITIONS.map((p) => p.name),
  },

  DIRECTEUR_GENERAL: {
    id: "role_dg",
    code: "DIRECTEUR_GENERAL",
    name: "Directeur Général / Propriétaire",
    description: "Pilotage stratégique, approbation des achats majeurs, marge et rapports",
    isSystem: true,
    permissions: [
      "sales.view", "sales.create", "sales.cancel", "sales.refund", "pos.operate",
      "cash.view", "cash.transfer",
      "stock.view", "stock.adjust", "purchase.view", "purchase.approve",
      "recipes.view", "recipes.manage", "recipes.cost",
      "production.view", "quality.check",
      "finance.view", "finance.expenses", "finance.treasury",
      "payroll.view", "payroll.run",
      "accounting.view", "accounting.post", "accounting.export",
      "fiscal.view", "fiscal.certify", "fiscal.manage",
      "analytics.view", "ai.query",
      "audit.view", "settings.manage", "users.manage", "branch.manage",
    ],
  },

  GERANT_BOUTIQUE: {
    id: "role_gerant",
    code: "GERANT_BOUTIQUE",
    name: "Gérant de Succursale",
    description: "Gestion opérationnelle du point de vente, caisses, réceptions et inventaires",
    isSystem: true,
    permissions: [
      "sales.view", "sales.create", "sales.cancel", "sales.refund", "sales.discount", "pos.operate",
      "cash.view", "cash.open", "cash.close", "cash.adjust", "cash.transfer",
      "stock.view", "stock.receive", "stock.adjust", "stock.transfer", "stock.count", "stock.waste",
      "purchase.view", "purchase.create", "purchase.receive",
      "recipes.view",
      "production.view", "production.plan", "production.validate", "production.waste",
      "quality.check",
      "finance.view", "finance.expenses",
      "fiscal.view", "fiscal.certify",
      "analytics.view",
      "audit.view",
    ],
  },

  CHEF_BOULANGER: {
    id: "role_chef_boulanger",
    code: "CHEF_BOULANGER",
    name: "Chef Boulanger / Pâtissier",
    description: "Gestion des recettes, formulation, calcul du pétrissage, validation des fournées",
    isSystem: true,
    permissions: [
      "recipes.view", "recipes.manage", "recipes.cost",
      "production.view", "production.plan", "production.start", "production.validate", "production.waste",
      "stock.view", "stock.waste",
      "quality.check", "quality.reject",
      "ai.query",
    ],
  },

  RESPONSABLE_PRODUCTION: {
    id: "role_resp_prod",
    code: "RESPONSABLE_PRODUCTION",
    name: "Responsable de Production",
    description: "Coordination du fournil, rendement de pâte, gestion des pertes et rendements",
    isSystem: true,
    permissions: [
      "recipes.view", "recipes.cost",
      "production.view", "production.plan", "production.start", "production.validate", "production.waste",
      "stock.view", "stock.receive", "stock.transfer", "stock.waste",
      "quality.check", "quality.reject",
      "analytics.view", "ai.query",
    ],
  },

  CAISSIER: {
    id: "role_caissier",
    code: "CAISSIER",
    name: "Caissier(ère) / Vendeur(se)",
    description: "Encaissement rapide au comptoir, ouverture et clôture de sa session de caisse",
    isSystem: true,
    permissions: [
      "pos.operate",
      "sales.view", "sales.create",
      "cash.view", "cash.open", "cash.close",
      "fiscal.view", "fiscal.certify",
    ],
  },

  MAGASINIER: {
    id: "role_magasinier",
    code: "MAGASINIER",
    name: "Magasinier / Gestionnaire de Stock",
    description: "Réception farine/ingrédients, sorties vers le fournil, inventaires physiques",
    isSystem: true,
    permissions: [
      "stock.view", "stock.receive", "stock.adjust", "stock.transfer", "stock.count", "stock.waste",
      "purchase.view", "purchase.receive",
      "quality.check",
    ],
  },

  COMPTABLE: {
    id: "role_comptable",
    code: "COMPTABLE",
    name: "Comptable / Responsable Financier",
    description: "Rapprochements de caisse, écritures SYSCOHADA, fiscalité FNE, paie et audit",
    isSystem: true,
    permissions: [
      "sales.view",
      "cash.view", "cash.close", "cash.adjust", "cash.transfer",
      "purchase.view", "purchase.approve", "purchase.receive",
      "finance.view", "finance.expenses", "finance.treasury",
      "payroll.view", "payroll.run",
      "accounting.view", "accounting.post", "accounting.export",
      "fiscal.view", "fiscal.certify", "fiscal.cancel", "fiscal.manage",
      "analytics.view",
      "audit.view",
    ],
  },

  AUDITEUR: {
    id: "role_auditeur",
    code: "AUDITEUR",
    name: "Auditeur Interne / Commissaire aux Comptes",
    description: "Lecture seule sur tous les modules, consultation exhaustive de l'audit trail",
    isSystem: true,
    permissions: [
      "sales.view",
      "cash.view",
      "stock.view",
      "purchase.view",
      "recipes.view",
      "production.view",
      "finance.view",
      "payroll.view",
      "accounting.view",
      "fiscal.view",
      "analytics.view",
      "audit.view",
    ],
  },
};
