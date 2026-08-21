import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { IUser, UserRole } from "@/models";
import { AuditLog } from "@/models";
import connectDB from "./mongodb";
import { generateAuditMetadata } from "./auth-utils";
import { logger } from "./logger";

export const SESSION_COOKIE = "hirelens_session";
export const REFRESH_COOKIE = "hirelens_refresh";

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and contain at least 32 characters");
  }
  return secret;
}

export function getRefreshSecret() {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_REFRESH_SECRET must be set and contain at least 32 characters");
  }
  return secret;
}

export function signToken(user: Pick<IUser, "_id" | "email" | "role" | "name">) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    getJwtSecret(),
    { expiresIn: "15m" }, // Short-lived access token
  );
}

export function signRefreshToken(user: Pick<IUser, "_id">) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      type: 'refresh',
    },
    getRefreshSecret(),
    { expiresIn: "7d" }, // Long-lived refresh token
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as {
    sub: string;
    email: string;
    role: UserRole;
    name: string;
  };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, getRefreshSecret()) as {
    sub: string;
    type: string;
  };
}

export function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getRefreshSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!token) return null;

  try {
    return verifyRefreshToken(token);
  } catch {
    return null;
  }
}

export function getUserFromSession(session: ReturnType<typeof getSessionFromRequest>) {
  return session ? { id: session.sub, email: session.email, role: session.role, name: session.name } : null;
}

// Set session cookies
export function setAuthCookies(response: any, accessToken: string, refreshToken: string) {
  response.cookies.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  response.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// Clear session cookies
export function clearAuthCookies(response: any) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
}

// Audit logging helper
export async function logAuthEvent(
  userId: string,
  action: 'login' | 'logout' | 'register' | 'password_reset' | 'email_verified' | 'oauth_login',
  request: Request,
  metadata?: Record<string, any>
) {
  try {
    await connectDB();
    await AuditLog.create({
      userId,
      action,
      entity: 'user',
      details: {
        ...generateAuditMetadata(request),
        ...metadata,
      },
    });
  } catch (error) {
    logger.error('Error logging auth event:', error);
  }
}
