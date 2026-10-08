import { PermissionName, Role, RoleCode } from "./rbac";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  tenantId: string;
  companyId: string;
  defaultBranchId: string;
  accessibleBranchIds: string[];
  roleCodes: RoleCode[];
  isActive: boolean;
  mfaEnabled: boolean;
  pinCodeHash?: string; // Code PIN 4-6 chiffres pour bascule rapide en caisse POS
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionContext {
  sessionId: string;
  userId: string;
  tenantId: string;
  companyId: string;
  branchId: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    roleCodes: RoleCode[];
  };
  roles: Role[];
  permissions: PermissionName[];
  expiresAt: number; // Unix timestamp en secondes
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthLoginPayload {
  email: string;
  password?: string;
  pinCode?: string; // Authentification rapide POS par PIN
  branchId?: string;
}

export interface AuthResponse {
  success: boolean;
  session?: SessionContext;
  token?: string;
  error?: string;
  requiresMfa?: boolean;
}
