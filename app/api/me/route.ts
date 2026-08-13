import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, getUserFromSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  const user = getUserFromSession(session);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
