export interface Tenant {
  id: string; // e.g. "ten_abidjan_central"
  name: string; // e.g. "Groupe Boulangeries d'Abidjan"
  slug: string;
  country: string; // "CI" - Côte d'Ivoire
  currency: string; // "XOF"
  fiscalRegime: "RSI" | "RNI" | "ME"; // Régime Réel Simplifié, Normal, Micro-Entreprise
  rneNumber?: string; // Registre National des Entreprises (RNE / CI)
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Company {
  id: string; // e.g. "cmp_boul_ivoire"
  tenantId: string;
  name: string;
  legalForm: "SARL" | "SAS" | "SA" | "EI";
  taxId: string; // Numéro Compte Contribuable (NCC)
  address: string;
  city: string; // "Abidjan"
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string; // e.g. "br_plateau", "br_cocody", "br_yopougon"
  companyId: string;
  tenantId: string;
  name: string;
  code: string; // "PLT", "CCD", "YOP"
  commune: string; // "Plateau", "Cocody Angré", "Yopougon Maroc"
  address: string;
  phone: string;
  isMainProductionCenter: boolean;
  hasPos: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantScopedEntity {
  tenantId: string;
  companyId: string;
  branchId?: string;
}
