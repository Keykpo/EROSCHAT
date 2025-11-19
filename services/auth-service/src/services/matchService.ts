import { PrismaClient } from '@prisma/client';
import ChatModel from '../models/Chat';
import MessageModel from '../models/Message';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class MatchService {
  // ============================================
  // GET USER MATCHES
  // ============================================

  static async getUserMatches(userId: string) {
    try {
      // Get all matches from PostgreSQL
      const matches = await prisma.match.findMany({
        where: {
          OR: [{ userAId: userId }, { userBId: userId }],
        },
        include: {
          userA: {
            include: {
              profile: true,
            },
          },
          userB: {
            include: {
              profile: true,
            },
          },
          chat: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Get last message for each match
      const matchesWithMessages = await Promise.all(
        matches.map(async (match) => {
          const otherUser = match.userAId === userId ? match.userB : match.userA;
          const otherProfile = match.userAId === userId ? match.userB.profile : match.userA.profile;

          // Get last message from MongoDB
          const lastMessage = await MessageModel.findOne({
            chatId: match.chatId,
          })
            .sort({ createdAt: -1 })
            .limit(1);

          // Get unread count
          const unreadCount = await MessageModel.countDocuments({
            chatId: match.chatId,
            senderId: { $ne: userId },
            readBy: { $ne: userId },
          });

          return {
            id: match.id,
            chatId: match.chatId,
            matchedAt: match.createdAt,
            otherUser: {
              id: otherUser.id,
              email: otherUser.email,
              isPremium: otherUser.isPremium,
            },
            profile: otherProfile
              ? {
                  username: otherProfile.username,
                  gender: otherProfile.gender,
                  age: this.calculateAge(otherUser.dateOfBirth),
                  city: otherProfile.city,
                  bio: otherProfile.bio,
                  photos: otherProfile.photos,
                  interests: otherProfile.interests,
                  lookingFor: otherProfile.lookingFor,
                }
              : null,
            lastMessage: lastMessage
              ? {
                  content: lastMessage.content,
                  senderId: lastMessage.senderId,
                  createdAt: lastMessage.createdAt,
                }
              : null,
            unreadCount,
          };
        })
      );

      return matchesWithMessages;
    } catch (error) {
      logger.error('Error getting user matches:', error);
      throw new AppError('Failed to get matches', 500);
    }
  }

  // ============================================
  // GET MATCH BY ID
  // ============================================

  static async getMatchById(matchId: string, userId: string) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          userA: {
            include: {
              profile: true,
            },
          },
          userB: {
            include: {
              profile: true,
            },
          },
          chat: true,
        },
      });

      if (!match) {
        throw new AppError('Match not found', 404);
      }

      // Verify user is part of the match
      if (match.userAId !== userId && match.userBId !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      const otherUser = match.userAId === userId ? match.userB : match.userA;
      const otherProfile = match.userAId === userId ? match.userB.profile : match.userA.profile;

      return {
        id: match.id,
        chatId: match.chatId,
        matchedAt: match.createdAt,
        otherUser: {
          id: otherUser.id,
          email: otherUser.email,
          isPremium: otherUser.isPremium,
        },
        profile: otherProfile
          ? {
              username: otherProfile.username,
              gender: otherProfile.gender,
              age: this.calculateAge(otherUser.dateOfBirth),
              city: otherProfile.city,
              region: otherProfile.region,
              bio: otherProfile.bio,
              photos: otherProfile.photos,
              interests: otherProfile.interests,
              lookingFor: otherProfile.lookingFor,
            }
          : null,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error getting match:', error);
      throw new AppError('Failed to get match', 500);
    }
  }

  // ============================================
  // UNMATCH
  // ============================================

  static async unmatch(matchId: string, userId: string) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        throw new AppError('Match not found', 404);
      }

      // Verify user is part of the match
      if (match.userAId !== userId && match.userBId !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      const otherUserId = match.userAId === userId ? match.userBId : match.userAId;

      // Delete the match
      await prisma.match.delete({
        where: { id: matchId },
      });

      // Create block record to prevent future matching
      await prisma.block.create({
        data: {
          blockerId: userId,
          blockedId: otherUserId,
          reason: 'UNMATCH',
        },
      });

      // Update chat status to ENDED
      await prisma.chat.update({
        where: { id: match.chatId },
        data: { status: 'ENDED' },
      });

      // Update MongoDB chat
      await ChatModel.findOneAndUpdate(
        { chatId: match.chatId },
        { status: 'ENDED' }
      );

      logger.info(`User ${userId} unmatched with ${otherUserId}`);

      return {
        success: true,
        message: 'Unmatch successful',
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error unmatching:', error);
      throw new AppError('Failed to unmatch', 500);
    }
  }

  // ============================================
  // GET MATCH STATS
  // ============================================

  static async getMatchStats(userId: string) {
    try {
      const totalMatches = await prisma.match.count({
        where: {
          OR: [{ userAId: userId }, { userBId: userId }],
        },
      });

      const totalChats = await prisma.chat.count({
        where: {
          OR: [{ userAId: userId }, { userBId: userId }],
          status: { in: ['ENDED', 'MATCHED'] },
        },
      });

      return {
        totalMatches,
        totalChats,
        matchRate: totalChats > 0 ? (totalMatches / totalChats) * 100 : 0,
      };
    } catch (error) {
      logger.error('Error getting match stats:', error);
      throw new AppError('Failed to get match stats', 500);
    }
  }

  // ============================================
  // HELPER: Calculate Age
  // ============================================

  private static calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
