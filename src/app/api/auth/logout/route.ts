import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/server/auth/session";

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("erp_session_id")?.value;
    if (sessionId) {
      destroySession(sessionId);
    }

    const response = NextResponse.json({ success: true, message: "Déconnecté avec succès" });
    response.cookies.delete("erp_session_id");
    return response;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
