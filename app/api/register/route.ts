import { NextRequest, NextResponse } from "next/server";
import { signToken, signRefreshToken, setAuthCookies, logAuthEvent } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { authRateLimit } from "@/lib/rate-limit";
import { isValidEmail, validatePasswordStrength, generateEmailVerificationToken } from "@/lib/auth-utils";
import { sendVerificationEmail } from "@/lib/email-service";
import { logger } from "@/lib/logger";
import { isSameOrigin } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    // Apply rate limiting
    const rateLimitResponse = await authRateLimit(request);
    if (rateLimitResponse && rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

    await connectDB();
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        error: "Password does not meet requirements", 
        details: passwordValidation.errors 
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Generate email verification token
    const { token, expires } = generateEmailVerificationToken();

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'candidate',
      isEmailVerified: false,
      emailVerificationToken: token,
      emailVerificationExpires: expires,
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, user.name, token);

    // Create audit log
    await logAuthEvent(user._id.toString(), 'register', request, { 
      success: true, 
      emailSent,
      role: user.role 
    });

    // Generate tokens (user can login even without verification for demo purposes)
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
      message: "Registration successful. Please check your email to verify your account.",
      emailSent,
    }, { status: 201 });

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    logger.error('Registration error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
