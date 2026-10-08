export type PermissionScope = 
  | "system"
  | "tenant"
  | "branch";

export type PermissionName =
  // Sales & POS
  | "sales.view"
  | "sales.create"
  | "sales.cancel"
  | "sales.refund"
  | "sales.discount"
  | "pos.operate"
  | "pos.override_price"

  // Cash / Caisse
  | "cash.view"
  | "cash.open"
  | "cash.close"
  | "cash.adjust"
  | "cash.transfer"

  // Inventory & Stock
  | "stock.view"
  | "stock.receive"
  | "stock.adjust"
  | "stock.transfer"
  | "stock.count"
  | "stock.waste"

  // Procurement & Fournisseurs
  | "purchase.view"
  | "purchase.create"
  | "purchase.approve"
  | "purchase.receive"

  // Recipes & Formulation
  | "recipes.view"
  | "recipes.manage"
  | "recipes.cost"

  // Production & Fournil
  | "production.view"
  | "production.plan"
  | "production.start"
  | "production.validate"
  | "production.waste"

  // Quality & Contrôle
  | "quality.check"
  | "quality.reject"

  // Finance & Trésorerie
  | "finance.view"
  | "finance.expenses"
  | "finance.treasury"
  | "payroll.view"
  | "payroll.run"

  // Accounting & SYSCOHADA
  | "accounting.view"
  | "accounting.post"
  | "accounting.export"

  // Fiscal & FNE (Facture Normalisée Électronique)
  | "fiscal.view"
  | "fiscal.certify"
  | "fiscal.cancel"
  | "fiscal.manage"

  // Analytics & AI Copilot
  | "analytics.view"
  | "ai.query"

  // Audit & Administration
  | "audit.view"
  | "settings.manage"
  | "users.manage"
  | "roles.manage"
  | "branch.manage";

export interface Permission {
  id: string;
  name: PermissionName;
  module: 
    | "sales" 
    | "pos" 
    | "cash" 
    | "stock" 
    | "purchase" 
    | "recipes" 
    | "production" 
    | "quality" 
    | "finance" 
    | "payroll" 
    | "accounting" 
    | "fiscal" 
    | "analytics" 
    | "admin";
  description: string;
  isSensitive: boolean; // Requiert confirmation ou MFA
}

export type RoleCode =
  | "SUPER_ADMIN"
  | "DIRECTEUR_GENERAL"
  | "GERANT_BOUTIQUE"
  | "CHEF_BOULANGER"
  | "RESPONSABLE_PRODUCTION"
  | "CAISSIER"
  | "MAGASINIER"
  | "COMPTABLE"
  | "AUDITEUR";

export interface Role {
  id: string;
  code: RoleCode;
  name: string;
  description: string;
  isSystem: boolean;
  tenantId?: string; // Global si undefined, ou personnalisé par tenant
  permissions: PermissionName[];
}

export interface UserRole {
  userId: string;
  roleId: string;
  tenantId: string;
  branchId?: string; // Permet de restreindre le rôle à une succursale spécifique
}
