import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class UserService {
  // ============================================
  // GET CURRENT USER
  // ============================================

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      isPremium: user.isPremium,
      isVerified: user.isVerified,
      credits: user.credits,
      trustScore: user.trustScore,
      createdAt: user.createdAt,
      lastActive: user.lastActive,
      hasProfile: !!user.profile
    };
  }

  // ============================================
  // UPDATE USER
  // ============================================

  static async updateUser(userId: string, data: { email?: string }) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // If updating email, check if new email is taken
    if (data.email && data.email !== user.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      });

      if (emailTaken) {
        throw new AppError('Email already in use', 409);
      }

      // If email changes, mark as unverified
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          email: data.email.toLowerCase(),
          isVerified: false
        }
      });

      logger.info(`User email updated: ${userId}`);

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        isPremium: updatedUser.isPremium,
        isVerified: updatedUser.isVerified,
        credits: updatedUser.credits,
        message: 'Email updated. Please verify your new email address.'
      };
    }

    return this.getCurrentUser(userId);
  }

  // ============================================
  // DELETE USER (GDPR)
  // ============================================

  static async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete user (cascade will delete profile, chats, etc.)
    await prisma.user.delete({
      where: { id: userId }
    });

    logger.info(`User deleted: ${userId}`);

    return {
      message: 'Account deleted successfully'
    };
  }

  // ============================================
  // GET USER STATS
  // ============================================

  static async getUserStats(userId: string) {
    const [
      totalChats,
      activeMatches,
      totalMatches
    ] = await Promise.all([
      prisma.chat.count({
        where: {
          OR: [
            { userAId: userId },
            { userBId: userId }
          ]
        }
      }),
      prisma.match.count({
        where: {
          OR: [
            { userAId: userId },
            { userBId: userId }
          ],
          status: 'ACTIVE'
        }
      }),
      prisma.match.count({
        where: {
          OR: [
            { userAId: userId },
            { userBId: userId }
          ]
        }
      })
    ]);

    return {
      totalChats,
      activeMatches,
      totalMatches
    };
  }
}
