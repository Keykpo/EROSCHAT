import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { MatchingService } from '../services/matchingService';

export class MatchingController {
  // ============================================
  // POST /api/v1/matching/join-queue
  // ============================================

  static async joinQueue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const result = await MatchingService.joinQueue(userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // DELETE /api/v1/matching/leave-queue
  // ============================================

  static async leaveQueue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const result = await MatchingService.leaveQueue(userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET /api/v1/matching/status
  // ============================================

  static async getStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const result = await MatchingService.getQueueStatus(userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
