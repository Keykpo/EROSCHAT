import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError('Access token required', 401);
    }

    // Verify token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTPayload;

    // Check token type
    if (payload.type !== 'access') {
      throw new AppError('Invalid token type', 401);
    }

    // Attach user info to request
    req.userId = payload.userId;
    req.userEmail = payload.email;

    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JWTPayload;

      req.userId = payload.userId;
      req.userEmail = payload.email;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without auth
    logger.warn('Optional auth failed:', error);
    next();
  }
};
