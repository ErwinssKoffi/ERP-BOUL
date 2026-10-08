import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "@/server/auth/mock-users";
import { createSessionForUser, getSession, switchSessionBranch } from "@/server/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, branchId } = body;
    const cookieSessionId = req.cookies.get("erp_session_id")?.value;

    let targetSession = cookieSessionId ? getSession(cookieSessionId) : null;

    // Si on demande de changer d'utilisateur
    if (userId) {
      const targetUser = DEMO_USERS.find((u) => u.id === userId);
      if (!targetUser) {
        return NextResponse.json({ success: false, error: "Utilisateur inconnu" }, { status: 404 });
      }

      const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
      const userAgent = req.headers.get("user-agent") || "Web Client";
      targetSession = createSessionForUser(targetUser, branchId, { ip, userAgent });

      const response = NextResponse.json({ success: true, session: targetSession });
      response.cookies.set("erp_session_id", targetSession.sessionId, {
        path: "/",
        httpOnly: true,
        maxAge: 8 * 3600,
        sameSite: "lax",
      });
      return response;
    }

    // Si on change seulement de succursale
    if (branchId && targetSession) {
      const updated = switchSessionBranch(targetSession.sessionId, branchId);
      return NextResponse.json({ success: true, session: updated });
    }

    return NextResponse.json(
      { success: false, error: "Paramètres manquants (userId ou branchId requis)" },
      { status: 400 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
