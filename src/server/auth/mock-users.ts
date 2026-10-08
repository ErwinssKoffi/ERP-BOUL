import { Branch, Company, Tenant } from "@/types/tenant";
import { User } from "@/types/auth";
import { ROLE_DEFINITIONS } from "@/config/permissions";
import { PermissionName, Role } from "@/types/rbac";

export const DEMO_TENANT: Tenant = {
  id: "ten_boul_abidjan",
  name: "Boulangerie & Pâtisserie Ivoire Excellence",
  slug: "boulangerie-ivoire",
  country: "CI",
  currency: "XOF",
  fiscalRegime: "RNI", // Régime Normal d'Imposition
  rneNumber: "CI-ABJ-2024-B-12894",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  isActive: true,
};

export const DEMO_COMPANY: Company = {
  id: "cmp_ivoire_group",
  tenantId: DEMO_TENANT.id,
  name: "Ivoire Pains & Délices SARL",
  legalForm: "SARL",
  taxId: "2408912 A", // Numéro Compte Contribuable (NCC)
  address: "Boulevard de la République, Immeuble Horizon",
  city: "Abidjan",
  phone: "+225 07 08 09 10 11",
  email: "contact@boulangerie-ivoire.ci",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

export const DEMO_BRANCHES: Branch[] = [
  {
    id: "br_plateau",
    companyId: DEMO_COMPANY.id,
    tenantId: DEMO_TENANT.id,
    name: "Plateau Centrale (Production & Vente)",
    code: "PLT",
    commune: "Plateau",
    address: "Avenue Chardy, face BICI-CI",
    phone: "+225 27 20 21 22 23",
    isMainProductionCenter: true,
    hasPos: true,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "br_cocody",
    companyId: DEMO_COMPANY.id,
    tenantId: DEMO_TENANT.id,
    name: "Cocody Angré 8ème Tranche",
    code: "CCD",
    commune: "Cocody",
    address: "Carrefour Glacier des Anges",
    phone: "+225 27 22 44 55 66",
    isMainProductionCenter: false,
    hasPos: true,
    isActive: true,
    createdAt: "2026-02-15T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z",
  },
  {
    id: "br_yopougon",
    companyId: DEMO_COMPANY.id,
    tenantId: DEMO_TENANT.id,
    name: "Yopougon Maroc Express",
    code: "YOP",
    commune: "Yopougon",
    address: "Boulevard Principal du Maroc",
    phone: "+225 27 23 77 88 99",
    isMainProductionCenter: false,
    hasPos: true,
    isActive: true,
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-03-01T00:00:00Z",
  },
];

export const DEMO_USERS: User[] = [
  {
    id: "usr_dg_01",
    email: "j.kouassi@boulangerie-ivoire.ci",
    firstName: "Jean",
    lastName: "Kouassi",
    phone: "+225 07 47 00 11 22",
    tenantId: DEMO_TENANT.id,
    companyId: DEMO_COMPANY.id,
    defaultBranchId: "br_plateau",
    accessibleBranchIds: ["br_plateau", "br_cocody", "br_yopougon"],
    roleCodes: ["DIRECTEUR_GENERAL"],
    isActive: true,
    mfaEnabled: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr_gerant_01",
    email: "a.toure@boulangerie-ivoire.ci",
    firstName: "Awa",
    lastName: "Touré",
    phone: "+225 05 55 12 34 56",
    tenantId: DEMO_TENANT.id,
    companyId: DEMO_COMPANY.id,
    defaultBranchId: "br_plateau",
    accessibleBranchIds: ["br_plateau", "br_cocody"],
    roleCodes: ["GERANT_BOUTIQUE"],
    isActive: true,
    mfaEnabled: false,
    createdAt: "2026-01-05T00:00:00Z",
    updatedAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "usr_chef_01",
    email: "i.bakayoko@boulangerie-ivoire.ci",
    firstName: "Idriss",
    lastName: "Bakayoko",
    phone: "+225 01 02 03 04 05",
    tenantId: DEMO_TENANT.id,
    companyId: DEMO_COMPANY.id,
    defaultBranchId: "br_plateau",
    accessibleBranchIds: ["br_plateau"],
    roleCodes: ["CHEF_BOULANGER"],
    isActive: true,
    mfaEnabled: false,
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "usr_caissier_01",
    email: "e.yao@boulangerie-ivoire.ci",
    firstName: "Estelle",
    lastName: "Yao",
    phone: "+225 07 11 22 33 44",
    tenantId: DEMO_TENANT.id,
    companyId: DEMO_COMPANY.id,
    defaultBranchId: "br_plateau",
    accessibleBranchIds: ["br_plateau"],
    roleCodes: ["CAISSIER"],
    isActive: true,
    mfaEnabled: false,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "usr_magasinier_01",
    email: "s.traore@boulangerie-ivoire.ci",
    firstName: "Seydou",
    lastName: "Traoré",
    phone: "+225 05 66 77 88 99",
    tenantId: DEMO_TENANT.id,
    companyId: DEMO_COMPANY.id,
    defaultBranchId: "br_plateau",
    accessibleBranchIds: ["br_plateau", "br_cocody", "br_yopougon"],
    roleCodes: ["MAGASINIER"],
    isActive: true,
    mfaEnabled: false,
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "usr_comptable_01",
    email: "k.bamba@boulangerie-ivoire.ci",
    firstName: "Karim",
    lastName: "Bamba",
    phone: "+225 07 99 88 77 66",
    tenantId: DEMO_TENANT.id,
    companyId: DEMO_COMPANY.id,
    defaultBranchId: "br_plateau",
    accessibleBranchIds: ["br_plateau", "br_cocody", "br_yopougon"],
    roleCodes: ["COMPTABLE"],
    isActive: true,
    mfaEnabled: true,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "usr_superadmin_01",
    email: "admin@erp-boul.ci",
    firstName: "Super",
    lastName: "Admin",
    tenantId: DEMO_TENANT.id,
    companyId: DEMO_COMPANY.id,
    defaultBranchId: "br_plateau",
    accessibleBranchIds: ["br_plateau", "br_cocody", "br_yopougon"],
    roleCodes: ["SUPER_ADMIN"],
    isActive: true,
    mfaEnabled: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

/**
 * Calcule toutes les permissions accordées à un utilisateur en agrégeant ses rôles
 */
export function resolveUserPermissions(user: User): { roles: Role[]; permissions: PermissionName[] } {
  const roles: Role[] = [];
  const permissionSet = new Set<PermissionName>();

  for (const roleCode of user.roleCodes) {
    const roleDef = ROLE_DEFINITIONS[roleCode];
    if (roleDef) {
      roles.push(roleDef);
      for (const perm of roleDef.permissions) {
        permissionSet.add(perm);
      }
    }
  }

  return {
    roles,
    permissions: Array.from(permissionSet),
  };
}
