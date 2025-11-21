import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

const isDevelopment = process.env.NODE_ENV === 'development';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Mock email sending in development
const sendMailMock = async (options: any) => {
  logger.info('📧 [DEV] Email would be sent:');
  logger.info(`   To: ${options.to}`);
  logger.info(`   Subject: ${options.subject}`);
  // Extract URL from HTML if present
  const urlMatch = options.html?.match(/href="([^"]+)"/);
  if (urlMatch) {
    logger.info(`   Link: ${urlMatch[1]}`);
  }
  return { messageId: 'dev-mock-id' };
};

export class EmailService {
  static async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify your Ero Chat account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF4458;">Welcome to Ero Chat! 🔥</h1>
            <p>Thank you for signing up. Please verify your email address to get started.</p>
            <a href="${verificationUrl}"
               style="display: inline-block; background-color: #FF4458; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Verify Email
            </a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This link will expire in 24 hours.
            </p>
          </div>
        `
      };

      if (isDevelopment) {
        await sendMailMock(mailOptions);
      } else {
        await transporter.sendMail(mailOptions);
      }

      logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending verification email:', error);
      throw error;
    }
  }

  static async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Reset your Ero Chat password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF4458;">Reset Your Password</h1>
            <p>You requested to reset your password. Click the button below to proceed:</p>
            <a href="${resetUrl}"
               style="display: inline-block; background-color: #FF4458; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Reset Password
            </a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="color: #666; word-break: break-all;">${resetUrl}</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
          </div>
        `
      };

      if (isDevelopment) {
        await sendMailMock(mailOptions);
      } else {
        await transporter.sendMail(mailOptions);
      }

      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending password reset email:', error);
      throw error;
    }
  }

  static async sendWelcomeEmail(email: string, username: string) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Welcome to Ero Chat! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF4458;">Welcome, ${username}! 🎉</h1>
            <p>Your account has been verified and you're ready to start connecting!</p>
            <h2>What's Next?</h2>
            <ul>
              <li>Complete your profile</li>
              <li>Set your preferences</li>
              <li>Start your first anonymous chat</li>
            </ul>
            <a href="${process.env.FRONTEND_URL}/home"
               style="display: inline-block; background-color: #FF4458; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Get Started
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Remember: Your privacy and safety are our priority. Always chat responsibly.
            </p>
          </div>
        `
      };

      if (isDevelopment) {
        await sendMailMock(mailOptions);
      } else {
        await transporter.sendMail(mailOptions);
      }

      logger.info(`Welcome email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending welcome email:', error);
      // Don't throw - welcome email is not critical
    }
  }
}
