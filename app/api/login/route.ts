import { NextRequest, NextResponse } from "next/server";
import { signToken, signRefreshToken, setAuthCookies, logAuthEvent } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { authRateLimit } from "@/lib/rate-limit";
import { getClientIp, isValidEmail } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await authRateLimit(request);
    if (rateLimitResponse && rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

    await connectDB();
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const user = await User.findOne({ email: String(email || "").toLowerCase() }).select('+password');

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockTimeRemaining = Math.ceil((user.lockUntil!.getTime() - Date.now()) / 1000 / 60);
      return NextResponse.json({ 
        error: "Account temporarily locked", 
        message: `Too many failed attempts. Try again in ${lockTimeRemaining} minutes.`,
        locked: true 
      }, { status: 429 });
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json({ error: "Account is inactive" }, { status: 403 });
    }

    const isPasswordValid = await user.comparePassword(String(password || ""));
    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incrementLoginAttempts();
      
      // Log failed attempt
      await logAuthEvent(user._id.toString(), 'login', request, { success: false, reason: 'invalid_password' });
      
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Reset failed login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login and login history
    user.lastLogin = new Date();
    user.loginHistory = user.loginHistory || [];
    user.loginHistory.push({
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
      success: true,
    });
    
    // Keep only last 10 login attempts
    if (user.loginHistory.length > 10) {
      user.loginHistory = user.loginHistory.slice(-10);
    }
    
    await user.save();

    // Create audit log
    await logAuthEvent(user._id.toString(), 'login', request, { success: true });

    // Generate tokens
    const accessToken = signToken({ _id: user._id, email: user.email, role: user.role, name: user.name });
    const refreshToken = signRefreshToken({ _id: user._id });

    const response = NextResponse.json({
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });

    // Set secure cookies
    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
