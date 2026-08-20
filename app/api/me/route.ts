import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, getUserFromSession } from "@/lib/auth";
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

    const user = await User.findById(userSession.id).select('-password');

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ 
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role,
        profile: user.profile
      } 
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
