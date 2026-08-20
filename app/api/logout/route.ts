import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { AuditLog } from "@/models";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = getSessionFromRequest(request);

    if (session) {
      // Create audit log for logout
      await AuditLog.create({
        userId: session.sub,
        action: 'logout',
        entity: 'user',
        details: {
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("hirelens_session", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    const response = NextResponse.json({ ok: true }); // Still clear cookie even if logging fails
    response.cookies.set("hirelens_session", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });
    return response;
  }
}
