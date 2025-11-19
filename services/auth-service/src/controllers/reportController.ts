import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/reportService';
import { z } from 'zod';

const createReportSchema = z.object({
  reportedUserId: z.string().uuid(),
  reason: z.enum(['INAPPROPRIATE', 'SPAM', 'HARASSMENT', 'FAKE', 'UNDERAGE', 'OTHER']),
  chatId: z.string().uuid().optional(),
  messageId: z.string().optional(),
  description: z.string().max(500).optional(),
});

const reviewReportSchema = z.object({
  action: z.enum(['NONE', 'WARNING', 'SUSPENSION', 'BAN']),
  notes: z.string().optional(),
});

export class ReportController {
  // ============================================
  // CREATE REPORT
  // ============================================

  static async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const validation = createReportSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid request',
          details: validation.error.errors,
        });
      }

      const { reportedUserId, reason, chatId, messageId, description } =
        validation.data;

      const result = await ReportService.createReport(
        userId,
        reportedUserId,
        reason,
        chatId,
        messageId,
        description
      );

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET USER'S REPORTS
  // ============================================

  static async getUserReports(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;

      const reports = await ReportService.getUserReports(userId);

      res.json({ reports });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET PENDING REPORTS (ADMIN)
  // ============================================

  static async getPendingReports(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await ReportService.getPendingReports(limit, skip);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET REPORT BY ID (ADMIN)
  // ============================================

  static async getReportById(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;

      const report = await ReportService.getReportById(reportId);

      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // REVIEW REPORT (ADMIN)
  // ============================================

  static async reviewReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;
      const adminId = (req as any).user.userId;
      const validation = reviewReportSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid request',
          details: validation.error.errors,
        });
      }

      const { action, notes } = validation.data;

      const result = await ReportService.reviewReport(
        reportId,
        adminId,
        action,
        notes
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET REPORT STATS (ADMIN)
  // ============================================

  static async getReportStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await ReportService.getReportStats();

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
