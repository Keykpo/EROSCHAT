import { PrismaClient } from '@prisma/client';
import ReportModel from '../models/Report';
import MessageModel from '../models/Message';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class ReportService {
  // ============================================
  // CREATE REPORT
  // ============================================

  static async createReport(
    reporterId: string,
    reportedUserId: string,
    reason: string,
    chatId?: string,
    messageId?: string,
    description?: string
  ) {
    try {
      // Prevent self-reporting
      if (reporterId === reportedUserId) {
        throw new AppError('Cannot report yourself', 400);
      }

      // Get context (last 10 messages from the chat if available)
      let context = [];
      if (chatId) {
        const messages = await MessageModel.find({ chatId })
          .sort({ createdAt: -1 })
          .limit(10)
          .select('senderId content createdAt');

        context = messages.reverse(); // Chronological order
      }

      // Create report
      const report = await ReportModel.create({
        reporterId,
        reportedUserId,
        chatId,
        messageId,
        reason,
        description,
        context,
        status: 'PENDING',
      });

      logger.info(`Report created: ${report._id} by ${reporterId} against ${reportedUserId}`);

      // Check if user has multiple reports (auto-flag for review)
      const reportCount = await ReportModel.countDocuments({
        reportedUserId,
        status: { $in: ['PENDING', 'REVIEWED'] },
      });

      if (reportCount >= 3) {
        logger.warn(`User ${reportedUserId} has ${reportCount} pending reports`);
        // Could auto-suspend here if desired
      }

      return {
        success: true,
        reportId: report._id,
        message: 'Report submitted successfully. We will review it shortly.',
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating report:', error);
      throw new AppError('Failed to create report', 500);
    }
  }

  // ============================================
  // GET USER'S REPORTS
  // ============================================

  static async getUserReports(userId: string) {
    try {
      const reports = await ReportModel.find({
        reporterId: userId,
      })
        .sort({ createdAt: -1 })
        .limit(50);

      return reports;
    } catch (error) {
      logger.error('Error getting user reports:', error);
      throw new AppError('Failed to get reports', 500);
    }
  }

  // ============================================
  // GET PENDING REPORTS (ADMIN)
  // ============================================

  static async getPendingReports(limit: number = 50, skip: number = 0) {
    try {
      const reports = await ReportModel.find({
        status: 'PENDING',
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await ReportModel.countDocuments({
        status: 'PENDING',
      });

      return {
        reports,
        total,
        hasMore: skip + reports.length < total,
      };
    } catch (error) {
      logger.error('Error getting pending reports:', error);
      throw new AppError('Failed to get pending reports', 500);
    }
  }

  // ============================================
  // GET REPORT BY ID (ADMIN)
  // ============================================

  static async getReportById(reportId: string) {
    try {
      const report = await ReportModel.findById(reportId);

      if (!report) {
        throw new AppError('Report not found', 404);
      }

      // Get reporter and reported user info
      const reporter = await prisma.user.findUnique({
        where: { id: report.reporterId },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      const reportedUser = await prisma.user.findUnique({
        where: { id: report.reportedUserId },
        include: {
          profile: true,
        },
      });

      return {
        report,
        reporter,
        reportedUser,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error getting report:', error);
      throw new AppError('Failed to get report', 500);
    }
  }

  // ============================================
  // REVIEW REPORT (ADMIN)
  // ============================================

  static async reviewReport(
    reportId: string,
    reviewerId: string,
    action: 'NONE' | 'WARNING' | 'SUSPENSION' | 'BAN',
    notes?: string
  ) {
    try {
      const report = await ReportModel.findById(reportId);

      if (!report) {
        throw new AppError('Report not found', 404);
      }

      // Update report
      report.status = 'REVIEWED';
      report.reviewedBy = reviewerId;
      report.reviewedAt = new Date();
      report.action = action;
      await report.save();

      // Apply action to user
      if (action === 'SUSPENSION') {
        await this.suspendUser(report.reportedUserId, 7); // 7 days
      } else if (action === 'BAN') {
        await this.banUser(report.reportedUserId);
      } else if (action === 'WARNING') {
        // Could send warning email/notification
        logger.info(`Warning issued to user ${report.reportedUserId}`);
      }

      logger.info(`Report ${reportId} reviewed by ${reviewerId}: ${action}`);

      return {
        success: true,
        action,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error reviewing report:', error);
      throw new AppError('Failed to review report', 500);
    }
  }

  // ============================================
  // SUSPEND USER
  // ============================================

  private static async suspendUser(userId: string, days: number) {
    try {
      const suspendedUntil = new Date();
      suspendedUntil.setDate(suspendedUntil.getDate() + days);

      await prisma.user.update({
        where: { id: userId },
        data: {
          suspendedUntil,
        },
      });

      logger.info(`User ${userId} suspended until ${suspendedUntil}`);
    } catch (error) {
      logger.error('Error suspending user:', error);
      throw error;
    }
  }

  // ============================================
  // BAN USER
  // ============================================

  private static async banUser(userId: string) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          bannedAt: new Date(),
        },
      });

      logger.info(`User ${userId} banned`);
    } catch (error) {
      logger.error('Error banning user:', error);
      throw error;
    }
  }

  // ============================================
  // GET REPORT STATS
  // ============================================

  static async getReportStats() {
    try {
      const pending = await ReportModel.countDocuments({ status: 'PENDING' });
      const reviewed = await ReportModel.countDocuments({ status: 'REVIEWED' });
      const resolved = await ReportModel.countDocuments({ status: 'RESOLVED' });
      const dismissed = await ReportModel.countDocuments({ status: 'DISMISSED' });

      const reasonCounts = await ReportModel.aggregate([
        {
          $group: {
            _id: '$reason',
            count: { $sum: 1 },
          },
        },
      ]);

      return {
        totalReports: pending + reviewed + resolved + dismissed,
        pending,
        reviewed,
        resolved,
        dismissed,
        byReason: reasonCounts,
      };
    } catch (error) {
      logger.error('Error getting report stats:', error);
      throw new AppError('Failed to get report stats', 500);
    }
  }
}
