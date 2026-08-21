import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { logAuthEvent } from "@/lib/auth";
import { validatePasswordStrength } from "@/lib/auth-utils";
import { logger } from "@/lib/logger";
import { isSameOrigin } from "@/lib/config";
import { passwordResetRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const rateLimitResponse = await passwordResetRateLimit(request);
    if (rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

    await connectDB();
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        error: "Password does not meet requirements", 
        details: passwordValidation.errors 
      }, { status: 400 });
    }

    const user = await User.findOne({ 
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    }).select('+password');

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    await logAuthEvent(user._id.toString(), 'password_reset', request, { 
      success: true,
      action: 'complete_reset'
    });

    return NextResponse.json({ 
      message: "Password reset successfully. You can now login with your new password.",
      success: true 
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: "Reset token is required" }, { status: 400 });
    }

    const user = await User.findOne({ 
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ 
        valid: false,
        error: "Invalid or expired reset token" 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      valid: true,
      email: user.email,
      message: "Reset token is valid" 
    });
  } catch (error) {
    logger.error('Validate reset token error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
