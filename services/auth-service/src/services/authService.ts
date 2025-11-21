import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { JWTService } from './jwtService';
import { EmailService } from './emailService';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput
} from '../models/authModels';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

export class AuthService {
  // ============================================
  // REGISTER
  // ============================================

  static async register(data: RegisterInput) {
    const { email, password, dateOfBirth, acceptedTerms } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Generate verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        dateOfBirth: new Date(dateOfBirth),
        ageVerified: true, // Verified by dateOfBirth check
        emailVerificationToken
      }
    });

    // Send verification email
    await EmailService.sendVerificationEmail(email, emailVerificationToken);

    logger.info(`User registered: ${user.id}`);

    return {
      userId: user.id,
      email: user.email,
      message: 'Registration successful. Please check your email to verify your account.'
    };
  }

  // ============================================
  // VERIFY EMAIL
  // ============================================

  static async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        isVerified: false
      }
    });

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null
      }
    });

    logger.info(`Email verified for user: ${user.id}`);

    return {
      message: 'Email verified successfully'
    };
  }

  // ============================================
  // LOGIN
  // ============================================

  static async login(data: LoginInput) {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if email is verified (skip in development)
    if (!user.isVerified && process.env.NODE_ENV !== 'development') {
      throw new AppError('Please verify your email before logging in', 403);
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() }
    });

    // Generate tokens
    const tokens = JWTService.generateTokenPair(user.id, user.email);

    logger.info(`User logged in: ${user.id}`);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        isPremium: user.isPremium,
        isVerified: user.isVerified,
        credits: user.credits,
        hasProfile: !!user.profile
      }
    };
  }

  // ============================================
  // REFRESH TOKEN
  // ============================================

  static async refreshToken(refreshToken: string) {
    try {
      const payload = JWTService.verifyToken(refreshToken);

      if (payload.type !== 'refresh') {
        throw new AppError('Invalid token type', 401);
      }

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Generate new access token
      const accessToken = JWTService.generateAccessToken(user.id, user.email);

      return { accessToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  // ============================================
  // LOGOUT
  // ============================================

  static async logout(userId: string) {
    // In a production app, you would:
    // 1. Add the token to a Redis blacklist
    // 2. Clear any active sessions

    logger.info(`User logged out: ${userId}`);

    return {
      message: 'Logged out successfully'
    };
  }

  // ============================================
  // FORGOT PASSWORD
  // ============================================

  static async forgotPassword(data: ForgotPasswordInput) {
    const { email } = data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Always return success (don't reveal if email exists)
    if (!user) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return {
        message: 'If that email exists, a password reset link has been sent.'
      };
    }

    // Generate reset token
    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Save token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpiresAt
      }
    });

    // Send email
    await EmailService.sendPasswordResetEmail(email, passwordResetToken);

    logger.info(`Password reset email sent to: ${email}`);

    return {
      message: 'If that email exists, a password reset link has been sent.'
    };
  }

  // ============================================
  // RESET PASSWORD
  // ============================================

  static async resetPassword(data: ResetPasswordInput) {
    const { token, newPassword } = data;

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiresAt: {
          gt: new Date() // Token not expired
        }
      }
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiresAt: null
      }
    });

    logger.info(`Password reset for user: ${user.id}`);

    return {
      message: 'Password reset successfully'
    };
  }
}
