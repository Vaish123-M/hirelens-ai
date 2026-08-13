import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { applications } from "@/lib/store";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();
  const found = applications.find((item) => item.id === id);

  if (!found) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  found.status = status;
  return NextResponse.json({ application: found });
}
