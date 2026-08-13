import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { users } from "@/lib/store";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = users.find(
    (item) => item.email.toLowerCase() === String(email || "").toLowerCase() && item.password === String(password || ""),
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });

  response.cookies.set("hirelens_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
