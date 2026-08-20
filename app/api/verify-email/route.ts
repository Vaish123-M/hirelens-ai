import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { logAuthEvent } from "@/lib/auth";
import { emailVerificationRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await emailVerificationRateLimit(request);
    if (rateLimitResponse && rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({ 
        message: "If an account exists with this email, a verification link has been sent." 
      });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const { generateEmailVerificationToken } = await import('@/lib/auth-utils');
    const { sendVerificationEmail } = await import('@/lib/email-service');
    
    const { token, expires } = generateEmailVerificationToken();
    
    user.emailVerificationToken = token;
    user.emailVerificationExpires = expires;
    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, user.name, token);

    await logAuthEvent(user._id.toString(), 'email_verified', request, { 
      success: emailSent,
      action: 'resend_verification'
    });

    return NextResponse.json({ 
      message: "Verification email sent",
      emailSent 
    });
  } catch (error) {
    console.error('Send verification email error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 });
    }

    const user = await User.findOne({ 
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    await logAuthEvent(user._id.toString(), 'email_verified', request, { success: true });

    return NextResponse.json({ 
      message: "Email verified successfully",
      verified: true 
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
