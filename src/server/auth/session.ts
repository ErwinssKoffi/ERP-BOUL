import { SessionContext, User } from "@/types/auth";
import { DEMO_BRANCHES, DEMO_USERS, resolveUserPermissions } from "./mock-users";
import { recordAuditLog } from "@/lib/audit";
import { appLogger } from "@/lib/logger";

// Sessions stockées en mémoire (prêtes à être déportées vers Redis / DB à l'étape DB)
const SESSIONS = new Map<string, SessionContext>();

export function createSessionForUser(
  user: User,
  branchId?: string,
  deviceInfo?: { ip?: string; userAgent?: string }
): SessionContext {
  const selectedBranchId = branchId || user.defaultBranchId;

  // Vérifier l'accès à la succursale
  if (
    !user.accessibleBranchIds.includes(selectedBranchId) &&
    !user.roleCodes.includes("SUPER_ADMIN")
  ) {
    throw new Error(`Accès non autorisé à la succursale [${selectedBranchId}]`);
  }

  const { roles, permissions } = resolveUserPermissions(user);
  const sessionId = `ses_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const expiresAt = Math.floor(Date.now() / 1000) + 8 * 3600; // 8 heures

  const session: SessionContext = {
    sessionId,
    userId: user.id,
    tenantId: user.tenantId,
    companyId: user.companyId,
    branchId: selectedBranchId,
    user: {
      id: user.id,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      roleCodes: user.roleCodes,
    },
    roles,
    permissions,
    expiresAt,
    ipAddress: deviceInfo?.ip || "127.0.0.1",
    userAgent: deviceInfo?.userAgent || "Mozilla/5.0 Web POS",
  };

  SESSIONS.set(sessionId, session);

  // Journaliser la connexion dans l'audit
  recordAuditLog({
    tenantId: session.tenantId,
    companyId: session.companyId,
    branchId: session.branchId,
    userId: session.userId,
    userName: session.user.fullName,
    userEmail: session.user.email,
    action: "AUTH_LOGIN",
    entity: "Session",
    entityId: session.sessionId,
    oldValue: null,
    newValue: {
      roles: user.roleCodes,
      branchId: selectedBranchId,
      expiresAt,
    },
    reason: "Connexion utilisateur avec succès",
    device: deviceInfo?.userAgent || "Web POS",
    ipAddress: deviceInfo?.ip || "127.0.0.1",
    severity: "INFO",
  });

  appLogger.info(`Session créée pour ${user.email} (Succursale: ${selectedBranchId})`, {
    userId: user.id,
    tenantId: user.tenantId,
    sessionId,
  });

  return session;
}

export function getSession(sessionId: string): SessionContext | null {
  const session = SESSIONS.get(sessionId);
  if (!session) return null;

  const nowSec = Math.floor(Date.now() / 1000);
  if (session.expiresAt < nowSec) {
    SESSIONS.delete(sessionId);
    return null;
  }

  return session;
}

export function switchSessionBranch(sessionId: string, newBranchId: string): SessionContext {
  const session = getSession(sessionId);
  if (!session) {
    throw new Error("Session introuvable ou expirée");
  }

  const user = DEMO_USERS.find((u) => u.id === session.userId);
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  if (
    !user.accessibleBranchIds.includes(newBranchId) &&
    !user.roleCodes.includes("SUPER_ADMIN")
  ) {
    throw new Error(`Accès non autorisé à la succursale [${newBranchId}]`);
  }

  const branch = DEMO_BRANCHES.find((b) => b.id === newBranchId);
  if (!branch) {
    throw new Error(`Succursale [${newBranchId}] inexistante`);
  }

  const oldBranchId = session.branchId;
  session.branchId = newBranchId;

  recordAuditLog({
    tenantId: session.tenantId,
    companyId: session.companyId,
    branchId: newBranchId,
    userId: session.userId,
    userName: session.user.fullName,
    userEmail: session.user.email,
    action: "CONTEXT_SWITCH",
    entity: "Branch",
    entityId: newBranchId,
    oldValue: { branchId: oldBranchId },
    newValue: { branchId: newBranchId, branchName: branch.name },
    reason: `Bascule de succursale vers ${branch.name}`,
    severity: "INFO",
  });

  return session;
}

export function destroySession(sessionId: string): boolean {
  const session = SESSIONS.get(sessionId);
  if (session) {
    recordAuditLog({
      tenantId: session.tenantId,
      companyId: session.companyId,
      branchId: session.branchId,
      userId: session.userId,
      userName: session.user.fullName,
      userEmail: session.user.email,
      action: "AUTH_LOGOUT",
      entity: "Session",
      entityId: sessionId,
      oldValue: { sessionId },
      newValue: null,
      reason: "Déconnexion volontaire de l'utilisateur",
      severity: "INFO",
    });
    SESSIONS.delete(sessionId);
    return true;
  }
  return false;
}

// Initialise une session par défaut pour faciliter la navigation immédiate
export function getDefaultDemoSession(): SessionContext {
  const defaultUser = DEMO_USERS[0]; // M. Kouassi Jean (Directeur Général)
  let activeSession = Array.from(SESSIONS.values()).find((s) => s.userId === defaultUser.id);
  if (!activeSession) {
    activeSession = createSessionForUser(defaultUser);
  }
  return activeSession;
}
