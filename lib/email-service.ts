import nodemailer from 'nodemailer';
import { logger } from './logger';
import { getAppUrl } from './config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create transporter based on environment
function createTransporter() {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  // For development, use ethereal.email or return null
  if (process.env.NODE_ENV === 'development') {
    logger.info('Email service not configured. Running in development mode.');
    return null;
  }
  
  throw new Error('Email service not configured');
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // Development mode - log email instead
      logger.info('--- EMAIL (Development Mode) ---');
      logger.info(`To: ${options.to}`);
      logger.info(`Subject: ${options.subject}`);
      logger.info(`HTML: ${options.html}`);
      logger.info('--- END EMAIL ---');
      return true;
    }
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@hirelens.ai',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    
    logger.info('Email sent:', info.messageId);
    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
  const verificationUrl = `${getAppUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">HireLens AI</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>
          <p>Hi ${name},</p>
          <p>Thank you for signing up for HireLens AI. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 12px;">${verificationUrl}</p>
          <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
          <p>If you didn't create an account with HireLens AI, you can safely ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} HireLens AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Verify Your Email Address
    
    Hi ${name},
    
    Thank you for signing up for HireLens AI. Please verify your email address by visiting:
    
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create an account with HireLens AI, you can safely ignore this email.
    
    © ${new Date().getFullYear()} HireLens AI. All rights reserved.
  `;
  
  return sendEmail({
    to: email,
    subject: 'Verify Your Email Address - HireLens AI',
    html,
    text,
  });
}

export async function sendPasswordResetEmail(email: string, name: string, token: string): Promise<boolean> {
  const resetUrl = `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">HireLens AI</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 12px;">${resetUrl}</p>
          <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} HireLens AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Reset Your Password
    
    Hi ${name},
    
    We received a request to reset your password. Visit the link below to reset it:
    
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request a password reset, you can safely ignore this email.
    
    © ${new Date().getFullYear()} HireLens AI. All rights reserved.
  `;
  
  return sendEmail({
    to: email,
    subject: 'Reset Your Password - HireLens AI',
    html,
    text,
  });
}
