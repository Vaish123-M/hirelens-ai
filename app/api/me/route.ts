import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, getUserFromSession, getRefreshSessionFromRequest, signToken, setAuthCookies } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = getSessionFromRequest(request);
    const userSession = getUserFromSession(session);

    if (!userSession) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await User.findById(userSession.id).select('-password -oauthProviders');

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ 
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role,
        profile: user.profile,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        isActive: user.isActive,
      } 
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Refresh token endpoint
    const refreshSession = getRefreshSessionFromRequest(request);
    
    if (!refreshSession) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const user = await User.findById(refreshSession.sub).select('-password -oauthProviders');

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    // Generate new access token
    const accessToken = signToken({ _id: user._id, email: user.email, role: user.role, name: user.name });

    const response = NextResponse.json({ 
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      } 
    });

    response.cookies.set("hirelens_session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return response;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
