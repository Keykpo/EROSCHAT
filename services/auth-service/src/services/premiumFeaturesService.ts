import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Premium limits configuration
const LIMITS = {
  FREE: {
    DAILY_CHATS: 5,
    MONTHLY_MATCHES: 10,
    PHOTO_UPLOADS: 3,
    SUPER_LIKES_PER_DAY: 0,
  },
  PREMIUM: {
    DAILY_CHATS: -1, // -1 means unlimited
    MONTHLY_MATCHES: -1,
    PHOTO_UPLOADS: 6,
    SUPER_LIKES_PER_DAY: 5,
  },
};

export class PremiumFeaturesService {
  /**
   * Check if user can start a new chat
   */
  static async canStartNewChat(userId: string, isPremium: boolean): Promise<boolean> {
    if (isPremium) {
      return true; // Premium users have unlimited chats
    }

    // Check how many chats the user has started today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const chatCount = await prisma.chat.count({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
        createdAt: {
          gte: today,
        },
      },
    });

    return chatCount < LIMITS.FREE.DAILY_CHATS;
  }

  /**
   * Check if user can make new matches this month
   */
  static async canMakeNewMatch(userId: string, isPremium: boolean): Promise<boolean> {
    if (isPremium) {
      return true; // Premium users have unlimited matches
    }

    // Check matches this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const matchCount = await prisma.match.count({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
        matchedAt: {
          gte: startOfMonth,
        },
      },
    });

    return matchCount < LIMITS.FREE.MONTHLY_MATCHES;
  }

  /**
   * Get user's remaining daily chat limit
   */
  static async getRemainingDailyChats(userId: string, isPremium: boolean): Promise<number> {
    if (isPremium) {
      return -1; // Unlimited
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const chatCount = await prisma.chat.count({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
        createdAt: {
          gte: today,
        },
      },
    });

    return Math.max(0, LIMITS.FREE.DAILY_CHATS - chatCount);
  }

  /**
   * Get user's remaining monthly matches
   */
  static async getRemainingMonthlyMatches(userId: string, isPremium: boolean): Promise<number> {
    if (isPremium) {
      return -1; // Unlimited
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const matchCount = await prisma.match.count({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
        matchedAt: {
          gte: startOfMonth,
        },
      },
    });

    return Math.max(0, LIMITS.FREE.MONTHLY_MATCHES - matchCount);
  }

  /**
   * Get max photo uploads for user
   */
  static getMaxPhotoUploads(isPremium: boolean): number {
    return isPremium ? LIMITS.PREMIUM.PHOTO_UPLOADS : LIMITS.FREE.PHOTO_UPLOADS;
  }

  /**
   * Get super likes per day for user
   */
  static getSuperLikesPerDay(isPremium: boolean): number {
    return isPremium ? LIMITS.PREMIUM.SUPER_LIKES_PER_DAY : LIMITS.FREE.SUPER_LIKES_PER_DAY;
  }

  /**
   * Get all user limits
   */
  static async getUserLimits(userId: string, isPremium: boolean) {
    const [remainingDailyChats, remainingMonthlyMatches] = await Promise.all([
      this.getRemainingDailyChats(userId, isPremium),
      this.getRemainingMonthlyMatches(userId, isPremium),
    ]);

    return {
      isPremium,
      dailyChats: {
        limit: isPremium ? -1 : LIMITS.FREE.DAILY_CHATS,
        remaining: remainingDailyChats,
      },
      monthlyMatches: {
        limit: isPremium ? -1 : LIMITS.FREE.MONTHLY_MATCHES,
        remaining: remainingMonthlyMatches,
      },
      photoUploads: {
        limit: this.getMaxPhotoUploads(isPremium),
      },
      superLikes: {
        perDay: this.getSuperLikesPerDay(isPremium),
      },
    };
  }

  /**
   * Enforce chat limit (throws error if limit reached)
   */
  static async enforceChatLimit(userId: string, isPremium: boolean): Promise<void> {
    const canStart = await this.canStartNewChat(userId, isPremium);

    if (!canStart) {
      const remaining = await this.getRemainingDailyChats(userId, isPremium);
      throw new AppError(
        `Daily chat limit reached. Upgrade to Premium for unlimited chats. ${remaining} chats remaining today.`,
        403,
        'CHAT_LIMIT_REACHED'
      );
    }
  }

  /**
   * Enforce match limit (throws error if limit reached)
   */
  static async enforceMatchLimit(userId: string, isPremium: boolean): Promise<void> {
    const canMatch = await this.canMakeNewMatch(userId, isPremium);

    if (!canMatch) {
      const remaining = await this.getRemainingMonthlyMatches(userId, isPremium);
      throw new AppError(
        `Monthly match limit reached. Upgrade to Premium for unlimited matches. ${remaining} matches remaining this month.`,
        403,
        'MATCH_LIMIT_REACHED'
      );
    }
  }
}

export default PremiumFeaturesService;
