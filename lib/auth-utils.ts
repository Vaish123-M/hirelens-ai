import crypto from 'crypto';
import { IUser } from '@/models';

// Generate secure random token
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate email verification token
export function generateEmailVerificationToken(): { token: string; expires: Date } {
  const token = generateSecureToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return { token, expires };
}

// Generate password reset token
export function generatePasswordResetToken(): { token: string; expires: Date } {
  const token = generateSecureToken();
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  return { token, expires };
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Sanitize user data for response
export function sanitizeUser(user: IUser) {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.emailVerificationToken;
  delete userObj.passwordResetToken;
  delete userObj.oauthProviders;
  return userObj;
}

// Rate limiting storage (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

// Clean up expired rate limit records
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

// Get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

// Get user agent from request
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}

// Role hierarchy for permission checking
const roleHierarchy: Record<string, number> = {
  candidate: 1,
  recruiter: 2,
  moderator: 3,
  admin: 4,
  superadmin: 5,
};

// Check if user has required role or higher
export function hasRoleOrHigher(userRole: string, requiredRole: string): boolean {
  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

// Check if user has specific permission
export function hasPermission(userRole: string, permission: string): boolean {
  const permissions: Record<string, string[]> = {
    candidate: ['apply_jobs', 'view_own_applications', 'update_own_profile'],
    recruiter: ['manage_jobs', 'view_applications', 'schedule_interviews', 'extend_offers'],
    moderator: ['moderate_content', 'view_all_applications', 'basic_user_management'],
    admin: ['manage_users', 'manage_companies', 'view_analytics', 'system_settings'],
    superadmin: ['all_permissions'],
  };
  
  const userPermissions = permissions[userRole] || [];
  return userPermissions.includes(permission) || userRole === 'superadmin';
}

// Generate audit log metadata
export function generateAuditMetadata(request: Request, additionalData?: Record<string, any>) {
  return {
    ip: getClientIp(request),
    userAgent: getUserAgent(request),
    timestamp: new Date(),
    ...additionalData,
  };
}
