import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';
import { z } from 'zod';

const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional()
});

export class UserController {
  // ============================================
  // GET /api/v1/users/me
  // ============================================

  static async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const user = await UserService.getCurrentUser(userId);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // PATCH /api/v1/users/me
  // ============================================

  static async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const data = updateUserSchema.parse(req.body);

      const user = await UserService.updateUser(userId, data);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // DELETE /api/v1/users/me
  // ============================================

  static async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const result = await UserService.deleteUser(userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET /api/v1/users/me/stats
  // ============================================

  static async getUserStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const stats = await UserService.getUserStats(userId);

      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
