import { Request, Response, NextFunction } from 'express';
import { MatchService } from '../services/matchService';

export class MatchController {
  // ============================================
  // GET USER MATCHES
  // ============================================

  static async getUserMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;

      const matches = await MatchService.getUserMatches(userId);

      res.json({ matches });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET MATCH BY ID
  // ============================================

  static async getMatchById(req: Request, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.params;
      const userId = (req as any).user.userId;

      const match = await MatchService.getMatchById(matchId, userId);

      res.json(match);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // UNMATCH
  // ============================================

  static async unmatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.params;
      const userId = (req as any).user.userId;

      const result = await MatchService.unmatch(matchId, userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET MATCH STATS
  // ============================================

  static async getMatchStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;

      const stats = await MatchService.getMatchStats(userId);

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
