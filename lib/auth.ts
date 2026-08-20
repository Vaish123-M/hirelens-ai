import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { IUser, UserRole } from "@/models";

export const SESSION_COOKIE = "hirelens_session";

export function getJwtSecret() {
  return process.env.JWT_SECRET || "hirelens-demo-secret-key";
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
    { expiresIn: "7d" },
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

export function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getUserFromSession(session: ReturnType<typeof getSessionFromRequest>) {
  return session ? { id: session.sub, email: session.email, role: session.role, name: session.name } : null;
}
