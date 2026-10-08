import { NextRequest, NextResponse } from "next/server";
import { getDefaultDemoSession, getSession } from "@/server/auth/session";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("erp_session_id")?.value;
    let session = sessionId ? getSession(sessionId) : null;

    // Si aucune session n'est encore active, utiliser la session par défaut (DG)
    if (!session) {
      session = getDefaultDemoSession();
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
