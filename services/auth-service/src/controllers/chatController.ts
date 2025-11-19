import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chatService';

export class ChatController {
  // ============================================
  // GET CHAT
  // ============================================

  static async getChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const userId = (req as any).user.userId;

      const chat = await ChatService.getChatById(chatId, userId);

      res.json(chat);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET CHAT MESSAGES
  // ============================================

  static async getChatMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const userId = (req as any).user.userId;
      const { limit, before } = req.query;

      const messages = await ChatService.getChatMessages(
        chatId,
        userId,
        limit ? parseInt(limit as string) : 50,
        before ? new Date(before as string) : undefined
      );

      res.json({ messages });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // SEND MESSAGE
  // ============================================

  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const userId = (req as any).user.userId;
      const { content, type = 'TEXT' } = req.body;

      const message = await ChatService.sendMessage(chatId, userId, content, type);

      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // EXTEND CHAT TIME
  // ============================================

  static async extendChatTime(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const userId = (req as any).user.userId;
      const { minutes = 10 } = req.body;

      const result = await ChatService.extendChatTime(chatId, userId, minutes);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // REQUEST MATCH
  // ============================================

  static async requestMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const userId = (req as any).user.userId;

      const result = await ChatService.requestMatch(chatId, userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // RESPOND TO MATCH REQUEST
  // ============================================

  static async respondToMatchRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { chatId } = req.params;
      const userId = (req as any).user.userId;
      const { accept } = req.body;

      const result = await ChatService.respondToMatchRequest(chatId, userId, accept);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET USER'S ACTIVE CHATS
  // ============================================

  static async getUserActiveChats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;

      const chats = await ChatService.getUserActiveChats(userId);

      res.json({ chats });
    } catch (error) {
      next(error);
    }
  }
}
