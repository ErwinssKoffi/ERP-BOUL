import { NextRequest, NextResponse } from "next/server";
import { queryAuditLogs, recordAuditLog, seedInitialAuditLogs } from "@/lib/audit";
import { getDefaultDemoSession, getSession } from "@/server/auth/session";
import { hasPermission } from "@/server/auth/rbac";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("erp_session_id")?.value;
    const session = sessionId ? getSession(sessionId) : getDefaultDemoSession();

    if (!session) {
      return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
    }

    // Initialiser les logs de démo si vide
    seedInitialAuditLogs(session.tenantId, session.companyId);

    // Vérifier permission audit.view
    if (!hasPermission(session, "audit.view")) {
      return NextResponse.json(
        {
          success: false,
          error: "Accès refusé : La consultation de la piste d'audit requiert la permission [audit.view]",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get("branchId") || undefined;
    const action = (searchParams.get("action") as any) || undefined;
    const entity = (searchParams.get("entity") as any) || undefined;
    const severity = (searchParams.get("severity") as any) || undefined;
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const result = queryAuditLogs({
      tenantId: session.tenantId,
      branchId,
      action,
      entity,
      severity,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      logs: result.logs,
      total: result.total,
      tenantId: session.tenantId,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("erp_session_id")?.value;
    const session = sessionId ? getSession(sessionId) : getDefaultDemoSession();

    if (!session) {
      return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { action, entity, entityId, oldValue, newValue, reason, severity } = body;

    const log = recordAuditLog({
      tenantId: session.tenantId,
      companyId: session.companyId,
      branchId: session.branchId,
      userId: session.userId,
      userName: session.user.fullName,
      userEmail: session.user.email,
      action: action || "CONFIG_UPDATE",
      entity: entity || "SystemConfig",
      entityId: entityId || "manual_test",
      oldValue,
      newValue,
      reason: reason || "Action manuelle enregistrée via console",
      severity: severity || "INFO",
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
