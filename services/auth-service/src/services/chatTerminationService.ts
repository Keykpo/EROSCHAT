import { PrismaClient } from '@prisma/client';
import ChatModel from '../models/Chat';
import { logger } from '../utils/logger';
import { getWebSocketService } from './websocketService';

const prisma = new PrismaClient();

export class ChatTerminationService {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 60 * 1000; // Check every minute

  // ============================================
  // START MONITORING
  // ============================================

  public start() {
    if (this.intervalId) {
      logger.warn('Chat termination service already running');
      return;
    }

    logger.info('🕐 Starting chat termination service...');

    // Run immediately
    this.checkAndTerminateExpiredChats();

    // Then run every minute
    this.intervalId = setInterval(() => {
      this.checkAndTerminateExpiredChats();
    }, this.CHECK_INTERVAL_MS);
  }

  // ============================================
  // STOP MONITORING
  // ============================================

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info('Chat termination service stopped');
    }
  }

  // ============================================
  // CHECK AND TERMINATE EXPIRED CHATS
  // ============================================

  private async checkAndTerminateExpiredChats() {
    try {
      const now = new Date();

      // Find all active chats that have expired
      const expiredChats = await prisma.chat.findMany({
        where: {
          status: 'ACTIVE',
          endsAt: {
            lte: now,
          },
        },
      });

      if (expiredChats.length === 0) {
        return; // No expired chats
      }

      logger.info(`Found ${expiredChats.length} expired chats to terminate`);

      for (const chat of expiredChats) {
        try {
          await this.terminateChat(chat.id, chat.userAId, chat.userBId);
        } catch (error) {
          logger.error(`Error terminating chat ${chat.id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Error checking for expired chats:', error);
    }
  }

  // ============================================
  // TERMINATE CHAT
  // ============================================

  private async terminateChat(chatId: string, userAId: string, userBId: string) {
    try {
      // Update PostgreSQL
      await prisma.chat.update({
        where: { id: chatId },
        data: { status: 'ENDED' },
      });

      // Update MongoDB
      await ChatModel.findOneAndUpdate(
        { chatId },
        { status: 'ENDED' }
      );

      logger.info(`Chat ${chatId} auto-terminated`);

      // Notify both users via WebSocket
      try {
        const ws = getWebSocketService();
        const io = ws.getIO();

        io.to(chatId).emit('chat:ended', {
          chatId,
          reason: 'TIME_EXPIRED',
          message: 'El chat ha terminado. El tiempo se agotó.',
        });
      } catch (error) {
        logger.error('Error sending chat ended notification:', error);
      }
    } catch (error) {
      logger.error(`Failed to terminate chat ${chatId}:`, error);
      throw error;
    }
  }
}

// Singleton instance
let chatTerminationService: ChatTerminationService | null = null;

export const initializeChatTerminationService = (): ChatTerminationService => {
  if (!chatTerminationService) {
    chatTerminationService = new ChatTerminationService();
    chatTerminationService.start();
    logger.info('✅ Chat termination service initialized');
  }
  return chatTerminationService;
};

export const getChatTerminationService = (): ChatTerminationService => {
  if (!chatTerminationService) {
    throw new Error('Chat termination service not initialized');
  }
  return chatTerminationService;
};
