import OpenAI from 'openai';
import MessageModel from '../models/Message';
import { logger } from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ModerationResult {
  flagged: boolean;
  categories: {
    sexual: boolean;
    hate: boolean;
    harassment: boolean;
    'self-harm': boolean;
    'sexual/minors': boolean;
    'hate/threatening': boolean;
    'violence/graphic': boolean;
    'self-harm/intent': boolean;
    'self-harm/instructions': boolean;
    'harassment/threatening': boolean;
    violence: boolean;
  };
  category_scores: {
    sexual: number;
    hate: number;
    harassment: number;
    'self-harm': number;
    'sexual/minors': number;
    'hate/threatening': number;
    'violence/graphic': number;
    'self-harm/intent': number;
    'self-harm/instructions': number;
    'harassment/threatening': number;
    violence: number;
  };
}

export class ModerationService {
  // ============================================
  // MODERATE TEXT CONTENT
  // ============================================

  static async moderateText(content: string): Promise<{
    allowed: boolean;
    flagged: boolean;
    categories: string[];
    reason?: string;
  }> {
    try {
      // Skip moderation if OpenAI API key is not configured
      if (!process.env.OPENAI_API_KEY) {
        logger.warn('OpenAI API key not configured, skipping moderation');
        return {
          allowed: true,
          flagged: false,
          categories: [],
        };
      }

      const moderation = await openai.moderations.create({
        input: content,
      });

      const result = moderation.results[0] as ModerationResult;

      if (result.flagged) {
        // Get flagged categories
        const flaggedCategories = Object.keys(result.categories)
          .filter((key) => result.categories[key as keyof typeof result.categories]);

        logger.warn('Content flagged by moderation:', {
          content: content.substring(0, 100),
          categories: flaggedCategories,
        });

        // Determine if content should be blocked
        const criticalCategories = [
          'sexual/minors',
          'hate/threatening',
          'violence/graphic',
          'harassment/threatening',
        ];

        const hasCriticalFlags = flaggedCategories.some((cat) =>
          criticalCategories.includes(cat)
        );

        return {
          allowed: !hasCriticalFlags,
          flagged: true,
          categories: flaggedCategories,
          reason: hasCriticalFlags
            ? 'Content violates community guidelines'
            : 'Content flagged for review',
        };
      }

      return {
        allowed: true,
        flagged: false,
        categories: [],
      };
    } catch (error) {
      logger.error('Error moderating content:', error);
      // Allow content on error to avoid blocking legitimate messages
      return {
        allowed: true,
        flagged: false,
        categories: [],
      };
    }
  }

  // ============================================
  // LOG MODERATED MESSAGE
  // ============================================

  static async logModeratedMessage(
    messageId: string,
    moderationResult: {
      flagged: boolean;
      categories: string[];
      reason?: string;
    }
  ) {
    try {
      await MessageModel.findByIdAndUpdate(messageId, {
        moderationStatus: moderationResult.flagged ? 'REJECTED' : 'APPROVED',
        moderationFlags: moderationResult.categories,
      });

      if (moderationResult.flagged) {
        logger.info(`Message ${messageId} flagged:`, moderationResult);
      }
    } catch (error) {
      logger.error('Error logging moderated message:', error);
    }
  }

  // ============================================
  // GET FLAGGED CONTENT (FOR ADMIN REVIEW)
  // ============================================

  static async getFlaggedContent(limit: number = 50, skip: number = 0) {
    try {
      const flaggedMessages = await MessageModel.find({
        moderationStatus: 'REJECTED',
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      return flaggedMessages;
    } catch (error) {
      logger.error('Error getting flagged content:', error);
      throw error;
    }
  }

  // ============================================
  // APPROVE/REJECT MANUAL REVIEW
  // ============================================

  static async manualReview(
    messageId: string,
    decision: 'APPROVED' | 'REJECTED'
  ) {
    try {
      await MessageModel.findByIdAndUpdate(messageId, {
        moderationStatus: decision,
      });

      logger.info(`Message ${messageId} manually reviewed: ${decision}`);
    } catch (error) {
      logger.error('Error in manual review:', error);
      throw error;
    }
  }
}
