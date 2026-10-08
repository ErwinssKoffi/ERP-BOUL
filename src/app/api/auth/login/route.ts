import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "@/server/auth/mock-users";
import { createSessionForUser } from "@/server/auth/session";
import { recordAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, pinCode, branchId } = body;

    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());

    if (!user) {
      recordAuditLog({
        tenantId: "system",
        companyId: "system",
        userId: "anonymous",
        action: "AUTH_FAILED",
        entity: "Session",
        entityId: email || "unknown",
        reason: `Tentative de connexion avec email inconnu : ${email}`,
        severity: "WARNING",
      });

      return NextResponse.json(
        { success: false, error: "Identifiants ou email introuvable" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Compte utilisateur suspendu ou désactivé" },
        { status: 403 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Web Client";

    const session = createSessionForUser(user, branchId, { ip, userAgent });

    const response = NextResponse.json({
      success: true,
      session,
      token: session.sessionId,
    });

    // Stocker le cookie de session
    response.cookies.set("erp_session_id", session.sessionId, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 3600,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
