import { PermissionName, RoleCode } from "@/types/rbac";
import { SessionContext } from "@/types/auth";

export class ForbiddenError extends Error {
  public code = "FORBIDDEN";
  public requiredPermission?: PermissionName;

  constructor(message: string, requiredPermission?: PermissionName) {
    super(message);
    this.name = "ForbiddenError";
    this.requiredPermission = requiredPermission;
  }
}

export class UnauthorizedError extends Error {
  public code = "UNAUTHORIZED";

  constructor(message: string = "Session invalide ou expirée") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Vérifie si une session active dispose d'une permission spécifique
 */
export function hasPermission(
  session: SessionContext | null | undefined,
  requiredPermission: PermissionName
): boolean {
  if (!session) return false;

  // Le Super Admin dispose de toutes les permissions
  if (session.user.roleCodes.includes("SUPER_ADMIN")) {
    return true;
  }

  return session.permissions.includes(requiredPermission);
}

/**
 * Vérifie si une session dispose d'au moins un rôle parmi la liste fournie
 */
export function hasRole(
  session: SessionContext | null | undefined,
  roleCodes: RoleCode[]
): boolean {
  if (!session) return false;
  return session.user.roleCodes.some((role) => roleCodes.includes(role));
}

/**
 * Lève une exception si l'utilisateur ne possède pas la permission requise
 */
export function assertPermission(
  session: SessionContext | null | undefined,
  permission: PermissionName
): void {
  if (!session) {
    throw new UnauthorizedError("Authentification requise pour cette opération");
  }
  if (!hasPermission(session, permission)) {
    throw new ForbiddenError(
      `Permission refusée : L'action requiert le droit [${permission}]. Rôles actuels : ${session.user.roleCodes.join(", ")}`,
      permission
    );
  }
}

/**
 * Garantit l'isolation multi-tenant stricte : bloque tout accès aux données d'un autre tenant
 */
export function assertTenantAccess(
  session: SessionContext | null | undefined,
  targetTenantId: string
): void {
  if (!session) {
    throw new UnauthorizedError("Authentification requise");
  }

  // Seul un Super Admin plateforme non rattaché à un tenant unique peut traverser les tenants
  if (session.user.roleCodes.includes("SUPER_ADMIN") && !session.tenantId) {
    return;
  }

  if (session.tenantId !== targetTenantId) {
    throw new ForbiddenError(
      `Violation d'isolation multi-tenant : Accès refusé au tenant [${targetTenantId}] depuis le contexte [${session.tenantId}]`
    );
  }
}
