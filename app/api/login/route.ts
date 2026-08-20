import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { AuditLog } from "@/models";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const user = await User.findOne({ email: String(email || "").toLowerCase() }).select('+password');

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordValid = await user.comparePassword(String(password || ""));
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Account is inactive" }, { status: 403 });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create audit log
    await AuditLog.create({
      userId: user._id,
      action: 'login',
      entity: 'user',
      entityId: user._id,
      details: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    const token = signToken({ _id: user._id, email: user.email, role: user.role, name: user.name });

    const response = NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set("hirelens_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
