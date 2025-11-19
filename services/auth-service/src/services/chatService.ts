import { PrismaClient } from '@prisma/client';
import ChatModel from '../models/Chat';
import MessageModel from '../models/Message';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { getWebSocketService } from './websocketService';

const prisma = new PrismaClient();

export class ChatService {
  // ============================================
  // GET CHAT BY ID
  // ============================================

  static async getChatById(chatId: string, userId: string) {
    try {
      // Get chat from PostgreSQL
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      // Verify user is part of the chat
      if (chat.userAId !== userId && chat.userBId !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Get or create MongoDB chat document
      let mongoChat = await ChatModel.findOne({ chatId });

      if (!mongoChat) {
        mongoChat = await ChatModel.create({
          chatId: chat.id,
          userAId: chat.userAId,
          userBId: chat.userBId,
          status: chat.status,
          endsAt: chat.endsAt,
        });
      }

      // Get the other user's ID
      const otherUserId = chat.userAId === userId ? chat.userBId : chat.userAId;

      return {
        id: chat.id,
        status: chat.status,
        createdAt: chat.createdAt,
        endsAt: chat.endsAt,
        otherUserId,
        matchStatus: mongoChat.matchStatus,
        matchRequestedBy: mongoChat.matchRequestedBy,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error getting chat:', error);
      throw new AppError('Failed to get chat', 500);
    }
  }

  // ============================================
  // GET CHAT MESSAGES
  // ============================================

  static async getChatMessages(
    chatId: string,
    userId: string,
    limit: number = 50,
    before?: Date
  ) {
    try {
      // Verify user is part of the chat
      const chat = await this.getChatById(chatId, userId);

      // Build query
      const query: any = { chatId };
      if (before) {
        query.createdAt = { $lt: before };
      }

      // Get messages from MongoDB
      const messages = await MessageModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit);

      // Mark messages as read
      await MessageModel.updateMany(
        {
          chatId,
          senderId: { $ne: userId },
          readBy: { $ne: userId },
        },
        {
          $addToSet: { readBy: userId },
        }
      );

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error getting chat messages:', error);
      throw new AppError('Failed to get messages', 500);
    }
  }

  // ============================================
  // SEND MESSAGE
  // ============================================

  static async sendMessage(
    chatId: string,
    userId: string,
    content: string,
    type: 'TEXT' | 'IMAGE' | 'SYSTEM' = 'TEXT'
  ) {
    try {
      // Verify user is part of the chat and chat is active
      const chat = await this.getChatById(chatId, userId);

      if (chat.status !== 'ACTIVE' && chat.status !== 'MATCHED') {
        throw new AppError('Chat is not active', 400);
      }

      // Check if chat has ended
      if (new Date() > new Date(chat.endsAt)) {
        throw new AppError('Chat has ended', 400);
      }

      // Validate content
      if (!content || content.trim().length === 0) {
        throw new AppError('Message content is required', 400);
      }

      if (content.length > 1000) {
        throw new AppError('Message is too long (max 1000 characters)', 400);
      }

      // Create message in MongoDB
      const message = await MessageModel.create({
        chatId,
        senderId: userId,
        content: content.trim(),
        type,
        readBy: [userId], // Sender has read it by default
      });

      // Update last message time in MongoDB chat
      await ChatModel.findOneAndUpdate(
        { chatId },
        { lastMessageAt: new Date() }
      );

      // Send real-time notification via WebSocket
      try {
        const ws = getWebSocketService();
        ws.notifyNewMessage(chat.otherUserId, chatId, {
          id: message._id,
          senderId: userId,
          content: message.content,
          type: message.type,
          createdAt: message.createdAt,
        });
      } catch (error) {
        logger.error('Error sending WebSocket notification:', error);
        // Continue even if WebSocket fails
      }

      logger.info(`Message sent in chat ${chatId} by user ${userId}`);

      return {
        id: message._id,
        chatId: message.chatId,
        senderId: message.senderId,
        content: message.content,
        type: message.type,
        createdAt: message.createdAt,
        readBy: message.readBy,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error sending message:', error);
      throw new AppError('Failed to send message', 500);
    }
  }

  // ============================================
  // EXTEND CHAT TIME
  // ============================================

  static async extendChatTime(chatId: string, userId: string, minutes: number = 10) {
    try {
      // Verify user is part of the chat
      await this.getChatById(chatId, userId);

      // Get chat from PostgreSQL
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        throw new AppError('Chat not found', 404);
      }

      if (chat.status !== 'ACTIVE') {
        throw new AppError('Can only extend active chats', 400);
      }

      // Update endsAt time
      const newEndsAt = new Date(chat.endsAt.getTime() + minutes * 60 * 1000);

      await prisma.chat.update({
        where: { id: chatId },
        data: { endsAt: newEndsAt },
      });

      // Update MongoDB chat
      await ChatModel.findOneAndUpdate(
        { chatId },
        {
          endsAt: newEndsAt,
          $inc: { extendedCount: 1 },
        }
      );

      logger.info(`Chat ${chatId} extended by ${minutes} minutes`);

      return {
        success: true,
        newEndsAt,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error extending chat time:', error);
      throw new AppError('Failed to extend chat time', 500);
    }
  }

  // ============================================
  // REQUEST MATCH
  // ============================================

  static async requestMatch(chatId: string, userId: string) {
    try {
      // Verify user is part of the chat
      const chat = await this.getChatById(chatId, userId);

      if (chat.status !== 'ACTIVE') {
        throw new AppError('Chat must be active to request match', 400);
      }

      // Update MongoDB chat
      await ChatModel.findOneAndUpdate(
        { chatId },
        {
          matchRequestedBy: userId,
          matchStatus: 'PENDING',
        }
      );

      // Send notification to other user via WebSocket
      try {
        const ws = getWebSocketService();
        ws.getIO().to(chat.otherUserId).emit('match-request', {
          chatId,
          requestedBy: userId,
        });
      } catch (error) {
        logger.error('Error sending match request notification:', error);
      }

      logger.info(`Match requested in chat ${chatId} by user ${userId}`);

      return {
        success: true,
        matchStatus: 'PENDING',
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error requesting match:', error);
      throw new AppError('Failed to request match', 500);
    }
  }

  // ============================================
  // RESPOND TO MATCH REQUEST
  // ============================================

  static async respondToMatchRequest(
    chatId: string,
    userId: string,
    accept: boolean
  ) {
    try {
      // Verify user is part of the chat
      const chat = await this.getChatById(chatId, userId);

      const mongoChat = await ChatModel.findOne({ chatId });

      if (!mongoChat || mongoChat.matchStatus !== 'PENDING') {
        throw new AppError('No pending match request', 400);
      }

      if (mongoChat.matchRequestedBy === userId) {
        throw new AppError('Cannot respond to your own match request', 400);
      }

      if (accept) {
        // Accept match - update both PostgreSQL and MongoDB
        await prisma.chat.update({
          where: { id: chatId },
          data: { status: 'MATCHED' },
        });

        await ChatModel.findOneAndUpdate(
          { chatId },
          {
            status: 'MATCHED',
            matchStatus: 'ACCEPTED',
          }
        );

        // Create Match record in PostgreSQL
        await prisma.match.create({
          data: {
            userAId: chat.otherUserId,
            userBId: userId,
            chatId: chatId,
          },
        });

        // Get both user profiles
        const profileA = await prisma.profile.findUnique({
          where: { userId: chat.otherUserId },
        });

        const profileB = await prisma.profile.findUnique({
          where: { userId },
        });

        // Notify both users via WebSocket
        try {
          const ws = getWebSocketService();
          ws.notifyMatchRevealed(chat.otherUserId, chatId, profileB);
          ws.notifyMatchRevealed(userId, chatId, profileA);
        } catch (error) {
          logger.error('Error sending match revealed notification:', error);
        }

        logger.info(`Match accepted in chat ${chatId}`);

        return {
          success: true,
          matched: true,
          revealedProfile: profileA,
        };
      } else {
        // Reject match
        await ChatModel.findOneAndUpdate(
          { chatId },
          {
            matchStatus: 'REJECTED',
          }
        );

        logger.info(`Match rejected in chat ${chatId}`);

        return {
          success: true,
          matched: false,
        };
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error responding to match request:', error);
      throw new AppError('Failed to respond to match request', 500);
    }
  }

  // ============================================
  // GET USER'S ACTIVE CHATS
  // ============================================

  static async getUserActiveChats(userId: string) {
    try {
      const chats = await prisma.chat.findMany({
        where: {
          OR: [{ userAId: userId }, { userBId: userId }],
          status: { in: ['ACTIVE', 'MATCHED'] },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get MongoDB data for each chat
      const chatsWithMessages = await Promise.all(
        chats.map(async (chat) => {
          const mongoChat = await ChatModel.findOne({ chatId: chat.id });
          const lastMessage = await MessageModel.findOne({ chatId: chat.id })
            .sort({ createdAt: -1 })
            .limit(1);

          return {
            id: chat.id,
            status: chat.status,
            createdAt: chat.createdAt,
            endsAt: chat.endsAt,
            otherUserId: chat.userAId === userId ? chat.userBId : chat.userAId,
            lastMessage: lastMessage
              ? {
                  content: lastMessage.content,
                  createdAt: lastMessage.createdAt,
                  senderId: lastMessage.senderId,
                }
              : null,
            matchStatus: mongoChat?.matchStatus,
          };
        })
      );

      return chatsWithMessages;
    } catch (error) {
      logger.error('Error getting user active chats:', error);
      throw new AppError('Failed to get active chats', 500);
    }
  }

  // ============================================
  // END CHAT
  // ============================================

  static async endChat(chatId: string) {
    try {
      await prisma.chat.update({
        where: { id: chatId },
        data: { status: 'ENDED' },
      });

      await ChatModel.findOneAndUpdate(
        { chatId },
        { status: 'ENDED' }
      );

      logger.info(`Chat ${chatId} ended`);

      return { success: true };
    } catch (error) {
      logger.error('Error ending chat:', error);
      throw new AppError('Failed to end chat', 500);
    }
  }
}
