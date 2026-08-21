import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { logAuthEvent } from "@/lib/auth";
import { passwordResetRateLimit } from "@/lib/rate-limit";
import { generatePasswordResetToken, isValidEmail } from "@/lib/auth-utils";
import { sendPasswordResetEmail } from "@/lib/email-service";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await passwordResetRateLimit(request);
    if (rateLimitResponse && rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({ 
        message: "If an account exists with this email, a password reset link has been sent." 
      });
    }

    // Check if user has password (OAuth users might not)
    if (!user.password) {
      return NextResponse.json({ 
        error: "This account uses OAuth login. Please use your OAuth provider to reset your password." 
      }, { status: 400 });
    }

    // Generate password reset token
    const { token, expires } = generatePasswordResetToken();
    
    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    await user.save();

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(user.email, user.name, token);

    await logAuthEvent(user._id.toString(), 'password_reset', request, { 
      success: emailSent,
      action: 'request_reset'
    });

    return NextResponse.json({ 
      message: "If an account exists with this email, a password reset link has been sent.",
      emailSent 
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
