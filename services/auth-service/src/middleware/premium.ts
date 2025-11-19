import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Middleware to check if user has premium subscription
 */
export const requirePremium = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    throw new AppError('Authentication required', 401);
  }

  if (!user.isPremium) {
    throw new AppError('This feature requires a Premium subscription', 403);
  }

  next();
};

/**
 * Middleware to check if user is premium (adds isPremium to response)
 */
export const checkPremium = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    // Add premium status to response locals for easy access
    res.locals.isPremium = user.isPremium;
  }

  next();
};

export default {
  requirePremium,
  checkPremium,
};
