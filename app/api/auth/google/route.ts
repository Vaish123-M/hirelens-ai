import { NextRequest, NextResponse } from "next/server";
import { signToken, signRefreshToken, setAuthCookies, logAuthEvent } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { generateSecureToken } from "@/lib/auth-utils";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirect = searchParams.get('redirect') || '/dashboard';

  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
  }

  const state = generateSecureToken();
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=openid email profile&` +
    `state=${state}&` +
    `access_type=offline&` +
    `prompt=consent`;

  const response = NextResponse.redirect(authUrl);
  
  // Store state and redirect in cookie for verification
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5, // 5 minutes
  });
  
  response.cookies.set('oauth_redirect', redirect, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5, // 5 minutes
  });

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 });
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Google token exchange error:', error);
      return NextResponse.json({ error: "Failed to exchange authorization code" }, { status: 400 });
    }

    const tokens = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch user info" }, { status: 400 });
    }

    const googleUser = await userResponse.json();

    await connectDB();

    // Check if user exists with this Google ID
    let user = await User.findOne({ 'oauthProviders.google.id': googleUser.id });

    if (user) {
      // Update Google tokens
      user.oauthProviders = {
        google: {
          id: user.oauthProviders?.google?.id || googleUser.id,
          email: user.oauthProviders?.google?.email || googleUser.email,
          name: user.oauthProviders?.google?.name || googleUser.name,
          avatar: user.oauthProviders?.google?.avatar || googleUser.picture,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
      };
    } else {
      // Check if user exists with same email
      user = await User.findOne({ email: googleUser.email.toLowerCase() });

      if (user) {
        // Link Google account to existing user
        user.oauthProviders = {
          google: {
            id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            avatar: googleUser.picture,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          },
        };
      } else {
        // Create new user
        user = await User.create({
          name: googleUser.name,
          email: googleUser.email.toLowerCase(),
          role: 'candidate',
          isEmailVerified: googleUser.verified_email || true,
          avatar: googleUser.picture,
          oauthProviders: {
            google: {
              id: googleUser.id,
              email: googleUser.email,
              name: googleUser.name,
              avatar: googleUser.picture,
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
            },
          },
        });
      }
    }

    user.lastLogin = new Date();
    await user.save();

    await logAuthEvent(user._id.toString(), 'oauth_login', request, { 
      success: true,
      provider: 'google',
      email: user.email 
    });

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
        avatar: user.avatar,
      },
    });

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
