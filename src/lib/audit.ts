import { AuditAction, AuditEntity, AuditLog, AuditQueryFilter } from "@/types/audit";
import { appLogger } from "./logger";

// Piste d'audit immuable en mémoire (sera persistée en base PostgreSQL à l'étape DB)
// Sécurisée par isolation stricte du tenantId.
const IN_MEMORY_AUDIT_LOGS: AuditLog[] = [];

export interface CreateAuditEntryInput {
  tenantId: string;
  companyId: string;
  branchId?: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  reason?: string;
  device?: string;
  ipAddress?: string;
  severity?: "INFO" | "WARNING" | "CRITICAL";
}

/**
 * Enregistre un événement critique dans la piste d'audit immuable
 */
export function recordAuditLog(input: CreateAuditEntryInput): AuditLog {
  const diff: Record<string, { from: unknown; to: unknown }> = {};

  if (input.oldValue && input.newValue) {
    const allKeys = new Set([...Object.keys(input.oldValue), ...Object.keys(input.newValue)]);
    for (const key of allKeys) {
      const fromVal = input.oldValue[key];
      const toVal = input.newValue[key];
      if (JSON.stringify(fromVal) !== JSON.stringify(toVal)) {
        diff[key] = { from: fromVal, to: toVal };
      }
    }
  }

  const log: AuditLog = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    tenantId: input.tenantId,
    companyId: input.companyId,
    branchId: input.branchId,
    userId: input.userId,
    userEmail: input.userEmail,
    userName: input.userName,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    oldValue: input.oldValue ?? null,
    newValue: input.newValue ?? null,
    diff: Object.keys(diff).length > 0 ? diff : undefined,
    reason: input.reason,
    device: input.device || "Web POS / Desktop",
    ipAddress: input.ipAddress || "127.0.0.1",
    timestamp: new Date().toISOString(),
    severity: input.severity || "INFO",
  };

  IN_MEMORY_AUDIT_LOGS.unshift(log);

  // Logger structuré simultané
  appLogger.info(`Audit: [${log.action}] sur ${log.entity}#${log.entityId} par ${log.userName || log.userId}`, {
    tenantId: log.tenantId,
    branchId: log.branchId,
    userId: log.userId,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
  });

  return log;
}

/**
 * Recherche les journaux d'audit avec garantie absolue d'isolation par tenantId
 */
export function queryAuditLogs(filter: AuditQueryFilter): { logs: AuditLog[]; total: number } {
  if (!filter.tenantId) {
    throw new Error("L'isolation multi-tenant requiert impérativement un tenantId valide");
  }

  let filtered = IN_MEMORY_AUDIT_LOGS.filter((log) => log.tenantId === filter.tenantId);

  if (filter.branchId) {
    filtered = filtered.filter((log) => !log.branchId || log.branchId === filter.branchId);
  }
  if (filter.userId) {
    filtered = filtered.filter((log) => log.userId === filter.userId);
  }
  if (filter.entity) {
    filtered = filtered.filter((log) => log.entity === filter.entity);
  }
  if (filter.action) {
    filtered = filtered.filter((log) => log.action === filter.action);
  }
  if (filter.severity) {
    filtered = filtered.filter((log) => log.severity === filter.severity);
  }
  if (filter.startDate) {
    filtered = filtered.filter((log) => new Date(log.timestamp) >= new Date(filter.startDate!));
  }
  if (filter.endDate) {
    filtered = filtered.filter((log) => new Date(log.timestamp) <= new Date(filter.endDate!));
  }

  const total = filtered.length;
  const offset = filter.offset || 0;
  const limit = filter.limit || 50;
  const paginated = filtered.slice(offset, offset + limit);

  return { logs: paginated, total };
}

/**
 * Initialise des données d'audit de démarrage pour démonstration
 */
export function seedInitialAuditLogs(tenantId: string, companyId: string): void {
  if (IN_MEMORY_AUDIT_LOGS.length > 0) return;

  recordAuditLog({
    tenantId,
    companyId,
    branchId: "br_plateau",
    userId: "usr_dg_01",
    userName: "M. Kouassi Jean (Directeur Général)",
    userEmail: "j.kouassi@boulangerie-ivoire.ci",
    action: "CONFIG_UPDATE",
    entity: "SystemConfig",
    entityId: "cfg_core_01",
    oldValue: { status: "uninitialized" },
    newValue: { status: "initialized", version: "0.1.0", currency: "XOF" },
    reason: "Initialisation du socle Foundation ERP-BOUL",
    severity: "INFO",
  });

  recordAuditLog({
    tenantId,
    companyId,
    branchId: "br_plateau",
    userId: "usr_gerant_01",
    userName: "Mme Touré Awa (Gérante Plateau)",
    userEmail: "a.toure@boulangerie-ivoire.ci",
    action: "CASH_OPEN",
    entity: "CashSession",
    entityId: "csh_plt_20261008",
    oldValue: null,
    newValue: { openingBalance: 50000, currency: "XOF", openedAt: "2026-10-08T06:00:00Z" },
    reason: "Ouverture de caisse matinale (Fond de caisse 50 000 FCFA)",
    severity: "INFO",
  });
}
