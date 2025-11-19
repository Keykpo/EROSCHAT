import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema
} from '../models/authModels';

export class AuthController {
  // ============================================
  // POST /api/v1/auth/register
  // ============================================

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await AuthService.register(data);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // POST /api/v1/auth/verify-email
  // ============================================

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = verifyEmailSchema.parse(req.body);
      const result = await AuthService.verifyEmail(token);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // POST /api/v1/auth/login
  // ============================================

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await AuthService.login(data);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // POST /api/v1/auth/refresh-token
  // ============================================

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);
      const result = await AuthService.refreshToken(refreshToken);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // POST /api/v1/auth/logout
  // ============================================

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const result = await AuthService.logout(userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // POST /api/v1/auth/forgot-password
  // ============================================

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = forgotPasswordSchema.parse(req.body);
      const result = await AuthService.forgotPassword(data);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // POST /api/v1/auth/reset-password
  // ============================================

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = resetPasswordSchema.parse(req.body);
      const result = await AuthService.resetPassword(data);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
