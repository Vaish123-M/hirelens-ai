import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, clearAuthCookies, logAuthEvent } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { isSameOrigin } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const session = getSessionFromRequest(request);

    if (session) {
      // Create audit log for logout
      await logAuthEvent(session.sub, 'logout', request, { success: true });
    }

    const response = NextResponse.json({ ok: true });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    logger.error('Logout error:', error);
    const response = NextResponse.json({ ok: true }); // Still clear cookie even if logging fails
    clearAuthCookies(response);
    return response;
  }
}
