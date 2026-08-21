# HireLens AI - Authentication System Guide

## Overview
This guide documents the comprehensive authentication system implemented for HireLens AI, including security features, role-based access control, and testing procedures.

## Authentication Features

### 1. Enhanced User Model
- **5-Role RBAC System**: candidate, recruiter, moderator, admin, superadmin
- **Email Verification**: Optional but recommended for security
- **Password Reset**: Secure token-based password recovery
- **OAuth Integration**: Google OAuth support
- **Account Locking**: Automatic lockout after 5 failed login attempts
- **Login History**: Track all login attempts with IP and user agent

### 2. Security Features
- **Secure Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Short-lived access tokens (15min) + long-lived refresh tokens (7 days)
- **Rate Limiting**: Endpoint-specific rate limiting to prevent abuse
- **Account Lockout**: Temporary lock after failed attempts
- **Audit Logging**: Comprehensive audit trail for all auth events
- **Secure Cookies**: HttpOnly, Secure, SameSite protection

### 3. Authentication Endpoints

#### Register
- **POST** `/api/register`
- **Features**: 
  - Password strength validation
  - Email format validation
  - Duplicate email prevention
  - Automatic email verification token generation
  - Verification email sending
  - Rate limited (5 requests per 15 minutes)

#### Login
- **POST** `/api/login`
- **Features**:
  - Account lockout protection
  - Failed login attempt tracking
  - Login history recording
  - Secure token generation
  - Audit logging
  - Rate limited (5 requests per 15 minutes)

#### Logout
- **POST** `/api/logout`
- **Features**:
  - Secure token invalidation
  - Audit logging
  - Cookie clearing

#### Refresh Token
- **POST** `/api/me`
- **Features**:
  - Token refresh without re-authentication
  - Secure token rotation

#### Email Verification
- **POST** `/api/verify-email` - Resend verification email
- **GET** `/api/verify-email?token=xxx` - Verify email with token
- **Features**:
  - Token expiration (24 hours)
  - Rate limited (3 requests per hour)
  - Audit logging

#### Password Reset
- **POST** `/api/forgot-password` - Request password reset
- **POST** `/api/reset-password` - Complete password reset
- **GET** `/api/reset-password?token=xxx` - Validate reset token
- **Features**:
  - Token expiration (1 hour)
  - Password strength validation
  - Account unlock on reset
  - Rate limited (3 requests per hour)
  - Audit logging

#### Google OAuth
- **GET** `/api/auth/google` - Initiate OAuth flow
- **POST** `/api/auth/google` - Complete OAuth flow
- **Features**:
  - Account linking
  - Automatic email verification
  - Token management
  - Profile synchronization

### 4. Role-Based Access Control

#### Role Hierarchy (Level 1-5)
1. **candidate** (Level 1)
   - Apply to jobs
   - View own applications
   - Update own profile
   - Basic features

2. **recruiter** (Level 2)
   - All candidate permissions
   - Manage jobs
   - View applications
   - Schedule interviews
   - Extend offers

3. **moderator** (Level 3)
   - All recruiter permissions
   - Moderate content
   - View all applications
   - Basic user management

4. **admin** (Level 4)
   - All moderator permissions
   - Manage users
   - Manage companies
   - View analytics
   - System settings

5. **superadmin** (Level 5)
   - All permissions
   - Full system access
   - Critical operations

#### Permission System
- Hierarchical role checking
- Specific permission validation
- Helper functions for authorization

### 5. Rate Limiting Strategy

#### Endpoint-Specific Limits
- **Auth endpoints** (login, register): 5 requests / 15 minutes
- **Password reset**: 3 requests / 1 hour
- **Email verification**: 3 requests / 1 hour
- **General API**: 100 requests / 15 minutes

#### Rate Limit Headers
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1691234567890
Retry-After: 300
```

### 6. Audit Logging

#### Logged Events
- `login` - Successful/failed login attempts
- `logout` - User logout
- `register` - New user registration
- `password_reset` - Password reset requests/completions
- `email_verified` - Email verification events
- `oauth_login` - OAuth authentication

#### Audit Data
- User ID
- Action type
- Entity type
- IP address
- User agent
- Timestamp
- Additional metadata

### 7. Email Service

#### Configuration
```env
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@hirelens.ai
```

#### Email Types
- **Verification Email**: Welcome + verification link
- **Password Reset**: Reset link with expiration

#### Development Mode
- Logs email content to console
- No actual email sending required

### 8. OAuth Configuration

#### Google OAuth Setup
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

#### OAuth Flow
1. User clicks "Sign in with Google"
2. Redirect to Google OAuth consent screen
3. User authorizes application
4. Receive authorization code
5. Exchange code for access tokens
6. Fetch user profile from Google
7. Create/link user account
8. Generate session tokens
9. Redirect to application

## Testing Guide

### 1. Manual Testing Steps

#### Test Registration
```bash
# Test successful registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123!","role":"candidate"}'

# Test duplicate email
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123!","role":"candidate"}'

# Test weak password
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test2@example.com","password":"weak","role":"candidate"}'
```

#### Test Login
```bash
# Test successful login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ava@northstar.ai","password":"password123"}'

# Test invalid credentials
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ava@northstar.ai","password":"wrongpassword"}'

# Test account lockout (attempt 5+ times)
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ava@northstar.ai","password":"wrongpassword"}'
```

#### Test Email Verification
```bash
# Request verification email
curl -X POST http://localhost:3000/api/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify with token (from email or database)
curl "http://localhost:3000/api/verify-email?token=YOUR_TOKEN"
```

#### Test Password Reset
```bash
# Request password reset
curl -X POST http://localhost:3000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"ava@northstar.ai"}'

# Validate reset token
curl "http://localhost:3000/api/reset-password?token=YOUR_TOKEN"

# Complete password reset
curl -X POST http://localhost:3000/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN","password":"NewPass123!"}'
```

#### Test Rate Limiting
```bash
# Send multiple requests to trigger rate limit
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"TestPass123!"}'
done
```

### 2. Automated Testing Scenarios

#### Test Account Lockout
1. Attempt login with wrong password 5 times
2. Verify account is locked
3. Wait 15 minutes or use password reset
4. Verify account is unlocked

#### Test Token Refresh
1. Login and get access token
2. Wait 15 minutes for token to expire
3. Use refresh token to get new access token
4. Verify access token works

#### Test Email Verification Flow
1. Register new user
2. Check email verification token in database
3. Use token to verify email
4. Verify user.isEmailVerified is true

#### Test OAuth Flow
1. Initiate Google OAuth
2. Complete authorization
3. Verify user is created/linked
4. Verify user.isEmailVerified is true
5. Test login with OAuth

### 3. Security Testing

#### Test SQL Injection Protection
```bash
# Try SQL injection in email field
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"\' OR \'1\'=\'1","password":"password"}'
```

#### Test XSS Protection
```bash
# Try XSS in name field
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@example.com","password":"TestPass123!"}'
```

#### Test CSRF Protection
- Verify CSRF tokens are used for state-changing operations
- Verify SameSite cookie attributes are set correctly

### 4. Database Verification

#### Check User Records
```javascript
// In MongoDB shell
db.users.find({}, {password: 0, emailVerificationToken: 0, passwordResetToken: 0})

// Check failed login attempts
db.users.find({email: "ava@northstar.ai"}, {failedLoginAttempts: 1, lockUntil: 1})

// Check audit logs
db.auditLogs.find({action: "login"}).sort({timestamp: -1}).limit(10)
```

## Environment Variables

### Required Variables
```env
# Authentication
JWT_SECRET=your-jwt-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars

# Database
MONGODB_URI=mongodb://localhost:27017/hirelens-ai

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key
```

### Optional Variables
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Email Service
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@hirelens.ai
```

## Seed Accounts

After running `npm run seed`, use these accounts for testing:

| Role | Email | Password | Verified |
|------|-------|----------|----------|
| Candidate | ava@northstar.ai | password123 | Yes |
| Recruiter | olivia@hirelens.ai | password123 | Yes |
| Admin | admin@hirelens.ai | password123 | Yes |
| Moderator | moderator@hirelens.ai | password123 | Yes |
| Super Admin | superadmin@hirelens.ai | password123 | Yes |

## Troubleshooting

### Common Issues

#### Rate Limit Errors
- **Error**: "Too many requests"
- **Solution**: Wait for the rate limit window to expire or use different IP

#### Account Locked
- **Error**: "Account temporarily locked"
- **Solution**: Wait 15 minutes or use password reset to unlock

#### Token Expired
- **Error**: "Invalid or expired token"
- **Solution**: Use refresh token or login again

#### Email Not Sending
- **Error**: Email service not configured
- **Solution**: Configure email service or use development mode (logs to console)

#### OAuth Not Working
- **Error**: "Google OAuth not configured"
- **Solution**: Set up Google OAuth credentials in environment variables

## Performance Considerations

### Password Hashing
- Uses bcrypt with 12 salt rounds
- Increased from 10 for better security
- May add ~100-200ms to login time

### Rate Limiting
- In-memory storage (for demo)
- Use Redis for production deployment
- Cleanup runs every minute

### Token Validation
- JWT verification is fast (~1-2ms)
- Database lookup for user validation (~10-50ms)
- Consider caching user sessions for high traffic

## Security Best Practices

### Production Deployment
1. Use strong, unique secrets for JWT
2. Enable HTTPS everywhere
3. Use Redis for rate limiting storage
4. Configure proper email service
5. Set up monitoring for audit logs
6. Regular security audits
7. Keep dependencies updated

### Monitoring
- Monitor failed login attempts
- Track rate limit violations
- Audit suspicious activity
- Monitor OAuth token usage
- Track email delivery rates

## Compliance

### Data Protection
- Passwords are hashed, never stored
- Personal data encrypted at rest
- Audit logs auto-expire after 1 year
- Users can request data deletion

### GDPR Considerations
- Clear consent for data processing
- Right to data deletion
- Data portability
- Privacy by design

## Future Enhancements

### Planned Features
- Multi-factor authentication (MFA)
- Social login providers (GitHub, LinkedIn)
- Session management UI
- Security alerts (unusual login detection)
- Biometric authentication support
- Advanced password policies
- SSO integration
- Audit log dashboard

### Scalability
- Implement Redis for distributed rate limiting
- Add user session caching
- Optimize database queries
- Implement database connection pooling
- Add CDN for static assets
