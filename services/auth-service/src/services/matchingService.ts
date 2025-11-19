import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

const MATCHING_SERVICE_URL =
  process.env.MATCHING_SERVICE_URL || 'http://localhost:8000';

interface MatchRequest {
  user_id: string;
  gender: string;
  interested_in: string[];
  age: number;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  min_age: number;
  max_age: number;
  max_distance: number;
  interests: string[];
  past_chat_partners: string[];
}

export class MatchingService {
  // ============================================
  // JOIN MATCHING QUEUE
  // ============================================

  static async joinQueue(userId: string) {
    try {
      // Get user profile
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      // Get user data
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Calculate age from date of birth
      const age = this.calculateAge(user.dateOfBirth);

      // Get past chat partners
      const pastChats = await prisma.chat.findMany({
        where: {
          OR: [{ userAId: userId }, { userBId: userId }],
        },
        select: {
          userAId: true,
          userBId: true,
        },
      });

      const pastChatPartners = pastChats.map((chat) =>
        chat.userAId === userId ? chat.userBId : chat.userAId
      );

      // Prepare match request
      const matchRequest: MatchRequest = {
        user_id: userId,
        gender: profile.gender,
        interested_in: profile.interestedIn,
        age,
        city: profile.city || undefined,
        region: profile.region || undefined,
        latitude: profile.latitude || undefined,
        longitude: profile.longitude || undefined,
        min_age: profile.minAge,
        max_age: profile.maxAge,
        max_distance: profile.maxDistance,
        interests: profile.interests,
        past_chat_partners: pastChatPartners,
      };

      // Call matching service
      const response = await axios.post(
        `${MATCHING_SERVICE_URL}/match/find`,
        { user: matchRequest },
        { timeout: 10000 }
      );

      const data = response.data;

      if (data.success && data.match) {
        // Match found! Create chat
        const chat = await this.createChat(userId, data.match.user_id);

        logger.info(`Match found for user ${userId} with ${data.match.user_id}`);

        return {
          matchFound: true,
          chatId: chat.id,
          matchedUserId: data.match.user_id,
          compatibilityScore: data.match.compatibility_score,
        };
      } else {
        // No match, user is in queue
        logger.info(`User ${userId} added to matching queue`);

        return {
          matchFound: false,
          inQueue: true,
          estimatedWaitTime: data.estimated_wait_time,
          message: data.message,
        };
      }
    } catch (error: any) {
      if (error.response) {
        logger.error('Matching service error:', error.response.data);
        throw new AppError(
          error.response.data.detail || 'Matching service error',
          error.response.status
        );
      }

      logger.error('Error joining matching queue:', error);
      throw new AppError('Failed to join matching queue', 500);
    }
  }

  // ============================================
  // LEAVE MATCHING QUEUE
  // ============================================

  static async leaveQueue(userId: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      await axios.post(
        `${MATCHING_SERVICE_URL}/queue/leave`,
        null,
        {
          params: {
            user_id: userId,
            gender: profile.gender,
          },
        }
      );

      logger.info(`User ${userId} left matching queue`);

      return {
        success: true,
        message: 'Left matching queue',
      };
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // User not in queue, that's ok
        return {
          success: true,
          message: 'Not in queue',
        };
      }

      logger.error('Error leaving matching queue:', error);
      throw new AppError('Failed to leave matching queue', 500);
    }
  }

  // ============================================
  // GET QUEUE STATUS
  // ============================================

  static async getQueueStatus(userId: string) {
    try {
      const response = await axios.get(
        `${MATCHING_SERVICE_URL}/queue/status/${userId}`
      );

      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return {
          inQueue: false,
        };
      }

      logger.error('Error getting queue status:', error);
      throw new AppError('Failed to get queue status', 500);
    }
  }

  // ============================================
  // CREATE CHAT
  // ============================================

  private static async createChat(userAId: string, userBId: string) {
    // Calculate end time (20 minutes from now)
    const endsAt = new Date(Date.now() + 20 * 60 * 1000);

    const chat = await prisma.chat.create({
      data: {
        userAId,
        userBId,
        status: 'ACTIVE',
        endsAt,
      },
    });

    return chat;
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
