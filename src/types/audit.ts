export type AuditAction =
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  | "AUTH_FAILED"
  | "CONTEXT_SWITCH"
  | "USER_CREATE"
  | "USER_UPDATE"
  | "USER_DEACTIVATE"
  | "ROLE_ASSIGN"
  | "ROLE_REVOKE"
  | "STOCK_ADJUST"
  | "STOCK_RECEIVE"
  | "STOCK_TRANSFER"
  | "STOCK_WASTE"
  | "PRODUCTION_CREATE"
  | "PRODUCTION_VALIDATE"
  | "RECIPE_UPDATE"
  | "SALE_CREATE"
  | "SALE_CANCEL"
  | "SALE_REFUND"
  | "CASH_OPEN"
  | "CASH_CLOSE"
  | "CASH_VARIANCE"
  | "EXPENSE_CREATE"
  | "PAYROLL_RUN"
  | "FISCAL_CERTIFY"
  | "CONFIG_UPDATE";

export type AuditEntity =
  | "User"
  | "Session"
  | "Role"
  | "Tenant"
  | "Branch"
  | "StockMovement"
  | "StockItem"
  | "Recipe"
  | "ProductionOrder"
  | "Sale"
  | "CashSession"
  | "Expense"
  | "FiscalInvoice"
  | "SystemConfig";

export interface AuditLog {
  id: string; // UUID ou nanoid
  tenantId: string;
  companyId: string;
  branchId?: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  diff?: Record<string, { from: unknown; to: unknown }>;
  reason?: string;
  device?: string;
  ipAddress?: string;
  timestamp: string; // ISO 8601
  severity: "INFO" | "WARNING" | "CRITICAL";
}

export interface AuditQueryFilter {
  tenantId: string;
  branchId?: string;
  userId?: string;
  entity?: AuditEntity;
  action?: AuditAction;
  startDate?: string;
  endDate?: string;
  severity?: "INFO" | "WARNING" | "CRITICAL";
  limit?: number;
  offset?: number;
}
